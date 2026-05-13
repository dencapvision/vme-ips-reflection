import * as React from "react";

type IconProps = {
  size?: number;
  stroke?: string;
  fill?: string;
  sw?: number;
  className?: string;
  style?: React.CSSProperties;
};

const Base = ({
  d,
  size = 22,
  stroke = "currentColor",
  fill = "none",
  sw = 1.6,
  className,
  style,
}: IconProps & { d: React.ReactNode }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={fill}
    stroke={stroke}
    strokeWidth={sw}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={style}
  >
    {d}
  </svg>
);

export const Icons = {
  home: (p: IconProps = {}) => (
    <Base {...p} d={<><path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/></>}/>
  ),
  book: (p: IconProps = {}) => (
    <Base {...p} d={<><path d="M4 5a2 2 0 0 1 2-2h12v16H6a2 2 0 0 0-2 2V5z"/><path d="M8 8h7"/><path d="M8 12h6"/></>}/>
  ),
  target: (p: IconProps = {}) => (
    <Base {...p} d={<><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/></>}/>
  ),
  spark: (p: IconProps = {}) => (
    <Base {...p} d={<><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M19 17l.8 2 .2.8M5 18l.5 1.5"/></>}/>
  ),
  user: (p: IconProps = {}) => (
    <Base {...p} d={<><circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4.5-6 8-6s7 2 8 6"/></>}/>
  ),
  arrow: (p: IconProps = {}) => (
    <Base {...p} d={<><path d="M5 12h14"/><path d="M13 6l6 6-6 6"/></>}/>
  ),
  check:  (p: IconProps = {}) => <Base {...p} d={<path d="M5 12.5l4.5 4.5L19 7"/>}/>,
  check2: (p: IconProps = {}) => <Base {...p} d={<path d="M5 12l4 4L19 7"/>}/>,
  plus:   (p: IconProps = {}) => <Base {...p} d={<><path d="M12 5v14"/><path d="M5 12h14"/></>}/>,
  edit:   (p: IconProps = {}) => <Base {...p} d={<><path d="M16 4l4 4-11 11H5v-4z"/><path d="M14 6l4 4"/></>}/>,
  share:  (p: IconProps = {}) => (
    <Base {...p} d={<><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="M8 11l8-4M8 13l8 4"/></>}/>
  ),
  download: (p: IconProps = {}) => (
    <Base {...p} d={<><path d="M12 4v12"/><path d="M7 11l5 5 5-5"/><path d="M5 20h14"/></>}/>
  ),
  search: (p: IconProps = {}) => (
    <Base {...p} d={<><circle cx="11" cy="11" r="6"/><path d="M16 16l4 4"/></>}/>
  ),
  bell: (p: IconProps = {}) => (
    <Base {...p} d={<><path d="M6 16V11a6 6 0 1 1 12 0v5l1 2H5z"/><path d="M10 20a2 2 0 0 0 4 0"/></>}/>
  ),
  cal: (p: IconProps = {}) => (
    <Base {...p} d={<><rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M9 3v4M15 3v4"/></>}/>
  ),
  pin: (p: IconProps = {}) => (
    <Base {...p} d={<><path d="M12 2c4 0 7 3 7 7 0 5-7 13-7 13S5 14 5 9c0-4 3-7 7-7z"/><circle cx="12" cy="9" r="2.5"/></>}/>
  ),
  bolt:  (p: IconProps = {}) => <Base {...p} d={<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>}/>,
  chat:  (p: IconProps = {}) => <Base {...p} d={<path d="M4 5h16v11H8l-4 4z"/>}/>,
  lotus: (p: IconProps = {}) => (
    <Base {...p} d={<><path d="M12 4c-2 3-2 6 0 9 2-3 2-6 0-9z"/><path d="M5 9c-1 3 1 7 7 7 6 0 8-4 7-7-2 2-4 3-7 3S7 11 5 9z"/><path d="M3 14c1 4 5 6 9 6s8-2 9-6"/></>}/>
  ),
  doc: (p: IconProps = {}) => (
    <Base {...p} d={<><path d="M6 3h9l4 4v14H6z"/><path d="M14 3v5h5"/><path d="M9 13h7M9 16h5"/></>}/>
  ),
  sparkle: (p: IconProps = {}) => <Base {...p} d={<><path d="M12 4v6M12 14v6M4 12h6M14 12h6"/></>}/>,
  ai: (p: IconProps = {}) => (
    <Base {...p} d={<><path d="M12 4l1.5 4L18 9.5l-4.5 1.5L12 15l-1.5-4L6 9.5 10.5 8z"/><circle cx="18" cy="17" r="1.5" fill="currentColor"/><circle cx="6" cy="18" r="1" fill="currentColor"/></>}/>
  ),
  filter: (p: IconProps = {}) => <Base {...p} d={<path d="M4 6h16M7 12h10M10 18h4"/>}/>,
  more: (p: IconProps = {}) => (
    <Base {...p} d={<><circle cx="6" cy="12" r="1.4" fill="currentColor"/><circle cx="12" cy="12" r="1.4" fill="currentColor"/><circle cx="18" cy="12" r="1.4" fill="currentColor"/></>}/>
  ),
  back:   (p: IconProps = {}) => <Base {...p} d={<path d="M15 18l-6-6 6-6"/>}/>,
  clock:  (p: IconProps = {}) => <Base {...p} d={<><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>}/>,
  flag:   (p: IconProps = {}) => <Base {...p} d={<><path d="M5 21V4"/><path d="M5 4h12l-2 4 2 4H5"/></>}/>,
  layers: (p: IconProps = {}) => <Base {...p} d={<><path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5"/></>}/>,
  globe:  (p: IconProps = {}) => <Base {...p} d={<><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></>}/>,
  users:  (p: IconProps = {}) => (
    <Base {...p} d={<><circle cx="8.5" cy="7.5" r="3.5"/><path d="M1 21c.5-4 3.5-6.5 7.5-6.5s7 2.5 7.5 6.5"/><circle cx="18" cy="9" r="2.5"/><path d="M15 21c.2-2.5 1.5-4.5 3-5"/></>}/>
  ),
  logout: (p: IconProps = {}) => (
    <Base {...p} d={<><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></>}/>
  ),
  mail: (p: IconProps = {}) => (
    <Base {...p} d={<><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 7l9 6 9-6"/></>}/>
  ),
  key: (p: IconProps = {}) => (
    <Base {...p} d={<><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3m-3-3l-2.5-2.5"/></>}/>
  ),
  phone: (p: IconProps = {}) => (
    <Base {...p} d={<><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></>}/>
  ),
  play: (p: IconProps = {}) => (
    <Base {...p} d={<path d="M5 3l14 9-14 9V3z"/>}/>
  ),
  cloud: (p: IconProps = {}) => (
    <Base {...p} d={<path d="M17.5 19a5.5 5.5 0 0 0 0-11h-1.1a7.5 7.5 0 1 0-13.9 4 5 5 0 0 0 0 7h15z"/>}/>
  ),
  video: (p: IconProps = {}) => (
    <Base {...p} d={<><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></>}/>
  ),
  link: (p: IconProps = {}) => (
    <Base {...p} d={<><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></>}/>
  ),
  arrowRight: (p: IconProps = {}) => (
    <Base {...p} d={<><path d="M5 12h14"/><path d="M13 6l6 6-6 6"/></>}/>
  ),
  facebook: (p: IconProps = {}) => (
    <Base {...p} d={<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>}/>
  ),
  instagram: (p: IconProps = {}) => (
    <Base {...p} d={<><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></>}/>
  ),
  tiktok: (p: IconProps = {}) => (
    <Base {...p} d={<path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/>}/>
  ),
  youtube: (p: IconProps = {}) => (
    <Base {...p} d={<><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></>}/>
  ),
  info: (p: IconProps = {}) => (
    <Base {...p} d={<><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></>}/>
  ),
};
