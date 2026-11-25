import { Button } from 'primereact/button'
import { Switch } from '@/shared/components/ui/Switch'
import type { ProviderRow } from './types'

type LlmProvidersCardProps = {
  providers: ProviderRow[]
  busyId?: number | null
  onToggle: (provider: ProviderRow, next: boolean) => void
  onAdd: () => void
}

export function LlmProvidersCard({
  providers,
  busyId = null,
  onToggle,
  onAdd,
}: LlmProvidersCardProps) {
  return (
    <section className="flex w-full flex-col gap-2.5 rounded-xl border border-sl-border bg-sl-surface p-4">
      <h2 className="text-[15px] font-semibold text-sl-text">LLM providers</h2>

      {providers.length === 0 && (
        <p className="py-2 text-[13px] text-sl-muted">No providers configured.</p>
      )}

      {providers.map((provider) => (
        <div
          key={provider.providerId}
          className="flex w-full items-center gap-2.5 py-1"
        >
          <div className="min-w-0">
            <p className="truncate text-[13px] font-semibold text-sl-text">
              {provider.name}
            </p>
            <p className="truncate text-[11px] text-sl-muted">
              {provider.modelName}
            </p>
          </div>
          <div className="min-w-px flex-1" />
          <Switch
            checked={provider.isActive}
            disabled={busyId === provider.providerId}
            onChange={(next) => onToggle(provider, next)}
            aria-label={`Toggle ${provider.name}`}
          />
        </div>
      ))}

      <Button
        type="button"
        className="mt-1 inline-flex h-9 w-full cursor-pointer items-center justify-center rounded-lg border border-sl-border bg-sl-surface text-[13px] text-sl-text outline-none focus-visible:ring-2 focus-visible:ring-sl-logo/40"
        onClick={onAdd}
      >
        + Add provider
      </Button>
    </section>
  )
}
