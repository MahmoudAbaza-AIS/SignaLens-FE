import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Button } from 'primereact/button'
import { clearSession } from '@/modules/auth'
import { NAV_ITEMS, SignOutNavIcon } from '@/shared/navigation'

type SidebarProps = {
  collapsed: boolean
  mobile: boolean
  open: boolean
  onToggle: () => void
  onNavigate?: () => void
}

export function Sidebar({
  collapsed,
  mobile,
  open,
  onToggle,
  onNavigate,
}: SidebarProps) {
  const navigate = useNavigate()
  const rail = !mobile && collapsed
  const showLabels = mobile || !collapsed

  return (
    <aside
      id="app-sidebar"
      className={[
        'flex flex-col gap-1 overflow-hidden border-sl-border bg-sl-surface text-sl-text',
        'transition-[width,transform] duration-200 ease-out',
        mobile
          ? [
              'fixed inset-y-0 left-0 z-40 h-svh w-[min(220px,85vw)] border-r p-4 shadow-lg',
              open ? 'translate-x-0' : '-translate-x-full',
            ].join(' ')
          : [
              'sticky top-0 z-20 h-svh shrink-0 border-r',
              rail ? 'w-[72px] p-3' : 'w-[220px] p-4',
            ].join(' '),
      ].join(' ')}
      aria-label="Primary"
      aria-hidden={mobile && !open ? true : undefined}
      inert={mobile && !open ? true : undefined}
    >
      <div
        className={[
          'flex w-full items-center gap-2.5 overflow-hidden py-2',
          rail ? 'flex-col' : 'px-1',
        ].join(' ')}
      >
        <Link
          to="/"
          title="SignaLens overview"
          aria-label="SignaLens overview"
          onClick={onNavigate}
          className={[
            'flex shrink-0 items-center gap-2.5 rounded-lg no-underline outline-none focus-visible:ring-2 focus-visible:ring-sl-logo/40',
            rail ? 'justify-center' : '',
          ].join(' ')}
        >
          <div
            className="size-7 shrink-0 rounded-lg bg-sl-logo"
            aria-hidden="true"
          />
          {showLabels && (
            <span className="whitespace-nowrap text-[17px] font-semibold text-sl-text">
              SignaLens
            </span>
          )}
        </Link>
        {showLabels && <div className="min-w-px flex-1" />}
        <Button
          type="button"
          className="inline-flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-md border border-sl-border bg-sl-surface text-[15px] font-semibold text-sl-text outline-none focus-visible:ring-2 focus-visible:ring-sl-logo/40"
          aria-label={
            mobile
              ? 'Close navigation'
              : rail
                ? 'Expand sidebar'
                : 'Collapse sidebar'
          }
          aria-expanded={mobile ? open : !collapsed}
          aria-controls="app-sidebar"
          onClick={onToggle}
        >
          {mobile ? '×' : rail ? '»' : '«'}
        </Button>
      </div>

      <div className="h-3 w-2.5 shrink-0" aria-hidden="true" />

      <nav className="flex w-full flex-col gap-1" aria-label="Main">
        {NAV_ITEMS.map((item) => {
          const Icon = item.Icon
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              title={item.label}
              onClick={onNavigate}
              className={({ isActive }) =>
                [
                  'flex w-full items-center gap-2.5 rounded-lg py-[9px] text-[13px] no-underline outline-none transition-colors',
                  'focus-visible:ring-2 focus-visible:ring-sl-logo/40',
                  rail ? 'justify-center px-0' : 'px-3',
                  isActive
                    ? 'border-l-[3px] border-sl-logo bg-sl-active font-medium text-sl-logo'
                    : 'border-l-[3px] border-transparent text-sl-text hover:bg-sl-search',
                ].join(' ')
              }
            >
              <Icon className="size-[18px] shrink-0" />
              {showLabels ? (
                <span className="whitespace-nowrap">{item.label}</span>
              ) : (
                <span className="sr-only">{item.label}</span>
              )}
            </NavLink>
          )
        })}
      </nav>

      <div className="min-h-px flex-1" />

      <button
        type="button"
        className={[
          'flex w-full items-center gap-2.5 rounded-lg border border-sl-border py-[9px] text-[13px] text-sl-muted',
          'outline-none focus-visible:ring-2 focus-visible:ring-sl-logo/40',
          rail ? 'justify-center px-0' : 'px-3',
        ].join(' ')}
        title="Sign out"
        aria-label="Sign out"
        onClick={() => {
          clearSession()
          navigate('/login', { replace: true })
        }}
      >
        <SignOutNavIcon className="size-[18px] shrink-0" />
        {showLabels && <span className="whitespace-nowrap">Sign out</span>}
      </button>
    </aside>
  )
}
