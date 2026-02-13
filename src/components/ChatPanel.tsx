import { useState, useRef, useEffect } from 'react';
import { X, Send, Loader2 } from 'lucide-react';
import { clsx } from 'clsx';

export interface Message {
    role: 'user' | 'assistant';
    content: string;
}

interface ChatPanelProps {
    isOpen: boolean;
    onClose: () => void;
    initialInput?: string;
    mode?: 'suggest-stack';
    toolContext?: { toolId: string; toolName: string; toolDescription: string };
}

const API_BASE = '';

export function ChatPanel({
    isOpen,
    onClose,
    initialInput = '',
    mode,
    toolContext,
}: ChatPanelProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState(initialInput);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        setInput(initialInput);
    }, [initialInput]);

    useEffect(() => {
        if (isOpen) {
            inputRef.current?.focus();
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [isOpen, messages]);

    const sendMessage = async () => {
        const text = input.trim();
        if (!text || loading) return;

        setInput('');
        setMessages((prev) => [...prev, { role: 'user', content: text }]);
        setLoading(true);
        setError(null);

        const chatMessages = [
            ...messages.map((m) => ({ role: m.role, content: m.content })),
            { role: 'user' as const, content: text },
        ];

        try {
            const res = await fetch(`${API_BASE}/api/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: chatMessages,
                    mode: mode || undefined,
                    context: toolContext || undefined,
                }),
            });

            const data = (await res.json()) as {
                error?: string;
                choices?: { message?: { content?: string } }[];
            };

            if (!res.ok) {
                setError(data.error || 'Failed to get response');
                return;
            }

            const content =
                data.choices?.[0]?.message?.content || 'No response received.';
            setMessages((prev) => [
                ...prev,
                { role: 'assistant', content },
            ]);
        } catch {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6"
            style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
            onClick={onClose}
            role="dialog"
            aria-label="AI chat"
        >
            <div
                className="flex flex-col w-full max-w-lg max-h-[85vh] rounded-2xl border overflow-hidden shadow-2xl chat-panel-modal"
                style={{
                    borderColor: 'var(--border-muted)',
                    boxShadow: 'var(--shadow-panel)',
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <div
                    className="flex items-center justify-between px-4 py-3 border-b shrink-0 chat-panel-header"
                    style={{
                        borderColor: 'var(--border-subtle)',
                    }}
                >
                    <h3 className="font-display font-semibold text-[var(--text-primary)]">
                        AI Assistant
                    </h3>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-full p-2 transition-colors hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                        style={{
                            backgroundColor: 'var(--bg-card-hover)',
                            color: 'var(--text-secondary)',
                        }}
                        aria-label="Close chat"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <div
                    className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[200px] chat-panel-content"
                >
                    {messages.length === 0 && (
                        <p className="text-sm chat-panel-intro">
                            Ask about tools, compare options, or get hackathon
                            tips. Try: &quot;Compare Cursor and Replit&quot; or
                            &quot;Suggest a stack for a todo app&quot;
                        </p>
                    )}
                    {messages.map((m, i) => (
                        <div
                            key={i}
                            className={clsx(
                                'rounded-xl px-4 py-3 text-sm chat-panel-message',
                                m.role === 'user'
                                    ? 'ml-8 chat-panel-message-user'
                                    : 'mr-8 chat-panel-message-assistant'
                            )}
                            style={{
                                borderColor: 'var(--border-subtle)',
                                color: 'var(--text-primary)',
                                ...(m.role === 'assistant' && {
                                    borderWidth: 1,
                                    borderStyle: 'solid',
                                }),
                            }}
                        >
                            <span className="font-medium chat-panel-message-label text-xs block mb-1">
                                {m.role === 'user' ? 'You' : 'Assistant'}
                            </span>
                            <div className="whitespace-pre-wrap break-words">
                                {m.content}
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div
                            className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm chat-panel-message chat-panel-message-assistant"
                            style={{
                                borderColor: 'var(--border-subtle)',
                                borderWidth: 1,
                                borderStyle: 'solid',
                                color: 'var(--text-secondary)',
                            }}
                        >
                            <Loader2
                                className="w-4 h-4 animate-spin shrink-0"
                                style={{ color: 'var(--accent)' }}
                            />
                            <span>Thinking…</span>
                        </div>
                    )}
                    {error && (
                        <p
                            className="text-sm"
                            style={{ color: 'var(--accent)' }}
                        >
                            {error}
                        </p>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <div
                    className="p-4 border-t shrink-0 chat-panel-footer"
                    style={{
                        borderColor: 'var(--border-subtle)',
                    }}
                >
                    <div className="flex gap-2">
                        <textarea
                            ref={inputRef}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Type your message…"
                            rows={2}
                            disabled={loading}
                            className="flex-1 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] chat-panel-input"
                        />
                        <button
                            type="button"
                            onClick={sendMessage}
                            disabled={loading || !input.trim()}
                            className="shrink-0 rounded-xl p-3 transition-colors disabled:opacity-50 disabled:pointer-events-none theme-hover-opacity"
                            style={{
                                backgroundColor: 'var(--accent-soft)',
                                borderColor: 'var(--accent-muted)',
                                borderWidth: 1,
                                borderStyle: 'solid',
                                color: 'var(--accent)',
                            }}
                            aria-label="Send message"
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <Send className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
