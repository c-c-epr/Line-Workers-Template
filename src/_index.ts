import { router } from "./router";
export { MyWorkflow } from "./workflows/message";

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    return await router(request, env, ctx);
  },
};
