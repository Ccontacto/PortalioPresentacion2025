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
      viewBox="0 0 24 24"
      fill={`url(#${gradientId})`}
      stroke="currentColor"
      strokeWidth={1.7}
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
      <path key="roof" d="M4 11.5 12 5l8 6.5" />,
      <path key="body" d="M6.5 10.8V19h4.5v-4.5h2V19H18v-8.2" />
    ]),
  experience: size =>
    baseIcon(size, [
      <rect key="body" x="4" y="9" width="16" height="10" rx="2.4" />,
      <path key="handle" d="M9 9V7.5A3 3 0 0 1 15 7.5V9" />,
      <path key="divider" d="M4 13h16" />
    ]),
  skills: size =>
    baseIcon(size, [
      <path key="layer1" d="M12 4 4.5 8l7.5 4 7.5-4Z" />,
      <path key="layer2" d="m4.5 12 7.5 4 7.5-4" />,
      <path key="layer3" d="m4.5 16 7.5 4 7.5-4" />
    ]),
  focus: size =>
    baseIcon(size, [
      <circle key="outer" cx="12" cy="12" r="6" />,
      <circle key="inner" cx="12" cy="12" r="2.5" />,
      <path key="north" d="M12 3v3" />,
      <path key="south" d="M12 18v3" />,
      <path key="west" d="M3 12h3" />,
      <path key="east" d="M18 12h3" />
    ]),
  projects: size =>
    baseIcon(size, [
      <path
        key="body"
        d="M12 3c3 2.4 4.8 6.3 4.1 10-.5 2.5-2 4.8-4.1 6.6-2.1-1.8-3.6-4.1-4.1-6.6C7.2 9.3 9 5.4 12 3Z"
      />,
      <circle key="window" cx="12" cy="10" r="1.8" />,
      <path key="fin-left" d="M9.7 14.7 7 20l4.3-1.6" />,
      <path key="fin-right" d="M14.3 14.7 17 20l-4.3-1.6" />
    ]),
  contact: size =>
    baseIcon(size, [
      <rect key="envelope" x="4" y="6.5" width="16" height="11" rx="2" />,
      <path key="flap" d="M5 8.5 12 13l7-4.5" />
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
