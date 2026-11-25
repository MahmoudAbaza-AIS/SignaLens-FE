import { Button } from 'primereact/button'
import { statusBadgeClass } from './mappers'
import type { UserRow } from './types'

type UsersTableProps = {
  users: UserRow[]
  onEdit: (user: UserRow) => void
  onSecondaryAction: (user: UserRow) => void
}

function secondaryLabel(user: UserRow): string {
  if (user.status === 'Locked') return 'Unlock'
  if (user.status === 'Inactive') return 'Activate'
  return 'Reset'
}

export function UsersTable({
  users,
  onEdit,
  onSecondaryAction,
}: UsersTableProps) {
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-sl-border bg-sl-surface">
      <table className="min-w-[720px] w-full border-collapse text-left">
        <thead>
          <tr className="bg-sl-search text-[11px] font-semibold text-sl-muted">
            <th className="px-4 py-2.5 font-semibold">Name</th>
            <th className="px-2 py-2.5 font-semibold">Email</th>
            <th className="w-[70px] px-2 py-2.5 font-semibold">Role</th>
            <th className="w-[70px] px-2 py-2.5 font-semibold">Status</th>
            <th className="w-[84px] px-2 py-2.5 font-semibold">Last login</th>
            <th className="w-[120px] px-2 py-2.5 font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 && (
            <tr>
              <td
                colSpan={6}
                className="px-4 py-8 text-center text-[13px] text-sl-muted"
              >
                No users match the current filters.
              </td>
            </tr>
          )}
          {users.map((user) => (
            <tr
              key={user.userId}
              className="border-t border-[#e0e5ed] text-[12px] text-sl-text"
            >
              <td className="whitespace-nowrap px-4 py-2.5">
                {user.displayName}
              </td>
              <td className="px-2 py-2.5">
                <span className="block max-w-[260px] truncate">{user.email}</span>
              </td>
              <td
                className={[
                  'w-[70px] whitespace-nowrap px-2 py-2.5',
                  user.role === 'Admin' ? 'font-semibold' : '',
                ].join(' ')}
              >
                {user.role}
              </td>
              <td className="w-[70px] px-2 py-2.5">
                <span
                  className={[
                    'inline-flex items-center rounded-[10px] border px-2 py-[3px] text-[11px] font-semibold',
                    statusBadgeClass(user.status),
                  ].join(' ')}
                >
                  {user.status}
                </span>
              </td>
              <td className="w-[84px] whitespace-nowrap px-2 py-2.5">
                {user.lastLogin}
              </td>
              <td className="w-[120px] px-2 py-2.5">
                <div className="flex items-center gap-1.5">
                  <Button
                    type="button"
                    className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-sl-border bg-sl-surface px-2 py-1 text-[11px] text-sl-text outline-none focus-visible:ring-2 focus-visible:ring-sl-logo/40"
                    onClick={() => onEdit(user)}
                  >
                    Edit
                  </Button>
                  <Button
                    type="button"
                    className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-sl-border bg-sl-surface px-2 py-1 text-[11px] text-sl-text outline-none focus-visible:ring-2 focus-visible:ring-sl-logo/40"
                    onClick={() => onSecondaryAction(user)}
                  >
                    {secondaryLabel(user)}
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
