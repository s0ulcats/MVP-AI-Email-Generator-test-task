import Link from "next/link"
import type { Metadata } from 'next'
import { AuthShell } from '@/components/auth/auth-shell'
import { LoginForm } from '@/components/auth/login-form'
import { LoginPageClient } from './login-page-client'
import { PAGE_TITLES, PAGE_DESCRIPTIONS } from '@/lib/seo/metadata'

export const metadata: Metadata = {
  title: PAGE_TITLES.login,
  description: PAGE_DESCRIPTIONS.login,
}

export default function LoginPage() {
  return (
    <AuthShell
      title="Welcome back"
      description="Sign in to continue generating professional emails."
      footer={
        <>
          Don't have an account?{" "}
          <Link
            href="/register"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Sign up
          </Link>
        </>
      }
    >
      <LoginPageClient>
        <LoginForm />
      </LoginPageClient>
    </AuthShell>
  )
}
