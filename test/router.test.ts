import { beforeEach, describe, expect, it, vi } from "vitest";
import { router } from "../src/router";
import { hmacSHA256Base64 } from "../src/utils/hmacSHA256Base64";

const mockEnv = {
  LINE_CHANNEL_SECRET: { get: vi.fn() },
  LINE_CHANNEL_ACCESS_TOKEN: { get: vi.fn() },
};

describe("router", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockEnv.LINE_CHANNEL_SECRET.get.mockResolvedValue("secret");
    mockEnv.LINE_CHANNEL_ACCESS_TOKEN.get.mockResolvedValue("accessToken");
  });

  it("returns 405 for non-POST methods", async () => {
    const request = new Request("https://example.com", { method: "GET" });
    const response = await router(request, mockEnv as any, {} as any);

    expect(response.status).toBe(405);
    expect(await response.text()).toBe("Method Not Allowed");
  });

  it("returns 400 if signature is missing", async () => {
    const request = new Request("https://example.com", { method: "POST" });
    const response = await router(request, mockEnv as any, {} as any);

    expect(response.status).toBe(400);
    expect(await response.text()).toBe("Missing signature");
  });

  it("returns 401 if signature is invalid", async () => {
    const request = new Request("https://example.com", {
      method: "POST",
      headers: { "x-line-signature": "invalid" },
      body: JSON.stringify({}),
    });
    const response = await router(request, mockEnv as any, {} as any);

    expect(response.status).toBe(401);
    expect(await response.text()).toBe("Invalid signature");
  });

  it("returns 500 if server is misconfigured", async () => {
    mockEnv.LINE_CHANNEL_SECRET.get.mockResolvedValue(null);
    const request = new Request("https://example.com", { method: "POST" });
    const response = await router(request, mockEnv as any, {} as any);

    expect(response.status).toBe(500);
    expect(await response.text()).toBe("Server misconfigured");
  });

  it("returns 200 for a valid signed request", async () => {
    const rawBody = JSON.stringify({ destination: "", events: [] });
    const signature = await hmacSHA256Base64("secret", rawBody);
    const request = new Request("https://example.com", {
      method: "POST",
      headers: { "x-line-signature": signature },
      body: rawBody,
    });

    const response = await router(request, mockEnv as any, {} as any);

    expect(response.status).toBe(200);
    expect(await response.text()).toBe("OK");
  });
});
