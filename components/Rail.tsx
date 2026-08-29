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

  // The grid spans the full width, so the centre of column i sits at
  // (i + 0.5) / 5 of it. The track itself starts 8% in, so the fill has to be
  // measured from there — not from zero.
  const fill = lastOn < 0 ? 0 : (lastOn + 0.5) * 20 - 8;

  return (
    <div className="rail">
      <div className="railLine" />
      <div className="railFill" style={{ width: `${fill}%` }} />
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
