import { sendMessage, markAsRead, loadStart } from "./utils/eventRoutes";
import { env } from "cloudflare:workers";
import { version } from "../package.json";

export async function eventRouter(event: any, channelAccessToken: string, ctx: ExecutionContext) {
  // Log
  let eventType: string = event.type;
  try {
    if (["message"].includes(event.type)) {
      eventType = `${event.type}(${event.message?.type})`;
    }
  } catch (e) {
    console.error("Failed to determine message event type", { error: e });
  }

  console.log(`Received event - ${eventType}`, { event });

  switch (event.type) {
    case "message": {
      ctx.waitUntil(markAsRead(channelAccessToken, event.message.markAsReadToken));

      await Promise.race([
        loadStart(channelAccessToken, event.source.userId, 5),
        new Promise((resolve) => setTimeout(resolve, 50)), // 最多等 50ms
      ]);

      switch (event.message.type) {
        case "text":
          switch (event.message.text) {
            case "/version":
              const { id: versionId, tag: versionTag, timestamp: versionTimestamp } = env.CF_VERSION_METADATA;

              const date = new Date(versionTimestamp);

              const LocalVersionTime = new Intl.DateTimeFormat("zh-TW", {
                timeZone: env.timezone || "Asia/Taipei",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              }).format(new Date(versionTimestamp));

              await sendMessage(channelAccessToken, event.replyToken, [
                {
                  type: "text",
                  text:
                    `ID: ${versionId.slice(0, 8)}\n` + `Tag: ${versionTag}\n` + `Timestamp: ${LocalVersionTime}\n` + `Package: v${version}`,
                },
              ]);
              break;

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
    case "postback":
      break;
    case "follow":
      if (!event.follow.isUnblocked) {
        // 新增好友
        return [];
      } else {
        // 解除封鎖
        return [];
      }
    case "unfollow":
      return []; // unfollow 事件無法回應
  }
}
