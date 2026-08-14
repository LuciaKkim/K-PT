import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function base(props: IconProps) {
  const { size = 20, ...rest } = props;
  return {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none" as const,
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    ...rest,
  };
}

export function BellIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M18.5 9a6.5 6.5 0 1 0-13 0c0 6-2.5 7.5-2.5 7.5h18S18.5 15 18.5 9" />
      <path d="M13.7 20.2a2 2 0 0 1-3.4 0" />
    </svg>
  );
}

export function MegaphoneIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="m3 11 18-5.5v13L3 14z" />
      <path d="M11.6 16.9a3 3 0 1 1-5.7-1.7" />
    </svg>
  );
}

export function DocEditIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M14.6 2.5H7a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6.9z" />
      <path d="M14.5 2.5v4.5h4.5M9 13h5M9 16.7h3.5" />
    </svg>
  );
}

export function VoteIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M20.5 11.6V19a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h8" />
      <path d="m8.4 11.2 3.2 3.2 8.1-8.5" />
    </svg>
  );
}

export function CarIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M5.6 17H3.5v-4.4l2-5.6h13l2 5.6V17h-2.1M9.6 17h4.8" />
      <path d="M4 12.4h16" />
      <circle cx="7.6" cy="17.4" r="1.8" />
      <circle cx="16.4" cy="17.4" r="1.8" />
    </svg>
  );
}

export function DoorIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M5.5 21V4.5a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2V21" />
      <path d="M3.5 21h17" />
      <path d="M14.4 12h.01" />
    </svg>
  );
}

export function SmartHomeIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M3.5 10.6 12 3.6l8.5 7" />
      <path d="M5.6 9.6V20a1 1 0 0 0 1 1h10.8a1 1 0 0 0 1-1V9.6" />
      <path d="M9.6 15.4a3.4 3.4 0 0 1 4.8 0" />
      <path d="M12 18.3h.01" />
    </svg>
  );
}

export function CupIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M17 9.2h1.2a3.3 3.3 0 0 1 0 6.6H17" />
      <path d="M3.6 9.2H17V17a4 4 0 0 1-4 4H7.6a4 4 0 0 1-4-4z" />
      <path d="M7.2 3.2v2.6M10.4 3.2v2.6M13.6 3.2v2.6" />
    </svg>
  );
}

export function ListIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M8.6 6.5h11.9M8.6 12h11.9M8.6 17.5h11.9M4 6.5h.01M4 12h.01M4 17.5h.01" />
    </svg>
  );
}

export function ChatIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M7.7 19.5A8.6 8.6 0 1 0 4.4 16.2L3.2 20.8z" />
      <path d="M9 11.2h.01M12 11.2h.01M15 11.2h.01" />
    </svg>
  );
}

export function HomeIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M3.5 10.6 12 3.6l8.5 7" />
      <path d="M5.6 9.6V20a1 1 0 0 0 1 1h10.8a1 1 0 0 0 1-1V9.6" />
      <path d="M9.8 21v-5.3h4.4V21" />
    </svg>
  );
}

export function BuildingIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M6.2 21V4.4a1 1 0 0 1 1-1h9.6a1 1 0 0 1 1 1V21" />
      <path d="M3.5 21h17" />
      <path d="M9.7 7.8h1.1M13.2 7.8h1.1M9.7 11.8h1.1M13.2 11.8h1.1M9.7 15.8h1.1M13.2 15.8h1.1" />
    </svg>
  );
}

export function UserIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M19 20.6v-1.8a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v1.8" />
      <circle cx="12" cy="7.6" r="4" />
    </svg>
  );
}

export function ArrowUpIcon(props: IconProps) {
  return (
    <svg {...base({ ...props, strokeWidth: 1.9 })}>
      <path d="M12 19.5V5M5.5 11.5 12 5l6.5 6.5" />
    </svg>
  );
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <svg {...base({ ...props, strokeWidth: 1.9 })}>
      <path d="M4.5 12h15M13 5.5 19.5 12 13 18.5" />
    </svg>
  );
}

export function ArrowLeftIcon(props: IconProps) {
  return (
    <svg {...base({ ...props, strokeWidth: 1.9 })}>
      <path d="M19.5 12h-15M11 5.5 4.5 12 11 18.5" />
    </svg>
  );
}

export function ChevronRightIcon(props: IconProps) {
  return (
    <svg {...base({ ...props, strokeWidth: 1.9 })}>
      <path d="m9.5 5.5 7 6.5-7 6.5" />
    </svg>
  );
}

