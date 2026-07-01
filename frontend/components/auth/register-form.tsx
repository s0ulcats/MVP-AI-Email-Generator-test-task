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
  FieldDescription,
} from '@/components/ui/field'
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
  InputGroupButton,
} from '@/components/ui/input-group'
import {
  getEmailError,
  getNameError,
  getPasswordError,
} from '@/lib/validation'
import { register } from '@/lib/api/auth'
import { useAuth } from '@/providers/auth-provider'

interface FormErrors {
  name?: string
  email?: string
  password?: string
}

export function RegisterForm() {
  const router = useRouter()
  const { refreshUser } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()

    const nextErrors: FormErrors = {
      name: getNameError(name),
      email: getEmailError(email),
      password: getPasswordError(password),
    }
    setErrors(nextErrors)
    if (nextErrors.name || nextErrors.email || nextErrors.password) return

    setIsSubmitting(true)
    try {
      await register({ email, password, name })
      await refreshUser()
      toast.success('Account created!', {
        description: 'Taking you to your new dashboard.',
      })
      router.push('/dashboard')
    } catch (error) {
      toast.error('Registration failed', {
        description: error instanceof Error ? error.message : 'Please try again.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <FieldGroup>
        <Field data-invalid={!!errors.name || undefined}>
          <FieldLabel htmlFor="name">Full name</FieldLabel>
          <Input
            id="name"
            type="text"
            placeholder="Jane Cooper"
            autoComplete="name"
            value={name}
            aria-invalid={!!errors.name || undefined}
            onChange={(e) => setName(e.target.value)}
            className="cursor-pointer"
          />
          <FieldError>{errors.name}</FieldError>
        </Field>

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
              placeholder="Create a password"
              autoComplete="new-password"
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
          {errors.password ? (
            <FieldError>{errors.password}</FieldError>
          ) : (
            <FieldDescription>Must be at least 8 characters.</FieldDescription>
          )}
        </Field>

        <Button type="submit" disabled={isSubmitting} className="w-full cursor-pointer">
          {isSubmitting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : null}
          {isSubmitting ? 'Creating account...' : 'Create account'}
        </Button>
      </FieldGroup>
    </form>
  )
}
