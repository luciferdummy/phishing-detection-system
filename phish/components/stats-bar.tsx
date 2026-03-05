"use client"

import { Shield, AlertTriangle, Globe, Activity } from "lucide-react"

interface StatsBarProps {
  totalScans: number
  threatsDetected: number
  safeCount: number
}

export function StatsBar({ totalScans, threatsDetected, safeCount }: StatsBarProps) {
  const stats = [
    {
      label: "Total Scans",
      value: totalScans,
      icon: Activity,
      color: "text-blue-400",
      bg: "bg-blue-500/10 border-blue-500/20",
    },
    {
      label: "Threats Found",
      value: threatsDetected,
      icon: AlertTriangle,
      color: "text-red-400",
      bg: "bg-red-500/10 border-red-500/20",
    },
    {
      label: "Safe Sites",
      value: safeCount,
      icon: Shield,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10 border-emerald-500/20",
    },
    {
      label: "Detection Rate",
      value: totalScans > 0 ? `${Math.round((threatsDetected / totalScans) * 100)}%` : "0%",
      icon: Globe,
      color: "text-yellow-400",
      bg: "bg-yellow-500/10 border-yellow-500/20",
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={`flex items-center gap-3 rounded-xl border p-4 ${stat.bg}`}
        >
          <stat.icon className={`h-5 w-5 shrink-0 ${stat.color}`} />
          <div>
            <div className={`text-lg font-bold font-mono ${stat.color}`}>
              {stat.value}
            </div>
            <div className="text-xs text-muted-foreground">{stat.label}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
