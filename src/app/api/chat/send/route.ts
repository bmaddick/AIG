import { sendMessageStream } from "@/services";
import type { SendMessageRequest } from "@/types/api";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as SendMessageRequest;

    if (!body.chatId || !body.message?.content) {
      return new Response(
        JSON.stringify({ error: "chatId and message.content are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const streamResponse = await sendMessageStream(body);

    return new Response(streamResponse.body, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to send message";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
