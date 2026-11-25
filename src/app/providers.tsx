import type { ReactNode } from 'react'
import { PrimeReactProvider } from '@primereact/core'

type AppProvidersProps = {
  children: ReactNode
}

/**
 * PrimeReact unstyled primitives require PrimeReactProvider.
 * Pass VITE_PRIMEUI_LICENSE (Community or Commercial) to silence the
 * “Invalid PrimeUI License” notice: https://primeui.dev/licenses/community
 */
export function AppProviders({ children }: AppProvidersProps) {
  const license = import.meta.env.VITE_PRIMEUI_LICENSE

  return (
    <PrimeReactProvider {...(license ? { license } : {})}>
      {children}
    </PrimeReactProvider>
  )
}
