import { CalendarGlyph, Clock, DollarGlyph, MailGlyph } from "./Icons";
import { moneyIn } from "@/lib/money";

/**
 * No fake status bar, no fake keyboard. On a real phone the real ones render
 * on top of this; a painted one reads as a toy.
 */

function Icon({ kind }: { kind: "money" | "calendar" | "mail" }) {
  const bg = kind === "money" ? "var(--money)" : "#C4BDB3";
  return (
    <span className="appIcon" style={{ background: bg }}>
      {kind === "money" ? (
        <DollarGlyph />
      ) : kind === "calendar" ? (
        <CalendarGlyph />
      ) : (
        <MailGlyph />
      )}
    </span>
  );
}

export interface PhoneState {
  price: number;
  customerName: string;
  purchase: string;
  followUp: string;
  /** which cards have landed */
  paid: boolean;
  booked: boolean;
  mailed: boolean;
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

      {s.booked && (
        <div className="notif rise">
          <div className="notifHead">
            <Icon kind="calendar" />
            <span>Calendar</span>
            <span className="notifWhen">now</span>
          </div>
          <span className="notifBody">
            Thursday 2:15 PM is on your calendar. You did nothing.
          </span>
        </div>
      )}

      {s.mailed && (
        <div className="notif rise">
          <div className="notifHead">
            <Icon kind="mail" />
            <span>Mail</span>
            <span className="notifWhen">now</span>
          </div>
          <span className="notifBody">
            Receipt sent. In your words, from your address.
          </span>
        </div>
      )}

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