export function ChevronDownIcon(props: IconProps) {
  return (
    <svg {...base({ ...props, strokeWidth: 1.9 })}>
      <path d="m5.5 9 6.5 7 6.5-7" />
    </svg>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <svg {...base({ ...props, strokeWidth: 2.1 })}>
      <path d="M20 6.5 9.3 17.5 4 12.2" />
    </svg>
  );
}

export function FileIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M14.6 2.5H7a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6.9z" />
      <path d="M14.5 2.5v4.5h4.5" />
    </svg>
  );
}

export function LockIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="4.6" y="10.4" width="14.8" height="10.6" rx="2.2" />
      <path d="M8 10.4V7a4 4 0 0 1 8 0v3.4" />
      <path d="M12 14.8v2.2" />
    </svg>
  );
}

/**
 * 아파톡 브랜드 마크. 단지(아파트 두 동)를 단순화한 형태입니다.
 * 예전에는 스파클(반짝임) 아이콘을 썼는데, 특정 AI 서비스 느낌이 강해 단지 마크로 교체했습니다.
 */
export function LogoMarkIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 20.5V8.6l5.4-2.9v14.8" />
      <path d="M9.4 11.2 20 8.2v12.3H3" />
      <path d="M6.5 11.4v.01M6.5 14.6v.01M12.6 12.6v.01M12.6 15.8v.01M16.6 12v.01M16.6 15.2v.01" />
    </svg>
  );
}

export function ShieldIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 2.8l7.5 2.9v6.1c0 4.6-3.1 7.9-7.5 9.4-4.4-1.5-7.5-4.8-7.5-9.4V5.7z" />
      <path d="m8.9 11.9 2.2 2.2 4-4.3" />
    </svg>
  );
}

export function FolderIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M3 7.6a2 2 0 0 1 2-2h3.9l1.8 2.2H19a2 2 0 0 1 2 2v7.6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    </svg>
  );
}

export function DownloadIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 3.6v11m0 0 4-4m-4 4-4-4M4.5 19.5h15" />
    </svg>
  );
}

export function LogoutIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M9.6 20.5H5.8a2 2 0 0 1-2-2v-13a2 2 0 0 1 2-2h3.8" />
      <path d="M16 16.4l4.4-4.4L16 7.6M20.4 12H9.2" />
    </svg>
  );
}

export function InboxIcon(props: IconProps) {
  return (
    <svg {...base({ ...props, strokeWidth: 1.6 })}>
      <path d="M20.5 12.5v6a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2v-6l3-8h11z" />
      <path d="M3.5 12.5h4l1.5 3h6l1.5-3h4" />
    </svg>
  );
}

export function SearchIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="10.8" cy="10.8" r="6.8" />
      <path d="m20 20-4.4-4.4" />
    </svg>
  );
}

export function PhoneIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="6.5" y="2.6" width="11" height="18.8" rx="2.6" />
      <path d="M10.8 18.6h2.4" />
    </svg>
  );
}

export function KakaoIcon(props: IconProps) {
  const { size = 20, ...rest } = props;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" {...rest}>
      <path d="M12 3.4c-4.8 0-8.7 3-8.7 6.8 0 2.4 1.6 4.5 4 5.7l-.9 3.4c-.1.3.2.5.5.4l4-2.6c.4 0 .7.1 1.1.1 4.8 0 8.7-3 8.7-6.9S16.8 3.4 12 3.4" />
    </svg>
  );
}

export function NaverIcon(props: IconProps) {
  const { size = 20, ...rest } = props;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" {...rest}>
      <path d="M14.3 12.2 9.5 5.2H5.2v13.6h4.4v-7l4.9 7h4.3V5.2h-4.5z" />
    </svg>
  );
}

export function AppleIcon(props: IconProps) {
  const { size = 20, ...rest } = props;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" {...rest}>
      <path d="M16.4 1.4c0 1.1-.4 2.2-1.3 3-.9 1-2 1.5-3.1 1.4-.1-1.1.4-2.3 1.3-3.1.9-.9 2.1-1.4 3.1-1.3m3.4 7.5c-.9.5-2.4 1.9-2.4 4 0 2.5 2.2 3.4 2.2 3.4-.1.1-.4 1.1-1.1 2.2-.7 1-1.5 1.9-2.6 1.9s-1.5-.6-2.8-.6-1.7.6-2.8.6c-1.1 0-2-1-2.8-2C6.1 16.9 5.2 14.3 5.2 12c0-3.9 2.5-5.9 5-5.9 1.3 0 2.3.7 3.1.7.7 0 1.9-.8 3.3-.8 1 0 2.5.3 3.2 1.4" />
    </svg>
  );
}
