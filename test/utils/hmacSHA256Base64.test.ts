import { describe, expect, it } from "vitest";
import { hmacSHA256Base64 } from "../../src/utils/hmacSHA256Base64";

describe("hmacSHA256Base64", () => {
  it("returns expected base64 signature for known input", async () => {
    const result = await hmacSHA256Base64("secret", "hello");

    expect(result).toBe("iKqz7ejTrflNJquQ07r9SiCDBww7zOnAFO4EpEOEfAs=");
  });

  it("returns different signatures when message changes", async () => {
    const signatureA = await hmacSHA256Base64("secret", "hello");
    const signatureB = await hmacSHA256Base64("secret", "hello!");

    expect(signatureA).not.toBe(signatureB);
  });
});