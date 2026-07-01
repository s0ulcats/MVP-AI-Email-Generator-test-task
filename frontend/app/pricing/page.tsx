import type { Metadata } from 'next'
import { SiteHeader } from '@/components/marketing/site-header'
import { SiteFooter } from '@/components/marketing/site-footer'
import { PricingCards } from '@/components/marketing/pricing-cards'
import { PAGE_TITLES, PAGE_DESCRIPTIONS } from '@/lib/seo/metadata'

export const metadata: Metadata = {
  title: PAGE_TITLES.pricing,
  description: PAGE_DESCRIPTIONS.pricing,
}

export default function PricingPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section>
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <h1 className="text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                Simple, transparent pricing
              </h1>
              <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
                Start for free and upgrade when you need more. No hidden fees,
                cancel anytime.
              </p>
            </div>
            <PricingCards />
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
