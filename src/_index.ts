import { router } from "./router";

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    return await router(request, env, ctx);
  },
};
