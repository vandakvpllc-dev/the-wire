/** Stroke icons on a 24 grid. Never emoji — they don't recolor and don't scale. */

interface P {
  size?: number;
  color?: string;
  className?: string;
}

const base = (size: number, color: string) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: color,
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
});

export const WireMark = ({ size = 20, color = "var(--money)" }: P) => (
  <svg {...base(size, color)} strokeWidth={1.7}>
    <path d="M4 12h5" />
    <path d="M15 12h5" />
    <circle cx="11" cy="12" r="2" />
    <path d="M13 12h0.5" />
  </svg>
);

export const Bolt = ({ size = 19, color = "var(--money)" }: P) => (
  <svg {...base(size, color)}>
    <path d="M13 2.5 4 14h6.5L11 21.5 20 10h-6.5z" />
  </svg>
);

export const Database = ({ size = 19, color = "var(--money)" }: P) => (
  <svg {...base(size, color)}>
    <ellipse cx="12" cy="6" rx="8" ry="3" />
    <path d="M4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6" />
    <path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" />
  </svg>
);

export const Brain = ({ size = 19, color = "var(--money)" }: P) => (
  <svg {...base(size, color)}>
    <path d="M12 3a4 4 0 0 0-4 4v0a3.5 3.5 0 0 0-1.5 6.6A3.5 3.5 0 0 0 9 20.5a3 3 0 0 0 3-1.6 3 3 0 0 0 3 1.6 3.5 3.5 0 0 0 2.5-6.9A3.5 3.5 0 0 0 16 7v0a4 4 0 0 0-4-4z" />
  </svg>
);

export const Send = ({ size = 19, color = "var(--money)" }: P) => (
  <svg {...base(size, color)}>
    <path d="M3 11.5 21 4l-7.5 17.5-2.2-7.8z" />
    <path d="M11.3 13.7 21 4" />
  </svg>
);

export const Bell = ({ size = 19, color = "var(--money)" }: P) => (
  <svg {...base(size, color)}>
    <path d="M18 8.5a6 6 0 0 0-12 0c0 6-2.5 7.5-2.5 7.5h17S18 14.5 18 8.5z" />
    <path d="M10.3 20a2 2 0 0 0 3.4 0" />
  </svg>
);

export const Arrow = ({ size = 16, color = "currentColor" }: P) => (
  <svg {...base(size, color)} strokeWidth={2}>
    <path d="M4 12h15M13 6l6 6-6 6" />
  </svg>
);

export const Clock = ({ size = 15, color = "var(--money)" }: P) => (
  <svg {...base(size, color)}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5.5l3.5 2" />
  </svg>
);

export const Warn = ({ size = 15, color = "var(--loss)" }: P) => (
  <svg {...base(size, color)} strokeWidth={1.8}>
    <path d="M12 8.5v5" />
    <circle cx="12" cy="17" r="0.6" fill={color} stroke="none" />
    <path d="M10.3 3.9 2.6 17.5A1.9 1.9 0 0 0 4.3 20.4h15.4a1.9 1.9 0 0 0 1.7-2.9L13.7 3.9a1.9 1.9 0 0 0-3.4 0z" />
  </svg>
);

export const Person = ({ size = 15, color = "var(--ink)" }: P) => (
  <svg {...base(size, color)} strokeWidth={1.7}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4.5 21c1.2-4 4-6 7.5-6s6.3 2 7.5 6" />
  </svg>
);

/* --- app glyphs, drawn white inside a filled rounded square --- */

export const DollarGlyph = ({ size = 11 }: P) => (
  <svg {...base(size, "#fff")} strokeWidth={2.6}>
    <path d="M12 4v16M8.5 7.5h6.5a3 3 0 0 1 0 6H9a3 3 0 0 0 0 6h6.5" />
  </svg>
);

export const CalendarGlyph = ({ size = 10 }: P) => (
  <svg {...base(size, "#fff")} strokeWidth={2.6}>
    <rect x="4" y="5" width="16" height="15" rx="2" />
    <path d="M4 10h16" />
  </svg>
);

export const MailGlyph = ({ size = 10 }: P) => (
  <svg {...base(size, "#fff")} strokeWidth={2.6}>
    <rect x="3" y="5.5" width="18" height="13" rx="2" />
    <path d="M3.5 7l8.5 6 8.5-6" />
  </svg>
);

/* --- asset glyphs for the map --- */

export const CardIcon = ({ size = 17, color = "var(--fainter)" }: P) => (
  <svg {...base(size, color)} strokeWidth={1.5}>
    <rect x="2" y="6" width="20" height="13" rx="2" />
    <path d="M2 10.5h20" />
  </svg>
);

export const CalendarIcon = ({ size = 17, color = "var(--fainter)" }: P) => (
  <svg {...base(size, color)} strokeWidth={1.5}>
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M3 10h18M8 3v4M16 3v4" />
  </svg>
);

export const GlobeIcon = ({ size = 17, color = "var(--fainter)" }: P) => (
  <svg {...base(size, color)} strokeWidth={1.5}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3c2.5 2.6 2.5 15.4 0 18M12 3c-2.5 2.6-2.5 15.4 0 18" />
  </svg>
);

export const ChatIcon = ({ size = 17, color = "var(--fainter)" }: P) => (
  <svg {...base(size, color)} strokeWidth={1.5}>
    <path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 9 9 0 0 1-4.2-1L3 20.5l1.7-4.6A8.4 8.4 0 0 1 12 3.1a8.4 8.4 0 0 1 9 8.4z" />
  </svg>
);
