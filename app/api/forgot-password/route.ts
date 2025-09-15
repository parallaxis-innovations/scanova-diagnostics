import { NextResponse } from "next/server";
import { directusApi } from "@/lib/directus";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    await directusApi.forgotPassword(email);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
