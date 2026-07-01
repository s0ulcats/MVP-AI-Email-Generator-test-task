'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/logo'
import { useAuth } from '@/providers/auth-provider'
import { cn } from '@/lib/utils'

interface MobileNavProps {
  links: { href: string; label: string }[]
}

export function MobileNav({ links }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  const { user, logout: authLogout } = useAuth()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  async function handleLogout() {
    await authLogout()
    setIsOpen(false)
  }

  const drawer = isOpen ? (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 md:hidden"
      onClick={() => setIsOpen(false)}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-border bg-background shadow-2xl animate-in zoom-in-95 duration-300 max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border p-4">
          <Logo />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            aria-label="Close menu"
          >
            <X className="h-6 w-6" />
          </Button>
        </div>

        <nav className="flex flex-col p-4">
          {links.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  'flex items-center rounded-lg px-4 py-4 text-base font-medium transition-colors cursor-pointer',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                )}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-border p-4">
          {user ? (
            <div className="flex flex-col gap-3">
              <div className="rounded-lg bg-muted px-4 py-3">
                <p className="text-sm font-medium text-foreground">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
              <Button variant="outline" onClick={handleLogout} className="w-full cursor-pointer">
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <Link href="/login" onClick={() => setIsOpen(false)}>
                <Button variant="outline" className="w-full cursor-pointer">Log in</Button>
              </Link>
              <Link href="/register" onClick={() => setIsOpen(false)}>
                <Button className="w-full cursor-pointer">Get Started</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  ) : null

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(true)}
        className="md:hidden cursor-pointer"
        aria-label="Open menu"
      >
        <Menu className="h-6 w-6" />
      </Button>

      {mounted ? createPortal(drawer, document.body) : null}
    </>
  )
}