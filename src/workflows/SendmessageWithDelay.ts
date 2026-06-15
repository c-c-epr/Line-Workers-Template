import { WorkflowEntrypoint, WorkflowEvent, WorkflowStep } from "cloudflare:workers";
import { sendMessage } from "../utils/eventRoutes";
import type { Message } from "../types";
import { env } from "cloudflare:workers";

type Params = { replyToken: string; messages: Message[]; waitFor: number };

export class SendmessageWithDelay extends WorkflowEntrypoint<Env, Params> {
  async run(event: WorkflowEvent<Params>, step: WorkflowStep) {
    await step.sleep(`Wait for ${event.payload.waitFor} seconds`, event.payload.waitFor);

    const sendMessageResult = await step.do("Send Message", async () => {
      await sendMessage(env.LINE_CHANNEL_ACCESS_TOKEN, event.payload.replyToken, event.payload.messages);
      return "Message sent";
    });

    return "OK";
  }
}
