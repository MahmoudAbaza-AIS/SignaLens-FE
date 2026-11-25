import type { ReactNode } from 'react'
import { useEffect } from 'react'
import { Button } from 'primereact/button'

type ModalProps = {
  open: boolean
  title: string
  onClose: () => void
  children: ReactNode
  footer?: ReactNode
}

export function Modal({ open, title, onClose, children, footer }: ModalProps) {
  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previous
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-sl-text/40"
        aria-label="Close dialog"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="relative z-10 w-full max-w-md rounded-xl border border-sl-border bg-sl-surface p-5 shadow-lg"
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <h2
            id="modal-title"
            className="text-[17px] font-semibold text-sl-text"
          >
            {title}
          </h2>
          <Button
            type="button"
            className="inline-flex size-8 cursor-pointer items-center justify-center rounded-lg border border-sl-border text-sl-muted outline-none focus-visible:ring-2 focus-visible:ring-sl-logo/40"
            aria-label="Close"
            onClick={onClose}
          >
            ×
          </Button>
        </div>
        <div className="flex flex-col gap-3">{children}</div>
        {footer && <div className="mt-5 flex justify-end gap-2">{footer}</div>}
      </div>
    </div>
  )
}
