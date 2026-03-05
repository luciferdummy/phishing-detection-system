"use client"

import { useState, useRef, type FormEvent } from "react"
import { Search, Loader2, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface UrlScannerProps {
  onScan: (url: string) => void
  isScanning: boolean
}

export function UrlScanner({ onScan, isScanning }: UrlScannerProps) {
  const [url, setUrl] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (url.trim() && !isScanning) {
      onScan(url.trim())
    }
  }

  const handleClear = () => {
    setUrl("")
    inputRef.current?.focus()
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative group">
        {/* Glow border effect */}
        <div className="absolute -inset-0.5 bg-primary/20 rounded-xl blur-sm opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />

        <div className="relative flex items-center bg-card border border-border rounded-xl overflow-hidden transition-colors group-focus-within:border-primary/50">
          {/* Icon */}
          <div className="flex items-center pl-4 text-muted-foreground">
            {isScanning ? (
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
            ) : (
              <Search className="h-5 w-5" />
            )}
          </div>

          {/* Input */}
          <input
            ref={inputRef}
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter URL to scan (e.g., https://example.com)"
            className="flex-1 bg-transparent px-4 py-4 text-foreground placeholder:text-muted-foreground font-mono text-sm focus:outline-none"
            disabled={isScanning}
            aria-label="URL to scan"
          />

          {/* Clear button */}
          {url && !isScanning && (
            <button
              type="button"
              onClick={handleClear}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Clear URL"
            >
              <X className="h-4 w-4" />
            </button>
          )}

          {/* Scan button */}
          <Button
            type="submit"
            disabled={!url.trim() || isScanning}
            className="m-2 px-6 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg font-semibold"
          >
            {isScanning ? "Scanning..." : "Scan"}
          </Button>
        </div>

        {/* Scan line animation */}
        {isScanning && (
          <div className="absolute bottom-0 left-0 right-0 h-0.5 overflow-hidden rounded-b-xl">
            <div className="h-full w-1/3 bg-primary animate-scan-line" />
          </div>
        )}
      </div>
    </form>
  )
}
