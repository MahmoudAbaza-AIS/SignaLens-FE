import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { useMediaQuery } from '@/shared/hooks/useMediaQuery'
import { readSidebarCollapsed } from '@/shared/lib/preferences'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'

export function AppShell() {
  const isTabletUp = useMediaQuery('(min-width: 768px)')
  const isMobile = !isTabletUp

  const [preferCollapsed, setPreferCollapsed] = useState(() => {
    if (typeof window === 'undefined') return true
    if (localStorage.getItem('signalens.sidebarCollapsed') != null) {
      return readSidebarCollapsed()
    }
    return !window.matchMedia('(min-width: 1024px)').matches
  })
  const [mobileOpen, setMobileOpen] = useState(false)

  const collapsed = isMobile ? false : preferCollapsed
  const drawerOpen = isMobile && mobileOpen

  useEffect(() => {
    const onSidebar = (event: Event) => {
      setPreferCollapsed((event as CustomEvent<boolean>).detail)
    }
    window.addEventListener('signalens:sidebar', onSidebar)
    return () => window.removeEventListener('signalens:sidebar', onSidebar)
  }, [])

  useEffect(() => {
    if (!drawerOpen) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMobileOpen(false)
    }

    document.addEventListener('keydown', onKeyDown)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [drawerOpen])

  return (
    <div className="flex h-full min-h-svh w-full bg-sl-page text-sl-text">
      {drawerOpen && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-sl-text/40"
          aria-label="Close navigation overlay"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <Sidebar
        mobile={isMobile}
        open={drawerOpen}
        collapsed={collapsed}
        onToggle={() => {
          if (isMobile) setMobileOpen((prev) => !prev)
          else setPreferCollapsed((prev) => !prev)
        }}
        onNavigate={() => {
          if (isMobile) setMobileOpen(false)
        }}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          showMenuButton={isMobile}
          menuOpen={drawerOpen}
          onMenuClick={() => setMobileOpen(true)}
        />
        <main className="min-h-0 flex-1 overflow-auto bg-sl-page">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
