import { SiteHeader } from '@/components/marketing/site-header'
import { SiteFooter } from '@/components/marketing/site-footer'
import { Hero } from '@/components/marketing/hero'
import { Features } from '@/components/marketing/features'
import { Faq, faqs } from '@/components/marketing/faq'
import { Cta } from '@/components/marketing/cta'
import { JsonLd } from '@/components/seo/json-ld'
import { PAGE_TITLES, PAGE_DESCRIPTIONS, SITE_NAME, SITE_URL, DEFAULT_DESCRIPTION, OG_IMAGE } from '@/lib/seo/metadata'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: PAGE_TITLES.home,
  description: PAGE_DESCRIPTIONS.home,
}

export default function HomePage() {
  const webApplicationSchema = {
    '@type': 'WebApplication',
    name: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    logo: `${SITE_URL}${OG_IMAGE}`,
  }

  const faqPageSchema = {
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <JsonLd data={webApplicationSchema} />
      <JsonLd data={faqPageSchema} />
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <Features />
        <Faq />
        <Cta />
      </main>
      <SiteFooter />
    </div>
  )
}
