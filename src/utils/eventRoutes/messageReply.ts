import { env } from "cloudflare:workers";

export async function sendMessage(ChannelAccessToken: string, replyToken: string, messages: any[]) {
  const { id: versionId, tag: versionTag, timestamp: versionTimestamp } = env.CF_VERSION_METADATA;
  messages.push({
    type: "text",
    text: `Version ID: ${versionId}\nVersion Tag: ${versionTag}\nVersion Timestamp: ${versionTimestamp}`,
  });

  const res = await fetch("https://api.line.me/v2/bot/message/reply", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${ChannelAccessToken}`,
    },
    method: "POST",
    body: JSON.stringify({
      replyToken: replyToken,
      messages: messages,
    }),
  });
  return res.json();
}
