import { NextResponse } from "next/server";
import { listChats } from "@/services";

export async function GET() {
  try {
    const result = await listChats();
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to list chats";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
