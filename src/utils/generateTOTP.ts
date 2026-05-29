export async function generateTOTP(secret: string, digits = 6, period = 30): Promise<string> {
  // 1. 計算 counter
  const counter = Math.floor(Date.now() / 1000 / period);

  // 2. secret(base32) -> bytes
  const key = base32Decode(secret);

  // 3. counter -> 8-byte big-endian
  const counterBuffer = new ArrayBuffer(8);
  const counterView = new DataView(counterBuffer);

  // 高 32 bits
  counterView.setUint32(0, Math.floor(counter / 0x100000000));

  // 低 32 bits
  counterView.setUint32(4, counter >>> 0);

  // 4. 建立 HMAC key
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    key,
    {
      name: "HMAC",
      hash: "SHA-1", // Google Authenticator 標準
    },
    false,
    ["sign"],
  );

  // 5. HMAC(counter)
  const hmac = await crypto.subtle.sign("HMAC", cryptoKey, counterBuffer);

  const hmacBytes = new Uint8Array(hmac);

  // 6. Dynamic truncation
  const offset = hmacBytes[hmacBytes.length - 1] & 0xf;

  const binary =
    ((hmacBytes[offset] & 0x7f) << 24) |
    ((hmacBytes[offset + 1] & 0xff) << 16) |
    ((hmacBytes[offset + 2] & 0xff) << 8) |
    (hmacBytes[offset + 3] & 0xff);

  // 7. 取 digits 位數
  const otp = binary % 10 ** digits;

  return otp.toString().padStart(digits, "0");
}

/**
 * Base32 解碼
 * RFC4648
 */
function base32Decode(base32: string): ArrayBuffer {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

  let bits = "";
  let result: number[] = [];

  base32 = base32.replace(/=+$/, "").toUpperCase();

  for (const char of base32) {
    const val = alphabet.indexOf(char);

    if (val === -1) {
      throw new Error(`Invalid base32 char: ${char}`);
    }

    bits += val.toString(2).padStart(5, "0");
  }

  for (let i = 0; i + 8 <= bits.length; i += 8) {
    result.push(parseInt(bits.slice(i, i + 8), 2));
  }

  const buffer = new ArrayBuffer(result.length);
  const bytes = new Uint8Array(buffer);

  for (let i = 0; i < result.length; i++) {
    bytes[i] = result[i];
  }

  return buffer;
}
