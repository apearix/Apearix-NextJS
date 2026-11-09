import { ArrowRight } from "lucide-react";

export default function TopNotification() {
    return (
        <>
            <div className="bg-surface-alt border-b border-border py-2 px-4 text-xs font-medium text-center text-heading flex items-center justify-center gap-2">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-primary-light text-primary border border-border-accent">
                    2026 Engine
                </span>
                <span>Apearix V3 Framework Released: High-throughput AI Agents & Manifest V3 Core.</span>
                <a href="#products" className="text-primary hover:text-primary-hover font-semibold inline-flex items-center gap-0.5 ml-1">Explore Products <ArrowRight className="w-3 h-3" /></a>
            </div>
        </>
    )
}