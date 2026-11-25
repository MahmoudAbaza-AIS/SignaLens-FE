import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement>

const base = {
  width: 18,
  height: 18,
  viewBox: '0 0 18 18',
  fill: 'none',
  xmlns: 'http://www.w3.org/2000/svg',
  'aria-hidden': true as const,
}

export function OverviewIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path
        d="M3 8.5L9 3.5L15 8.5V15C15 15.2652 14.8946 15.5196 14.7071 15.7071C14.5196 15.8946 14.2652 16 14 16H4C3.73478 16 3.48043 15.8946 3.29289 15.7071C3.10536 15.5196 3 15.2652 3 15V8.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function DashboardsIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path
        d="M3.5 2.5H7C7.55228 2.5 8 2.94772 8 3.5V7C8 7.55228 7.55228 8 7 8H3.5C2.94772 8 2.5 7.55228 2.5 7V3.5C2.5 2.94772 2.94772 2.5 3.5 2.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11 2.5H14.5C15.0523 2.5 15.5 2.94772 15.5 3.5V7C15.5 7.55228 15.0523 8 14.5 8H11C10.4477 8 10 7.55228 10 7V3.5C10 2.94772 10.4477 2.5 11 2.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.5 10H7C7.55228 10 8 10.4477 8 11V14.5C8 15.0523 7.55228 15.5 7 15.5H3.5C2.94772 15.5 2.5 15.0523 2.5 14.5V11C2.5 10.4477 2.94772 10 3.5 10Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11 10H14.5C15.0523 10 15.5 10.4477 15.5 11V14.5C15.5 15.0523 15.0523 15.5 14.5 15.5H11C10.4477 15.5 10 15.0523 10 14.5V11C10 10.4477 10.4477 10 11 10Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function AiChatIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path
        d="M3 3.5H15V12H8.5L5 15V12H3V3.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function AssetsTagsIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path
        d="M2.5 2.5H9L15.5 9L9 15.5L2.5 9V2.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.8 6.5C7.8 7.21797 7.21797 7.8 6.5 7.8C5.78203 7.8 5.2 7.21797 5.2 6.5C5.2 5.78203 5.78203 5.2 6.5 5.2C7.21797 5.2 7.8 5.78203 7.8 6.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function EtlHealthIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path
        d="M1.5 9.5H5L7 4.5L11 13.5L13 9.5H16.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function UsersSettingsIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path
        d="M12 6C12 7.65685 10.6569 9 9 9C7.34315 9 6 7.65685 6 6C6 4.34315 7.34315 3 9 3C10.6569 3 12 4.34315 12 6Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3 16C3.8 12.8 6.2 11 9 11C11.8 11 14.2 12.8 15 16"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function SignOutIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path
        d="M7.5 3H3.5V15H7.5M11 12.5L14.5 9L11 5.5M14.5 9H7"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
