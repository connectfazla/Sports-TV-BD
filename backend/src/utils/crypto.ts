import crypto from 'crypto';
import { env } from '../config/env';

const ALGORITHM = 'aes-256-gcm';
const KEY = Buffer.from(env.CONFIG_ENCRYPTION_KEY, 'hex');

export function encryptAES(plaintext: string): { encrypted: string; iv: string; tag: string } {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);
  const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return {
    encrypted: encrypted.toString('base64'),
    iv: iv.toString('base64'),
    tag: tag.toString('base64'),
  };
}

export function decryptAES(encrypted: string, iv: string, tag: string): string {
  const decipher = crypto.createDecipheriv(ALGORITHM, KEY, Buffer.from(iv, 'base64'));
  decipher.setAuthTag(Buffer.from(tag, 'base64'));
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(encrypted, 'base64')),
    decipher.final(),
  ]);
  return decrypted.toString('utf8');
}

export function hmacSign(data: string, secret: string = env.STREAM_HMAC_SECRET): string {
  return crypto.createHmac('sha256', secret).update(data).digest('hex');
}

export function hmacVerify(data: string, signature: string, secret: string = env.STREAM_HMAC_SECRET): boolean {
  const expected = hmacSign(data, secret);
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
}
