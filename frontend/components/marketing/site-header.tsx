'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/logo"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useAuth } from "@/providers/auth-provider"
import { logout } from '@/lib/api/auth'
import { MobileNav } from "@/components/layout/mobile-nav"
import { cn } from '@/lib/utils'

const navLinks = [
  { href: "/#features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/#faq", label: "FAQ" },
]

const dashboardLink = { href: "/dashboard", label: "Dashboard" }

export function SiteHeader() {
  const router = useRouter()
  const pathname = usePathname()
  const [hash, setHash] = useState('')
  const { user, logout: authLogout } = useAuth()

  useEffect(() => {
    const handleHashChange = () => {
      setHash(window.location.hash)
    }

    setHash(window.location.hash)

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const isActive = (href: string) => {
    if (href.startsWith('/#')) {
      const expectedHash = href.replace('/', '')
      return hash === expectedHash
    }
    return pathname === href
  }

  const initials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'JD'

  async function handleLogout() {
    await logout()
    authLogout()
    window.location.href = '/login'
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-8">
          <Logo />
          <nav className="hidden items-center gap-6 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-sm transition-colors',
                  isActive(link.href)
                    ? 'text-foreground font-medium'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {link.label}
              </Link>
            ))}
            {user && (
              <Link
                href={dashboardLink.href}
                className={cn(
                  'text-sm transition-colors',
                  isActive(dashboardLink.href)
                    ? 'text-foreground font-medium'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {dashboardLink.label}
              </Link>
            )}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <MobileNav links={user ? [...navLinks, dashboardLink] : navLinks} />
          {user ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="cursor-pointer hidden md:flex"
              >
                Logout
              </Button>
              <Link href="/profile" aria-label="View profile" className="cursor-pointer hidden md:block">
                <Avatar size="sm">
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
              </Link>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                nativeButton={false}
                render={<Link href="/login" />}
                className="hidden md:flex"
              >
                Login
              </Button>
              <Button
                size="sm"
                nativeButton={false}
                render={<Link href="/register" />}
                className="hidden md:flex"
              >
                Sign up
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
