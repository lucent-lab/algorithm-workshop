/**
 * Base64 encode/decode utilities (UTF-8 strings and bytes).
 */
export function base64Encode(input: string | Uint8Array): string {
  if (typeof input === 'string') {
    const bytes = new TextEncoder().encode(input);
    return encodeBytes(bytes);
  }
  return encodeBytes(input);
}

export function base64Decode(b64: string): Uint8Array {
  return decodeToBytes(b64);
}

function encodeBytes(bytes: Uint8Array): string {
  if (typeof Buffer !== 'undefined') {
    // Node
    // eslint-disable-next-line no-undef
    return Buffer.from(bytes).toString('base64');
  }
  // Browser
  let binary = '';
  for (let i = 0; i < bytes.length; i += 1) binary += String.fromCharCode(bytes[i]);
  const g = globalThis as unknown as { btoa?: (s: string) => string };
  if (!g.btoa) throw new Error('Base64 encode not available in this environment');
  return g.btoa(binary);
}

function decodeToBytes(b64: string): Uint8Array {
  if (typeof Buffer !== 'undefined') {
    // eslint-disable-next-line no-undef
    return new Uint8Array(Buffer.from(b64, 'base64'));
  }
  const g = globalThis as unknown as { atob?: (s: string) => string };
  if (!g.atob) throw new Error('Base64 decode not available in this environment');
  const binary: string = g.atob(b64);
  const out = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) out[i] = binary.charCodeAt(i);
  return out;
}
