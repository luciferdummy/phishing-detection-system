"use client"

import { Shield } from "lucide-react"

export function Header() {
  return (
    <header className="border-b border-border/50 bg-card/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="mx-auto max-w-6xl flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Shield className="h-8 w-8 text-primary" />
            <div className="absolute inset-0 h-8 w-8 text-primary animate-pulse-glow opacity-40 blur-sm">
              <Shield className="h-8 w-8" />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              PhishGuard
            </h1>
            <p className="text-xs text-muted-foreground font-mono">
              Threat Detection System
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-primary" />
          </span>
          <span className="text-sm text-muted-foreground font-mono">System Active</span>
        </div>
      </div>
    </header>
  )
}
