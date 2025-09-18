import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { directusService } from "@/lib/directus";

export async function GET() {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const accessToken = (session as any).accessToken as string;
    const userId = (session.user as any).id as string;

    const result = await directusService.getPersonalInformationByUserId(userId, accessToken);
    return NextResponse.json({ data: result?.data?.[0] || null });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || "Failed" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const accessToken = (session as any).accessToken as string;
    const userId = (session.user as any).id as string;
    const payload = await request.json();

    const saved = await directusService.upsertPersonalInformation(userId, payload, accessToken);
    return NextResponse.json({ data: saved?.data || saved });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || "Failed" }, { status: 500 });
  }
}



