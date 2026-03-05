"use client"

import type { AnalysisResult } from "@/lib/phishing-detector"
import { ShieldAlert, ShieldCheck, ShieldQuestion } from "lucide-react"

interface TrafficSignalProps {
  result: AnalysisResult | null
  isScanning: boolean
}

export function TrafficSignal({ result, isScanning }: TrafficSignalProps) {
  const getRedState = () => {
    if (isScanning) return "opacity-30"
    if (result?.riskLevel === "dangerous") return "opacity-100"
    return "opacity-10"
  }

  const getYellowState = () => {
    if (isScanning) return "opacity-100 animate-pulse"
    if (result?.riskLevel === "suspicious") return "opacity-100"
    return "opacity-10"
  }

  const getGreenState = () => {
    if (isScanning) return "opacity-30"
    if (result?.riskLevel === "safe") return "opacity-100"
    if (!result) return "opacity-30"
    return "opacity-10"
  }

  const getMessage = () => {
    if (isScanning) return "Analyzing..."
    if (!result) return "Enter a URL to scan"
    switch (result.riskLevel) {
      case "dangerous":
        return "DANGER - Phishing Detected!"
      case "suspicious":
        return "CAUTION - Suspicious URL"
      case "safe":
        return "SAFE - No Threats Found"
    }
  }

  const getIcon = () => {
    if (isScanning || !result) return null
    switch (result.riskLevel) {
      case "dangerous":
        return <ShieldAlert className="h-6 w-6" />
      case "suspicious":
        return <ShieldQuestion className="h-6 w-6" />
      case "safe":
        return <ShieldCheck className="h-6 w-6" />
    }
  }

  const getMessageColor = () => {
    if (isScanning) return "text-yellow-400"
    if (!result) return "text-muted-foreground"
    switch (result.riskLevel) {
      case "dangerous":
        return "text-red-400"
      case "suspicious":
        return "text-yellow-400"
      case "safe":
        return "text-emerald-400"
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Signal Housing */}
      <div className="relative bg-card border border-border rounded-2xl p-4 flex flex-col items-center gap-3 shadow-2xl">
        {/* Visor effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-foreground/5 to-transparent pointer-events-none" />

        {/* Red Light */}
        <div
          className={`relative w-16 h-16 rounded-full transition-all duration-700 ${getRedState()}`}
          style={{
            backgroundColor:
              result?.riskLevel === "dangerous" && !isScanning
                ? "hsl(0, 72%, 51%)"
                : "hsl(0, 72%, 25%)",
            boxShadow:
              result?.riskLevel === "dangerous" && !isScanning
                ? "0 0 30px 8px hsla(0, 72%, 51%, 0.5), inset 0 -4px 8px hsla(0, 72%, 30%, 0.3)"
                : "inset 0 -4px 8px hsla(0, 0%, 0%, 0.3)",
          }}
        >
          {result?.riskLevel === "dangerous" && !isScanning && (
            <div className="absolute inset-0 rounded-full animate-signal-pulse text-red-500/20" />
          )}
        </div>

        {/* Yellow Light */}
        <div
          className={`relative w-16 h-16 rounded-full transition-all duration-700 ${getYellowState()}`}
          style={{
            backgroundColor:
              result?.riskLevel === "suspicious" || isScanning
                ? "hsl(45, 93%, 58%)"
                : "hsl(45, 60%, 25%)",
            boxShadow:
              result?.riskLevel === "suspicious" || isScanning
                ? "0 0 30px 8px hsla(45, 93%, 58%, 0.5), inset 0 -4px 8px hsla(45, 93%, 30%, 0.3)"
                : "inset 0 -4px 8px hsla(0, 0%, 0%, 0.3)",
          }}
        >
          {isScanning && (
            <div className="absolute inset-0 rounded-full animate-signal-pulse text-yellow-500/20" />
          )}
        </div>

        {/* Green Light */}
        <div
          className={`relative w-16 h-16 rounded-full transition-all duration-700 ${getGreenState()}`}
          style={{
            backgroundColor:
              result?.riskLevel === "safe" && !isScanning
                ? "hsl(142, 71%, 45%)"
                : "hsl(142, 40%, 20%)",
            boxShadow:
              result?.riskLevel === "safe" && !isScanning
                ? "0 0 30px 8px hsla(142, 71%, 45%, 0.5), inset 0 -4px 8px hsla(142, 71%, 25%, 0.3)"
                : "inset 0 -4px 8px hsla(0, 0%, 0%, 0.3)",
          }}
        >
          {result?.riskLevel === "safe" && !isScanning && (
            <div className="absolute inset-0 rounded-full animate-signal-pulse text-green-500/20" />
          )}
        </div>
      </div>

      {/* Status Message */}
      <div className={`flex items-center gap-2 font-mono text-sm font-semibold transition-colors duration-500 ${getMessageColor()}`}>
        {getIcon()}
        <span>{getMessage()}</span>
      </div>
    </div>
  )
}
