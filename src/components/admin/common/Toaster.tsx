"use client";

import { Toaster as SonnerToaster } from "sonner";
import { CheckCircle2, AlertCircle, AlertTriangle, Info, Loader2 } from "lucide-react";

export function Toaster() {
    return (
        <SonnerToaster
            position="bottom-right"
            icons={{
                success: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
                error: <AlertCircle className="w-4 h-4 text-red-500" />,
                warning: <AlertTriangle className="w-4 h-4 text-amber-500" />,
                info: <Info className="w-4 h-4 text-sky-500" />,
                loading: <Loader2 className="w-4 h-4 text-primary animate-spin" />,
            }}
            toastOptions={{
                className:
                    "!bg-background !text-heading !border !border-border !shadow-lg !rounded-xl !text-xs !py-3 !px-4",
                classNames: {
                    success: "!border-emerald-500/25",
                    error: "!border-red-500/25",
                    warning: "!border-amber-500/25",
                    info: "!border-sky-500/25",
                },
            }}
        />
    );
}