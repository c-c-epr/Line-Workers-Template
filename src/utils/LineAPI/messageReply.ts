export async function sendMessage(
  ChannelAccessToken: string,
  replyToken: string,
  messages: any[],
) {
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
