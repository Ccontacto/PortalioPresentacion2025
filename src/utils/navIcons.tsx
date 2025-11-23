import type { ReactElement } from 'react';

type NavIconKey = 'home' | 'experience' | 'skills' | 'focus' | 'projects' | 'contact';

let gradientIdCounter = 0;
const nextGradientId = () => `navIconGradient-${++gradientIdCounter}`;

function baseIcon(size: number, paths: ReactElement[]) {
  const gradientId = nextGradientId();
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      stroke={`url(#${gradientId})`}
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f472b6" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
      </defs>
      {paths}
    </svg>
  );
}

const ICON_MAP: Record<NavIconKey, (size: number) => ReactElement> = {
  home: size =>
    baseIcon(size, [
      <path key="roof" d="M6 14 16 5l10 9" />,
      <path key="door" d="M10 14v10h6v-6h4v6h6v-10" />
    ]),
  experience: size =>
    baseIcon(size, [
      <rect key="body" x="6" y="11" width="20" height="14" rx="3" />,
      <path key="handle" d="M12 11V8.5a2.5 2.5 0 0 1 5 0V11" />,
      <path key="divider" d="M6 18h20" />
    ]),
  skills: size =>
    baseIcon(size, [
      <rect key="top" x="7" y="7" width="18" height="6" rx="2" />,
      <rect key="mid" x="5" y="14" width="22" height="6" rx="2" />,
      <rect key="bot" x="7" y="21" width="18" height="6" rx="2" />
    ]),
  focus: size =>
    baseIcon(size, [
      <circle key="outer" cx="16" cy="16" r="9" />,
      <circle key="inner" cx="16" cy="16" r="4" />,
      <path key="north" d="M16 4v4" />,
      <path key="south" d="M16 24v4" />,
      <path key="west" d="M4 16h4" />,
      <path key="east" d="M24 16h4" />
    ]),
  projects: size =>
    baseIcon(size, [
      <path key="body" d="M16 4c3 2.5 4.6 6.4 4 10-.4 2.4-1.7 4.8-4 6.8-2.3-2-3.6-4.4-4-6.8-.6-3.6 1-7.5 4-10Z" />,
      <circle key="window" cx="16" cy="12" r="2.2" />,
      <path key="finL" d="M13 18l-3 5" />,
      <path key="finR" d="M19 18l3 5" />
    ]),
  contact: size =>
    baseIcon(size, [
      <rect key="env" x="6" y="10" width="20" height="14" rx="3" />,
      <path key="flap" d="M6 12l10 7 10-7" />
    ])
};

const DEFAULT_ICON = (size: number) =>
  baseIcon(size, [
    <path key="star1" d="m12 4.2 1.8 4.6 4.9.4-3.7 3.1 1 4.9L12 14.7l-4 2.5 1-4.9-3.7-3.1 4.9-.4Z" />
  ]);

export function navIconFor(id: string, size = 20): ReactElement {
  const safeKey = (id as NavIconKey) ?? 'home';
  const renderer = ICON_MAP[safeKey];
  return renderer ? renderer(size) : DEFAULT_ICON(size);
}
