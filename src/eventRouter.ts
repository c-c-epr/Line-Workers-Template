import { sendMessage, markAsRead, loadStart } from "./utils/eventRoutes";

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

  switch (event.type) {
    case "message": {
      switch (event.message.type) {
        case "text":
          switch (event.message.text) {
            case "Hi":
            case "hi": {
              await sendMessage(channelAccessToken, event.replyToken, [
                {
                  type: "text",
                  text: "Hi",
                },
              ]);
              break;
            }
            default: {
              await sendMessage(channelAccessToken, event.replyToken, [
                {
                  type: "text",
                  text: "Hello from Cloudflare Workers!",
                },
              ]);
            }
          }

          break;
      }
    }
  }
}
