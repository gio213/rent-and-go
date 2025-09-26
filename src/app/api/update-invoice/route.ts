import { authorized } from "@/lib/cron-helper";
import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

export async function PUT(req: NextRequest) {
  try {
    if (!authorized(req))
      return NextResponse.json({ ok: false }, { status: 401 });

    // Your logic here
    // candidates bookigs to update with invocie data
    const body = await req.json();
    console.log("Received body:", body);
    const { paymentIntentId, receiptUrl } = body;
    if (!paymentIntentId || !receiptUrl) {
      return NextResponse.json(
        { ok: false, message: "Missing paymentIntentId or receiptUrl" },
        { status: 400 }
      );
    }

    // Example: Update bookings in the database
    await prisma.booking.updateMany({
      where: { stripePaymentIntentId: paymentIntentId },
      data: {
        stripeInvoiceUrl: receiptUrl,
        stripePaymentIntentId: paymentIntentId,
      },
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { ok: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
