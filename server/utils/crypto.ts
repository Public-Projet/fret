/**
 * Chiffrement AES-256-GCM pour les tokens JWT stockés dans les cookies.
 */
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12;    // 96 bits — recommandé pour GCM
const TAG_LENGTH = 16;   // 128 bits d'authentification

/**
 * Retourne la clé de 32 octets depuis la variable d'environnement.
 * Lève une erreur au démarrage si absente ou invalide.
 */
function getKey(): Buffer {
  const config = useRuntimeConfig();
  const keyHex = config.tokenEncryptionKey as string;

  if (!keyHex || keyHex.length !== 64) {
    throw new Error(
      '[crypto] TOKEN_ENCRYPTION_KEY doit être une chaîne hexadécimale de 64 caractères (32 octets). ' +
      'Génère-en une avec : node -e "require(\'crypto\').randomBytes(32).toString(\'hex\')" | Write-Host'
    );
  }

  return Buffer.from(keyHex, 'hex');
}

/**
 * Chiffre un JWT brut et retourne une chaîne opaque base64url.
 * Format : `iv.tag.ciphertext` (tout en base64url)
 */
export function encryptToken(rawJwt: string): string {
  const key = getKey();
  const iv = randomBytes(IV_LENGTH);

  const cipher = createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([
    cipher.update(rawJwt, 'utf8'),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();

  // Encode chaque partie en base64url pour un cookie safe
  const encode = (buf: Buffer) => buf.toString('base64url');
  return `${encode(iv)}.${encode(tag)}.${encode(encrypted)}`;
}

/**
 * Déchiffre une valeur de cookie et retourne le JWT brut.
 * Retourne `null` si le cookie est invalide ou altéré.
 */
export function decryptToken(encryptedCookie: string): string | null {
  try {
    const parts = encryptedCookie.split('.');
    if (parts.length !== 3) return null;

    const [ivB64, tagB64, dataB64] = parts;
    const key = getKey();

    const iv = Buffer.from(ivB64, 'base64url');
    const tag = Buffer.from(tagB64, 'base64url');
    const data = Buffer.from(dataB64, 'base64url');

    const decipher = createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(tag);

    const decrypted = Buffer.concat([decipher.update(data), decipher.final()]);
    return decrypted.toString('utf8');
  } catch {
    // Token altéré, expiré ou format invalide
    return null;
  }
}

/**
 * Détecte si une valeur de cookie est chiffrée (format iv.tag.data)
 * ou si c'est un JWT brut legacy (commence par "eyJ").
 */
export function isEncryptedToken(value: string): boolean {
  return value.split('.').length === 3 && !value.startsWith('eyJ');
}
