import { useEffect, useCallback } from 'react';

export interface KeyboardShortcut {
    key: string;
    ctrlKey?: boolean;
    shiftKey?: boolean;
    altKey?: boolean;
    action: () => void;
    description: string;
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[], enabled: boolean = true) {
    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        if (!enabled) return;

        for (const shortcut of shortcuts) {
            const keyMatches = event.key.toLowerCase() === shortcut.key.toLowerCase();
            const ctrlMatches = shortcut.ctrlKey === undefined || event.ctrlKey === shortcut.ctrlKey;
            const shiftMatches = shortcut.shiftKey === undefined || event.shiftKey === shortcut.shiftKey;
            const altMatches = shortcut.altKey === undefined || event.altKey === shortcut.altKey;

            if (keyMatches && ctrlMatches && shiftMatches && altMatches) {
                event.preventDefault();
                shortcut.action();
                break;
            }
        }
    }, [shortcuts, enabled]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);
}

export const commonShortcuts = {
    save: { key: 's', ctrlKey: true, description: 'Save changes' },
    preview: { key: 'p', ctrlKey: true, description: 'Preview resume' },
    download: { key: 'd', ctrlKey: true, description: 'Download PDF' },
    undo: { key: 'z', ctrlKey: true, description: 'Undo' },
    redo: { key: 'y', ctrlKey: true, description: 'Redo' },
    help: { key: '/', ctrlKey: true, description: 'Show keyboard shortcuts' },
};
