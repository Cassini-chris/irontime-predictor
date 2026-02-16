"use client";

import { useEffect } from "react";

export default function AdBanner() {
    useEffect(() => {
        try {
            // @ts-ignore
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (e) {
            console.error("AdSense error:", e);
        }
    }, []);

    return (
        <div className="mt-8 mb-8 flex flex-col items-center gap-2">
            <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Advertisement
            </div>
            <div className="w-full max-w-4xl border-2 border-primary/20 rounded-xl overflow-hidden bg-black/40 backdrop-blur-sm p-4 text-center">
                {/* Horizontal Ad */}
                <ins
                    className="adsbygoogle"
                    style={{ display: "block" }}
                    data-ad-client="ca-pub-3842615578259450"
                    data-ad-slot="6319048141"
                    data-ad-format="auto"
                    data-full-width-responsive="true"
                />

            </div>
        </div>
    );
}
