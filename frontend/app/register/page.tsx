import Link from "next/link"
import type { Metadata } from 'next'
import { AuthShell } from '@/components/auth/auth-shell'
import { RegisterForm } from '@/components/auth/register-form'
import { RegisterPageClient } from './register-page-client'
import { PAGE_TITLES, PAGE_DESCRIPTIONS } from '@/lib/seo/metadata'

export const metadata: Metadata = {
  title: PAGE_TITLES.register,
  description: PAGE_DESCRIPTIONS.register,
}

export default function RegisterPage() {
  return (
    <AuthShell
      title="Create your account"
      description="Start writing better emails in seconds. No credit card required."
      footer={
        <>
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Sign in
          </Link>
        </>
      }
    >
      <RegisterPageClient>
        <RegisterForm />
      </RegisterPageClient>
    </AuthShell>
  )
}
