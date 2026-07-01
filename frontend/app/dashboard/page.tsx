import type { Metadata } from 'next'
import { AppNav } from '@/components/app/app-nav'
import { EmailGenerator } from '@/components/app/email-generator'
import { PAGE_TITLES, PAGE_DESCRIPTIONS } from '@/lib/seo/metadata'

export const metadata: Metadata = {
  title: PAGE_TITLES.dashboard,
  description: PAGE_DESCRIPTIONS.dashboard,
  robots: {
    index: false,
  },
}

export default function DashboardPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <AppNav />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
        <div className="mb-8 flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Generate an email
          </h1>
          <p className="text-sm text-muted-foreground">
            Describe your message, choose a tone and length, and let AI draft
            it for you.
          </p>
        </div>
        <EmailGenerator />
      </main>
    </div>
  )
}
