import { logAppError } from "./errorLogger";

export const getAuthErrorMessage = (error: any): string => {
    const code = error?.code || error?.message || "";

    switch (code) {
        // Sign In Errors
        case "auth/invalid-credential":
        case "auth/user-not-found":
        case "auth/wrong-password":
            return "Invalid email or password. Please try again.";
        case "auth/user-disabled":
            return "This account has been disabled.";
        case "auth/too-many-requests":
            return "Too many unsuccessful attempts. Please try again later.";
        case "auth/network-request-failed":
            return "Network error. Please check your connection.";

        // Reset Password Errors
        case "auth/missing-email":
            return "Please enter your email address.";

        // Sign Up Errors
        case "auth/email-already-in-use":
            return "An account with this email already exists.";
        case "auth/invalid-email":
            return "Please enter a valid email address.";
        case "auth/operation-not-allowed":
            return "Email/password accounts are not enabled.";
        case "auth/weak-password":
            return "The password is too weak.";

        // Google / Third-party Auth Errors
        case "auth/unauthorized-domain":
            return "This domain is not authorized for sign-in.";
        case "auth/popup-closed-by-user":
            return "The sign-in popup was closed before completion. Please try again.";
        case "auth/cancelled-popup-request":
            return "The sign-in request was cancelled. Please try again.";
        case "auth/popup-blocked":
            return "The sign-in popup was blocked by your browser. Please allow popups for this site.";

        default:
            logAppError("Unhandled Auth Error", error);
            // Include code in the user message if possible to help with debugging
            return `An unexpected error occurred (${code}). Please try again.`;
    }
};
