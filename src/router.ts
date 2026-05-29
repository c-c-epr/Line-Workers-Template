import { handleWebhook } from "./handlers/webhook";

export async function router(request: Request, env: Env, ctx: ExecutionContext) {
  const pathname = new URL(request.url).pathname;
  if (pathname === "/webhook") {
    return await handleWebhook(request, env, ctx);
  }

  return new Response("Not Found", { status: 404 });
}
