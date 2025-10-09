import { describe, it, expect } from 'vitest';
import { base64Encode, base64Decode } from '../src/index.js';

describe('Base64', () => {
  it('encodes and decodes UTF-8 strings', () => {
    const s = 'Hello, 世界! 🎉';
    const b64 = base64Encode(s);
    const bytes = base64Decode(b64);
    const back = new TextDecoder().decode(bytes);
    expect(back).toBe(s);
  });
});

