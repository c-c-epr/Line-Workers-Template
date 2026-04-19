import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";
import { loadStart, markAsRead, sendMessage } from "../../src/utils/eventRoutes";

describe("eventRoutes", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal("fetch", fetchMock);
  });

  afterAll(() => {
    vi.unstubAllGlobals();
  });

  it("sendMessage calls LINE reply API with expected payload", async () => {
    fetchMock.mockResolvedValueOnce({
      json: vi.fn().mockResolvedValueOnce({ ok: true }),
    });

    const result = await sendMessage("token-123", "reply-123", [{ type: "text", text: "Hello" }]);

    expect(fetchMock).toHaveBeenCalledWith("https://api.line.me/v2/bot/message/reply", {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer token-123",
      },
      method: "POST",
      body: JSON.stringify({
        replyToken: "reply-123",
        messages: [{ type: "text", text: "Hello" }],
      }),
    });
    expect(result).toEqual({ ok: true });
  });

  it("markAsRead calls LINE markAsRead API with expected payload", async () => {
    fetchMock.mockResolvedValueOnce({
      json: vi.fn().mockResolvedValueOnce({ ok: true }),
    });

    const result = await markAsRead("token-123", "mark-123");

    expect(fetchMock).toHaveBeenCalledWith("https://api.line.me/v2/bot/chat/markAsRead", {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer token-123",
      },
      method: "POST",
      body: JSON.stringify({
        markAsReadToken: "mark-123",
      }),
    });
    expect(result).toEqual({ ok: true });
  });

  it("loadStart calls LINE loading API with expected payload", async () => {
    fetchMock.mockResolvedValueOnce({
      json: vi.fn().mockResolvedValueOnce({ ok: true }),
    });

    const result = await loadStart("token-123", "U123", 5);

    expect(fetchMock).toHaveBeenCalledWith("https://api.line.me/v2/bot/chat/loading/start", {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer token-123",
      },
      method: "POST",
      body: JSON.stringify({
        chatId: "U123",
        loadingSeconds: 5,
      }),
    });
    expect(result).toEqual({ ok: true });
  });

  it("barrel index re-exports all event route helpers", async () => {
    const barrel = await import("../../src/utils/eventRoutes/index");

    expect(typeof barrel.sendMessage).toBe("function");
    expect(typeof barrel.markAsRead).toBe("function");
    expect(typeof barrel.loadStart).toBe("function");
  });
});
