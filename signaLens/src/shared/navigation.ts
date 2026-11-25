import type { ComponentType, SVGProps } from 'react'
import {
  AiChatIcon,
  AssetsTagsIcon,
  DashboardsIcon,
  EtlHealthIcon,
  OverviewIcon,
  SignOutIcon,
  UsersSettingsIcon,
} from '@/shared/assets/icons/NavIcons'

export type NavIcon = ComponentType<SVGProps<SVGSVGElement>>

export type NavItem = {
  label: string
  to: string
  Icon: NavIcon
}

/** Sidebar primary routes from the SignaLens Figma wireframe. */
export const NAV_ITEMS: NavItem[] = [
  { label: 'Overview', to: '/', Icon: OverviewIcon },
  { label: 'Dashboards', to: '/dashboards', Icon: DashboardsIcon },
  { label: 'AI Chat', to: '/ai-chat', Icon: AiChatIcon },
  { label: 'Assets & Tags', to: '/assets-tags', Icon: AssetsTagsIcon },
  { label: 'ETL Health', to: '/etl-health', Icon: EtlHealthIcon },
  { label: 'Users & Settings', to: '/users-settings', Icon: UsersSettingsIcon },
]

export const SignOutNavIcon = SignOutIcon
