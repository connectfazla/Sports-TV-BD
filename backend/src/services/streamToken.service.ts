import { hmacSign, hmacVerify, decryptAES } from '../utils/crypto';
import { env } from '../config/env';
import { Mirror } from '../types/models';

export function signStreamUrl(rawUrl: string, userId: string, mirrorId: string): string {
  const exp = Math.floor(Date.now() / 1000) + env.STREAM_TOKEN_TTL;
  const data = `${mirrorId}:${userId}:${exp}`;
  const token = hmacSign(data);
  const separator = rawUrl.includes('?') ? '&' : '?';
  return `${rawUrl}${separator}tk=${token}&uid=${userId}&exp=${exp}`;
}

export function validateStreamToken(mirrorId: string, userId: string, exp: number, token: string): boolean {
  if (Math.floor(Date.now() / 1000) > exp) return false;
  const data = `${mirrorId}:${userId}:${exp}`;
  return hmacVerify(data, token);
}

export function decryptMirrorUrl(mirror: Mirror): string {
  return decryptAES(mirror.url_encrypted, mirror.url_iv, mirror.url_tag);
}
