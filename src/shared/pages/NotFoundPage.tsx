import { Link } from 'react-router-dom'
import { Button } from 'primereact/button'
import { isAuthenticated } from '@/modules/auth'

export function NotFoundPage() {
  const signedIn = isAuthenticated()
  const homeTo = signedIn ? '/' : '/login'

  return (
    <div className="relative flex min-h-svh w-full flex-col overflow-hidden bg-sl-page">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        aria-hidden="true"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 20%, color-mix(in srgb, var(--color-sl-logo) 22%, transparent), transparent 42%), radial-gradient(circle at 80% 70%, color-mix(in srgb, var(--color-sl-logo) 14%, transparent), transparent 46%)',
        }}
      />

      <header className="relative z-10 flex items-center gap-3 px-6 py-5 sm:px-10">
        <div className="size-9 rounded-[10px] bg-sl-logo" aria-hidden="true" />
        <span className="text-[20px] font-semibold text-sl-text">SignaLens</span>
      </header>

      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 pb-16 text-center">
        <div className="mb-8 flex w-full max-w-md flex-col items-center gap-4 rounded-2xl border border-sl-border bg-sl-surface px-6 py-8 shadow-sm sm:px-10">
          <p className="text-[12px] font-semibold tracking-[0.14em] text-sl-logo uppercase">
            Signal lost
          </p>

          <svg
            viewBox="0 0 320 120"
            className="h-auto w-full text-sl-logo"
            role="img"
            aria-label="Flatlined signal chart"
          >
            <line
              x1="16"
              y1="100"
              x2="304"
              y2="100"
              stroke="currentColor"
              strokeOpacity="0.18"
              strokeWidth="1"
            />
            <line
              x1="16"
              y1="20"
              x2="16"
              y2="100"
              stroke="currentColor"
              strokeOpacity="0.18"
              strokeWidth="1"
            />
            <path
              d="M24 72 C48 72, 56 28, 80 28 S112 96, 136 72 S168 40, 184 56"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              className="animate-[sl-draw_1.4s_ease-out_both]"
            />
            <path
              d="M184 56 L210 56 L236 56 L262 56 L288 56"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray="4 6"
              className="animate-[sl-pulse_1.6s_ease-in-out_infinite]"
              opacity="0.55"
            />
            <circle
              cx="184"
              cy="56"
              r="4.5"
              fill="currentColor"
              className="animate-[sl-pulse_1.6s_ease-in-out_infinite]"
            />
          </svg>

          <h1 className="text-[42px] leading-none font-semibold text-sl-text sm:text-[52px]">
            404
          </h1>
          <p className="max-w-[34ch] text-[15px] text-sl-muted">
            This route isn’t on the plant map. The signal dropped before we could
            plot it.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2.5">
          <Link to={homeTo}>
            <Button
              type="button"
              className="inline-flex h-10 cursor-pointer items-center justify-center rounded-lg bg-sl-logo px-4 text-[13px] font-semibold text-white outline-none focus-visible:ring-2 focus-visible:ring-sl-logo/40"
            >
              {signedIn ? 'Back to overview' : 'Back to sign in'}
            </Button>
          </Link>
          {signedIn && (
            <Link to="/dashboards">
              <Button
                type="button"
                className="inline-flex h-10 cursor-pointer items-center justify-center rounded-lg border border-sl-border bg-sl-surface px-4 text-[13px] text-sl-text outline-none focus-visible:ring-2 focus-visible:ring-sl-logo/40"
              >
                Browse dashboards
              </Button>
            </Link>
          )}
        </div>
      </main>

      <footer className="relative z-10 px-6 py-5 text-center text-[12px] text-sl-muted sm:px-10">
        © 2026 Advansys · SignaLens
      </footer>
    </div>
  )
}
