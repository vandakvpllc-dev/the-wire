import { PARTS } from "@/lib/anatomy";
import type { PartId } from "@/lib/types";

/**
 * The teaching device. Five stations, always five across, at every screen
 * width — collapsing it to two columns on a phone would destroy the one idea
 * the whole demo exists to plant.
 */
export function Rail({
  done,
  now,
  subs,
}: {
  /** parts fully complete */
  done: Set<PartId>;
  /** the part currently running, if any */
  now?: PartId | null;
  /** optional caption under each station, index-aligned with PARTS */
  subs?: (string | null)[];
}) {
  const lastOn = PARTS.reduce(
    (acc, p, i) => (done.has(p.id) || p.id === now ? i : acc),
    -1,
  );

  // The fill has to stop dead on a station node. Node i is centred in grid
  // column i, so its position depends on the column gap as well as the width —
  // the arithmetic lives in CSS (see --rail-col), and all it needs from here
  // is which node to stop at.
  return (
    <div className="rail">
      <div className="railLine" />
      <div
        className="railFill"
        /* the comet head is the leading edge of a pulse in motion — once the
           whole run is complete there is nothing left to lead */
        data-complete={lastOn === PARTS.length - 1 && !now ? "" : undefined}
        style={
          {
            "--i": Math.max(lastOn, 0),
            opacity: lastOn < 0 ? 0 : 1,
          } as React.CSSProperties
        }
      />
      <div className="railGrid">
        {PARTS.map((p, i) => {
          const on = done.has(p.id);
          const running = p.id === now;
          return (
            <div className="station" key={p.id}>
              <div className={`dot${running ? " now pulse" : on ? " on" : ""}`} />
              <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <span className={`stationName${on || running ? " on" : ""}`}>
                  {p.label}
                </span>
                {subs?.[i] && <span className="stationSub">{subs[i]}</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
