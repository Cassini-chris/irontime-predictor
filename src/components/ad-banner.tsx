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
                {/* Support Link from original site */}
                <div className="mt-4 pt-4 border-t border-primary/10">
                    <a
                        href="http://deloplen.com/afu.php?zoneid=2902726"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white/80 hover:text-white underline decoration-primary/50 underline-offset-4 transition-colors"
                    >
                        To support RunCulator, please click on the <u>Advertisement</u>
                    </a>
                </div>
            </div>
        </div>
    );
}
