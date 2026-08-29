import { BoxGlyph, CalendarGlyph, Clock, DollarGlyph, ListGlyph, MailGlyph } from "./Icons";
import { moneyIn } from "@/lib/money";
import type { Act, ActKind } from "@/lib/types";

/**
 * No fake status bar, no fake keyboard. On a real phone the real ones render
 * on top of this; a painted one reads as a toy.
 */

const LABEL: Record<ActKind, string> = {
  mail: "Mail",
  calendar: "Calendar",
  box: "Orders",
  list: "Your list",
};

function Glyph({ kind }: { kind: ActKind }) {
  if (kind === "calendar") return <CalendarGlyph />;
  if (kind === "box") return <BoxGlyph />;
  if (kind === "list") return <ListGlyph />;
  return <MailGlyph />;
}

function Icon({ kind }: { kind: ActKind | "money" }) {
  return (
    <span
      className="appIcon"
      style={{ background: kind === "money" ? "var(--money)" : "#C4BDB3" }}
    >
      {kind === "money" ? <DollarGlyph /> : <Glyph kind={kind} />}
    </span>
  );
}

function ActCard({ act }: { act: Act }) {
  return (
    <div className="notif rise">
      <div className="notifHead">
        <Icon kind={act.kind} />
        <span>{LABEL[act.kind]}</span>
        <span className="notifWhen">now</span>
      </div>
      <span className="notifBody">
        {act.text.charAt(0).toUpperCase() + act.text.slice(1)}.
      </span>
    </div>
  );
}

export interface PhoneState {
  price: number;
  customerName: string;
  purchase: string;
  actNow: Act;
  actSecond: Act;
  followUp: string;
  /** which cards have landed */
  paid: boolean;
  didNow: boolean;
  didSecond: boolean;
  queued: boolean;
  footer: React.ReactNode;
}

export function Phone(s: PhoneState) {
  return (
    <div className="phone">
      {s.paid && (
        <div className="notif money land">
          <div className="notifHead">
            <Icon kind="money" />
            <span>Payments</span>
            <span className="notifWhen">now</span>
          </div>
          <span className="notifAmount">{moneyIn(s.price)}</span>
          <span className="notifBody">
            {s.customerName} paid you for {s.purchase}.
          </span>
        </div>
      )}

      {s.didNow && <ActCard act={s.actNow} />}
      {s.didSecond && <ActCard act={s.actSecond} />}

      {s.queued && (
        <div className="notif waiting rise">
          <div className="notifHead">
            <Clock size={13} color="var(--fainter)" />
            <span style={{ color: "var(--faint)" }}>Waiting</span>
            <span className="notifWhen">Wed 9:00 AM</span>
          </div>
          <span className="notifBody" style={{ color: "var(--muted)", fontSize: 12 }}>
            {s.followUp}
          </span>
        </div>
      )}

      <div
        style={{
          marginTop: "auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 4,
          paddingTop: 14,
          paddingBottom: 6,
          textAlign: "center",
        }}
      >
        {s.footer}
      </div>
    </div>
  );
}
