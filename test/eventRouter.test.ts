import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  sendMessage: vi.fn(),
  markAsRead: vi.fn().mockResolvedValue(undefined),
  loadStart: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("../src/utils/eventRoutes", () => ({
  sendMessage: mocks.sendMessage,
  markAsRead: mocks.markAsRead,
  loadStart: mocks.loadStart,
}));

import { eventRouter } from "../src/eventRouter";

describe("eventRouter", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("handles 'Hi' message", async () => {
    const event = {
      type: "message",
      source: { userId: "U123" },
      message: { type: "text", text: "Hi", markAsReadToken: "mark-token" },
      replyToken: "reply-token",
    };
    const ctx = { waitUntil: vi.fn() } as any;

    await eventRouter(event, "accessToken", ctx);

    expect(ctx.waitUntil).toHaveBeenCalledTimes(1);
    expect(mocks.markAsRead).toHaveBeenCalledWith("accessToken", "mark-token");
    expect(mocks.loadStart).toHaveBeenCalledWith("accessToken", "U123", 5);
    expect(mocks.sendMessage).toHaveBeenCalledWith("accessToken", "reply-token", [
      { type: "text", text: "Hi" },
    ]);
  });

  it("handles 'hi' message", async () => {
    const event = {
      type: "message",
      source: { userId: "U123" },
      message: { type: "text", text: "hi", markAsReadToken: "mark-token" },
      replyToken: "reply-token",
    };
    const ctx = { waitUntil: vi.fn() } as any;

    await eventRouter(event, "accessToken", ctx);

    expect(mocks.sendMessage).toHaveBeenCalledWith("accessToken", "reply-token", [
      { type: "text", text: "Hi" },
    ]);
  });

  it("handles default text message", async () => {
    const event = {
      type: "message",
      source: { userId: "U123" },
      message: { type: "text", text: "unknown", markAsReadToken: "mark-token" },
      replyToken: "reply-token",
    };
    const ctx = { waitUntil: vi.fn() } as any;

    await eventRouter(event, "accessToken", ctx);

    expect(mocks.sendMessage).toHaveBeenCalledWith("accessToken", "reply-token", [
      { type: "text", text: "Hello from Cloudflare Workers!" },
    ]);
  });
});
