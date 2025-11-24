import { memo, type ReactElement } from 'react';

type IconName =
  | 'sun'
  | 'moon'
  | 'sparkles'
  | 'contrast'
  | 'bot'
  | 'cloud'
  | 'cpu'
  | 'smartphone'
  | 'chevronLeft'
  | 'chevronRight'
  | 'externalLink'
  | 'rocket'
  | 'mapPin'
  | 'copy'
  | 'mail'
  | 'arrowRight'
  | 'eraser'
  | 'search'
  | 'close'
  | 'penSquare'
  | 'download'
  | 'github'
  | 'languages'
  | 'linkedin'
  | 'link'
  | 'message'
  | 'party'
  | 'wrench'
  | 'info'
  | 'checkCircle'
  | 'xCircle'
  | 'globe';

const withPaths =
  (elements: ReactElement[]) =>
  () =>
    elements;

const ICON_MAP: Record<IconName, () => ReactElement[]> = {
  sun: withPaths([
    <circle key="c" cx="12" cy="12" r="4" />,
    <line key="n" x1="12" y1="2" x2="12" y2="5" />,
    <line key="s" x1="12" y1="19" x2="12" y2="22" />,
    <line key="w" x1="2" y1="12" x2="5" y2="12" />,
    <line key="e" x1="19" y1="12" x2="22" y2="12" />,
    <line key="ne" x1="17" y1="7" x2="19" y2="5" />,
    <line key="nw" x1="5" y1="5" x2="7" y2="7" />,
    <line key="se" x1="17" y1="17" x2="19" y2="19" />,
    <line key="sw" x1="5" y1="19" x2="7" y2="17" />
  ]),
  moon: withPaths([
    <path key="path" d="M15.6 3.5a7.5 7.5 0 1 0 5.1 9.6 6 6 0 0 1-5.1-9.6Z" />
  ]),
  sparkles: withPaths([
    <path key="main" d="M12 4.5 13.4 9l4.6 1.4L13.4 12 12 16.5 10.6 12 6 10.4 10.6 9 12 4.5Z" />,
    <path key="mini" d="M6 5.2 6.8 7.5 9 8.2 6.8 8.9 6 11.2 5.2 8.9 3 8.2 5.2 7.5 6 5.2Z" />,
    <path key="mini2" d="M17 13l.7 2 2.1.7-2.1.7-.7 2-.7-2-2.1-.7 2.1-.7.7-2Z" />
  ]),
  contrast: withPaths([
    <circle key="outline" cx="12" cy="12" r="8" />,
    <path key="half" d="M12 4a8 8 0 0 1 0 16Z" />
  ]),
  bot: withPaths([
    <rect key="body" x="4" y="8" width="16" height="10" rx="3" />,
    <rect key="head" x="7" y="4" width="10" height="4" rx="2" />,
    <line key="ant" x1="12" y1="2" x2="12" y2="4" />,
    <circle key="eyeL" cx="9" cy="13" r="1" />,
    <circle key="eyeR" cx="15" cy="13" r="1" />,
    <line key="mouth" x1="9" y1="16" x2="15" y2="16" />
  ]),
  cloud: withPaths([
    <path
      key="cloud"
      d="M5 16.5h11a3.5 3.5 0 0 0 0-7 5 5 0 0 0-9.7-.6A3.3 3.3 0 0 0 5 16.5Z"
    />
  ]),
  cpu: withPaths([
    <rect key="body" x="6" y="6" width="12" height="12" rx="2" />,
    <path key="pins" d="M10 2v2m4-2v2m-4 16v-2m4 2v-2M4 10H2m2 4H2m20-4h-2m2 4h-2" />
  ]),
  smartphone: withPaths([
    <rect key="body" x="8" y="3" width="8" height="18" rx="2" />,
    <circle key="btn" cx="12" cy="18" r="1" />
  ]),
  chevronLeft: withPaths([<polyline key="ch" points="14 6 8 12 14 18" />]),
  chevronRight: withPaths([<polyline key="ch" points="10 6 16 12 10 18" />]),
  externalLink: withPaths([
    <path key="box" d="M10 6H6a2 2 0 0 0-2 2v10c0 1.1.9 2 2 2h10a2 2 0 0 0 2-2v-4" />,
    <path key="arrow" d="M14 4h6v6" />,
    <path key="diag" d="M10 14 20 4" />
  ]),
  rocket: withPaths([
    <path
      key="body"
      d="M12 3c2.5 2 4 5.5 3.4 9-.4 2.3-1.8 4.7-3.4 6.4-1.6-1.7-3-4.1-3.4-6.4C8 8.5 9.5 5 12 3Z"
    />,
    <circle key="window" cx="12" cy="10" r="1.8" />,
    <path key="finL" d="m9.5 15-2.5 4 3.7-1.3" />,
    <path key="finR" d="m14.5 15 2.5 4-3.7-1.3" />
  ]),
  mapPin: withPaths([
    <path key="pin" d="M12 3a6 6 0 0 1 6 6c0 3.2-2.6 6.8-6 10.5-3.4-3.7-6-7.3-6-10.5a6 6 0 0 1 6-6Z" />,
    <circle key="hole" cx="12" cy="9" r="2.2" />
  ]),
  copy: withPaths([
    <rect key="front" x="9" y="9" width="10" height="12" rx="2" />,
    <path key="back" d="M5 15V7a2 2 0 0 1 2-2h8" />
  ]),
  mail: withPaths([
    <rect key="env" x="4" y="6" width="16" height="12" rx="2" />,
    <path key="flap" d="M4 8.5 12 13l8-4.5" />
  ]),
  arrowRight: withPaths([<path key="arrow" d="M5 12h14m-6-6 6 6-6 6" />]),
  eraser: withPaths([
    <path key="body" d="M4 15.5 13.5 6a2 2 0 0 1 2.8 0l3.7 3.7a2 2 0 0 1 0 2.8L10 22H4Z" />,
    <path key="base" d="m4 15.5 6 6" />
  ]),
  search: withPaths([
    <circle key="glass" cx="11" cy="11" r="5.5" />,
    <line key="handle" x1="16" y1="16" x2="21" y2="21" />
  ]),
  close: withPaths([
    <line key="a" x1="5" y1="5" x2="19" y2="19" />,
    <line key="b" x1="19" y1="5" x2="5" y2="19" />
  ]),
  penSquare: withPaths([
    <rect key="box" x="4" y="4" width="16" height="16" rx="3" />,
    <path key="pen" d="m9 15 6.5-6.5a1 1 0 0 0 0-1.4l-1.6-1.6a1 1 0 0 0-1.4 0L7 12v4Z" />,
    <path key="tip" d="M7 16h4" />
  ]),
  download: withPaths([
    <path key="arrow" d="M12 5v10" />,
    <path key="head" d="m7 11 5 5 5-5" />,
    <path key="bar" d="M5 19h14" />
  ]),
  github: withPaths([
    <path
      key="cat"
      d="M12 3c-4.5 0-7.5 3.7-7.5 7.9 0 3.5 2.2 6.5 5.3 7.5.4.1.5-.2.5-.4v-2c-2.1.5-2.6-1-2.6-1-.3-.8-.8-1-1.3-1-.9-.6.1-.6.1-.6 1 .1 1.6 1.1 1.6 1.1.9 1.6 2.3 1.1 2.8.9.1-.7.4-1.1.7-1.3-1.7-.2-3.4-.9-3.4-3.9 0-.9.3-1.7.9-2.3-.1-.2-.4-1 .1-2.1 0 0 .8-.3 2.5 1a8.6 8.6 0 0 1 4.6 0c1.7-1.3 2.5-1 2.5-1 .5 1.1.2 1.9.1 2.1.6.6.9 1.4.9 2.3 0 3-1.7 3.7-3.4 3.9.4.3.8.9.8 1.8v2.6c0 .2.1.5.5.4 3.1-1 5.3-4 5.3-7.5C19.5 6.7 16.5 3 12 3Z"
      fill="currentColor"
      stroke="none"
    />
  ]),
  languages: withPaths([
    <circle key="circle" cx="10" cy="10" r="5.5" />,
    <path key="text" d="M7 11h6M9 7.5l2 5.5M15 8h5l-2.5 6-2.5-6Zm0 0h5" />
  ]),
  linkedin: withPaths([
    <rect key="box" x="4" y="4" width="16" height="16" rx="3" />,
    <rect key="line" x="7" y="10" width="2.4" height="6" />,
    <circle key="dot" cx="8.2" cy="7.2" r="1.2" />,
    <path key="in" d="M15 10a2 2 0 0 1 2 2v4h-2.4v-3.2c0-.7-.4-1.2-1-1.2s-1 .5-1 1.2V16H10v-6h2.5v.8A2.6 2.6 0 0 1 15 10Z" />
  ]),
  link: withPaths([
    <path key="left" d="M8 12a4 4 0 0 1 0-5.7l1.3-1.3a4 4 0 0 1 5.7 0l.5.5" />,
    <path key="right" d="M16 12a4 4 0 0 1 0 5.7l-1.3 1.3a4 4 0 0 1-5.7 0l-.5-.5" />,
    <path key="center" d="M9 15l6-6" />
  ]),
  message: withPaths([
    <path key="bubble" d="M5 6h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-6l-4 3v-3H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z" />
  ]),
  party: withPaths([
    <path key="cone" d="m3 17 6.5-15L16 18l-13 2Z" />,
    <path key="confetti1" d="M14 3c0 1 .8 1.8 1.8 1.8" />,
    <path key="confetti2" d="M17.2 6.5c0 1 .8 1.8 1.8 1.8" />
  ]),
  wrench: withPaths([
    <path
      key="wrench"
      d="M19 5.5a3.5 3.5 0 0 1-4.6 4.6l-7.3 7.4a2 2 0 0 1-2.8 0 2 2 0 0 1 0-2.8l7.4-7.3A3.5 3.5 0 0 1 19 5.5Z"
    />,
    <circle key="hole" cx="5" cy="19" r="0.8" />
  ]),
  info: withPaths([
    <circle key="circle" cx="12" cy="12" r="9" />,
    <line key="i-top" x1="12" y1="8.5" x2="12" y2="8.5" />,
    <path key="i-body" d="M11.2 11.5h1.6V17h-1.6Z" />
  ]),
  checkCircle: withPaths([
    <circle key="circle" cx="12" cy="12" r="9" />,
    <path key="check" d="m8.5 12.5 2.3 2.3 4.7-5.3" />
  ]),
  xCircle: withPaths([
    <circle key="circle" cx="12" cy="12" r="9" />,
    <path key="x1" d="m9 9 6 6" />,
    <path key="x2" d="m15 9-6 6" />
  ]),
  globe: withPaths([
    <circle key="outline" cx="12" cy="12" r="8" />,
    <ellipse key="lat" cx="12" cy="12" rx="4.5" ry="8" />,
    <line key="mer1" x1="4" y1="12" x2="20" y2="12" />,
    <line key="mer2" x1="12" y1="4" x2="12" y2="20" />
  ])
};

type IconProps = {
  name: IconName;
  size?: number;
  className?: string;
  strokeWidth?: number;
  'aria-hidden'?: boolean;
};

function VectorIcon({ name, size = 20, className, strokeWidth = 1.8, ...rest }: IconProps) {
  const paths = ICON_MAP[name]?.();

  if (!paths) {
    return null;
  }

  return (
    <svg
      data-icon-system="vector"
      data-icon-name={name}
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...rest}
    >
      {paths}
    </svg>
  );
}

export default memo(VectorIcon);
