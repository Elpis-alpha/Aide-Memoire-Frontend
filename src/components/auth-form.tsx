'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { Field } from '@/components/ui/field'
import { Button } from '@/components/ui/button'
import { useLogin, useRegister } from '@/hooks/use-api'
import { ApiError } from '@/lib/api'

/**
 * Both auth forms. They share validation, error handling and the redirect, so
 * they share a component rather than drifting apart as two copies.
 *
 * The password rules mirror the API's zod schema exactly — the backend remains
 * the authority, this just saves a round trip to hear the same thing.
 */
const password = z
  .string()
  .min(8, 'Use at least 8 characters')
  .refine(value => !value.toLowerCase().includes('password'), {
    message: 'Pick something that does not contain "password"',
  })

const loginSchema = z.object({
  email: z.string().min(1, 'Enter your email').email('That does not look like an email address'),
  password: z.string().min(1, 'Enter your password'),
})

const signupSchema = z.object({
  name: z.string().trim().min(1, 'Enter your name').max(120),
  email: z.string().min(1, 'Enter your email').email('That does not look like an email address'),
  password,
})

type Mode = 'login' | 'signup'

export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const login = useLogin()
  const register = useRegister()

  const isSignup = mode === 'signup'
  const mutation = isSignup ? register : login

  const form = useForm<{ name?: string; email: string; password: string }>({
    resolver: zodResolver(isSignup ? signupSchema : loginSchema),
    defaultValues: { name: '', email: '', password: '' },
  })

  const onSubmit = form.handleSubmit(async values => {
    try {
      if (isSignup) {
        await register.mutateAsync({
          name: values.name ?? '',
          email: values.email,
          password: values.password,
        })
      } else {
        await login.mutateAsync({ email: values.email, password: values.password })
      }

      // Middleware preserved where they were headed before the redirect.
      const next = searchParams.get('next')
      router.push(next && next.startsWith('/') ? next : '/me')
      router.refresh()
    } catch (error) {
      if (error instanceof ApiError) {
        // Field-level messages from the API land on the right inputs.
        const fieldErrors = error.fieldErrors
        let matched = false
        for (const [field, message] of Object.entries(fieldErrors)) {
          if (field === 'name' || field === 'email' || field === 'password') {
            form.setError(field, { message })
            matched = true
          }
        }
        if (!matched) form.setError('root', { message: error.message })
      } else {
        form.setError('root', { message: 'Something went wrong. Try again.' })
      }
    }
  })

  const rootError = form.formState.errors.root?.message

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      {rootError && (
        <p
          role="alert"
          className="border-l-2 border-correct bg-correct-soft px-3 py-2 text-small text-correct"
        >
          {rootError}
        </p>
      )}

      {isSignup && (
        <Field
          label="Name"
          // S3-37 — none of these attributes existed, so password managers
          // could not fill or save credentials.
          autoComplete="name"
          autoFocus
          error={form.formState.errors.name?.message}
          {...form.register('name')}
        />
      )}

      <Field
        label="Email"
        type="email"
        inputMode="email"
        autoComplete="email"
        autoFocus={!isSignup}
        error={form.formState.errors.email?.message}
        {...form.register('email')}
      />

      <Field
        label="Password"
        type="password"
        autoComplete={isSignup ? 'new-password' : 'current-password'}
        hint={isSignup ? 'At least 8 characters.' : undefined}
        error={form.formState.errors.password?.message}
        {...form.register('password')}
      />

      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full"
        disabled={mutation.isPending}
      >
        {mutation.isPending
          ? isSignup
            ? 'Creating your account'
            : 'Signing in'
          : isSignup
            ? 'Create account'
            : 'Sign in'}
      </Button>

      <p className="text-center text-small text-ink-muted">
        {isSignup ? 'Already have an account? ' : 'No account yet? '}
        <Link
          href={isSignup ? '/login' : '/signup'}
          className="text-accent underline underline-offset-2"
        >
          {isSignup ? 'Sign in' : 'Create one'}
        </Link>
      </p>
    </form>
  )
}
