import type { ExecutionContext } from "@cloudflare/workers-types";
import { sendMessage, markAsRead, loadStart } from "./eventRoutes";

export async function eventRouter(
  event: any,
  channelAccessToken: string,
  ctx: ExecutionContext,
) {
  ctx.waitUntil(
    Promise.allSettled([
      markAsRead(channelAccessToken, event.message.markAsReadToken),
      loadStart(channelAccessToken, event.source.userId, 5),
    ]),
  );
  await sendMessage(channelAccessToken, event.replyToken, [
    {
      type: "text",
      text: "Hello from Cloudflare Workers!",
    },
  ]);
}
