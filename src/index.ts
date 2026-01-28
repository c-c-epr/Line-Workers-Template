import { hmacSHA256Base64 } from "./utils/hmacSHA256Base64.ts";
import { handleEvent } from "./utils/handleEvent.ts";

export default {
  async fetch(request: Request, env: any, ctx: any): Promise<Response> {
    // 檢查方法合法
    if (request.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 });
    }
    // 取得環境變數
    const [channelSecret, channelAccessToken] = await Promise.all([
      env.LINE_CHANNEL_SECRET.get(),
      env.LINE_CHANNEL_ACCESS_TOKEN.get(),
    ]);
    // 讀取 raw body 和 LINE 簽章 header
    const clone = request.clone();
    const body = await clone.json();
    const rawBody = await request.text();
    const lineSignature = request.headers.get("x-line-signature");
    // 計算 HMAC-SHA256 和 base64 並檢驗簽章
    const computedSignature = await hmacSHA256Base64(channelSecret, rawBody);
    if (computedSignature !== lineSignature) {
      return new Response("Invalid signature", { status: 401 });
    }
    // 解析 JSON body
    const events = body.events || [];
    const destination = body.destination || "";

    for (const event of events) {
      await handleEvent(event, channelAccessToken);
    }
    // 回應 LINE 伺服器
    return new Response("OK");
  },
};
