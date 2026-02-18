"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { analytics } from "@/lib/firebase";
import { logEvent, setUserId, isSupported, getAnalytics } from "firebase/analytics";
import { useAuth } from "@/context/AuthContext";
import { app } from "@/lib/firebase";

export default function FirebaseAnalytics() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { user } = useAuth();

    useEffect(() => {
        const initAnalytics = async () => {
            if (await isSupported()) {
                const instance = getAnalytics(app);

                // Set User ID if logged in
                if (user) {
                    setUserId(instance, user.uid);
                }

                // Log page view on every route change
                const url = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : "");
                logEvent(instance, "page_view", {
                    page_path: url,
                    page_title: document.title,
                    page_location: window.location.href,
                });
            }
        };

        initAnalytics();
    }, [pathname, searchParams, user]);

    return null;
}
