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
            <span className="markBadge">
              <WireMark />
            </span>
            <span>THE WIRE</span>
          </div>
          <div className="headRight">
            {live && (
              <span className="livePill">
                <i className="liveDot pulse" />
                LIVE
              </span>
            )}
            {/* five ticks for five screens — the shape of the product, twice */}
            <div className="ticks" role="presentation" aria-hidden="true">
              {[1, 2, 3, 4, 5].map((n) => (
                <span key={n} className={n <= step ? "tick on" : "tick"} />
              ))}
            </div>
            <span className="stepLabel">{label}</span>
          </div>
        </header>
        <main className="body enter">{children}</main>
      </div>
    </div>
  );
}
