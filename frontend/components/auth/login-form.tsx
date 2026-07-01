'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from '@/components/ui/field'
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
  InputGroupButton,
} from '@/components/ui/input-group'
import { getEmailError, getPasswordError } from '@/lib/validation'
import { login } from '@/lib/api/auth'
import { useAuth } from '@/providers/auth-provider'

export function LoginForm() {
  const router = useRouter()
  const { refreshUser } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()

    const nextErrors = {
      email: getEmailError(email),
      password: password ? undefined : 'Password is required.',
    }
    setErrors(nextErrors)
    if (nextErrors.email || nextErrors.password) return

    setIsSubmitting(true)
    try {
      await login({ email, password })
      await refreshUser()
      toast.success('Welcome back!', {
        description: 'Redirecting you to your dashboard.',
      })
      router.push('/dashboard')
    } catch (error) {
      toast.error('Login failed', {
        description: error instanceof Error ? error.message : 'Please check your credentials.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <FieldGroup>
        <Field data-invalid={!!errors.email || undefined}>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            value={email}
            aria-invalid={!!errors.email || undefined}
            onChange={(e) => setEmail(e.target.value)}
            className="cursor-pointer"
          />
          <FieldError>{errors.email}</FieldError>
        </Field>

        <Field data-invalid={!!errors.password || undefined}>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <InputGroup>
            <InputGroupInput
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              autoComplete="current-password"
              value={password}
              aria-invalid={!!errors.password || undefined}
              onChange={(e) => setPassword(e.target.value)}
            />
            <InputGroupAddon align="inline-end">
              <InputGroupButton
                size="icon-xs"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                onClick={() => setShowPassword((prev) => !prev)}
                className="cursor-pointer"
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
          <FieldError>{errors.password}</FieldError>
        </Field>

        <Button type="submit" disabled={isSubmitting} className="w-full cursor-pointer">
          {isSubmitting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : null}
          {isSubmitting ? 'Signing in...' : 'Sign in'}
        </Button>
      </FieldGroup>
    </form>
  )
}
