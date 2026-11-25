import { useEffect, useMemo, useState, type ChangeEvent } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { apiClient } from '@/shared/lib/api/client'
import {
  applyTheme,
  readDefaultDashboard,
  readSidebarCollapsed,
  readTheme,
  writeDefaultDashboard,
  writeSidebarCollapsed,
  writeTheme,
  type ThemePreference,
} from '@/shared/lib/preferences'
import {
  llmLabelForValue,
  llmValueForProviderName,
  readLlmProvider,
  writeLlmProvider,
} from '@/shared/lib/topbarPrefs'
import { GraphSpinner } from '@/shared/components/ui/GraphSpinner'
import { Modal } from '@/shared/components/ui/Modal'
import { LlmProvidersCard } from '../components/LlmProvidersCard'
import { PreferencesCard } from '../components/PreferencesCard'
import { UsersTable } from '../components/UsersTable'
import { mapApiProvider, mapApiUser } from '../components/mappers'
import {
  SEED_DASHBOARDS,
  SEED_PROVIDERS,
  SEED_USERS,
} from '../components/seed'
import type {
  ProviderRow,
  SettingsTab,
  UserRow,
  UserStatus,
} from '../components/types'

const ROLES = ['all', 'Admin', 'Engineer', 'Viewer'] as const

const fieldClass =
  'h-9 w-full rounded-lg border border-sl-border bg-sl-surface px-3 text-[13px] text-sl-text outline-none focus-visible:ring-2 focus-visible:ring-sl-logo/40'
const selectClass =
  'h-9 cursor-pointer rounded-lg border border-sl-border bg-sl-surface px-3.5 text-[13px] text-sl-text outline-none focus-visible:ring-2 focus-visible:ring-sl-logo/40'

function withSelectedLlmProvider(
  rows: ProviderRow[],
  llmValue: string,
): ProviderRow[] {
  const label = llmLabelForValue(llmValue).toLowerCase()
  return rows.map((row) => ({
    ...row,
    isActive: row.name.trim().toLowerCase() === label,
  }))
}

function tabFromSearch(value: string | null): SettingsTab {
  if (value === 'llm' || value === 'preferences' || value === 'users') return value
  return 'users'
}

