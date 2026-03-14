import { NextResponse } from "next/server";
import { getChatMessages } from "@/services";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ chatId: string }> },
) {
  try {
    const { chatId } = await params;
    const result = await getChatMessages(chatId);
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to get messages";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
