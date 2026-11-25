import { Button } from 'primereact/button'
import { Switch } from '@/shared/components/ui/Switch'
import type { ThemePreference } from '@/shared/lib/preferences'

type PreferencesCardProps = {
  theme: ThemePreference
  onThemeChange: (theme: ThemePreference) => void
  sidebarCollapsed: boolean
  onSidebarCollapsedChange: (collapsed: boolean) => void
  dashboards: string[]
  defaultDashboard: string
  onDefaultDashboardChange: (name: string) => void
}

const THEMES: { id: ThemePreference; label: string }[] = [
  { id: 'light', label: '☀  Light' },
  { id: 'dark', label: '☾  Dark' },
  { id: 'system', label: 'System' },
]

export function PreferencesCard({
  theme,
  onThemeChange,
  sidebarCollapsed,
  onSidebarCollapsedChange,
  dashboards,
  defaultDashboard,
  onDefaultDashboardChange,
}: PreferencesCardProps) {
  return (
    <section className="flex w-full flex-col gap-3 rounded-xl border border-sl-border bg-sl-surface p-4">
      <h2 className="text-[15px] font-semibold text-sl-text">My preferences</h2>

      <p className="text-[12px] font-semibold text-sl-text">Theme</p>
      <div
        className="flex w-full gap-[3px] rounded-lg border border-sl-border bg-sl-search p-[3px]"
        role="group"
        aria-label="Theme"
      >
        {THEMES.map((option) => {
          const active = theme === option.id
          return (
            <Button
              key={option.id}
              type="button"
              className={[
                'flex min-w-0 flex-1 cursor-pointer items-center justify-center rounded-lg px-3.5 py-1.5 text-[12px] whitespace-pre outline-none focus-visible:ring-2 focus-visible:ring-sl-logo/40',
                active
                  ? 'bg-sl-logo font-semibold text-white'
                  : 'bg-transparent font-normal text-sl-text',
              ].join(' ')}
              aria-pressed={active}
              onClick={() => onThemeChange(option.id)}
            >
              {option.label}
            </Button>
          )
        })}
      </div>

      <div className="flex w-full items-center gap-2">
        <div className="min-w-0">
          <p className="text-[12px] font-semibold text-sl-text">
            Start with sidebar collapsed
          </p>
          <p className="text-[11px] text-sl-muted">Remembered per user</p>
        </div>
        <div className="min-w-px flex-1" />
        <Switch
          checked={sidebarCollapsed}
          onChange={onSidebarCollapsedChange}
          aria-label="Start with sidebar collapsed"
        />
      </div>

      <p className="text-[12px] font-semibold text-sl-text">Default dashboard</p>
      <label className="sr-only" htmlFor="default-dashboard">
        Default dashboard
      </label>
      <select
        id="default-dashboard"
        value={defaultDashboard}
        onChange={(event) => onDefaultDashboardChange(event.target.value)}
        className="h-9 w-full cursor-pointer rounded-lg border border-sl-border bg-sl-surface px-3.5 text-[13px] text-sl-text outline-none focus-visible:ring-2 focus-visible:ring-sl-logo/40"
      >
        {dashboards.map((name) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </select>
    </section>
  )
}
