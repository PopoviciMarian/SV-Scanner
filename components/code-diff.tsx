"use client"

import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"

interface CodeDiffProps {
  originalCode: string
  newCode: string
}

export default function CodeDiff({ originalCode, newCode }: CodeDiffProps) {
  const [DiffViewer, setDiffViewer] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Dynamically import the diff viewer component
    import("react-diff-viewer-continued").then((module) => {
      setDiffViewer(() => module.default)
      setLoading(false)
    })
  }, [])

  if (loading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
    )
  }

  if (!DiffViewer) return null

  return (
    <DiffViewer
      oldValue={originalCode}
      newValue={newCode}
      splitView={true}
      useDarkTheme={false}
      showDiffOnly={false}
      styles={{
        contentText: {
          fontFamily: "monospace",
          fontSize: "0.875rem",
          lineHeight: "1.5",
        },
      }}
    />
  )
}
