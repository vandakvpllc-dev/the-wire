import { WireMark } from "./Icons";

export function Shell({
  step,
  label,
  live,
  children,
}: {
  step: number;
  label: string;
  live?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="screen">
      <div className="wrap">
        <header className="head">
          <div className="mark">
            <WireMark />
            <span>THE WIRE</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            {live && <span className="live pulse">● LIVE</span>}
            <span className="stepLabel">
              STEP {step} OF 5 — {label}
            </span>
          </div>
        </header>
        {children}
      </div>
    </div>
  );
}
