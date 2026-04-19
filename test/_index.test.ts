import { describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  router: vi.fn(),
}));

vi.mock("../src/router", () => ({
  router: mocks.router,
}));

import worker from "../src/_index";

describe("worker fetch entry", () => {
  it("delegates request handling to router", async () => {
    const request = new Request("https://example.com", { method: "POST" });
    const env = { SOME_ENV: "value" } as any;
    const ctx = { waitUntil: vi.fn() } as any;
    const expectedResponse = new Response("delegated", { status: 200 });

    mocks.router.mockResolvedValueOnce(expectedResponse);

    const response = await worker.fetch(request, env, ctx);

    expect(mocks.router).toHaveBeenCalledWith(request, env, ctx);
    expect(response).toBe(expectedResponse);
  });
});
