/**
 * Shared outbound password transport helper (connect / create / update).
 * Fixed AES-256-CBC, same SecretKey and wire format as backend pkg/aes.
 * Implemented in-page so HTTP (non-secure context) does not need crypto.subtle.
 */

/** Must match backend `pkg/dms-common/pkg/aes.SecretKey`. */
export const PASSWORD_TRANSPORT_SECRET_KEY = '471F77D078C5994BD06B65B8B5B1935B';

export type PasswordTransportCipher = {
  secret_password: string;
};

export type PasswordTransportErrorReason = 'encrypt_failed';

export class PasswordTransportError extends Error {
  reason: PasswordTransportErrorReason;

  constructor(reason: PasswordTransportErrorReason, message?: string) {
    super(message ?? reason);
    this.name = 'PasswordTransportError';
    this.reason = reason;
  }
}

const SBOX = [
  99, 124, 119, 123, 242, 107, 111, 197, 48, 1, 103, 43, 254, 215, 171, 118,
  202, 130, 201, 125, 250, 89, 71, 240, 173, 212, 162, 175, 156, 164, 114, 192,
  183, 253, 147, 38, 54, 63, 247, 204, 52, 165, 229, 241, 113, 216, 49, 21, 4,
  199, 35, 195, 24, 150, 5, 154, 7, 18, 128, 226, 235, 39, 178, 117, 9, 131, 44,
  26, 27, 110, 90, 160, 82, 59, 214, 179, 41, 227, 47, 132, 83, 209, 0, 237, 32,
  252, 177, 91, 106, 203, 190, 57, 74, 76, 88, 207, 208, 239, 170, 251, 67, 77,
  51, 133, 69, 249, 2, 127, 80, 60, 159, 168, 81, 163, 64, 143, 146, 157, 56,
  245, 188, 182, 218, 33, 16, 255, 243, 210, 205, 12, 19, 236, 95, 151, 68, 23,
  196, 167, 126, 61, 100, 93, 25, 115, 96, 129, 79, 220, 34, 42, 144, 136, 70,
  238, 184, 20, 222, 94, 11, 219, 224, 50, 58, 10, 73, 6, 36, 92, 194, 211, 172,
  98, 145, 149, 228, 121, 231, 200, 55, 109, 141, 213, 78, 169, 108, 86, 244,
  234, 101, 122, 174, 8, 186, 120, 37, 46, 28, 166, 180, 198, 232, 221, 116, 31,
  75, 189, 139, 138, 112, 62, 181, 102, 72, 3, 246, 14, 97, 53, 87, 185, 134,
  193, 29, 158, 225, 248, 152, 17, 105, 217, 142, 148, 155, 30, 135, 233, 206,
  85, 40, 223, 140, 161, 137, 13, 191, 230, 66, 104, 65, 153, 45, 15, 176, 84,
  187, 22
];
const RCON = [0, 1, 2, 4, 8, 16, 32, 64, 128, 27, 54];
const xt = (a: number): number => ((a << 1) ^ ((a >>> 7) * 0x11b)) & 255;

function expandKey(key: Uint8Array): Uint8Array {
  const nr = 14;
  const w = new Uint8Array(16 * (nr + 1));
  w.set(key);
  let bytes = 32;
  let rcon = 1;
  const t = new Uint8Array(4);
  while (bytes < w.length) {
    t.set(w.subarray(bytes - 4, bytes));
    if (bytes % 32 === 0) {
      const a = t[0];
      t[0] = SBOX[t[1]] ^ RCON[rcon++];
      t[1] = SBOX[t[2]];
      t[2] = SBOX[t[3]];
      t[3] = SBOX[a];
    } else if (bytes % 32 === 16) {
      t[0] = SBOX[t[0]];
      t[1] = SBOX[t[1]];
      t[2] = SBOX[t[2]];
      t[3] = SBOX[t[3]];
    }
    for (let i = 0; i < 4; i++) {
      w[bytes] = w[bytes - 32] ^ t[i];
      bytes++;
    }
  }
  return w;
}

function encryptBlock(block: Uint8Array, roundKeys: Uint8Array): Uint8Array {
  const s = new Uint8Array(block);
  const nr = 14;
  const add = (round: number): void => {
    const off = round * 16;
    for (let i = 0; i < 16; i++) s[i] ^= roundKeys[off + i];
  };
  const subShift = () => {
    for (let i = 0; i < 16; i++) s[i] = SBOX[s[i]];
    const t = new Uint8Array(s);
    for (let r = 1; r < 4; r++) {
      for (let c = 0; c < 4; c++) s[r + 4 * c] = t[r + 4 * ((c + r) & 3)];
    }
  };
  const mix = () => {
    for (let c = 0; c < 4; c++) {
      const i = 4 * c;
      const a0 = s[i],
        a1 = s[i + 1],
        a2 = s[i + 2],
        a3 = s[i + 3];
      s[i] = xt(a0) ^ (xt(a1) ^ a1) ^ a2 ^ a3;
      s[i + 1] = a0 ^ xt(a1) ^ (xt(a2) ^ a2) ^ a3;
      s[i + 2] = a0 ^ a1 ^ xt(a2) ^ (xt(a3) ^ a3);
      s[i + 3] = xt(a0) ^ a0 ^ a1 ^ a2 ^ xt(a3);
    }
  };
  add(0);
  for (let round = 1; round < nr; round++) {
    subShift();
    mix();
    add(round);
  }
  subShift();
  add(nr);
  return s;
}

const bytesToBase64 = (bytes: Uint8Array): string => {
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};

/**
 * Encrypts plaintext with AES-256-CBC (IV = key[:16], PKCS7, Base64).
 * Never falls back to plaintext.
 */
export const encryptPasswordForTransport = async (
  plainPassword: string
): Promise<PasswordTransportCipher> => {
  try {
    const key = new TextEncoder().encode(PASSWORD_TRANSPORT_SECRET_KEY);
    const roundKeys = expandKey(key);
    const iv = key.slice(0, 16);
    const data = new TextEncoder().encode(plainPassword);
    const pad = 16 - (data.length % 16);
    const buf = new Uint8Array(data.length + pad);
    buf.set(data);
    buf.fill(pad, data.length);
    const out = new Uint8Array(buf.length);
    let prev: Uint8Array = iv;
    for (let offset = 0; offset < buf.length; offset += 16) {
      const block = buf.slice(offset, offset + 16);
      for (let i = 0; i < 16; i++) {
        block[i] ^= prev[i];
      }
      const encrypted = encryptBlock(block, roundKeys);
      out.set(encrypted, offset);
      prev = encrypted;
    }
    const secret_password = bytesToBase64(out);
    if (!secret_password) {
      throw new PasswordTransportError('encrypt_failed');
    }
    return { secret_password };
  } catch (error) {
    if (error instanceof PasswordTransportError) {
      throw error;
    }
    throw new PasswordTransportError('encrypt_failed');
  }
};
