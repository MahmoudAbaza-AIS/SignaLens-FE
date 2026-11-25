import { useEffect, useId, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { clearSession, readSession } from '@/modules/auth'

type AccountMenuProps = {
  displayName: string
}

export function AccountMenu({ displayName }: AccountMenuProps) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const menuId = useId()
  const navigate = useNavigate()
  const email = readSession()?.email
  const initial = displayName.trim().charAt(0).toUpperCase() || 'U'

  useEffect(() => {
    if (!open) return

    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  function go(path: string) {
    setOpen(false)
    navigate(path)
  }

  function logout() {
    setOpen(false)
    clearSession()
    navigate('/login', { replace: true })
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        className="inline-flex cursor-pointer items-center gap-2 rounded-lg px-1 py-1 outline-none hover:bg-sl-search focus-visible:ring-2 focus-visible:ring-sl-logo/40 sm:px-1.5"
        aria-label={`Account menu for ${displayName}`}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className="inline-flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-sl-border text-[12px] font-semibold text-sl-muted sm:size-[30px]">
          {initial}
        </span>
        <span className="hidden text-[13px] font-semibold text-sl-text lg:inline">
          {displayName}
        </span>
        <span className="hidden text-[11px] text-sl-muted lg:inline" aria-hidden="true">
          ▾
        </span>
      </button>

      {open && (
        <div
          id={menuId}
          role="menu"
          aria-label="Account"
          className="absolute top-[calc(100%+6px)] right-0 z-50 min-w-[220px] overflow-hidden rounded-lg border border-sl-border bg-sl-surface py-1 shadow-lg"
        >
          <div className="border-b border-sl-border px-3 py-2.5">
            <p className="truncate text-[13px] font-semibold text-sl-text">
              {displayName}
            </p>
            {email && (
              <p className="truncate text-[11px] text-sl-muted">{email}</p>
            )}
          </div>

          <button
            type="button"
            role="menuitem"
            className="flex w-full cursor-pointer items-center px-3 py-2 text-left text-[13px] text-sl-text outline-none hover:bg-sl-search focus-visible:bg-sl-active focus-visible:text-sl-logo"
            onClick={() => go('/users-settings?tab=users')}
          >
            Account settings
          </button>
          <button
            type="button"
            role="menuitem"
            className="flex w-full cursor-pointer items-center px-3 py-2 text-left text-[13px] text-sl-text outline-none hover:bg-sl-search focus-visible:bg-sl-active focus-visible:text-sl-logo"
            onClick={() => go('/users-settings?tab=preferences')}
          >
            Preferences
          </button>

          <div className="my-1 border-t border-sl-border" />

          <button
            type="button"
            role="menuitem"
            className="flex w-full cursor-pointer items-center px-3 py-2 text-left text-[13px] font-semibold text-[#c62828] outline-none hover:bg-[#c62828]/10 focus-visible:bg-[#c62828]/10 dark:text-[#f07178] dark:hover:bg-[#c62828]/20"
            onClick={logout}
          >
            Log out
          </button>
        </div>
      )}
    </div>
  )
}
