import { router } from "./router";
export { SendmessageWithDelay } from "./workflows";

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    return await router(request, env, ctx);
  },
};
