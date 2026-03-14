import { sendIncognitoStream } from "@/services";
import type { SendIncognitoRequest } from "@/types/api";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as SendIncognitoRequest;

    if (!body.message?.content) {
      return new Response(
        JSON.stringify({ error: "message.content is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const streamResponse = await sendIncognitoStream(body);

    return new Response(streamResponse.body, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to send incognito message";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
