import { sendMessage, markAsRead, loadStart } from "./eventRoutes";

export async function eventRouter(event: any, channelAccessToken: string) {
  (await markAsRead(channelAccessToken, event.message.markAsReadToken),
    await loadStart(channelAccessToken, event.source.userId, 5));

  await sendMessage(channelAccessToken, event.replyToken, [
    {
      type: "text",
      text: "Hello from Cloudflare Workers!",
    },
  ]);
}
