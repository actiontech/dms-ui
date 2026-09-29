/**
 * @jest-environment node
 */
import {
  encryptPasswordForTransport,
  PASSWORD_TRANSPORT_SECRET_KEY
} from '../passwordTransportEncryption';

describe('passwordTransportEncryption (fixed AES)', () => {
  it('uses the backend compile-time SecretKey constant', () => {
    expect(PASSWORD_TRANSPORT_SECRET_KEY).toBe(
      '471F77D078C5994BD06B65B8B5B1935B'
    );
  });

  it('encrypts to Base64 AES-256-CBC matching Go pkg/aes', async () => {
    // Reference ciphertexts from dms-ee pkg/aes NewEncryptor(SecretKey).AesEncrypt
    await expect(encryptPasswordForTransport('test')).resolves.toEqual({
      secret_password: 'MbFLdPIZEb/G2QAHPMxSuQ=='
    });
    await expect(encryptPasswordForTransport('admin')).resolves.toEqual({
      secret_password: 'lvwmEx6EhCnyMw9cEOKIXQ=='
    });
  });

  it('returns only secret_password (no encryption_key_id)', async () => {
    const cipher = await encryptPasswordForTransport('hello');
    expect(cipher).toEqual({
      secret_password: 'aFPI8tYp2iiuN/6Kk30TZw=='
    });
    expect(Object.keys(cipher)).toEqual(['secret_password']);
  });
});
