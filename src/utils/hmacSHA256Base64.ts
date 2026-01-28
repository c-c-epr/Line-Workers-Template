export async function hmacSHA256Base64(
  secret: string,
  message: string,
): Promise<string> {
  const enc = new TextEncoder();

  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );

  const signature = await crypto.subtle.sign("HMAC", key, enc.encode(message));

  return btoa(String.fromCharCode(...new Uint8Array(signature)));
}
