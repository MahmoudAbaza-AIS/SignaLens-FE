import { useEffect, useId, useRef, useState } from 'react'
import { Button } from 'primereact/button'

export type TopbarDropdownOption = {
  value: string
  label: string
}

type TopbarDropdownProps = {
  labelPrefix: string
  options: TopbarDropdownOption[]
  value: string
  onChange: (value: string) => void
  'aria-label': string
  className?: string
}

export function TopbarDropdown({
  labelPrefix,
  options,
  value,
  onChange,
  'aria-label': ariaLabel,
  className = '',
}: TopbarDropdownProps) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const listId = useId()
  const selected = options.find((option) => option.value === value) ?? options[0]

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

  return (
    <div ref={rootRef} className={`relative hidden md:block ${className}`}>
      <Button
        type="button"
        className="inline-flex h-9 cursor-pointer items-center justify-center rounded-lg border border-sl-border bg-sl-surface px-3 text-[13px] whitespace-pre text-sl-text outline-none focus-visible:ring-2 focus-visible:ring-sl-logo/40 xl:px-3.5"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((prev) => !prev)}
      >
        {labelPrefix}: {selected?.label ?? '—'}  ▾
      </Button>

      {open && (
        <ul
          id={listId}
          role="listbox"
          aria-label={ariaLabel}
          className="absolute top-[calc(100%+6px)] right-0 z-50 min-w-full overflow-hidden rounded-lg border border-sl-border bg-sl-surface py-1 shadow-lg"
        >
          {options.map((option) => {
            const active = option.value === selected?.value
            return (
              <li key={option.value} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={active}
                  className={[
                    'flex w-full cursor-pointer items-center px-3 py-2 text-left text-[13px] whitespace-nowrap outline-none',
                    'focus-visible:bg-sl-active focus-visible:text-sl-logo',
                    active
                      ? 'bg-sl-active font-semibold text-sl-logo'
                      : 'text-sl-text hover:bg-sl-search',
                  ].join(' ')}
                  onClick={() => {
                    onChange(option.value)
                    setOpen(false)
                  }}
                >
                  {option.label}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
