type GraphSpinnerProps = {
  label?: string
  className?: string
  size?: number
}

/** Full-page dimmed overlay with a centered animated bar-chart spinner. */
export function GraphSpinner({
  label = 'Loading…',
  className = '',
  size = 40,
}: GraphSpinnerProps) {
  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-sl-text/45 backdrop-blur-[1px] ${className}`}
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label={label}
    >
      <div className="flex flex-col items-center gap-3 rounded-xl border border-sl-border bg-sl-surface px-7 py-6 shadow-lg">
        <svg
          width={size}
          height={size}
          viewBox="0 0 32 32"
          fill="none"
          aria-hidden="true"
          className="shrink-0 text-sl-logo"
        >
          <rect
            x="3"
            y="18"
            width="5"
            height="10"
            rx="1.5"
            fill="currentColor"
            className="origin-bottom animate-[sl-bar_0.9s_ease-in-out_infinite]"
            style={{ transformBox: 'fill-box', animationDelay: '0ms' }}
          />
          <rect
            x="11"
            y="10"
            width="5"
            height="18"
            rx="1.5"
            fill="currentColor"
            className="origin-bottom animate-[sl-bar_0.9s_ease-in-out_infinite]"
            style={{ transformBox: 'fill-box', animationDelay: '150ms' }}
          />
          <rect
            x="19"
            y="14"
            width="5"
            height="14"
            rx="1.5"
            fill="currentColor"
            className="origin-bottom animate-[sl-bar_0.9s_ease-in-out_infinite]"
            style={{ transformBox: 'fill-box', animationDelay: '300ms' }}
          />
          <rect
            x="27"
            y="6"
            width="5"
            height="22"
            rx="1.5"
            fill="currentColor"
            className="origin-bottom animate-[sl-bar_0.9s_ease-in-out_infinite]"
            style={{ transformBox: 'fill-box', animationDelay: '450ms' }}
          />
        </svg>
        <span className="text-[13px] font-medium text-sl-text">{label}</span>
      </div>
    </div>
  )
}
