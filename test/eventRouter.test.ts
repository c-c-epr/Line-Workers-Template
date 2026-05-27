import { beforeEach, describe, expect, it, vi } from "vitest";
import { version } from "../package.json";

vi.mock("cloudflare:workers", () => ({
  env: {
    CF_VERSION_METADATA: {
      id: "test-version-id",
      tag: "test-version-tag",
      timestamp: "2026-05-27T00:00:00.000Z",
    },
  },
}));

const mocks = vi.hoisted(() => ({
  markAsRead: vi.fn().mockResolvedValue(undefined),
  loadStart: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("../src/utils/eventRoutes", () => ({
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

    const responses = await eventRouter(event, "accessToken", ctx);

    expect(ctx.waitUntil).toHaveBeenCalledTimes(1);
    expect(mocks.markAsRead).toHaveBeenCalledWith("accessToken", "mark-token");
    expect(mocks.loadStart).toHaveBeenCalledWith("accessToken", "U123", 5);
    expect(responses).toEqual([{ type: "text", text: "Hi" }]);
  });

  it("handles 'hi' message", async () => {
    const event = {
      type: "message",
      source: { userId: "U123" },
      message: { type: "text", text: "hi", markAsReadToken: "mark-token" },
      replyToken: "reply-token",
    };
    const ctx = { waitUntil: vi.fn() } as any;

    const responses = await eventRouter(event, "accessToken", ctx);

    expect(responses).toEqual([{ type: "text", text: "Hi" }]);
  });

  it("handles default text message", async () => {
    const event = {
      type: "message",
      source: { userId: "U123" },
      message: { type: "text", text: "unknown", markAsReadToken: "mark-token" },
      replyToken: "reply-token",
    };
    const ctx = { waitUntil: vi.fn() } as any;

    const responses = await eventRouter(event, "accessToken", ctx);

    expect(responses).toEqual([{ type: "text", text: "Hello from Cloudflare Workers!" }]);
  });

  it("handles /version message", async () => {
    const event = {
      type: "message",
      source: { userId: "U123" },
      message: { type: "text", text: "/version", markAsReadToken: "mark-token" },
      replyToken: "reply-token",
    };
    const ctx = { waitUntil: vi.fn() } as any;

    const responses = await eventRouter(event, "accessToken", ctx);

    expect(responses).toHaveLength(1);
    expect(responses?.[0].type).toBe("text");
    expect(responses?.[0].text).toContain("ID: test-ver");
    expect(responses?.[0].text).toContain("Tag: test-version-tag");
    expect(responses?.[0].text).toContain(`Package: v${version}`);
  });
});
