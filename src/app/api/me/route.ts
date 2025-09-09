import { get_current_user } from "@/actions/user.actions";
import { NextResponse } from "next/server";

export async function GET() {
  const user = await get_current_user(); 

  if (!user) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  return NextResponse.json({ user });
}
