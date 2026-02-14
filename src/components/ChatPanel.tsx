import { useState, useRef, useEffect } from 'react';
import { X, Send, Loader2, Bot } from 'lucide-react';
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

const API_BASE = (
    (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim() || ''
).replace(/\/$/, '');
const CHAT_REQUEST_TIMEOUT_MS = 30_000;

interface ChatApiResponse {
    error?: string;
    choices?: { message?: { content?: string } }[];
}

function isAbortError(error: unknown): boolean {
    return (
        error instanceof DOMException && error.name.toLowerCase() === 'aborterror'
    );
}

function getNetworkErrorMessage(error: unknown): string {
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
        return 'You appear to be offline. Check your connection and try again.';
    }
    if (isAbortError(error)) {
        return 'The assistant request timed out. Please try again.';
    }
    return 'Unable to reach the AI assistant. If this persists, verify your API server URL and try again.';
}

function getHttpErrorMessage(status: number, body: ChatApiResponse | null): string {
    const message = body?.error?.trim();
    if (message) {
        return message;
    }
    if (status === 404) {
        return 'Chat API endpoint not found. Set VITE_API_BASE_URL if your API is hosted on another origin.';
    }
    if (status >= 500) {
        return 'Assistant service is temporarily unavailable. Please try again.';
    }
    return `Request failed (${status}).`;
}

async function parseJsonBody(
    res: Response
): Promise<{ body: ChatApiResponse | null; rawText: string }> {
    const rawText = await res.text();
    if (!rawText) {
        return { body: null, rawText };
    }
    try {
        return { body: JSON.parse(rawText) as ChatApiResponse, rawText };
    } catch {
        return { body: null, rawText };
    }
}

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
            const controller = new AbortController();
            const timeoutId = window.setTimeout(
                () => controller.abort(),
                CHAT_REQUEST_TIMEOUT_MS
            );
            const res = await fetch(`${API_BASE}/api/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: chatMessages,
                    mode: mode || undefined,
                    context: toolContext || undefined,
                }),
                signal: controller.signal,
            }).finally(() => {
                window.clearTimeout(timeoutId);
            });
            const { body: data, rawText } = await parseJsonBody(res);

            if (!res.ok) {
                setError(getHttpErrorMessage(res.status, data));
                return;
            }

            if (!data) {
                const looksLikeHtml = rawText.trimStart().startsWith('<');
                setError(
                    looksLikeHtml
                        ? 'Assistant returned an unexpected response format. Check API URL configuration.'
                        : 'Assistant returned an unreadable response. Please try again.'
                );
                return;
            }

            const content = data.choices?.[0]?.message?.content;
            if (!content) {
                setError('No response received from assistant.');
                return;
            }
            setMessages((prev) => [
                ...prev,
                { role: 'assistant', content },
            ]);
        } catch (error) {
            setError(getNetworkErrorMessage(error));
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
                className="flex flex-col w-full max-w-lg max-h-[85vh] rounded-3xl border overflow-hidden shadow-2xl chat-panel-modal"
                style={{
                    borderColor: 'var(--border-muted)',
                    boxShadow: 'var(--shadow-panel)',
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <div
                    className="flex items-center justify-between gap-3 px-5 py-4 border-b shrink-0 chat-panel-header"
                    style={{
                        borderColor: 'var(--border-subtle)',
                    }}
                >
                    <div className="flex items-center gap-3 min-w-0">
                        <div
                            className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center chat-panel-avatar"
                            style={{
                                backgroundColor: 'var(--accent-soft)',
                                borderColor: 'var(--accent-muted)',
                                borderWidth: 1,
                                borderStyle: 'solid',
                                color: 'var(--accent)',
                            }}
                        >
                            <Bot className="w-5 h-5" strokeWidth={2} />
                        </div>
                        <h3 className="font-display font-semibold text-[var(--text-primary)] truncate">
                            AI Assistant
                        </h3>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="shrink-0 rounded-full p-2.5 transition-colors hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] chat-panel-close"
                        style={{
                            color: 'var(--text-secondary)',
                        }}
                        aria-label="Close chat"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <div
                    className="flex-1 overflow-y-auto p-5 space-y-4 min-h-[200px] chat-panel-content"
                >
                    {messages.length === 0 && (
                        <div className="rounded-2xl px-5 py-4 chat-panel-welcome">
                            <p className="text-sm chat-panel-intro leading-relaxed">
                                Ask about tools, compare options, or get
                                hackathon tips.
                            </p>
                            <p className="text-sm chat-panel-intro mt-2 opacity-90">
                                Try: &quot;Compare Cursor and Replit&quot; or
                                &quot;Suggest a stack for a todo app&quot;
                            </p>
                        </div>
                    )}
                    {messages.map((m, i) => (
                        <div
                            key={i}
                            className={clsx(
                                'rounded-2xl px-4 py-3 text-sm chat-panel-message',
                                m.role === 'user'
                                    ? 'ml-10 rounded-br-md chat-panel-message-user'
                                    : 'mr-10 rounded-bl-md chat-panel-message-assistant'
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
                            className="flex items-center gap-2 rounded-2xl rounded-bl-md mr-10 px-4 py-3 text-sm chat-panel-message chat-panel-message-assistant"
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
                    className="px-5 py-4 border-t shrink-0 chat-panel-footer"
                    style={{
                        borderColor: 'var(--border-subtle)',
                    }}
                >
                    <div className="flex gap-3 items-center">
                        <textarea
                            ref={inputRef}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Type your message…"
                            rows={1}
                            disabled={loading}
                            className="flex-1 min-h-[44px] max-h-32 rounded-2xl px-4 py-3 text-sm resize-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] chat-panel-input"
                        />
                        <button
                            type="button"
                            onClick={sendMessage}
                            disabled={loading || !input.trim()}
                            className="shrink-0 rounded-full w-10 h-10 flex items-center justify-center transition-colors disabled:opacity-50 disabled:pointer-events-none theme-hover-opacity chat-panel-send"
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
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Send className="w-4 h-4" />
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