export function UsersSettingsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const tab = tabFromSearch(searchParams.get('tab'))
  const [users, setUsers] = useState<UserRow[]>(SEED_USERS)
  const [providers, setProviders] = useState<ProviderRow[]>(() =>
    withSelectedLlmProvider(SEED_PROVIDERS, readLlmProvider()),
  )
  const [dashboards, setDashboards] = useState<string[]>(SEED_DASHBOARDS)
  const [usingSeed, setUsingSeed] = useState(true)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [busyProviderId, setBusyProviderId] = useState<number | null>(null)

  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<(typeof ROLES)[number]>('all')
  // Figma default is "Status: active"
  const [status, setStatus] = useState<'all' | UserStatus>('Active')

  const [theme, setTheme] = useState<ThemePreference>(() => readTheme())
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() =>
    readSidebarCollapsed(),
  )
  const [defaultDashboard, setDefaultDashboard] = useState(() =>
    readDefaultDashboard(),
  )

  const [inviteOpen, setInviteOpen] = useState(false)
  const [editUser, setEditUser] = useState<UserRow | null>(null)
  const [addProviderOpen, setAddProviderOpen] = useState(false)
  const [saving, setSaving] = useState(false)

  const [inviteForm, setInviteForm] = useState({
    displayName: '',
    email: '',
    role: 'Viewer',
  })
  const [editForm, setEditForm] = useState({
    displayName: '',
    email: '',
    role: 'Viewer',
    isActive: true,
  })
  const [providerForm, setProviderForm] = useState({
    name: '',
    modelName: '',
    isActive: false,
  })

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  useEffect(() => {
    let cancelled = false
    const controller = new AbortController()
    const timeoutId = window.setTimeout(() => controller.abort(), 4000)

    async function load() {
      setLoading(true)
      setError(null)

      try {
        const [usersRes, providersRes, dashboardsRes] = await Promise.all([
          apiClient.GET('/Users', { signal: controller.signal }),
          apiClient.GET('/LlmProviders', { signal: controller.signal }),
          apiClient.GET('/Dashboards', { signal: controller.signal }),
        ])

        if (cancelled) return

        const apiUsers = usersRes.data?.map(mapApiUser)
        const apiProviders = providersRes.data?.map(mapApiProvider)
        const apiDashboards =
          dashboardsRes.data
            ?.map((d) => d.name?.trim())
            .filter((name): name is string => Boolean(name)) ?? []

        const hasUsers = !usersRes.error && Array.isArray(usersRes.data)
        const hasProviders =
          !providersRes.error && Array.isArray(providersRes.data)

        if (hasUsers && apiUsers) {
          setUsers(apiUsers.length > 0 ? apiUsers : [])
        } else {
          setUsers(SEED_USERS)
        }

        const selectedLlm = readLlmProvider()
        if (hasProviders && apiProviders) {
          setProviders(
            withSelectedLlmProvider(
              apiProviders.length > 0 ? apiProviders : [],
              selectedLlm,
            ),
          )
        } else {
          setProviders(withSelectedLlmProvider(SEED_PROVIDERS, selectedLlm))
        }

        if (apiDashboards.length > 0) setDashboards(apiDashboards)
        else setDashboards(SEED_DASHBOARDS)

        const live = hasUsers || hasProviders
        setUsingSeed(!live)
        if (!live) {
          setError(
            'API unreachable — showing wireframe sample data. Start the backend and set VITE_API_BASE_URL to load live users.',
          )
        }
      } catch {
        if (cancelled) return
        setUsers(SEED_USERS)
        setProviders(
          withSelectedLlmProvider(SEED_PROVIDERS, readLlmProvider()),
        )
        setDashboards(SEED_DASHBOARDS)
        setUsingSeed(true)
        setError(
          'API unreachable — showing wireframe sample data. Start the backend and set VITE_API_BASE_URL to load live users.',
        )
      } finally {
        window.clearTimeout(timeoutId)
        if (!cancelled) setLoading(false)
      }
    }

    void load()
    return () => {
      cancelled = true
      controller.abort()
      window.clearTimeout(timeoutId)
    }
  }, [])

  useEffect(() => {
    const onLlm = (event: Event) => {
      const value = (event as CustomEvent<string>).detail
      setProviders((prev) => withSelectedLlmProvider(prev, value))
    }
    window.addEventListener('signalens:llm', onLlm)
    return () => window.removeEventListener('signalens:llm', onLlm)
  }, [])

  const filteredUsers = useMemo(() => {
    const q = search.trim().toLowerCase()
    return users.filter((user) => {
      const matchesQuery =
        !q ||
        user.displayName.toLowerCase().includes(q) ||
        user.email.toLowerCase().includes(q)
      const matchesRole = roleFilter === 'all' || user.role === roleFilter
      const matchesStatus = status === 'all' || user.status === status
      return matchesQuery && matchesRole && matchesStatus
    })
  }, [users, search, roleFilter, status])

  function showNotice(message: string) {
    setNotice(message)
    window.setTimeout(() => setNotice(null), 3500)
  }

  async function handleInvite() {
    if (!inviteForm.displayName.trim() || !inviteForm.email.trim()) {
      showNotice('Name and email are required.')
      return
    }

    setSaving(true)
    const body = {
      displayName: inviteForm.displayName.trim(),
      email: inviteForm.email.trim(),
      role: inviteForm.role,
      isActive: true,
      createdAtUtc: new Date().toISOString(),
    }

    const { data, error: apiError } = await apiClient.POST('/Users', { body })
    setSaving(false)

    if (apiError || data == null) {
      const local: UserRow = {
        userId: crypto.randomUUID(),
        displayName: body.displayName,
        email: body.email,
        role: body.role,
        status: 'Active',
        lastLogin: '—',
        isActive: true,
        createdAtUtc: body.createdAtUtc,
      }
      setUsers((prev) => [local, ...prev])
      showNotice(
        usingSeed
          ? 'User added locally (API unavailable).'
          : 'Invite failed on API — added locally for this session.',
      )
    } else {
      const id = typeof data === 'string' ? data : crypto.randomUUID()
      setUsers((prev) => [
        {
          userId: id,
          displayName: body.displayName,
          email: body.email,
          role: body.role,
          status: 'Active',
          lastLogin: '—',
          isActive: true,
          createdAtUtc: body.createdAtUtc,
        },
        ...prev,
      ])
      showNotice('User invited.')
    }

    setInviteOpen(false)
    setInviteForm({ displayName: '', email: '', role: 'Viewer' })
  }

  async function handleSaveEdit() {
    if (!editUser) return
    setSaving(true)

    const nextStatus: UserStatus = editForm.isActive ? 'Active' : 'Inactive'

    const body = {
      userId: editUser.userId,
      displayName: editForm.displayName.trim(),
      email: editForm.email.trim(),
      role: editForm.role,
      isActive: editForm.isActive,
      createdAtUtc: editUser.createdAtUtc ?? new Date().toISOString(),
    }

    if (!editUser.userId.startsWith('seed-')) {
      await apiClient.PUT('/Users/{id}', {
        params: { path: { id: editUser.userId } },
        body,
      })
    }

    setUsers((prev) =>
      prev.map((user) =>
        user.userId === editUser.userId
          ? {
              ...user,
              displayName: body.displayName,
              email: body.email,
              role: body.role,
              isActive: body.isActive,
              status: nextStatus,
            }
          : user,
      ),
    )

    setSaving(false)
    setEditUser(null)
    showNotice('User updated.')
  }

  async function handleSecondaryAction(user: UserRow) {
    if (user.status === 'Active') {
      showNotice(
        `Password reset for ${user.displayName} is not available from the API yet.`,
      )
      return
    }

    const body = {
      userId: user.userId,
      displayName: user.displayName,
      email: user.email,
      role: user.role,
      isActive: true,
      createdAtUtc: user.createdAtUtc ?? new Date().toISOString(),
    }

    if (!user.userId.startsWith('seed-')) {
      await apiClient.PUT('/Users/{id}', {
        params: { path: { id: user.userId } },
        body,
      })
    }

    setUsers((prev) =>
      prev.map((row) =>
        row.userId === user.userId
          ? { ...row, isActive: true, status: 'Active' }
          : row,
      ),
    )
    showNotice(
      user.status === 'Locked'
        ? `${user.displayName} unlocked.`
        : `${user.displayName} activated.`,
    )
  }

  async function handleToggleProvider(provider: ProviderRow, next: boolean) {
    setBusyProviderId(provider.providerId)

    if (next) {
      const llmValue = llmValueForProviderName(provider.name)
      const nextRows = providers.map((row) => ({
        ...row,
        isActive: row.providerId === provider.providerId,
      }))

      if (provider.providerId > 0 && !usingSeed) {
        await Promise.all(
          nextRows
            .filter((row) => row.providerId > 0)
            .map((row) =>
              apiClient.PUT('/LlmProviders/{id}', {
                params: { path: { id: row.providerId } },
                body: {
                  providerId: row.providerId,
                  name: row.name,
                  modelName: row.modelName,
                  isActive: row.isActive,
                },
              }),
            ),
        )
      }

      setProviders(nextRows)
      if (llmValue) writeLlmProvider(llmValue)
      setBusyProviderId(null)
      return
    }

    const body = {
      providerId: provider.providerId,
      name: provider.name,
      modelName: provider.modelName,
      isActive: false,
    }

    if (provider.providerId > 0 && !usingSeed) {
      await apiClient.PUT('/LlmProviders/{id}', {
        params: { path: { id: provider.providerId } },
        body,
      })
    }

    setProviders((prev) =>
      prev.map((row) =>
        row.providerId === provider.providerId
          ? { ...row, isActive: false }
          : row,
      ),
    )
    setBusyProviderId(null)
  }

  async function handleAddProvider() {
    if (!providerForm.name.trim()) {
      showNotice('Provider name is required.')
      return
    }

    setSaving(true)
    const body = {
      name: providerForm.name.trim(),
      modelName: providerForm.modelName.trim() || undefined,
      isActive: providerForm.isActive,
    }

    const { data, error: apiError } = await apiClient.POST('/LlmProviders', {
      body,
    })
    setSaving(false)

    const id =
      typeof data === 'number'
        ? data
        : Math.max(0, ...providers.map((p) => p.providerId)) + 1

    setProviders((prev) => [
      ...prev,
      {
        providerId: apiError ? id : id,
        name: body.name,
        modelName: body.modelName ?? '—',
        isActive: body.isActive,
      },
    ])
    setAddProviderOpen(false)
    setProviderForm({ name: '', modelName: '', isActive: false })
    showNotice(apiError ? 'Provider added locally.' : 'Provider added.')
  }

  const tabs: { id: SettingsTab; label: string }[] = [
    { id: 'users', label: 'Users' },
    { id: 'llm', label: 'LLM providers' },
    { id: 'preferences', label: 'Preferences' },
  ]

  return (
    <div className="flex flex-col gap-4 p-4 sm:p-5 lg:p-6">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-[22px] font-semibold text-sl-text">
          Users & Settings
        </h1>
        <div className="min-w-px flex-1" />
        <Button
          type="button"
          className="inline-flex h-[34px] cursor-pointer items-center justify-center rounded-lg bg-sl-logo px-3.5 text-[13px] font-semibold text-white outline-none focus-visible:ring-2 focus-visible:ring-sl-logo/40"
          onClick={() => setInviteOpen(true)}
        >
          + Invite user
        </Button>
      </div>

      <div
        className="inline-flex w-fit gap-1 rounded-[10px] border border-sl-border bg-sl-surface p-1"
        role="tablist"
        aria-label="Settings sections"
      >
        {tabs.map((item) => {
          const active = tab === item.id
          return (
            <Button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={active}
              className={[
                'inline-flex cursor-pointer items-center justify-center rounded-lg px-3.5 py-[7px] text-[13px] outline-none focus-visible:ring-2 focus-visible:ring-sl-logo/40',
                active
                  ? 'bg-sl-logo font-semibold text-white'
                  : 'bg-sl-surface font-normal text-sl-text',
              ].join(' ')}
              onClick={() => {
                setSearchParams(
                  item.id === 'users' ? {} : { tab: item.id },
                  { replace: true },
                )
              }}
            >
              {item.label}
            </Button>
          )
        })}
      </div>

      {(loading || saving) && (
        <GraphSpinner
          label={loading ? 'Loading users & settings…' : 'Saving…'}
        />
      )}

      {(error || notice) && !loading && (
        <div className="flex flex-col gap-2">
          {error && (
            <p className="rounded-lg border border-[#bf730d]/40 bg-[#bf730d]/10 px-3 py-2 text-[13px] text-[#bf730d]">
              {error}
            </p>
          )}
          {notice && (
            <p className="rounded-lg border border-sl-logo/30 bg-sl-active px-3 py-2 text-[13px] text-sl-logo">
              {notice}
            </p>
          )}
        </div>
      )}

      <div className="flex flex-col gap-4 xl:flex-row xl:items-start">
        <div className="flex min-w-0 flex-1 flex-col gap-2.5">
          {tab === 'users' && (
            <>
              <div className="flex flex-wrap items-center gap-2">
                <InputText
                  type="search"
                  value={search}
                  onChange={(event: ChangeEvent<HTMLInputElement>) =>
                    setSearch(event.currentTarget.value)
                  }
                  placeholder="Search users…"
                  aria-label="Search users"
                  className="h-9 w-full max-w-[220px] rounded-lg border border-sl-border bg-sl-surface px-3 text-[13px] text-sl-text placeholder:text-sl-muted outline-none focus-visible:ring-2 focus-visible:ring-sl-logo/40"
                />
                <label className="sr-only" htmlFor="role-filter">
                  Role filter
                </label>
                <select
                  id="role-filter"
                  className={selectClass}
                  value={roleFilter}
                  onChange={(event) =>
                    setRoleFilter(event.target.value as (typeof ROLES)[number])
                  }
                >
                  {ROLES.map((role) => (
                    <option key={role} value={role}>
                      {role === 'all' ? 'Role: all' : role}
                    </option>
                  ))}
                </select>
                <label className="sr-only" htmlFor="status-filter">
                  Status filter
                </label>
                <select
                  id="status-filter"
                  className={selectClass}
                  value={status}
                  onChange={(event) =>
                    setStatus(event.target.value as 'all' | UserStatus)
                  }
                >
                  <option value="all">Status: all</option>
                  <option value="Active">Status: active</option>
                  <option value="Locked">Status: locked</option>
                  <option value="Inactive">Status: inactive</option>
                </select>
              </div>
              <UsersTable
                users={filteredUsers}
                onEdit={(user) => {
                  setEditUser(user)
                  setEditForm({
                    displayName: user.displayName,
                    email: user.email,
                    role: user.role,
                    isActive: user.isActive || user.status === 'Locked',
                  })
                }}
                onSecondaryAction={(user) => {
                  void handleSecondaryAction(user)
                }}
              />
            </>
          )}

          {tab === 'llm' && (
            <LlmProvidersCard
              providers={providers}
              busyId={busyProviderId}
              onToggle={(provider, next) => {
                void handleToggleProvider(provider, next)
              }}
              onAdd={() => setAddProviderOpen(true)}
            />
          )}

          {tab === 'preferences' && (
            <div className="max-w-md">
              <PreferencesCard
                theme={theme}
                onThemeChange={(next) => {
                  setTheme(next)
                  writeTheme(next)
                }}
                sidebarCollapsed={sidebarCollapsed}
                onSidebarCollapsedChange={(next) => {
                  setSidebarCollapsed(next)
                  writeSidebarCollapsed(next)
                }}
                dashboards={dashboards}
                defaultDashboard={
                  dashboards.includes(defaultDashboard)
                    ? defaultDashboard
                    : (dashboards[0] ?? 'Plant Overview')
                }
                onDefaultDashboardChange={(name) => {
                  setDefaultDashboard(name)
                  writeDefaultDashboard(name)
                }}
              />
            </div>
          )}
        </div>

        {tab === 'users' && (
          <aside className="flex w-full shrink-0 flex-col gap-4 xl:w-[340px]">
            <PreferencesCard
              theme={theme}
              onThemeChange={(next) => {
                setTheme(next)
                writeTheme(next)
              }}
              sidebarCollapsed={sidebarCollapsed}
              onSidebarCollapsedChange={(next) => {
                setSidebarCollapsed(next)
                writeSidebarCollapsed(next)
              }}
              dashboards={dashboards}
              defaultDashboard={
                dashboards.includes(defaultDashboard)
                  ? defaultDashboard
                  : (dashboards[0] ?? 'Plant Overview')
              }
              onDefaultDashboardChange={(name) => {
                setDefaultDashboard(name)
                writeDefaultDashboard(name)
              }}
            />
            <LlmProvidersCard
              providers={providers}
              busyId={busyProviderId}
              onToggle={(provider, next) => {
                void handleToggleProvider(provider, next)
              }}
              onAdd={() => setAddProviderOpen(true)}
            />
          </aside>
        )}
      </div>

      <Modal
        open={inviteOpen}
        title="Invite user"
        onClose={() => setInviteOpen(false)}
        footer={
          <>
            <Button
              type="button"
              className="inline-flex h-9 cursor-pointer items-center rounded-lg border border-sl-border px-3.5 text-[13px] text-sl-text"
              onClick={() => setInviteOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="inline-flex h-9 cursor-pointer items-center rounded-lg bg-sl-logo px-3.5 text-[13px] font-semibold text-white disabled:opacity-60"
              disabled={saving}
              onClick={() => {
                void handleInvite()
              }}
            >
              Send invite
            </Button>
          </>
        }
      >
        <label className="text-[12px] font-semibold text-sl-text" htmlFor="invite-name">
          Name
        </label>
        <InputText
          id="invite-name"
          className={fieldClass}
          value={inviteForm.displayName}
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            const displayName = event.currentTarget.value
            setInviteForm((prev) => ({ ...prev, displayName }))
          }}
        />
        <label className="text-[12px] font-semibold text-sl-text" htmlFor="invite-email">
          Email
        </label>
        <InputText
          id="invite-email"
          type="email"
          className={fieldClass}
          value={inviteForm.email}
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            const email = event.currentTarget.value
            setInviteForm((prev) => ({ ...prev, email }))
          }}
        />
        <label className="text-[12px] font-semibold text-sl-text" htmlFor="invite-role">
          Role
        </label>
        <select
          id="invite-role"
          className={fieldClass}
          value={inviteForm.role}
          onChange={(event) => {
            const role = event.target.value
            setInviteForm((prev) => ({ ...prev, role }))
          }}
        >
          <option value="Admin">Admin</option>
          <option value="Engineer">Engineer</option>
          <option value="Viewer">Viewer</option>
        </select>
      </Modal>

      <Modal
        open={Boolean(editUser)}
        title="Edit user"
        onClose={() => setEditUser(null)}
        footer={
          <>
            <Button
              type="button"
              className="inline-flex h-9 cursor-pointer items-center rounded-lg border border-sl-border px-3.5 text-[13px] text-sl-text"
              onClick={() => setEditUser(null)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="inline-flex h-9 cursor-pointer items-center rounded-lg bg-sl-logo px-3.5 text-[13px] font-semibold text-white disabled:opacity-60"
              disabled={saving}
              onClick={() => {
                void handleSaveEdit()
              }}
            >
              Save changes
            </Button>
          </>
        }
      >
        <label className="text-[12px] font-semibold text-sl-text" htmlFor="edit-name">
          Name
        </label>
        <InputText
          id="edit-name"
          className={fieldClass}
          value={editForm.displayName}
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            const displayName = event.currentTarget.value
            setEditForm((prev) => ({ ...prev, displayName }))
          }}
        />
        <label className="text-[12px] font-semibold text-sl-text" htmlFor="edit-email">
          Email
        </label>
        <InputText
          id="edit-email"
          type="email"
          className={fieldClass}
          value={editForm.email}
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            const email = event.currentTarget.value
            setEditForm((prev) => ({ ...prev, email }))
          }}
        />
        <label className="text-[12px] font-semibold text-sl-text" htmlFor="edit-role">
          Role
        </label>
        <select
          id="edit-role"
          className={fieldClass}
          value={editForm.role}
          onChange={(event) => {
            const role = event.target.value
            setEditForm((prev) => ({ ...prev, role }))
          }}
        >
          <option value="Admin">Admin</option>
          <option value="Engineer">Engineer</option>
          <option value="Viewer">Viewer</option>
        </select>
        <label className="flex items-center gap-2 text-[13px] text-sl-text">
          <input
            type="checkbox"
            checked={editForm.isActive}
            onChange={(event) => {
              const isActive = event.target.checked
              setEditForm((prev) => ({ ...prev, isActive }))
            }}
          />
          Active
        </label>
      </Modal>

      <Modal
        open={addProviderOpen}
        title="Add provider"
        onClose={() => setAddProviderOpen(false)}
        footer={
          <>
            <Button
              type="button"
              className="inline-flex h-9 cursor-pointer items-center rounded-lg border border-sl-border px-3.5 text-[13px] text-sl-text"
              onClick={() => setAddProviderOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="inline-flex h-9 cursor-pointer items-center rounded-lg bg-sl-logo px-3.5 text-[13px] font-semibold text-white disabled:opacity-60"
              disabled={saving}
              onClick={() => {
                void handleAddProvider()
              }}
            >
              Add provider
            </Button>
          </>
        }
      >
        <label className="text-[12px] font-semibold text-sl-text" htmlFor="provider-name">
          Name
        </label>
        <InputText
          id="provider-name"
          className={fieldClass}
          value={providerForm.name}
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            const name = event.currentTarget.value
            setProviderForm((prev) => ({ ...prev, name }))
          }}
        />
        <label className="text-[12px] font-semibold text-sl-text" htmlFor="provider-model">
          Model / details
        </label>
        <InputText
          id="provider-model"
          className={fieldClass}
          placeholder="e.g. qwen2.5-coder · on-prem"
          value={providerForm.modelName}
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            const modelName = event.currentTarget.value
            setProviderForm((prev) => ({ ...prev, modelName }))
          }}
        />
        <label className="flex items-center gap-2 text-[13px] text-sl-text">
          <input
            type="checkbox"
            checked={providerForm.isActive}
            onChange={(event) => {
              const isActive = event.target.checked
              setProviderForm((prev) => ({ ...prev, isActive }))
            }}
          />
          Active
        </label>
      </Modal>
    </div>
  )
}
