export async function markAsRead(
  ChannelAccessToken: string,
  markAsReadToken: string,
) {
  const res = await fetch("https://api.line.me/v2/bot/chat/markAsRead", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${ChannelAccessToken}`,
    },
    method: "POST",
    body: JSON.stringify({
      markAsReadToken: markAsReadToken,
    }),
  });
  return res.json();
}
