import { beforeEach, describe, expect, it, vi } from "vitest";
import { hmacSHA256Base64 } from "../src/utils/hmacSHA256Base64";

const mocks = vi.hoisted(() => ({
  eventRouter: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("../src/eventRouter", () => ({
  eventRouter: mocks.eventRouter,
}));

import { router } from "../src/router";

const mockEnv = {
  LINE_CHANNEL_SECRET: { get: vi.fn() },
  LINE_CHANNEL_ACCESS_TOKEN: { get: vi.fn() },
};

describe("router extra branches", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockEnv.LINE_CHANNEL_SECRET.get.mockResolvedValue("secret");
    mockEnv.LINE_CHANNEL_ACCESS_TOKEN.get.mockResolvedValue("accessToken");
  });

  it("returns 400 when body is not valid JSON", async () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const request = new Request("https://example.com", {
      method: "POST",
      headers: { "x-line-signature": "sig" },
      body: "{",
    });

    const response = await router(request, mockEnv as any, {} as any);

    expect(response.status).toBe(400);
    expect(await response.text()).toBe("Invalid JSON");
    errorSpy.mockRestore();
  });

  it("dispatches each event to eventRouter", async () => {
    const eventA = { type: "message", message: { type: "text", text: "Hi" } };
    const eventB = { type: "message", message: { type: "text", text: "hello" } };
    const rawBody = JSON.stringify({ destination: "", events: [eventA, eventB] });
    const signature = await hmacSHA256Base64("secret", rawBody);

    const request = new Request("https://example.com", {
      method: "POST",
      headers: { "x-line-signature": signature },
      body: rawBody,
    });
    const ctx = { waitUntil: vi.fn() } as any;

    const response = await router(request, mockEnv as any, ctx);

    expect(response.status).toBe(200);
    expect(mocks.eventRouter).toHaveBeenCalledTimes(2);
    expect(mocks.eventRouter).toHaveBeenNthCalledWith(1, eventA, "accessToken", ctx);
    expect(mocks.eventRouter).toHaveBeenNthCalledWith(2, eventB, "accessToken", ctx);
  });

  it("returns 200 when events field is missing", async () => {
    const rawBody = JSON.stringify({ destination: "" });
    const signature = await hmacSHA256Base64("secret", rawBody);

    const request = new Request("https://example.com", {
      method: "POST",
      headers: { "x-line-signature": signature },
      body: rawBody,
    });
    const ctx = { waitUntil: vi.fn() } as any;

    const response = await router(request, mockEnv as any, ctx);

    expect(response.status).toBe(200);
    expect(mocks.eventRouter).not.toHaveBeenCalled();
  });
});
