import React, { useState } from 'react';
import LinkSafetyDialog from './LinkSafetyDialog';

interface Props {
    text: string;
}

/**
 * Component that takes a string and converts URLs into clickable hyperlinks.
 * URLs longer than 30 characters are truncated with an ellipsis.
 */
export default function LinkifiedText({ text }: Props) {
    const [selectedUrl, setSelectedUrl] = useState<string | null>(null);

    if (!text) return null;

    // Regex to find URLs starting with http:// or https://
    // Capturing group ensures the URL is kept in the split array
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);

    return (
        <>
            {parts.map((part, i) => {
                if (part.match(urlRegex)) {
                    return (
                        <button
                            key={i}
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setSelectedUrl(part);
                            }}
                            style={{
                                background: 'none',
                                border: 'none',
                                padding: 0,
                                font: 'inherit',
                                cursor: 'pointer',
                                color: '#10b981',
                                textDecoration: 'underline',
                                fontWeight: 600,
                                textAlign: 'left'
                            }}
                        >
                            {part.length > 30 ? `${part.substring(0, 30)}...${part.slice(-4)}` : part}
                        </button>
                    );
                }
                return part;
            })}

            {selectedUrl && (
                <LinkSafetyDialog
                    open={!!selectedUrl}
                    onClose={() => setSelectedUrl(null)}
                    url={selectedUrl}
                />
            )}
        </>
    );
}
