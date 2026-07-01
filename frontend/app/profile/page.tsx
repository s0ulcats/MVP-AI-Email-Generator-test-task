import type { Metadata } from 'next'
import { AppNav } from '@/components/app/app-nav'
import { ProfileCard } from '@/components/app/profile-card'
import { PAGE_TITLES, PAGE_DESCRIPTIONS } from '@/lib/seo/metadata'

export const metadata: Metadata = {
  title: PAGE_TITLES.profile,
  description: PAGE_DESCRIPTIONS.profile,
  robots: {
    index: false,
  },
}

export default function ProfilePage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <AppNav />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10 sm:px-6">
        <div className="mb-8 flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Account
          </h1>
          <p className="text-sm text-muted-foreground">
            View and manage your profile information.
          </p>
        </div>
        <ProfileCard />
      </main>
    </div>
  )
}
