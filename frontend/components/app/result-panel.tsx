'use client'

import { useState } from 'react'
import { Check, Copy, Download, FileText } from 'lucide-react'
import { toast } from 'sonner'
import { motion } from 'framer-motion'

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Empty, EmptyMedia, EmptyTitle, EmptyDescription } from '@/components/ui/empty'
import { FadeIn } from '@/components/fade-in'

interface ResultPanelProps {
  result: string | null
  isGenerating: boolean
}

export function ResultPanel({ result, isGenerating }: ResultPanelProps) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    if (!result) return
    try {
      await navigator.clipboard.writeText(result)
      setCopied(true)
      toast.success('Copied to clipboard')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error("Couldn't copy", {
        description: 'Your browser blocked clipboard access.',
      })
    }
  }

  function handleExport() {
    if (!result) return
    const blob = new Blob([result], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'generated-email.txt'
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Exported as .txt')
  }

  const wordCount = result ? result.split(/\s+/).filter(Boolean).length : 0
  const charCount = result ? result.length : 0

  if (isGenerating) {
    return (
      <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5">
        <Skeleton className="h-5 w-2/3" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    )
  }

  if (!result) {
    return (
      <Empty className="rounded-xl border border-dashed border-border py-16">
        <EmptyMedia variant="icon">
          <FileText />
        </EmptyMedia>
        <EmptyTitle>No email yet</EmptyTitle>
        <EmptyDescription>
          Describe your email and click Generate to see the result here.
        </EmptyDescription>
      </Empty>
    )
  }

  return (
    <FadeIn>
      <div className="flex flex-col gap-4 rounded-xl border border-border bg-card">
        <div className="flex items-start justify-between gap-3 border-b border-border p-5">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Generated Email
            </span>
            <span className="text-xs text-muted-foreground">
              {wordCount} words · {charCount} characters
            </span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleExport} className="cursor-pointer">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm" onClick={handleCopy} className="cursor-pointer">
              {copied ? (
                <Check className="h-4 w-4 mr-2" />
              ) : (
                <Copy className="h-4 w-4 mr-2" />
              )}
              {copied ? 'Copied' : 'Copy'}
            </Button>
          </div>
        </div>
        <div className="p-5 pt-0">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="whitespace-pre-wrap text-sm leading-relaxed text-foreground"
          >
            {result}
          </motion.p>
        </div>
      </div>
    </FadeIn>
  )
}
