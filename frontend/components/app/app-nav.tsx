'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { cn } from '@/lib/utils'
import { Logo } from '@/components/logo'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useAuth } from '@/providers/auth-provider'
import { logout } from '@/lib/api/auth'
import { MobileNav } from '@/components/layout/mobile-nav'

const links = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/profile', label: 'Profile' },
]

export function AppNav() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout: authLogout } = useAuth()

  async function handleLogout() {
    try {
      await logout()
      toast.success('Signed out', { description: 'See you next time.' })
      window.location.href = '/login'
    } catch {
      toast.error('Logout failed')
    }
  }

  const initials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'JD'

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-8">
          <Logo />
          <nav className="hidden items-center gap-1 md:flex">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'rounded-md px-3 py-1.5 text-sm transition-colors cursor-pointer',
                  pathname === link.href
                    ? 'bg-muted font-medium text-foreground'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <MobileNav links={links} />
          <Button variant="ghost" size="sm" onClick={handleLogout} className="cursor-pointer hidden md:flex">
            Logout
          </Button>
          <Link href="/profile" aria-label="View profile" className="cursor-pointer hidden md:block">
            <Avatar size="sm">
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          </Link>
        </div>
      </div>
    </header>
  )
}
