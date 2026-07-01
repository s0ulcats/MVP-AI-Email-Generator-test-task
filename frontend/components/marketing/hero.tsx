'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FadeIn } from '@/components/fade-in'

const DEMO_EMAIL = `Hi Sarah,

Following up on our conversation about the Q3 partnership. I've attached the updated proposal with the revised terms we discussed.

Would you have time this Thursday or Friday to review? I'm confident this aligns well with both our goals.

Best,
Alex`

export function Hero() {
  const [displayedText, setDisplayedText] = useState('')
  const [isTyping, setIsTyping] = useState(true)

  useEffect(() => {
    let index = 0
    const interval = setInterval(() => {
      if (index < DEMO_EMAIL.length) {
        setDisplayedText(DEMO_EMAIL.slice(0, index + 1))
        index++
      } else {
        setIsTyping(false)
        clearInterval(interval)
      }
    }, 30)

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="border-b border-border">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-12 px-4 py-20 lg:flex-row lg:items-start lg:py-28 sm:px-6">
        <FadeIn className="flex-1 text-center lg:text-left">
          <h1 className="max-w-2xl text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Turn a thought into a polished email
          </h1>
          <p className="mt-6 max-w-lg text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            Describe your topic, choose a tone, and get a complete draft in seconds. No blank page anxiety.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:items-start">
            <Button
              size="lg"
              className="cursor-pointer"
              nativeButton={false}
              render={<Link href="/register" />}
            >
              Generate your first email
              <ArrowRight data-icon="inline-end" />
            </Button>
          </div>
        </FadeIn>
        <FadeIn delay={0.2} className="flex-1">
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <div className="size-3 rounded-full bg-red-500" />
              <div className="size-3 rounded-full bg-yellow-500" />
              <div className="size-3 rounded-full bg-green-500" />
            </div>
            <div className="min-h-[200px] whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground font-mono">
              {displayedText}
              {isTyping && <span className="inline-block w-2 h-4 bg-foreground ml-0.5 animate-pulse" />}
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
