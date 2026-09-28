/**
 * Shared outbound password transport helper (S1 connect / S2 create / S3 update).
 * Fixed AES-256-CBC with compile-time SecretKey (same as backend pkg/aes).
 * No fetch of public key; output field is only secret_password.
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

const textEncoder = new TextEncoder();

const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};

/**
 * Encrypts plaintext with AES-256-CBC (IV = key[:16], PKCS7, Base64).
 * Never falls back to plaintext; never returns encryption_key_id.
 */
export const encryptPasswordForTransport = async (
  plainPassword: string
): Promise<PasswordTransportCipher> => {
  try {
    const keyBytes = textEncoder.encode(PASSWORD_TRANSPORT_SECRET_KEY);
    const iv = keyBytes.slice(0, 16);
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyBytes,
      { name: 'AES-CBC' },
      false,
      ['encrypt']
    );
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-CBC', iv },
      cryptoKey,
      textEncoder.encode(plainPassword)
    );
    const secret_password = arrayBufferToBase64(encrypted);
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
