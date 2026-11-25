type SwitchProps = {
  checked: boolean
  onChange: (checked: boolean) => void
  'aria-label': string
  disabled?: boolean
}

export function Switch({
  checked,
  onChange,
  disabled = false,
  'aria-label': ariaLabel,
}: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={[
        'relative h-[22px] w-10 shrink-0 rounded-full transition-colors outline-none focus-visible:ring-2 focus-visible:ring-sl-logo/40',
        checked ? 'bg-sl-logo' : 'bg-sl-border',
        disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer',
      ].join(' ')}
    >
      <span
        aria-hidden="true"
        className={[
          'absolute top-[3px] size-4 rounded-full bg-white shadow transition-transform',
          checked ? 'left-[21px]' : 'left-[3px]',
        ].join(' ')}
      />
    </button>
  )
}
