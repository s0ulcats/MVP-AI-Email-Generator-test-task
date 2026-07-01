import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MobileNav } from '../mobile-nav'
import { useAuth } from '@/providers/auth-provider'

jest.mock('@/providers/auth-provider')
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(() => '/dashboard'),
}))

describe('MobileNav', () => {
  const mockLogout = jest.fn()
  const mockUser = {
    id: '1',
    email: 'test@example.com',
    name: 'Test User',
    plan: 'FREE' as const,
    createdAt: '2024-01-01T00:00:00Z',
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useAuth as jest.Mock).mockReturnValue({
      user: mockUser,
      logout: mockLogout,
      loading: false,
      refreshUser: jest.fn(),
    })
  })

  it('hamburger button is visible on mobile, hidden on md+', () => {
    render(<MobileNav links={[{ href: '/dashboard', label: 'Dashboard' }]} />)

    const hamburger = screen.getByRole('button', { name: /Open menu/i })
    expect(hamburger).toBeInTheDocument()
    expect(hamburger).toHaveClass('md:hidden')
  })

  it('clicking hamburger opens the drawer', async () => {
    render(<MobileNav links={[{ href: '/dashboard', label: 'Dashboard' }]} />)

    const hamburger = screen.getByRole('button', { name: /Open menu/i })
    await userEvent.click(hamburger)

    expect(screen.getByText('Dashboard')).toBeInTheDocument()
  })

  it('clicking overlay closes the drawer', async () => {
    render(<MobileNav links={[{ href: '/dashboard', label: 'Dashboard' }]} />)

    const hamburger = screen.getByRole('button', { name: /Open menu/i })
    await userEvent.click(hamburger)

    const backdrop = document.querySelector('.fixed.inset-0') as HTMLElement
    await userEvent.click(backdrop)

    expect(screen.queryByText('Dashboard')).not.toBeInTheDocument()
  })

  it('active route link has active styles applied', async () => {
    render(<MobileNav links={[{ href: '/dashboard', label: 'Dashboard' }]} />)

    const hamburger = screen.getByRole('button', { name: /Open menu/i })
    await userEvent.click(hamburger)

    const activeLink = screen.getByText('Dashboard')
    expect(activeLink).toHaveClass('bg-primary')
  })

  it('logout button calls authLogout() and closes drawer', async () => {
    render(<MobileNav links={[{ href: '/dashboard', label: 'Dashboard' }]} />)

    const hamburger = screen.getByRole('button', { name: /Open menu/i })
    await userEvent.click(hamburger)

    const logoutButton = screen.getByRole('button', { name: /Logout/i })
    await userEvent.click(logoutButton)

    expect(mockLogout).toHaveBeenCalledTimes(1)
    expect(screen.queryByText('Dashboard')).not.toBeInTheDocument()
  })

  it('drawer renders via portal directly on document.body (not inside header)', async () => {
    render(<MobileNav links={[{ href: '/dashboard', label: 'Dashboard' }]} />)

    const hamburger = screen.getByRole('button', { name: /Open menu/i })
    await userEvent.click(hamburger)

    const backdrop = document.querySelector('.fixed.inset-0') as HTMLElement
    expect(backdrop.parentElement).toBe(document.body)
  })
})
