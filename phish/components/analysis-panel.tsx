"use client"

import type { AnalysisResult } from "@/lib/phishing-detector"
import {
  ShieldCheck,
  ShieldAlert,
  ShieldQuestion,
  AlertTriangle,
  CheckCircle2,
  Info,
  ExternalLink,
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface AnalysisPanelProps {
  result: AnalysisResult
}

export function AnalysisPanel({ result }: AnalysisPanelProps) {
  const getBgClass = () => {
    switch (result.riskLevel) {
      case "dangerous":
        return "border-red-500/30 bg-red-500/5"
      case "suspicious":
        return "border-yellow-500/30 bg-yellow-500/5"
      case "safe":
        return "border-emerald-500/30 bg-emerald-500/5"
    }
  }

  const getScoreColor = () => {
    switch (result.riskLevel) {
      case "dangerous":
        return "text-red-400"
      case "suspicious":
        return "text-yellow-400"
      case "safe":
        return "text-emerald-400"
    }
  }

  const getScoreBarColor = () => {
    switch (result.riskLevel) {
      case "dangerous":
        return "bg-red-500"
      case "suspicious":
        return "bg-yellow-500"
      case "safe":
        return "bg-emerald-500"
    }
  }

  const getHeaderIcon = () => {
    switch (result.riskLevel) {
      case "dangerous":
        return <ShieldAlert className="h-6 w-6 text-red-400" />
      case "suspicious":
        return <ShieldQuestion className="h-6 w-6 text-yellow-400" />
      case "safe":
        return <ShieldCheck className="h-6 w-6 text-emerald-400" />
    }
  }

  const getDetailIcon = (status: string) => {
    switch (status) {
      case "danger":
        return <AlertTriangle className="h-4 w-4 text-red-400 shrink-0" />
      case "warning":
        return <Info className="h-4 w-4 text-yellow-400 shrink-0" />
      case "safe":
        return <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
      default:
        return null
    }
  }

  const getDetailBg = (status: string) => {
    switch (status) {
      case "danger":
        return "border-red-500/20 bg-red-500/5"
      case "warning":
        return "border-yellow-500/20 bg-yellow-500/5"
      case "safe":
        return "border-emerald-500/20 bg-emerald-500/5"
      default:
        return "border-border"
    }
  }

  return (
    <div
      className={`rounded-xl border p-6 transition-all duration-500 animate-in fade-in slide-in-from-bottom-4 ${getBgClass()}`}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        {getHeaderIcon()}
        <div>
          <h3 className="font-semibold text-foreground">Analysis Report</h3>
          <p className="text-xs text-muted-foreground font-mono truncate max-w-xs sm:max-w-md">
            {result.url}
          </p>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
        {result.details.map((detail) => (
          <div
            key={detail.label}
            className={`rounded-lg border p-3 ${getDetailBg(detail.status)}`}
          >
            <div className="flex items-center gap-2 mb-1">
              {getDetailIcon(detail.status)}
              <span className="text-xs font-medium text-foreground">
                {detail.label}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              {detail.description}
            </p>
          </div>
        ))}
      </div>

      {/* Reasons */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-foreground mb-3">
          Findings
        </h4>
        <ul className="space-y-2">
          {result.reasons.map((reason) => (
            <li key={reason} className="flex items-start gap-2 text-sm">
              <span
                className={`mt-1.5 h-1.5 w-1.5 rounded-full shrink-0 ${getScoreBarColor()}`}
              />
              <span className="text-muted-foreground">{reason}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Proceed Button */}
      <div className="flex items-center justify-between gap-4 pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground">
          {result.riskLevel === "dangerous"
            ? "This site appears to be a phishing attempt. Proceed with extreme caution."
            : result.riskLevel === "suspicious"
              ? "This site shows suspicious characteristics. Verify before proceeding."
              : "This site appears safe to visit."}
        </p>
        <Button
          onClick={() => window.open(result.url, "_blank")}
          variant={result.riskLevel === "safe" ? "default" : "outline"}
          className={`shrink-0 gap-2 ${
            result.riskLevel === "dangerous"
              ? "border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300"
              : result.riskLevel === "suspicious"
                ? "border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10 hover:text-yellow-300"
                : "bg-emerald-500 hover:bg-emerald-600 text-background"
          }`}
        >
          {result.riskLevel === "dangerous" ? "Proceed Anyway" : "Visit Site"}
          <ExternalLink className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
