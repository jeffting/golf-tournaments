import { app } from "./firebase";
import { logEvent, getAnalytics, isSupported } from "firebase/analytics";

/**
 * Logs an error both to the console and to Firebase Analytics.
 * @param message A descriptive message about what failed.
 * @param error The actual error object or string.
 * @param context Additional contextual information to track.
 */
export function logAppError(message: string, error?: any, context?: Record<string, any>) {
    // 1. Log to local console for development/debug
    if (error) {
        console.error(`[AppError] ${message}`, error, context || "");
    } else {
        console.error(`[AppError] ${message}`, context || "");
    }

    // 2. Send to Firebase Analytics if available
    try {
        if (typeof window !== "undefined") {
            isSupported().then((supported) => {
                if (supported) {
                    const analytics = getAnalytics(app);
                    logEvent(analytics, "exception", {
                        description: `${message}${error ? `: ${error.message || error}` : ""}`,
                        fatal: false, // You can make this true for critical crashes
                        ...context
                    });
                }
            }).catch(() => {
                // Ignore analytics errors
            });
        }
    } catch (e) {
        console.error("Failed to log error to Firebase Analytics", e);
    }
}
