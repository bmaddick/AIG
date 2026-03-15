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

    body.message.content +=
      "\n\n[System: use web search to find and cite real articles from answersingenesis.org to support your answer. " +
      "Format article references as markdown hyperlinks like [Article Title](https://answersingenesis.org/...) so they are clickable. " +
      "NEVER fabricate quotes — only use direct quotes you found via web search, with the source linked. " +
      "If you cannot find a real quote, paraphrase the argument in your own words without quotation marks or attribution.]";

    body.options = { ...body.options, includedDomains: ["answersingenesis.org"] };

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
