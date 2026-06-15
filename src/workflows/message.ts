import { WorkflowEntrypoint, WorkflowEvent, WorkflowStep } from "cloudflare:workers";
type Params = {};
export class MyWorkflow extends WorkflowEntrypoint<Env, Params> {
  async run(event: WorkflowEvent<Params>, step: WorkflowStep) {
    step.do("my first step", async () => {
      console.log("first step");
    });
    step.do("my second step", async () => {
      console.log("second step");
    });
  }
}
