import { MessageCircle } from 'lucide-react';

interface ChatToggleProps {
    onClick: () => void;
    ariaLabel?: string;
}

export function ChatToggle({
    onClick,
    ariaLabel = 'Open AI chat',
}: ChatToggleProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="rounded-full p-2 border transition-colors hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-base)]"
            style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-subtle)',
                color: 'var(--text-secondary)',
            }}
            aria-label={ariaLabel}
        >
            <MessageCircle className="w-4 h-4" />
        </button>
    );
}
