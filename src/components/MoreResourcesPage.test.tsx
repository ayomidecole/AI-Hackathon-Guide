import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MoreResourcesPage } from './MoreResourcesPage';
import { getYouTubeEmbedUrl } from '../content/moreResources';

function stubMatchMedia(isMobile = false) {
    return vi.fn().mockImplementation((query: string) => ({
        matches: query === '(max-width: 849px)' ? isMobile : false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    }));
}

describe('MoreResourcesPage', () => {
    beforeEach(() => {
        vi.stubGlobal('matchMedia', stubMatchMedia(false));
        window.history.pushState({}, '', '/');
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('renders the initial resource links', () => {
        render(<MoreResourcesPage />);
        expect(
            screen.getAllByRole('link', { name: /Cursor visual editor/i })
                .length,
        ).toBeGreaterThan(0);
        expect(
            screen.getAllByRole('link', {
                name: /Claude agent tips explained/i,
            }).length,
        ).toBeGreaterThan(0);
    });

    it('shows and hides floating preview modal on hover', async () => {
        const user = userEvent.setup();
        render(<MoreResourcesPage />);

        expect(
            screen.queryByLabelText(/Preview Claude agent tips explained/i),
        ).not.toBeInTheDocument();

        const targetLink = screen.getByRole('link', {
            name: /Claude agent tips explained/i,
        });
        await user.hover(targetLink);

        expect(
            screen.getByLabelText(/Preview Claude agent tips explained/i),
        ).toBeInTheDocument();

        const iframe = screen.getByTitle(
            /Preview Claude agent tips explained/i,
        );
        expect(iframe).toHaveAttribute(
            'src',
            expect.stringContaining(
                'https://www.youtube-nocookie.com/embed/fOxC44g8vig',
            ),
        );
        expect(iframe).toHaveAttribute(
            'src',
            expect.stringContaining('start=53'),
        );

        await user.unhover(targetLink);
        await waitFor(() => {
            expect(
                screen.queryByLabelText(/Preview Claude agent tips explained/i),
            ).not.toBeInTheDocument();
        });
    });

    it('keeps modal visible while hovering the modal itself', async () => {
        const user = userEvent.setup();
        render(<MoreResourcesPage />);

        const targetLink = screen.getByRole('link', {
            name: /Cursor visual editor/i,
        });
        await user.hover(targetLink);
        const modal = screen.getByLabelText(/Preview Cursor visual editor/i);

        await user.unhover(targetLink);
        fireEvent.mouseEnter(modal);

        await new Promise((resolve) => setTimeout(resolve, 160));
        expect(
            screen.getByLabelText(/Preview Cursor visual editor/i),
        ).toBeInTheDocument();

        fireEvent.mouseLeave(modal);
        await waitFor(() => {
            expect(
                screen.queryByLabelText(/Preview Cursor visual editor/i),
            ).not.toBeInTheDocument();
        });
    });

    it('converts YouTube timestamp query to start seconds', () => {
        expect(
            getYouTubeEmbedUrl(
                'https://www.youtube.com/watch?v=fOxC44g8vig&t=53s',
            ),
        ).toContain('start=53');
    });

    it('on mobile, hover modal is not shown', async () => {
        vi.stubGlobal('matchMedia', stubMatchMedia(true));
        const user = userEvent.setup();
        render(<MoreResourcesPage />);

        const targetLink = screen.getByRole('link', {
            name: /Claude agent tips explained/i,
        });
        await user.hover(targetLink);

        expect(
            screen.queryByLabelText(/Preview Claude agent tips explained/i),
        ).not.toBeInTheDocument();

        expect(targetLink).toHaveAttribute(
            'href',
            'https://www.youtube.com/watch?v=fOxC44g8vig&t=53s',
        );
    });

    it('renders links with safe target attributes', () => {
        render(<MoreResourcesPage />);
        const openLink = screen.getByRole('link', {
            name: /Cursor visual editor/i,
        });

        expect(openLink).toHaveAttribute('target', '_blank');
        expect(openLink).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('shows preview on link focus and hides on blur', async () => {
        render(<MoreResourcesPage />);
        const link = screen.getByRole('link', {
            name: /Claude agent tips explained/i,
        });
        fireEvent.focus(link);
        expect(
            screen.getByLabelText(/Preview Claude agent tips explained/i),
        ).toBeInTheDocument();
        fireEvent.blur(link);
        await waitFor(() => {
            expect(
                screen.queryByLabelText(/Preview Claude agent tips explained/i),
            ).not.toBeInTheDocument();
        });
    });

});
