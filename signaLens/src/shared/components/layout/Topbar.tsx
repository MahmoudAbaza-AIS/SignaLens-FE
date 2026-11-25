import { useEffect, useState } from 'react'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'
import { readSession } from '@/modules/auth'
import {
  applyTheme,
  readTheme,
  writeTheme,
  type ThemePreference,
} from '@/shared/lib/preferences'
import {
  LLM_OPTIONS,
  REFRESH_OPTIONS,
  readLlmProvider,
  readRefreshSeconds,
  writeLlmProvider,
  writeRefreshSeconds,
} from '@/shared/lib/topbarPrefs'
import { AccountMenu } from '@/shared/components/ui/AccountMenu'
import { TopbarDropdown } from '@/shared/components/ui/TopbarDropdown'

type TopbarProps = {
  showMenuButton?: boolean
  menuOpen?: boolean
  onMenuClick?: () => void
}

export function Topbar({
  showMenuButton = false,
  menuOpen = false,
  onMenuClick,
}: TopbarProps) {
  const [theme, setTheme] = useState<ThemePreference>(() => readTheme())
  const [displayName, setDisplayName] = useState(
    () => readSession()?.displayName ?? 'Mahmoud Abaza',
  )
  const [llm, setLlm] = useState(() => readLlmProvider())
  const [refresh, setRefresh] = useState(() => readRefreshSeconds())

  const darkMode =
    theme === 'dark' ||
    (theme === 'system' &&
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches)

  useEffect(() => {
    const onTheme = (event: Event) => {
      setTheme((event as CustomEvent<ThemePreference>).detail)
    }
    const onAuth = () => {
      setDisplayName(readSession()?.displayName ?? 'Mahmoud Abaza')
    }
    const onLlm = (event: Event) => {
      setLlm((event as CustomEvent<string>).detail)
    }
    window.addEventListener('signalens:theme', onTheme)
    window.addEventListener('signalens:auth', onAuth)
    window.addEventListener('signalens:llm', onLlm)
    return () => {
      window.removeEventListener('signalens:theme', onTheme)
      window.removeEventListener('signalens:auth', onAuth)
      window.removeEventListener('signalens:llm', onLlm)
    }
  }, [])

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  return (
    <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b border-sl-border bg-sl-surface px-3 sm:h-16 sm:gap-2.5 sm:px-4 md:px-5 lg:px-6 xl:px-8">
      {showMenuButton && (
        <Button
          type="button"
          className="inline-flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-sl-border bg-sl-surface text-sl-text outline-none focus-visible:ring-2 focus-visible:ring-sl-logo/40"
          aria-label="Open navigation"
          aria-controls="app-sidebar"
          aria-expanded={menuOpen}
          onClick={onMenuClick}
        >
          <span className="flex flex-col gap-1" aria-hidden="true">
            <span className="block h-0.5 w-4 rounded-full bg-current" />
            <span className="block h-0.5 w-4 rounded-full bg-current" />
            <span className="block h-0.5 w-4 rounded-full bg-current" />
          </span>
        </Button>
      )}

      <InputText
        type="search"
        placeholder="Search assets, tags, dashboards…"
        aria-label="Search assets, tags, dashboards"
        className="h-9 min-w-0 flex-1 rounded-lg border border-sl-border bg-sl-search px-3 text-[13px] text-sl-text placeholder:text-sl-muted outline-none focus-visible:ring-2 focus-visible:ring-sl-logo/40 sm:max-w-[240px] md:max-w-[280px] lg:max-w-[320px] xl:max-w-[360px]"
      />

      <div className="hidden min-w-px flex-1 sm:block" />

      <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2.5">
        <TopbarDropdown
          labelPrefix="LLM"
          aria-label="LLM provider"
          options={[...LLM_OPTIONS]}
          value={llm}
          onChange={(value) => {
            setLlm(value)
            writeLlmProvider(value)
          }}
        />

        <TopbarDropdown
          labelPrefix="Refresh"
          aria-label="Refresh interval"
          options={[...REFRESH_OPTIONS]}
          value={refresh}
          onChange={(value) => {
            setRefresh(value)
            writeRefreshSeconds(value)
          }}
        />

        <Button
          type="button"
          className="inline-flex size-9 cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-sl-border bg-sl-surface text-[13px] whitespace-pre text-sl-text outline-none focus-visible:ring-2 focus-visible:ring-sl-logo/40 sm:h-9 sm:w-auto sm:px-3 xl:px-3.5"
          aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          aria-pressed={darkMode}
          onClick={() => {
            const next: ThemePreference = darkMode ? 'light' : 'dark'
            setTheme(next)
            writeTheme(next)
          }}
        >
          <span aria-hidden="true">{darkMode ? '☀' : '☾'}</span>
          <span className="hidden md:inline">
            {darkMode ? 'Light mode' : 'Dark mode'}
          </span>
        </Button>

        <AccountMenu displayName={displayName} />
      </div>
    </header>
  )
}
