"use client"; // Error components must be Client Components

import { useEffect } from "react";
import { logAppError } from "@/lib/errorLogger";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        logAppError("Uncaught application error", error);
    }, [error]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 flex-col px-4 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Something went wrong!</h2>
            <p className="text-gray-600 mb-6">An unexpected error occurred. We have been notified of this issue.</p>
            <button
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded shadow"
                onClick={
                    // Attempt to recover by trying to re-render the segment
                    () => reset()
                }
            >
                Try again
            </button>
        </div>
    );
}
