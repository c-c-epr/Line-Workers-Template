import { sendMessage, markAsRead, loadStart } from "./utils/eventRoutes";
import { env } from "cloudflare:workers";
import { version } from "../package.json";
import type { webhook } from "@line/bot-sdk";
import type { Message } from "./types";

import { MyWorkflow } from "./workflows/message";

export async function eventRouter(event: webhook.Event, channelAccessToken: string, ctx: ExecutionContext): Promise<Message[]> {
  // Log
  let eventType: string = event.type;
  try {
    if (event.type === "message") {
      const msgEvent = event as webhook.MessageEvent;
      eventType = `${event.type}(${msgEvent.message?.type})`;
    }
  } catch (e) {
    console.error("Failed to determine message event type", { error: e });
  }

  console.log(`Received event - ${eventType}`, { event });

  switch (event.type) {
    case "message": {
      const msgEvent = event as webhook.MessageEvent;
      if (msgEvent.message.markAsReadToken) {
        ctx.waitUntil(markAsRead(channelAccessToken, msgEvent.message.markAsReadToken));
      }

      const userId = msgEvent.source && typeof (msgEvent.source as any).userId === "string" ? (msgEvent.source as any).userId : undefined;

      if (userId) {
        await Promise.race([
          loadStart(channelAccessToken, userId, 5),
          new Promise((resolve) => setTimeout(resolve, 50)), // 最多等 50ms
        ]);
      } else {
        await new Promise((resolve) => setTimeout(resolve, 50));
      }

      switch (msgEvent.message.type) {
        case "text":
          switch (msgEvent.message.text) {
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

              return [
                {
                  type: "text",
                  text:
                    `ID: ${versionId.slice(0, 8)}\n` + `Tag: ${versionTag}\n` + `Timestamp: ${LocalVersionTime}\n` + `Package: v${version}`,
                },
              ];

            case "Hi":
            case "hi": {
              return [
                {
                  type: "text",
                  text: "Hi",
                },
              ];
            }
            case "image": {
              return [
                {
                  type: "image",
                  originalContentUrl: "https://lwt.ccepr.dev/image/original.png",
                  previewImageUrl: "https://lwt.ccepr.dev/image/preview.png",
                },
              ];
            }
            case "workflow": {
              loadStart(channelAccessToken, userId, 60);
              const instance = await env.MY_WORKFLOW.create({
                params: {
                  replyToken: msgEvent.replyToken as string,
                  messages: [
                    {
                      type: "text",
                      text: "This message is sent by Workflow!",
                    },
                  ],
                  waitFor: 60,
                },
              });
              return [];
            }
            default: {
              return [
                {
                  type: "text",
                  text: "Hello from Cloudflare Workers!",
                },
              ];
            }
          }
      }
    }
    case "postback":
      return [];
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
  return [];
}
