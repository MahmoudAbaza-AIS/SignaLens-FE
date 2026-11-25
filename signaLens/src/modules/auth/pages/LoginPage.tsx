import { useState, type ChangeEvent, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import {
  applyTheme,
  readTheme,
  writeTheme,
  type ThemePreference,
} from '@/shared/lib/preferences'
import { isAuthenticated, writeSession } from '@/modules/auth/lib/session'

export function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('mahmoud@advansys-is.com')
  const [password, setPassword] = useState('password123')
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [attemptsLeft, setAttemptsLeft] = useState(4)
  const [theme, setTheme] = useState<ThemePreference>(() => readTheme())
  const darkMode =
    theme === 'dark' ||
    (theme === 'system' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches)

  if (isAuthenticated()) {
    return <Navigate to="/" replace />
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault()
    const trimmed = email.trim()

    if (!trimmed || !password) {
      setError('Email and password are required.')
      return
    }

    // Layout-only auth gate until backend auth exists.
    if (!trimmed.includes('@') || password.length < 6) {
      const left = Math.max(0, attemptsLeft - 1)
      setAttemptsLeft(left)
      setError(`Invalid email or password. ${left} attempts left.`)
      return
    }

    const displayName = trimmed.split('@')[0] || 'User'
    writeSession({
      email: trimmed,
      displayName: displayName.charAt(0).toUpperCase() + displayName.slice(1),
      remember,
    })
    navigate('/', { replace: true })
  }

  return (
    <div className="flex min-h-svh w-full flex-col bg-sl-page lg:flex-row">
      <section className="flex flex-col gap-4 bg-sl-logo px-8 py-10 text-white sm:px-12 sm:py-12 lg:w-[min(620px,43%)] lg:px-14 lg:py-14">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-[10px] bg-white" aria-hidden="true" />
          <span className="text-[26px] font-semibold">SignaLens</span>
        </div>

        <div className="hidden min-h-px flex-1 lg:block" />

        <h1 className="max-w-[500px] text-[32px] leading-tight font-semibold sm:text-[40px]">
          See every signal.
          <br />
          Ask anything.
        </h1>
        <p className="max-w-[460px] text-[15px] sm:text-[16px]">
          Industrial analytics, live dashboards and an AI assistant that turns
          plain questions into trusted SQL.
        </p>
        <ul className="flex flex-col gap-2 text-[14px]">
          <li>● Live trends from AVEVA Historian</li>
          <li>● Ask in plain language, see the SQL it ran</li>
          <li>● Pin any answer to your dashboard</li>
        </ul>

        <div className="hidden min-h-px flex-1 lg:block" />
        <p className="text-[12px] text-white/90">© 2026 Advansys · SignaLens v1.0</p>
      </section>

      <section className="flex flex-1 flex-col items-center justify-center px-4 py-10 sm:px-8 lg:px-10">
        <form
          onSubmit={onSubmit}
          className="flex w-full max-w-[440px] flex-col gap-[18px] rounded-2xl border border-sl-border bg-sl-surface p-6 sm:p-10"
          noValidate
        >
          <div>
            <h2 className="text-[24px] font-semibold text-sl-text">
              Sign in to SignaLens
            </h2>
            <p className="mt-1 text-[14px] text-sl-muted">
              Use your work account to continue.
            </p>
          </div>

          <label className="flex flex-col gap-1.5">
            <span className="text-[12px] font-semibold text-sl-text">Email</span>
            <InputText
              type="email"
              autoComplete="username"
              value={email}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                setEmail(event.currentTarget.value)
              }
              className="h-10 w-full rounded-lg border border-sl-logo bg-sl-surface px-3 text-[13px] text-sl-text outline-none focus-visible:ring-2 focus-visible:ring-sl-logo/40"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-[12px] font-semibold text-sl-text">
              Password
            </span>
            <div className="flex h-10 items-center gap-2 rounded-lg border border-sl-border bg-sl-surface px-3">
              <InputText
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  setPassword(event.currentTarget.value)
                }
                className="min-w-0 flex-1 border-0 bg-transparent text-[13px] text-sl-text outline-none"
              />
              <Button
                type="button"
                className="inline-flex cursor-pointer items-center rounded-lg border border-sl-border px-2 py-0.5 text-[12px] text-sl-text"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? 'Hide' : 'Show'}
              </Button>
            </div>
          </label>

          <div className="flex items-center gap-2">
            <label className="inline-flex cursor-pointer items-center gap-2 text-[13px] text-sl-text">
              <input
                type="checkbox"
                checked={remember}
                onChange={(event) => setRemember(event.target.checked)}
                className="size-4 accent-sl-logo"
              />
              Remember me
            </label>
            <div className="min-w-px flex-1" />
            <button
              type="button"
              className="cursor-pointer border-0 bg-transparent p-1 text-[13px] font-semibold text-sl-logo"
              onClick={() =>
                setError(
                  'Password reset is not available yet. Contact your administrator.',
                )
              }
            >
              Forgot password?
            </button>
          </div>

          <Button
            type="submit"
            className="inline-flex h-11 w-full cursor-pointer items-center justify-center rounded-lg bg-sl-logo text-[13px] font-semibold text-white outline-none focus-visible:ring-2 focus-visible:ring-sl-logo/40"
          >
            Sign in
          </Button>

          <div className="flex items-center gap-2.5">
            <div className="h-px flex-1 bg-sl-border" />
            <span className="text-[12px] text-sl-muted">or</span>
            <div className="h-px flex-1 bg-sl-border" />
          </div>

          <Button
            type="button"
            className="inline-flex h-11 w-full cursor-pointer items-center justify-center rounded-lg border border-sl-border bg-sl-surface text-[13px] text-sl-text outline-none focus-visible:ring-2 focus-visible:ring-sl-logo/40"
            onClick={() =>
              setError(
                'Microsoft SSO is not configured yet. Use email sign-in for now.',
              )
            }
          >
            Continue with Microsoft (SSO)
          </Button>

          {error && (
            <div
              role="alert"
              className="rounded-lg border border-[#bf2e2e] px-3 py-2 text-[12px] text-[#bf2e2e]"
            >
              {error}
            </div>
          )}
        </form>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5 px-2">
          <Button
            type="button"
            className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-sl-border bg-sl-surface px-3.5 py-1.5 text-[12px] whitespace-pre text-sl-text"
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            onClick={() => {
              const next: ThemePreference = darkMode ? 'light' : 'dark'
              setTheme(next)
              writeTheme(next)
              applyTheme(next)
            }}
          >
            {darkMode ? '☀  Light mode' : '☾  Dark mode'}
          </Button>
          <p className="text-[12px] text-sl-muted">
            Need access? Contact your administrator.
          </p>
          <Link to="/" className="sr-only">
            Skip to app
          </Link>
        </div>
      </section>
    </div>
  )
}
