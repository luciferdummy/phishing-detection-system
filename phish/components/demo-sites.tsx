"use client"

import { DEMO_SITES } from "@/lib/phishing-detector"
import { ShieldCheck, ShieldAlert, ExternalLink } from "lucide-react"

interface DemoSitesProps {
  onSelect: (url: string) => void
  isScanning: boolean
}

export function DemoSites({ onSelect, isScanning }: DemoSitesProps) {
  return (
    <div>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground">
          Demo Sites
        </h3>
        <p className="text-sm text-muted-foreground">
          Click any site below to test the detection engine
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {DEMO_SITES.map((site) => (
          <button
            key={site.url}
            type="button"
            onClick={() => onSelect(site.url)}
            disabled={isScanning}
            className={`group relative flex items-start gap-3 rounded-xl border p-4 text-left transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed ${
              site.expected === "safe"
                ? "border-emerald-500/20 bg-emerald-500/5 hover:border-emerald-500/40 hover:bg-emerald-500/10"
                : "border-red-500/20 bg-red-500/5 hover:border-red-500/40 hover:bg-red-500/10"
            }`}
          >
            {/* Icon */}
            <div
              className={`mt-0.5 shrink-0 ${
                site.expected === "safe" ? "text-emerald-400" : "text-red-400"
              }`}
            >
              {site.expected === "safe" ? (
                <ShieldCheck className="h-5 w-5" />
              ) : (
                <ShieldAlert className="h-5 w-5" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm text-foreground">
                  {site.label}
                </span>
                <span
                  className={`text-[10px] font-mono font-bold uppercase px-1.5 py-0.5 rounded ${
                    site.expected === "safe"
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "bg-red-500/20 text-red-400"
                  }`}
                >
                  {site.expected === "safe" ? "Safe" : "Phishing"}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {site.description}
              </p>
              <p className="text-[11px] text-muted-foreground/60 font-mono mt-1.5 truncate">
                {site.url}
              </p>
            </div>

            {/* Arrow */}
            <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-0.5" />
          </button>
        ))}
      </div>
    </div>
  )
}
