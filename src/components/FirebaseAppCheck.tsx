"use client";

import { useEffect } from 'react';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';
import { app } from '@/lib/firebase';

export default function FirebaseAppCheck() {
    useEffect(() => {
        // App Check should only initialize on the client side
        if (typeof window !== 'undefined') {
            // Enable debug mode for local development
            // This will log a debug token to the console which you must add to the Firebase Console
            if (process.env.NODE_ENV === 'development') {
                (window as any).FIREBASE_APPCHECK_DEBUG_TOKEN = true;
            }

            const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

            if (siteKey) {
                try {
                    initializeAppCheck(app, {
                        provider: new ReCaptchaV3Provider(siteKey),
                        isTokenAutoRefreshEnabled: true
                    });
                    console.log('Firebase App Check initialized with reCAPTCHA v3');
                } catch (error) {
                    console.error('Firebase App Check initialization failed:', error);
                }
            } else if (process.env.NODE_ENV === 'production') {
                console.warn('Firebase App Check: NEXT_PUBLIC_RECAPTCHA_SITE_KEY is missing in production.');
            }
        }
    }, []);

    return null; // This component doesn't render anything
}
