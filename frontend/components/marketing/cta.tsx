import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FadeIn } from '@/components/fade-in'

export function Cta() {
  return (
    <section>
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <FadeIn>
          <div className="flex flex-col items-center rounded-2xl border border-border bg-card px-6 py-14 text-center">
            <h2 className="max-w-2xl text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Start writing better emails today
            </h2>
            <p className="mt-4 max-w-lg text-pretty leading-relaxed text-muted-foreground">
              Join thousands of professionals who let AI handle the first draft. It&apos;s free to get started.
            </p>
            <Button
              size="lg"
              className="mt-8 cursor-pointer"
              nativeButton={false}
              render={<Link href="/register" />}
            >
              Generate your first email
              <ArrowRight data-icon="inline-end" />
            </Button>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
