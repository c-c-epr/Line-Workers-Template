export async function loadStart(
  ChannelAccessToken: string,
  chatId: string,
  loadingSeconds: number,
) {
  const res = await fetch("https://api.line.me/v2/bot/chat/loading/start", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${ChannelAccessToken}`,
    },
    method: "POST",
    body: JSON.stringify({
      chatId: chatId,
      loadingSeconds: loadingSeconds,
    }),
  });
  return res.json();
}
