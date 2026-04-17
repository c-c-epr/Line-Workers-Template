import type { webhook } from "@line/bot-sdk";
import { hmacSHA256Base64 } from "./utils/hmacSHA256Base64";
import { eventRouter } from "./eventRouter";

interface Env {
  LINE_CHANNEL_SECRET: {
    get(): Promise<string>;
  };
  LINE_CHANNEL_ACCESS_TOKEN: {
    get(): Promise<string>;
  };
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    // 檢查方法合法
    if (request.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 });
    }
    // 取得環境變數
    const [channelSecret, channelAccessToken] = await Promise.all([
      env.LINE_CHANNEL_SECRET.get(),
      env.LINE_CHANNEL_ACCESS_TOKEN.get(),
    ]);
    if (!channelSecret || !channelAccessToken) {
      return new Response("Server misconfigured", { status: 500 });
    }

    // LINE 簽章 header
    const lineSignature = request.headers.get("x-line-signature");
    if (!lineSignature) {
      return new Response("Missing signature", { status: 400 });
    }

    //讀取 raw body
    let body: webhook.CallbackRequest = { destination: "", events: [] };
    let rawBody = "";

    try {
      const clone = request.clone();
      body = await clone.json();
      rawBody = await request.text();
    } catch (e) {
      console.error("Failed JSON", { error: e, rawBody });
      return new Response("Invalid JSON", { status: 400 });
    }

    // 計算 HMAC-SHA256 和 base64 並檢驗簽章
    const computedSignature = await hmacSHA256Base64(channelSecret, rawBody);
    if (computedSignature !== lineSignature) {
      return new Response("Invalid signature", { status: 401 });
    }
    // 解析 JSON body
    const events = body.events || [];

    for (const event of events) {
      await eventRouter(event, channelAccessToken, ctx);
    }
    // 回應 LINE 伺服器
    return new Response("OK");
  },
};
