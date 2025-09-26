import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";
import { addDays, startOfDay, endOfDay, isWithinInterval } from "date-fns";
import { fromZonedTime } from "date-fns-tz";
import { authorized } from "@/lib/cron-helper";

const resend = new Resend(process.env.RESEND_API_KEY!);

// Check if a UTC Date ends "tomorrow" in a given IANA timezone
function endsTomorrowInTZ(endsAtUTC: Date, tz: string | null | undefined) {
  const zone = tz || "UTC";

  // "now" in that timezone
  const nowLocal = fromZonedTime(new Date(), zone);

  // Build tomorrow's window in *local* time
  const tomorrowLocal = addDays(nowLocal, 1);
  const start = startOfDay(tomorrowLocal);
  const end = endOfDay(tomorrowLocal);

  // Convert booking end to local time for comparison
  const endsLocal = fromZonedTime(endsAtUTC, zone);

  return isWithinInterval(endsLocal, { start, end });
}

export async function GET(req: Request) {
  if (!authorized(req))
    return NextResponse.json({ ok: false }, { status: 401 });

  // Coarse pre-filter: bookings ending in next 48h (UTC)
  const now = new Date();
  const in48h = new Date(Date.now() + 48 * 60 * 60 * 1000);

  // Adjust field names to your schema if different:
  const candidates = await prisma.booking.findMany({
    where: {
      reminderSentAt: null,
      endDate: { gte: now, lte: in48h },
    },
    select: {
      id: true,
      endDate: true, // UTC Date
      timeZone: true, // e.g. "Europe/Brussels"
      user: { select: { email: true } }, // relation
    },
    take: 2000,
  });

  // Exact filter with timezone-aware "tomorrow"
  const toSend = candidates.filter(
    (b) => b.user?.email && endsTomorrowInTZ(b.endDate, b.timeZone)
  );

  // Send emails one-by-one (simple). For large volumes, batch/chunk.
  const results = await Promise.allSettled(
    toSend.map(async (b) => {
      await resend.emails.send({
        from: "onboarding@resend.dev",
        to: b.user!.email!,
        subject: "Reminder: return your rental car tomorrow",
        html: `
          <p>Hi,</p>
          <p>Friendly reminder: your rental car is due back on <b>${b.endDate.toLocaleString()}</b>.</p>
          <p>Need an extension? Reply to this email or manage your booking in your account.</p>
          <p>— YourCompany</p>
        `,
      });

      await prisma.booking.update({
        where: { id: b.id },
        data: { reminderSentAt: new Date() },
      });
    })
  );

  const sent = results.filter((r) => r.status === "fulfilled").length;
  const failed = results.length - sent;

  return NextResponse.json({
    candidates: candidates.length,
    toSend: toSend.length,
    sent,
    failed,
  });
}
