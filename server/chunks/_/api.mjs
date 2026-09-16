import { u as useRuntimeConfig, c as createError, a as deleteCookie, p as proxyRequest, b as getHeader, e as getCookie } from '../nitro/nitro.mjs';
import { randomBytes, createCipheriv, createDecipheriv } from 'crypto';

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;
function getKey() {
  const config = useRuntimeConfig();
  const keyHex = config.tokenEncryptionKey;
  if (!keyHex || keyHex.length !== 64) {
    throw new Error(
      `[crypto] TOKEN_ENCRYPTION_KEY doit \xEAtre une cha\xEEne hexad\xE9cimale de 64 caract\xE8res (32 octets). G\xE9n\xE8re-en une avec : node -e "require('crypto').randomBytes(32).toString('hex')" | Write-Host`
    );
  }
  return Buffer.from(keyHex, "hex");
}
function encryptToken(rawJwt) {
  const key = getKey();
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([
    cipher.update(rawJwt, "utf8"),
    cipher.final()
  ]);
  const tag = cipher.getAuthTag();
  const encode = (buf) => buf.toString("base64url");
  return `${encode(iv)}.${encode(tag)}.${encode(encrypted)}`;
}
function decryptToken(encryptedCookie) {
  try {
    const parts = encryptedCookie.split(".");
    if (parts.length !== 3) return null;
    const [ivB64, tagB64, dataB64] = parts;
    const key = getKey();
    const iv = Buffer.from(ivB64, "base64url");
    const tag = Buffer.from(tagB64, "base64url");
    const data = Buffer.from(dataB64, "base64url");
    const decipher = createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(tag);
    const decrypted = Buffer.concat([decipher.update(data), decipher.final()]);
    return decrypted.toString("utf8");
  } catch {
    return null;
  }
}
function isEncryptedToken(value) {
  return value.split(".").length === 3 && !value.startsWith("eyJ");
}

function getTokenFromEvent(event) {
  const authorization = getHeader(event, "authorization");
  if (authorization == null ? void 0 : authorization.startsWith("Bearer ")) {
    const val = authorization.slice(7);
    if (val && val !== "undefined" && val !== "null") {
      if (isEncryptedToken(val)) {
        return decryptToken(val);
      }
      return val;
    }
  }
  const rawCookie = getCookie(event, "auth_token");
  if (!rawCookie) return null;
  if (isEncryptedToken(rawCookie)) {
    return decryptToken(rawCookie);
  }
  return rawCookie;
}
async function proxyToBackend(event, path, options = {}) {
  var _a, _b, _c;
  const config = useRuntimeConfig();
  const baseUrl = config.apiBaseUrl;
  if (!baseUrl) {
    throw createError({
      statusCode: 500,
      statusMessage: "API base URL not configured"
    });
  }
  const token = getTokenFromEvent(event);
  const url = `${baseUrl}${path}`;
  const headers = {
    "Content-Type": "application/json"
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  try {
    const response = await $fetch(url, {
      method: options.method || "GET",
      headers,
      body: (_a = options.body) != null ? _a : void 0,
      query: options.query
    });
    return response;
  } catch (error) {
    const statusCode = ((_b = error == null ? void 0 : error.response) == null ? void 0 : _b.status) || (error == null ? void 0 : error.statusCode) || 500;
    const data = ((_c = error == null ? void 0 : error.response) == null ? void 0 : _c._data) || (error == null ? void 0 : error.data) || { message: "Erreur serveur" };
    if (statusCode === 401) {
      deleteCookie(event, "auth_token", { path: "/" });
      deleteCookie(event, "auth_role", { path: "/" });
    }
    throw createError({
      statusCode,
      statusMessage: (data == null ? void 0 : data.message) || `Erreur backend ${statusCode}`,
      message: (data == null ? void 0 : data.message) || (typeof data === "string" ? data : `Erreur backend ${statusCode}`),
      data
    });
  }
}
async function proxyBinaryToBackend(event, path, options = {}) {
  const config = useRuntimeConfig();
  const baseUrl = config.apiBaseUrl;
  if (!baseUrl) {
    throw createError({
      statusCode: 500,
      statusMessage: "API base URL not configured"
    });
  }
  let url = `${baseUrl}${path}`;
  if (options.query) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(options.query)) {
      if (value !== void 0 && value !== null) {
        params.append(key, String(value));
      }
    }
    const queryString = params.toString();
    if (queryString) {
      url += (url.includes("?") ? "&" : "?") + queryString;
    }
  }
  const token = getTokenFromEvent(event);
  if (token) {
    event.node.req.headers["authorization"] = `Bearer ${token}`;
  }
  return proxyRequest(event, url);
}

export { proxyBinaryToBackend as a, encryptToken as e, getTokenFromEvent as g, proxyToBackend as p };
//# sourceMappingURL=api.mjs.map
