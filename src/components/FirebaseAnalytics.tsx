"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { analytics } from "@/lib/firebase";
import { logEvent } from "firebase/analytics";

export default function FirebaseAnalytics() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        if (analytics) {
            // Log page view on every route change
            const url = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : "");
            logEvent(analytics, "page_view", {
                page_path: url,
                page_title: document.title,
                page_location: window.location.href,
            });
        }
    }, [pathname, searchParams]);

    return null;
}
