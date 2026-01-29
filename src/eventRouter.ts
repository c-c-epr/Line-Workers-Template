import type { ExecutionContext } from "@cloudflare/workers-types";
import { sendMessage, markAsRead, loadStart } from "./eventRoutes";

export async function eventRouter(
  event: any,
  channelAccessToken: string,
  ctx: ExecutionContext,
) {
  ctx.waitUntil(markAsRead(channelAccessToken, event.message.markAsReadToken));

  await Promise.race([
    loadStart(channelAccessToken, event.source.userId, 5),
    new Promise((resolve) => setTimeout(resolve, 50)), // 最多等 50ms
  ]);

  await sendMessage(channelAccessToken, event.replyToken, [
    {
      type: "text",
      text: "Hello from Cloudflare Workers!",
    },
  ]);
}
