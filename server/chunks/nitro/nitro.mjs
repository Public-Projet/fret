import process from 'node:process';globalThis._importMeta_=globalThis._importMeta_||{url:"file:///_entry.js",env:process.env};import http, { Server as Server$1 } from 'node:http';
import https, { Server } from 'node:https';
import { EventEmitter } from 'node:events';
import { Buffer as Buffer$1 } from 'node:buffer';
import { promises, existsSync } from 'node:fs';
import { resolve as resolve$2, dirname as dirname$1, join } from 'node:path';
import { createHash } from 'node:crypto';
import { toValue } from 'vue';
import { createConsola } from 'consola';
import { fileURLToPath } from 'node:url';

const suspectProtoRx = /"(?:_|\\u0{2}5[Ff]){2}(?:p|\\u0{2}70)(?:r|\\u0{2}72)(?:o|\\u0{2}6[Ff])(?:t|\\u0{2}74)(?:o|\\u0{2}6[Ff])(?:_|\\u0{2}5[Ff]){2}"\s*:/;
const suspectConstructorRx = /"(?:c|\\u0063)(?:o|\\u006[Ff])(?:n|\\u006[Ee])(?:s|\\u0073)(?:t|\\u0074)(?:r|\\u0072)(?:u|\\u0075)(?:c|\\u0063)(?:t|\\u0074)(?:o|\\u006[Ff])(?:r|\\u0072)"\s*:/;
const JsonSigRx = /^\s*["[{]|^\s*-?\d{1,16}(\.\d{1,17})?([Ee][+-]?\d+)?\s*$/;
function jsonParseTransform(key, value) {
  if (key === "__proto__" || key === "constructor" && value && typeof value === "object" && "prototype" in value) {
    warnKeyDropped(key);
    return;
  }
  return value;
}
function warnKeyDropped(key) {
  console.warn(`[destr] Dropping "${key}" key to prevent prototype pollution.`);
}
function destr(value, options = {}) {
  if (typeof value !== "string") {
    return value;
  }
  if (value[0] === '"' && value[value.length - 1] === '"' && value.indexOf("\\") === -1) {
    return value.slice(1, -1);
  }
  const _value = value.trim();
  if (_value.length <= 9) {
    switch (_value.toLowerCase()) {
      case "true": {
        return true;
      }
      case "false": {
        return false;
      }
      case "undefined": {
        return void 0;
      }
      case "null": {
        return null;
      }
      case "nan": {
        return Number.NaN;
      }
      case "infinity": {
        return Number.POSITIVE_INFINITY;
      }
      case "-infinity": {
        return Number.NEGATIVE_INFINITY;
      }
    }
  }
  if (!JsonSigRx.test(value)) {
    if (options.strict) {
      throw new SyntaxError("[destr] Invalid JSON");
    }
    return value;
  }
  try {
    if (suspectProtoRx.test(value) || suspectConstructorRx.test(value)) {
      if (options.strict) {
        throw new Error("[destr] Possible prototype pollution");
      }
      return JSON.parse(value, jsonParseTransform);
    }
    return JSON.parse(value);
  } catch (error) {
    if (options.strict) {
      throw error;
    }
    return value;
  }
}

const HASH_RE = /#/g;
const AMPERSAND_RE = /&/g;
const SLASH_RE = /\//g;
const EQUAL_RE = /=/g;
const IM_RE = /\?/g;
const PLUS_RE = /\+/g;
const ENC_CARET_RE = /%5e/gi;
const ENC_BACKTICK_RE = /%60/gi;
const ENC_PIPE_RE = /%7c/gi;
const ENC_SPACE_RE = /%20/gi;
const ENC_SLASH_RE = /%2f/gi;
const ENC_ENC_SLASH_RE = /%252f/gi;
function encode(text) {
  return encodeURI("" + text).replace(ENC_PIPE_RE, "|");
}
function encodeQueryValue(input) {
  return encode(typeof input === "string" ? input : JSON.stringify(input)).replace(PLUS_RE, "%2B").replace(ENC_SPACE_RE, "+").replace(HASH_RE, "%23").replace(AMPERSAND_RE, "%26").replace(ENC_BACKTICK_RE, "`").replace(ENC_CARET_RE, "^").replace(SLASH_RE, "%2F");
}
function encodeQueryKey(text) {
  return encodeQueryValue(text).replace(EQUAL_RE, "%3D");
}
function encodePath(text) {
  return encode(text).replace(HASH_RE, "%23").replace(IM_RE, "%3F").replace(ENC_ENC_SLASH_RE, "%2F").replace(AMPERSAND_RE, "%26").replace(PLUS_RE, "%2B");
}
function decode$1(text = "") {
  try {
    return decodeURIComponent("" + text);
  } catch {
    return "" + text;
  }
}
function decodePath(text) {
  return decode$1(text.replace(ENC_SLASH_RE, "%252F"));
}
function decodeQueryKey(text) {
  return decode$1(text.replace(PLUS_RE, " "));
}
function decodeQueryValue(text) {
  return decode$1(text.replace(PLUS_RE, " "));
}

function parseQuery(parametersString = "") {
  const object = /* @__PURE__ */ Object.create(null);
  if (parametersString[0] === "?") {
    parametersString = parametersString.slice(1);
  }
  for (const parameter of parametersString.split("&")) {
    const s = parameter.match(/([^=]+)=?(.*)/) || [];
    if (s.length < 2) {
      continue;
    }
    const key = decodeQueryKey(s[1]);
    if (key === "__proto__" || key === "constructor") {
      continue;
    }
    const value = decodeQueryValue(s[2] || "");
    if (object[key] === void 0) {
      object[key] = value;
    } else if (Array.isArray(object[key])) {
      object[key].push(value);
    } else {
      object[key] = [object[key], value];
    }
  }
  return object;
}
function encodeQueryItem(key, value) {
  if (typeof value === "number" || typeof value === "boolean") {
    value = String(value);
  }
  if (!value) {
    return encodeQueryKey(key);
  }
  if (Array.isArray(value)) {
    return value.map(
      (_value) => `${encodeQueryKey(key)}=${encodeQueryValue(_value)}`
    ).join("&");
  }
  return `${encodeQueryKey(key)}=${encodeQueryValue(value)}`;
}
function stringifyQuery(query) {
  return Object.keys(query).filter((k) => query[k] !== void 0).map((k) => encodeQueryItem(k, query[k])).filter(Boolean).join("&");
}

const PROTOCOL_STRICT_REGEX = /^[\s\w\0+.-]{2,}:([/\\]{1,2})/;
const PROTOCOL_REGEX = /^[\s\w\0+.-]{2,}:([/\\]{2})?/;
const PROTOCOL_RELATIVE_REGEX = /^([/\\]\s*){2,}[^/\\]/;
const JOIN_LEADING_SLASH_RE = /^\.?\//;
function hasProtocol(inputString, opts = {}) {
  if (typeof opts === "boolean") {
    opts = { acceptRelative: opts };
  }
  if (opts.strict) {
    return PROTOCOL_STRICT_REGEX.test(inputString);
  }
  return PROTOCOL_REGEX.test(inputString) || (opts.acceptRelative ? PROTOCOL_RELATIVE_REGEX.test(inputString) : false);
}
function hasTrailingSlash(input = "", respectQueryAndFragment) {
  {
    return input.endsWith("/");
  }
}
function withoutTrailingSlash(input = "", respectQueryAndFragment) {
  {
    return (hasTrailingSlash(input) ? input.slice(0, -1) : input) || "/";
  }
}
function withTrailingSlash(input = "", respectQueryAndFragment) {
  {
    return input.endsWith("/") ? input : input + "/";
  }
}
function hasLeadingSlash(input = "") {
  return input.startsWith("/");
}
function withLeadingSlash(input = "") {
  return hasLeadingSlash(input) ? input : "/" + input;
}
function withBase(input, base) {
  if (isEmptyURL(base) || hasProtocol(input)) {
    return input;
  }
  const _base = withoutTrailingSlash(base);
  if (input.startsWith(_base)) {
    const nextChar = input[_base.length];
    if (!nextChar || nextChar === "/" || nextChar === "?") {
      return input;
    }
  }
  return joinURL(_base, input);
}
function withoutBase(input, base) {
  if (isEmptyURL(base)) {
    return input;
  }
  const _base = withoutTrailingSlash(base);
  if (!input.startsWith(_base)) {
    return input;
  }
  const nextChar = input[_base.length];
  if (nextChar && nextChar !== "/" && nextChar !== "?") {
    return input;
  }
  const trimmed = input.slice(_base.length).replace(/^\/+/, "");
  return "/" + trimmed;
}
function withQuery(input, query) {
  const parsed = parseURL(input);
  const mergedQuery = { ...parseQuery(parsed.search), ...query };
  parsed.search = stringifyQuery(mergedQuery);
  return stringifyParsedURL(parsed);
}
function getQuery$1(input) {
  return parseQuery(parseURL(input).search);
}
function isEmptyURL(url) {
  return !url || url === "/";
}
function isNonEmptyURL(url) {
  return url && url !== "/";
}
function joinURL(base, ...input) {
  let url = base || "";
  for (const segment of input.filter((url2) => isNonEmptyURL(url2))) {
    if (url) {
      const _segment = segment.replace(JOIN_LEADING_SLASH_RE, "");
      url = withTrailingSlash(url) + _segment;
    } else {
      url = segment;
    }
  }
  return url;
}
function joinRelativeURL(..._input) {
  const JOIN_SEGMENT_SPLIT_RE = /\/(?!\/)/;
  const input = _input.filter(Boolean);
  const segments = [];
  let segmentsDepth = 0;
  for (const i of input) {
    if (!i || i === "/") {
      continue;
    }
    for (const [sindex, s] of i.split(JOIN_SEGMENT_SPLIT_RE).entries()) {
      if (!s || s === ".") {
        continue;
      }
      if (s === "..") {
        if (segments.length === 1 && hasProtocol(segments[0])) {
          continue;
        }
        segments.pop();
        segmentsDepth--;
        continue;
      }
      if (sindex === 1 && segments[segments.length - 1]?.endsWith(":/")) {
        segments[segments.length - 1] += "/" + s;
        continue;
      }
      segments.push(s);
      segmentsDepth++;
    }
  }
  let url = segments.join("/");
  if (segmentsDepth >= 0) {
    if (input[0]?.startsWith("/") && !url.startsWith("/")) {
      url = "/" + url;
    } else if (input[0]?.startsWith("./") && !url.startsWith("./")) {
      url = "./" + url;
    }
  } else {
    url = "../".repeat(-1 * segmentsDepth) + url;
  }
  if (input[input.length - 1]?.endsWith("/") && !url.endsWith("/")) {
    url += "/";
  }
  return url;
}
function withHttps(input) {
  return withProtocol(input, "https://");
}
function withProtocol(input, protocol) {
  let match = input.match(PROTOCOL_REGEX);
  if (!match) {
    match = input.match(/^\/{2,}/);
  }
  if (!match) {
    return protocol + input;
  }
  return protocol + input.slice(match[0].length);
}

const protocolRelative = Symbol.for("ufo:protocolRelative");
function parseURL(input = "", defaultProto) {
  const _specialProtoMatch = input.match(
    /^[\s\0]*(blob:|data:|javascript:|vbscript:)(.*)/i
  );
  if (_specialProtoMatch) {
    const [, _proto, _pathname = ""] = _specialProtoMatch;
    return {
      protocol: _proto.toLowerCase(),
      pathname: _pathname,
      href: _proto + _pathname,
      auth: "",
      host: "",
      search: "",
      hash: ""
    };
  }
  if (!hasProtocol(input, { acceptRelative: true })) {
    return defaultProto ? parseURL(defaultProto + input) : parsePath(input);
  }
  const [, protocol = "", auth, hostAndPath = ""] = input.replace(/\\/g, "/").match(/^[\s\0]*([\w+.-]{2,}:)?\/\/([^/@]+@)?(.*)/) || [];
  let [, host = "", path = ""] = hostAndPath.match(/([^#/?]*)(.*)?/) || [];
  if (protocol === "file:") {
    path = path.replace(/\/(?=[A-Za-z]:)/, "");
  }
  const { pathname, search, hash } = parsePath(path);
  return {
    protocol: protocol.toLowerCase(),
    auth: auth ? auth.slice(0, Math.max(0, auth.length - 1)) : "",
    host,
    pathname,
    search,
    hash,
    [protocolRelative]: !protocol
  };
}
function parsePath(input = "") {
  const [pathname = "", search = "", hash = ""] = (input.match(/([^#?]*)(\?[^#]*)?(#.*)?/) || []).splice(1);
  return {
    pathname,
    search,
    hash
  };
}
function stringifyParsedURL(parsed) {
  const pathname = parsed.pathname || "";
  const search = parsed.search ? (parsed.search.startsWith("?") ? "" : "?") + parsed.search : "";
  const hash = parsed.hash || "";
  const auth = parsed.auth ? parsed.auth + "@" : "";
  const host = parsed.host || "";
  const proto = parsed.protocol || parsed[protocolRelative] ? (parsed.protocol || "") + "//" : "";
  return proto + auth + host + pathname + search + hash;
}

const NullObject = /* @__PURE__ */ (() => {
  const C = function() {
  };
  C.prototype = /* @__PURE__ */ Object.create(null);
  return C;
})();
function parse(str, options) {
  if (typeof str !== "string") {
    throw new TypeError("argument str must be a string");
  }
  const obj = new NullObject();
  const opt = {};
  const dec = opt.decode || decode;
  let index = 0;
  while (index < str.length) {
    const eqIdx = str.indexOf("=", index);
    if (eqIdx === -1) {
      break;
    }
    let endIdx = str.indexOf(";", index);
    if (endIdx === -1) {
      endIdx = str.length;
    } else if (endIdx < eqIdx) {
      index = str.lastIndexOf(";", eqIdx - 1) + 1;
      continue;
    }
    const key = str.slice(index, eqIdx).trim();
    if (opt?.filter && !opt?.filter(key)) {
      index = endIdx + 1;
      continue;
    }
    if (void 0 === obj[key]) {
      let val = str.slice(eqIdx + 1, endIdx).trim();
      if (val.codePointAt(0) === 34) {
        val = val.slice(1, -1);
      }
      obj[key] = tryDecode(val, dec);
    }
    index = endIdx + 1;
  }
  return obj;
}
function decode(str) {
  return str.includes("%") ? decodeURIComponent(str) : str;
}
function tryDecode(str, decode2) {
  try {
    return decode2(str);
  } catch {
    return str;
  }
}

const fieldContentRegExp = /^[\u0009\u0020-\u007E\u0080-\u00FF]+$/;
function serialize$1(name, value, options) {
  const opt = options || {};
  const enc = opt.encode || encodeURIComponent;
  if (typeof enc !== "function") {
    throw new TypeError("option encode is invalid");
  }
  if (!fieldContentRegExp.test(name)) {
    throw new TypeError("argument name is invalid");
  }
  const encodedValue = enc(value);
  if (encodedValue && !fieldContentRegExp.test(encodedValue)) {
    throw new TypeError("argument val is invalid");
  }
  let str = name + "=" + encodedValue;
  if (void 0 !== opt.maxAge && opt.maxAge !== null) {
    const maxAge = opt.maxAge - 0;
    if (Number.isNaN(maxAge) || !Number.isFinite(maxAge)) {
      throw new TypeError("option maxAge is invalid");
    }
    str += "; Max-Age=" + Math.floor(maxAge);
  }
  if (opt.domain) {
    if (!fieldContentRegExp.test(opt.domain)) {
      throw new TypeError("option domain is invalid");
    }
    str += "; Domain=" + opt.domain;
  }
  if (opt.path) {
    if (!fieldContentRegExp.test(opt.path)) {
      throw new TypeError("option path is invalid");
    }
    str += "; Path=" + opt.path;
  }
  if (opt.expires) {
    if (!isDate(opt.expires) || Number.isNaN(opt.expires.valueOf())) {
      throw new TypeError("option expires is invalid");
    }
    str += "; Expires=" + opt.expires.toUTCString();
  }
  if (opt.httpOnly) {
    str += "; HttpOnly";
  }
  if (opt.secure) {
    str += "; Secure";
  }
  if (opt.priority) {
    const priority = typeof opt.priority === "string" ? opt.priority.toLowerCase() : opt.priority;
    switch (priority) {
      case "low": {
        str += "; Priority=Low";
        break;
      }
      case "medium": {
        str += "; Priority=Medium";
        break;
      }
      case "high": {
        str += "; Priority=High";
        break;
      }
      default: {
        throw new TypeError("option priority is invalid");
      }
    }
  }
  if (opt.sameSite) {
    const sameSite = typeof opt.sameSite === "string" ? opt.sameSite.toLowerCase() : opt.sameSite;
    switch (sameSite) {
      case true: {
        str += "; SameSite=Strict";
        break;
      }
      case "lax": {
        str += "; SameSite=Lax";
        break;
      }
      case "strict": {
        str += "; SameSite=Strict";
        break;
      }
      case "none": {
        str += "; SameSite=None";
        break;
      }
      default: {
        throw new TypeError("option sameSite is invalid");
      }
    }
  }
  if (opt.partitioned) {
    str += "; Partitioned";
  }
  return str;
}
function isDate(val) {
  return Object.prototype.toString.call(val) === "[object Date]" || val instanceof Date;
}

function parseSetCookie(setCookieValue, options) {
  const parts = (setCookieValue || "").split(";").filter((str) => typeof str === "string" && !!str.trim());
  const nameValuePairStr = parts.shift() || "";
  const parsed = _parseNameValuePair(nameValuePairStr);
  const name = parsed.name;
  let value = parsed.value;
  try {
    value = options?.decode === false ? value : (options?.decode || decodeURIComponent)(value);
  } catch {
  }
  const cookie = {
    name,
    value
  };
  for (const part of parts) {
    const sides = part.split("=");
    const partKey = (sides.shift() || "").trimStart().toLowerCase();
    const partValue = sides.join("=");
    switch (partKey) {
      case "expires": {
        cookie.expires = new Date(partValue);
        break;
      }
      case "max-age": {
        cookie.maxAge = Number.parseInt(partValue, 10);
        break;
      }
      case "secure": {
        cookie.secure = true;
        break;
      }
      case "httponly": {
        cookie.httpOnly = true;
        break;
      }
      case "samesite": {
        cookie.sameSite = partValue;
        break;
      }
      default: {
        cookie[partKey] = partValue;
      }
    }
  }
  return cookie;
}
function _parseNameValuePair(nameValuePairStr) {
  let name = "";
  let value = "";
  const nameValueArr = nameValuePairStr.split("=");
  if (nameValueArr.length > 1) {
    name = nameValueArr.shift();
    value = nameValueArr.join("=");
  } else {
    value = nameValuePairStr;
  }
  return { name, value };
}

const NODE_TYPES = {
  NORMAL: 0,
  WILDCARD: 1,
  PLACEHOLDER: 2
};

function createRouter$1(options = {}) {
  const ctx = {
    options,
    rootNode: createRadixNode(),
    staticRoutesMap: {}
  };
  const normalizeTrailingSlash = (p) => options.strictTrailingSlash ? p : p.replace(/\/$/, "") || "/";
  if (options.routes) {
    for (const path in options.routes) {
      insert(ctx, normalizeTrailingSlash(path), options.routes[path]);
    }
  }
  return {
    ctx,
    lookup: (path) => lookup(ctx, normalizeTrailingSlash(path)),
    insert: (path, data) => insert(ctx, normalizeTrailingSlash(path), data),
    remove: (path) => remove(ctx, normalizeTrailingSlash(path))
  };
}
function lookup(ctx, path) {
  const staticPathNode = ctx.staticRoutesMap[path];
  if (staticPathNode) {
    return staticPathNode.data;
  }
  const sections = path.split("/");
  const params = {};
  let paramsFound = false;
  let wildcardNode = null;
  let node = ctx.rootNode;
  let wildCardParam = null;
  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];
    if (node.wildcardChildNode !== null) {
      wildcardNode = node.wildcardChildNode;
      wildCardParam = sections.slice(i).join("/");
    }
    const nextNode = node.children.get(section);
    if (nextNode === void 0) {
      if (node && node.placeholderChildren.length > 1) {
        const remaining = sections.length - i;
        node = node.placeholderChildren.find((c) => c.maxDepth === remaining) || null;
      } else {
        node = node.placeholderChildren[0] || null;
      }
      if (!node) {
        break;
      }
      if (node.paramName) {
        params[node.paramName] = section;
      }
      paramsFound = true;
    } else {
      node = nextNode;
    }
  }
  if ((node === null || node.data === null) && wildcardNode !== null) {
    node = wildcardNode;
    params[node.paramName || "_"] = wildCardParam;
    paramsFound = true;
  }
  if (!node) {
    return null;
  }
  if (paramsFound) {
    return {
      ...node.data,
      params: paramsFound ? params : void 0
    };
  }
  return node.data;
}
function insert(ctx, path, data) {
  let isStaticRoute = true;
  const sections = path.split("/");
  let node = ctx.rootNode;
  let _unnamedPlaceholderCtr = 0;
  const matchedNodes = [node];
  for (const section of sections) {
    let childNode;
    if (childNode = node.children.get(section)) {
      node = childNode;
    } else {
      const type = getNodeType(section);
      childNode = createRadixNode({ type, parent: node });
      node.children.set(section, childNode);
      if (type === NODE_TYPES.PLACEHOLDER) {
        childNode.paramName = section === "*" ? `_${_unnamedPlaceholderCtr++}` : section.slice(1);
        node.placeholderChildren.push(childNode);
        isStaticRoute = false;
      } else if (type === NODE_TYPES.WILDCARD) {
        node.wildcardChildNode = childNode;
        childNode.paramName = section.slice(
          3
          /* "**:" */
        ) || "_";
        isStaticRoute = false;
      }
      matchedNodes.push(childNode);
      node = childNode;
    }
  }
  for (const [depth, node2] of matchedNodes.entries()) {
    node2.maxDepth = Math.max(matchedNodes.length - depth, node2.maxDepth || 0);
  }
  node.data = data;
  if (isStaticRoute === true) {
    ctx.staticRoutesMap[path] = node;
  }
  return node;
}
function remove(ctx, path) {
  let success = false;
  const sections = path.split("/");
  let node = ctx.rootNode;
  for (const section of sections) {
    node = node.children.get(section);
    if (!node) {
      return success;
    }
  }
  if (node.data) {
    const lastSection = sections.at(-1) || "";
    node.data = null;
    if (Object.keys(node.children).length === 0 && node.parent) {
      node.parent.children.delete(lastSection);
      node.parent.wildcardChildNode = null;
      node.parent.placeholderChildren = [];
    }
    success = true;
  }
  return success;
}
function createRadixNode(options = {}) {
  return {
    type: options.type || NODE_TYPES.NORMAL,
    maxDepth: 0,
    parent: options.parent || null,
    children: /* @__PURE__ */ new Map(),
    data: options.data || null,
    paramName: options.paramName || null,
    wildcardChildNode: null,
    placeholderChildren: []
  };
}
function getNodeType(str) {
  if (str.startsWith("**")) {
    return NODE_TYPES.WILDCARD;
  }
  if (str[0] === ":" || str === "*") {
    return NODE_TYPES.PLACEHOLDER;
  }
  return NODE_TYPES.NORMAL;
}

function toRouteMatcher(router) {
  const table = _routerNodeToTable("", router.ctx.rootNode);
  return _createMatcher(table, router.ctx.options.strictTrailingSlash);
}
function _createMatcher(table, strictTrailingSlash) {
  return {
    ctx: { table },
    matchAll: (path) => _matchRoutes(path, table, strictTrailingSlash)
  };
}
function _createRouteTable() {
  return {
    static: /* @__PURE__ */ new Map(),
    wildcard: /* @__PURE__ */ new Map(),
    dynamic: /* @__PURE__ */ new Map()
  };
}
function _matchRoutes(path, table, strictTrailingSlash) {
  if (strictTrailingSlash !== true && path.endsWith("/")) {
    path = path.slice(0, -1) || "/";
  }
  const matches = [];
  for (const [key, value] of _sortRoutesMap(table.wildcard)) {
    if (path === key || path.startsWith(key + "/")) {
      matches.push(value);
    }
  }
  for (const [key, value] of _sortRoutesMap(table.dynamic)) {
    if (path.startsWith(key + "/")) {
      const subPath = "/" + path.slice(key.length).split("/").splice(2).join("/");
      matches.push(..._matchRoutes(subPath, value));
    }
  }
  const staticMatch = table.static.get(path);
  if (staticMatch) {
    matches.push(staticMatch);
  }
  return matches.filter(Boolean);
}
function _sortRoutesMap(m) {
  return [...m.entries()].sort((a, b) => a[0].length - b[0].length);
}
function _routerNodeToTable(initialPath, initialNode) {
  const table = _createRouteTable();
  function _addNode(path, node) {
    if (path) {
      if (node.type === NODE_TYPES.NORMAL && !(path.includes("*") || path.includes(":"))) {
        if (node.data) {
          table.static.set(path, node.data);
        }
      } else if (node.type === NODE_TYPES.WILDCARD) {
        table.wildcard.set(path.replace("/**", ""), node.data);
      } else if (node.type === NODE_TYPES.PLACEHOLDER) {
        const subTable = _routerNodeToTable("", node);
        if (node.data) {
          subTable.static.set("/", node.data);
        }
        table.dynamic.set(path.replace(/\/\*|\/:\w+/, ""), subTable);
        return;
      }
    }
    for (const [childPath, child] of node.children.entries()) {
      _addNode(`${path}/${childPath}`.replace("//", "/"), child);
    }
  }
  _addNode(initialPath, initialNode);
  return table;
}

function isPlainObject(value) {
  if (value === null || typeof value !== "object") {
    return false;
  }
  const prototype = Object.getPrototypeOf(value);
  if (prototype !== null && prototype !== Object.prototype && Object.getPrototypeOf(prototype) !== null) {
    return false;
  }
  if (Symbol.iterator in value) {
    return false;
  }
  if (Symbol.toStringTag in value) {
    return Object.prototype.toString.call(value) === "[object Module]";
  }
  return true;
}

function _defu(baseObject, defaults, namespace = ".", merger) {
  if (!isPlainObject(defaults)) {
    return _defu(baseObject, {}, namespace, merger);
  }
  const object = { ...defaults };
  for (const key of Object.keys(baseObject)) {
    if (key === "__proto__" || key === "constructor") {
      continue;
    }
    const value = baseObject[key];
    if (value === null || value === void 0) {
      continue;
    }
    if (merger && merger(object, key, value, namespace)) {
      continue;
    }
    if (Array.isArray(value) && Array.isArray(object[key])) {
      object[key] = [...value, ...object[key]];
    } else if (isPlainObject(value) && isPlainObject(object[key])) {
      object[key] = _defu(
        value,
        object[key],
        (namespace ? `${namespace}.` : "") + key.toString(),
        merger
      );
    } else {
      object[key] = value;
    }
  }
  return object;
}
function createDefu(merger) {
  return (...arguments_) => (
    // eslint-disable-next-line unicorn/no-array-reduce
    arguments_.reduce((p, c) => _defu(p, c, "", merger), {})
  );
}
const defu = createDefu();
const defuFn = createDefu((object, key, currentValue) => {
  if (object[key] !== void 0 && typeof currentValue === "function") {
    object[key] = currentValue(object[key]);
    return true;
  }
});

function o$1(n){throw new Error(`${n} is not implemented yet!`)}let i$2 = class i extends EventEmitter{__unenv__={};readableEncoding=null;readableEnded=true;readableFlowing=false;readableHighWaterMark=0;readableLength=0;readableObjectMode=false;readableAborted=false;readableDidRead=false;closed=false;errored=null;readable=false;destroyed=false;static from(e,t){return new i(t)}constructor(e){super();}_read(e){}read(e){}setEncoding(e){return this}pause(){return this}resume(){return this}isPaused(){return  true}unpipe(e){return this}unshift(e,t){}wrap(e){return this}push(e,t){return  false}_destroy(e,t){this.removeAllListeners();}destroy(e){return this.destroyed=true,this._destroy(e),this}pipe(e,t){return {}}compose(e,t){throw new Error("Method not implemented.")}[Symbol.asyncDispose](){return this.destroy(),Promise.resolve()}async*[Symbol.asyncIterator](){throw o$1("Readable.asyncIterator")}iterator(e){throw o$1("Readable.iterator")}map(e,t){throw o$1("Readable.map")}filter(e,t){throw o$1("Readable.filter")}forEach(e,t){throw o$1("Readable.forEach")}reduce(e,t,r){throw o$1("Readable.reduce")}find(e,t){throw o$1("Readable.find")}findIndex(e,t){throw o$1("Readable.findIndex")}some(e,t){throw o$1("Readable.some")}toArray(e){throw o$1("Readable.toArray")}every(e,t){throw o$1("Readable.every")}flatMap(e,t){throw o$1("Readable.flatMap")}drop(e,t){throw o$1("Readable.drop")}take(e,t){throw o$1("Readable.take")}asIndexedPairs(e){throw o$1("Readable.asIndexedPairs")}};let l$2 = class l extends EventEmitter{__unenv__={};writable=true;writableEnded=false;writableFinished=false;writableHighWaterMark=0;writableLength=0;writableObjectMode=false;writableCorked=0;closed=false;errored=null;writableNeedDrain=false;writableAborted=false;destroyed=false;_data;_encoding="utf8";constructor(e){super();}pipe(e,t){return {}}_write(e,t,r){if(this.writableEnded){r&&r();return}if(this._data===void 0)this._data=e;else {const s=typeof this._data=="string"?Buffer$1.from(this._data,this._encoding||t||"utf8"):this._data,a=typeof e=="string"?Buffer$1.from(e,t||this._encoding||"utf8"):e;this._data=Buffer$1.concat([s,a]);}this._encoding=t,r&&r();}_writev(e,t){}_destroy(e,t){}_final(e){}write(e,t,r){const s=typeof t=="string"?this._encoding:"utf8",a=typeof t=="function"?t:typeof r=="function"?r:void 0;return this._write(e,s,a),true}setDefaultEncoding(e){return this}end(e,t,r){const s=typeof e=="function"?e:typeof t=="function"?t:typeof r=="function"?r:void 0;if(this.writableEnded)return s&&s(),this;const a=e===s?void 0:e;if(a){const u=t===s?void 0:t;this.write(a,u,s);}return this.writableEnded=true,this.writableFinished=true,this.emit("close"),this.emit("finish"),this}cork(){}uncork(){}destroy(e){return this.destroyed=true,delete this._data,this.removeAllListeners(),this}compose(e,t){throw new Error("Method not implemented.")}[Symbol.asyncDispose](){return Promise.resolve()}};const c$1=class c{allowHalfOpen=true;_destroy;constructor(e=new i$2,t=new l$2){Object.assign(this,e),Object.assign(this,t),this._destroy=m(e._destroy,t._destroy);}};function _$1(){return Object.assign(c$1.prototype,i$2.prototype),Object.assign(c$1.prototype,l$2.prototype),c$1}function m(...n){return function(...e){for(const t of n)t(...e);}}const g=_$1();let A$1 = class A extends g{__unenv__={};bufferSize=0;bytesRead=0;bytesWritten=0;connecting=false;destroyed=false;pending=false;localAddress="";localPort=0;remoteAddress="";remoteFamily="";remotePort=0;autoSelectFamilyAttemptedAddresses=[];readyState="readOnly";constructor(e){super();}write(e,t,r){return  false}connect(e,t,r){return this}end(e,t,r){return this}setEncoding(e){return this}pause(){return this}resume(){return this}setTimeout(e,t){return this}setNoDelay(e){return this}setKeepAlive(e,t){return this}address(){return {}}unref(){return this}ref(){return this}destroySoon(){this.destroy();}resetAndDestroy(){const e=new Error("ERR_SOCKET_CLOSED");return e.code="ERR_SOCKET_CLOSED",this.destroy(e),this}};class y extends i$2{aborted=false;httpVersion="1.1";httpVersionMajor=1;httpVersionMinor=1;complete=true;connection;socket;headers={};trailers={};method="GET";url="/";statusCode=200;statusMessage="";closed=false;errored=null;readable=false;constructor(e){super(),this.socket=this.connection=e||new A$1;}get rawHeaders(){const e=this.headers,t=[];for(const r in e)if(Array.isArray(e[r]))for(const s of e[r])t.push(r,s);else t.push(r,e[r]);return t}get rawTrailers(){return []}setTimeout(e,t){return this}get headersDistinct(){return p(this.headers)}get trailersDistinct(){return p(this.trailers)}}function p(n){const e={};for(const[t,r]of Object.entries(n))t&&(e[t]=(Array.isArray(r)?r:[r]).filter(Boolean));return e}class w extends l$2{statusCode=200;statusMessage="";upgrading=false;chunkedEncoding=false;shouldKeepAlive=false;useChunkedEncodingByDefault=false;sendDate=false;finished=false;headersSent=false;strictContentLength=false;connection=null;socket=null;req;_headers={};constructor(e){super(),this.req=e;}assignSocket(e){e._httpMessage=this,this.socket=e,this.connection=e,this.emit("socket",e),this._flush();}_flush(){this.flushHeaders();}detachSocket(e){}writeContinue(e){}writeHead(e,t,r){e&&(this.statusCode=e),typeof t=="string"&&(this.statusMessage=t,t=void 0);const s=r||t;if(s&&!Array.isArray(s))for(const a in s)this.setHeader(a,s[a]);return this.headersSent=true,this}writeProcessing(){}setTimeout(e,t){return this}appendHeader(e,t){e=e.toLowerCase();const r=this._headers[e],s=[...Array.isArray(r)?r:[r],...Array.isArray(t)?t:[t]].filter(Boolean);return this._headers[e]=s.length>1?s:s[0],this}setHeader(e,t){return this._headers[e.toLowerCase()]=t,this}setHeaders(e){for(const[t,r]of Object.entries(e))this.setHeader(t,r);return this}getHeader(e){return this._headers[e.toLowerCase()]}getHeaders(){return this._headers}getHeaderNames(){return Object.keys(this._headers)}hasHeader(e){return e.toLowerCase()in this._headers}removeHeader(e){delete this._headers[e.toLowerCase()];}addTrailers(e){}flushHeaders(){}writeEarlyHints(e,t){typeof t=="function"&&t();}}const E=(()=>{const n=function(){};return n.prototype=Object.create(null),n})();function R$1(n={}){const e=new E,t=Array.isArray(n)||H(n)?n:Object.entries(n);for(const[r,s]of t)if(s){if(e[r]===void 0){e[r]=s;continue}e[r]=[...Array.isArray(e[r])?e[r]:[e[r]],...Array.isArray(s)?s:[s]];}return e}function H(n){return typeof n?.entries=="function"}function v(n={}){if(n instanceof Headers)return n;const e=new Headers;for(const[t,r]of Object.entries(n))if(r!==void 0){if(Array.isArray(r)){for(const s of r)e.append(t,String(s));continue}e.set(t,String(r));}return e}const S$1=new Set([101,204,205,304]);async function b$1(n,e){const t=new y,r=new w(t);t.url=e.url?.toString()||"/";let s;if(!t.url.startsWith("/")){const d=new URL(t.url);s=d.host,t.url=d.pathname+d.search+d.hash;}t.method=e.method||"GET",t.headers=R$1(e.headers||{}),t.headers.host||(t.headers.host=e.host||s||"localhost"),t.connection.encrypted=t.connection.encrypted||e.protocol==="https",t.body=e.body||null,t.__unenv__=e.context,await n(t,r);let a=r._data;(S$1.has(r.statusCode)||t.method.toUpperCase()==="HEAD")&&(a=null,delete r._headers["content-length"]);const u={status:r.statusCode,statusText:r.statusMessage,headers:r._headers,body:a};return t.destroy(),r.destroy(),u}async function C$1(n,e,t={}){try{const r=await b$1(n,{url:e,...t});return new Response(r.body,{status:r.status,statusText:r.statusText,headers:v(r.headers)})}catch(r){return new Response(r.toString(),{status:Number.parseInt(r.statusCode||r.code)||500,statusText:r.statusText})}}

function hasProp(obj, prop) {
  try {
    return prop in obj;
  } catch {
    return false;
  }
}

class H3Error extends Error {
  static __h3_error__ = true;
  statusCode = 500;
  fatal = false;
  unhandled = false;
  statusMessage;
  data;
  cause;
  constructor(message, opts = {}) {
    super(message, opts);
    if (opts.cause && !this.cause) {
      this.cause = opts.cause;
    }
  }
  toJSON() {
    const obj = {
      message: this.message,
      statusCode: sanitizeStatusCode(this.statusCode, 500)
    };
    if (this.statusMessage) {
      obj.statusMessage = sanitizeStatusMessage(this.statusMessage);
    }
    if (this.data !== void 0) {
      obj.data = this.data;
    }
    return obj;
  }
}
function createError$1(input) {
  if (typeof input === "string") {
    return new H3Error(input);
  }
  if (isError(input)) {
    return input;
  }
  const err = new H3Error(input.message ?? input.statusMessage ?? "", {
    cause: input.cause || input
  });
  if (hasProp(input, "stack")) {
    try {
      Object.defineProperty(err, "stack", {
        get() {
          return input.stack;
        }
      });
    } catch {
      try {
        err.stack = input.stack;
      } catch {
      }
    }
  }
  if (input.data) {
    err.data = input.data;
  }
  if (input.statusCode) {
    err.statusCode = sanitizeStatusCode(input.statusCode, err.statusCode);
  } else if (input.status) {
    err.statusCode = sanitizeStatusCode(input.status, err.statusCode);
  }
  if (input.statusMessage) {
    err.statusMessage = input.statusMessage;
  } else if (input.statusText) {
    err.statusMessage = input.statusText;
  }
  if (err.statusMessage) {
    const originalMessage = err.statusMessage;
    const sanitizedMessage = sanitizeStatusMessage(err.statusMessage);
    if (sanitizedMessage !== originalMessage) {
      console.warn(
        "[h3] Please prefer using `message` for longer error messages instead of `statusMessage`. In the future, `statusMessage` will be sanitized by default."
      );
    }
  }
  if (input.fatal !== void 0) {
    err.fatal = input.fatal;
  }
  if (input.unhandled !== void 0) {
    err.unhandled = input.unhandled;
  }
  return err;
}
function sendError(event, error, debug) {
  if (event.handled) {
    return;
  }
  const h3Error = isError(error) ? error : createError$1(error);
  const responseBody = {
    statusCode: h3Error.statusCode,
    statusMessage: h3Error.statusMessage,
    stack: [],
    data: h3Error.data
  };
  if (debug) {
    responseBody.stack = (h3Error.stack || "").split("\n").map((l) => l.trim());
  }
  if (event.handled) {
    return;
  }
  const _code = Number.parseInt(h3Error.statusCode);
  setResponseStatus(event, _code, h3Error.statusMessage);
  event.node.res.setHeader("content-type", MIMES.json);
  event.node.res.end(JSON.stringify(responseBody, void 0, 2));
}
function isError(input) {
  return input?.constructor?.__h3_error__ === true;
}

function getQuery(event) {
  return getQuery$1(event.path || "");
}
function getRouterParams(event, opts = {}) {
  let params = event.context.params || {};
  if (opts.decode) {
    params = { ...params };
    for (const key in params) {
      params[key] = decode$1(params[key]);
    }
  }
  return params;
}
function getRouterParam(event, name, opts = {}) {
  const params = getRouterParams(event, opts);
  return params[name];
}
function isMethod(event, expected, allowHead) {
  if (typeof expected === "string") {
    if (event.method === expected) {
      return true;
    }
  } else if (expected.includes(event.method)) {
    return true;
  }
  return false;
}
function assertMethod(event, expected, allowHead) {
  if (!isMethod(event, expected)) {
    throw createError$1({
      statusCode: 405,
      statusMessage: "HTTP method is not allowed."
    });
  }
}
function getRequestHeaders(event) {
  const _headers = {};
  for (const key in event.node.req.headers) {
    const val = event.node.req.headers[key];
    _headers[key] = Array.isArray(val) ? val.filter(Boolean).join(", ") : val;
  }
  return _headers;
}
function getRequestHeader(event, name) {
  const headers = getRequestHeaders(event);
  const value = headers[name.toLowerCase()];
  return value;
}
const getHeader = getRequestHeader;
function getRequestHost(event, opts = {}) {
  if (opts.xForwardedHost) {
    const _header = event.node.req.headers["x-forwarded-host"];
    const xForwardedHost = (_header || "").split(",").shift()?.trim();
    if (xForwardedHost) {
      return xForwardedHost;
    }
  }
  return event.node.req.headers.host || "localhost";
}
function getRequestProtocol(event, opts = {}) {
  if (opts.xForwardedProto !== false && event.node.req.headers["x-forwarded-proto"] === "https") {
    return "https";
  }
  return event.node.req.connection?.encrypted ? "https" : "http";
}
function getRequestURL(event, opts = {}) {
  const host = getRequestHost(event, opts);
  const protocol = getRequestProtocol(event, opts);
  const path = (event.node.req.originalUrl || event.path).replace(
    /^[/\\]+/g,
    "/"
  );
  return new URL(path, `${protocol}://${host}`);
}

const RawBodySymbol = Symbol.for("h3RawBody");
const ParsedBodySymbol = Symbol.for("h3ParsedBody");
const PayloadMethods$1 = ["PATCH", "POST", "PUT", "DELETE"];
function readRawBody(event, encoding = "utf8") {
  assertMethod(event, PayloadMethods$1);
  const _rawBody = event._requestBody || event.web?.request?.body || event.node.req[RawBodySymbol] || event.node.req.rawBody || event.node.req.body;
  if (_rawBody) {
    const promise2 = Promise.resolve(_rawBody).then((_resolved) => {
      if (Buffer.isBuffer(_resolved)) {
        return _resolved;
      }
      if (typeof _resolved.pipeTo === "function") {
        return new Promise((resolve, reject) => {
          const chunks = [];
          _resolved.pipeTo(
            new WritableStream({
              write(chunk) {
                chunks.push(chunk);
              },
              close() {
                resolve(Buffer.concat(chunks));
              },
              abort(reason) {
                reject(reason);
              }
            })
          ).catch(reject);
        });
      } else if (typeof _resolved.pipe === "function") {
        return new Promise((resolve, reject) => {
          const chunks = [];
          _resolved.on("data", (chunk) => {
            chunks.push(chunk);
          }).on("end", () => {
            resolve(Buffer.concat(chunks));
          }).on("error", reject);
        });
      }
      if (_resolved.constructor === Object) {
        return Buffer.from(JSON.stringify(_resolved));
      }
      if (_resolved instanceof URLSearchParams) {
        return Buffer.from(_resolved.toString());
      }
      if (_resolved instanceof FormData) {
        return new Response(_resolved).bytes().then((uint8arr) => Buffer.from(uint8arr));
      }
      return Buffer.from(_resolved);
    });
    return encoding ? promise2.then((buff) => buff.toString(encoding)) : promise2;
  }
  if (!Number.parseInt(event.node.req.headers["content-length"] || "") && !/\bchunked\b/i.test(
    String(event.node.req.headers["transfer-encoding"] ?? "")
  )) {
    return Promise.resolve(void 0);
  }
  const promise = event.node.req[RawBodySymbol] = new Promise(
    (resolve, reject) => {
      const bodyData = [];
      event.node.req.on("error", (err) => {
        reject(err);
      }).on("data", (chunk) => {
        bodyData.push(chunk);
      }).on("end", () => {
        resolve(Buffer.concat(bodyData));
      });
    }
  );
  const result = encoding ? promise.then((buff) => buff.toString(encoding)) : promise;
  return result;
}
async function readBody(event, options = {}) {
  const request = event.node.req;
  if (hasProp(request, ParsedBodySymbol)) {
    return request[ParsedBodySymbol];
  }
  const contentType = request.headers["content-type"] || "";
  const body = await readRawBody(event);
  let parsed;
  if (contentType === "application/json") {
    parsed = _parseJSON(body, options.strict ?? true);
  } else if (contentType.startsWith("application/x-www-form-urlencoded")) {
    parsed = _parseURLEncodedBody(body);
  } else if (contentType.startsWith("text/")) {
    parsed = body;
  } else {
    parsed = _parseJSON(body, options.strict ?? false);
  }
  request[ParsedBodySymbol] = parsed;
  return parsed;
}
function getRequestWebStream(event) {
  if (!PayloadMethods$1.includes(event.method)) {
    return;
  }
  const bodyStream = event.web?.request?.body || event._requestBody;
  if (bodyStream) {
    return bodyStream;
  }
  const _hasRawBody = RawBodySymbol in event.node.req || "rawBody" in event.node.req || "body" in event.node.req || "__unenv__" in event.node.req;
  if (_hasRawBody) {
    return new ReadableStream({
      async start(controller) {
        const _rawBody = await readRawBody(event, false);
        if (_rawBody) {
          controller.enqueue(_rawBody);
        }
        controller.close();
      }
    });
  }
  return new ReadableStream({
    start: (controller) => {
      event.node.req.on("data", (chunk) => {
        controller.enqueue(chunk);
      });
      event.node.req.on("end", () => {
        controller.close();
      });
      event.node.req.on("error", (err) => {
        controller.error(err);
      });
    }
  });
}
function _parseJSON(body = "", strict) {
  if (!body) {
    return void 0;
  }
  try {
    return destr(body, { strict });
  } catch {
    throw createError$1({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: "Invalid JSON body"
    });
  }
}
function _parseURLEncodedBody(body) {
  const form = new URLSearchParams(body);
  const parsedForm = /* @__PURE__ */ Object.create(null);
  for (const [key, value] of form.entries()) {
    if (hasProp(parsedForm, key)) {
      if (!Array.isArray(parsedForm[key])) {
        parsedForm[key] = [parsedForm[key]];
      }
      parsedForm[key].push(value);
    } else {
      parsedForm[key] = value;
    }
  }
  return parsedForm;
}

function handleCacheHeaders(event, opts) {
  const cacheControls = ["public", ...opts.cacheControls || []];
  let cacheMatched = false;
  if (opts.maxAge !== void 0) {
    cacheControls.push(`max-age=${+opts.maxAge}`, `s-maxage=${+opts.maxAge}`);
  }
  if (opts.modifiedTime) {
    const modifiedTime = new Date(opts.modifiedTime);
    const ifModifiedSince = event.node.req.headers["if-modified-since"];
    event.node.res.setHeader("last-modified", modifiedTime.toUTCString());
    if (ifModifiedSince && new Date(ifModifiedSince) >= modifiedTime) {
      cacheMatched = true;
    }
  }
  if (opts.etag) {
    event.node.res.setHeader("etag", opts.etag);
    const ifNonMatch = event.node.req.headers["if-none-match"];
    if (ifNonMatch === opts.etag) {
      cacheMatched = true;
    }
  }
  event.node.res.setHeader("cache-control", cacheControls.join(", "));
  if (cacheMatched) {
    event.node.res.statusCode = 304;
    if (!event.handled) {
      event.node.res.end();
    }
    return true;
  }
  return false;
}

const MIMES = {
  html: "text/html",
  json: "application/json"
};

const DISALLOWED_STATUS_CHARS = /[^\u0009\u0020-\u007E]/g;
function sanitizeStatusMessage(statusMessage = "") {
  return statusMessage.replace(DISALLOWED_STATUS_CHARS, "");
}
function sanitizeStatusCode(statusCode, defaultStatusCode = 200) {
  if (!statusCode) {
    return defaultStatusCode;
  }
  if (typeof statusCode === "string") {
    statusCode = Number.parseInt(statusCode, 10);
  }
  if (statusCode < 100 || statusCode > 999) {
    return defaultStatusCode;
  }
  return statusCode;
}

function getDistinctCookieKey(name, opts) {
  return [name, opts.domain || "", opts.path || "/"].join(";");
}

function parseCookies(event) {
  return parse(event.node.req.headers.cookie || "");
}
function getCookie(event, name) {
  return parseCookies(event)[name];
}
function setCookie(event, name, value, serializeOptions = {}) {
  if (!serializeOptions.path) {
    serializeOptions = { path: "/", ...serializeOptions };
  }
  const newCookie = serialize$1(name, value, serializeOptions);
  const currentCookies = splitCookiesString(
    event.node.res.getHeader("set-cookie")
  );
  if (currentCookies.length === 0) {
    event.node.res.setHeader("set-cookie", newCookie);
    return;
  }
  const newCookieKey = getDistinctCookieKey(name, serializeOptions);
  event.node.res.removeHeader("set-cookie");
  for (const cookie of currentCookies) {
    const parsed = parseSetCookie(cookie);
    const key = getDistinctCookieKey(parsed.name, parsed);
    if (key === newCookieKey) {
      continue;
    }
    event.node.res.appendHeader("set-cookie", cookie);
  }
  event.node.res.appendHeader("set-cookie", newCookie);
}
function deleteCookie(event, name, serializeOptions) {
  setCookie(event, name, "", {
    ...serializeOptions,
    maxAge: 0
  });
}
function splitCookiesString(cookiesString) {
  if (Array.isArray(cookiesString)) {
    return cookiesString.flatMap((c) => splitCookiesString(c));
  }
  if (typeof cookiesString !== "string") {
    return [];
  }
  const cookiesStrings = [];
  let pos = 0;
  let start;
  let ch;
  let lastComma;
  let nextStart;
  let cookiesSeparatorFound;
  const skipWhitespace = () => {
    while (pos < cookiesString.length && /\s/.test(cookiesString.charAt(pos))) {
      pos += 1;
    }
    return pos < cookiesString.length;
  };
  const notSpecialChar = () => {
    ch = cookiesString.charAt(pos);
    return ch !== "=" && ch !== ";" && ch !== ",";
  };
  while (pos < cookiesString.length) {
    start = pos;
    cookiesSeparatorFound = false;
    while (skipWhitespace()) {
      ch = cookiesString.charAt(pos);
      if (ch === ",") {
        lastComma = pos;
        pos += 1;
        skipWhitespace();
        nextStart = pos;
        while (pos < cookiesString.length && notSpecialChar()) {
          pos += 1;
        }
        if (pos < cookiesString.length && cookiesString.charAt(pos) === "=") {
          cookiesSeparatorFound = true;
          pos = nextStart;
          cookiesStrings.push(cookiesString.slice(start, lastComma));
          start = pos;
        } else {
          pos = lastComma + 1;
        }
      } else {
        pos += 1;
      }
    }
    if (!cookiesSeparatorFound || pos >= cookiesString.length) {
      cookiesStrings.push(cookiesString.slice(start));
    }
  }
  return cookiesStrings;
}

const defer = typeof setImmediate === "undefined" ? (fn) => fn() : setImmediate;
function send(event, data, type) {
  if (type) {
    defaultContentType(event, type);
  }
  return new Promise((resolve) => {
    defer(() => {
      if (!event.handled) {
        event.node.res.end(data);
      }
      resolve();
    });
  });
}
function sendNoContent(event, code) {
  if (event.handled) {
    return;
  }
  if (!code && event.node.res.statusCode !== 200) {
    code = event.node.res.statusCode;
  }
  const _code = sanitizeStatusCode(code, 204);
  if (_code === 204) {
    event.node.res.removeHeader("content-length");
  }
  event.node.res.writeHead(_code);
  event.node.res.end();
}
function setResponseStatus(event, code, text) {
  if (code) {
    event.node.res.statusCode = sanitizeStatusCode(
      code,
      event.node.res.statusCode
    );
  }
  if (text) {
    event.node.res.statusMessage = sanitizeStatusMessage(text);
  }
}
function getResponseStatus(event) {
  return event.node.res.statusCode;
}
function getResponseStatusText(event) {
  return event.node.res.statusMessage;
}
function defaultContentType(event, type) {
  if (type && event.node.res.statusCode !== 304 && !event.node.res.getHeader("content-type")) {
    event.node.res.setHeader("content-type", type);
  }
}
function sendRedirect(event, location, code = 302) {
  event.node.res.statusCode = sanitizeStatusCode(
    code,
    event.node.res.statusCode
  );
  event.node.res.setHeader("location", location);
  const encodedLoc = location.replace(/"/g, "%22");
  const html = `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=${encodedLoc}"></head></html>`;
  return send(event, html, MIMES.html);
}
function getResponseHeader(event, name) {
  return event.node.res.getHeader(name);
}
function setResponseHeaders(event, headers) {
  for (const [name, value] of Object.entries(headers)) {
    event.node.res.setHeader(
      name,
      value
    );
  }
}
const setHeaders = setResponseHeaders;
function setResponseHeader(event, name, value) {
  event.node.res.setHeader(name, value);
}
const setHeader = setResponseHeader;
function appendResponseHeader(event, name, value) {
  let current = event.node.res.getHeader(name);
  if (!current) {
    event.node.res.setHeader(name, value);
    return;
  }
  if (!Array.isArray(current)) {
    current = [current.toString()];
  }
  event.node.res.setHeader(name, [...current, value]);
}
function removeResponseHeader(event, name) {
  return event.node.res.removeHeader(name);
}
function isStream(data) {
  if (!data || typeof data !== "object") {
    return false;
  }
  if (typeof data.pipe === "function") {
    if (typeof data._read === "function") {
      return true;
    }
    if (typeof data.abort === "function") {
      return true;
    }
  }
  if (typeof data.pipeTo === "function") {
    return true;
  }
  return false;
}
function isWebResponse(data) {
  return typeof Response !== "undefined" && data instanceof Response;
}
function sendStream(event, stream) {
  if (!stream || typeof stream !== "object") {
    throw new Error("[h3] Invalid stream provided.");
  }
  event.node.res._data = stream;
  if (!event.node.res.socket) {
    event._handled = true;
    return Promise.resolve();
  }
  if (hasProp(stream, "pipeTo") && typeof stream.pipeTo === "function") {
    return stream.pipeTo(
      new WritableStream({
        write(chunk) {
          event.node.res.write(chunk);
        }
      })
    ).then(() => {
      event.node.res.end();
    });
  }
  if (hasProp(stream, "pipe") && typeof stream.pipe === "function") {
    return new Promise((resolve, reject) => {
      stream.pipe(event.node.res);
      if (stream.on) {
        stream.on("end", () => {
          event.node.res.end();
          resolve();
        });
        stream.on("error", (error) => {
          reject(error);
        });
      }
      event.node.res.on("close", () => {
        if (stream.abort) {
          stream.abort();
        }
      });
    });
  }
  throw new Error("[h3] Invalid or incompatible stream provided.");
}
function sendWebResponse(event, response) {
  for (const [key, value] of response.headers) {
    if (key === "set-cookie") {
      event.node.res.appendHeader(key, splitCookiesString(value));
    } else {
      event.node.res.setHeader(key, value);
    }
  }
  if (response.status) {
    event.node.res.statusCode = sanitizeStatusCode(
      response.status,
      event.node.res.statusCode
    );
  }
  if (response.statusText) {
    event.node.res.statusMessage = sanitizeStatusMessage(response.statusText);
  }
  if (response.redirected) {
    event.node.res.setHeader("location", response.url);
  }
  if (!response.body) {
    event.node.res.end();
    return;
  }
  return sendStream(event, response.body);
}

const PayloadMethods = /* @__PURE__ */ new Set(["PATCH", "POST", "PUT", "DELETE"]);
const ignoredHeaders = /* @__PURE__ */ new Set([
  "transfer-encoding",
  "accept-encoding",
  "connection",
  "keep-alive",
  "upgrade",
  "expect",
  "host",
  "accept"
]);
async function proxyRequest(event, target, opts = {}) {
  let body;
  let duplex;
  if (PayloadMethods.has(event.method)) {
    if (opts.streamRequest) {
      body = getRequestWebStream(event);
      duplex = "half";
    } else {
      body = await readRawBody(event, false).catch(() => void 0);
    }
  }
  const method = opts.fetchOptions?.method || event.method;
  const fetchHeaders = mergeHeaders$1(
    getProxyRequestHeaders(event, { host: target.startsWith("/") }),
    opts.fetchOptions?.headers,
    opts.headers
  );
  return sendProxy(event, target, {
    ...opts,
    fetchOptions: {
      method,
      body,
      duplex,
      ...opts.fetchOptions,
      headers: fetchHeaders
    }
  });
}
async function sendProxy(event, target, opts = {}) {
  let response;
  try {
    response = await _getFetch(opts.fetch)(target, {
      headers: opts.headers,
      ignoreResponseError: true,
      // make $ofetch.raw transparent
      ...opts.fetchOptions
    });
  } catch (error) {
    throw createError$1({
      status: 502,
      statusMessage: "Bad Gateway",
      cause: error
    });
  }
  event.node.res.statusCode = sanitizeStatusCode(
    response.status,
    event.node.res.statusCode
  );
  event.node.res.statusMessage = sanitizeStatusMessage(response.statusText);
  const cookies = [];
  for (const [key, value] of response.headers.entries()) {
    if (key === "content-encoding") {
      continue;
    }
    if (key === "content-length") {
      continue;
    }
    if (key === "set-cookie") {
      cookies.push(...splitCookiesString(value));
      continue;
    }
    event.node.res.setHeader(key, value);
  }
  if (cookies.length > 0) {
    event.node.res.setHeader(
      "set-cookie",
      cookies.map((cookie) => {
        if (opts.cookieDomainRewrite) {
          cookie = rewriteCookieProperty(
            cookie,
            opts.cookieDomainRewrite,
            "domain"
          );
        }
        if (opts.cookiePathRewrite) {
          cookie = rewriteCookieProperty(
            cookie,
            opts.cookiePathRewrite,
            "path"
          );
        }
        return cookie;
      })
    );
  }
  if (opts.onResponse) {
    await opts.onResponse(event, response);
  }
  if (response._data !== void 0) {
    return response._data;
  }
  if (event.handled) {
    return;
  }
  if (opts.sendStream === false) {
    const data = new Uint8Array(await response.arrayBuffer());
    return event.node.res.end(data);
  }
  if (response.body) {
    for await (const chunk of response.body) {
      event.node.res.write(chunk);
    }
  }
  return event.node.res.end();
}
function getProxyRequestHeaders(event, opts) {
  const headers = /* @__PURE__ */ Object.create(null);
  const reqHeaders = getRequestHeaders(event);
  for (const name in reqHeaders) {
    if (!ignoredHeaders.has(name) || name === "host" && opts?.host) {
      headers[name] = reqHeaders[name];
    }
  }
  return headers;
}
function fetchWithEvent(event, req, init, options) {
  return _getFetch(options?.fetch)(req, {
    ...init,
    context: init?.context || event.context,
    headers: {
      ...getProxyRequestHeaders(event, {
        host: typeof req === "string" && req.startsWith("/")
      }),
      ...init?.headers
    }
  });
}
function _getFetch(_fetch) {
  if (_fetch) {
    return _fetch;
  }
  if (globalThis.fetch) {
    return globalThis.fetch;
  }
  throw new Error(
    "fetch is not available. Try importing `node-fetch-native/polyfill` for Node.js."
  );
}
function rewriteCookieProperty(header, map, property) {
  const _map = typeof map === "string" ? { "*": map } : map;
  return header.replace(
    new RegExp(`(;\\s*${property}=)([^;]+)`, "gi"),
    (match, prefix, previousValue) => {
      let newValue;
      if (previousValue in _map) {
        newValue = _map[previousValue];
      } else if ("*" in _map) {
        newValue = _map["*"];
      } else {
        return match;
      }
      return newValue ? prefix + newValue : "";
    }
  );
}
function mergeHeaders$1(defaults, ...inputs) {
  const _inputs = inputs.filter(Boolean);
  if (_inputs.length === 0) {
    return defaults;
  }
  const merged = new Headers(defaults);
  for (const input of _inputs) {
    const entries = Array.isArray(input) ? input : typeof input.entries === "function" ? input.entries() : Object.entries(input);
    for (const [key, value] of entries) {
      if (value !== void 0) {
        merged.set(key, value);
      }
    }
  }
  return merged;
}

class H3Event {
  "__is_event__" = true;
  // Context
  node;
  // Node
  web;
  // Web
  context = {};
  // Shared
  // Request
  _method;
  _path;
  _headers;
  _requestBody;
  // Response
  _handled = false;
  // Hooks
  _onBeforeResponseCalled;
  _onAfterResponseCalled;
  constructor(req, res) {
    this.node = { req, res };
  }
  // --- Request ---
  get method() {
    if (!this._method) {
      this._method = (this.node.req.method || "GET").toUpperCase();
    }
    return this._method;
  }
  get path() {
    return this._path || this.node.req.url || "/";
  }
  get headers() {
    if (!this._headers) {
      this._headers = _normalizeNodeHeaders(this.node.req.headers);
    }
    return this._headers;
  }
  // --- Respoonse ---
  get handled() {
    return this._handled || this.node.res.writableEnded || this.node.res.headersSent;
  }
  respondWith(response) {
    return Promise.resolve(response).then(
      (_response) => sendWebResponse(this, _response)
    );
  }
  // --- Utils ---
  toString() {
    return `[${this.method}] ${this.path}`;
  }
  toJSON() {
    return this.toString();
  }
  // --- Deprecated ---
  /** @deprecated Please use `event.node.req` instead. */
  get req() {
    return this.node.req;
  }
  /** @deprecated Please use `event.node.res` instead. */
  get res() {
    return this.node.res;
  }
}
function isEvent(input) {
  return hasProp(input, "__is_event__");
}
function createEvent(req, res) {
  return new H3Event(req, res);
}
function _normalizeNodeHeaders(nodeHeaders) {
  const headers = new Headers();
  for (const [name, value] of Object.entries(nodeHeaders)) {
    if (Array.isArray(value)) {
      for (const item of value) {
        headers.append(name, item);
      }
    } else if (value) {
      headers.set(name, value);
    }
  }
  return headers;
}

function defineEventHandler(handler) {
  if (typeof handler === "function") {
    handler.__is_handler__ = true;
    return handler;
  }
  const _hooks = {
    onRequest: _normalizeArray(handler.onRequest),
    onBeforeResponse: _normalizeArray(handler.onBeforeResponse)
  };
  const _handler = (event) => {
    return _callHandler(event, handler.handler, _hooks);
  };
  _handler.__is_handler__ = true;
  _handler.__resolve__ = handler.handler.__resolve__;
  _handler.__websocket__ = handler.websocket;
  return _handler;
}
function _normalizeArray(input) {
  return input ? Array.isArray(input) ? input : [input] : void 0;
}
async function _callHandler(event, handler, hooks) {
  if (hooks.onRequest) {
    for (const hook of hooks.onRequest) {
      await hook(event);
      if (event.handled) {
        return;
      }
    }
  }
  const body = await handler(event);
  const response = { body };
  if (hooks.onBeforeResponse) {
    for (const hook of hooks.onBeforeResponse) {
      await hook(event, response);
    }
  }
  return response.body;
}
const eventHandler = defineEventHandler;
function isEventHandler(input) {
  return hasProp(input, "__is_handler__");
}
function toEventHandler(input, _, _route) {
  return input;
}
function defineLazyEventHandler(factory) {
  let _promise;
  let _resolved;
  const resolveHandler = () => {
    if (_resolved) {
      return Promise.resolve(_resolved);
    }
    if (!_promise) {
      _promise = Promise.resolve(factory()).then((r) => {
        const handler2 = r.default || r;
        if (typeof handler2 !== "function") {
          throw new TypeError(
            "Invalid lazy handler result. It should be a function:",
            handler2
          );
        }
        _resolved = { handler: toEventHandler(r.default || r) };
        return _resolved;
      });
    }
    return _promise;
  };
  const handler = eventHandler((event) => {
    if (_resolved) {
      return _resolved.handler(event);
    }
    return resolveHandler().then((r) => r.handler(event));
  });
  handler.__resolve__ = resolveHandler;
  return handler;
}
const lazyEventHandler = defineLazyEventHandler;

function createApp(options = {}) {
  const stack = [];
  const handler = createAppEventHandler(stack, options);
  const resolve = createResolver(stack);
  handler.__resolve__ = resolve;
  const getWebsocket = cachedFn(() => websocketOptions(resolve, options));
  const app = {
    // @ts-expect-error
    use: (arg1, arg2, arg3) => use(app, arg1, arg2, arg3),
    resolve,
    handler,
    stack,
    options,
    get websocket() {
      return getWebsocket();
    }
  };
  return app;
}
function use(app, arg1, arg2, arg3) {
  if (Array.isArray(arg1)) {
    for (const i of arg1) {
      use(app, i, arg2, arg3);
    }
  } else if (Array.isArray(arg2)) {
    for (const i of arg2) {
      use(app, arg1, i, arg3);
    }
  } else if (typeof arg1 === "string") {
    app.stack.push(
      normalizeLayer({ ...arg3, route: arg1, handler: arg2 })
    );
  } else if (typeof arg1 === "function") {
    app.stack.push(normalizeLayer({ ...arg2, handler: arg1 }));
  } else {
    app.stack.push(normalizeLayer({ ...arg1 }));
  }
  return app;
}
function createAppEventHandler(stack, options) {
  const spacing = options.debug ? 2 : void 0;
  return eventHandler(async (event) => {
    event.node.req.originalUrl = event.node.req.originalUrl || event.node.req.url || "/";
    const _rawReqUrl = event.node.req.url || "/";
    const _reqPath = _decodePath(event._path || _rawReqUrl);
    event._path = _reqPath;
    const _needsRawUrl = _reqPath !== _rawReqUrl;
    let _layerPath;
    if (options.onRequest) {
      await options.onRequest(event);
    }
    for (const layer of stack) {
      if (layer.route.length > 1) {
        if (!_reqPath.startsWith(layer.route)) {
          continue;
        }
        _layerPath = _reqPath.slice(layer.route.length) || "/";
      } else {
        _layerPath = _reqPath;
      }
      if (layer.match && !layer.match(_layerPath, event)) {
        continue;
      }
      event._path = _layerPath;
      event.node.req.url = _needsRawUrl ? layer.route.length > 1 ? _rawReqUrl.slice(layer.route.length) || "/" : _rawReqUrl : _layerPath;
      const val = await layer.handler(event);
      const _body = val === void 0 ? void 0 : await val;
      if (_body !== void 0) {
        const _response = { body: _body };
        if (options.onBeforeResponse) {
          event._onBeforeResponseCalled = true;
          await options.onBeforeResponse(event, _response);
        }
        await handleHandlerResponse(event, _response.body, spacing);
        if (options.onAfterResponse) {
          event._onAfterResponseCalled = true;
          await options.onAfterResponse(event, _response);
        }
        return;
      }
      if (event.handled) {
        if (options.onAfterResponse) {
          event._onAfterResponseCalled = true;
          await options.onAfterResponse(event, void 0);
        }
        return;
      }
    }
    if (!event.handled) {
      throw createError$1({
        statusCode: 404,
        statusMessage: `Cannot find any path matching ${event.path || "/"}.`
      });
    }
    if (options.onAfterResponse) {
      event._onAfterResponseCalled = true;
      await options.onAfterResponse(event, void 0);
    }
  });
}
function createResolver(stack) {
  return async (path) => {
    let _layerPath;
    for (const layer of stack) {
      if (layer.route === "/" && !layer.handler.__resolve__) {
        continue;
      }
      if (!path.startsWith(layer.route)) {
        continue;
      }
      _layerPath = path.slice(layer.route.length) || "/";
      if (layer.match && !layer.match(_layerPath, void 0)) {
        continue;
      }
      let res = { route: layer.route, handler: layer.handler };
      if (res.handler.__resolve__) {
        const _res = await res.handler.__resolve__(_layerPath);
        if (!_res) {
          continue;
        }
        res = {
          ...res,
          ..._res,
          route: joinURL(res.route || "/", _res.route || "/")
        };
      }
      return res;
    }
  };
}
function normalizeLayer(input) {
  let handler = input.handler;
  if (handler.handler) {
    handler = handler.handler;
  }
  if (input.lazy) {
    handler = lazyEventHandler(handler);
  } else if (!isEventHandler(handler)) {
    handler = toEventHandler(handler, void 0, input.route);
  }
  return {
    route: withoutTrailingSlash(input.route),
    match: input.match,
    handler
  };
}
function handleHandlerResponse(event, val, jsonSpace) {
  if (val === null) {
    return sendNoContent(event);
  }
  if (val) {
    if (isWebResponse(val)) {
      return sendWebResponse(event, val);
    }
    if (isStream(val)) {
      return sendStream(event, val);
    }
    if (val.buffer) {
      return send(event, val);
    }
    if (val.arrayBuffer && typeof val.arrayBuffer === "function") {
      return val.arrayBuffer().then((arrayBuffer) => {
        return send(event, Buffer.from(arrayBuffer), val.type);
      });
    }
    if (val instanceof Error) {
      throw createError$1(val);
    }
    if (typeof val.end === "function") {
      return true;
    }
  }
  const valType = typeof val;
  if (valType === "string") {
    return send(event, val, MIMES.html);
  }
  if (valType === "object" || valType === "boolean" || valType === "number") {
    return send(event, JSON.stringify(val, void 0, jsonSpace), MIMES.json);
  }
  if (valType === "bigint") {
    return send(event, val.toString(), MIMES.json);
  }
  throw createError$1({
    statusCode: 500,
    statusMessage: `[h3] Cannot send ${valType} as response.`
  });
}
function cachedFn(fn) {
  let cache;
  return () => {
    if (!cache) {
      cache = fn();
    }
    return cache;
  };
}
function _decodePath(url) {
  const qIndex = url.indexOf("?");
  const path = qIndex === -1 ? url : url.slice(0, qIndex);
  const query = qIndex === -1 ? "" : url.slice(qIndex);
  const decodedPath = path.includes("%25") ? decodePath(path.replace(/%25/g, "%2525")) : decodePath(path);
  return decodedPath + query;
}
function websocketOptions(evResolver, appOptions) {
  return {
    ...appOptions.websocket,
    async resolve(info) {
      const url = info.request?.url || info.url || "/";
      const { pathname } = typeof url === "string" ? parseURL(url) : url;
      const resolved = await evResolver(pathname);
      return resolved?.handler?.__websocket__ || {};
    }
  };
}

const RouterMethods = [
  "connect",
  "delete",
  "get",
  "head",
  "options",
  "post",
  "put",
  "trace",
  "patch"
];
function createRouter(opts = {}) {
  const _router = createRouter$1({});
  const routes = {};
  let _matcher;
  const router = {};
  const addRoute = (path, handler, method) => {
    let route = routes[path];
    if (!route) {
      routes[path] = route = { path, handlers: {} };
      _router.insert(path, route);
    }
    if (Array.isArray(method)) {
      for (const m of method) {
        addRoute(path, handler, m);
      }
    } else {
      route.handlers[method] = toEventHandler(handler);
    }
    return router;
  };
  router.use = router.add = (path, handler, method) => addRoute(path, handler, method || "all");
  for (const method of RouterMethods) {
    router[method] = (path, handle) => router.add(path, handle, method);
  }
  const matchHandler = (path = "/", method = "get") => {
    const qIndex = path.indexOf("?");
    if (qIndex !== -1) {
      path = path.slice(0, Math.max(0, qIndex));
    }
    const matched = _router.lookup(path);
    if (!matched || !matched.handlers) {
      return {
        error: createError$1({
          statusCode: 404,
          name: "Not Found",
          statusMessage: `Cannot find any route matching ${path || "/"}.`
        })
      };
    }
    let handler = matched.handlers[method] || matched.handlers.all;
    if (!handler) {
      if (!_matcher) {
        _matcher = toRouteMatcher(_router);
      }
      const _matches = _matcher.matchAll(path).reverse();
      for (const _match of _matches) {
        if (_match.handlers[method]) {
          handler = _match.handlers[method];
          matched.handlers[method] = matched.handlers[method] || handler;
          break;
        }
        if (_match.handlers.all) {
          handler = _match.handlers.all;
          matched.handlers.all = matched.handlers.all || handler;
          break;
        }
      }
    }
    if (!handler) {
      return {
        error: createError$1({
          statusCode: 405,
          name: "Method Not Allowed",
          statusMessage: `Method ${method} is not allowed on this route.`
        })
      };
    }
    return { matched, handler };
  };
  const isPreemptive = opts.preemptive || opts.preemtive;
  router.handler = eventHandler((event) => {
    const match = matchHandler(
      event.path,
      event.method.toLowerCase()
    );
    if ("error" in match) {
      if (isPreemptive) {
        throw match.error;
      } else {
        return;
      }
    }
    event.context.matchedRoute = match.matched;
    const params = match.matched.params || {};
    event.context.params = params;
    return Promise.resolve(match.handler(event)).then((res) => {
      if (res === void 0 && isPreemptive) {
        return null;
      }
      return res;
    });
  });
  router.handler.__resolve__ = async (path) => {
    path = withLeadingSlash(path);
    const match = matchHandler(path);
    if ("error" in match) {
      return;
    }
    let res = {
      route: match.matched.path,
      handler: match.handler
    };
    if (match.handler.__resolve__) {
      const _res = await match.handler.__resolve__(path);
      if (!_res) {
        return;
      }
      res = { ...res, ..._res };
    }
    return res;
  };
  return router;
}
function toNodeListener(app) {
  const toNodeHandle = async function(req, res) {
    const event = createEvent(req, res);
    try {
      await app.handler(event);
    } catch (_error) {
      const error = createError$1(_error);
      if (!isError(_error)) {
        error.unhandled = true;
      }
      setResponseStatus(event, error.statusCode, error.statusMessage);
      if (app.options.onError) {
        await app.options.onError(error, event);
      }
      if (event.handled) {
        return;
      }
      if (error.unhandled || error.fatal) {
        console.error("[h3]", error.fatal ? "[fatal]" : "[unhandled]", error);
      }
      if (app.options.onBeforeResponse && !event._onBeforeResponseCalled) {
        await app.options.onBeforeResponse(event, { body: error });
      }
      await sendError(event, error, !!app.options.debug);
      if (app.options.onAfterResponse && !event._onAfterResponseCalled) {
        await app.options.onAfterResponse(event, { body: error });
      }
    }
  };
  return toNodeHandle;
}

function flatHooks(configHooks, hooks = {}, parentName) {
  for (const key in configHooks) {
    const subHook = configHooks[key];
    const name = parentName ? `${parentName}:${key}` : key;
    if (typeof subHook === "object" && subHook !== null) {
      flatHooks(subHook, hooks, name);
    } else if (typeof subHook === "function") {
      hooks[name] = subHook;
    }
  }
  return hooks;
}
const defaultTask = { run: (function_) => function_() };
const _createTask = () => defaultTask;
const createTask = typeof console.createTask !== "undefined" ? console.createTask : _createTask;
function serialTaskCaller(hooks, args) {
  const name = args.shift();
  const task = createTask(name);
  return hooks.reduce(
    (promise, hookFunction) => promise.then(() => task.run(() => hookFunction(...args))),
    Promise.resolve()
  );
}
function parallelTaskCaller(hooks, args) {
  const name = args.shift();
  const task = createTask(name);
  return Promise.all(hooks.map((hook) => task.run(() => hook(...args))));
}
function callEachWith(callbacks, arg0) {
  for (const callback of [...callbacks]) {
    callback(arg0);
  }
}

class Hookable {
  constructor() {
    this._hooks = {};
    this._before = void 0;
    this._after = void 0;
    this._deprecatedMessages = void 0;
    this._deprecatedHooks = {};
    this.hook = this.hook.bind(this);
    this.callHook = this.callHook.bind(this);
    this.callHookWith = this.callHookWith.bind(this);
  }
  hook(name, function_, options = {}) {
    if (!name || typeof function_ !== "function") {
      return () => {
      };
    }
    const originalName = name;
    let dep;
    while (this._deprecatedHooks[name]) {
      dep = this._deprecatedHooks[name];
      name = dep.to;
    }
    if (dep && !options.allowDeprecated) {
      let message = dep.message;
      if (!message) {
        message = `${originalName} hook has been deprecated` + (dep.to ? `, please use ${dep.to}` : "");
      }
      if (!this._deprecatedMessages) {
        this._deprecatedMessages = /* @__PURE__ */ new Set();
      }
      if (!this._deprecatedMessages.has(message)) {
        console.warn(message);
        this._deprecatedMessages.add(message);
      }
    }
    if (!function_.name) {
      try {
        Object.defineProperty(function_, "name", {
          get: () => "_" + name.replace(/\W+/g, "_") + "_hook_cb",
          configurable: true
        });
      } catch {
      }
    }
    this._hooks[name] = this._hooks[name] || [];
    this._hooks[name].push(function_);
    return () => {
      if (function_) {
        this.removeHook(name, function_);
        function_ = void 0;
      }
    };
  }
  hookOnce(name, function_) {
    let _unreg;
    let _function = (...arguments_) => {
      if (typeof _unreg === "function") {
        _unreg();
      }
      _unreg = void 0;
      _function = void 0;
      return function_(...arguments_);
    };
    _unreg = this.hook(name, _function);
    return _unreg;
  }
  removeHook(name, function_) {
    if (this._hooks[name]) {
      const index = this._hooks[name].indexOf(function_);
      if (index !== -1) {
        this._hooks[name].splice(index, 1);
      }
      if (this._hooks[name].length === 0) {
        delete this._hooks[name];
      }
    }
  }
  deprecateHook(name, deprecated) {
    this._deprecatedHooks[name] = typeof deprecated === "string" ? { to: deprecated } : deprecated;
    const _hooks = this._hooks[name] || [];
    delete this._hooks[name];
    for (const hook of _hooks) {
      this.hook(name, hook);
    }
  }
  deprecateHooks(deprecatedHooks) {
    Object.assign(this._deprecatedHooks, deprecatedHooks);
    for (const name in deprecatedHooks) {
      this.deprecateHook(name, deprecatedHooks[name]);
    }
  }
  addHooks(configHooks) {
    const hooks = flatHooks(configHooks);
    const removeFns = Object.keys(hooks).map(
      (key) => this.hook(key, hooks[key])
    );
    return () => {
      for (const unreg of removeFns.splice(0, removeFns.length)) {
        unreg();
      }
    };
  }
  removeHooks(configHooks) {
    const hooks = flatHooks(configHooks);
    for (const key in hooks) {
      this.removeHook(key, hooks[key]);
    }
  }
  removeAllHooks() {
    for (const key in this._hooks) {
      delete this._hooks[key];
    }
  }
  callHook(name, ...arguments_) {
    arguments_.unshift(name);
    return this.callHookWith(serialTaskCaller, name, ...arguments_);
  }
  callHookParallel(name, ...arguments_) {
    arguments_.unshift(name);
    return this.callHookWith(parallelTaskCaller, name, ...arguments_);
  }
  callHookWith(caller, name, ...arguments_) {
    const event = this._before || this._after ? { name, args: arguments_, context: {} } : void 0;
    if (this._before) {
      callEachWith(this._before, event);
    }
    const result = caller(
      name in this._hooks ? [...this._hooks[name]] : [],
      arguments_
    );
    if (result instanceof Promise) {
      return result.finally(() => {
        if (this._after && event) {
          callEachWith(this._after, event);
        }
      });
    }
    if (this._after && event) {
      callEachWith(this._after, event);
    }
    return result;
  }
  beforeEach(function_) {
    this._before = this._before || [];
    this._before.push(function_);
    return () => {
      if (this._before !== void 0) {
        const index = this._before.indexOf(function_);
        if (index !== -1) {
          this._before.splice(index, 1);
        }
      }
    };
  }
  afterEach(function_) {
    this._after = this._after || [];
    this._after.push(function_);
    return () => {
      if (this._after !== void 0) {
        const index = this._after.indexOf(function_);
        if (index !== -1) {
          this._after.splice(index, 1);
        }
      }
    };
  }
}
function createHooks() {
  return new Hookable();
}

const s$1=globalThis.Headers,i$1=globalThis.AbortController,l$1=globalThis.fetch||(()=>{throw new Error("[node-fetch-native] Failed to fetch: `globalThis.fetch` is not available!")});

class FetchError extends Error {
  constructor(message, opts) {
    super(message, opts);
    this.name = "FetchError";
    if (opts?.cause && !this.cause) {
      this.cause = opts.cause;
    }
  }
}
function createFetchError(ctx) {
  const errorMessage = ctx.error?.message || ctx.error?.toString() || "";
  const method = ctx.request?.method || ctx.options?.method || "GET";
  const url = ctx.request?.url || String(ctx.request) || "/";
  const requestStr = `[${method}] ${JSON.stringify(url)}`;
  const statusStr = ctx.response ? `${ctx.response.status} ${ctx.response.statusText}` : "<no response>";
  const message = `${requestStr}: ${statusStr}${errorMessage ? ` ${errorMessage}` : ""}`;
  const fetchError = new FetchError(
    message,
    ctx.error ? { cause: ctx.error } : void 0
  );
  for (const key of ["request", "options", "response"]) {
    Object.defineProperty(fetchError, key, {
      get() {
        return ctx[key];
      }
    });
  }
  for (const [key, refKey] of [
    ["data", "_data"],
    ["status", "status"],
    ["statusCode", "status"],
    ["statusText", "statusText"],
    ["statusMessage", "statusText"]
  ]) {
    Object.defineProperty(fetchError, key, {
      get() {
        return ctx.response && ctx.response[refKey];
      }
    });
  }
  return fetchError;
}

const payloadMethods = new Set(
  Object.freeze(["PATCH", "POST", "PUT", "DELETE"])
);
function isPayloadMethod(method = "GET") {
  return payloadMethods.has(method.toUpperCase());
}
function isJSONSerializable(value) {
  if (value === void 0) {
    return false;
  }
  const t = typeof value;
  if (t === "string" || t === "number" || t === "boolean" || t === null) {
    return true;
  }
  if (t !== "object") {
    return false;
  }
  if (Array.isArray(value)) {
    return true;
  }
  if (value.buffer) {
    return false;
  }
  if (value instanceof FormData || value instanceof URLSearchParams) {
    return false;
  }
  return value.constructor && value.constructor.name === "Object" || typeof value.toJSON === "function";
}
const textTypes = /* @__PURE__ */ new Set([
  "image/svg",
  "application/xml",
  "application/xhtml",
  "application/html"
]);
const JSON_RE = /^application\/(?:[\w!#$%&*.^`~-]*\+)?json(;.+)?$/i;
function detectResponseType(_contentType = "") {
  if (!_contentType) {
    return "json";
  }
  const contentType = _contentType.split(";").shift() || "";
  if (JSON_RE.test(contentType)) {
    return "json";
  }
  if (contentType === "text/event-stream") {
    return "stream";
  }
  if (textTypes.has(contentType) || contentType.startsWith("text/")) {
    return "text";
  }
  return "blob";
}
function resolveFetchOptions(request, input, defaults, Headers) {
  const headers = mergeHeaders(
    input?.headers ?? request?.headers,
    defaults?.headers,
    Headers
  );
  let query;
  if (defaults?.query || defaults?.params || input?.params || input?.query) {
    query = {
      ...defaults?.params,
      ...defaults?.query,
      ...input?.params,
      ...input?.query
    };
  }
  return {
    ...defaults,
    ...input,
    query,
    params: query,
    headers
  };
}
function mergeHeaders(input, defaults, Headers) {
  if (!defaults) {
    return new Headers(input);
  }
  const headers = new Headers(defaults);
  if (input) {
    for (const [key, value] of Symbol.iterator in input || Array.isArray(input) ? input : new Headers(input)) {
      headers.set(key, value);
    }
  }
  return headers;
}
async function callHooks(context, hooks) {
  if (hooks) {
    if (Array.isArray(hooks)) {
      for (const hook of hooks) {
        await hook(context);
      }
    } else {
      await hooks(context);
    }
  }
}

const retryStatusCodes = /* @__PURE__ */ new Set([
  408,
  // Request Timeout
  409,
  // Conflict
  425,
  // Too Early (Experimental)
  429,
  // Too Many Requests
  500,
  // Internal Server Error
  502,
  // Bad Gateway
  503,
  // Service Unavailable
  504
  // Gateway Timeout
]);
const nullBodyResponses = /* @__PURE__ */ new Set([101, 204, 205, 304]);
function createFetch(globalOptions = {}) {
  const {
    fetch = globalThis.fetch,
    Headers = globalThis.Headers,
    AbortController = globalThis.AbortController
  } = globalOptions;
  async function onError(context) {
    const isAbort = context.error && context.error.name === "AbortError" && !context.options.timeout || false;
    if (context.options.retry !== false && !isAbort) {
      let retries;
      if (typeof context.options.retry === "number") {
        retries = context.options.retry;
      } else {
        retries = isPayloadMethod(context.options.method) ? 0 : 1;
      }
      const responseCode = context.response && context.response.status || 500;
      if (retries > 0 && (Array.isArray(context.options.retryStatusCodes) ? context.options.retryStatusCodes.includes(responseCode) : retryStatusCodes.has(responseCode))) {
        const retryDelay = typeof context.options.retryDelay === "function" ? context.options.retryDelay(context) : context.options.retryDelay || 0;
        if (retryDelay > 0) {
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
        }
        return $fetchRaw(context.request, {
          ...context.options,
          retry: retries - 1
        });
      }
    }
    const error = createFetchError(context);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(error, $fetchRaw);
    }
    throw error;
  }
  const $fetchRaw = async function $fetchRaw2(_request, _options = {}) {
    const context = {
      request: _request,
      options: resolveFetchOptions(
        _request,
        _options,
        globalOptions.defaults,
        Headers
      ),
      response: void 0,
      error: void 0
    };
    if (context.options.method) {
      context.options.method = context.options.method.toUpperCase();
    }
    if (context.options.onRequest) {
      await callHooks(context, context.options.onRequest);
      if (!(context.options.headers instanceof Headers)) {
        context.options.headers = new Headers(
          context.options.headers || {}
          /* compat */
        );
      }
    }
    if (typeof context.request === "string") {
      if (context.options.baseURL) {
        context.request = withBase(context.request, context.options.baseURL);
      }
      if (context.options.query) {
        context.request = withQuery(context.request, context.options.query);
        delete context.options.query;
      }
      if ("query" in context.options) {
        delete context.options.query;
      }
      if ("params" in context.options) {
        delete context.options.params;
      }
    }
    if (context.options.body && isPayloadMethod(context.options.method)) {
      if (isJSONSerializable(context.options.body)) {
        const contentType = context.options.headers.get("content-type");
        if (typeof context.options.body !== "string") {
          context.options.body = contentType === "application/x-www-form-urlencoded" ? new URLSearchParams(
            context.options.body
          ).toString() : JSON.stringify(context.options.body);
        }
        if (!contentType) {
          context.options.headers.set("content-type", "application/json");
        }
        if (!context.options.headers.has("accept")) {
          context.options.headers.set("accept", "application/json");
        }
      } else if (
        // ReadableStream Body
        "pipeTo" in context.options.body && typeof context.options.body.pipeTo === "function" || // Node.js Stream Body
        typeof context.options.body.pipe === "function"
      ) {
        if (!("duplex" in context.options)) {
          context.options.duplex = "half";
        }
      }
    }
    let abortTimeout;
    if (!context.options.signal && context.options.timeout) {
      const controller = new AbortController();
      abortTimeout = setTimeout(() => {
        const error = new Error(
          "[TimeoutError]: The operation was aborted due to timeout"
        );
        error.name = "TimeoutError";
        error.code = 23;
        controller.abort(error);
      }, context.options.timeout);
      context.options.signal = controller.signal;
    }
    try {
      context.response = await fetch(
        context.request,
        context.options
      );
    } catch (error) {
      context.error = error;
      if (context.options.onRequestError) {
        await callHooks(
          context,
          context.options.onRequestError
        );
      }
      return await onError(context);
    } finally {
      if (abortTimeout) {
        clearTimeout(abortTimeout);
      }
    }
    const hasBody = (context.response.body || // https://github.com/unjs/ofetch/issues/324
    // https://github.com/unjs/ofetch/issues/294
    // https://github.com/JakeChampion/fetch/issues/1454
    context.response._bodyInit) && !nullBodyResponses.has(context.response.status) && context.options.method !== "HEAD";
    if (hasBody) {
      const responseType = (context.options.parseResponse ? "json" : context.options.responseType) || detectResponseType(context.response.headers.get("content-type") || "");
      switch (responseType) {
        case "json": {
          const data = await context.response.text();
          const parseFunction = context.options.parseResponse || destr;
          context.response._data = parseFunction(data);
          break;
        }
        case "stream": {
          context.response._data = context.response.body || context.response._bodyInit;
          break;
        }
        default: {
          context.response._data = await context.response[responseType]();
        }
      }
    }
    if (context.options.onResponse) {
      await callHooks(
        context,
        context.options.onResponse
      );
    }
    if (!context.options.ignoreResponseError && context.response.status >= 400 && context.response.status < 600) {
      if (context.options.onResponseError) {
        await callHooks(
          context,
          context.options.onResponseError
        );
      }
      return await onError(context);
    }
    return context.response;
  };
  const $fetch = async function $fetch2(request, options) {
    const r = await $fetchRaw(request, options);
    return r._data;
  };
  $fetch.raw = $fetchRaw;
  $fetch.native = (...args) => fetch(...args);
  $fetch.create = (defaultOptions = {}, customGlobalOptions = {}) => createFetch({
    ...globalOptions,
    ...customGlobalOptions,
    defaults: {
      ...globalOptions.defaults,
      ...customGlobalOptions.defaults,
      ...defaultOptions
    }
  });
  return $fetch;
}

function createNodeFetch() {
  const useKeepAlive = JSON.parse(process.env.FETCH_KEEP_ALIVE || "false");
  if (!useKeepAlive) {
    return l$1;
  }
  const agentOptions = { keepAlive: true };
  const httpAgent = new http.Agent(agentOptions);
  const httpsAgent = new https.Agent(agentOptions);
  const nodeFetchOptions = {
    agent(parsedURL) {
      return parsedURL.protocol === "http:" ? httpAgent : httpsAgent;
    }
  };
  return function nodeFetchWithKeepAlive(input, init) {
    return l$1(input, { ...nodeFetchOptions, ...init });
  };
}
const fetch = globalThis.fetch ? (...args) => globalThis.fetch(...args) : createNodeFetch();
const Headers$1 = globalThis.Headers || s$1;
const AbortController$1 = globalThis.AbortController || i$1;
createFetch({ fetch, Headers: Headers$1, AbortController: AbortController$1 });

function wrapToPromise(value) {
  if (!value || typeof value.then !== "function") {
    return Promise.resolve(value);
  }
  return value;
}
function asyncCall(function_, ...arguments_) {
  try {
    return wrapToPromise(function_(...arguments_));
  } catch (error) {
    return Promise.reject(error);
  }
}
function isPrimitive$1(value) {
  const type = typeof value;
  return value === null || type !== "object" && type !== "function";
}
function isPureObject(value) {
  const proto = Object.getPrototypeOf(value);
  return !proto || proto.isPrototypeOf(Object);
}
function stringify(value) {
  if (isPrimitive$1(value)) {
    return String(value);
  }
  if (isPureObject(value) || Array.isArray(value)) {
    return JSON.stringify(value);
  }
  if (typeof value.toJSON === "function") {
    return stringify(value.toJSON());
  }
  throw new Error("[unstorage] Cannot stringify value!");
}
const BASE64_PREFIX = "base64:";
function serializeRaw(value) {
  if (typeof value === "string") {
    return value;
  }
  return BASE64_PREFIX + base64Encode(value);
}
function deserializeRaw(value) {
  if (typeof value !== "string") {
    return value;
  }
  if (!value.startsWith(BASE64_PREFIX)) {
    return value;
  }
  return base64Decode(value.slice(BASE64_PREFIX.length));
}
function base64Decode(input) {
  if (globalThis.Buffer) {
    return Buffer.from(input, "base64");
  }
  return Uint8Array.from(
    globalThis.atob(input),
    (c) => c.codePointAt(0)
  );
}
function base64Encode(input) {
  if (globalThis.Buffer) {
    return Buffer.from(input).toString("base64");
  }
  return globalThis.btoa(String.fromCodePoint(...input));
}

const storageKeyProperties = [
  "has",
  "hasItem",
  "get",
  "getItem",
  "getItemRaw",
  "set",
  "setItem",
  "setItemRaw",
  "del",
  "remove",
  "removeItem",
  "getMeta",
  "setMeta",
  "removeMeta",
  "getKeys",
  "clear",
  "mount",
  "unmount"
];
function prefixStorage(storage, base) {
  base = normalizeBaseKey(base);
  if (!base) {
    return storage;
  }
  const nsStorage = { ...storage };
  for (const property of storageKeyProperties) {
    nsStorage[property] = (key = "", ...args) => (
      // @ts-ignore
      storage[property](base + key, ...args)
    );
  }
  nsStorage.getKeys = (key = "", ...arguments_) => storage.getKeys(base + key, ...arguments_).then((keys) => keys.map((key2) => key2.slice(base.length)));
  nsStorage.keys = nsStorage.getKeys;
  nsStorage.getItems = async (items, commonOptions) => {
    const prefixedItems = items.map(
      (item) => typeof item === "string" ? base + item : { ...item, key: base + item.key }
    );
    const results = await storage.getItems(prefixedItems, commonOptions);
    return results.map((entry) => ({
      key: entry.key.slice(base.length),
      value: entry.value
    }));
  };
  nsStorage.setItems = async (items, commonOptions) => {
    const prefixedItems = items.map((item) => ({
      key: base + item.key,
      value: item.value,
      options: item.options
    }));
    return storage.setItems(prefixedItems, commonOptions);
  };
  return nsStorage;
}
function normalizeKey$1(key) {
  if (!key) {
    return "";
  }
  return key.split("?")[0]?.replace(/[/\\]/g, ":").replace(/:+/g, ":").replace(/^:|:$/g, "") || "";
}
function joinKeys(...keys) {
  return normalizeKey$1(keys.join(":"));
}
function normalizeBaseKey(base) {
  base = normalizeKey$1(base);
  return base ? base + ":" : "";
}
function filterKeyByDepth(key, depth) {
  if (depth === void 0) {
    return true;
  }
  let substrCount = 0;
  let index = key.indexOf(":");
  while (index > -1) {
    substrCount++;
    index = key.indexOf(":", index + 1);
  }
  return substrCount <= depth;
}
function filterKeyByBase(key, base) {
  if (base) {
    return key.startsWith(base) && key[key.length - 1] !== "$";
  }
  return key[key.length - 1] !== "$";
}

function defineDriver$1(factory) {
  return factory;
}

const DRIVER_NAME$1 = "memory";
const memory = defineDriver$1(() => {
  const data = /* @__PURE__ */ new Map();
  return {
    name: DRIVER_NAME$1,
    getInstance: () => data,
    hasItem(key) {
      return data.has(key);
    },
    getItem(key) {
      return data.get(key) ?? null;
    },
    getItemRaw(key) {
      return data.get(key) ?? null;
    },
    setItem(key, value) {
      data.set(key, value);
    },
    setItemRaw(key, value) {
      data.set(key, value);
    },
    removeItem(key) {
      data.delete(key);
    },
    getKeys() {
      return [...data.keys()];
    },
    clear() {
      data.clear();
    },
    dispose() {
      data.clear();
    }
  };
});

function createStorage(options = {}) {
  const context = {
    mounts: { "": options.driver || memory() },
    mountpoints: [""],
    watching: false,
    watchListeners: [],
    unwatch: {}
  };
  const getMount = (key) => {
    for (const base of context.mountpoints) {
      if (key.startsWith(base)) {
        return {
          base,
          relativeKey: key.slice(base.length),
          driver: context.mounts[base]
        };
      }
    }
    return {
      base: "",
      relativeKey: key,
      driver: context.mounts[""]
    };
  };
  const getMounts = (base, includeParent) => {
    return context.mountpoints.filter(
      (mountpoint) => mountpoint.startsWith(base) || includeParent && base.startsWith(mountpoint)
    ).map((mountpoint) => ({
      relativeBase: base.length > mountpoint.length ? base.slice(mountpoint.length) : void 0,
      mountpoint,
      driver: context.mounts[mountpoint]
    }));
  };
  const onChange = (event, key) => {
    if (!context.watching) {
      return;
    }
    key = normalizeKey$1(key);
    for (const listener of context.watchListeners) {
      listener(event, key);
    }
  };
  const startWatch = async () => {
    if (context.watching) {
      return;
    }
    context.watching = true;
    for (const mountpoint in context.mounts) {
      context.unwatch[mountpoint] = await watch(
        context.mounts[mountpoint],
        onChange,
        mountpoint
      );
    }
  };
  const stopWatch = async () => {
    if (!context.watching) {
      return;
    }
    for (const mountpoint in context.unwatch) {
      await context.unwatch[mountpoint]();
    }
    context.unwatch = {};
    context.watching = false;
  };
  const runBatch = (items, commonOptions, cb) => {
    const batches = /* @__PURE__ */ new Map();
    const getBatch = (mount) => {
      let batch = batches.get(mount.base);
      if (!batch) {
        batch = {
          driver: mount.driver,
          base: mount.base,
          items: []
        };
        batches.set(mount.base, batch);
      }
      return batch;
    };
    for (const item of items) {
      const isStringItem = typeof item === "string";
      const key = normalizeKey$1(isStringItem ? item : item.key);
      const value = isStringItem ? void 0 : item.value;
      const options2 = isStringItem || !item.options ? commonOptions : { ...commonOptions, ...item.options };
      const mount = getMount(key);
      getBatch(mount).items.push({
        key,
        value,
        relativeKey: mount.relativeKey,
        options: options2
      });
    }
    return Promise.all([...batches.values()].map((batch) => cb(batch))).then(
      (r) => r.flat()
    );
  };
  const storage = {
    // Item
    hasItem(key, opts = {}) {
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      return asyncCall(driver.hasItem, relativeKey, opts);
    },
    getItem(key, opts = {}) {
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      return asyncCall(driver.getItem, relativeKey, opts).then(
        (value) => destr(value)
      );
    },
    getItems(items, commonOptions = {}) {
      return runBatch(items, commonOptions, (batch) => {
        if (batch.driver.getItems) {
          return asyncCall(
            batch.driver.getItems,
            batch.items.map((item) => ({
              key: item.relativeKey,
              options: item.options
            })),
            commonOptions
          ).then(
            (r) => r.map((item) => ({
              key: joinKeys(batch.base, item.key),
              value: destr(item.value)
            }))
          );
        }
        return Promise.all(
          batch.items.map((item) => {
            return asyncCall(
              batch.driver.getItem,
              item.relativeKey,
              item.options
            ).then((value) => ({
              key: item.key,
              value: destr(value)
            }));
          })
        );
      });
    },
    getItemRaw(key, opts = {}) {
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      if (driver.getItemRaw) {
        return asyncCall(driver.getItemRaw, relativeKey, opts);
      }
      return asyncCall(driver.getItem, relativeKey, opts).then(
        (value) => deserializeRaw(value)
      );
    },
    async setItem(key, value, opts = {}) {
      if (value === void 0) {
        return storage.removeItem(key);
      }
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      if (!driver.setItem) {
        return;
      }
      await asyncCall(driver.setItem, relativeKey, stringify(value), opts);
      if (!driver.watch) {
        onChange("update", key);
      }
    },
    async setItems(items, commonOptions) {
      await runBatch(items, commonOptions, async (batch) => {
        if (batch.driver.setItems) {
          return asyncCall(
            batch.driver.setItems,
            batch.items.map((item) => ({
              key: item.relativeKey,
              value: stringify(item.value),
              options: item.options
            })),
            commonOptions
          );
        }
        if (!batch.driver.setItem) {
          return;
        }
        await Promise.all(
          batch.items.map((item) => {
            return asyncCall(
              batch.driver.setItem,
              item.relativeKey,
              stringify(item.value),
              item.options
            );
          })
        );
      });
    },
    async setItemRaw(key, value, opts = {}) {
      if (value === void 0) {
        return storage.removeItem(key, opts);
      }
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      if (driver.setItemRaw) {
        await asyncCall(driver.setItemRaw, relativeKey, value, opts);
      } else if (driver.setItem) {
        await asyncCall(driver.setItem, relativeKey, serializeRaw(value), opts);
      } else {
        return;
      }
      if (!driver.watch) {
        onChange("update", key);
      }
    },
    async removeItem(key, opts = {}) {
      if (typeof opts === "boolean") {
        opts = { removeMeta: opts };
      }
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      if (!driver.removeItem) {
        return;
      }
      await asyncCall(driver.removeItem, relativeKey, opts);
      if (opts.removeMeta || opts.removeMata) {
        await asyncCall(driver.removeItem, relativeKey + "$", opts);
      }
      if (!driver.watch) {
        onChange("remove", key);
      }
    },
    // Meta
    async getMeta(key, opts = {}) {
      if (typeof opts === "boolean") {
        opts = { nativeOnly: opts };
      }
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      const meta = /* @__PURE__ */ Object.create(null);
      if (driver.getMeta) {
        Object.assign(meta, await asyncCall(driver.getMeta, relativeKey, opts));
      }
      if (!opts.nativeOnly) {
        const value = await asyncCall(
          driver.getItem,
          relativeKey + "$",
          opts
        ).then((value_) => destr(value_));
        if (value && typeof value === "object") {
          if (typeof value.atime === "string") {
            value.atime = new Date(value.atime);
          }
          if (typeof value.mtime === "string") {
            value.mtime = new Date(value.mtime);
          }
          Object.assign(meta, value);
        }
      }
      return meta;
    },
    setMeta(key, value, opts = {}) {
      return this.setItem(key + "$", value, opts);
    },
    removeMeta(key, opts = {}) {
      return this.removeItem(key + "$", opts);
    },
    // Keys
    async getKeys(base, opts = {}) {
      base = normalizeBaseKey(base);
      const mounts = getMounts(base, true);
      let maskedMounts = [];
      const allKeys = [];
      let allMountsSupportMaxDepth = true;
      for (const mount of mounts) {
        if (!mount.driver.flags?.maxDepth) {
          allMountsSupportMaxDepth = false;
        }
        const rawKeys = await asyncCall(
          mount.driver.getKeys,
          mount.relativeBase,
          opts
        );
        for (const key of rawKeys) {
          const fullKey = mount.mountpoint + normalizeKey$1(key);
          if (!maskedMounts.some((p) => fullKey.startsWith(p))) {
            allKeys.push(fullKey);
          }
        }
        maskedMounts = [
          mount.mountpoint,
          ...maskedMounts.filter((p) => !p.startsWith(mount.mountpoint))
        ];
      }
      const shouldFilterByDepth = opts.maxDepth !== void 0 && !allMountsSupportMaxDepth;
      return allKeys.filter(
        (key) => (!shouldFilterByDepth || filterKeyByDepth(key, opts.maxDepth)) && filterKeyByBase(key, base)
      );
    },
    // Utils
    async clear(base, opts = {}) {
      base = normalizeBaseKey(base);
      await Promise.all(
        getMounts(base, false).map(async (m) => {
          if (m.driver.clear) {
            return asyncCall(m.driver.clear, m.relativeBase, opts);
          }
          if (m.driver.removeItem) {
            const keys = await m.driver.getKeys(m.relativeBase || "", opts);
            return Promise.all(
              keys.map((key) => m.driver.removeItem(key, opts))
            );
          }
        })
      );
    },
    async dispose() {
      await Promise.all(
        Object.values(context.mounts).map((driver) => dispose(driver))
      );
    },
    async watch(callback) {
      await startWatch();
      context.watchListeners.push(callback);
      return async () => {
        context.watchListeners = context.watchListeners.filter(
          (listener) => listener !== callback
        );
        if (context.watchListeners.length === 0) {
          await stopWatch();
        }
      };
    },
    async unwatch() {
      context.watchListeners = [];
      await stopWatch();
    },
    // Mount
    mount(base, driver) {
      base = normalizeBaseKey(base);
      if (base && context.mounts[base]) {
        throw new Error(`already mounted at ${base}`);
      }
      if (base) {
        context.mountpoints.push(base);
        context.mountpoints.sort((a, b) => b.length - a.length);
      }
      context.mounts[base] = driver;
      if (context.watching) {
        Promise.resolve(watch(driver, onChange, base)).then((unwatcher) => {
          context.unwatch[base] = unwatcher;
        }).catch(console.error);
      }
      return storage;
    },
    async unmount(base, _dispose = true) {
      base = normalizeBaseKey(base);
      if (!base || !context.mounts[base]) {
        return;
      }
      if (context.watching && base in context.unwatch) {
        context.unwatch[base]?.();
        delete context.unwatch[base];
      }
      if (_dispose) {
        await dispose(context.mounts[base]);
      }
      context.mountpoints = context.mountpoints.filter((key) => key !== base);
      delete context.mounts[base];
    },
    getMount(key = "") {
      key = normalizeKey$1(key) + ":";
      const m = getMount(key);
      return {
        driver: m.driver,
        base: m.base
      };
    },
    getMounts(base = "", opts = {}) {
      base = normalizeKey$1(base);
      const mounts = getMounts(base, opts.parents);
      return mounts.map((m) => ({
        driver: m.driver,
        base: m.mountpoint
      }));
    },
    // Aliases
    keys: (base, opts = {}) => storage.getKeys(base, opts),
    get: (key, opts = {}) => storage.getItem(key, opts),
    set: (key, value, opts = {}) => storage.setItem(key, value, opts),
    has: (key, opts = {}) => storage.hasItem(key, opts),
    del: (key, opts = {}) => storage.removeItem(key, opts),
    remove: (key, opts = {}) => storage.removeItem(key, opts)
  };
  return storage;
}
function watch(driver, onChange, base) {
  return driver.watch ? driver.watch((event, key) => onChange(event, base + key)) : () => {
  };
}
async function dispose(driver) {
  if (typeof driver.dispose === "function") {
    await asyncCall(driver.dispose);
  }
}

const _assets = {

};

const normalizeKey = function normalizeKey(key) {
  if (!key) {
    return "";
  }
  return key.split("?")[0]?.replace(/[/\\]/g, ":").replace(/:+/g, ":").replace(/^:|:$/g, "") || "";
};

const assets$1 = {
  getKeys() {
    return Promise.resolve(Object.keys(_assets))
  },
  hasItem (id) {
    id = normalizeKey(id);
    return Promise.resolve(id in _assets)
  },
  getItem (id) {
    id = normalizeKey(id);
    return Promise.resolve(_assets[id] ? _assets[id].import() : null)
  },
  getMeta (id) {
    id = normalizeKey(id);
    return Promise.resolve(_assets[id] ? _assets[id].meta : {})
  }
};

function defineDriver(factory) {
  return factory;
}
function createError(driver, message, opts) {
  const err = new Error(`[unstorage] [${driver}] ${message}`, opts);
  if (Error.captureStackTrace) {
    Error.captureStackTrace(err, createError);
  }
  return err;
}
function createRequiredError(driver, name) {
  if (Array.isArray(name)) {
    return createError(
      driver,
      `Missing some of the required options ${name.map((n) => "`" + n + "`").join(", ")}`
    );
  }
  return createError(driver, `Missing required option \`${name}\`.`);
}

function ignoreNotfound(err) {
  return err.code === "ENOENT" || err.code === "EISDIR" ? null : err;
}
function ignoreExists(err) {
  return err.code === "EEXIST" ? null : err;
}
async function writeFile(path, data, encoding) {
  await ensuredir(dirname$1(path));
  return promises.writeFile(path, data, encoding);
}
function readFile(path, encoding) {
  return promises.readFile(path, encoding).catch(ignoreNotfound);
}
function unlink(path) {
  return promises.unlink(path).catch(ignoreNotfound);
}
function readdir(dir) {
  return promises.readdir(dir, { withFileTypes: true }).catch(ignoreNotfound).then((r) => r || []);
}
async function ensuredir(dir) {
  if (existsSync(dir)) {
    return;
  }
  await ensuredir(dirname$1(dir)).catch(ignoreExists);
  await promises.mkdir(dir).catch(ignoreExists);
}
async function readdirRecursive(dir, ignore, maxDepth) {
  if (ignore && ignore(dir)) {
    return [];
  }
  const entries = await readdir(dir);
  const files = [];
  await Promise.all(
    entries.map(async (entry) => {
      const entryPath = resolve$2(dir, entry.name);
      if (entry.isDirectory()) {
        if (maxDepth === void 0 || maxDepth > 0) {
          const dirFiles = await readdirRecursive(
            entryPath,
            ignore,
            maxDepth === void 0 ? void 0 : maxDepth - 1
          );
          files.push(...dirFiles.map((f) => entry.name + "/" + f));
        }
      } else {
        if (!(ignore && ignore(entry.name))) {
          files.push(entry.name);
        }
      }
    })
  );
  return files;
}
async function rmRecursive(dir) {
  const entries = await readdir(dir);
  await Promise.all(
    entries.map((entry) => {
      const entryPath = resolve$2(dir, entry.name);
      if (entry.isDirectory()) {
        return rmRecursive(entryPath).then(() => promises.rmdir(entryPath));
      } else {
        return promises.unlink(entryPath);
      }
    })
  );
}

const PATH_TRAVERSE_RE = /\.\.:|\.\.$/;
const DRIVER_NAME = "fs-lite";
const unstorage_47drivers_47fs_45lite = defineDriver((opts = {}) => {
  if (!opts.base) {
    throw createRequiredError(DRIVER_NAME, "base");
  }
  opts.base = resolve$2(opts.base);
  const r = (key) => {
    if (PATH_TRAVERSE_RE.test(key)) {
      throw createError(
        DRIVER_NAME,
        `Invalid key: ${JSON.stringify(key)}. It should not contain .. segments`
      );
    }
    const resolved = join(opts.base, key.replace(/:/g, "/"));
    return resolved;
  };
  return {
    name: DRIVER_NAME,
    options: opts,
    flags: {
      maxDepth: true
    },
    hasItem(key) {
      return existsSync(r(key));
    },
    getItem(key) {
      return readFile(r(key), "utf8");
    },
    getItemRaw(key) {
      return readFile(r(key));
    },
    async getMeta(key) {
      const { atime, mtime, size, birthtime, ctime } = await promises.stat(r(key)).catch(() => ({}));
      return { atime, mtime, size, birthtime, ctime };
    },
    setItem(key, value) {
      if (opts.readOnly) {
        return;
      }
      return writeFile(r(key), value, "utf8");
    },
    setItemRaw(key, value) {
      if (opts.readOnly) {
        return;
      }
      return writeFile(r(key), value);
    },
    removeItem(key) {
      if (opts.readOnly) {
        return;
      }
      return unlink(r(key));
    },
    getKeys(_base, topts) {
      return readdirRecursive(r("."), opts.ignore, topts?.maxDepth);
    },
    async clear() {
      if (opts.readOnly || opts.noClear) {
        return;
      }
      await rmRecursive(r("."));
    }
  };
});

const storage = createStorage({});

storage.mount('/assets', assets$1);

storage.mount('data', unstorage_47drivers_47fs_45lite({"driver":"fsLite","base":"./.data/kv"}));

function useStorage(base = "") {
  return base ? prefixStorage(storage, base) : storage;
}

const e=globalThis.process?.getBuiltinModule?.("crypto")?.hash,r$1="sha256",s="base64url";function digest(t){if(e)return e(r$1,t,s);const o=createHash(r$1).update(t);return globalThis.process?.versions?.webcontainer?o.digest().toString(s):o.digest(s)}

const Hasher = /* @__PURE__ */ (() => {
  class Hasher2 {
    buff = "";
    #context = /* @__PURE__ */ new Map();
    write(str) {
      this.buff += str;
    }
    dispatch(value) {
      const type = value === null ? "null" : typeof value;
      return this[type](value);
    }
    object(object) {
      if (object && typeof object.toJSON === "function") {
        return this.object(object.toJSON());
      }
      const objString = Object.prototype.toString.call(object);
      let objType = "";
      const objectLength = objString.length;
      objType = objectLength < 10 ? "unknown:[" + objString + "]" : objString.slice(8, objectLength - 1);
      objType = objType.toLowerCase();
      let objectNumber = null;
      if ((objectNumber = this.#context.get(object)) === void 0) {
        this.#context.set(object, this.#context.size);
      } else {
        return this.dispatch("[CIRCULAR:" + objectNumber + "]");
      }
      if (typeof Buffer !== "undefined" && Buffer.isBuffer && Buffer.isBuffer(object)) {
        this.write("buffer:");
        return this.write(object.toString("utf8"));
      }
      if (objType !== "object" && objType !== "function" && objType !== "asyncfunction") {
        if (this[objType]) {
          this[objType](object);
        } else {
          this.unknown(object, objType);
        }
      } else {
        const keys = Object.keys(object).sort();
        const extraKeys = [];
        this.write("object:" + (keys.length + extraKeys.length) + ":");
        const dispatchForKey = (key) => {
          this.dispatch(key);
          this.write(":");
          this.dispatch(object[key]);
          this.write(",");
        };
        for (const key of keys) {
          dispatchForKey(key);
        }
        for (const key of extraKeys) {
          dispatchForKey(key);
        }
      }
    }
    array(arr, unordered) {
      unordered = unordered === void 0 ? false : unordered;
      this.write("array:" + arr.length + ":");
      if (!unordered || arr.length <= 1) {
        for (const entry of arr) {
          this.dispatch(entry);
        }
        return;
      }
      const contextAdditions = /* @__PURE__ */ new Map();
      const entries = arr.map((entry) => {
        const hasher = new Hasher2();
        hasher.dispatch(entry);
        for (const [key, value] of hasher.#context) {
          contextAdditions.set(key, value);
        }
        return hasher.toString();
      });
      this.#context = contextAdditions;
      entries.sort();
      return this.array(entries, false);
    }
    date(date) {
      return this.write("date:" + date.toJSON());
    }
    symbol(sym) {
      return this.write("symbol:" + sym.toString());
    }
    unknown(value, type) {
      this.write(type);
      if (!value) {
        return;
      }
      this.write(":");
      if (value && typeof value.entries === "function") {
        return this.array(
          [...value.entries()],
          true
          /* ordered */
        );
      }
    }
    error(err) {
      return this.write("error:" + err.toString());
    }
    boolean(bool) {
      return this.write("bool:" + bool);
    }
    string(string) {
      this.write("string:" + string.length + ":");
      this.write(string);
    }
    function(fn) {
      this.write("fn:");
      if (isNativeFunction(fn)) {
        this.dispatch("[native]");
      } else {
        this.dispatch(fn.toString());
      }
    }
    number(number) {
      return this.write("number:" + number);
    }
    null() {
      return this.write("Null");
    }
    undefined() {
      return this.write("Undefined");
    }
    regexp(regex) {
      return this.write("regex:" + regex.toString());
    }
    arraybuffer(arr) {
      this.write("arraybuffer:");
      return this.dispatch(new Uint8Array(arr));
    }
    url(url) {
      return this.write("url:" + url.toString());
    }
    map(map) {
      this.write("map:");
      const arr = [...map];
      return this.array(arr, false);
    }
    set(set) {
      this.write("set:");
      const arr = [...set];
      return this.array(arr, false);
    }
    bigint(number) {
      return this.write("bigint:" + number.toString());
    }
  }
  for (const type of [
    "uint8array",
    "uint8clampedarray",
    "unt8array",
    "uint16array",
    "unt16array",
    "uint32array",
    "unt32array",
    "float32array",
    "float64array"
  ]) {
    Hasher2.prototype[type] = function(arr) {
      this.write(type + ":");
      return this.array([...arr], false);
    };
  }
  function isNativeFunction(f) {
    if (typeof f !== "function") {
      return false;
    }
    return Function.prototype.toString.call(f).slice(
      -15
      /* "[native code] }".length */
    ) === "[native code] }";
  }
  return Hasher2;
})();
function serialize(object) {
  const hasher = new Hasher();
  hasher.dispatch(object);
  return hasher.buff;
}
function hash(value) {
  return digest(typeof value === "string" ? value : serialize(value)).replace(/[-_]/g, "").slice(0, 10);
}

function defaultCacheOptions() {
  return {
    name: "_",
    base: "/cache",
    swr: true,
    maxAge: 1
  };
}
function defineCachedFunction(fn, opts = {}) {
  opts = { ...defaultCacheOptions(), ...opts };
  const pending = {};
  const group = opts.group || "nitro/functions";
  const name = opts.name || fn.name || "_";
  const integrity = opts.integrity || hash([fn, opts]);
  const validate = opts.validate || ((entry) => entry.value !== void 0);
  async function get(key, resolver, shouldInvalidateCache, event) {
    const cacheKey = [opts.base, group, name, key + ".json"].filter(Boolean).join(":").replace(/:\/$/, ":index");
    let entry = await useStorage().getItem(cacheKey).catch((error) => {
      console.error(`[cache] Cache read error.`, error);
      useNitroApp().captureError(error, { event, tags: ["cache"] });
    }) || {};
    if (typeof entry !== "object") {
      entry = {};
      const error = new Error("Malformed data read from cache.");
      console.error("[cache]", error);
      useNitroApp().captureError(error, { event, tags: ["cache"] });
    }
    const ttl = (opts.maxAge ?? 0) * 1e3;
    if (ttl) {
      entry.expires = Date.now() + ttl;
    }
    const expired = shouldInvalidateCache || entry.integrity !== integrity || ttl && Date.now() - (entry.mtime || 0) > ttl || validate(entry) === false;
    const _resolve = async () => {
      const isPending = pending[key];
      if (!isPending) {
        if (entry.value !== void 0 && (opts.staleMaxAge || 0) >= 0 && opts.swr === false) {
          entry.value = void 0;
          entry.integrity = void 0;
          entry.mtime = void 0;
          entry.expires = void 0;
        }
        pending[key] = Promise.resolve(resolver());
      }
      try {
        entry.value = await pending[key];
      } catch (error) {
        if (!isPending) {
          delete pending[key];
        }
        throw error;
      }
      if (!isPending) {
        entry.mtime = Date.now();
        entry.integrity = integrity;
        delete pending[key];
        if (validate(entry) !== false) {
          let setOpts;
          if (opts.maxAge && !opts.swr) {
            setOpts = { ttl: opts.maxAge };
          }
          const promise = useStorage().setItem(cacheKey, entry, setOpts).catch((error) => {
            console.error(`[cache] Cache write error.`, error);
            useNitroApp().captureError(error, { event, tags: ["cache"] });
          });
          if (event?.waitUntil) {
            event.waitUntil(promise);
          }
        }
      }
    };
    const _resolvePromise = expired ? _resolve() : Promise.resolve();
    if (entry.value === void 0) {
      await _resolvePromise;
    } else if (expired && event && event.waitUntil) {
      event.waitUntil(_resolvePromise);
    }
    if (opts.swr && validate(entry) !== false) {
      _resolvePromise.catch((error) => {
        console.error(`[cache] SWR handler error.`, error);
        useNitroApp().captureError(error, { event, tags: ["cache"] });
      });
      return entry;
    }
    return _resolvePromise.then(() => entry);
  }
  return async (...args) => {
    const shouldBypassCache = await opts.shouldBypassCache?.(...args);
    if (shouldBypassCache) {
      return fn(...args);
    }
    const key = await (opts.getKey || getKey)(...args);
    const shouldInvalidateCache = await opts.shouldInvalidateCache?.(...args);
    const entry = await get(
      key,
      () => fn(...args),
      shouldInvalidateCache,
      args[0] && isEvent(args[0]) ? args[0] : void 0
    );
    let value = entry.value;
    if (opts.transform) {
      value = await opts.transform(entry, ...args) || value;
    }
    return value;
  };
}
function cachedFunction(fn, opts = {}) {
  return defineCachedFunction(fn, opts);
}
function getKey(...args) {
  return args.length > 0 ? hash(args) : "";
}
function escapeKey(key) {
  return String(key).replace(/\W/g, "");
}
function defineCachedEventHandler(handler, opts = defaultCacheOptions()) {
  const variableHeaderNames = (opts.varies || []).filter(Boolean).map((h) => h.toLowerCase()).sort();
  const _opts = {
    ...opts,
    getKey: async (event) => {
      const customKey = await opts.getKey?.(event);
      if (customKey) {
        return escapeKey(customKey);
      }
      const _path = event.node.req.originalUrl || event.node.req.url || event.path;
      let _pathname;
      try {
        _pathname = escapeKey(decodeURI(parseURL(_path).pathname)).slice(0, 16) || "index";
      } catch {
        _pathname = "-";
      }
      const _hashedPath = `${_pathname}.${hash(_path)}`;
      const _headers = variableHeaderNames.map((header) => [header, event.node.req.headers[header]]).map(([name, value]) => `${escapeKey(name)}.${hash(value)}`);
      return [_hashedPath, ..._headers].join(":");
    },
    validate: (entry) => {
      if (!entry.value) {
        return false;
      }
      if (entry.value.code >= 400) {
        return false;
      }
      if (entry.value.body === void 0) {
        return false;
      }
      if (entry.value.headers.etag === "undefined" || entry.value.headers["last-modified"] === "undefined") {
        return false;
      }
      return true;
    },
    group: opts.group || "nitro/handlers",
    integrity: opts.integrity || hash([handler, opts])
  };
  const _cachedHandler = cachedFunction(
    async (incomingEvent) => {
      const variableHeaders = {};
      for (const header of variableHeaderNames) {
        const value = incomingEvent.node.req.headers[header];
        if (value !== void 0) {
          variableHeaders[header] = value;
        }
      }
      const reqProxy = cloneWithProxy(incomingEvent.node.req, {
        headers: variableHeaders
      });
      const resHeaders = {};
      let _resSendBody;
      const resProxy = cloneWithProxy(incomingEvent.node.res, {
        statusCode: 200,
        writableEnded: false,
        writableFinished: false,
        headersSent: false,
        closed: false,
        getHeader(name) {
          return resHeaders[name];
        },
        setHeader(name, value) {
          resHeaders[name] = value;
          return this;
        },
        getHeaderNames() {
          return Object.keys(resHeaders);
        },
        hasHeader(name) {
          return name in resHeaders;
        },
        removeHeader(name) {
          delete resHeaders[name];
        },
        getHeaders() {
          return resHeaders;
        },
        end(chunk, arg2, arg3) {
          if (typeof chunk === "string") {
            _resSendBody = chunk;
          }
          if (typeof arg2 === "function") {
            arg2();
          }
          if (typeof arg3 === "function") {
            arg3();
          }
          return this;
        },
        write(chunk, arg2, arg3) {
          if (typeof chunk === "string") {
            _resSendBody = chunk;
          }
          if (typeof arg2 === "function") {
            arg2(void 0);
          }
          if (typeof arg3 === "function") {
            arg3();
          }
          return true;
        },
        writeHead(statusCode, headers2) {
          this.statusCode = statusCode;
          if (headers2) {
            if (Array.isArray(headers2) || typeof headers2 === "string") {
              throw new TypeError("Raw headers  is not supported.");
            }
            for (const header in headers2) {
              const value = headers2[header];
              if (value !== void 0) {
                this.setHeader(
                  header,
                  value
                );
              }
            }
          }
          return this;
        }
      });
      const event = createEvent(reqProxy, resProxy);
      event.fetch = (url, fetchOptions) => fetchWithEvent(event, url, fetchOptions, {
        fetch: useNitroApp().localFetch
      });
      event.$fetch = (url, fetchOptions) => fetchWithEvent(event, url, fetchOptions, {
        fetch: globalThis.$fetch
      });
      event.waitUntil = incomingEvent.waitUntil;
      event.context = incomingEvent.context;
      event.context.cache = {
        options: _opts
      };
      const body = await handler(event) || _resSendBody;
      const headers = event.node.res.getHeaders();
      headers.etag = String(
        headers.Etag || headers.etag || `W/"${hash(body)}"`
      );
      headers["last-modified"] = String(
        headers["Last-Modified"] || headers["last-modified"] || (/* @__PURE__ */ new Date()).toUTCString()
      );
      const cacheControl = [];
      if (opts.swr) {
        if (opts.maxAge) {
          cacheControl.push(`s-maxage=${opts.maxAge}`);
        }
        if (opts.staleMaxAge) {
          cacheControl.push(`stale-while-revalidate=${opts.staleMaxAge}`);
        } else {
          cacheControl.push("stale-while-revalidate");
        }
      } else if (opts.maxAge) {
        cacheControl.push(`max-age=${opts.maxAge}`);
      }
      if (cacheControl.length > 0) {
        headers["cache-control"] = cacheControl.join(", ");
      }
      const cacheEntry = {
        code: event.node.res.statusCode,
        headers,
        body
      };
      return cacheEntry;
    },
    _opts
  );
  return defineEventHandler(async (event) => {
    if (opts.headersOnly) {
      if (handleCacheHeaders(event, { maxAge: opts.maxAge })) {
        return;
      }
      return handler(event);
    }
    const response = await _cachedHandler(
      event
    );
    if (event.node.res.headersSent || event.node.res.writableEnded) {
      return response.body;
    }
    if (handleCacheHeaders(event, {
      modifiedTime: new Date(response.headers["last-modified"]),
      etag: response.headers.etag,
      maxAge: opts.maxAge
    })) {
      return;
    }
    event.node.res.statusCode = response.code;
    for (const name in response.headers) {
      const value = response.headers[name];
      if (name === "set-cookie") {
        event.node.res.appendHeader(
          name,
          splitCookiesString(value)
        );
      } else {
        if (value !== void 0) {
          event.node.res.setHeader(name, value);
        }
      }
    }
    return response.body;
  });
}
function cloneWithProxy(obj, overrides) {
  return new Proxy(obj, {
    get(target, property, receiver) {
      if (property in overrides) {
        return overrides[property];
      }
      return Reflect.get(target, property, receiver);
    },
    set(target, property, value, receiver) {
      if (property in overrides) {
        overrides[property] = value;
        return true;
      }
      return Reflect.set(target, property, value, receiver);
    }
  });
}
const cachedEventHandler = defineCachedEventHandler;

function klona(x) {
	if (typeof x !== 'object') return x;

	var k, tmp, str=Object.prototype.toString.call(x);

	if (str === '[object Object]') {
		if (x.constructor !== Object && typeof x.constructor === 'function') {
			tmp = new x.constructor();
			for (k in x) {
				if (x.hasOwnProperty(k) && tmp[k] !== x[k]) {
					tmp[k] = klona(x[k]);
				}
			}
		} else {
			tmp = {}; // null
			for (k in x) {
				if (k === '__proto__') {
					Object.defineProperty(tmp, k, {
						value: klona(x[k]),
						configurable: true,
						enumerable: true,
						writable: true,
					});
				} else {
					tmp[k] = klona(x[k]);
				}
			}
		}
		return tmp;
	}

	if (str === '[object Array]') {
		k = x.length;
		for (tmp=Array(k); k--;) {
			tmp[k] = klona(x[k]);
		}
		return tmp;
	}

	if (str === '[object Set]') {
		tmp = new Set;
		x.forEach(function (val) {
			tmp.add(klona(val));
		});
		return tmp;
	}

	if (str === '[object Map]') {
		tmp = new Map;
		x.forEach(function (val, key) {
			tmp.set(klona(key), klona(val));
		});
		return tmp;
	}

	if (str === '[object Date]') {
		return new Date(+x);
	}

	if (str === '[object RegExp]') {
		tmp = new RegExp(x.source, x.flags);
		tmp.lastIndex = x.lastIndex;
		return tmp;
	}

	if (str === '[object DataView]') {
		return new x.constructor( klona(x.buffer) );
	}

	if (str === '[object ArrayBuffer]') {
		return x.slice(0);
	}

	// ArrayBuffer.isView(x)
	// ~> `new` bcuz `Buffer.slice` => ref
	if (str.slice(-6) === 'Array]') {
		return new x.constructor(x);
	}

	return x;
}

const inlineAppConfig = {
  "nuxt": {}
};



const appConfig = defuFn(inlineAppConfig);

const NUMBER_CHAR_RE = /\d/;
const STR_SPLITTERS = ["-", "_", "/", "."];
function isUppercase(char = "") {
  if (NUMBER_CHAR_RE.test(char)) {
    return void 0;
  }
  return char !== char.toLowerCase();
}
function splitByCase(str, separators) {
  const splitters = STR_SPLITTERS;
  const parts = [];
  if (!str || typeof str !== "string") {
    return parts;
  }
  let buff = "";
  let previousUpper;
  let previousSplitter;
  for (const char of str) {
    const isSplitter = splitters.includes(char);
    if (isSplitter === true) {
      parts.push(buff);
      buff = "";
      previousUpper = void 0;
      continue;
    }
    const isUpper = isUppercase(char);
    if (previousSplitter === false) {
      if (previousUpper === false && isUpper === true) {
        parts.push(buff);
        buff = char;
        previousUpper = isUpper;
        continue;
      }
      if (previousUpper === true && isUpper === false && buff.length > 1) {
        const lastChar = buff.at(-1);
        parts.push(buff.slice(0, Math.max(0, buff.length - 1)));
        buff = lastChar + char;
        previousUpper = isUpper;
        continue;
      }
    }
    buff += char;
    previousUpper = isUpper;
    previousSplitter = isSplitter;
  }
  parts.push(buff);
  return parts;
}
function kebabCase(str, joiner) {
  return str ? (Array.isArray(str) ? str : splitByCase(str)).map((p) => p.toLowerCase()).join(joiner) : "";
}
function snakeCase(str) {
  return kebabCase(str || "", "_");
}

function getEnv(key, opts) {
  const envKey = snakeCase(key).toUpperCase();
  return destr(
    process.env[opts.prefix + envKey] ?? process.env[opts.altPrefix + envKey]
  );
}
function _isObject(input) {
  return typeof input === "object" && !Array.isArray(input);
}
function applyEnv(obj, opts, parentKey = "") {
  for (const key in obj) {
    const subKey = parentKey ? `${parentKey}_${key}` : key;
    const envValue = getEnv(subKey, opts);
    if (_isObject(obj[key])) {
      if (_isObject(envValue)) {
        obj[key] = { ...obj[key], ...envValue };
        applyEnv(obj[key], opts, subKey);
      } else if (envValue === void 0) {
        applyEnv(obj[key], opts, subKey);
      } else {
        obj[key] = envValue ?? obj[key];
      }
    } else {
      obj[key] = envValue ?? obj[key];
    }
    if (opts.envExpansion && typeof obj[key] === "string") {
      obj[key] = _expandFromEnv(obj[key]);
    }
  }
  return obj;
}
const envExpandRx = /\{\{([^{}]*)\}\}/g;
function _expandFromEnv(value) {
  return value.replace(envExpandRx, (match, key) => {
    return process.env[key] || match;
  });
}

const _inlineRuntimeConfig = {
  "app": {
    "baseURL": "/",
    "buildId": "3a292c5a-cf76-43fa-ae55-64f40001c158",
    "buildAssetsDir": "/_nuxt/",
    "cdnURL": ""
  },
  "nitro": {
    "envPrefix": "NUXT_",
    "routeRules": {
      "/__nuxt_error": {
        "cache": false
      },
      "/__sitemap__/style.xsl": {
        "headers": {
          "Content-Type": "application/xslt+xml"
        }
      },
      "/sitemap.xml": {},
      "/_nuxt": {
        "robots": "noindex",
        "headers": {
          "X-Robots-Tag": "noindex"
        }
      },
      "/_nuxt/**": {
        "headers": {
          "cache-control": "public, max-age=31536000, immutable",
          "X-Robots-Tag": "noindex"
        },
        "robots": "noindex"
      },
      "/_nuxt/builds/meta/**": {
        "headers": {
          "cache-control": "public, max-age=31536000, immutable"
        }
      },
      "/_nuxt/builds/**": {
        "headers": {
          "cache-control": "public, max-age=1, immutable"
        }
      }
    }
  },
  "public": {
    "gtag": {
      "enabled": true,
      "initMode": "auto",
      "id": "G-YMC3DKW82S",
      "initCommands": [],
      "config": {},
      "tags": [],
      "loadingStrategy": "defer",
      "url": "https://www.googletagmanager.com/gtag/js"
    },
    "nuxt-robots": {
      "version": "5.7.1",
      "isNuxtContentV2": false,
      "debug": false,
      "credits": true,
      "groups": [
        {
          "comment": [],
          "disallow": [
            "/auth/",
            "/app/",
            "/_payload.json",
            "/*?*",
            "/*&*"
          ],
          "allow": [],
          "userAgent": [
            "*"
          ],
          "contentUsage": [],
          "contentSignal": [],
          "_indexable": true,
          "_rules": [
            {
              "pattern": "/auth/",
              "allow": false
            },
            {
              "pattern": "/app/",
              "allow": false
            },
            {
              "pattern": "/_payload.json",
              "allow": false
            },
            {
              "pattern": "/*?*",
              "allow": false
            },
            {
              "pattern": "/*&*",
              "allow": false
            }
          ],
          "_normalized": true
        }
      ],
      "sitemap": [
        "https://boursefret.netlify.app/sitemap.xml",
        "/sitemap.xml"
      ],
      "header": true,
      "robotsEnabledValue": "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
      "robotsDisabledValue": "noindex, nofollow",
      "cacheControl": "max-age=14400, must-revalidate",
      "botDetection": true,
      "pageMetaRobots": {}
    }
  },
  "apiBaseUrl": "",
  "tokenEncryptionKey": "",
  "sitemap": {
    "isI18nMapped": false,
    "sitemapName": "sitemap.xml",
    "isMultiSitemap": false,
    "excludeAppSources": [],
    "cacheMaxAgeSeconds": 600,
    "autoLastmod": false,
    "defaultSitemapsChunkSize": 1000,
    "minify": false,
    "sortEntries": true,
    "debug": false,
    "discoverImages": true,
    "discoverVideos": true,
    "sitemapsPathPrefix": "/__sitemap__/",
    "isNuxtContentDocumentDriven": false,
    "xsl": "/__sitemap__/style.xsl",
    "xslTips": true,
    "xslColumns": [
      {
        "label": "URL",
        "width": "50%"
      },
      {
        "label": "Last Modified",
        "select": "sitemap:lastmod",
        "width": "25%"
      },
      {
        "label": "Priority",
        "select": "sitemap:priority",
        "width": "12.5%"
      },
      {
        "label": "Change Frequency",
        "select": "sitemap:changefreq",
        "width": "12.5%"
      },
      {
        "label": "Hreflangs",
        "select": "count(xhtml:link)",
        "width": "25%"
      }
    ],
    "credits": true,
    "version": "7.5.1",
    "sitemaps": {
      "sitemap.xml": {
        "sitemapName": "sitemap.xml",
        "route": "sitemap.xml",
        "defaults": {},
        "include": [],
        "exclude": [
          "/_**",
          "/_nuxt/**"
        ],
        "includeAppSources": true
      }
    }
  },
  "nuxt-site-config": {
    "stack": [
      {
        "_context": "system",
        "_priority": -15,
        "name": "fret",
        "env": "production"
      },
      {
        "_context": "package.json",
        "_priority": -10,
        "name": "fret"
      }
    ],
    "version": "3.2.21",
    "debug": false,
    "multiTenancy": []
  },
  "nuxt-robots": {
    "version": "5.7.1",
    "isNuxtContentV2": false,
    "debug": false,
    "credits": true,
    "groups": [
      {
        "comment": [],
        "disallow": [
          "/auth/",
          "/app/",
          "/_payload.json",
          "/*?*",
          "/*&*"
        ],
        "allow": [],
        "userAgent": [
          "*"
        ],
        "contentUsage": [],
        "contentSignal": [],
        "_indexable": true,
        "_rules": [
          {
            "pattern": "/auth/",
            "allow": false
          },
          {
            "pattern": "/app/",
            "allow": false
          },
          {
            "pattern": "/_payload.json",
            "allow": false
          },
          {
            "pattern": "/*?*",
            "allow": false
          },
          {
            "pattern": "/*&*",
            "allow": false
          }
        ],
        "_normalized": true
      }
    ],
    "sitemap": [
      "https://boursefret.netlify.app/sitemap.xml",
      "/sitemap.xml"
    ],
    "header": true,
    "robotsEnabledValue": "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
    "robotsDisabledValue": "noindex, nofollow",
    "cacheControl": "max-age=14400, must-revalidate",
    "botDetection": true,
    "pageMetaRobots": {}
  }
};
const envOptions = {
  prefix: "NITRO_",
  altPrefix: _inlineRuntimeConfig.nitro.envPrefix ?? process.env.NITRO_ENV_PREFIX ?? "_",
  envExpansion: _inlineRuntimeConfig.nitro.envExpansion ?? process.env.NITRO_ENV_EXPANSION ?? false
};
const _sharedRuntimeConfig = _deepFreeze(
  applyEnv(klona(_inlineRuntimeConfig), envOptions)
);
function useRuntimeConfig(event) {
  if (!event) {
    return _sharedRuntimeConfig;
  }
  if (event.context.nitro.runtimeConfig) {
    return event.context.nitro.runtimeConfig;
  }
  const runtimeConfig = klona(_inlineRuntimeConfig);
  applyEnv(runtimeConfig, envOptions);
  event.context.nitro.runtimeConfig = runtimeConfig;
  return runtimeConfig;
}
_deepFreeze(klona(appConfig));
function _deepFreeze(object) {
  const propNames = Object.getOwnPropertyNames(object);
  for (const name of propNames) {
    const value = object[name];
    if (value && typeof value === "object") {
      _deepFreeze(value);
    }
  }
  return Object.freeze(object);
}
new Proxy(/* @__PURE__ */ Object.create(null), {
  get: (_, prop) => {
    console.warn(
      "Please use `useRuntimeConfig()` instead of accessing config directly."
    );
    const runtimeConfig = useRuntimeConfig();
    if (prop in runtimeConfig) {
      return runtimeConfig[prop];
    }
    return void 0;
  }
});

function createContext(opts = {}) {
  let currentInstance;
  let isSingleton = false;
  const checkConflict = (instance) => {
    if (currentInstance && currentInstance !== instance) {
      throw new Error("Context conflict");
    }
  };
  let als;
  if (opts.asyncContext) {
    const _AsyncLocalStorage = opts.AsyncLocalStorage || globalThis.AsyncLocalStorage;
    if (_AsyncLocalStorage) {
      als = new _AsyncLocalStorage();
    } else {
      console.warn("[unctx] `AsyncLocalStorage` is not provided.");
    }
  }
  const _getCurrentInstance = () => {
    if (als) {
      const instance = als.getStore();
      if (instance !== void 0) {
        return instance;
      }
    }
    return currentInstance;
  };
  return {
    use: () => {
      const _instance = _getCurrentInstance();
      if (_instance === void 0) {
        throw new Error("Context is not available");
      }
      return _instance;
    },
    tryUse: () => {
      return _getCurrentInstance();
    },
    set: (instance, replace) => {
      if (!replace) {
        checkConflict(instance);
      }
      currentInstance = instance;
      isSingleton = true;
    },
    unset: () => {
      currentInstance = void 0;
      isSingleton = false;
    },
    call: (instance, callback) => {
      checkConflict(instance);
      currentInstance = instance;
      try {
        return als ? als.run(instance, callback) : callback();
      } finally {
        if (!isSingleton) {
          currentInstance = void 0;
        }
      }
    },
    async callAsync(instance, callback) {
      currentInstance = instance;
      const onRestore = () => {
        currentInstance = instance;
      };
      const onLeave = () => currentInstance === instance ? onRestore : void 0;
      asyncHandlers.add(onLeave);
      try {
        const r = als ? als.run(instance, callback) : callback();
        if (!isSingleton) {
          currentInstance = void 0;
        }
        return await r;
      } finally {
        asyncHandlers.delete(onLeave);
      }
    }
  };
}
function createNamespace(defaultOpts = {}) {
  const contexts = {};
  return {
    get(key, opts = {}) {
      if (!contexts[key]) {
        contexts[key] = createContext({ ...defaultOpts, ...opts });
      }
      return contexts[key];
    }
  };
}
const _globalThis = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof global !== "undefined" ? global : {};
const globalKey = "__unctx__";
const defaultNamespace = _globalThis[globalKey] || (_globalThis[globalKey] = createNamespace());
const getContext = (key, opts = {}) => defaultNamespace.get(key, opts);
const asyncHandlersKey = "__unctx_async_handlers__";
const asyncHandlers = _globalThis[asyncHandlersKey] || (_globalThis[asyncHandlersKey] = /* @__PURE__ */ new Set());

getContext("nitro-app", {
  asyncContext: false,
  AsyncLocalStorage: void 0
});

function isPathInScope(pathname, base) {
  let canonical;
  try {
    const pre = pathname.replace(/%2f/gi, "/").replace(/%5c/gi, "\\");
    canonical = new URL(pre, "http://_").pathname;
  } catch {
    return false;
  }
  return !base || canonical === base || canonical.startsWith(base + "/");
}

const config = useRuntimeConfig();
const _routeRulesMatcher = toRouteMatcher(
  createRouter$1({ routes: config.nitro.routeRules })
);
function createRouteRulesHandler(ctx) {
  return eventHandler((event) => {
    const routeRules = getRouteRules(event);
    if (routeRules.headers) {
      setHeaders(event, routeRules.headers);
    }
    if (routeRules.redirect) {
      let target = routeRules.redirect.to;
      if (target.endsWith("/**")) {
        let targetPath = event.path;
        const strpBase = routeRules.redirect._redirectStripBase;
        if (strpBase) {
          if (!isPathInScope(event.path.split("?")[0], strpBase)) {
            throw createError$1({ statusCode: 400 });
          }
          targetPath = withoutBase(targetPath, strpBase);
        } else if (targetPath.startsWith("//")) {
          targetPath = targetPath.replace(/^\/+/, "/");
        }
        target = joinURL(target.slice(0, -3), targetPath);
      } else if (event.path.includes("?")) {
        const query = getQuery$1(event.path);
        target = withQuery(target, query);
      }
      return sendRedirect(event, target, routeRules.redirect.statusCode);
    }
    if (routeRules.proxy) {
      let target = routeRules.proxy.to;
      if (target.endsWith("/**")) {
        let targetPath = event.path;
        const strpBase = routeRules.proxy._proxyStripBase;
        if (strpBase) {
          if (!isPathInScope(event.path.split("?")[0], strpBase)) {
            throw createError$1({ statusCode: 400 });
          }
          targetPath = withoutBase(targetPath, strpBase);
        } else if (targetPath.startsWith("//")) {
          targetPath = targetPath.replace(/^\/+/, "/");
        }
        target = joinURL(target.slice(0, -3), targetPath);
      } else if (event.path.includes("?")) {
        const query = getQuery$1(event.path);
        target = withQuery(target, query);
      }
      return proxyRequest(event, target, {
        fetch: ctx.localFetch,
        ...routeRules.proxy
      });
    }
  });
}
function getRouteRules(event) {
  event.context._nitro = event.context._nitro || {};
  if (!event.context._nitro.routeRules) {
    event.context._nitro.routeRules = getRouteRulesForPath(
      withoutBase(event.path.split("?")[0], useRuntimeConfig().app.baseURL)
    );
  }
  return event.context._nitro.routeRules;
}
function getRouteRulesForPath(path) {
  return defu({}, ..._routeRulesMatcher.matchAll(path).reverse());
}

function _captureError(error, type) {
  console.error(`[${type}]`, error);
  useNitroApp().captureError(error, { tags: [type] });
}
function trapUnhandledNodeErrors() {
  process.on(
    "unhandledRejection",
    (error) => _captureError(error, "unhandledRejection")
  );
  process.on(
    "uncaughtException",
    (error) => _captureError(error, "uncaughtException")
  );
}
function joinHeaders(value) {
  return Array.isArray(value) ? value.join(", ") : String(value);
}
function normalizeFetchResponse(response) {
  if (!response.headers.has("set-cookie")) {
    return response;
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: normalizeCookieHeaders(response.headers)
  });
}
function normalizeCookieHeader(header = "") {
  return splitCookiesString(joinHeaders(header));
}
function normalizeCookieHeaders(headers) {
  const outgoingHeaders = new Headers();
  for (const [name, header] of headers) {
    if (name === "set-cookie") {
      for (const cookie of normalizeCookieHeader(header)) {
        outgoingHeaders.append("set-cookie", cookie);
      }
    } else {
      outgoingHeaders.set(name, joinHeaders(header));
    }
  }
  return outgoingHeaders;
}

function isJsonRequest(event) {
  if (hasReqHeader(event, "accept", "text/html")) {
    return false;
  }
  return hasReqHeader(event, "accept", "application/json") || hasReqHeader(event, "user-agent", "curl/") || hasReqHeader(event, "user-agent", "httpie/") || hasReqHeader(event, "sec-fetch-mode", "cors") || event.path.startsWith("/api/") || event.path.endsWith(".json");
}
function hasReqHeader(event, name, includes) {
  const value = getRequestHeader(event, name);
  return value && typeof value === "string" && value.toLowerCase().includes(includes);
}

const errorHandler$0 = (async function errorhandler(error, event, { defaultHandler }) {
  if (event.handled || isJsonRequest(event)) {
    return;
  }
  const defaultRes = await defaultHandler(error, event, { json: true });
  const statusCode = error.statusCode || 500;
  if (statusCode === 404 && defaultRes.status === 302) {
    setResponseHeaders(event, defaultRes.headers);
    setResponseStatus(event, defaultRes.status, defaultRes.statusText);
    return send(event, JSON.stringify(defaultRes.body, null, 2));
  }
  const errorObject = defaultRes.body;
  const url = new URL(errorObject.url);
  errorObject.url = withoutBase(url.pathname, useRuntimeConfig(event).app.baseURL) + url.search + url.hash;
  errorObject.message ||= "Server Error";
  errorObject.data ||= error.data;
  errorObject.statusMessage ||= error.statusMessage;
  delete defaultRes.headers["content-type"];
  delete defaultRes.headers["content-security-policy"];
  setResponseHeaders(event, defaultRes.headers);
  const reqHeaders = getRequestHeaders(event);
  const isRenderingError = event.path.startsWith("/__nuxt_error") || !!reqHeaders["x-nuxt-error"];
  const res = isRenderingError ? null : await useNitroApp().localFetch(
    withQuery(joinURL(useRuntimeConfig(event).app.baseURL, "/__nuxt_error"), errorObject),
    {
      headers: { ...reqHeaders, "x-nuxt-error": "true" },
      redirect: "manual"
    }
  ).catch(() => null);
  if (event.handled) {
    return;
  }
  if (!res) {
    const { template } = await import('../_/error-500.mjs');
    setResponseHeader(event, "Content-Type", "text/html;charset=UTF-8");
    return send(event, template(errorObject));
  }
  const html = await res.text();
  for (const [header, value] of res.headers.entries()) {
    if (header === "set-cookie") {
      appendResponseHeader(event, header, value);
      continue;
    }
    setResponseHeader(event, header, value);
  }
  setResponseStatus(event, res.status && res.status !== 200 ? res.status : defaultRes.status, res.statusText || defaultRes.statusText);
  return send(event, html);
});

function defineNitroErrorHandler(handler) {
  return handler;
}

const errorHandler$1 = defineNitroErrorHandler(
  function defaultNitroErrorHandler(error, event) {
    const res = defaultHandler(error, event);
    setResponseHeaders(event, res.headers);
    setResponseStatus(event, res.status, res.statusText);
    return send(event, JSON.stringify(res.body, null, 2));
  }
);
function defaultHandler(error, event, opts) {
  const isSensitive = error.unhandled || error.fatal;
  const statusCode = error.statusCode || 500;
  const statusMessage = error.statusMessage || "Server Error";
  const url = getRequestURL(event, { xForwardedHost: true, xForwardedProto: true });
  if (statusCode === 404) {
    const baseURL = "/";
    if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) {
      const redirectTo = `${baseURL}${url.pathname.slice(1)}${url.search}`;
      return {
        status: 302,
        statusText: "Found",
        headers: { location: redirectTo },
        body: `Redirecting...`
      };
    }
  }
  if (isSensitive && !opts?.silent) {
    const tags = [error.unhandled && "[unhandled]", error.fatal && "[fatal]"].filter(Boolean).join(" ");
    console.error(`[request error] ${tags} [${event.method}] ${url}
`, error);
  }
  const headers = {
    "content-type": "application/json",
    // Prevent browser from guessing the MIME types of resources.
    "x-content-type-options": "nosniff",
    // Prevent error page from being embedded in an iframe
    "x-frame-options": "DENY",
    // Prevent browsers from sending the Referer header
    "referrer-policy": "no-referrer",
    // Disable the execution of any js
    "content-security-policy": "script-src 'none'; frame-ancestors 'none';"
  };
  setResponseStatus(event, statusCode, statusMessage);
  if (statusCode === 404 || !getResponseHeader(event, "cache-control")) {
    headers["cache-control"] = "no-cache";
  }
  const body = {
    error: true,
    url: url.href,
    statusCode,
    statusMessage,
    message: isSensitive ? "Server Error" : error.message,
    data: isSensitive ? void 0 : error.data
  };
  return {
    status: statusCode,
    statusText: statusMessage,
    headers,
    body
  };
}

const errorHandlers = [errorHandler$0, errorHandler$1];

async function errorHandler(error, event) {
  for (const handler of errorHandlers) {
    try {
      await handler(error, event, { defaultHandler });
      if (event.handled) {
        return; // Response handled
      }
    } catch(error) {
      // Handler itself thrown, log and continue
      console.error(error);
    }
  }
  // H3 will handle fallback
}

const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_$";
const unsafeChars = /[<>\b\f\n\r\t\0\u2028\u2029]/g;
const reserved = /^(?:do|if|in|for|int|let|new|try|var|byte|case|char|else|enum|goto|long|this|void|with|await|break|catch|class|const|final|float|short|super|throw|while|yield|delete|double|export|import|native|return|switch|throws|typeof|boolean|default|extends|finally|package|private|abstract|continue|debugger|function|volatile|interface|protected|transient|implements|instanceof|synchronized)$/;
const escaped = {
  "<": "\\u003C",
  ">": "\\u003E",
  "/": "\\u002F",
  "\\": "\\\\",
  "\b": "\\b",
  "\f": "\\f",
  "\n": "\\n",
  "\r": "\\r",
  "	": "\\t",
  "\0": "\\0",
  "\u2028": "\\u2028",
  "\u2029": "\\u2029"
};
const objectProtoOwnPropertyNames = Object.getOwnPropertyNames(Object.prototype).sort().join("\0");
function devalue(value) {
  const counts = /* @__PURE__ */ new Map();
  let logNum = 0;
  function log(message) {
    if (logNum < 100) {
      console.warn(message);
      logNum += 1;
    }
  }
  function walk(thing) {
    if (typeof thing === "function") {
      log(`Cannot stringify a function ${thing.name}`);
      return;
    }
    if (counts.has(thing)) {
      counts.set(thing, counts.get(thing) + 1);
      return;
    }
    counts.set(thing, 1);
    if (!isPrimitive(thing)) {
      const type = getType(thing);
      switch (type) {
        case "Number":
        case "String":
        case "Boolean":
        case "Date":
        case "RegExp":
          return;
        case "Array":
          thing.forEach(walk);
          break;
        case "Set":
        case "Map":
          Array.from(thing).forEach(walk);
          break;
        default:
          const proto = Object.getPrototypeOf(thing);
          if (proto !== Object.prototype && proto !== null && Object.getOwnPropertyNames(proto).sort().join("\0") !== objectProtoOwnPropertyNames) {
            if (typeof thing.toJSON !== "function") {
              log(`Cannot stringify arbitrary non-POJOs ${thing.constructor.name}`);
            }
          } else if (Object.getOwnPropertySymbols(thing).length > 0) {
            log(`Cannot stringify POJOs with symbolic keys ${Object.getOwnPropertySymbols(thing).map((symbol) => symbol.toString())}`);
          } else {
            Object.keys(thing).forEach((key) => walk(thing[key]));
          }
      }
    }
  }
  walk(value);
  const names = /* @__PURE__ */ new Map();
  Array.from(counts).filter((entry) => entry[1] > 1).sort((a, b) => b[1] - a[1]).forEach((entry, i) => {
    names.set(entry[0], getName(i));
  });
  function stringify(thing) {
    if (names.has(thing)) {
      return names.get(thing);
    }
    if (isPrimitive(thing)) {
      return stringifyPrimitive(thing);
    }
    const type = getType(thing);
    switch (type) {
      case "Number":
      case "String":
      case "Boolean":
        return `Object(${stringify(thing.valueOf())})`;
      case "RegExp":
        return thing.toString();
      case "Date":
        return `new Date(${thing.getTime()})`;
      case "Array":
        const members = thing.map((v, i) => i in thing ? stringify(v) : "");
        const tail = thing.length === 0 || thing.length - 1 in thing ? "" : ",";
        return `[${members.join(",")}${tail}]`;
      case "Set":
      case "Map":
        return `new ${type}([${Array.from(thing).map(stringify).join(",")}])`;
      default:
        if (thing.toJSON) {
          let json = thing.toJSON();
          if (getType(json) === "String") {
            try {
              json = JSON.parse(json);
            } catch (e) {
            }
          }
          return stringify(json);
        }
        if (Object.getPrototypeOf(thing) === null) {
          if (Object.keys(thing).length === 0) {
            return "Object.create(null)";
          }
          return `Object.create(null,{${Object.keys(thing).map((key) => `${safeKey(key)}:{writable:true,enumerable:true,value:${stringify(thing[key])}}`).join(",")}})`;
        }
        return `{${Object.keys(thing).map((key) => `${safeKey(key)}:${stringify(thing[key])}`).join(",")}}`;
    }
  }
  const str = stringify(value);
  if (names.size) {
    const params = [];
    const statements = [];
    const values = [];
    names.forEach((name, thing) => {
      params.push(name);
      if (isPrimitive(thing)) {
        values.push(stringifyPrimitive(thing));
        return;
      }
      const type = getType(thing);
      switch (type) {
        case "Number":
        case "String":
        case "Boolean":
          values.push(`Object(${stringify(thing.valueOf())})`);
          break;
        case "RegExp":
          values.push(thing.toString());
          break;
        case "Date":
          values.push(`new Date(${thing.getTime()})`);
          break;
        case "Array":
          values.push(`Array(${thing.length})`);
          thing.forEach((v, i) => {
            statements.push(`${name}[${i}]=${stringify(v)}`);
          });
          break;
        case "Set":
          values.push("new Set");
          statements.push(`${name}.${Array.from(thing).map((v) => `add(${stringify(v)})`).join(".")}`);
          break;
        case "Map":
          values.push("new Map");
          statements.push(`${name}.${Array.from(thing).map(([k, v]) => `set(${stringify(k)}, ${stringify(v)})`).join(".")}`);
          break;
        default:
          values.push(Object.getPrototypeOf(thing) === null ? "Object.create(null)" : "{}");
          Object.keys(thing).forEach((key) => {
            statements.push(`${name}${safeProp(key)}=${stringify(thing[key])}`);
          });
      }
    });
    statements.push(`return ${str}`);
    return `(function(${params.join(",")}){${statements.join(";")}}(${values.join(",")}))`;
  } else {
    return str;
  }
}
function getName(num) {
  let name = "";
  do {
    name = chars[num % chars.length] + name;
    num = ~~(num / chars.length) - 1;
  } while (num >= 0);
  return reserved.test(name) ? `${name}0` : name;
}
function isPrimitive(thing) {
  return Object(thing) !== thing;
}
function stringifyPrimitive(thing) {
  if (typeof thing === "string") {
    return stringifyString(thing);
  }
  if (thing === void 0) {
    return "void 0";
  }
  if (thing === 0 && 1 / thing < 0) {
    return "-0";
  }
  const str = String(thing);
  if (typeof thing === "number") {
    return str.replace(/^(-)?0\./, "$1.");
  }
  return str;
}
function getType(thing) {
  return Object.prototype.toString.call(thing).slice(8, -1);
}
function escapeUnsafeChar(c) {
  return escaped[c] || c;
}
function escapeUnsafeChars(str) {
  return str.replace(unsafeChars, escapeUnsafeChar);
}
function safeKey(key) {
  return /^[_$a-zA-Z][_$a-zA-Z0-9]*$/.test(key) ? key : escapeUnsafeChars(JSON.stringify(key));
}
function safeProp(key) {
  return /^[_$a-zA-Z][_$a-zA-Z0-9]*$/.test(key) ? `.${key}` : `[${escapeUnsafeChars(JSON.stringify(key))}]`;
}
function stringifyString(str) {
  let result = '"';
  for (let i = 0; i < str.length; i += 1) {
    const char = str.charAt(i);
    const code = char.charCodeAt(0);
    if (char === '"') {
      result += '\\"';
    } else if (char in escaped) {
      result += escaped[char];
    } else if (code >= 55296 && code <= 57343) {
      const next = str.charCodeAt(i + 1);
      if (code <= 56319 && (next >= 56320 && next <= 57343)) {
        result += char + str[++i];
      } else {
        result += `\\u${code.toString(16).toUpperCase()}`;
      }
    } else {
      result += char;
    }
  }
  result += '"';
  return result;
}

function normalizeSiteConfig(config) {
  if (typeof config.indexable !== "undefined")
    config.indexable = String(config.indexable) !== "false";
  if (typeof config.trailingSlash !== "undefined" && !config.trailingSlash)
    config.trailingSlash = String(config.trailingSlash) !== "false";
  if (config.url && !hasProtocol(String(config.url), { acceptRelative: true, strict: false }))
    config.url = withHttps(String(config.url));
  const keys = Object.keys(config).sort((a, b) => a.localeCompare(b));
  const newConfig = {};
  for (const k of keys)
    newConfig[k] = config[k];
  return newConfig;
}
function createSiteConfigStack(options) {
  const debug = options?.debug || false;
  const stack = [];
  function push(input) {
    if (!input || typeof input !== "object" || Object.keys(input).length === 0) {
      return () => {
      };
    }
    if (!input._context && debug) {
      let lastFunctionName = new Error("tmp").stack?.split("\n")[2]?.split(" ")[5];
      if (lastFunctionName?.includes("/"))
        lastFunctionName = "anonymous";
      input._context = lastFunctionName;
    }
    const entry = {};
    for (const k in input) {
      const val = input[k];
      if (typeof val !== "undefined" && val !== "")
        entry[k] = val;
    }
    if (Object.keys(entry).filter((k) => !k.startsWith("_")).length === 0) {
      return () => {
      };
    }
    stack.push(entry);
    return () => {
      const idx = stack.indexOf(entry);
      if (idx !== -1)
        stack.splice(idx, 1);
    };
  }
  function get(options2) {
    const siteConfig = {};
    if (options2?.debug)
      siteConfig._context = {};
    siteConfig._priority = {};
    for (const o in stack.sort((a, b) => (a._priority || 0) - (b._priority || 0))) {
      for (const k in stack[o]) {
        const key = k;
        const val = options2?.resolveRefs ? toValue(stack[o][k]) : stack[o][k];
        if (!k.startsWith("_") && typeof val !== "undefined" && val !== "") {
          siteConfig[k] = val;
          if (typeof stack[o]._priority !== "undefined" && stack[o]._priority !== -1) {
            siteConfig._priority[key] = stack[o]._priority;
          }
          if (options2?.debug)
            siteConfig._context[key] = stack[o]._context?.[key] || stack[o]._context || "anonymous";
        }
      }
    }
    return options2?.skipNormalize ? siteConfig : normalizeSiteConfig(siteConfig);
  }
  return {
    stack,
    push,
    get
  };
}

function envSiteConfig(env = {}) {
  return Object.fromEntries(Object.entries(env).filter(([k]) => k.startsWith("NUXT_SITE_") || k.startsWith("NUXT_PUBLIC_SITE_")).map(([k, v]) => [
    k.replace(/^NUXT_(PUBLIC_)?SITE_/, "").split("_").map((s, i) => i === 0 ? s.toLowerCase() : s[0]?.toUpperCase() + s.slice(1).toLowerCase()).join(""),
    v
  ]));
}

function getSiteConfig(e, _options) {
  e.context.siteConfig = e.context.siteConfig || createSiteConfigStack();
  const options = defu(_options, useRuntimeConfig(e)["nuxt-site-config"], { debug: false });
  return e.context.siteConfig.get(options);
}

const _yUKPp5wEjHQ5OsLW04ZX62sUgnBPYsUjj865JFcbow0 = defineNitroPlugin(async (nitroApp) => {
  nitroApp.hooks.hook("render:html", async (ctx, { event }) => {
    getRouteRules(event);
    process.env.NUXT_COMPONENT_ISLANDS && event.path.startsWith("/__nuxt_island");
    event.path;
    {
      const siteConfig = Object.fromEntries(
        Object.entries(getSiteConfig(event)).map(([k, v]) => [k, toValue(v)])
      );
      ctx.body.push(`<script>window.__NUXT_SITE_CONFIG__=${devalue(siteConfig)}<\/script>`);
    }
  });
});

const KNOWN_SEARCH_BOTS = [
  {
    pattern: "googlebot",
    name: "googlebot",
    secondaryPatterns: ["google.com/bot.html"]
  },
  {
    pattern: "bingbot",
    name: "bingbot",
    secondaryPatterns: ["msnbot"]
  },
  {
    pattern: "yandexbot",
    name: "yandexbot"
  },
  {
    pattern: "baiduspider",
    name: "baiduspider",
    secondaryPatterns: ["baidu.com"]
  },
  {
    pattern: "duckduckbot",
    name: "duckduckbot",
    secondaryPatterns: ["duckduckgo.com"]
  },
  {
    pattern: "slurp",
    name: "yahoo"
  },
  {
    pattern: "applebot",
    name: "applebot",
    secondaryPatterns: ["apple.com/go/applebot"]
  }
];
const SOCIAL_BOTS = [
  {
    pattern: "twitterbot",
    name: "twitter",
    secondaryPatterns: ["twitter"]
  },
  {
    pattern: "facebookexternalhit",
    name: "facebook",
    secondaryPatterns: ["facebook.com"]
  },
  {
    pattern: "linkedinbot",
    name: "linkedin",
    secondaryPatterns: ["linkedin"]
  },
  {
    pattern: "pinterestbot",
    name: "pinterest",
    secondaryPatterns: ["pinterest"]
  },
  {
    pattern: "discordbot",
    name: "discord",
    secondaryPatterns: ["discordapp"]
  }
];
const SEO_BOTS = [
  {
    pattern: "mj12bot",
    name: "majestic12",
    secondaryPatterns: ["majestic12.co.uk/bot"]
  },
  {
    pattern: "ahrefsbot",
    name: "ahrefs",
    secondaryPatterns: ["ahrefs.com"]
  },
  {
    pattern: "semrushbot",
    name: "semrush",
    secondaryPatterns: ["semrush.com/bot"]
  },
  {
    pattern: "screaming frog",
    name: "screaming-frog",
    secondaryPatterns: ["screamingfrog.co.uk"]
  },
  {
    pattern: "rogerbot",
    name: "moz"
  }
];
const AI_BOTS = [
  {
    pattern: "anthropic",
    name: "anthropic"
  },
  {
    pattern: "claude",
    name: "claude"
  },
  {
    pattern: "gptbot",
    name: "gpt",
    secondaryPatterns: ["openai.com"]
  },
  {
    pattern: "google-extended",
    name: "google-extended"
  },
  {
    pattern: "applebot-extended",
    name: "applebot-extended"
  },
  {
    pattern: "bytespider",
    name: "bytespider"
  },
  {
    pattern: "diffbot",
    name: "diffbot"
  },
  {
    pattern: "googlebot-news",
    name: "google-news"
  },
  {
    pattern: "cohere",
    name: "cohere",
    secondaryPatterns: ["cohere.com"]
  },
  {
    pattern: "ccbot",
    name: "commoncrawl",
    secondaryPatterns: ["commoncrawl.org"]
  },
  {
    pattern: "perplexitybot",
    name: "perplexity",
    secondaryPatterns: ["perplexity.ai"]
  }
];
const HTTP_TOOL_BOTS = [
  {
    pattern: "python-requests",
    name: "requests",
    secondaryPatterns: ["python"]
  },
  {
    pattern: "wget",
    name: "wget"
  },
  {
    pattern: "curl",
    name: "curl",
    secondaryPatterns: ["curl"]
  }
];
const SECURITY_SCANNING_BOTS = [
  {
    pattern: "zgrab",
    name: "zgrab"
  },
  {
    pattern: "masscan",
    name: "masscan"
  },
  {
    pattern: "nmap",
    name: "nmap",
    secondaryPatterns: ["insecure.org"]
  },
  {
    pattern: "nikto",
    name: "nikto"
  },
  {
    pattern: "wpscan",
    name: "wpscan"
  }
];
const SCRAPING_BOTS = [
  {
    pattern: "scrapy",
    name: "scrapy",
    secondaryPatterns: ["scrapy.org"]
  }
];
const AUTOMATION_BOTS = [
  {
    pattern: "phantomjs",
    name: "phantomjs"
  },
  {
    pattern: "headless",
    name: "headless-browser"
  },
  {
    pattern: "playwright",
    name: "playwright"
  },
  {
    pattern: "selenium",
    name: "selenium",
    secondaryPatterns: ["webdriver"]
  },
  {
    pattern: "puppeteer",
    name: "puppeteer",
    secondaryPatterns: ["headless"]
  }
];
const GENERIC_BOTS = [
  {
    pattern: "bot",
    name: "generic-bot"
  },
  {
    pattern: "spider",
    name: "generic-spider"
  },
  {
    pattern: "crawler",
    name: "generic-crawler"
  },
  {
    pattern: "scraper",
    name: "generic-scraper"
  }
];
const BOT_MAP = [
  {
    type: "search-engine",
    bots: KNOWN_SEARCH_BOTS,
    trusted: true
  },
  {
    type: "social",
    bots: SOCIAL_BOTS,
    trusted: true
  },
  {
    type: "seo",
    bots: SEO_BOTS,
    trusted: true
  },
  {
    type: "ai",
    bots: AI_BOTS,
    trusted: true
  },
  {
    type: "generic",
    bots: GENERIC_BOTS,
    trusted: false
  },
  {
    type: "automation",
    bots: AUTOMATION_BOTS,
    trusted: false
  },
  {
    type: "http-tool",
    bots: HTTP_TOOL_BOTS,
    trusted: false
  },
  {
    type: "security-scanner",
    bots: SECURITY_SCANNING_BOTS,
    trusted: false
  },
  {
    type: "scraping",
    bots: SCRAPING_BOTS,
    trusted: false
  }
];

const ROBOT_DIRECTIVE_VALUES = {
  // Standard directives
  enabled: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
  disabled: "noindex, nofollow",
  index: "index",
  noindex: "noindex",
  follow: "follow",
  nofollow: "nofollow",
  none: "none",
  all: "all",
  // Non-standard directives (not part of official robots spec)
  noai: "noai",
  noimageai: "noimageai"
};
function formatMaxImagePreview(value) {
  return `max-image-preview:${value}`;
}
function formatMaxSnippet(value) {
  return `max-snippet:${value}`;
}
function formatMaxVideoPreview(value) {
  return `max-video-preview:${value}`;
}
function matches(pattern, path) {
  const pathLength = path.length;
  const patternLength = pattern.length;
  const matchingLengths = Array.from({ length: pathLength + 1 }).fill(0);
  let numMatchingLengths = 1;
  let p = 0;
  while (p < patternLength) {
    if (pattern[p] === "$" && p + 1 === patternLength) {
      return matchingLengths[numMatchingLengths - 1] === pathLength;
    }
    if (pattern[p] === "*") {
      numMatchingLengths = pathLength - matchingLengths[0] + 1;
      for (let i = 1; i < numMatchingLengths; i++) {
        matchingLengths[i] = matchingLengths[i - 1] + 1;
      }
    } else {
      let numMatches = 0;
      for (let i = 0; i < numMatchingLengths; i++) {
        const matchLength = matchingLengths[i];
        if (matchLength < pathLength && path[matchLength] === pattern[p]) {
          matchingLengths[numMatches++] = matchLength + 1;
        }
      }
      if (numMatches === 0) {
        return false;
      }
      numMatchingLengths = numMatches;
    }
    p++;
  }
  return true;
}
function matchPathToRule(path, _rules) {
  let matchedRule = null;
  const rules = _rules.filter(Boolean);
  const rulesLength = rules.length;
  let i = 0;
  while (i < rulesLength) {
    const rule = rules[i];
    if (!rule || !matches(rule.pattern, path)) {
      i++;
      continue;
    }
    if (!matchedRule || rule.pattern.length > matchedRule.pattern.length) {
      matchedRule = rule;
    } else if (rule.pattern.length === matchedRule.pattern.length && rule.allow && !matchedRule.allow) {
      matchedRule = rule;
    }
    i++;
  }
  return matchedRule;
}
function asArray(v) {
  return typeof v === "undefined" ? [] : Array.isArray(v) ? v : [v];
}
function contentUsageToString(prefs) {
  return Object.entries(prefs).filter(([_, value]) => value !== void 0).map(([key, value]) => `${key}=${value}`).join(", ");
}
function normalizeContentPreferences(value) {
  if (!value)
    return [];
  if (Array.isArray(value))
    return value.filter((rule) => Boolean(rule));
  if (typeof value === "object" && !Array.isArray(value)) {
    const str = contentUsageToString(value);
    return str ? [str] : [];
  }
  if (typeof value === "string")
    return value ? [value] : [];
  return [];
}
function normalizeGroup(group) {
  if (group._normalized) {
    const resolvedGroup = group;
    const disallow2 = asArray(resolvedGroup.disallow);
    resolvedGroup._indexable = !disallow2.includes("/");
    resolvedGroup._rules = [
      ...resolvedGroup.disallow.filter(Boolean).map((r) => ({ pattern: r, allow: false })),
      ...resolvedGroup.allow.map((r) => ({ pattern: r, allow: true }))
    ];
    return resolvedGroup;
  }
  const disallow = asArray(group.disallow);
  const allow = asArray(group.allow).filter((rule) => Boolean(rule));
  const contentUsage = normalizeContentPreferences(group.contentUsage);
  const contentSignal = normalizeContentPreferences(group.contentSignal);
  return {
    ...group,
    userAgent: group.userAgent ? asArray(group.userAgent) : ["*"],
    disallow,
    allow,
    contentUsage,
    contentSignal,
    _indexable: !disallow.includes("/"),
    _rules: [
      ...disallow.filter(Boolean).map((r) => ({ pattern: r, allow: false })),
      ...allow.map((r) => ({ pattern: r, allow: true }))
    ],
    _normalized: true
  };
}
function generateRobotsTxt({ groups, sitemaps }) {
  const lines = [];
  for (const group of groups) {
    for (const comment of group.comment || [])
      lines.push(`# ${comment}`);
    for (const userAgent of group.userAgent || ["*"])
      lines.push(`User-agent: ${userAgent}`);
    for (const allow of group.allow || [])
      lines.push(`Allow: ${allow}`);
    for (const disallow of group.disallow || [])
      lines.push(`Disallow: ${disallow}`);
    for (const cleanParam of group.cleanParam || [])
      lines.push(`Clean-param: ${cleanParam}`);
    for (const contentUsage of group.contentUsage || [])
      lines.push(`Content-Usage: ${contentUsage}`);
    for (const contentSignal of group.contentSignal || [])
      lines.push(`Content-Signal: ${contentSignal}`);
    lines.push("");
  }
  for (const sitemap of sitemaps)
    lines.push(`Sitemap: ${sitemap}`);
  return lines.join("\n");
}
function createPatternMap() {
  const patternMap = /* @__PURE__ */ new Map();
  for (const def of BOT_MAP) {
    for (const bot of def.bots) {
      const patterns = [bot.pattern, ...bot.secondaryPatterns || []];
      for (const pattern of patterns) {
        patternMap.set(pattern.toLowerCase(), {
          botName: bot.name,
          botCategory: def.type,
          trusted: def.trusted
        });
      }
    }
  }
  return patternMap;
}
function normaliseRobotsRouteRule(config) {
  let allow;
  if (typeof config.robots === "boolean")
    allow = config.robots;
  else if (typeof config.robots === "object" && "indexable" in config.robots && typeof config.robots.indexable !== "undefined")
    allow = config.robots.indexable;
  let rule;
  if (typeof config.robots === "object" && config.robots !== null) {
    if ("rule" in config.robots && typeof config.robots.rule !== "undefined") {
      rule = config.robots.rule;
    } else if (!("indexable" in config.robots)) {
      const directives = [];
      for (const [key, value] of Object.entries(config.robots)) {
        if (value === false || value === null || value === void 0)
          continue;
        if (key in ROBOT_DIRECTIVE_VALUES && typeof value === "boolean" && value) {
          directives.push(ROBOT_DIRECTIVE_VALUES[key]);
        } else if (key === "max-image-preview" && typeof value === "string") {
          directives.push(formatMaxImagePreview(value));
        } else if (key === "max-snippet" && typeof value === "number") {
          directives.push(formatMaxSnippet(value));
        } else if (key === "max-video-preview" && typeof value === "number") {
          directives.push(formatMaxVideoPreview(value));
        }
      }
      if (directives.length > 0) {
        rule = directives.join(", ");
      }
    }
  } else if (typeof config.robots === "string") {
    rule = config.robots;
  }
  if (rule && typeof allow === "undefined") {
    const disallowIndicators = ["none", "noindex", "noai", "noimageai"];
    allow = !disallowIndicators.some(
      (indicator) => rule === indicator || rule.split(",").some((part) => part.trim() === indicator)
    );
  }
  if (typeof allow === "undefined" && typeof rule === "undefined")
    return;
  return {
    allow,
    rule
  };
}

function useRuntimeConfigNuxtRobots(event) {
  return useRuntimeConfig(event)["nuxt-robots"];
}

const logger$1 = createConsola({
  defaults: { tag: "@nuxtjs/robots" }
});

async function resolveRobotsTxtContext(e, nitro = useNitroApp()) {
  const { groups, sitemap: sitemaps } = useRuntimeConfigNuxtRobots(e);
  const generateRobotsTxtCtx = {
    event: e,
    context: e ? "robots.txt" : "init",
    ...JSON.parse(JSON.stringify({ groups, sitemaps }))
  };
  await nitro.hooks.callHook("robots:config", generateRobotsTxtCtx);
  generateRobotsTxtCtx.groups = generateRobotsTxtCtx.groups.map(normalizeGroup);
  nitro._robots.ctx = generateRobotsTxtCtx;
  return generateRobotsTxtCtx;
}

const _4VMG9oRIxu6pJtsnow3c2ZwOxFVCjIlzkSzBa4x1Lec = defineNitroPlugin(async (nitroApp) => {
  const { isNuxtContentV2, robotsDisabledValue, botDetection } = useRuntimeConfigNuxtRobots();
  if (botDetection !== false) {
    nitroApp._robotsPatternMap = createPatternMap();
  }
  nitroApp._robots = {};
  await resolveRobotsTxtContext(void 0, nitroApp);
  const nuxtContentUrls = /* @__PURE__ */ new Set();
  if (isNuxtContentV2) {
    let urls;
    try {
      urls = await (await nitroApp.localFetch("/__robots__/nuxt-content.json", {})).json();
    } catch (e) {
      logger$1.error("Failed to read robot rules from content files.", e);
    }
    if (urls && Array.isArray(urls) && urls.length) {
      urls.forEach((url) => nuxtContentUrls.add(withoutTrailingSlash(url)));
    }
  }
  if (nuxtContentUrls.size) {
    nitroApp._robots.nuxtContentUrls = nuxtContentUrls;
  }
});

const script = "\"use strict\";(()=>{const t=window,e=document.documentElement,c=[\"dark\",\"light\"],n=getStorageValue(\"localStorage\",\"nuxt-color-mode\")||\"system\";let i=n===\"system\"?u():n;const r=e.getAttribute(\"data-color-mode-forced\");r&&(i=r),l(i),t[\"__NUXT_COLOR_MODE__\"]={preference:n,value:i,getColorScheme:u,addColorScheme:l,removeColorScheme:d};function l(o){const s=\"\"+o+\"\",a=\"\";e.classList?e.classList.add(s):e.className+=\" \"+s,a&&e.setAttribute(\"data-\"+a,o)}function d(o){const s=\"\"+o+\"\",a=\"\";e.classList?e.classList.remove(s):e.className=e.className.replace(new RegExp(s,\"g\"),\"\"),a&&e.removeAttribute(\"data-\"+a)}function f(o){return t.matchMedia(\"(prefers-color-scheme\"+o+\")\")}function u(){if(t.matchMedia&&f(\"\").media!==\"not all\"){for(const o of c)if(f(\":\"+o).matches)return o}return\"light\"}})();function getStorageValue(t,e){switch(t){case\"localStorage\":return window.localStorage.getItem(e);case\"sessionStorage\":return window.sessionStorage.getItem(e);case\"cookie\":return getCookie(e);default:return null}}function getCookie(t){const c=(\"; \"+window.document.cookie).split(\"; \"+t+\"=\");if(c.length===2)return c.pop()?.split(\";\").shift()}";

const _NVHUTVUaSobrf7qIuNNCrZwkUUMiKoC19RrOPq3ceKQ = (function(nitro) {
  nitro.hooks.hook("render:html", (htmlContext) => {
    htmlContext.head.push(`<script>${script}<\/script>`);
  });
});

const plugins = [
  _yUKPp5wEjHQ5OsLW04ZX62sUgnBPYsUjj865JFcbow0,
_4VMG9oRIxu6pJtsnow3c2ZwOxFVCjIlzkSzBa4x1Lec,
_NVHUTVUaSobrf7qIuNNCrZwkUUMiKoC19RrOPq3ceKQ
];

const assets = {
  "/_robots.txt": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"d2-z5G4IPjjcn6Qd/PN5ncK7Cb8UkQ\"",
    "mtime": "2026-09-19T20:31:16.137Z",
    "size": 210,
    "path": "../public/_robots.txt"
  },
  "/manifest.webmanifest": {
    "type": "application/manifest+json",
    "etag": "\"229-t7OY2U4XMQKfMMyxElz6GnMIMJo\"",
    "mtime": "2026-09-19T20:31:16.040Z",
    "size": 553,
    "path": "../public/manifest.webmanifest"
  },
  "/favicon.ico": {
    "type": "image/vnd.microsoft.icon",
    "etag": "\"371f1-d3mPxWs0dE7jCXeaf+0kJRNqb0Q\"",
    "mtime": "2026-09-19T20:31:16.137Z",
    "size": 225777,
    "path": "../public/favicon.ico"
  },
  "/sw.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"25be-GRP1zGw4V9K6a9t8qGKGh8wT7js\"",
    "mtime": "2026-09-19T20:31:18.166Z",
    "size": 9662,
    "path": "../public/sw.js"
  },
  "/workbox-835c8c05.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"5567-vl/ksqrIzb3Iy7IOzetc2Nz9HsY\"",
    "mtime": "2026-09-19T20:31:18.166Z",
    "size": 21863,
    "path": "../public/workbox-835c8c05.js"
  },
  "/css/nuxt-google-fonts.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"849b-bOVckuzMmNZfQoTk5fGTZexk8QA\"",
    "mtime": "2026-09-19T20:31:16.032Z",
    "size": 33947,
    "path": "../public/css/nuxt-google-fonts.css"
  },
  "/fonts/Changa_One-normal-400-latin.woff2": {
    "type": "font/woff2",
    "etag": "\"1edc-SCplz/xpEJryZmnWSsy+9x2zuDY\"",
    "mtime": "2026-09-19T20:31:16.032Z",
    "size": 7900,
    "path": "../public/fonts/Changa_One-normal-400-latin.woff2"
  },
  "/fonts/Open_Sans-normal-300-cyrillic-ext.woff2": {
    "type": "font/woff2",
    "etag": "\"c074-29bRoZAujgnMMOB3b0HvnYPQygI\"",
    "mtime": "2026-09-19T20:31:16.034Z",
    "size": 49268,
    "path": "../public/fonts/Open_Sans-normal-300-cyrillic-ext.woff2"
  },
  "/fonts/Open_Sans-normal-300-cyrillic.woff2": {
    "type": "font/woff2",
    "etag": "\"67dc-XV+juFoXRehn5EqMbdOHfmUUkf0\"",
    "mtime": "2026-09-19T20:31:16.034Z",
    "size": 26588,
    "path": "../public/fonts/Open_Sans-normal-300-cyrillic.woff2"
  },
  "/fonts/Open_Sans-normal-300-greek-ext.woff2": {
    "type": "font/woff2",
    "etag": "\"1198-bKg4ah0hcPIz8jutgTz4UZvQYHg\"",
    "mtime": "2026-09-19T20:31:16.034Z",
    "size": 4504,
    "path": "../public/fonts/Open_Sans-normal-300-greek-ext.woff2"
  },
  "/fonts/Open_Sans-normal-300-greek.woff2": {
    "type": "font/woff2",
    "etag": "\"5354-NcGzs1E+id0NSaMRFS0J2fycQ48\"",
    "mtime": "2026-09-19T20:31:16.034Z",
    "size": 21332,
    "path": "../public/fonts/Open_Sans-normal-300-greek.woff2"
  },
  "/fonts/Open_Sans-normal-300-hebrew.woff2": {
    "type": "font/woff2",
    "etag": "\"4218-vYUkpStfdVvVUlvEux5936Q7GVM\"",
    "mtime": "2026-09-19T20:31:16.034Z",
    "size": 16920,
    "path": "../public/fonts/Open_Sans-normal-300-hebrew.woff2"
  },
  "/fonts/Open_Sans-normal-300-latin-ext.woff2": {
    "type": "font/woff2",
    "etag": "\"8954-P9Hwc0O9M6U803T38Qfb357/rgM\"",
    "mtime": "2026-09-19T20:31:16.034Z",
    "size": 35156,
    "path": "../public/fonts/Open_Sans-normal-300-latin-ext.woff2"
  },
  "/fonts/Open_Sans-normal-300-math.woff2": {
    "type": "font/woff2",
    "etag": "\"cac8-ycHLts6tkF/fHhn6ygcdCcorZfg\"",
    "mtime": "2026-09-19T20:31:16.034Z",
    "size": 51912,
    "path": "../public/fonts/Open_Sans-normal-300-math.woff2"
  },
  "/fonts/Open_Sans-normal-300-latin.woff2": {
    "type": "font/woff2",
    "etag": "\"bcc0-toFgyTM6+DP+SDkos+9xKMB6VqA\"",
    "mtime": "2026-09-19T20:31:16.034Z",
    "size": 48320,
    "path": "../public/fonts/Open_Sans-normal-300-latin.woff2"
  },
  "/fonts/Open_Sans-normal-300-symbols.woff2": {
    "type": "font/woff2",
    "etag": "\"67e4-3KgI1tFpZcQL+6Tks8ioGfhDiQ0\"",
    "mtime": "2026-09-19T20:31:16.034Z",
    "size": 26596,
    "path": "../public/fonts/Open_Sans-normal-300-symbols.woff2"
  },
  "/fonts/Open_Sans-normal-300-vietnamese.woff2": {
    "type": "font/woff2",
    "etag": "\"4070-d6z8w6zlISaZi2Wsh0pTw+AeWnw\"",
    "mtime": "2026-09-19T20:31:16.034Z",
    "size": 16496,
    "path": "../public/fonts/Open_Sans-normal-300-vietnamese.woff2"
  },
  "/fonts/Open_Sans-normal-400-cyrillic-ext.woff2": {
    "type": "font/woff2",
    "etag": "\"c074-29bRoZAujgnMMOB3b0HvnYPQygI\"",
    "mtime": "2026-09-19T20:31:16.034Z",
    "size": 49268,
    "path": "../public/fonts/Open_Sans-normal-400-cyrillic-ext.woff2"
  },
  "/fonts/Open_Sans-normal-400-greek-ext.woff2": {
    "type": "font/woff2",
    "etag": "\"1198-bKg4ah0hcPIz8jutgTz4UZvQYHg\"",
    "mtime": "2026-09-19T20:31:16.035Z",
    "size": 4504,
    "path": "../public/fonts/Open_Sans-normal-400-greek-ext.woff2"
  },
  "/fonts/Open_Sans-normal-400-cyrillic.woff2": {
    "type": "font/woff2",
    "etag": "\"67dc-XV+juFoXRehn5EqMbdOHfmUUkf0\"",
    "mtime": "2026-09-19T20:31:16.035Z",
    "size": 26588,
    "path": "../public/fonts/Open_Sans-normal-400-cyrillic.woff2"
  },
  "/fonts/Open_Sans-normal-400-greek.woff2": {
    "type": "font/woff2",
    "etag": "\"5354-NcGzs1E+id0NSaMRFS0J2fycQ48\"",
    "mtime": "2026-09-19T20:31:16.035Z",
    "size": 21332,
    "path": "../public/fonts/Open_Sans-normal-400-greek.woff2"
  },
  "/fonts/Open_Sans-normal-400-hebrew.woff2": {
    "type": "font/woff2",
    "etag": "\"4218-vYUkpStfdVvVUlvEux5936Q7GVM\"",
    "mtime": "2026-09-19T20:31:16.035Z",
    "size": 16920,
    "path": "../public/fonts/Open_Sans-normal-400-hebrew.woff2"
  },
  "/pwa-192x192.png": {
    "type": "image/png",
    "etag": "\"90c89-FKx3fcozW04wgJAmXkfQO6aZTeg\"",
    "mtime": "2026-09-19T20:31:16.138Z",
    "size": 593033,
    "path": "../public/pwa-192x192.png"
  },
  "/maskable-icon.png": {
    "type": "image/png",
    "etag": "\"90c89-FKx3fcozW04wgJAmXkfQO6aZTeg\"",
    "mtime": "2026-09-19T20:31:16.138Z",
    "size": 593033,
    "path": "../public/maskable-icon.png"
  },
  "/pwa-512x512.png": {
    "type": "image/png",
    "etag": "\"90c89-FKx3fcozW04wgJAmXkfQO6aZTeg\"",
    "mtime": "2026-09-19T20:31:16.138Z",
    "size": 593033,
    "path": "../public/pwa-512x512.png"
  },
  "/fonts/Open_Sans-normal-400-latin-ext.woff2": {
    "type": "font/woff2",
    "etag": "\"8954-P9Hwc0O9M6U803T38Qfb357/rgM\"",
    "mtime": "2026-09-19T20:31:16.035Z",
    "size": 35156,
    "path": "../public/fonts/Open_Sans-normal-400-latin-ext.woff2"
  },
  "/fonts/Open_Sans-normal-400-latin.woff2": {
    "type": "font/woff2",
    "etag": "\"bcc0-toFgyTM6+DP+SDkos+9xKMB6VqA\"",
    "mtime": "2026-09-19T20:31:16.035Z",
    "size": 48320,
    "path": "../public/fonts/Open_Sans-normal-400-latin.woff2"
  },
  "/fonts/Open_Sans-normal-400-math.woff2": {
    "type": "font/woff2",
    "etag": "\"cac8-ycHLts6tkF/fHhn6ygcdCcorZfg\"",
    "mtime": "2026-09-19T20:31:16.035Z",
    "size": 51912,
    "path": "../public/fonts/Open_Sans-normal-400-math.woff2"
  },
  "/fonts/Open_Sans-normal-400-symbols.woff2": {
    "type": "font/woff2",
    "etag": "\"67e4-3KgI1tFpZcQL+6Tks8ioGfhDiQ0\"",
    "mtime": "2026-09-19T20:31:16.035Z",
    "size": 26596,
    "path": "../public/fonts/Open_Sans-normal-400-symbols.woff2"
  },
  "/fonts/Open_Sans-normal-400-vietnamese.woff2": {
    "type": "font/woff2",
    "etag": "\"4070-d6z8w6zlISaZi2Wsh0pTw+AeWnw\"",
    "mtime": "2026-09-19T20:31:16.035Z",
    "size": 16496,
    "path": "../public/fonts/Open_Sans-normal-400-vietnamese.woff2"
  },
  "/fonts/Open_Sans-normal-500-cyrillic-ext.woff2": {
    "type": "font/woff2",
    "etag": "\"c074-29bRoZAujgnMMOB3b0HvnYPQygI\"",
    "mtime": "2026-09-19T20:31:16.035Z",
    "size": 49268,
    "path": "../public/fonts/Open_Sans-normal-500-cyrillic-ext.woff2"
  },
  "/fonts/Open_Sans-normal-500-cyrillic.woff2": {
    "type": "font/woff2",
    "etag": "\"67dc-XV+juFoXRehn5EqMbdOHfmUUkf0\"",
    "mtime": "2026-09-19T20:31:16.035Z",
    "size": 26588,
    "path": "../public/fonts/Open_Sans-normal-500-cyrillic.woff2"
  },
  "/fonts/Open_Sans-normal-500-greek.woff2": {
    "type": "font/woff2",
    "etag": "\"5354-NcGzs1E+id0NSaMRFS0J2fycQ48\"",
    "mtime": "2026-09-19T20:31:16.036Z",
    "size": 21332,
    "path": "../public/fonts/Open_Sans-normal-500-greek.woff2"
  },
  "/fonts/Open_Sans-normal-500-greek-ext.woff2": {
    "type": "font/woff2",
    "etag": "\"1198-bKg4ah0hcPIz8jutgTz4UZvQYHg\"",
    "mtime": "2026-09-19T20:31:16.036Z",
    "size": 4504,
    "path": "../public/fonts/Open_Sans-normal-500-greek-ext.woff2"
  },
  "/fonts/Open_Sans-normal-500-hebrew.woff2": {
    "type": "font/woff2",
    "etag": "\"4218-vYUkpStfdVvVUlvEux5936Q7GVM\"",
    "mtime": "2026-09-19T20:31:16.036Z",
    "size": 16920,
    "path": "../public/fonts/Open_Sans-normal-500-hebrew.woff2"
  },
  "/fonts/Open_Sans-normal-500-latin-ext.woff2": {
    "type": "font/woff2",
    "etag": "\"8954-P9Hwc0O9M6U803T38Qfb357/rgM\"",
    "mtime": "2026-09-19T20:31:16.036Z",
    "size": 35156,
    "path": "../public/fonts/Open_Sans-normal-500-latin-ext.woff2"
  },
  "/fonts/Open_Sans-normal-500-latin.woff2": {
    "type": "font/woff2",
    "etag": "\"bcc0-toFgyTM6+DP+SDkos+9xKMB6VqA\"",
    "mtime": "2026-09-19T20:31:16.036Z",
    "size": 48320,
    "path": "../public/fonts/Open_Sans-normal-500-latin.woff2"
  },
  "/fonts/Open_Sans-normal-500-math.woff2": {
    "type": "font/woff2",
    "etag": "\"cac8-ycHLts6tkF/fHhn6ygcdCcorZfg\"",
    "mtime": "2026-09-19T20:31:16.036Z",
    "size": 51912,
    "path": "../public/fonts/Open_Sans-normal-500-math.woff2"
  },
  "/fonts/Open_Sans-normal-500-symbols.woff2": {
    "type": "font/woff2",
    "etag": "\"67e4-3KgI1tFpZcQL+6Tks8ioGfhDiQ0\"",
    "mtime": "2026-09-19T20:31:16.036Z",
    "size": 26596,
    "path": "../public/fonts/Open_Sans-normal-500-symbols.woff2"
  },
  "/fonts/Open_Sans-normal-500-vietnamese.woff2": {
    "type": "font/woff2",
    "etag": "\"4070-d6z8w6zlISaZi2Wsh0pTw+AeWnw\"",
    "mtime": "2026-09-19T20:31:16.036Z",
    "size": 16496,
    "path": "../public/fonts/Open_Sans-normal-500-vietnamese.woff2"
  },
  "/fonts/Open_Sans-normal-600-cyrillic.woff2": {
    "type": "font/woff2",
    "etag": "\"67dc-XV+juFoXRehn5EqMbdOHfmUUkf0\"",
    "mtime": "2026-09-19T20:31:16.036Z",
    "size": 26588,
    "path": "../public/fonts/Open_Sans-normal-600-cyrillic.woff2"
  },
  "/fonts/Open_Sans-normal-600-greek-ext.woff2": {
    "type": "font/woff2",
    "etag": "\"1198-bKg4ah0hcPIz8jutgTz4UZvQYHg\"",
    "mtime": "2026-09-19T20:31:16.036Z",
    "size": 4504,
    "path": "../public/fonts/Open_Sans-normal-600-greek-ext.woff2"
  },
  "/fonts/Open_Sans-normal-600-cyrillic-ext.woff2": {
    "type": "font/woff2",
    "etag": "\"c074-29bRoZAujgnMMOB3b0HvnYPQygI\"",
    "mtime": "2026-09-19T20:31:16.036Z",
    "size": 49268,
    "path": "../public/fonts/Open_Sans-normal-600-cyrillic-ext.woff2"
  },
  "/fonts/Open_Sans-normal-600-greek.woff2": {
    "type": "font/woff2",
    "etag": "\"5354-NcGzs1E+id0NSaMRFS0J2fycQ48\"",
    "mtime": "2026-09-19T20:31:16.036Z",
    "size": 21332,
    "path": "../public/fonts/Open_Sans-normal-600-greek.woff2"
  },
  "/fonts/Open_Sans-normal-600-hebrew.woff2": {
    "type": "font/woff2",
    "etag": "\"4218-vYUkpStfdVvVUlvEux5936Q7GVM\"",
    "mtime": "2026-09-19T20:31:16.036Z",
    "size": 16920,
    "path": "../public/fonts/Open_Sans-normal-600-hebrew.woff2"
  },
  "/fonts/Open_Sans-normal-600-latin-ext.woff2": {
    "type": "font/woff2",
    "etag": "\"8954-P9Hwc0O9M6U803T38Qfb357/rgM\"",
    "mtime": "2026-09-19T20:31:16.036Z",
    "size": 35156,
    "path": "../public/fonts/Open_Sans-normal-600-latin-ext.woff2"
  },
  "/fonts/Open_Sans-normal-600-latin.woff2": {
    "type": "font/woff2",
    "etag": "\"bcc0-toFgyTM6+DP+SDkos+9xKMB6VqA\"",
    "mtime": "2026-09-19T20:31:16.036Z",
    "size": 48320,
    "path": "../public/fonts/Open_Sans-normal-600-latin.woff2"
  },
  "/fonts/Open_Sans-normal-600-math.woff2": {
    "type": "font/woff2",
    "etag": "\"cac8-ycHLts6tkF/fHhn6ygcdCcorZfg\"",
    "mtime": "2026-09-19T20:31:16.037Z",
    "size": 51912,
    "path": "../public/fonts/Open_Sans-normal-600-math.woff2"
  },
  "/fonts/Open_Sans-normal-600-symbols.woff2": {
    "type": "font/woff2",
    "etag": "\"67e4-3KgI1tFpZcQL+6Tks8ioGfhDiQ0\"",
    "mtime": "2026-09-19T20:31:16.037Z",
    "size": 26596,
    "path": "../public/fonts/Open_Sans-normal-600-symbols.woff2"
  },
  "/fonts/Open_Sans-normal-600-vietnamese.woff2": {
    "type": "font/woff2",
    "etag": "\"4070-d6z8w6zlISaZi2Wsh0pTw+AeWnw\"",
    "mtime": "2026-09-19T20:31:16.037Z",
    "size": 16496,
    "path": "../public/fonts/Open_Sans-normal-600-vietnamese.woff2"
  },
  "/fonts/Open_Sans-normal-700-cyrillic.woff2": {
    "type": "font/woff2",
    "etag": "\"67dc-XV+juFoXRehn5EqMbdOHfmUUkf0\"",
    "mtime": "2026-09-19T20:31:16.037Z",
    "size": 26588,
    "path": "../public/fonts/Open_Sans-normal-700-cyrillic.woff2"
  },
  "/fonts/Open_Sans-normal-700-greek-ext.woff2": {
    "type": "font/woff2",
    "etag": "\"1198-bKg4ah0hcPIz8jutgTz4UZvQYHg\"",
    "mtime": "2026-09-19T20:31:16.037Z",
    "size": 4504,
    "path": "../public/fonts/Open_Sans-normal-700-greek-ext.woff2"
  },
  "/fonts/Open_Sans-normal-700-greek.woff2": {
    "type": "font/woff2",
    "etag": "\"5354-NcGzs1E+id0NSaMRFS0J2fycQ48\"",
    "mtime": "2026-09-19T20:31:16.037Z",
    "size": 21332,
    "path": "../public/fonts/Open_Sans-normal-700-greek.woff2"
  },
  "/fonts/Open_Sans-normal-700-hebrew.woff2": {
    "type": "font/woff2",
    "etag": "\"4218-vYUkpStfdVvVUlvEux5936Q7GVM\"",
    "mtime": "2026-09-19T20:31:16.037Z",
    "size": 16920,
    "path": "../public/fonts/Open_Sans-normal-700-hebrew.woff2"
  },
  "/fonts/Open_Sans-normal-700-cyrillic-ext.woff2": {
    "type": "font/woff2",
    "etag": "\"c074-29bRoZAujgnMMOB3b0HvnYPQygI\"",
    "mtime": "2026-09-19T20:31:16.037Z",
    "size": 49268,
    "path": "../public/fonts/Open_Sans-normal-700-cyrillic-ext.woff2"
  },
  "/fonts/Open_Sans-normal-700-latin-ext.woff2": {
    "type": "font/woff2",
    "etag": "\"8954-P9Hwc0O9M6U803T38Qfb357/rgM\"",
    "mtime": "2026-09-19T20:31:16.037Z",
    "size": 35156,
    "path": "../public/fonts/Open_Sans-normal-700-latin-ext.woff2"
  },
  "/fonts/Open_Sans-normal-700-latin.woff2": {
    "type": "font/woff2",
    "etag": "\"bcc0-toFgyTM6+DP+SDkos+9xKMB6VqA\"",
    "mtime": "2026-09-19T20:31:16.037Z",
    "size": 48320,
    "path": "../public/fonts/Open_Sans-normal-700-latin.woff2"
  },
  "/fonts/Open_Sans-normal-700-math.woff2": {
    "type": "font/woff2",
    "etag": "\"cac8-ycHLts6tkF/fHhn6ygcdCcorZfg\"",
    "mtime": "2026-09-19T20:31:16.037Z",
    "size": 51912,
    "path": "../public/fonts/Open_Sans-normal-700-math.woff2"
  },
  "/fonts/Open_Sans-normal-700-symbols.woff2": {
    "type": "font/woff2",
    "etag": "\"67e4-3KgI1tFpZcQL+6Tks8ioGfhDiQ0\"",
    "mtime": "2026-09-19T20:31:16.037Z",
    "size": 26596,
    "path": "../public/fonts/Open_Sans-normal-700-symbols.woff2"
  },
  "/fonts/Open_Sans-normal-700-vietnamese.woff2": {
    "type": "font/woff2",
    "etag": "\"4070-d6z8w6zlISaZi2Wsh0pTw+AeWnw\"",
    "mtime": "2026-09-19T20:31:16.037Z",
    "size": 16496,
    "path": "../public/fonts/Open_Sans-normal-700-vietnamese.woff2"
  },
  "/fonts/Open_Sans-normal-800-cyrillic-ext.woff2": {
    "type": "font/woff2",
    "etag": "\"c074-29bRoZAujgnMMOB3b0HvnYPQygI\"",
    "mtime": "2026-09-19T20:31:16.037Z",
    "size": 49268,
    "path": "../public/fonts/Open_Sans-normal-800-cyrillic-ext.woff2"
  },
  "/fonts/Open_Sans-normal-800-cyrillic.woff2": {
    "type": "font/woff2",
    "etag": "\"67dc-XV+juFoXRehn5EqMbdOHfmUUkf0\"",
    "mtime": "2026-09-19T20:31:16.037Z",
    "size": 26588,
    "path": "../public/fonts/Open_Sans-normal-800-cyrillic.woff2"
  },
  "/fonts/Open_Sans-normal-800-greek-ext.woff2": {
    "type": "font/woff2",
    "etag": "\"1198-bKg4ah0hcPIz8jutgTz4UZvQYHg\"",
    "mtime": "2026-09-19T20:31:16.037Z",
    "size": 4504,
    "path": "../public/fonts/Open_Sans-normal-800-greek-ext.woff2"
  },
  "/fonts/Open_Sans-normal-800-greek.woff2": {
    "type": "font/woff2",
    "etag": "\"5354-NcGzs1E+id0NSaMRFS0J2fycQ48\"",
    "mtime": "2026-09-19T20:31:16.038Z",
    "size": 21332,
    "path": "../public/fonts/Open_Sans-normal-800-greek.woff2"
  },
  "/fonts/Open_Sans-normal-800-hebrew.woff2": {
    "type": "font/woff2",
    "etag": "\"4218-vYUkpStfdVvVUlvEux5936Q7GVM\"",
    "mtime": "2026-09-19T20:31:16.038Z",
    "size": 16920,
    "path": "../public/fonts/Open_Sans-normal-800-hebrew.woff2"
  },
  "/fonts/Open_Sans-normal-800-latin-ext.woff2": {
    "type": "font/woff2",
    "etag": "\"8954-P9Hwc0O9M6U803T38Qfb357/rgM\"",
    "mtime": "2026-09-19T20:31:16.038Z",
    "size": 35156,
    "path": "../public/fonts/Open_Sans-normal-800-latin-ext.woff2"
  },
  "/fonts/Open_Sans-normal-800-latin.woff2": {
    "type": "font/woff2",
    "etag": "\"bcc0-toFgyTM6+DP+SDkos+9xKMB6VqA\"",
    "mtime": "2026-09-19T20:31:16.038Z",
    "size": 48320,
    "path": "../public/fonts/Open_Sans-normal-800-latin.woff2"
  },
  "/fonts/Open_Sans-normal-800-math.woff2": {
    "type": "font/woff2",
    "etag": "\"cac8-ycHLts6tkF/fHhn6ygcdCcorZfg\"",
    "mtime": "2026-09-19T20:31:16.038Z",
    "size": 51912,
    "path": "../public/fonts/Open_Sans-normal-800-math.woff2"
  },
  "/fonts/Open_Sans-normal-800-symbols.woff2": {
    "type": "font/woff2",
    "etag": "\"67e4-3KgI1tFpZcQL+6Tks8ioGfhDiQ0\"",
    "mtime": "2026-09-19T20:31:16.038Z",
    "size": 26596,
    "path": "../public/fonts/Open_Sans-normal-800-symbols.woff2"
  },
  "/fonts/Open_Sans-normal-800-vietnamese.woff2": {
    "type": "font/woff2",
    "etag": "\"4070-d6z8w6zlISaZi2Wsh0pTw+AeWnw\"",
    "mtime": "2026-09-19T20:31:16.038Z",
    "size": 16496,
    "path": "../public/fonts/Open_Sans-normal-800-vietnamese.woff2"
  },
  "/_nuxt/0FJUpkW6.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"d6-aDShZs9JOIOi07apOMg0A2aLz+I\"",
    "mtime": "2026-09-19T20:31:16.119Z",
    "size": 214,
    "path": "../public/_nuxt/0FJUpkW6.js"
  },
  "/_nuxt/1_T2mzfj.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"421-43zhxDipvNrSgofxDWNvDKG9V1U\"",
    "mtime": "2026-09-19T20:31:16.119Z",
    "size": 1057,
    "path": "../public/_nuxt/1_T2mzfj.js"
  },
  "/_nuxt/3jGD8K3j.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"343-BtQVoCVISFYnYefWP+DR8h5I+l0\"",
    "mtime": "2026-09-19T20:31:16.119Z",
    "size": 835,
    "path": "../public/_nuxt/3jGD8K3j.js"
  },
  "/_nuxt/4u8KEeDb.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"147-uA1tH2JAwNQyaQ+KrMxL6T4u6/U\"",
    "mtime": "2026-09-19T20:31:16.119Z",
    "size": 327,
    "path": "../public/_nuxt/4u8KEeDb.js"
  },
  "/img/Logo.png": {
    "type": "image/png",
    "etag": "\"90c89-FKx3fcozW04wgJAmXkfQO6aZTeg\"",
    "mtime": "2026-09-19T20:31:16.137Z",
    "size": 593033,
    "path": "../public/img/Logo.png"
  },
  "/_nuxt/5mLcanJN.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"11a3-JoQBr3NH9TtCpwhoKDnaaHWaKQo\"",
    "mtime": "2026-09-19T20:31:16.119Z",
    "size": 4515,
    "path": "../public/_nuxt/5mLcanJN.js"
  },
  "/_nuxt/7ntHTJay.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1fc-XZ+tOmZ8a+gqHpsp7b8UPwBTcRo\"",
    "mtime": "2026-09-19T20:31:16.119Z",
    "size": 508,
    "path": "../public/_nuxt/7ntHTJay.js"
  },
  "/_nuxt/97g3koaJ.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"3cd9-N4dUy/f/5XeexJgqIlrgsZmv3Gw\"",
    "mtime": "2026-09-19T20:31:16.119Z",
    "size": 15577,
    "path": "../public/_nuxt/97g3koaJ.js"
  },
  "/_nuxt/AIBLmuzf.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1c5-L3rFOyTLrlgKZYJOQ4LTE7nWXiA\"",
    "mtime": "2026-09-19T20:31:16.120Z",
    "size": 453,
    "path": "../public/_nuxt/AIBLmuzf.js"
  },
  "/_nuxt/AppSkeleton.CIpJxhhO.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"bc-JUqtjX2dJv9qF2VwqyuqW7O5rpk\"",
    "mtime": "2026-09-19T20:31:16.120Z",
    "size": 188,
    "path": "../public/_nuxt/AppSkeleton.CIpJxhhO.css"
  },
  "/_nuxt/B2xwNk9b.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"4bba-lbEcLK1WWnVG8rxJxpCM/LGugRM\"",
    "mtime": "2026-09-19T20:31:16.120Z",
    "size": 19386,
    "path": "../public/_nuxt/B2xwNk9b.js"
  },
  "/_nuxt/B6wGDTr-.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1d69-ofWN5nNFjbG0Ij/Pw2CSyY6WgSM\"",
    "mtime": "2026-09-19T20:31:16.120Z",
    "size": 7529,
    "path": "../public/_nuxt/B6wGDTr-.js"
  },
  "/_nuxt/B6HLgW0o.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"b6a-KpR0JQReRJShYmBnvtlBMRQAH+k\"",
    "mtime": "2026-09-19T20:31:16.120Z",
    "size": 2922,
    "path": "../public/_nuxt/B6HLgW0o.js"
  },
  "/_nuxt/B73ifv0-.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"157-qTmPa4aFJY4hPaWwSrYmBAV+9gs\"",
    "mtime": "2026-09-19T20:31:16.120Z",
    "size": 343,
    "path": "../public/_nuxt/B73ifv0-.js"
  },
  "/_nuxt/B9dHDecU.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1c42-4vi9X8UDhSfUL4FSCzzad0bdqCs\"",
    "mtime": "2026-09-19T20:31:16.120Z",
    "size": 7234,
    "path": "../public/_nuxt/B9dHDecU.js"
  },
  "/_nuxt/BCI66FzP.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"100-A3Un5VP7Z2CqsR2qAHW/p64kO1w\"",
    "mtime": "2026-09-19T20:31:16.120Z",
    "size": 256,
    "path": "../public/_nuxt/BCI66FzP.js"
  },
  "/_nuxt/BBnX5xw4.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1674-HyZL1eUl9QW4o4RCa0ogOE8HLCk\"",
    "mtime": "2026-09-19T20:31:16.120Z",
    "size": 5748,
    "path": "../public/_nuxt/BBnX5xw4.js"
  },
  "/_nuxt/BE53rib5.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"bf-0Vx/G6lk1gr4vM+zBqLAMhPfOoo\"",
    "mtime": "2026-09-19T20:31:16.120Z",
    "size": 191,
    "path": "../public/_nuxt/BE53rib5.js"
  },
  "/_nuxt/BH7imF0Q.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"100e-KTuML+k6NwxXRJitMARlQNzezy0\"",
    "mtime": "2026-09-19T20:31:16.120Z",
    "size": 4110,
    "path": "../public/_nuxt/BH7imF0Q.js"
  },
  "/_nuxt/BIuxrsyD.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"178-hfGlNN+tVx46uhIYImyq+IgW2yc\"",
    "mtime": "2026-09-19T20:31:16.120Z",
    "size": 376,
    "path": "../public/_nuxt/BIuxrsyD.js"
  },
  "/_nuxt/BIxpqHZ-.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"3a8f-OYgyTX/qMapu4cpaU4oqCFX9K9g\"",
    "mtime": "2026-09-19T20:31:16.120Z",
    "size": 14991,
    "path": "../public/_nuxt/BIxpqHZ-.js"
  },
  "/_nuxt/BN7An2-n.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"14fc-shqg0FhcR3JjkNc4F1e3q0sauwQ\"",
    "mtime": "2026-09-19T20:31:16.120Z",
    "size": 5372,
    "path": "../public/_nuxt/BN7An2-n.js"
  },
  "/_nuxt/BORHltqx.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"59e6-FnRMA6p/Xxn1DnyZ9SpW+cD/q/U\"",
    "mtime": "2026-09-19T20:31:16.120Z",
    "size": 23014,
    "path": "../public/_nuxt/BORHltqx.js"
  },
  "/_nuxt/BP7BLg4Z.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"2c2-aqaVevP60iQnLPnK9Bxe2uwh03c\"",
    "mtime": "2026-09-19T20:31:16.120Z",
    "size": 706,
    "path": "../public/_nuxt/BP7BLg4Z.js"
  },
  "/_nuxt/BPIoyWXQ.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"d5-KSdIDOnUedIJ2T+1Ix2k9VT3XQ0\"",
    "mtime": "2026-09-19T20:31:16.120Z",
    "size": 213,
    "path": "../public/_nuxt/BPIoyWXQ.js"
  },
  "/_nuxt/BQvGTOp_.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"11f5-eaiGnaToH7BJG+lMU8gGa94ZuZs\"",
    "mtime": "2026-09-19T20:31:16.120Z",
    "size": 4597,
    "path": "../public/_nuxt/BQvGTOp_.js"
  },
  "/_nuxt/BRD4u2CC.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"94a-7wy9asiEV1CrigNkvPjJjNIv1vQ\"",
    "mtime": "2026-09-19T20:31:16.120Z",
    "size": 2378,
    "path": "../public/_nuxt/BRD4u2CC.js"
  },
  "/_nuxt/BSYI_YT2.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"90-dNa9C28I1QdNgpm/NegyctLvmIM\"",
    "mtime": "2026-09-19T20:31:16.121Z",
    "size": 144,
    "path": "../public/_nuxt/BSYI_YT2.js"
  },
  "/_nuxt/BTfh-KG_.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"8e-X29NUUSfk/ENKBxRu00+gdstfOY\"",
    "mtime": "2026-09-19T20:31:16.121Z",
    "size": 142,
    "path": "../public/_nuxt/BTfh-KG_.js"
  },
  "/_nuxt/BTuRLlcH.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"a05-FBCWHeWvvq95zmKu6z85NFiWsy0\"",
    "mtime": "2026-09-19T20:31:16.121Z",
    "size": 2565,
    "path": "../public/_nuxt/BTuRLlcH.js"
  },
  "/_nuxt/BUAHVcNB.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"d8-oJ+OfxJUUfu3Mi7tXK3KhDHPIlM\"",
    "mtime": "2026-09-19T20:31:16.121Z",
    "size": 216,
    "path": "../public/_nuxt/BUAHVcNB.js"
  },
  "/_nuxt/BUh73m8w.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"414-AE9u/HOQUAJsB3FoJ2ETtA8fruY\"",
    "mtime": "2026-09-19T20:31:16.121Z",
    "size": 1044,
    "path": "../public/_nuxt/BUh73m8w.js"
  },
  "/_nuxt/BUyubs2F.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1a7c-P3OVvyNV9IhDdyfagFqnTw8YArY\"",
    "mtime": "2026-09-19T20:31:16.121Z",
    "size": 6780,
    "path": "../public/_nuxt/BUyubs2F.js"
  },
  "/_nuxt/BYapZMWu.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"c2-3eZQGTgCbI/cRPvpvDf0t+prdgg\"",
    "mtime": "2026-09-19T20:31:16.121Z",
    "size": 194,
    "path": "../public/_nuxt/BYapZMWu.js"
  },
  "/_nuxt/BXtnVkLY.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"2ac9-vIBAmNWHc9vWWkZpp4GHSU4NhkU\"",
    "mtime": "2026-09-19T20:31:16.121Z",
    "size": 10953,
    "path": "../public/_nuxt/BXtnVkLY.js"
  },
  "/_nuxt/Ba-SQZsY.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"95-Ff6TLV4yuALc4bfc6vIYWg1pUvo\"",
    "mtime": "2026-09-19T20:31:16.121Z",
    "size": 149,
    "path": "../public/_nuxt/Ba-SQZsY.js"
  },
  "/_nuxt/BaOS9Gd6.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"fb0-4X0vamcKABMSXWPj5aTDixeRtp0\"",
    "mtime": "2026-09-19T20:31:16.121Z",
    "size": 4016,
    "path": "../public/_nuxt/BaOS9Gd6.js"
  },
  "/_nuxt/BateQmed.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1c2b-vpCh+RFpvSSo7B5TYP3blB2l19E\"",
    "mtime": "2026-09-19T20:31:16.121Z",
    "size": 7211,
    "path": "../public/_nuxt/BateQmed.js"
  },
  "/_nuxt/BdzM6sCb.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1223-EhjieS/8Pu3fpew1rsIJNxti6zM\"",
    "mtime": "2026-09-19T20:31:16.121Z",
    "size": 4643,
    "path": "../public/_nuxt/BdzM6sCb.js"
  },
  "/_nuxt/Bfx5taQ-.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"f4-4kj7eLE3U/LPkgpso9D3Wv8l73g\"",
    "mtime": "2026-09-19T20:31:16.121Z",
    "size": 244,
    "path": "../public/_nuxt/Bfx5taQ-.js"
  },
  "/_nuxt/BhtsGrBq.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"131-S/GxmjXWBW39+p2sByq9xApJYNA\"",
    "mtime": "2026-09-19T20:31:16.121Z",
    "size": 305,
    "path": "../public/_nuxt/BhtsGrBq.js"
  },
  "/_nuxt/BjzZoYKi.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"d8-0YkcigjmjDLthfoo9sg3HDt8DKY\"",
    "mtime": "2026-09-19T20:31:16.121Z",
    "size": 216,
    "path": "../public/_nuxt/BjzZoYKi.js"
  },
  "/_nuxt/BkZ0iBDJ.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"28e3-GYzlodNxT6Qqha5JT/4L6FbYa5A\"",
    "mtime": "2026-09-19T20:31:16.121Z",
    "size": 10467,
    "path": "../public/_nuxt/BkZ0iBDJ.js"
  },
  "/_nuxt/BkwMHPwN.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"142-6/qcwkGLwkGYvopBmb8FQtn+IqM\"",
    "mtime": "2026-09-19T20:31:16.121Z",
    "size": 322,
    "path": "../public/_nuxt/BkwMHPwN.js"
  },
  "/_nuxt/BqYHFAb5.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"40e-NJxSVNBftMvTYEKm6jxhI7EFQZ0\"",
    "mtime": "2026-09-19T20:31:16.122Z",
    "size": 1038,
    "path": "../public/_nuxt/BqYHFAb5.js"
  },
  "/_nuxt/Bqtk_sj_.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"2f62-CdreYkQt7BKiuRAmHHd5OsYUMu0\"",
    "mtime": "2026-09-19T20:31:16.122Z",
    "size": 12130,
    "path": "../public/_nuxt/Bqtk_sj_.js"
  },
  "/_nuxt/BxoXxARq.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"132-7Klf76MpUUIB37WT3erq5wjcC+Y\"",
    "mtime": "2026-09-19T20:31:16.122Z",
    "size": 306,
    "path": "../public/_nuxt/BxoXxARq.js"
  },
  "/_nuxt/ByFK9MCh.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"110-2vSfn9fy0msTemCqhbh+zOciSjc\"",
    "mtime": "2026-09-19T20:31:16.122Z",
    "size": 272,
    "path": "../public/_nuxt/ByFK9MCh.js"
  },
  "/_nuxt/BvbB5O7P.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"33f6-MspuxNfOCZ2/S8y8SQEW4ggStc0\"",
    "mtime": "2026-09-19T20:31:16.122Z",
    "size": 13302,
    "path": "../public/_nuxt/BvbB5O7P.js"
  },
  "/_nuxt/C34sxX23.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"6da-BrmwLUaT5dX+pzrWpB4qkUMvTpY\"",
    "mtime": "2026-09-19T20:31:16.122Z",
    "size": 1754,
    "path": "../public/_nuxt/C34sxX23.js"
  },
  "/_nuxt/Byf149Wh.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"249cf-kw0RQ1DX77ss/z6oQ+oq93l/uik\"",
    "mtime": "2026-09-19T20:31:16.122Z",
    "size": 149967,
    "path": "../public/_nuxt/Byf149Wh.js"
  },
  "/_nuxt/C3AsyCaJ.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1c9-E/r1yrDjeMew85hG3qBVpBrx3HI\"",
    "mtime": "2026-09-19T20:31:16.122Z",
    "size": 457,
    "path": "../public/_nuxt/C3AsyCaJ.js"
  },
  "/_nuxt/C47AMuYd.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1415-ykrysP+yXDFWjBqlMZGzlFUs5KI\"",
    "mtime": "2026-09-19T20:31:16.122Z",
    "size": 5141,
    "path": "../public/_nuxt/C47AMuYd.js"
  },
  "/_nuxt/C5QyLcbD.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1cf9-wM8i7E+vqHLi5VAcO4AsFqCn5z4\"",
    "mtime": "2026-09-19T20:31:16.122Z",
    "size": 7417,
    "path": "../public/_nuxt/C5QyLcbD.js"
  },
  "/_nuxt/C9SKow43.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"44db-9+HbH8GtboODbpQOzSXU+JGquYQ\"",
    "mtime": "2026-09-19T20:31:16.122Z",
    "size": 17627,
    "path": "../public/_nuxt/C9SKow43.js"
  },
  "/_nuxt/CACEB1U-.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"44f-JL1pzcKmAKf4HuZyimeKKThMDGY\"",
    "mtime": "2026-09-19T20:31:16.122Z",
    "size": 1103,
    "path": "../public/_nuxt/CACEB1U-.js"
  },
  "/_nuxt/CAdePlJ6.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"2538-rDxZmbFak/ZStSz2dxf/222Lypw\"",
    "mtime": "2026-09-19T20:31:16.122Z",
    "size": 9528,
    "path": "../public/_nuxt/CAdePlJ6.js"
  },
  "/_nuxt/CBZ7uanq.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"15c-oujF/8Rnqbr1NzNUQVOaG/l/P7s\"",
    "mtime": "2026-09-19T20:31:16.122Z",
    "size": 348,
    "path": "../public/_nuxt/CBZ7uanq.js"
  },
  "/_nuxt/CDbVqp9f.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"3ed3-XY2mrwX+t1YwidWGdXwcv6aFyqw\"",
    "mtime": "2026-09-19T20:31:16.122Z",
    "size": 16083,
    "path": "../public/_nuxt/CDbVqp9f.js"
  },
  "/_nuxt/CIa3-WQ3.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"65d-TnPKUZGxhjJyFFdwuANbPobRWa8\"",
    "mtime": "2026-09-19T20:31:16.122Z",
    "size": 1629,
    "path": "../public/_nuxt/CIa3-WQ3.js"
  },
  "/_nuxt/CIjHguLj.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"27b2-FNisfbUOD3PXy3Rw3Ff2KIsbIWI\"",
    "mtime": "2026-09-19T20:31:16.122Z",
    "size": 10162,
    "path": "../public/_nuxt/CIjHguLj.js"
  },
  "/_nuxt/CL7F4Zz_.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"114-maBswkYJmaAb6drcaQrPdW+8igU\"",
    "mtime": "2026-09-19T20:31:16.123Z",
    "size": 276,
    "path": "../public/_nuxt/CL7F4Zz_.js"
  },
  "/_nuxt/CMDj0I2E.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"428-X17P6+dUv3eX3lQKVNWkXqY1IVs\"",
    "mtime": "2026-09-19T20:31:16.123Z",
    "size": 1064,
    "path": "../public/_nuxt/CMDj0I2E.js"
  },
  "/_nuxt/CM_txyOj.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"a51-aq3jyrykPUEAMisoboxKWUue8XQ\"",
    "mtime": "2026-09-19T20:31:16.123Z",
    "size": 2641,
    "path": "../public/_nuxt/CM_txyOj.js"
  },
  "/_nuxt/CN4X037s.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1c48-v25+A97DMY/StFlqb082lrlhq4I\"",
    "mtime": "2026-09-19T20:31:16.123Z",
    "size": 7240,
    "path": "../public/_nuxt/CN4X037s.js"
  },
  "/_nuxt/COQrmatC.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"2715-UsGSfnYgLe1hT3gFKS6rAWvc+z0\"",
    "mtime": "2026-09-19T20:31:16.123Z",
    "size": 10005,
    "path": "../public/_nuxt/COQrmatC.js"
  },
  "/_nuxt/CPp4o9-P.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"2a0-l6z1PWFVrYoywPqyIhoOVDC/OmI\"",
    "mtime": "2026-09-19T20:31:16.123Z",
    "size": 672,
    "path": "../public/_nuxt/CPp4o9-P.js"
  },
  "/_nuxt/CQax0eun.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"3366-MpWwup8RoSPnySPsd88SDKgB/8g\"",
    "mtime": "2026-09-19T20:31:16.123Z",
    "size": 13158,
    "path": "../public/_nuxt/CQax0eun.js"
  },
  "/_nuxt/CZFMZKV3.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"e1-jlW9bddseKztcNKWHDYddmXSmO4\"",
    "mtime": "2026-09-19T20:31:16.123Z",
    "size": 225,
    "path": "../public/_nuxt/CZFMZKV3.js"
  },
  "/_nuxt/CVJC1K3A.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"14d3-ekNEH9FrG6+REIt1HjQrocTwaTw\"",
    "mtime": "2026-09-19T20:31:16.123Z",
    "size": 5331,
    "path": "../public/_nuxt/CVJC1K3A.js"
  },
  "/_nuxt/CZgAtIhI.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"152-y3Qcfr42dA69GIAWa6Zx+yDzdaM\"",
    "mtime": "2026-09-19T20:31:16.123Z",
    "size": 338,
    "path": "../public/_nuxt/CZgAtIhI.js"
  },
  "/_nuxt/CZsbSUww.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"ab8-FOHii3ooNFrWA7ql3jTnElHn5Ds\"",
    "mtime": "2026-09-19T20:31:16.123Z",
    "size": 2744,
    "path": "../public/_nuxt/CZsbSUww.js"
  },
  "/_nuxt/CarYgOAx.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"ce7-M9Bcx9pErWhja8fmYCIp/Jf3oc4\"",
    "mtime": "2026-09-19T20:31:16.123Z",
    "size": 3303,
    "path": "../public/_nuxt/CarYgOAx.js"
  },
  "/_nuxt/CcyQuL5X.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"34c-+M7YgsjoHVEfcaraSHxkN/Xs67E\"",
    "mtime": "2026-09-19T20:31:16.123Z",
    "size": 844,
    "path": "../public/_nuxt/CcyQuL5X.js"
  },
  "/_nuxt/CdjGus-e.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"58e-95RNFk4EeiMrfcW4LhninN1P4Ag\"",
    "mtime": "2026-09-19T20:31:16.123Z",
    "size": 1422,
    "path": "../public/_nuxt/CdjGus-e.js"
  },
  "/_nuxt/Cev_MFYz.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"a3f-KRzz8Q8ehCps9Cm0qQQvMbxCIaM\"",
    "mtime": "2026-09-19T20:31:16.123Z",
    "size": 2623,
    "path": "../public/_nuxt/Cev_MFYz.js"
  },
  "/_nuxt/Changa_One-normal-400-latin.D5RyB5dD.woff2": {
    "type": "font/woff2",
    "etag": "\"1edc-SCplz/xpEJryZmnWSsy+9x2zuDY\"",
    "mtime": "2026-09-19T20:31:16.123Z",
    "size": 7900,
    "path": "../public/_nuxt/Changa_One-normal-400-latin.D5RyB5dD.woff2"
  },
  "/_nuxt/CieWodQX.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1c19-Qko2AOojoZe07e5+nB1DjrfckTw\"",
    "mtime": "2026-09-19T20:31:16.124Z",
    "size": 7193,
    "path": "../public/_nuxt/CieWodQX.js"
  },
  "/_nuxt/Ck1VKgRv.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"57ca-+avWnW7E0M6JWIbVMoiKuLEuwzI\"",
    "mtime": "2026-09-19T20:31:16.124Z",
    "size": 22474,
    "path": "../public/_nuxt/Ck1VKgRv.js"
  },
  "/_nuxt/CkfEzEKb.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"130-0hROEf84Upr5EeLvNnJDAsj75I0\"",
    "mtime": "2026-09-19T20:31:16.124Z",
    "size": 304,
    "path": "../public/_nuxt/CkfEzEKb.js"
  },
  "/_nuxt/Cmeu2Gc5.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"db-gh/N2M9Um7sZy7Rb0meNfDtMwKY\"",
    "mtime": "2026-09-19T20:31:16.124Z",
    "size": 219,
    "path": "../public/_nuxt/Cmeu2Gc5.js"
  },
  "/_nuxt/CnxxWAi5.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"18c-Wfk4E5kziK19yHk1jPTjZIfLZ1s\"",
    "mtime": "2026-09-19T20:31:16.124Z",
    "size": 396,
    "path": "../public/_nuxt/CnxxWAi5.js"
  },
  "/_nuxt/CoIi_HJc.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"84-bOtjBm4s6jdULnz1jyA5/8IdqSA\"",
    "mtime": "2026-09-19T20:31:16.124Z",
    "size": 132,
    "path": "../public/_nuxt/CoIi_HJc.js"
  },
  "/_nuxt/CpAmCgG9.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"18b-nJ/1L+5odmp3IdsqWsJVgLetVfo\"",
    "mtime": "2026-09-19T20:31:16.124Z",
    "size": 395,
    "path": "../public/_nuxt/CpAmCgG9.js"
  },
  "/_nuxt/CpF2d5nK.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"d5c-T8X2W62XiNh8sO/z/37rfJ21FGo\"",
    "mtime": "2026-09-19T20:31:16.124Z",
    "size": 3420,
    "path": "../public/_nuxt/CpF2d5nK.js"
  },
  "/_nuxt/Csg-eQr4.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1e6f-OfHrM6I2mZ7zb5YibTgwBTlt6j0\"",
    "mtime": "2026-09-19T20:31:16.124Z",
    "size": 7791,
    "path": "../public/_nuxt/Csg-eQr4.js"
  },
  "/_nuxt/CtS7rgGl.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"4a75-qKlczDnYh1NUY7XCoixYLCHAYxQ\"",
    "mtime": "2026-09-19T20:31:16.124Z",
    "size": 19061,
    "path": "../public/_nuxt/CtS7rgGl.js"
  },
  "/_nuxt/CvbYh2qZ.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1f79-oCM9IPntaqeeWspbysLZ4jcoaog\"",
    "mtime": "2026-09-19T20:31:16.124Z",
    "size": 8057,
    "path": "../public/_nuxt/CvbYh2qZ.js"
  },
  "/_nuxt/Cx-p0Mtp.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"14bc-LjsH/8XJfXE9uIFyDwQ/yWG8Ugg\"",
    "mtime": "2026-09-19T20:31:16.124Z",
    "size": 5308,
    "path": "../public/_nuxt/Cx-p0Mtp.js"
  },
  "/_nuxt/Cx4MxWQ8.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"116-N87fLVMthhcISpifkekuyYIsYkI\"",
    "mtime": "2026-09-19T20:31:16.124Z",
    "size": 278,
    "path": "../public/_nuxt/Cx4MxWQ8.js"
  },
  "/_nuxt/CyMpEsdL.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"151-2HPn7H2LhYDFrocA5FxeCHo7E/c\"",
    "mtime": "2026-09-19T20:31:16.125Z",
    "size": 337,
    "path": "../public/_nuxt/CyMpEsdL.js"
  },
  "/_nuxt/D-jsf1MT.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"36c9-vxtOB+ZFNU71HoQmQviPFpb9WBg\"",
    "mtime": "2026-09-19T20:31:16.125Z",
    "size": 14025,
    "path": "../public/_nuxt/D-jsf1MT.js"
  },
  "/_nuxt/D0ikOXA7.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"104-Zsp6JYvcq2Me/7XsdPT1I5wZqa0\"",
    "mtime": "2026-09-19T20:31:16.125Z",
    "size": 260,
    "path": "../public/_nuxt/D0ikOXA7.js"
  },
  "/_nuxt/D0xyNJ9p.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"2b6-WSGK73nl1mZ+p804nidQs+Jkpfs\"",
    "mtime": "2026-09-19T20:31:16.125Z",
    "size": 694,
    "path": "../public/_nuxt/D0xyNJ9p.js"
  },
  "/_nuxt/D1gk_kSL.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"24b-4uS2hA7RCEuWVbUpxFD5WubyASw\"",
    "mtime": "2026-09-19T20:31:16.125Z",
    "size": 587,
    "path": "../public/_nuxt/D1gk_kSL.js"
  },
  "/_nuxt/D88RU4te.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"57da-MFfUB33E+tCIcLa4CQh5vCvSs3E\"",
    "mtime": "2026-09-19T20:31:16.125Z",
    "size": 22490,
    "path": "../public/_nuxt/D88RU4te.js"
  },
  "/_nuxt/D7LJzsE2.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"408-AVh/GWEc+fczJQKDlsMdDoQgsk0\"",
    "mtime": "2026-09-19T20:31:16.125Z",
    "size": 1032,
    "path": "../public/_nuxt/D7LJzsE2.js"
  },
  "/_nuxt/D8FghtQ6.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"12f-Rng7JRyslyisDSSFHtRHykq9sao\"",
    "mtime": "2026-09-19T20:31:16.125Z",
    "size": 303,
    "path": "../public/_nuxt/D8FghtQ6.js"
  },
  "/_nuxt/D93DhX17.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"14b9-J7SAhi0Iw4uXA8dgpbnOwwI4KnU\"",
    "mtime": "2026-09-19T20:31:16.125Z",
    "size": 5305,
    "path": "../public/_nuxt/D93DhX17.js"
  },
  "/_nuxt/D94W1G2T.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"146-4LtA3Ot7qoZwojeTbRcv0F437zw\"",
    "mtime": "2026-09-19T20:31:16.125Z",
    "size": 326,
    "path": "../public/_nuxt/D94W1G2T.js"
  },
  "/_nuxt/DAp86rLY.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"c4-4Ez8pDuhFwX/T9jIME2tb3cvAXU\"",
    "mtime": "2026-09-19T20:31:16.126Z",
    "size": 196,
    "path": "../public/_nuxt/DAp86rLY.js"
  },
  "/_nuxt/D9ygZPEP.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"5f47-dBCV81s8vpybxisK9qosVakVIEs\"",
    "mtime": "2026-09-19T20:31:16.125Z",
    "size": 24391,
    "path": "../public/_nuxt/D9ygZPEP.js"
  },
  "/_nuxt/DBpWiamW.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"12a-Wcwp99DbnElTUOqkJ1fpISZazi0\"",
    "mtime": "2026-09-19T20:31:16.126Z",
    "size": 298,
    "path": "../public/_nuxt/DBpWiamW.js"
  },
  "/_nuxt/DD-HYqge.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"536-R3aIRUYCfvEOMj9DOgm9qJWgi8I\"",
    "mtime": "2026-09-19T20:31:16.126Z",
    "size": 1334,
    "path": "../public/_nuxt/DD-HYqge.js"
  },
  "/_nuxt/DEMyS6hn.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"8f-d+TiZCWZk07jQukUtcKNSD1aS4Y\"",
    "mtime": "2026-09-19T20:31:16.126Z",
    "size": 143,
    "path": "../public/_nuxt/DEMyS6hn.js"
  },
  "/_nuxt/DEPE2QTM.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"16d-2ttJtLHFi5j3sshV8dn15NKj6fw\"",
    "mtime": "2026-09-19T20:31:16.126Z",
    "size": 365,
    "path": "../public/_nuxt/DEPE2QTM.js"
  },
  "/_nuxt/DEQ3OkNK.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"26e6-2z7/E56REz+f1yGBvBSPwtgo2tI\"",
    "mtime": "2026-09-19T20:31:16.126Z",
    "size": 9958,
    "path": "../public/_nuxt/DEQ3OkNK.js"
  },
  "/_nuxt/DFF2rF8v.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"56f1-ysffLJDcfrtA3IohVWT33MdmJjk\"",
    "mtime": "2026-09-19T20:31:16.126Z",
    "size": 22257,
    "path": "../public/_nuxt/DFF2rF8v.js"
  },
  "/_nuxt/DFnodWJJ.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"e8-LldhCatT5+pedO3hBWngUbtlvRA\"",
    "mtime": "2026-09-19T20:31:16.126Z",
    "size": 232,
    "path": "../public/_nuxt/DFnodWJJ.js"
  },
  "/_nuxt/DHrii5gt.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"157-cVDAAjIchiIH82H5M6Y82mgJje4\"",
    "mtime": "2026-09-19T20:31:16.126Z",
    "size": 343,
    "path": "../public/_nuxt/DHrii5gt.js"
  },
  "/_nuxt/DMf_LZ6d.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"faa-jc9OcSEUcUiqS+d8V+86IHCgH6A\"",
    "mtime": "2026-09-19T20:31:16.126Z",
    "size": 4010,
    "path": "../public/_nuxt/DMf_LZ6d.js"
  },
  "/_nuxt/DN9zVJML.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"3f3-+CQ8u+eeX0z8Fqf7WN3If7/YDBs\"",
    "mtime": "2026-09-19T20:31:16.126Z",
    "size": 1011,
    "path": "../public/_nuxt/DN9zVJML.js"
  },
  "/_nuxt/DQ8hyCP6.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"86f-22HL4wR18bz/QAGLAwZi6+2o1yo\"",
    "mtime": "2026-09-19T20:31:16.126Z",
    "size": 2159,
    "path": "../public/_nuxt/DQ8hyCP6.js"
  },
  "/_nuxt/DSz67qBI.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"182b-aPG/b0dnTBtbjh3cpktkf5M2wyo\"",
    "mtime": "2026-09-19T20:31:16.126Z",
    "size": 6187,
    "path": "../public/_nuxt/DSz67qBI.js"
  },
  "/_nuxt/DUcCtohy.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1fa6-831P8tNwY+qL3HkEq+78YH32CCg\"",
    "mtime": "2026-09-19T20:31:16.126Z",
    "size": 8102,
    "path": "../public/_nuxt/DUcCtohy.js"
  },
  "/_nuxt/DV1IXPBo.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"15e7-T1tCy8V2V2YNV/ShP3W1uzTUZTo\"",
    "mtime": "2026-09-19T20:31:16.126Z",
    "size": 5607,
    "path": "../public/_nuxt/DV1IXPBo.js"
  },
  "/_nuxt/DXD0uIwc.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"c80-KBaKkqeefWj0qi7P03UTHqLaYVY\"",
    "mtime": "2026-09-19T20:31:16.126Z",
    "size": 3200,
    "path": "../public/_nuxt/DXD0uIwc.js"
  },
  "/_nuxt/DYmaGwPq.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"a2-3iO5WfsRYPf30Q8hcZiOENr4JO8\"",
    "mtime": "2026-09-19T20:31:16.127Z",
    "size": 162,
    "path": "../public/_nuxt/DYmaGwPq.js"
  },
  "/_nuxt/DZfmpItR.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"179-U3V/M4y/Nr1UBa8W24+JpDuE5hQ\"",
    "mtime": "2026-09-19T20:31:16.127Z",
    "size": 377,
    "path": "../public/_nuxt/DZfmpItR.js"
  },
  "/_nuxt/DbIURV7P.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1c85-uUoXsdIw/HMWmEFIFSdrHYE3czE\"",
    "mtime": "2026-09-19T20:31:16.127Z",
    "size": 7301,
    "path": "../public/_nuxt/DbIURV7P.js"
  },
  "/_nuxt/DcNpsAA_.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"2ce9-/j1nijDFwWJK/EsMbz0VNEe/ip4\"",
    "mtime": "2026-09-19T20:31:16.127Z",
    "size": 11497,
    "path": "../public/_nuxt/DcNpsAA_.js"
  },
  "/_nuxt/Dger1ZHH.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1a0-PCQo4bP4Rs/+kGnLeDL55KeAly0\"",
    "mtime": "2026-09-19T20:31:16.127Z",
    "size": 416,
    "path": "../public/_nuxt/Dger1ZHH.js"
  },
  "/_nuxt/DgkmU1ii.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"143-nB4LA+2F2uh3r2lfxOq/Nm9UOG8\"",
    "mtime": "2026-09-19T20:31:16.127Z",
    "size": 323,
    "path": "../public/_nuxt/DgkmU1ii.js"
  },
  "/_nuxt/Dj-kpSDA.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"11c4-AtABoOkxze500Vx2hL+JNIfzhMw\"",
    "mtime": "2026-09-19T20:31:16.127Z",
    "size": 4548,
    "path": "../public/_nuxt/Dj-kpSDA.js"
  },
  "/_nuxt/CwleO7wP.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"26decd-BxYYE7yq4vXrloCm2ERERMUWe54\"",
    "mtime": "2026-09-19T20:31:16.125Z",
    "size": 2547405,
    "path": "../public/_nuxt/CwleO7wP.js"
  },
  "/_nuxt/DjkvJJ0r.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"3fb-4wKpBhGLNg2iS8tnxnTmU7sdzpQ\"",
    "mtime": "2026-09-19T20:31:16.127Z",
    "size": 1019,
    "path": "../public/_nuxt/DjkvJJ0r.js"
  },
  "/_nuxt/Dn75Ekkx.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"3014-Qj+CpgAP6OZ47i9bbbNCqzh+44U\"",
    "mtime": "2026-09-19T20:31:16.127Z",
    "size": 12308,
    "path": "../public/_nuxt/Dn75Ekkx.js"
  },
  "/_nuxt/DoXVNanR.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"e9-3QKkx3u7usIQF/UCHUAqHnAbOx4\"",
    "mtime": "2026-09-19T20:31:16.127Z",
    "size": 233,
    "path": "../public/_nuxt/DoXVNanR.js"
  },
  "/_nuxt/DssyCV7S.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"3544-K+AooDjUJr5F0987e6nogm7wt4Q\"",
    "mtime": "2026-09-19T20:31:16.127Z",
    "size": 13636,
    "path": "../public/_nuxt/DssyCV7S.js"
  },
  "/_nuxt/Dsz-wkxD.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"4884-pyv7jI4LoLWAkueh1aF9sPf+fRM\"",
    "mtime": "2026-09-19T20:31:16.127Z",
    "size": 18564,
    "path": "../public/_nuxt/Dsz-wkxD.js"
  },
  "/_nuxt/Email.Df0sCFD7.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"169-PkzZfAqI4iekLLrExACXKkXCYVg\"",
    "mtime": "2026-09-19T20:31:16.127Z",
    "size": 361,
    "path": "../public/_nuxt/Email.Df0sCFD7.css"
  },
  "/_nuxt/EtEBbTze.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"f2c-AAuIPpecNy7s8BFeKMdXrOiRGGo\"",
    "mtime": "2026-09-19T20:31:16.127Z",
    "size": 3884,
    "path": "../public/_nuxt/EtEBbTze.js"
  },
  "/_nuxt/Footer.CKYRERfK.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"72e-E/KnJEratWWxAwRUjVSoiJDxg+4\"",
    "mtime": "2026-09-19T20:31:16.127Z",
    "size": 1838,
    "path": "../public/_nuxt/Footer.CKYRERfK.css"
  },
  "/_nuxt/GwJKigdA.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"4a1-+6wjc74CSrO3HiKu8AtSUN0cV8g\"",
    "mtime": "2026-09-19T20:31:16.127Z",
    "size": 1185,
    "path": "../public/_nuxt/GwJKigdA.js"
  },
  "/_nuxt/HGRPRHnp.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"4cb-dfbTv5b/LDTKl1eT0Ux9OENq4CI\"",
    "mtime": "2026-09-19T20:31:16.127Z",
    "size": 1227,
    "path": "../public/_nuxt/HGRPRHnp.js"
  },
  "/_nuxt/KFEW6KMY.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"cbe-IHfdtKh1Cc9ZGJY1KLsZlTMa0EU\"",
    "mtime": "2026-09-19T20:31:16.128Z",
    "size": 3262,
    "path": "../public/_nuxt/KFEW6KMY.js"
  },
  "/_nuxt/KrGg0ZRh.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"4e1-pDzO/b7l5H4+sQ/KVP15v71GPvE\"",
    "mtime": "2026-09-19T20:31:16.128Z",
    "size": 1249,
    "path": "../public/_nuxt/KrGg0ZRh.js"
  },
  "/_nuxt/LocationInput.BvmyU8n6.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"3b5c-wwa/sbc24SWcSYNNmVNzogUUvVE\"",
    "mtime": "2026-09-19T20:31:16.128Z",
    "size": 15196,
    "path": "../public/_nuxt/LocationInput.BvmyU8n6.css"
  },
  "/_nuxt/MV3ffMHp.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1011-yS/ClIfm0M0YnHkvaThxTdzTzn0\"",
    "mtime": "2026-09-19T20:31:16.128Z",
    "size": 4113,
    "path": "../public/_nuxt/MV3ffMHp.js"
  },
  "/_nuxt/Mj7X9kvi.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"595-peQVsuek+92053Ltv9NFW4x3W8c\"",
    "mtime": "2026-09-19T20:31:16.128Z",
    "size": 1429,
    "path": "../public/_nuxt/Mj7X9kvi.js"
  },
  "/_nuxt/O6AV9quA.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"b6f-ZSSJF69Q+4q72LK5kTgv5J8yKaA\"",
    "mtime": "2026-09-19T20:31:16.128Z",
    "size": 2927,
    "path": "../public/_nuxt/O6AV9quA.js"
  },
  "/_nuxt/Open_Sans-normal-300-cyrillic-ext.D8xHCTEw.woff2": {
    "type": "font/woff2",
    "etag": "\"c074-29bRoZAujgnMMOB3b0HvnYPQygI\"",
    "mtime": "2026-09-19T20:31:16.128Z",
    "size": 49268,
    "path": "../public/_nuxt/Open_Sans-normal-300-cyrillic-ext.D8xHCTEw.woff2"
  },
  "/_nuxt/Open_Sans-normal-300-cyrillic.bOs07Rf4.woff2": {
    "type": "font/woff2",
    "etag": "\"67dc-XV+juFoXRehn5EqMbdOHfmUUkf0\"",
    "mtime": "2026-09-19T20:31:16.128Z",
    "size": 26588,
    "path": "../public/_nuxt/Open_Sans-normal-300-cyrillic.bOs07Rf4.woff2"
  },
  "/_nuxt/Open_Sans-normal-300-greek-ext.Bm9CHu9r.woff2": {
    "type": "font/woff2",
    "etag": "\"1198-bKg4ah0hcPIz8jutgTz4UZvQYHg\"",
    "mtime": "2026-09-19T20:31:16.128Z",
    "size": 4504,
    "path": "../public/_nuxt/Open_Sans-normal-300-greek-ext.Bm9CHu9r.woff2"
  },
  "/_nuxt/Open_Sans-normal-300-greek.8neIfJ3r.woff2": {
    "type": "font/woff2",
    "etag": "\"5354-NcGzs1E+id0NSaMRFS0J2fycQ48\"",
    "mtime": "2026-09-19T20:31:16.128Z",
    "size": 21332,
    "path": "../public/_nuxt/Open_Sans-normal-300-greek.8neIfJ3r.woff2"
  },
  "/_nuxt/Open_Sans-normal-300-hebrew.BjjtG49P.woff2": {
    "type": "font/woff2",
    "etag": "\"4218-vYUkpStfdVvVUlvEux5936Q7GVM\"",
    "mtime": "2026-09-19T20:31:16.128Z",
    "size": 16920,
    "path": "../public/_nuxt/Open_Sans-normal-300-hebrew.BjjtG49P.woff2"
  },
  "/_nuxt/Open_Sans-normal-300-latin-ext.DPNHYqvY.woff2": {
    "type": "font/woff2",
    "etag": "\"8954-P9Hwc0O9M6U803T38Qfb357/rgM\"",
    "mtime": "2026-09-19T20:31:16.128Z",
    "size": 35156,
    "path": "../public/_nuxt/Open_Sans-normal-300-latin-ext.DPNHYqvY.woff2"
  },
  "/_nuxt/Open_Sans-normal-300-latin.CWNzRldh.woff2": {
    "type": "font/woff2",
    "etag": "\"bcc0-toFgyTM6+DP+SDkos+9xKMB6VqA\"",
    "mtime": "2026-09-19T20:31:16.128Z",
    "size": 48320,
    "path": "../public/_nuxt/Open_Sans-normal-300-latin.CWNzRldh.woff2"
  },
  "/_nuxt/Open_Sans-normal-300-math.C1FvUlkR.woff2": {
    "type": "font/woff2",
    "etag": "\"cac8-ycHLts6tkF/fHhn6ygcdCcorZfg\"",
    "mtime": "2026-09-19T20:31:16.128Z",
    "size": 51912,
    "path": "../public/_nuxt/Open_Sans-normal-300-math.C1FvUlkR.woff2"
  },
  "/_nuxt/Open_Sans-normal-300-symbols.BAf6-sld.woff2": {
    "type": "font/woff2",
    "etag": "\"67e4-3KgI1tFpZcQL+6Tks8ioGfhDiQ0\"",
    "mtime": "2026-09-19T20:31:16.128Z",
    "size": 26596,
    "path": "../public/_nuxt/Open_Sans-normal-300-symbols.BAf6-sld.woff2"
  },
  "/_nuxt/Open_Sans-normal-300-vietnamese.UygKeDyW.woff2": {
    "type": "font/woff2",
    "etag": "\"4070-d6z8w6zlISaZi2Wsh0pTw+AeWnw\"",
    "mtime": "2026-09-19T20:31:16.128Z",
    "size": 16496,
    "path": "../public/_nuxt/Open_Sans-normal-300-vietnamese.UygKeDyW.woff2"
  },
  "/_nuxt/PhoneInput._OUkohX1.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"33d-RCguugb0xgTJNkwhKi1UJHK3ufQ\"",
    "mtime": "2026-09-19T20:31:16.129Z",
    "size": 829,
    "path": "../public/_nuxt/PhoneInput._OUkohX1.css"
  },
  "/_nuxt/ProfileVehicle.DMGWY8FX.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"b5-44DPVcdRKaylQ9c4rdxN2Jtu82U\"",
    "mtime": "2026-09-19T20:31:16.129Z",
    "size": 181,
    "path": "../public/_nuxt/ProfileVehicle.DMGWY8FX.css"
  },
  "/_nuxt/Pyo9gvCx.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1f5-xox7oLuchWws+G8eILQM/ql47lY\"",
    "mtime": "2026-09-19T20:31:16.129Z",
    "size": 501,
    "path": "../public/_nuxt/Pyo9gvCx.js"
  },
  "/_nuxt/QLCnsYeG.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"5ce-KhEpUgC3JZvdZtOrhKZYtvVbQO0\"",
    "mtime": "2026-09-19T20:31:16.129Z",
    "size": 1486,
    "path": "../public/_nuxt/QLCnsYeG.js"
  },
  "/_nuxt/Rc5iGkXs.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"8c-IngbTPHnECdEp4KD3aAjmkwQVdE\"",
    "mtime": "2026-09-19T20:31:16.129Z",
    "size": 140,
    "path": "../public/_nuxt/Rc5iGkXs.js"
  },
  "/_nuxt/ResendVerification.DJOL7qMQ.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"b1-D3ICdlRbwsxv2I7rXANlc9dP+bk\"",
    "mtime": "2026-09-19T20:31:16.129Z",
    "size": 177,
    "path": "../public/_nuxt/ResendVerification.DJOL7qMQ.css"
  },
  "/_nuxt/SFw7BBwU.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"ab-SSVD4T90OgxAZPWEypBwU66tnzI\"",
    "mtime": "2026-09-19T20:31:16.129Z",
    "size": 171,
    "path": "../public/_nuxt/SFw7BBwU.js"
  },
  "/_nuxt/Security.BipAaK_Q.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"21d-qdoWtFMBEeKO1UFQ7Qnk28No2D0\"",
    "mtime": "2026-09-19T20:31:16.129Z",
    "size": 541,
    "path": "../public/_nuxt/Security.BipAaK_Q.css"
  },
  "/_nuxt/SjcFxlpI.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"370a-0RbPLQyqOOW9WfGlxltUFWxW0Tw\"",
    "mtime": "2026-09-19T20:31:16.129Z",
    "size": 14090,
    "path": "../public/_nuxt/SjcFxlpI.js"
  },
  "/_nuxt/StepLoading.DbQk9j54.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"29f-KITVh90hdE82EZUS53GC7M9FZbA\"",
    "mtime": "2026-09-19T20:31:16.129Z",
    "size": 671,
    "path": "../public/_nuxt/StepLoading.DbQk9j54.css"
  },
  "/_nuxt/U4kTvvz9.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"8de-mn/zT5DF2KMynClOThbWy/b005Q\"",
    "mtime": "2026-09-19T20:31:16.129Z",
    "size": 2270,
    "path": "../public/_nuxt/U4kTvvz9.js"
  },
  "/_nuxt/UJ7WXbzx.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"3ed9-XTx4cGVuZTS4nJkw0VtmSmMR5ao\"",
    "mtime": "2026-09-19T20:31:16.129Z",
    "size": 16089,
    "path": "../public/_nuxt/UJ7WXbzx.js"
  },
  "/_nuxt/Utyzh4yA.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1ca6-JinIkyR6xN6/gaClM1JYYIGXR4w\"",
    "mtime": "2026-09-19T20:31:16.129Z",
    "size": 7334,
    "path": "../public/_nuxt/Utyzh4yA.js"
  },
  "/_nuxt/WvTn4oQ2.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"c3-XZECkQMuTNybx2NwCQ4Au1TmfUY\"",
    "mtime": "2026-09-19T20:31:16.129Z",
    "size": 195,
    "path": "../public/_nuxt/WvTn4oQ2.js"
  },
  "/_nuxt/XMVRYoLZ.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"11a9-Jmf7VLPVomxkN6EaVJCxIy6UUlE\"",
    "mtime": "2026-09-19T20:31:16.129Z",
    "size": 4521,
    "path": "../public/_nuxt/XMVRYoLZ.js"
  },
  "/_nuxt/X_zjl5LE.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"68e3-8hmKPVPspSBmuq2oRuy2LBizwj0\"",
    "mtime": "2026-09-19T20:31:16.130Z",
    "size": 26851,
    "path": "../public/_nuxt/X_zjl5LE.js"
  },
  "/_nuxt/_PNu3upo.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"15db-ImDIUVjaIC+6T2m4dfiUkvkDfpQ\"",
    "mtime": "2026-09-19T20:31:16.130Z",
    "size": 5595,
    "path": "../public/_nuxt/_PNu3upo.js"
  },
  "/_nuxt/_id_.BZDTWKtv.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"a3-Jf7jbmbXTurYAM7LzwpTmODmwBU\"",
    "mtime": "2026-09-19T20:31:16.130Z",
    "size": 163,
    "path": "../public/_nuxt/_id_.BZDTWKtv.css"
  },
  "/_nuxt/aEmIUnyj.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"147-+V2o1zdoaC4ZQLAYRl6hrbBNmQI\"",
    "mtime": "2026-09-19T20:31:16.130Z",
    "size": 327,
    "path": "../public/_nuxt/aEmIUnyj.js"
  },
  "/_nuxt/about.DrXsem8q.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"46d-EVu82eHP+0w1pLiVJdFTGSBDqU4\"",
    "mtime": "2026-09-19T20:31:16.130Z",
    "size": 1133,
    "path": "../public/_nuxt/about.DrXsem8q.css"
  },
  "/_nuxt/_id_.DrqSo9EP.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"b5-sbssk8kQdu5aGq67VzEqP5JQTVk\"",
    "mtime": "2026-09-19T20:31:16.130Z",
    "size": 181,
    "path": "../public/_nuxt/_id_.DrqSo9EP.css"
  },
  "/_nuxt/c9qoD07e.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"24f4-mlm3+7szbceCUtC9ZUA3rLqLbZA\"",
    "mtime": "2026-09-19T20:31:16.130Z",
    "size": 9460,
    "path": "../public/_nuxt/c9qoD07e.js"
  },
  "/_nuxt/callback.C_7aZFrx.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"177-FAEXwI1G07Gs+IEGGRSpvkHjZSY\"",
    "mtime": "2026-09-19T20:31:16.130Z",
    "size": 375,
    "path": "../public/_nuxt/callback.C_7aZFrx.css"
  },
  "/_nuxt/cjx8_tox.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"161-ux//+8jHx5i2AN04lBSx6cMszyg\"",
    "mtime": "2026-09-19T20:31:16.130Z",
    "size": 353,
    "path": "../public/_nuxt/cjx8_tox.js"
  },
  "/_nuxt/es9dvuUL.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"223d-h6D6ubqd+VUU/yh3OXUQZvXMI2w\"",
    "mtime": "2026-09-19T20:31:16.130Z",
    "size": 8765,
    "path": "../public/_nuxt/es9dvuUL.js"
  },
  "/_nuxt/entry.Cs2NQxQX.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"29129-yhsavHcK6bDNeQzOEAS4G9hrxO0\"",
    "mtime": "2026-09-19T20:31:16.130Z",
    "size": 168233,
    "path": "../public/_nuxt/entry.Cs2NQxQX.css"
  },
  "/_nuxt/f2MVg63v.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"96-PYwI22NtiOSxc2VQNoBrc8bPnTE\"",
    "mtime": "2026-09-19T20:31:16.130Z",
    "size": 150,
    "path": "../public/_nuxt/f2MVg63v.js"
  },
  "/_nuxt/hhAptL9L.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"42fc-FxmmEuwKjKyX69g7YcS8wdCd1Ic\"",
    "mtime": "2026-09-19T20:31:16.130Z",
    "size": 17148,
    "path": "../public/_nuxt/hhAptL9L.js"
  },
  "/_nuxt/htHiDay5.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"4d4-HaomfG3PB7W0S7QcUC1NpXXwvNo\"",
    "mtime": "2026-09-19T20:31:16.130Z",
    "size": 1236,
    "path": "../public/_nuxt/htHiDay5.js"
  },
  "/_nuxt/index.Bve_6_uC.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"d8-yARErfItoQsRPQLFE4txeVUW4k8\"",
    "mtime": "2026-09-19T20:31:16.131Z",
    "size": 216,
    "path": "../public/_nuxt/index.Bve_6_uC.css"
  },
  "/_nuxt/index.DEh2CRqL.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"178-S6J8NVG/8OL6vW4lQHVVqSZi1Us\"",
    "mtime": "2026-09-19T20:31:16.131Z",
    "size": 376,
    "path": "../public/_nuxt/index.DEh2CRqL.css"
  },
  "/_nuxt/index.DRFmt8xB.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"307-v+hDSLiRz582HIfJVlLBPo3GqOY\"",
    "mtime": "2026-09-19T20:31:16.131Z",
    "size": 775,
    "path": "../public/_nuxt/index.DRFmt8xB.css"
  },
  "/_nuxt/lm3vcx_n.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"774-s80MLgiqkx821YVq9nMAVzt7kG4\"",
    "mtime": "2026-09-19T20:31:16.131Z",
    "size": 1908,
    "path": "../public/_nuxt/lm3vcx_n.js"
  },
  "/_nuxt/login.C4s9P2jv.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"19e-95YchLwdxXlicR1X+5T/nMNovoc\"",
    "mtime": "2026-09-19T20:31:16.131Z",
    "size": 414,
    "path": "../public/_nuxt/login.C4s9P2jv.css"
  },
  "/_nuxt/nAOyedh8.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"2e4-ve/Sbv7NfiU8234pCAfGoKS4vqg\"",
    "mtime": "2026-09-19T20:31:16.131Z",
    "size": 740,
    "path": "../public/_nuxt/nAOyedh8.js"
  },
  "/_nuxt/mfd--nNb.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"22b4-qU/i4ZoINMpfiFyg63IVgpnlSaM\"",
    "mtime": "2026-09-19T20:31:16.131Z",
    "size": 8884,
    "path": "../public/_nuxt/mfd--nNb.js"
  },
  "/_nuxt/njhuh5PI.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"264-WFifexODj4iUuyeMOAlXSeK5Lls\"",
    "mtime": "2026-09-19T20:31:16.131Z",
    "size": 612,
    "path": "../public/_nuxt/njhuh5PI.js"
  },
  "/_nuxt/pKcQkc6G.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"65c-9wNLr8+C2OCBfjP+/XL/BIR8OKI\"",
    "mtime": "2026-09-19T20:31:16.131Z",
    "size": 1628,
    "path": "../public/_nuxt/pKcQkc6G.js"
  },
  "/_nuxt/profile.PtSGIHXM.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"14a-sg5EP4mjAxhzpEBZdHKXq9JCgeY\"",
    "mtime": "2026-09-19T20:31:16.131Z",
    "size": 330,
    "path": "../public/_nuxt/profile.PtSGIHXM.css"
  },
  "/_nuxt/qJA8Mku9.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"3355-1adT3lHx1JcEDCiGfNo9MMg4/Uo\"",
    "mtime": "2026-09-19T20:31:16.131Z",
    "size": 13141,
    "path": "../public/_nuxt/qJA8Mku9.js"
  },
  "/_nuxt/qMsI--2O.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"e6-DLIWxOPJ9Wfu3fLygD9tx686LXs\"",
    "mtime": "2026-09-19T20:31:16.131Z",
    "size": 230,
    "path": "../public/_nuxt/qMsI--2O.js"
  },
  "/_nuxt/settings.kdFMGPma.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"b5-+4lg8c2gsky/KgfiCOXYBT1wArI\"",
    "mtime": "2026-09-19T20:31:16.131Z",
    "size": 181,
    "path": "../public/_nuxt/settings.kdFMGPma.css"
  },
  "/_nuxt/sqLkc4CG.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1aa-ms/QBxOc4YlCaIX8oAyfFnUKDl4\"",
    "mtime": "2026-09-19T20:31:16.131Z",
    "size": 426,
    "path": "../public/_nuxt/sqLkc4CG.js"
  },
  "/_nuxt/tOgYgqdU.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"731-GcLXuUDDxS449ktMxOj5/9g3VNM\"",
    "mtime": "2026-09-19T20:31:16.131Z",
    "size": 1841,
    "path": "../public/_nuxt/tOgYgqdU.js"
  },
  "/_nuxt/vMurGrvW.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"ee-SX+D32Qn/bqkKt4b7Wh2SaPF3Bg\"",
    "mtime": "2026-09-19T20:31:16.131Z",
    "size": 238,
    "path": "../public/_nuxt/vMurGrvW.js"
  },
  "/_nuxt/vayPFHUq.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"e8-vrmX51EGVVGC2QUPictpAvgfkus\"",
    "mtime": "2026-09-19T20:31:16.131Z",
    "size": 232,
    "path": "../public/_nuxt/vayPFHUq.js"
  },
  "/_nuxt/w4b81HDG.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1d2a-M7X9gL4xoguh32TyGauyJ3QNXdk\"",
    "mtime": "2026-09-19T20:31:16.132Z",
    "size": 7466,
    "path": "../public/_nuxt/w4b81HDG.js"
  },
  "/_nuxt/xMvNHiD_.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"10e-Erm3Am+3VDTm9UAHU0Av6aP7T4M\"",
    "mtime": "2026-09-19T20:31:16.132Z",
    "size": 270,
    "path": "../public/_nuxt/xMvNHiD_.js"
  },
  "/_nuxt/yvDnXYef.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"3f21f-+YOj28Ewv1I7W12+BR/0eSWHJPc\"",
    "mtime": "2026-09-19T20:31:16.132Z",
    "size": 258591,
    "path": "../public/_nuxt/yvDnXYef.js"
  },
  "/_nuxt/zXZwXXru.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"4e-QVt+j3JNZtnGVvoNgDMiDNxBnB0\"",
    "mtime": "2026-09-19T20:31:16.132Z",
    "size": 78,
    "path": "../public/_nuxt/zXZwXXru.js"
  },
  "/_nuxt/builds/latest.json": {
    "type": "application/json",
    "etag": "\"47-yVVWkf1dBKC2RjIhT+vmoB6KPns\"",
    "mtime": "2026-09-19T20:31:16.021Z",
    "size": 71,
    "path": "../public/_nuxt/builds/latest.json"
  },
  "/_nuxt/builds/meta/3a292c5a-cf76-43fa-ae55-64f40001c158.json": {
    "type": "application/json",
    "etag": "\"8b-8mAaTBxoRr4jI2E0qB7TJrYfHfQ\"",
    "mtime": "2026-09-19T20:31:16.015Z",
    "size": 139,
    "path": "../public/_nuxt/builds/meta/3a292c5a-cf76-43fa-ae55-64f40001c158.json"
  }
};

const _DRIVE_LETTER_START_RE = /^[A-Za-z]:\//;
function normalizeWindowsPath(input = "") {
  if (!input) {
    return input;
  }
  return input.replace(/\\/g, "/").replace(_DRIVE_LETTER_START_RE, (r) => r.toUpperCase());
}
const _IS_ABSOLUTE_RE = /^[/\\](?![/\\])|^[/\\]{2}(?!\.)|^[A-Za-z]:[/\\]/;
const _DRIVE_LETTER_RE = /^[A-Za-z]:$/;
function cwd() {
  if (typeof process !== "undefined" && typeof process.cwd === "function") {
    return process.cwd().replace(/\\/g, "/");
  }
  return "/";
}
const resolve$1 = function(...arguments_) {
  arguments_ = arguments_.map((argument) => normalizeWindowsPath(argument));
  let resolvedPath = "";
  let resolvedAbsolute = false;
  for (let index = arguments_.length - 1; index >= -1 && !resolvedAbsolute; index--) {
    const path = index >= 0 ? arguments_[index] : cwd();
    if (!path || path.length === 0) {
      continue;
    }
    resolvedPath = `${path}/${resolvedPath}`;
    resolvedAbsolute = isAbsolute(path);
  }
  resolvedPath = normalizeString(resolvedPath, !resolvedAbsolute);
  if (resolvedAbsolute && !isAbsolute(resolvedPath)) {
    return `/${resolvedPath}`;
  }
  return resolvedPath.length > 0 ? resolvedPath : ".";
};
function normalizeString(path, allowAboveRoot) {
  let res = "";
  let lastSegmentLength = 0;
  let lastSlash = -1;
  let dots = 0;
  let char = null;
  for (let index = 0; index <= path.length; ++index) {
    if (index < path.length) {
      char = path[index];
    } else if (char === "/") {
      break;
    } else {
      char = "/";
    }
    if (char === "/") {
      if (lastSlash === index - 1 || dots === 1) ; else if (dots === 2) {
        if (res.length < 2 || lastSegmentLength !== 2 || res[res.length - 1] !== "." || res[res.length - 2] !== ".") {
          if (res.length > 2) {
            const lastSlashIndex = res.lastIndexOf("/");
            if (lastSlashIndex === -1) {
              res = "";
              lastSegmentLength = 0;
            } else {
              res = res.slice(0, lastSlashIndex);
              lastSegmentLength = res.length - 1 - res.lastIndexOf("/");
            }
            lastSlash = index;
            dots = 0;
            continue;
          } else if (res.length > 0) {
            res = "";
            lastSegmentLength = 0;
            lastSlash = index;
            dots = 0;
            continue;
          }
        }
        if (allowAboveRoot) {
          res += res.length > 0 ? "/.." : "..";
          lastSegmentLength = 2;
        }
      } else {
        if (res.length > 0) {
          res += `/${path.slice(lastSlash + 1, index)}`;
        } else {
          res = path.slice(lastSlash + 1, index);
        }
        lastSegmentLength = index - lastSlash - 1;
      }
      lastSlash = index;
      dots = 0;
    } else if (char === "." && dots !== -1) {
      ++dots;
    } else {
      dots = -1;
    }
  }
  return res;
}
const isAbsolute = function(p) {
  return _IS_ABSOLUTE_RE.test(p);
};
const dirname = function(p) {
  const segments = normalizeWindowsPath(p).replace(/\/$/, "").split("/").slice(0, -1);
  if (segments.length === 1 && _DRIVE_LETTER_RE.test(segments[0])) {
    segments[0] += "/";
  }
  return segments.join("/") || (isAbsolute(p) ? "/" : ".");
};

function readAsset (id) {
  const serverDir = dirname(fileURLToPath(globalThis._importMeta_.url));
  return promises.readFile(resolve$1(serverDir, assets[id].path))
}

const publicAssetBases = {"/_nuxt/builds/meta/":{"maxAge":31536000},"/_nuxt/builds/":{"maxAge":1},"/_nuxt/":{"maxAge":31536000}};

function isPublicAssetURL(id = '') {
  if (assets[id]) {
    return true
  }
  for (const base in publicAssetBases) {
    if (id.startsWith(base)) { return true }
  }
  return false
}

function getAsset (id) {
  return assets[id]
}

const METHODS = /* @__PURE__ */ new Set(["HEAD", "GET"]);
const EncodingMap = { gzip: ".gz", br: ".br" };
const _gU6oUG = eventHandler((event) => {
  if (event.method && !METHODS.has(event.method)) {
    return;
  }
  let id = decodePath(
    withLeadingSlash(withoutTrailingSlash(parseURL(event.path).pathname))
  );
  let asset;
  const encodingHeader = String(
    getRequestHeader(event, "accept-encoding") || ""
  );
  const encodings = [
    ...encodingHeader.split(",").map((e) => EncodingMap[e.trim()]).filter(Boolean).sort(),
    ""
  ];
  for (const encoding of encodings) {
    for (const _id of [id + encoding, joinURL(id, "index.html" + encoding)]) {
      const _asset = getAsset(_id);
      if (_asset) {
        asset = _asset;
        id = _id;
        break;
      }
    }
  }
  if (!asset) {
    if (isPublicAssetURL(id)) {
      removeResponseHeader(event, "Cache-Control");
      throw createError$1({ statusCode: 404 });
    }
    return;
  }
  if (asset.encoding !== void 0) {
    appendResponseHeader(event, "Vary", "Accept-Encoding");
  }
  const ifNotMatch = getRequestHeader(event, "if-none-match") === asset.etag;
  if (ifNotMatch) {
    setResponseStatus(event, 304, "Not Modified");
    return "";
  }
  const ifModifiedSinceH = getRequestHeader(event, "if-modified-since");
  const mtimeDate = new Date(asset.mtime);
  if (ifModifiedSinceH && asset.mtime && new Date(ifModifiedSinceH) >= mtimeDate) {
    setResponseStatus(event, 304, "Not Modified");
    return "";
  }
  if (asset.type && !getResponseHeader(event, "Content-Type")) {
    setResponseHeader(event, "Content-Type", asset.type);
  }
  if (asset.etag && !getResponseHeader(event, "ETag")) {
    setResponseHeader(event, "ETag", asset.etag);
  }
  if (asset.mtime && !getResponseHeader(event, "Last-Modified")) {
    setResponseHeader(event, "Last-Modified", mtimeDate.toUTCString());
  }
  if (asset.encoding && !getResponseHeader(event, "Content-Encoding")) {
    setResponseHeader(event, "Content-Encoding", asset.encoding);
  }
  if (asset.size > 0 && !getResponseHeader(event, "Content-Length")) {
    setResponseHeader(event, "Content-Length", asset.size);
  }
  return readAsset(id);
});

const _SxA8c9 = defineEventHandler(() => {});

const r=Object.create(null),i=e=>globalThis.process?.env||globalThis._importMeta_.env||globalThis.Deno?.env.toObject()||globalThis.__env__||(e?r:globalThis),o=new Proxy(r,{get(e,s){return i()[s]??r[s]},has(e,s){const E=i();return s in E||s in r},set(e,s,E){const B=i(true);return B[s]=E,true},deleteProperty(e,s){if(!s)return  false;const E=i(true);return delete E[s],true},ownKeys(){const e=i(true);return Object.keys(e)}}),t=typeof process<"u"&&process.env&&"production"||"",f=[["APPVEYOR"],["AWS_AMPLIFY","AWS_APP_ID",{ci:true}],["AZURE_PIPELINES","SYSTEM_TEAMFOUNDATIONCOLLECTIONURI"],["AZURE_STATIC","INPUT_AZURE_STATIC_WEB_APPS_API_TOKEN"],["APPCIRCLE","AC_APPCIRCLE"],["BAMBOO","bamboo_planKey"],["BITBUCKET","BITBUCKET_COMMIT"],["BITRISE","BITRISE_IO"],["BUDDY","BUDDY_WORKSPACE_ID"],["BUILDKITE"],["CIRCLE","CIRCLECI"],["CIRRUS","CIRRUS_CI"],["CLOUDFLARE_PAGES","CF_PAGES",{ci:true}],["CLOUDFLARE_WORKERS","WORKERS_CI",{ci:true}],["CODEBUILD","CODEBUILD_BUILD_ARN"],["CODEFRESH","CF_BUILD_ID"],["DRONE"],["DRONE","DRONE_BUILD_EVENT"],["DSARI"],["GITHUB_ACTIONS"],["GITLAB","GITLAB_CI"],["GITLAB","CI_MERGE_REQUEST_ID"],["GOCD","GO_PIPELINE_LABEL"],["LAYERCI"],["HUDSON","HUDSON_URL"],["JENKINS","JENKINS_URL"],["MAGNUM"],["NETLIFY"],["NETLIFY","NETLIFY_LOCAL",{ci:false}],["NEVERCODE"],["RENDER"],["SAIL","SAILCI"],["SEMAPHORE"],["SCREWDRIVER"],["SHIPPABLE"],["SOLANO","TDDIUM"],["STRIDER"],["TEAMCITY","TEAMCITY_VERSION"],["TRAVIS"],["VERCEL","NOW_BUILDER"],["VERCEL","VERCEL",{ci:false}],["VERCEL","VERCEL_ENV",{ci:false}],["APPCENTER","APPCENTER_BUILD_ID"],["CODESANDBOX","CODESANDBOX_SSE",{ci:false}],["CODESANDBOX","CODESANDBOX_HOST",{ci:false}],["STACKBLITZ"],["STORMKIT"],["CLEAVR"],["ZEABUR"],["CODESPHERE","CODESPHERE_APP_ID",{ci:true}],["RAILWAY","RAILWAY_PROJECT_ID"],["RAILWAY","RAILWAY_SERVICE_ID"],["DENO-DEPLOY","DENO_DEPLOYMENT_ID"],["FIREBASE_APP_HOSTING","FIREBASE_APP_HOSTING",{ci:true}]];function b(){if(globalThis.process?.env)for(const e of f){const s=e[1]||e[0];if(globalThis.process?.env[s])return {name:e[0].toLowerCase(),...e[2]}}return globalThis.process?.env?.SHELL==="/bin/jsh"&&globalThis.process?.versions?.webcontainer?{name:"stackblitz",ci:false}:{name:"",ci:false}}const l=b();l.name;function n(e){return e?e!=="false":false}const I=globalThis.process?.platform||"",T=n(o.CI)||l.ci!==false,R=n(globalThis.process?.stdout&&globalThis.process?.stdout.isTTY);n(o.DEBUG);const a=t==="test"||n(o.TEST),h=t==="dev"||t==="development";n(o.MINIMAL)||T||a||!R;const A=/^win/i.test(I);!n(o.NO_COLOR)&&(n(o.FORCE_COLOR)||(R||A)&&o.TERM!=="dumb"||T);const C=(globalThis.process?.versions?.node||"").replace(/^v/,"")||null;Number(C?.split(".")[0])||null;const W=globalThis.process||Object.create(null),_={versions:{}};new Proxy(W,{get(e,s){if(s==="env")return o;if(s in e)return e[s];if(s in _)return _[s]}});const O=globalThis.process?.release?.name==="node",c=!!globalThis.Bun||!!globalThis.process?.versions?.bun,D=!!globalThis.Deno,L=!!globalThis.fastly,S=!!globalThis.Netlify,u=!!globalThis.EdgeRuntime,N=globalThis.navigator?.userAgent==="Cloudflare-Workers",F=[[S,"netlify"],[u,"edge-light"],[N,"workerd"],[L,"fastly"],[D,"deno"],[c,"bun"],[O,"node"]];function G(){const e=F.find(s=>s[0]);if(e)return {name:e[1]}}const P=G();P?.name||"";

function isLocalhostHost(host) {
  if (!host || host.startsWith("localhost") || host.startsWith("127.") || host.startsWith("0.0.0.0"))
    return true;
  const hostname = host.startsWith("[") ? host.slice(0, host.indexOf("]") + 1) : host;
  return hostname === "[::1]" || hostname === "::1" || hostname === "[::]" || hostname === "::";
}
function extractHostname(host) {
  if (host.startsWith("[")) {
    const close = host.indexOf("]");
    return close !== -1 ? host.slice(0, close + 1) : host;
  }
  const colonCount = host.split(":").length - 1;
  return colonCount === 1 ? host.slice(0, host.indexOf(":")) : host;
}
function splitHostPort(host) {
  if (host.startsWith("[")) {
    const close = host.indexOf("]");
    const hostname = close !== -1 ? host.slice(0, close + 1) : host;
    const port = close !== -1 && host[close + 1] === ":" ? host.slice(close + 2) : "";
    const normalized = hostname === "[::1]" || hostname === "[::]" ? "localhost" : hostname;
    return { host: normalized, port };
  }
  if (host === "0.0.0.0" || host.startsWith("0.0.0.0:")) {
    const i = host.indexOf(":");
    return { host: "localhost", port: i !== -1 ? host.slice(i + 1) : "" };
  }
  const colonCount = host.split(":").length - 1;
  if (colonCount === 1) {
    const i = host.indexOf(":");
    return { host: host.slice(0, i), port: host.slice(i + 1) };
  }
  if (colonCount > 1) {
    const normalized = host === "::1" || host === "::" ? "localhost" : `[${host}]`;
    return { host: normalized, port: "" };
  }
  return { host, port: "" };
}
function getNitroOrigin$1(ctx = {}) {
  const isDev = ctx.isDev ?? h;
  const isPrerender = ctx.isPrerender ?? !!o.prerender;
  let host = "";
  let port = "";
  let protocol = o.NITRO_SSL_CERT && o.NITRO_SSL_KEY ? "https" : "http";
  if (isDev || isPrerender) {
    const devEnv = o.__NUXT_DEV__ || o.NUXT_VITE_NODE_OPTIONS;
    if (devEnv) {
      const parsed = JSON.parse(devEnv);
      const origin = parsed.proxy?.url || parsed.baseURL?.replace("/__nuxt_vite_node__", "");
      host = origin.replace(/^https?:\/\//, "").replace(/\/$/, "");
      protocol = origin.startsWith("https") ? "https" : "http";
    }
  }
  if (isDev && isLocalhostHost(host) && ctx.requestHost) {
    const reqHost = extractHostname(ctx.requestHost);
    if (reqHost && !isLocalhostHost(reqHost)) {
      host = ctx.requestHost;
      protocol = ctx.requestProtocol || protocol;
    }
  }
  if (!host && ctx.requestHost) {
    host = ctx.requestHost;
    protocol = ctx.requestProtocol || protocol;
  }
  if (!host) {
    host = o.NITRO_HOST || o.HOST || "";
    if (isDev)
      port = o.NITRO_PORT || o.PORT || "3000";
  }
  const split = splitHostPort(host);
  host = split.host;
  if (split.port)
    port = split.port;
  host = o.NUXT_SITE_HOST_OVERRIDE || host;
  port = o.NUXT_SITE_PORT_OVERRIDE || port;
  if (host.startsWith("http://") || host.startsWith("https://")) {
    protocol = host.startsWith("https://") ? "https" : "http";
    host = host.replace(/^https?:\/\//, "");
  } else if (!isDev && (!host || !isLocalhostHost(host))) {
    protocol = "https";
  }
  return `${protocol}://${host}${port ? `:${port}` : ""}/`;
}

function getNitroOrigin(e) {
  return getNitroOrigin$1({
    isDev: false,
    isPrerender: false,
    requestHost: e ? getRequestHost(e, { xForwardedHost: true }) : void 0,
    requestProtocol: e ? getRequestProtocol(e, { xForwardedProto: true }) : void 0
  });
}

const _IFziFF = eventHandler(async (e) => {
  if (e.context._initedSiteConfig)
    return;
  const runtimeConfig = useRuntimeConfig(e);
  const config = runtimeConfig["nuxt-site-config"];
  const nitroApp = useNitroApp();
  const siteConfig = e.context.siteConfig || createSiteConfigStack({
    debug: config.debug
  });
  const nitroOrigin = getNitroOrigin(e);
  e.context.siteConfigNitroOrigin = nitroOrigin;
  {
    siteConfig.push({
      _context: "nitro:init",
      _priority: -4,
      url: nitroOrigin
    });
  }
  siteConfig.push({
    _context: "runtimeEnv",
    _priority: 0,
    ...runtimeConfig.site || {},
    ...runtimeConfig.public.site || {},
    ...envSiteConfig(globalThis._importMeta_.env || {})
    // just in-case, shouldn't be needed
  });
  const buildStack = config.stack || [];
  buildStack.forEach((c) => siteConfig.push(c));
  if (e.context._nitro.routeRules.site) {
    siteConfig.push({
      _context: "route-rules",
      ...e.context._nitro.routeRules.site
    });
  }
  if (config.multiTenancy) {
    const host = parseURL(nitroOrigin).host?.replace(/:\d+$/, "") || "";
    const tenant = config.multiTenancy?.find((t) => t.hosts.includes(host));
    if (tenant) {
      siteConfig.push({
        _context: `multi-tenancy:${host}`,
        _priority: 0,
        ...tenant.config
      });
    }
  }
  const ctx = { siteConfig, event: e };
  await nitroApp.hooks.callHook("site-config:init", ctx);
  e.context.siteConfig = ctx.siteConfig;
  e.context._initedSiteConfig = true;
});

function resolveSitePath(pathOrUrl, options) {
  let path = pathOrUrl;
  if (hasProtocol(pathOrUrl, { strict: false, acceptRelative: true })) {
    const parsed = parseURL(pathOrUrl);
    path = parsed.pathname;
  }
  const base = withLeadingSlash(options.base || "/");
  if (base !== "/" && path.startsWith(base)) {
    path = path.slice(base.length);
  }
  let origin = withoutTrailingSlash(options.absolute ? options.siteUrl : "");
  if (base !== "/" && origin.endsWith(base)) {
    origin = origin.slice(0, origin.indexOf(base));
  }
  const baseWithOrigin = options.withBase ? withBase(base, origin || "/") : origin;
  const resolvedUrl = withBase(path, baseWithOrigin);
  return path === "/" && !options.withBase ? withTrailingSlash(resolvedUrl) : fixSlashes(options.trailingSlash, resolvedUrl);
}
const fileExtensions = [
  // Images
  "jpg",
  "jpeg",
  "png",
  "gif",
  "bmp",
  "webp",
  "svg",
  "ico",
  // Documents
  "pdf",
  "doc",
  "docx",
  "xls",
  "xlsx",
  "ppt",
  "pptx",
  "txt",
  "md",
  "markdown",
  // Archives
  "zip",
  "rar",
  "7z",
  "tar",
  "gz",
  // Audio
  "mp3",
  "wav",
  "flac",
  "ogg",
  "opus",
  "m4a",
  "aac",
  "midi",
  "mid",
  // Video
  "mp4",
  "avi",
  "mkv",
  "mov",
  "wmv",
  "flv",
  "webm",
  // Web
  "html",
  "css",
  "js",
  "json",
  "xml",
  "tsx",
  "jsx",
  "ts",
  "vue",
  "svelte",
  "xsl",
  "rss",
  "atom",
  // Programming
  "php",
  "py",
  "rb",
  "java",
  "c",
  "cpp",
  "h",
  "go",
  // Data formats
  "csv",
  "tsv",
  "sql",
  "yaml",
  "yml",
  // Fonts
  "woff",
  "woff2",
  "ttf",
  "otf",
  "eot",
  // Executables/Binaries
  "exe",
  "msi",
  "apk",
  "ipa",
  "dmg",
  "iso",
  "bin",
  // Scripts/Config
  "bat",
  "cmd",
  "sh",
  "env",
  "htaccess",
  "conf",
  "toml",
  "ini",
  // Package formats
  "deb",
  "rpm",
  "jar",
  "war",
  // E-books
  "epub",
  "mobi",
  // Common temporary/backup files
  "log",
  "tmp",
  "bak",
  "old",
  "sav"
];
function isPathFile(path) {
  const lastSegment = path.split("/").pop();
  const ext = (lastSegment || path).match(/\.[0-9a-z]+$/i)?.[0];
  return ext && fileExtensions.includes(ext.replace(".", ""));
}
function fixSlashes(trailingSlash, pathOrUrl) {
  const $url = parseURL(pathOrUrl);
  if (isPathFile($url.pathname))
    return pathOrUrl;
  const fixedPath = trailingSlash ? withTrailingSlash($url.pathname) : withoutTrailingSlash($url.pathname);
  return `${$url.protocol ? `${$url.protocol}//` : ""}${$url.host || ""}${fixedPath}${$url.search || ""}${$url.hash || ""}`;
}

function createSitePathResolver(e, options = {}) {
  const siteConfig = getSiteConfig(e);
  const nitroOrigin = getNitroOrigin(e);
  const nuxtBase = useRuntimeConfig(e).app.baseURL || "/";
  return (path) => {
    return resolveSitePath(path, {
      ...options,
      siteUrl: options.canonical !== false || false ? siteConfig.url : nitroOrigin,
      trailingSlash: siteConfig.trailingSlash,
      base: nuxtBase
    });
  };
}
function withSiteUrl(e, path, options = {}) {
  const siteConfig = e.context.siteConfig?.get();
  let siteUrl = e.context.siteConfigNitroOrigin;
  if ((options.canonical !== false || false) && siteConfig.url)
    siteUrl = siteConfig.url;
  return resolveSitePath(path, {
    absolute: true,
    siteUrl,
    trailingSlash: siteConfig.trailingSlash,
    base: e.context.nitro.baseURL,
    withBase: options.withBase
  });
}

function getSiteIndexable(e) {
  const { env, indexable } = getSiteConfig(e);
  if (typeof indexable !== "undefined")
    return String(indexable) === "true";
  return env === "production";
}

function useSiteConfig(e, _options) {
  return getSiteConfig(e, _options);
}

function getSiteRobotConfig(e) {
  const query = getQuery(e);
  const hints = [];
  const { groups, debug } = useRuntimeConfigNuxtRobots(e);
  let indexable = getSiteIndexable(e);
  const queryIndexableEnabled = String(query.mockProductionEnv) === "true" || query.mockProductionEnv === "";
  if (debug || false) {
    const { _context } = getSiteConfig(e, { debug: debug || false });
    if (queryIndexableEnabled) {
      indexable = true;
      hints.push("You are mocking a production enviroment with ?mockProductionEnv query.");
    } else if (!indexable && _context.indexable === "nuxt-robots:config") {
      hints.push("You are blocking indexing with your Nuxt Robots config.");
    } else if (!queryIndexableEnabled && !_context.indexable) {
      hints.push(`Indexing is blocked in development. You can mock a production environment with ?mockProductionEnv query.`);
    } else if (!indexable && !queryIndexableEnabled) {
      hints.push(`Indexing is blocked by site config set by ${_context.indexable}.`);
    } else if (indexable && !queryIndexableEnabled) {
      hints.push(`Indexing is enabled from ${_context.indexable}.`);
    }
  }
  if (groups.some((g) => g.userAgent.includes("*") && g.disallow.includes("/"))) {
    indexable = false;
    hints.push("You are blocking all user agents with a wildcard `Disallow /`.");
  } else if (groups.some((g) => g.disallow.includes("/"))) {
    hints.push("You are blocking specific user agents with `Disallow /`.");
  }
  return { indexable, hints };
}

const _Dra0D3 = defineEventHandler(async (e) => {
  const nitroApp = useNitroApp();
  const { indexable} = getSiteRobotConfig(e);
  const { credits, isNuxtContentV2, cacheControl } = useRuntimeConfigNuxtRobots(e);
  let robotsTxtCtx = {
    sitemaps: [],
    groups: [
      {
        allow: [],
        comment: [],
        userAgent: ["*"],
        disallow: ["/"]
      }
    ]
  };
  if (indexable) {
    robotsTxtCtx = await resolveRobotsTxtContext(e);
    robotsTxtCtx.sitemaps = [...new Set(
      asArray(robotsTxtCtx.sitemaps).map((s) => !s.startsWith("http") ? withSiteUrl(e, s, { withBase: true}) : s)
    )];
    if (isNuxtContentV2) {
      const contentWithRobotRules = await e.$fetch("/__robots__/nuxt-content.json", {
        headers: {
          Accept: "application/json"
        }
      });
      if (String(contentWithRobotRules).trim().startsWith("<!DOCTYPE")) {
        logger$1.error("Invalid HTML returned from /__robots__/nuxt-content.json, skipping.");
      } else {
        for (const group of robotsTxtCtx.groups) {
          if (group.userAgent.includes("*")) {
            group.disallow.push(...contentWithRobotRules);
            group.disallow = group.disallow.filter(Boolean);
          }
        }
      }
    }
  }
  let robotsTxt = generateRobotsTxt(robotsTxtCtx);
  if (credits) {
    robotsTxt = [
      `# START nuxt-robots (${indexable ? "indexable" : "indexing disabled"})`,
      robotsTxt,
      "# END nuxt-robots"
    ].filter(Boolean).join("\n");
  }
  setHeader(e, "Content-Type", "text/plain; charset=utf-8");
  setHeader(e, "Cache-Control", globalThis._importMeta_.test || !cacheControl ? "no-store" : cacheControl);
  const hookCtx = { robotsTxt, e };
  await nitroApp.hooks.callHook("robots:robots-txt", hookCtx);
  return hookCtx.robotsTxt;
});

function withoutQuery$1(path) {
  return path.split("?")[0];
}
function createNitroRouteRuleMatcher$1(e) {
  const { nitro, app } = useRuntimeConfig(e);
  const _routeRulesMatcher = toRouteMatcher(
    createRouter$1({
      routes: Object.fromEntries(
        Object.entries(nitro?.routeRules || {}).map(([path, rules]) => [withoutTrailingSlash(path), rules])
      )
    })
  );
  return (path) => {
    return defu({}, ..._routeRulesMatcher.matchAll(
      // radix3 does not support trailing slashes
      withoutBase(withoutTrailingSlash(withoutQuery$1(path)), app.baseURL)
    ).reverse());
  };
}

function getPathRobotConfig(e, options) {
  const runtimeConfig = useRuntimeConfig(e);
  const { robotsDisabledValue, robotsEnabledValue, isNuxtContentV2 } = useRuntimeConfigNuxtRobots(e);
  if (!options?.skipSiteIndexable) {
    if (!getSiteRobotConfig(e).indexable) {
      return {
        rule: robotsDisabledValue,
        indexable: false,
        debug: {
          source: "Site Config"
        }
      };
    }
  }
  const path = options?.path || e.path;
  let userAgent = options?.userAgent;
  if (!userAgent) {
    try {
      userAgent = getRequestHeader(e, "User-Agent");
    } catch {
    }
  }
  const nitroApp = useNitroApp();
  const groups = [
    // run explicit user agent matching first
    ...nitroApp._robots.ctx.groups.filter((g) => {
      if (userAgent) {
        return g.userAgent.some((ua) => ua.toLowerCase().includes(userAgent.toLowerCase()));
      }
      return false;
    }),
    // run wildcard matches second
    ...nitroApp._robots.ctx.groups.filter((g) => g.userAgent.includes("*"))
  ];
  for (const group of groups) {
    if (group._indexable === false) {
      return {
        indexable: false,
        rule: robotsDisabledValue,
        debug: {
          source: "/robots.txt",
          line: JSON.stringify(group)
        }
      };
    }
    const robotsTxtRule = matchPathToRule(path, group._rules || []);
    if (robotsTxtRule) {
      if (!robotsTxtRule.allow) {
        return {
          indexable: false,
          rule: robotsDisabledValue,
          debug: {
            source: "/robots.txt",
            line: `Disallow: ${robotsTxtRule.pattern}`
          }
        };
      }
      break;
    }
  }
  if (isNuxtContentV2 && nitroApp._robots?.nuxtContentUrls?.has(withoutTrailingSlash(path))) {
    return {
      indexable: false,
      rule: robotsDisabledValue,
      debug: {
        source: "Nuxt Content"
      }
    };
  }
  const { pageMetaRobots } = useRuntimeConfigNuxtRobots(e);
  const pageMetaRule = pageMetaRobots?.[withoutTrailingSlash(path)];
  if (typeof pageMetaRule !== "undefined") {
    const normalised = normaliseRobotsRouteRule({ robots: pageMetaRule });
    if (normalised && (typeof normalised.allow !== "undefined" || typeof normalised.rule !== "undefined")) {
      return {
        indexable: normalised.allow ?? false,
        rule: normalised.rule || (normalised.allow ? robotsEnabledValue : robotsDisabledValue),
        debug: {
          source: "Page Meta"
        }
      };
    }
  }
  nitroApp._robotsRuleMatcher = nitroApp._robotsRuleMatcher || createNitroRouteRuleMatcher$1(e);
  let robotRouteRules = nitroApp._robotsRuleMatcher(path);
  let routeRulesPath = path;
  if (runtimeConfig.public?.i18n?.locales && typeof robotRouteRules.robots === "undefined") {
    const { locales } = runtimeConfig.public.i18n;
    const locale = locales.find((l) => routeRulesPath.startsWith(`/${l.code}`));
    if (locale) {
      routeRulesPath = routeRulesPath.replace(`/${locale.code}`, "");
      robotRouteRules = nitroApp._robotsRuleMatcher(routeRulesPath);
    }
  }
  const routeRules = normaliseRobotsRouteRule(robotRouteRules);
  if (routeRules && (typeof routeRules.allow !== "undefined" || typeof routeRules.rule !== "undefined")) {
    return {
      indexable: routeRules.allow ?? false,
      rule: routeRules.rule || (routeRules.allow ? robotsEnabledValue : robotsDisabledValue),
      debug: {
        source: "Route Rules"
      }
    };
  }
  return {
    indexable: true,
    rule: robotsEnabledValue
  };
}

const _OJed1M = defineEventHandler(async (e) => {
  if (e.path === "/robots.txt" || e.path.startsWith("/__") || e.path.startsWith("/api") || e.path.startsWith("/_nuxt"))
    return;
  const nuxtRobotsConfig = useRuntimeConfigNuxtRobots(e);
  if (nuxtRobotsConfig) {
    const { header } = nuxtRobotsConfig;
    const robotConfig = getPathRobotConfig(e, { skipSiteIndexable: Boolean(getQuery(e)?.mockProductionEnv) });
    if (header) {
      setHeader(e, "X-Robots-Tag", robotConfig.rule);
    }
    e.context.robots = robotConfig;
  }
});

const logger = createConsola({
  defaults: {
    tag: "@nuxt/sitemap"
  }
});
const merger = createDefu((obj, key, value) => {
  if (Array.isArray(obj[key]) && Array.isArray(value))
    obj[key] = Array.from(/* @__PURE__ */ new Set([...obj[key], ...value]));
  return obj[key];
});
function mergeOnKey(arr, key) {
  const seen = /* @__PURE__ */ new Map();
  let resultLength = 0;
  const result = Array.from({ length: arr.length });
  for (const item of arr) {
    const k = item[key];
    if (seen.has(k)) {
      const existingIndex = seen.get(k);
      result[existingIndex] = merger(item, result[existingIndex]);
    } else {
      seen.set(k, resultLength);
      result[resultLength++] = item;
    }
  }
  result.length = resultLength;
  return result;
}
function splitForLocales(path, locales) {
  const prefix = withLeadingSlash(path).split("/")[1];
  if (prefix && locales.includes(prefix))
    return [prefix, path.replace(`/${prefix}`, "")];
  return [null, path];
}
const StringifiedRegExpPattern = /\/(.*?)\/([gimsuy]*)$/;
function normalizeRuntimeFilters(input) {
  return (input || []).map((rule) => {
    if (rule instanceof RegExp || typeof rule === "string")
      return rule;
    const match = rule.regex.match(StringifiedRegExpPattern);
    if (match)
      return new RegExp(match[1], match[2]);
    return false;
  }).filter(Boolean);
}
function createPathFilter(options = {}) {
  const urlFilter = createFilter(options);
  return (loc) => {
    let path = loc;
    try {
      path = parseURL(loc).pathname;
    } catch {
      return false;
    }
    return urlFilter(path);
  };
}
function findPageMapping(pathWithoutPrefix, pages) {
  const stripped = pathWithoutPrefix[0] === "/" ? pathWithoutPrefix.slice(1) : pathWithoutPrefix;
  const pageKey = stripped.endsWith("/index") ? stripped.slice(0, -6) || "index" : stripped || "index";
  if (pages[pageKey])
    return { mappings: pages[pageKey], paramSegments: [] };
  const sortedKeys = Object.keys(pages).sort((a, b) => b.length - a.length);
  for (const key of sortedKeys) {
    if (pageKey.startsWith(key + "/")) {
      const paramPath = pageKey.slice(key.length + 1);
      return { mappings: pages[key], paramSegments: paramPath.split("/") };
    }
  }
  return null;
}
function applyDynamicParams(customPath, paramSegments) {
  if (!paramSegments.length)
    return customPath;
  let i = 0;
  return customPath.replace(/\[[^\]]+\]/g, () => paramSegments[i++] || "");
}
function createFilter(options = {}) {
  const include = options.include || [];
  const exclude = options.exclude || [];
  if (include.length === 0 && exclude.length === 0)
    return () => true;
  const excludeRegex = exclude.filter((r) => r instanceof RegExp);
  const includeRegex = include.filter((r) => r instanceof RegExp);
  const excludeStrings = exclude.filter((r) => typeof r === "string");
  const includeStrings = include.filter((r) => typeof r === "string");
  const excludeMatcher = excludeStrings.length > 0 ? toRouteMatcher(createRouter$1({
    routes: Object.fromEntries(excludeStrings.map((r) => [r, true])),
    strictTrailingSlash: false
  })) : null;
  const includeMatcher = includeStrings.length > 0 ? toRouteMatcher(createRouter$1({
    routes: Object.fromEntries(includeStrings.map((r) => [r, true])),
    strictTrailingSlash: false
  })) : null;
  const excludeExact = new Set(excludeStrings);
  const includeExact = new Set(includeStrings);
  return function(path) {
    if (excludeRegex.some((r) => r.test(path)))
      return false;
    if (excludeExact.has(path))
      return false;
    if (excludeMatcher && excludeMatcher.matchAll(path).length > 0)
      return false;
    if (includeRegex.some((r) => r.test(path)))
      return true;
    if (includeExact.has(path))
      return true;
    if (includeMatcher && includeMatcher.matchAll(path).length > 0)
      return true;
    return include.length === 0;
  };
}

function xmlEscape(str) {
  return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}
function useSitemapRuntimeConfig(e) {
  const clone = JSON.parse(JSON.stringify(useRuntimeConfig(e).sitemap));
  for (const k in clone.sitemaps) {
    const sitemap = clone.sitemaps[k];
    sitemap.include = normalizeRuntimeFilters(sitemap.include);
    sitemap.exclude = normalizeRuntimeFilters(sitemap.exclude);
    clone.sitemaps[k] = sitemap;
  }
  return Object.freeze(clone);
}

const _WJydXw = defineEventHandler(async (e) => {
  const fixPath = createSitePathResolver(e, { absolute: false, withBase: true });
  const { sitemapName: fallbackSitemapName, cacheMaxAgeSeconds, version, xslColumns, xslTips } = useSitemapRuntimeConfig();
  setHeader(e, "Content-Type", "application/xslt+xml");
  if (cacheMaxAgeSeconds)
    setHeader(e, "Cache-Control", `public, max-age=${cacheMaxAgeSeconds}, must-revalidate`);
  else
    setHeader(e, "Cache-Control", `no-cache, no-store`);
  const { name: siteName, url: siteUrl } = useSiteConfig(e);
  const referrer = getHeader(e, "Referer") || "/";
  const referrerPath = parseURL(referrer).pathname;
  const isNotIndexButHasIndex = referrerPath !== "/sitemap.xml" && referrerPath !== "/sitemap_index.xml" && referrerPath.endsWith(".xml");
  const sitemapName = parseURL(referrer).pathname.split("/").pop()?.split("-sitemap")[0] || fallbackSitemapName;
  const title = `${siteName}${sitemapName !== "sitemap.xml" ? ` - ${sitemapName === "sitemap_index.xml" ? "index" : sitemapName}` : ""}`.replace(/&/g, "&amp;");
  const canonicalQuery = getQuery$1(referrer).canonical;
  const isShowingCanonical = typeof canonicalQuery !== "undefined" && canonicalQuery !== "false";
  const conditionalTips = [
    'You are looking at a <a href="https://developer.mozilla.org/en-US/docs/Web/XSLT/Transforming_XML_with_XSLT/An_Overview" style="color: #398465" target="_blank">XML stylesheet</a>. Read the <a href="https://nuxtseo.com/sitemap/guides/customising-ui" style="color: #398465" target="_blank">docs</a> to learn how to customize it. View the page source to see the raw XML.',
    `URLs missing? Check Nuxt Devtools Sitemap tab (or the <a href="${xmlEscape(withQuery("/__sitemap__/debug.json", { sitemap: sitemapName }))}" style="color: #398465" target="_blank">debug endpoint</a>).`
  ];
  const fetchErrors = [];
  const xslQuery = getQuery(e);
  if (xslQuery.error_messages) {
    const errorMessages = xslQuery.error_messages;
    const errorUrls = xslQuery.error_urls;
    if (errorMessages) {
      const messages = Array.isArray(errorMessages) ? errorMessages : [errorMessages];
      const urls = Array.isArray(errorUrls) ? errorUrls : errorUrls ? [errorUrls] : [];
      messages.forEach((msg, i) => {
        const errorParts = [xmlEscape(msg)];
        if (urls[i]) {
          errorParts.push(xmlEscape(urls[i]));
        }
        fetchErrors.push(`<strong style="color: #dc2626;">Error ${i + 1}:</strong> ${errorParts.join(" - ")}`);
      });
    }
  }
  if (!isShowingCanonical) {
    const canonicalPreviewUrl = withQuery(referrer, { canonical: "" });
    conditionalTips.push(`Your canonical site URL is <strong>${xmlEscape(siteUrl)}</strong>.`);
    conditionalTips.push(`You can preview your canonical sitemap by visiting <a href="${xmlEscape(canonicalPreviewUrl)}" style="color: #398465; white-space: nowrap;">${xmlEscape(fixPath(canonicalPreviewUrl))}?canonical</a>`);
  } else {
    conditionalTips.push(`You are viewing the canonical sitemap. You can switch to using the request origin: <a href="${xmlEscape(fixPath(referrer))}" style="color: #398465; white-space: nowrap ">${xmlEscape(fixPath(referrer))}</a>`);
  }
  const hasRuntimeErrors = fetchErrors.length > 0;
  const showSidebar = hasRuntimeErrors;
  const runtimeErrors = hasRuntimeErrors ? fetchErrors.map((t) => `<li><p>${t}</p></li>`).join("\n") : "";
  let columns = [...xslColumns];
  if (!columns.length) {
    columns = [
      { label: "URL", width: "50%" },
      { label: "Images", width: "25%", select: "count(image:image)" },
      { label: "Last Updated", width: "25%", select: "concat(substring(sitemap:lastmod,0,11),concat(' ', substring(sitemap:lastmod,12,5)),concat(' ', substring(sitemap:lastmod,20,6)))" }
    ];
  }
  return `<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0"
                xmlns:html="http://www.w3.org/TR/REC-html40"
                xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
                xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
                xmlns:xhtml="http://www.w3.org/1999/xhtml"
                xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html xmlns="http://www.w3.org/1999/xhtml">
      <head>
        <title>XML Sitemap</title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
        <style type="text/css">
          body {
            font-family: Inter, Helvetica, Arial, sans-serif;
            font-size: 14px;
            color: #333;
          }

          table {
            border: none;
            border-collapse: collapse;
          }

          .bg-yellow-200 {
            background-color: #fef9c3;
          }

          .p-5 {
            padding: 1.25rem;
          }

          .rounded {
            border-radius: 4px;
            }

          .shadow {
            box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
          }

          #sitemap tr:nth-child(odd) td {
            background-color: #f8f8f8 !important;
          }

          #sitemap tbody tr:hover td {
            background-color: #fff;
          }

          #sitemap tbody tr:hover td, #sitemap tbody tr:hover td a {
            color: #000;
          }

          .expl a {
            color: #398465;
            font-weight: 600;
          }

          .expl a:visited {
            color: #398465;
          }

          a {
            color: #000;
            text-decoration: none;
          }

          a:visited {
            color: #777;
          }

          a:hover {
            text-decoration: underline;
          }

          td {
            font-size: 12px;
          }

          .text-2xl {
            font-size: 2rem;
            font-weight: 600;
            line-height: 1.25;
          }

          th {
            text-align: left;
            padding-right: 30px;
            font-size: 12px;
          }

          thead th {
            border-bottom: 1px solid #000;
          }
          .fixed { position: fixed; }
          .right-2 { right: 2rem; }
          .top-2 { top: 2rem; }
          .w-30 { width: 30rem; }
          p { margin: 0; }
          li { padding-bottom: 0.5rem; line-height: 1.5; }
          h1 { margin: 0; }
          .mb-5 { margin-bottom: 1.25rem; }
          .mb-3 { margin-bottom: 0.75rem; }
        </style>
      </head>
      <body>
        <div style="grid-template-columns: 1fr 1fr; display: grid; margin: 3rem;">
            <div>
             <div id="content">
          <h1 class="text-2xl mb-3">XML Sitemap</h1>
          <h2>${xmlEscape(title)}</h2>
          ${isNotIndexButHasIndex ? `<p style="font-size: 12px; margin-bottom: 1rem;"><a href="${xmlEscape(fixPath("/sitemap_index.xml"))}">${xmlEscape(fixPath("/sitemap_index.xml"))}</a></p>` : ""}
          <xsl:if test="count(sitemap:sitemapindex/sitemap:sitemap) &gt; 0">
            <p class="expl" style="margin-bottom: 1rem;">
              This XML Sitemap Index file contains
              <xsl:value-of select="count(sitemap:sitemapindex/sitemap:sitemap)"/> sitemaps.
            </p>
            <table id="sitemap" cellpadding="3">
              <thead>
                <tr>
                  <th width="75%">Sitemap</th>
                  <th width="25%">Last Modified</th>
                </tr>
              </thead>
              <tbody>
                <xsl:for-each select="sitemap:sitemapindex/sitemap:sitemap">
                  <xsl:variable name="sitemapURL">
                    <xsl:value-of select="sitemap:loc"/>
                  </xsl:variable>
                  <tr>
                    <td>
                      <a href="{$sitemapURL}">
                        <xsl:value-of select="sitemap:loc"/>
                      </a>
                    </td>
                    <td>
                      <xsl:value-of
                        select="concat(substring(sitemap:lastmod,0,11),concat(' ', substring(sitemap:lastmod,12,5)),concat(' ', substring(sitemap:lastmod,20,6)))"/>
                    </td>
                  </tr>
                </xsl:for-each>
              </tbody>
            </table>
          </xsl:if>
          <xsl:if test="count(sitemap:sitemapindex/sitemap:sitemap) &lt; 1">
            <p class="expl" style="margin-bottom: 1rem;">
              This XML Sitemap contains
              <xsl:value-of select="count(sitemap:urlset/sitemap:url)"/> URLs.
            </p>
            <table id="sitemap" cellpadding="3">
              <thead>
                <tr>
                  ${columns.map((c) => `<th width="${c.width}">${c.label}</th>`).join("\n")}
                </tr>
              </thead>
              <tbody>
                <xsl:variable name="lower" select="'abcdefghijklmnopqrstuvwxyz'"/>
                <xsl:variable name="upper" select="'ABCDEFGHIJKLMNOPQRSTUVWXYZ'"/>
                <xsl:for-each select="sitemap:urlset/sitemap:url">
                  <tr>
                    <td>
                      <xsl:variable name="itemURL">
                        <xsl:value-of select="sitemap:loc"/>
                      </xsl:variable>
                      <a href="{$itemURL}">
                        <xsl:value-of select="sitemap:loc"/>
                      </a>
                    </td>
                    ${columns.filter((c) => c.label !== "URL").map((c) => `<td>
<xsl:value-of select="${c.select}"/>
</td>`).join("\n")}
                  </tr>
                </xsl:for-each>
              </tbody>
            </table>
          </xsl:if>
        </div>
        </div>
                    ${showSidebar ? `<div class="w-30 top-2 shadow rounded p-5 right-2" style="margin: 0 auto;">
                      ${""}
                      ${hasRuntimeErrors ? `<div${""}><p><strong style="color: #dc2626;">Runtime Errors</strong></p><ul style="margin: 1rem 0; padding: 0;">${runtimeErrors}</ul></div>` : ""}
                      ${""}
                    </div>` : ""}
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
`;
});

function withoutQuery(path) {
  return path.split("?")[0];
}
function createNitroRouteRuleMatcher() {
  const { nitro, app } = useRuntimeConfig();
  const _routeRulesMatcher = toRouteMatcher(
    createRouter$1({
      routes: Object.fromEntries(
        Object.entries(nitro?.routeRules || {}).map(([path, rules]) => [path === "/" ? path : withoutTrailingSlash(path), rules])
      )
    })
  );
  return (pathOrUrl) => {
    const path = pathOrUrl[0] === "/" ? pathOrUrl : parseURL(pathOrUrl, app.baseURL).pathname;
    const pathWithoutQuery = withoutQuery(path);
    return defu({}, ..._routeRulesMatcher.matchAll(
      // radix3 does not support trailing slashes
      withoutBase(pathWithoutQuery === "/" ? pathWithoutQuery : withoutTrailingSlash(pathWithoutQuery), app.baseURL)
    ).reverse());
  };
}

function resolve(s, resolvers) {
  if (typeof s === "undefined")
    return void 0;
  const str = typeof s === "string" ? s : s.toString();
  if (!resolvers)
    return str;
  if (hasProtocol(str, { acceptRelative: true, strict: false }))
    return resolvers.fixSlashes(str);
  return resolvers.canonicalUrlResolver(str);
}
function removeTrailingSlash(s) {
  return s.replace(/\/(\?|#|$)/, "$1");
}
function preNormalizeEntry(_e, resolvers) {
  const input = typeof _e === "string" ? { loc: _e } : { ..._e };
  if (input.url && !input.loc) {
    input.loc = input.url;
  }
  delete input.url;
  if (typeof input.loc !== "string") {
    input.loc = "";
  }
  const skipEncoding = input._encoded === true;
  const e = input;
  e.loc = removeTrailingSlash(e.loc);
  e._abs = hasProtocol(e.loc, { acceptRelative: false, strict: false });
  try {
    e._path = e._abs ? parseURL(e.loc) : parsePath(e.loc);
  } catch {
    e._path = null;
  }
  if (e._path) {
    const search = e._path.search;
    const qs = search && search.length > 1 ? stringifyQuery(parseQuery(search)) : "";
    const pathname = skipEncoding ? e._path.pathname : encodePath(e._path.pathname);
    e._relativeLoc = `${pathname}${qs.length ? `?${qs}` : ""}`;
    if (e._path.host) {
      e.loc = stringifyParsedURL(e._path);
    } else {
      e.loc = e._relativeLoc;
    }
  } else if (!skipEncoding && !isEncoded(e.loc)) {
    e.loc = encodeURI(e.loc);
  }
  if (e.loc === "")
    e.loc = `/`;
  e.loc = resolve(e.loc, resolvers);
  e._key = `${e._sitemap || ""}${withoutTrailingSlash(e.loc)}`;
  return e;
}
function isEncoded(url) {
  try {
    return url !== decodeURIComponent(url);
  } catch {
    return false;
  }
}
function normaliseEntry(_e, defaults, resolvers) {
  const e = defu(_e, defaults);
  if (e.lastmod) {
    const date = normaliseDate(e.lastmod);
    if (date)
      e.lastmod = date;
    else
      delete e.lastmod;
  }
  if (!e.lastmod)
    delete e.lastmod;
  e.loc = resolve(e.loc, resolvers);
  if (e.alternatives) {
    const alternatives = e.alternatives.map((a) => ({ ...a }));
    for (const alt of alternatives) {
      if (typeof alt.href === "string") {
        alt.href = resolve(alt.href, resolvers);
      } else if (typeof alt.href === "object" && alt.href) {
        alt.href = resolve(alt.href.href, resolvers);
      }
    }
    e.alternatives = mergeOnKey(alternatives, "hreflang");
  }
  if (e.images) {
    const images = e.images.map((i) => ({ ...i }));
    for (const img of images) {
      img.loc = resolve(img.loc, resolvers);
    }
    e.images = mergeOnKey(images, "loc");
  }
  if (e.videos) {
    const videos = e.videos.map((v) => ({ ...v }));
    for (const video of videos) {
      if (video.content_loc) {
        video.content_loc = resolve(video.content_loc, resolvers);
      }
    }
    e.videos = mergeOnKey(videos, "content_loc");
  }
  return e;
}
const IS_VALID_W3C_DATE = [
  /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/,
  /^\d{4}-[01]\d-[0-3]\d$/,
  /^\d{4}-[01]\d$/,
  /^\d{4}$/
];
function isValidW3CDate(d) {
  return IS_VALID_W3C_DATE.some((r) => r.test(d));
}
function normaliseDate(d) {
  if (typeof d === "string") {
    const tIdx = d.indexOf("T");
    if (tIdx !== -1) {
      const t = d.slice(tIdx + 1);
      if (!t.includes("+") && !t.includes("-") && !t.includes("Z")) {
        d += "Z";
      }
    }
    if (!isValidW3CDate(d))
      return false;
    d = new Date(d);
    d.setMilliseconds(0);
    if (Number.isNaN(d.getTime()))
      return false;
  }
  const z = (n) => `0${n}`.slice(-2);
  const date = `${d.getUTCFullYear()}-${z(d.getUTCMonth() + 1)}-${z(d.getUTCDate())}`;
  if (d.getUTCHours() > 0 || d.getUTCMinutes() > 0 || d.getUTCSeconds() > 0) {
    return `${date}T${z(d.getUTCHours())}:${z(d.getUTCMinutes())}:${z(d.getUTCSeconds())}Z`;
  }
  return date;
}

function isValidString(value) {
  return typeof value === "string" && value.trim().length > 0;
}
function parseNumber(value) {
  if (typeof value === "number") return value;
  if (typeof value === "string" && value.trim()) {
    const num = Number.parseFloat(value.trim());
    return Number.isNaN(num) ? void 0 : num;
  }
  return void 0;
}
function parseInteger(value) {
  if (typeof value === "number") return Math.floor(value);
  if (typeof value === "string" && value.trim()) {
    const num = Number.parseInt(value.trim(), 10);
    return Number.isNaN(num) ? void 0 : num;
  }
  return void 0;
}
function extractUrlFromParsedElement(urlElement, warnings) {
  if (!isValidString(urlElement.loc)) {
    warnings.push({
      type: "validation",
      message: "URL entry missing required loc element",
      context: { url: String(urlElement.loc || "undefined") }
    });
    return null;
  }
  const urlObj = { loc: urlElement.loc };
  if (isValidString(urlElement.lastmod)) {
    urlObj.lastmod = urlElement.lastmod;
  }
  if (isValidString(urlElement.changefreq)) {
    const validFreqs = ["always", "hourly", "daily", "weekly", "monthly", "yearly", "never"];
    if (validFreqs.includes(urlElement.changefreq)) {
      urlObj.changefreq = urlElement.changefreq;
    } else {
      warnings.push({
        type: "validation",
        message: "Invalid changefreq value",
        context: { url: urlElement.loc, field: "changefreq", value: urlElement.changefreq }
      });
    }
  }
  const priority = parseNumber(urlElement.priority);
  if (priority !== void 0 && !Number.isNaN(priority)) {
    if (priority < 0 || priority > 1) {
      warnings.push({
        type: "validation",
        message: "Priority value should be between 0.0 and 1.0, clamping to valid range",
        context: { url: urlElement.loc, field: "priority", value: priority }
      });
    }
    urlObj.priority = Math.max(0, Math.min(1, priority));
  } else if (urlElement.priority !== void 0) {
    warnings.push({
      type: "validation",
      message: "Invalid priority value",
      context: { url: urlElement.loc, field: "priority", value: urlElement.priority }
    });
  }
  if (urlElement.image) {
    const images = Array.isArray(urlElement.image) ? urlElement.image : [urlElement.image];
    const validImages = images.map((img) => {
      if (isValidString(img.loc)) {
        return { loc: img.loc };
      } else {
        warnings.push({
          type: "validation",
          message: "Image missing required loc element",
          context: { url: urlElement.loc, field: "image.loc" }
        });
        return null;
      }
    }).filter((img) => img !== null);
    if (validImages.length > 0) {
      urlObj.images = validImages;
    }
  }
  if (urlElement.video) {
    const videos = Array.isArray(urlElement.video) ? urlElement.video : [urlElement.video];
    const validVideos = videos.map((video) => {
      const missingFields = [];
      if (!isValidString(video.title)) missingFields.push("title");
      if (!isValidString(video.thumbnail_loc)) missingFields.push("thumbnail_loc");
      if (!isValidString(video.description)) missingFields.push("description");
      if (!isValidString(video.content_loc)) missingFields.push("content_loc");
      if (missingFields.length > 0) {
        warnings.push({
          type: "validation",
          message: `Video missing required fields: ${missingFields.join(", ")}`,
          context: { url: urlElement.loc, field: "video" }
        });
        return null;
      }
      const videoObj = {
        title: video.title,
        thumbnail_loc: video.thumbnail_loc,
        description: video.description,
        content_loc: video.content_loc
      };
      if (isValidString(video.player_loc)) {
        videoObj.player_loc = video.player_loc;
      }
      const duration = parseInteger(video.duration);
      if (duration !== void 0) {
        videoObj.duration = duration;
      } else if (video.duration !== void 0) {
        warnings.push({
          type: "validation",
          message: "Invalid video duration value",
          context: { url: urlElement.loc, field: "video.duration", value: video.duration }
        });
      }
      if (isValidString(video.expiration_date)) {
        videoObj.expiration_date = video.expiration_date;
      }
      const rating = parseNumber(video.rating);
      if (rating !== void 0) {
        if (rating < 0 || rating > 5) {
          warnings.push({
            type: "validation",
            message: "Video rating should be between 0.0 and 5.0",
            context: { url: urlElement.loc, field: "video.rating", value: rating }
          });
        }
        videoObj.rating = rating;
      } else if (video.rating !== void 0) {
        warnings.push({
          type: "validation",
          message: "Invalid video rating value",
          context: { url: urlElement.loc, field: "video.rating", value: video.rating }
        });
      }
      const viewCount = parseInteger(video.view_count);
      if (viewCount !== void 0) {
        videoObj.view_count = viewCount;
      } else if (video.view_count !== void 0) {
        warnings.push({
          type: "validation",
          message: "Invalid video view_count value",
          context: { url: urlElement.loc, field: "video.view_count", value: video.view_count }
        });
      }
      if (isValidString(video.publication_date)) {
        videoObj.publication_date = video.publication_date;
      }
      if (isValidString(video.family_friendly)) {
        const validValues = ["yes", "no"];
        if (validValues.includes(video.family_friendly)) {
          videoObj.family_friendly = video.family_friendly;
        } else {
          warnings.push({
            type: "validation",
            message: 'Invalid video family_friendly value, should be "yes" or "no"',
            context: { url: urlElement.loc, field: "video.family_friendly", value: video.family_friendly }
          });
        }
      }
      if (isValidString(video.requires_subscription)) {
        const validValues = ["yes", "no"];
        if (validValues.includes(video.requires_subscription)) {
          videoObj.requires_subscription = video.requires_subscription;
        } else {
          warnings.push({
            type: "validation",
            message: 'Invalid video requires_subscription value, should be "yes" or "no"',
            context: { url: urlElement.loc, field: "video.requires_subscription", value: video.requires_subscription }
          });
        }
      }
      if (isValidString(video.live)) {
        const validValues = ["yes", "no"];
        if (validValues.includes(video.live)) {
          videoObj.live = video.live;
        } else {
          warnings.push({
            type: "validation",
            message: 'Invalid video live value, should be "yes" or "no"',
            context: { url: urlElement.loc, field: "video.live", value: video.live }
          });
        }
      }
      if (video.restriction && typeof video.restriction === "object") {
        const restriction = video.restriction;
        if (isValidString(restriction.relationship) && isValidString(restriction["#text"])) {
          const validRelationships = ["allow", "deny"];
          if (validRelationships.includes(restriction.relationship)) {
            videoObj.restriction = {
              relationship: restriction.relationship,
              restriction: restriction["#text"]
            };
          } else {
            warnings.push({
              type: "validation",
              message: 'Invalid video restriction relationship, should be "allow" or "deny"',
              context: { url: urlElement.loc, field: "video.restriction.relationship", value: restriction.relationship }
            });
          }
        }
      }
      if (video.platform && typeof video.platform === "object") {
        const platform = video.platform;
        if (isValidString(platform.relationship) && isValidString(platform["#text"])) {
          const validRelationships = ["allow", "deny"];
          if (validRelationships.includes(platform.relationship)) {
            videoObj.platform = {
              relationship: platform.relationship,
              platform: platform["#text"]
            };
          } else {
            warnings.push({
              type: "validation",
              message: 'Invalid video platform relationship, should be "allow" or "deny"',
              context: { url: urlElement.loc, field: "video.platform.relationship", value: platform.relationship }
            });
          }
        }
      }
      if (video.price) {
        const prices = Array.isArray(video.price) ? video.price : [video.price];
        const validPrices = prices.map((price) => {
          const priceValue = price["#text"];
          if (priceValue == null || typeof priceValue !== "string" && typeof priceValue !== "number") {
            warnings.push({
              type: "validation",
              message: "Video price missing value",
              context: { url: urlElement.loc, field: "video.price" }
            });
            return null;
          }
          const validTypes = ["rent", "purchase", "package", "subscription"];
          if (price.type && !validTypes.includes(price.type)) {
            warnings.push({
              type: "validation",
              message: `Invalid video price type "${price.type}", should be one of: ${validTypes.join(", ")}`,
              context: { url: urlElement.loc, field: "video.price.type", value: price.type }
            });
          }
          return {
            price: String(priceValue),
            currency: price.currency,
            type: price.type
          };
        }).filter((p) => p !== null);
        if (validPrices.length > 0) {
          videoObj.price = validPrices;
        }
      }
      if (video.uploader && typeof video.uploader === "object") {
        const uploader = video.uploader;
        if (isValidString(uploader.info) && isValidString(uploader["#text"])) {
          videoObj.uploader = {
            uploader: uploader["#text"],
            info: uploader.info
          };
        } else {
          warnings.push({
            type: "validation",
            message: "Video uploader missing required info or name",
            context: { url: urlElement.loc, field: "video.uploader" }
          });
        }
      }
      if (video.tag) {
        const tags = Array.isArray(video.tag) ? video.tag : [video.tag];
        const validTags = tags.filter(isValidString);
        if (validTags.length > 0) {
          videoObj.tag = validTags;
        }
      }
      return videoObj;
    }).filter((video) => video !== null);
    if (validVideos.length > 0) {
      urlObj.videos = validVideos;
    }
  }
  if (urlElement.link) {
    const links = Array.isArray(urlElement.link) ? urlElement.link : [urlElement.link];
    const alternatives = links.map((link) => {
      if (link.rel === "alternate" && isValidString(link.hreflang) && isValidString(link.href)) {
        return {
          hreflang: link.hreflang,
          href: link.href
        };
      } else {
        warnings.push({
          type: "validation",
          message: 'Alternative link missing required rel="alternate", hreflang, or href',
          context: { url: urlElement.loc, field: "link" }
        });
        return null;
      }
    }).filter((alt) => alt !== null);
    if (alternatives.length > 0) {
      urlObj.alternatives = alternatives;
    }
  }
  if (urlElement.news && typeof urlElement.news === "object") {
    const news = urlElement.news;
    if (isValidString(news.title) && isValidString(news.publication_date) && news.publication && isValidString(news.publication.name) && isValidString(news.publication.language)) {
      urlObj.news = {
        title: news.title,
        publication_date: news.publication_date,
        publication: {
          name: news.publication.name,
          language: news.publication.language
        }
      };
    } else {
      warnings.push({
        type: "validation",
        message: "News entry missing required fields (title, publication_date, publication.name, publication.language)",
        context: { url: urlElement.loc, field: "news" }
      });
    }
  }
  return Object.fromEntries(
    Object.entries(urlObj).filter(
      ([_, value]) => value != null && (!Array.isArray(value) || value.length > 0)
    )
  );
}
async function parseSitemapXml(xml) {
  const warnings = [];
  if (!xml) {
    throw new Error("Empty XML input provided");
  }
  const { XMLParser } = await import('fast-xml-parser');
  const parser = new XMLParser({
    isArray: (tagName) => ["url", "image", "video", "link", "tag", "price"].includes(tagName),
    removeNSPrefix: true,
    parseAttributeValue: false,
    ignoreAttributes: false,
    attributeNamePrefix: "",
    trimValues: true
  });
  try {
    const parsed = parser.parse(xml);
    if (!parsed?.urlset) {
      throw new Error("XML does not contain a valid urlset element");
    }
    if (!parsed.urlset.url) {
      throw new Error("Sitemap contains no URL entries");
    }
    const urls = Array.isArray(parsed.urlset.url) ? parsed.urlset.url : [parsed.urlset.url];
    const validUrls = urls.map((url) => extractUrlFromParsedElement(url, warnings)).filter((url) => url !== null);
    if (validUrls.length === 0 && urls.length > 0) {
      warnings.push({
        type: "validation",
        message: "No valid URLs found in sitemap after validation"
      });
    }
    return { urls: validUrls, warnings };
  } catch (error) {
    if (error instanceof Error && (error.message === "Empty XML input provided" || error.message === "XML does not contain a valid urlset element" || error.message === "Sitemap contains no URL entries")) {
      throw error;
    }
    throw new Error(`Failed to parse XML: ${error instanceof Error ? error.message : String(error)}`);
  }
}

function normalizeSourceInput(source) {
  if (typeof source === "string") {
    return { context: { name: "hook" }, fetch: source };
  }
  if (Array.isArray(source)) {
    return { context: { name: "hook" }, fetch: source };
  }
  return source;
}
async function tryFetchWithFallback(url, options, event) {
  const isExternalUrl = !url.startsWith("/");
  if (isExternalUrl) {
    const strategies = [
      // Strategy 1: Use globalThis.$fetch (original approach)
      () => globalThis.$fetch(url, options),
      // Strategy 2: If event is available, try using event context even for external URLs
      event ? () => event.$fetch(url, options) : null,
      // Strategy 3: Use native fetch as last resort
      () => $fetch(url, options)
    ].filter(Boolean);
    let lastError = null;
    for (const strategy of strategies) {
      try {
        return await strategy();
      } catch (error) {
        lastError = error;
        continue;
      }
    }
    throw lastError;
  }
  const fetchContainer = url.startsWith("/") && event ? event : globalThis;
  return await fetchContainer.$fetch(url, options);
}
async function fetchDataSource(input, event) {
  const context = typeof input.context === "string" ? { name: input.context } : input.context || { name: "fetch" };
  const url = typeof input.fetch === "string" ? input.fetch : input.fetch[0];
  const options = typeof input.fetch === "string" ? {} : input.fetch[1];
  const start = Date.now();
  const isExternalUrl = !url.startsWith("/");
  const timeout = isExternalUrl ? 1e4 : options.timeout || 5e3;
  const timeoutController = new AbortController();
  const abortRequestTimeout = setTimeout(() => timeoutController.abort(), timeout);
  try {
    let isMaybeErrorResponse = false;
    const isXmlRequest = parseURL(url).pathname.endsWith(".xml");
    const mergedHeaders = defu(
      options?.headers,
      {
        Accept: isXmlRequest ? "text/xml" : "application/json"
      },
      event ? { host: getRequestHost(event, { xForwardedHost: true }) } : {}
    );
    const fetchOptions = {
      ...options,
      responseType: isXmlRequest ? "text" : "json",
      signal: timeoutController.signal,
      headers: mergedHeaders,
      // Use ofetch's built-in retry for external sources
      ...isExternalUrl && {
        retry: 2,
        retryDelay: 200
      },
      // @ts-expect-error untyped
      onResponse({ response }) {
        if (typeof response._data === "string" && response._data.startsWith("<!DOCTYPE html>"))
          isMaybeErrorResponse = true;
      }
    };
    const res = await tryFetchWithFallback(url, fetchOptions, event);
    const timeTakenMs = Date.now() - start;
    if (isMaybeErrorResponse) {
      return {
        ...input,
        context,
        urls: [],
        timeTakenMs,
        error: "Received HTML response instead of JSON"
      };
    }
    let urls = [];
    if (typeof res === "object") {
      urls = res.urls || res;
    } else if (typeof res === "string" && parseURL(url).pathname.endsWith(".xml")) {
      const result = await parseSitemapXml(res);
      urls = result.urls;
    }
    return {
      ...input,
      context,
      timeTakenMs,
      urls
    };
  } catch (_err) {
    const error = _err;
    if (isExternalUrl) {
      const errorInfo = {
        url,
        timeout,
        error: error.message,
        statusCode: error.response?.status,
        statusText: error.response?.statusText,
        method: options?.method || "GET"
      };
      logger.error("Failed to fetch external source.", errorInfo);
    } else {
      logger.error("Failed to fetch source.", { url, error: error.message });
    }
    return {
      ...input,
      context,
      urls: [],
      error: error.message,
      _isFailure: true
      // Mark as failure to prevent caching
    };
  } finally {
    if (abortRequestTimeout) {
      clearTimeout(abortRequestTimeout);
    }
  }
}
async function globalSitemapSources() {
  const m = await import('../virtual/global-sources.mjs');
  return [...m.sources];
}
async function childSitemapSources(definition) {
  if (!definition?._hasSourceChunk)
    return [];
  const m = await import('../virtual/child-sources.mjs');
  return [...m.sources[definition.sitemapName] || []];
}
async function resolveSitemapSources(sources, event) {
  return (await Promise.all(
    sources.map((source) => {
      const normalized = normalizeSourceInput(source);
      if ("urls" in normalized) {
        return {
          timeTakenMs: 0,
          ...normalized,
          urls: normalized.urls
        };
      }
      if (normalized.fetch)
        return fetchDataSource(normalized, event);
      return {
        ...normalized,
        error: "Invalid source"
      };
    })
  )).flat();
}

function sortInPlace(urls) {
  urls.sort((a, b) => {
    const aLoc = typeof a === "string" ? a : a.loc;
    const bLoc = typeof b === "string" ? b : b.loc;
    const aSegments = aLoc.split("/").length;
    const bSegments = bLoc.split("/").length;
    if (aSegments !== bSegments) {
      return aSegments - bSegments;
    }
    return aLoc.localeCompare(bLoc, void 0, { numeric: true });
  });
  return urls;
}

function parseChunkInfo(sitemapName, sitemaps, defaultChunkSize) {
  defaultChunkSize = defaultChunkSize || 1e3;
  if (typeof sitemaps.chunks !== "undefined" && !Number.isNaN(Number(sitemapName))) {
    return {
      isChunked: true,
      baseSitemapName: "sitemap",
      chunkIndex: Number(sitemapName),
      chunkSize: defaultChunkSize
    };
  }
  if (sitemapName.includes("-")) {
    const parts = sitemapName.split("-");
    const lastPart = parts.pop();
    if (!Number.isNaN(Number(lastPart))) {
      const baseSitemapName = parts.join("-");
      const baseSitemap = sitemaps[baseSitemapName];
      if (baseSitemap && (baseSitemap.chunks || baseSitemap._isChunking)) {
        const chunkSize = typeof baseSitemap.chunks === "number" ? baseSitemap.chunks : baseSitemap.chunkSize || defaultChunkSize;
        return {
          isChunked: true,
          baseSitemapName,
          chunkIndex: Number(lastPart),
          chunkSize
        };
      }
    }
  }
  return {
    isChunked: false,
    baseSitemapName: sitemapName,
    chunkIndex: void 0,
    chunkSize: defaultChunkSize
  };
}
function sliceUrlsForChunk(urls, sitemapName, sitemaps, defaultChunkSize = 1e3) {
  const chunkInfo = parseChunkInfo(sitemapName, sitemaps, defaultChunkSize);
  if (chunkInfo.isChunked && chunkInfo.chunkIndex !== void 0) {
    const startIndex = chunkInfo.chunkIndex * chunkInfo.chunkSize;
    const endIndex = (chunkInfo.chunkIndex + 1) * chunkInfo.chunkSize;
    return urls.slice(startIndex, endIndex);
  }
  return urls;
}

function escapeValueForXml(value) {
  if (value === true || value === false)
    return value ? "yes" : "no";
  return xmlEscape(String(value));
}
const yesNo = (v) => v === "yes" || v === true ? "yes" : "no";
const URLSET_OPENING_TAG = '<urlset xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd http://www.google.com/schemas/sitemap-image/1.1 http://www.google.com/schemas/sitemap-image/1.1/sitemap-image.xsd" xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
function buildUrlXml(url, NL, I1, I2, I3, I4) {
  let xml = `${I1}<url>${NL}`;
  if (url.loc) xml += `${I2}<loc>${xmlEscape(url.loc)}</loc>${NL}`;
  if (url.lastmod) xml += `${I2}<lastmod>${url.lastmod}</lastmod>${NL}`;
  if (url.changefreq) xml += `${I2}<changefreq>${url.changefreq}</changefreq>${NL}`;
  if (url.priority !== void 0) {
    const p = typeof url.priority === "number" ? url.priority : Number.parseFloat(url.priority);
    xml += `${I2}<priority>${p.toFixed(1)}</priority>${NL}`;
  }
  if (url.alternatives) {
    for (const alt of url.alternatives) {
      let attrs = "";
      for (const [k, v] of Object.entries(alt)) attrs += ` ${k}="${xmlEscape(String(v))}"`;
      xml += `${I2}<xhtml:link rel="alternate"${attrs} />${NL}`;
    }
  }
  if (url.images) {
    for (const img of url.images) {
      xml += `${I2}<image:image>${NL}${I3}<image:loc>${xmlEscape(img.loc)}</image:loc>${NL}`;
      if (img.title) xml += `${I3}<image:title>${xmlEscape(img.title)}</image:title>${NL}`;
      if (img.caption) xml += `${I3}<image:caption>${xmlEscape(img.caption)}</image:caption>${NL}`;
      if (img.geo_location) xml += `${I3}<image:geo_location>${xmlEscape(img.geo_location)}</image:geo_location>${NL}`;
      if (img.license) xml += `${I3}<image:license>${xmlEscape(img.license)}</image:license>${NL}`;
      xml += `${I2}</image:image>${NL}`;
    }
  }
  if (url.videos) {
    for (const video of url.videos) {
      xml += `${I2}<video:video>${NL}${I3}<video:title>${xmlEscape(video.title)}</video:title>${NL}`;
      if (video.thumbnail_loc) xml += `${I3}<video:thumbnail_loc>${xmlEscape(video.thumbnail_loc)}</video:thumbnail_loc>${NL}`;
      xml += `${I3}<video:description>${xmlEscape(video.description)}</video:description>${NL}`;
      if (video.content_loc) xml += `${I3}<video:content_loc>${xmlEscape(video.content_loc)}</video:content_loc>${NL}`;
      if (video.player_loc) xml += `${I3}<video:player_loc>${xmlEscape(video.player_loc)}</video:player_loc>${NL}`;
      if (video.duration !== void 0) xml += `${I3}<video:duration>${video.duration}</video:duration>${NL}`;
      if (video.expiration_date) xml += `${I3}<video:expiration_date>${video.expiration_date}</video:expiration_date>${NL}`;
      if (video.rating !== void 0) xml += `${I3}<video:rating>${video.rating}</video:rating>${NL}`;
      if (video.view_count !== void 0) xml += `${I3}<video:view_count>${video.view_count}</video:view_count>${NL}`;
      if (video.publication_date) xml += `${I3}<video:publication_date>${video.publication_date}</video:publication_date>${NL}`;
      if (video.family_friendly !== void 0) xml += `${I3}<video:family_friendly>${yesNo(video.family_friendly)}</video:family_friendly>${NL}`;
      if (video.restriction) xml += `${I3}<video:restriction relationship="${video.restriction.relationship || "allow"}">${xmlEscape(video.restriction.restriction)}</video:restriction>${NL}`;
      if (video.platform) xml += `${I3}<video:platform relationship="${video.platform.relationship || "allow"}">${xmlEscape(video.platform.platform)}</video:platform>${NL}`;
      if (video.requires_subscription !== void 0) xml += `${I3}<video:requires_subscription>${yesNo(video.requires_subscription)}</video:requires_subscription>${NL}`;
      if (video.price) {
        for (const price of video.price) {
          const c = price.currency ? ` currency="${price.currency}"` : "";
          const t = price.type ? ` type="${price.type}"` : "";
          xml += `${I3}<video:price${c}${t}>${xmlEscape(String(price.price ?? ""))}</video:price>${NL}`;
        }
      }
      if (video.uploader) {
        const info = video.uploader.info ? ` info="${xmlEscape(video.uploader.info)}"` : "";
        xml += `${I3}<video:uploader${info}>${xmlEscape(video.uploader.uploader)}</video:uploader>${NL}`;
      }
      if (video.live !== void 0) xml += `${I3}<video:live>${yesNo(video.live)}</video:live>${NL}`;
      if (video.tag) {
        const tags = Array.isArray(video.tag) ? video.tag : [video.tag];
        for (const t of tags) xml += `${I3}<video:tag>${xmlEscape(t)}</video:tag>${NL}`;
      }
      if (video.category) xml += `${I3}<video:category>${xmlEscape(video.category)}</video:category>${NL}`;
      if (video.gallery_loc) xml += `${I3}<video:gallery_loc>${xmlEscape(video.gallery_loc)}</video:gallery_loc>${NL}`;
      xml += `${I2}</video:video>${NL}`;
    }
  }
  if (url.news) {
    xml += `${I2}<news:news>${NL}${I3}<news:publication>${NL}`;
    xml += `${I4}<news:name>${xmlEscape(url.news.publication.name)}</news:name>${NL}`;
    xml += `${I4}<news:language>${xmlEscape(url.news.publication.language)}</news:language>${NL}`;
    xml += `${I3}</news:publication>${NL}`;
    if (url.news.title) xml += `${I3}<news:title>${xmlEscape(url.news.title)}</news:title>${NL}`;
    if (url.news.publication_date) xml += `${I3}<news:publication_date>${url.news.publication_date}</news:publication_date>${NL}`;
    xml += `${I2}</news:news>${NL}`;
  }
  xml += `${I1}</url>`;
  return xml;
}
function urlsToXml(urls, resolvers, { version, xsl, credits, minify }, errorInfo) {
  let xslHref = xsl ? resolvers.relativeBaseUrlResolver(xsl) : false;
  if (xslHref && errorInfo?.messages.length) {
    xslHref = withQuery(xslHref, {
      errors: "true",
      error_messages: errorInfo.messages,
      error_urls: errorInfo.urls
    });
  }
  const NL = minify ? "" : "\n";
  const I1 = minify ? "" : "    ";
  const I2 = minify ? "" : "        ";
  const I3 = minify ? "" : "            ";
  const I4 = minify ? "" : "                ";
  let xml = xslHref ? `<?xml version="1.0" encoding="UTF-8"?><?xml-stylesheet type="text/xsl" href="${escapeValueForXml(xslHref)}"?>${NL}` : `<?xml version="1.0" encoding="UTF-8"?>${NL}`;
  xml += URLSET_OPENING_TAG + NL;
  for (const url of urls) {
    xml += buildUrlXml(url, NL, I1, I2, I3, I4) + NL;
  }
  xml += "</urlset>";
  if (credits) {
    xml += `${NL}<!-- XML Sitemap generated by @nuxtjs/sitemap v${version} at ${(/* @__PURE__ */ new Date()).toISOString()} -->`;
  }
  return xml;
}

function resolveSitemapEntries(sitemap, urls, runtimeConfig, resolvers) {
  const {
    autoI18n,
    isI18nMapped
  } = runtimeConfig;
  const filterPath = createPathFilter({
    include: sitemap.include,
    exclude: sitemap.exclude
  });
  const _urls = urls.map((_e) => {
    const e = preNormalizeEntry(_e, resolvers);
    if (!e.loc || !filterPath(e.loc))
      return false;
    return e;
  }).filter(Boolean);
  let validI18nUrlsForTransform = [];
  const withoutPrefixPaths = {};
  if (autoI18n && autoI18n.strategy !== "no_prefix") {
    const localeCodes = autoI18n.locales.map((l) => l.code);
    const localeByCode = new Map(autoI18n.locales.map((l) => [l.code, l]));
    const isPrefixStrategy = autoI18n.strategy === "prefix";
    const isPrefixExceptOrAndDefault = autoI18n.strategy === "prefix_and_default" || autoI18n.strategy === "prefix_except_default";
    const xDefaultAndLocales = [{ code: "x-default", _hreflang: "x-default" }, ...autoI18n.locales];
    const defaultLocale = autoI18n.defaultLocale;
    const hasPages = !!autoI18n.pages;
    const hasDifferentDomains = !!autoI18n.differentDomains;
    validI18nUrlsForTransform = _urls.map((_e, i) => {
      if (_e._abs)
        return false;
      const split = splitForLocales(_e._relativeLoc, localeCodes);
      let localeCode = split[0];
      const pathWithoutPrefix = split[1];
      if (!localeCode)
        localeCode = defaultLocale;
      const e = _e;
      e._pathWithoutPrefix = pathWithoutPrefix;
      const locale = localeByCode.get(localeCode);
      if (!locale)
        return false;
      e._locale = locale;
      e._index = i;
      e._key = `${e._sitemap || ""}${e._path?.pathname || "/"}${e._path?.search || ""}`;
      withoutPrefixPaths[pathWithoutPrefix] = withoutPrefixPaths[pathWithoutPrefix] || [];
      if (!withoutPrefixPaths[pathWithoutPrefix].some((e2) => e2._locale.code === locale.code))
        withoutPrefixPaths[pathWithoutPrefix].push(e);
      return e;
    }).filter(Boolean);
    for (const e of validI18nUrlsForTransform) {
      if (!e._i18nTransform && !e.alternatives?.length) {
        const alternatives = (withoutPrefixPaths[e._pathWithoutPrefix] || []).map((u) => {
          const entries = [];
          if (u._locale.code === defaultLocale) {
            entries.push({
              href: u.loc,
              hreflang: "x-default"
            });
          }
          entries.push({
            href: u.loc,
            hreflang: u._locale._hreflang || defaultLocale
          });
          return entries;
        }).flat().filter(Boolean);
        if (alternatives.length)
          e.alternatives = alternatives;
      } else if (e._i18nTransform) {
        delete e._i18nTransform;
        if (hasDifferentDomains) {
          const defLocale = localeByCode.get(defaultLocale);
          e.alternatives = [
            {
              ...defLocale,
              code: "x-default"
            },
            ...autoI18n.locales.filter((l) => !!l.domain)
          ].map((locale) => {
            return {
              hreflang: locale._hreflang,
              href: joinURL(withHttps(locale.domain), e._pathWithoutPrefix)
            };
          });
        } else {
          const pageMatch = hasPages ? findPageMapping(e._pathWithoutPrefix, autoI18n.pages) : null;
          const pathSearch = e._path?.search || "";
          const pathWithoutPrefix = e._pathWithoutPrefix;
          for (const l of autoI18n.locales) {
            let loc = pathWithoutPrefix;
            if (pageMatch && pageMatch.mappings[l.code] !== void 0) {
              const customPath = pageMatch.mappings[l.code];
              if (customPath === false)
                continue;
              if (typeof customPath === "string") {
                loc = customPath[0] === "/" ? customPath : `/${customPath}`;
                loc = applyDynamicParams(loc, pageMatch.paramSegments);
                if (isPrefixStrategy || isPrefixExceptOrAndDefault && l.code !== defaultLocale)
                  loc = joinURL(`/${l.code}`, loc);
              }
            } else if (!hasDifferentDomains && !(isPrefixExceptOrAndDefault && l.code === defaultLocale)) {
              loc = joinURL(`/${l.code}`, pathWithoutPrefix);
            }
            const _sitemap = isI18nMapped ? l._sitemap : void 0;
            const alternatives = [];
            for (const locale of xDefaultAndLocales) {
              const code = locale.code === "x-default" ? defaultLocale : locale.code;
              const isDefault = locale.code === "x-default" || locale.code === defaultLocale;
              let href = pathWithoutPrefix;
              if (pageMatch && pageMatch.mappings[code] !== void 0) {
                const customPath = pageMatch.mappings[code];
                if (customPath === false)
                  continue;
                if (typeof customPath === "string") {
                  href = customPath[0] === "/" ? customPath : `/${customPath}`;
                  href = applyDynamicParams(href, pageMatch.paramSegments);
                  if (isPrefixStrategy || isPrefixExceptOrAndDefault && !isDefault)
                    href = joinURL("/", code, href);
                }
              } else if (isPrefixStrategy) {
                href = joinURL("/", code, pathWithoutPrefix);
              } else if (isPrefixExceptOrAndDefault && !isDefault) {
                href = joinURL("/", code, pathWithoutPrefix);
              }
              if (!filterPath(href))
                continue;
              alternatives.push({
                hreflang: locale._hreflang,
                href
              });
            }
            const { _index: _, ...rest } = e;
            const newEntry = preNormalizeEntry({
              _sitemap,
              ...rest,
              _key: `${_sitemap || ""}${loc || "/"}${pathSearch}`,
              _locale: l,
              loc,
              alternatives
            }, resolvers);
            if (e._locale.code === newEntry._locale.code) {
              _urls[e._index] = newEntry;
              e._index = void 0;
            } else {
              _urls.push(newEntry);
            }
          }
        }
      }
      if (isI18nMapped) {
        e._sitemap = e._sitemap || e._locale._sitemap;
        e._key = `${e._sitemap || ""}${e.loc || "/"}${e._path?.search || ""}`;
      }
      if (e._index)
        _urls[e._index] = e;
    }
  }
  return _urls;
}
async function buildSitemapUrls(sitemap, resolvers, runtimeConfig, nitro) {
  const {
    sitemaps,
    // enhancing
    autoI18n,
    isI18nMapped,
    isMultiSitemap,
    // sorting
    sortEntries,
    // chunking
    defaultSitemapsChunkSize
  } = runtimeConfig;
  const chunkSize = defaultSitemapsChunkSize || void 0;
  const chunkInfo = parseChunkInfo(sitemap.sitemapName, sitemaps, chunkSize);
  function maybeSort(urls2) {
    return sortEntries ? sortInPlace(urls2) : urls2;
  }
  function maybeSlice(urls2) {
    return sliceUrlsForChunk(urls2, sitemap.sitemapName, sitemaps, chunkSize);
  }
  if (autoI18n?.differentDomains) {
    const domain = autoI18n.locales.find((e) => e.language === sitemap.sitemapName || e.code === sitemap.sitemapName)?.domain;
    if (domain) {
      const _tester = resolvers.canonicalUrlResolver;
      resolvers.canonicalUrlResolver = (path) => resolveSitePath(path, {
        absolute: true,
        withBase: false,
        siteUrl: withHttps(domain),
        trailingSlash: _tester("/test/").endsWith("/"),
        base: "/"
      });
    }
  }
  let effectiveSitemap = sitemap;
  const baseSitemapName = chunkInfo.baseSitemapName;
  if (chunkInfo.isChunked && baseSitemapName !== sitemap.sitemapName && sitemaps[baseSitemapName]) {
    effectiveSitemap = sitemaps[baseSitemapName];
  }
  let sourcesInput = effectiveSitemap.includeAppSources ? [...await globalSitemapSources(), ...await childSitemapSources(effectiveSitemap)] : await childSitemapSources(effectiveSitemap);
  if (nitro && resolvers.event) {
    const ctx = {
      event: resolvers.event,
      sitemapName: baseSitemapName,
      sources: sourcesInput
    };
    await nitro.hooks.callHook("sitemap:sources", ctx);
    sourcesInput = ctx.sources;
  }
  const sources = await resolveSitemapSources(sourcesInput, resolvers.event);
  const failedSources = sources.filter((source) => source.error && source._isFailure).map((source) => ({
    url: typeof source.fetch === "string" ? source.fetch : source.fetch?.[0] || "unknown",
    error: source.error || "Unknown error"
  }));
  const resolvedCtx = {
    urls: sources.flatMap((s) => s.urls),
    sitemapName: sitemap.sitemapName,
    event: resolvers.event
  };
  await nitro?.hooks.callHook("sitemap:input", resolvedCtx);
  const enhancedUrls = resolveSitemapEntries(sitemap, resolvedCtx.urls, { autoI18n, isI18nMapped }, resolvers);
  const filteredUrls = enhancedUrls.filter((e) => {
    if (e._sitemap === false)
      return false;
    if (isMultiSitemap && e._sitemap && sitemap.sitemapName) {
      if (sitemap._isChunking)
        return sitemap.sitemapName.startsWith(e._sitemap + "-");
      return e._sitemap === sitemap.sitemapName;
    }
    return true;
  });
  const sortedUrls = maybeSort(filteredUrls);
  const urls = maybeSlice(sortedUrls);
  return { urls, failedSources };
}

function useNitroUrlResolvers(e) {
  const canonicalQuery = getQuery(e).canonical;
  const isShowingCanonical = typeof canonicalQuery !== "undefined" && canonicalQuery !== "false";
  const siteConfig = useSiteConfig(e);
  return {
    event: e,
    fixSlashes: (path) => fixSlashes(siteConfig.trailingSlash, path),
    // we need these as they depend on the nitro event
    canonicalUrlResolver: createSitePathResolver(e, {
      canonical: isShowingCanonical || true,
      absolute: true,
      withBase: true
    }),
    relativeBaseUrlResolver: createSitePathResolver(e, { absolute: false, withBase: true })
  };
}
async function buildSitemapXml(event, definition, resolvers, runtimeConfig) {
  const { sitemapName } = definition;
  const nitro = useNitroApp();
  const { urls: sitemapUrls, failedSources } = await buildSitemapUrls(definition, resolvers, runtimeConfig, nitro);
  const routeRuleMatcher = createNitroRouteRuleMatcher();
  const { autoI18n } = runtimeConfig;
  let validCount = 0;
  for (let i = 0; i < sitemapUrls.length; i++) {
    const u = sitemapUrls[i];
    const path = u._path?.pathname || u.loc;
    if (!getPathRobotConfig(event, { path, skipSiteIndexable: true }).indexable)
      continue;
    let routeRules = routeRuleMatcher(path);
    if (autoI18n?.locales && autoI18n?.strategy !== "no_prefix") {
      const match = splitForLocales(path, autoI18n.locales.map((l) => l.code));
      const pathWithoutPrefix = match[1];
      if (pathWithoutPrefix && pathWithoutPrefix !== path)
        routeRules = defu(routeRules, routeRuleMatcher(pathWithoutPrefix));
    }
    if (routeRules.sitemap === false)
      continue;
    if (typeof routeRules.robots !== "undefined" && !routeRules.robots)
      continue;
    const hasRobotsDisabled = Object.entries(routeRules.headers || {}).some(([name, value]) => name.toLowerCase() === "x-robots-tag" && value.toLowerCase().includes("noindex"));
    if (routeRules.redirect || hasRobotsDisabled)
      continue;
    sitemapUrls[validCount++] = routeRules.sitemap ? defu(u, routeRules.sitemap) : u;
  }
  sitemapUrls.length = validCount;
  const locSize = sitemapUrls.length;
  const resolvedCtx = {
    urls: sitemapUrls,
    sitemapName,
    event
  };
  await nitro.hooks.callHook("sitemap:resolved", resolvedCtx);
  if (resolvedCtx.urls.length !== locSize) {
    resolvedCtx.urls = resolvedCtx.urls.map((e) => preNormalizeEntry(e, resolvers));
  }
  const maybeSort = (urls2) => runtimeConfig.sortEntries ? sortInPlace(urls2) : urls2;
  const defaults = definition.defaults || {};
  const normalizedPreDedupe = resolvedCtx.urls.map((e) => normaliseEntry(e, defaults, resolvers));
  const urls = maybeSort(mergeOnKey(normalizedPreDedupe, "_key").map((e) => normaliseEntry(e, defaults, resolvers)));
  if (definition._isChunking && definition.sitemapName.includes("-")) {
    const parts = definition.sitemapName.split("-");
    const lastPart = parts.pop();
    if (!Number.isNaN(Number(lastPart))) {
      const chunkIndex = Number(lastPart);
      const baseSitemapName = parts.join("-");
      if (urls.length === 0 && chunkIndex > 0) {
        throw createError$1({
          statusCode: 404,
          message: `Sitemap chunk ${chunkIndex} for "${baseSitemapName}" does not exist.`
        });
      }
    }
  }
  const errorInfo = failedSources.length > 0 ? {
    messages: failedSources.map((f) => f.error),
    urls: failedSources.map((f) => f.url)
  } : void 0;
  const sitemap = urlsToXml(urls, resolvers, runtimeConfig, errorInfo);
  const ctx = { sitemap, sitemapName, event };
  await nitro.hooks.callHook("sitemap:output", ctx);
  return ctx.sitemap;
}
const buildSitemapXmlCached = defineCachedFunction(
  buildSitemapXml,
  {
    name: "sitemap:xml",
    group: "sitemap",
    maxAge: 60 * 10,
    // Default 10 minutes
    base: "sitemap",
    // Use the sitemap storage
    getKey: (event, definition) => {
      const host = getHeader(event, "host") || getHeader(event, "x-forwarded-host") || "";
      const proto = getHeader(event, "x-forwarded-proto") || "https";
      const sitemapName = definition.sitemapName || "default";
      return `${sitemapName}-${proto}-${host}`;
    },
    swr: true
    // Enable stale-while-revalidate
  }
);
async function createSitemap(event, definition, runtimeConfig) {
  const resolvers = useNitroUrlResolvers(event);
  const shouldCache = typeof runtimeConfig.cacheMaxAgeSeconds === "number" && runtimeConfig.cacheMaxAgeSeconds > 0;
  const xml = shouldCache ? await buildSitemapXmlCached(event, definition, resolvers, runtimeConfig) : await buildSitemapXml(event, definition, resolvers, runtimeConfig);
  setHeader(event, "Content-Type", "text/xml; charset=UTF-8");
  if (runtimeConfig.cacheMaxAgeSeconds) {
    setHeader(event, "Cache-Control", `public, max-age=${runtimeConfig.cacheMaxAgeSeconds}, s-maxage=${runtimeConfig.cacheMaxAgeSeconds}, stale-while-revalidate=3600`);
    const now = /* @__PURE__ */ new Date();
    setHeader(event, "X-Sitemap-Generated", now.toISOString());
    setHeader(event, "X-Sitemap-Cache-Duration", `${runtimeConfig.cacheMaxAgeSeconds}s`);
    const expiryTime = new Date(now.getTime() + runtimeConfig.cacheMaxAgeSeconds * 1e3);
    setHeader(event, "X-Sitemap-Cache-Expires", expiryTime.toISOString());
    const remainingSeconds = Math.floor((expiryTime.getTime() - now.getTime()) / 1e3);
    setHeader(event, "X-Sitemap-Cache-Remaining", `${remainingSeconds}s`);
  } else {
    setHeader(event, "Cache-Control", `no-cache, no-store`);
  }
  event.context._isSitemap = true;
  return xml;
}

async function sitemapXmlEventHandler(e) {
  const runtimeConfig = useSitemapRuntimeConfig();
  const { sitemaps } = runtimeConfig;
  if ("index" in sitemaps)
    return sendRedirect(e, withBase("/sitemap_index.xml", useRuntimeConfig().app.baseURL), 301);
  return createSitemap(e, Object.values(sitemaps)[0], runtimeConfig);
}

const _XZ6SnB = defineEventHandler(sitemapXmlEventHandler);

const _lazy_YVYkz3 = () => import('../routes/api/carrier/announce/create-offer.post.mjs');
const _lazy_9GrQ0G = () => import('../routes/api/carrier/announce/list-offer.get.mjs');
const _lazy_FscYok = () => import('../routes/api/carrier/announce/offer-accept.post.mjs');
const _lazy_A3lm9l = () => import('../routes/api/carrier/announce/offer-reject.post.mjs');
const _lazy_wba715 = () => import('../routes/api/carrier/availability/add.post.mjs');
const _lazy_DiPXOS = () => import('../routes/api/carrier/availability/booking-accept.post.mjs');
const _lazy_wbmDRB = () => import('../routes/api/carrier/availability/booking-counter.post.mjs');
const _lazy_X0S61r = () => import('../routes/api/carrier/availability/booking-reject.post.mjs');
const _lazy_KGKfmn = () => import('../routes/api/carrier/availability/list.get.mjs');
const _lazy_jb60QS = () => import('../routes/api/carrier/availability/mine.get.mjs');
const _lazy_DjZPUC = () => import('../routes/api/carrier/availability/remove.delete.mjs');
const _lazy_JMnQHr = () => import('../routes/api/carrier/availability/update.patch.mjs');
const _lazy_VanZj5 = () => import('../routes/api/carrier/vehicles/add.post.mjs');
const _lazy_tIapnF = () => import('../routes/api/carrier/vehicles/list.get.mjs');
const _lazy_GjjjpA = () => import('../routes/api/carrier/vehicles/mine.get.mjs');
const _lazy_T5yK4O = () => import('../routes/api/carrier/vehicles/remove.delete.mjs');
const _lazy_OgTqEo = () => import('../routes/api/carrier/vehicles/update-status.patch.mjs');
const _lazy_4VybMG = () => import('../routes/api/carrier/vehicles/update-vehicle.patch.mjs');
const _lazy_9OeZyW = () => import('../routes/api/cities.get.mjs');
const _lazy_jv7T_F = () => import('../routes/api/common/auth/forgot-password.post.mjs');
const _lazy_O3EqDk = () => import('../routes/api/common/auth/login.post.mjs');
const _lazy_BdGU5M = () => import('../routes/api/common/auth/logout.post.mjs');
const _lazy_eTkryF = () => import('../routes/api/common/auth/register.post.mjs');
const _lazy_6iM84x = () => import('../routes/api/common/auth/resend-verification.post.mjs');
const _lazy_bgDqxJ = () => import('../routes/api/common/auth/reset-password.post.mjs');
const _lazy_TcIzGi = () => import('../routes/api/common/auth/verify-email.post.mjs');
const _lazy_21tz4k = () => import('../routes/api/common/messaging/conversations.get.mjs');
const _lazy_c1sLcL = () => import('../routes/api/common/messaging/messages.get.mjs');
const _lazy_m8YSym = () => import('../routes/api/common/messaging/read.post.mjs');
const _lazy_q8bGJV = () => import('../routes/api/common/messaging/send.post.mjs');
const _lazy_DO18Dl = () => import('../routes/api/common/notifications/list.get.mjs');
const _lazy_rA7jLJ = () => import('../routes/api/common/notifications/mark-all-read.patch.mjs');
const _lazy_mC_WBG = () => import('../routes/api/common/notifications/mine.get.mjs');
const _lazy__pFnVR = () => import('../routes/api/common/notifications/remove.delete.mjs');
const _lazy__UddpY = () => import('../routes/api/common/other/announce-counter.post.mjs');
const _lazy_J3eUo9 = () => import('../routes/api/common/profile/delete-account.delete.mjs');
const _lazy_mUBhmz = () => import('../routes/api/common/profile/email.patch.mjs');
const _lazy__t67fd = () => import('../routes/api/common/profile/kyc-document.get.mjs');
const _lazy_LgcU7x = () => import('../routes/api/common/profile/kyc-download.get.mjs');
const _lazy_SvkgOu = () => import('../routes/api/common/profile/Kyc-upload.post.mjs');
const _lazy_rWeU4y = () => import('../routes/api/common/profile/kyc-view.get.mjs');
const _lazy_Cm1hVG = () => import('../routes/api/common/profile/me.get.mjs');
const _lazy_wFSLrn = () => import('../routes/api/common/profile/password.patch.mjs');
const _lazy_ds7KeY = () => import('../routes/api/common/profile/update-profile.patch.mjs');
const _lazy_7BSJjh = () => import('../routes/api/common/profile/upload-photo.post.mjs');
const _lazy_8AVZPa = () => import('../routes/api/common/subscription/cancel.post.mjs');
const _lazy_IFOmuR = () => import('../routes/api/common/subscription/checkout.post.mjs');
const _lazy_IUOGhj = () => import('../routes/api/common/subscription/invoice.get.mjs');
const _lazy_flZ71g = () => import('../routes/api/common/subscription/transactions.get.mjs');
const _lazy_PjRlyf = () => import('../routes/api/common/subscription/verify.get.mjs');
const _lazy_Au4NRy = () => import('../routes/api/common/users/detail.get.mjs');
const _lazy_WPTW7V = () => import('../routes/api/common/users/list.get.mjs');
const _lazy__8sJtg = () => import('../routes/api/common/users/rate.post.mjs');
const _lazy_jxtl4w = () => import('../routes/api/countries.get.mjs');
const _lazy_Zurwuz = () => import('../routes/api/public/announce/get.get.mjs');
const _lazy_PpHrVI = () => import('../routes/api/public/announce/list.get.mjs');
const _lazy_WDCqxM = () => import('../routes/api/public/availability/list.get.mjs');
const _lazy_O24nPa = () => import('../routes/api/public/availability/mine.get.mjs');
const _lazy_AXnmxC = () => import('../routes/api/public/cms/article.get.mjs');
const _lazy_bBGof1 = () => import('../routes/api/public/cms/legal.get.mjs');
const _lazy_z7nnE2 = () => import('../routes/api/public/cms/ressource.get.mjs');
const _lazy_tH4aiw = () => import('../routes/api/public/other/contract-file.get.mjs');
const _lazy_oFmoPs = () => import('../routes/api/public/other/status.get.mjs');
const _lazy_cw9ss0 = () => import('../routes/api/public/other/submit-contact.post.mjs');
const _lazy_56KifM = () => import('../routes/api/public/profile-photo.get.mjs');
const _lazy_PDsk5P = () => import('../routes/api/public/profile-photo/_...slug_.get.mjs');
const _lazy_LmfqIX = () => import('../routes/api/reports/_id_.patch.mjs');
const _lazy_Bit3dC = () => import('../routes/api/index.post.mjs');
const _lazy_xLcant = () => import('../routes/api/reviews/_id_.delete.mjs');
const _lazy_R24BMY = () => import('../routes/api/index.post2.mjs');
const _lazy_RxoKbi = () => import('../routes/api/shipper/announce/create.post.mjs');
const _lazy_jCzrPy = () => import('../routes/api/shipper/announce/delete.delete.mjs');
const _lazy_wOlwzH = () => import('../routes/api/shipper/announce/get.get.mjs');
const _lazy_ei_20R = () => import('../routes/api/shipper/announce/list-mine.get.mjs');
const _lazy_EvJlFr = () => import('../routes/api/shipper/announce/offer-accept.post.mjs');
const _lazy_FSfq1r = () => import('../routes/api/shipper/announce/offer-list.get.mjs');
const _lazy_SBVGbu = () => import('../routes/api/shipper/announce/offer-reject.post.mjs');
const _lazy_OR_xtX = () => import('../routes/api/shipper/announce/update.patch.mjs');
const _lazy_8Hp1d4 = () => import('../routes/api/shipper/availability/booking-accept.post.mjs');
const _lazy_VCfAdo = () => import('../routes/api/shipper/availability/booking-reject.post.mjs');
const _lazy_Mw8m3I = () => import('../routes/api/shipper/availability/counter.post.mjs');
const _lazy_3HHkqS = () => import('../routes/api/shipper/availability/enroll.post.mjs');
const _lazy_O7GNYR = () => import('../routes/api/shipper/availability/list.get.mjs');
const _lazy_jXDHtp = () => import('../routes/api/shipper/availability/mine.get.mjs');
const _lazy_9YWsga = () => import('../routes/api/v1/_..._.mjs');
const _lazy_6YHiCk = () => import('../routes/renderer.mjs');

const handlers = [
  { route: '', handler: _gU6oUG, lazy: false, middleware: true, method: undefined },
  { route: '/api/carrier/announce/create-offer', handler: _lazy_YVYkz3, lazy: true, middleware: false, method: "post" },
  { route: '/api/carrier/announce/list-offer', handler: _lazy_9GrQ0G, lazy: true, middleware: false, method: "get" },
  { route: '/api/carrier/announce/offer-accept', handler: _lazy_FscYok, lazy: true, middleware: false, method: "post" },
  { route: '/api/carrier/announce/offer-reject', handler: _lazy_A3lm9l, lazy: true, middleware: false, method: "post" },
  { route: '/api/carrier/availability/add', handler: _lazy_wba715, lazy: true, middleware: false, method: "post" },
  { route: '/api/carrier/availability/booking-accept', handler: _lazy_DiPXOS, lazy: true, middleware: false, method: "post" },
  { route: '/api/carrier/availability/booking-counter', handler: _lazy_wbmDRB, lazy: true, middleware: false, method: "post" },
  { route: '/api/carrier/availability/booking-reject', handler: _lazy_X0S61r, lazy: true, middleware: false, method: "post" },
  { route: '/api/carrier/availability/list', handler: _lazy_KGKfmn, lazy: true, middleware: false, method: "get" },
  { route: '/api/carrier/availability/mine', handler: _lazy_jb60QS, lazy: true, middleware: false, method: "get" },
  { route: '/api/carrier/availability/remove', handler: _lazy_DjZPUC, lazy: true, middleware: false, method: "delete" },
  { route: '/api/carrier/availability/update', handler: _lazy_JMnQHr, lazy: true, middleware: false, method: "patch" },
  { route: '/api/carrier/vehicles/add', handler: _lazy_VanZj5, lazy: true, middleware: false, method: "post" },
  { route: '/api/carrier/vehicles/list', handler: _lazy_tIapnF, lazy: true, middleware: false, method: "get" },
  { route: '/api/carrier/vehicles/mine', handler: _lazy_GjjjpA, lazy: true, middleware: false, method: "get" },
  { route: '/api/carrier/vehicles/remove', handler: _lazy_T5yK4O, lazy: true, middleware: false, method: "delete" },
  { route: '/api/carrier/vehicles/update-status', handler: _lazy_OgTqEo, lazy: true, middleware: false, method: "patch" },
  { route: '/api/carrier/vehicles/update-vehicle', handler: _lazy_4VybMG, lazy: true, middleware: false, method: "patch" },
  { route: '/api/cities', handler: _lazy_9OeZyW, lazy: true, middleware: false, method: "get" },
  { route: '/api/common/auth/forgot-password', handler: _lazy_jv7T_F, lazy: true, middleware: false, method: "post" },
  { route: '/api/common/auth/login', handler: _lazy_O3EqDk, lazy: true, middleware: false, method: "post" },
  { route: '/api/common/auth/logout', handler: _lazy_BdGU5M, lazy: true, middleware: false, method: "post" },
  { route: '/api/common/auth/register', handler: _lazy_eTkryF, lazy: true, middleware: false, method: "post" },
  { route: '/api/common/auth/resend-verification', handler: _lazy_6iM84x, lazy: true, middleware: false, method: "post" },
  { route: '/api/common/auth/reset-password', handler: _lazy_bgDqxJ, lazy: true, middleware: false, method: "post" },
  { route: '/api/common/auth/verify-email', handler: _lazy_TcIzGi, lazy: true, middleware: false, method: "post" },
  { route: '/api/common/messaging/conversations', handler: _lazy_21tz4k, lazy: true, middleware: false, method: "get" },
  { route: '/api/common/messaging/messages', handler: _lazy_c1sLcL, lazy: true, middleware: false, method: "get" },
  { route: '/api/common/messaging/read', handler: _lazy_m8YSym, lazy: true, middleware: false, method: "post" },
  { route: '/api/common/messaging/send', handler: _lazy_q8bGJV, lazy: true, middleware: false, method: "post" },
  { route: '/api/common/notifications/list', handler: _lazy_DO18Dl, lazy: true, middleware: false, method: "get" },
  { route: '/api/common/notifications/mark-all-read', handler: _lazy_rA7jLJ, lazy: true, middleware: false, method: "patch" },
  { route: '/api/common/notifications/mine', handler: _lazy_mC_WBG, lazy: true, middleware: false, method: "get" },
  { route: '/api/common/notifications/remove', handler: _lazy__pFnVR, lazy: true, middleware: false, method: "delete" },
  { route: '/api/common/other/announce-counter', handler: _lazy__UddpY, lazy: true, middleware: false, method: "post" },
  { route: '/api/common/profile/delete-account', handler: _lazy_J3eUo9, lazy: true, middleware: false, method: "delete" },
  { route: '/api/common/profile/email', handler: _lazy_mUBhmz, lazy: true, middleware: false, method: "patch" },
  { route: '/api/common/profile/kyc-document', handler: _lazy__t67fd, lazy: true, middleware: false, method: "get" },
  { route: '/api/common/profile/kyc-download', handler: _lazy_LgcU7x, lazy: true, middleware: false, method: "get" },
  { route: '/api/common/profile/Kyc-upload', handler: _lazy_SvkgOu, lazy: true, middleware: false, method: "post" },
  { route: '/api/common/profile/kyc-view', handler: _lazy_rWeU4y, lazy: true, middleware: false, method: "get" },
  { route: '/api/common/profile/me', handler: _lazy_Cm1hVG, lazy: true, middleware: false, method: "get" },
  { route: '/api/common/profile/password', handler: _lazy_wFSLrn, lazy: true, middleware: false, method: "patch" },
  { route: '/api/common/profile/update-profile', handler: _lazy_ds7KeY, lazy: true, middleware: false, method: "patch" },
  { route: '/api/common/profile/upload-photo', handler: _lazy_7BSJjh, lazy: true, middleware: false, method: "post" },
  { route: '/api/common/subscription/cancel', handler: _lazy_8AVZPa, lazy: true, middleware: false, method: "post" },
  { route: '/api/common/subscription/checkout', handler: _lazy_IFOmuR, lazy: true, middleware: false, method: "post" },
  { route: '/api/common/subscription/invoice', handler: _lazy_IUOGhj, lazy: true, middleware: false, method: "get" },
  { route: '/api/common/subscription/transactions', handler: _lazy_flZ71g, lazy: true, middleware: false, method: "get" },
  { route: '/api/common/subscription/verify', handler: _lazy_PjRlyf, lazy: true, middleware: false, method: "get" },
  { route: '/api/common/users/detail', handler: _lazy_Au4NRy, lazy: true, middleware: false, method: "get" },
  { route: '/api/common/users/list', handler: _lazy_WPTW7V, lazy: true, middleware: false, method: "get" },
  { route: '/api/common/users/rate', handler: _lazy__8sJtg, lazy: true, middleware: false, method: "post" },
  { route: '/api/countries', handler: _lazy_jxtl4w, lazy: true, middleware: false, method: "get" },
  { route: '/api/public/announce/get', handler: _lazy_Zurwuz, lazy: true, middleware: false, method: "get" },
  { route: '/api/public/announce/list', handler: _lazy_PpHrVI, lazy: true, middleware: false, method: "get" },
  { route: '/api/public/availability/list', handler: _lazy_WDCqxM, lazy: true, middleware: false, method: "get" },
  { route: '/api/public/availability/mine', handler: _lazy_O24nPa, lazy: true, middleware: false, method: "get" },
  { route: '/api/public/cms/article', handler: _lazy_AXnmxC, lazy: true, middleware: false, method: "get" },
  { route: '/api/public/cms/legal', handler: _lazy_bBGof1, lazy: true, middleware: false, method: "get" },
  { route: '/api/public/cms/ressource', handler: _lazy_z7nnE2, lazy: true, middleware: false, method: "get" },
  { route: '/api/public/other/contract-file', handler: _lazy_tH4aiw, lazy: true, middleware: false, method: "get" },
  { route: '/api/public/other/status', handler: _lazy_oFmoPs, lazy: true, middleware: false, method: "get" },
  { route: '/api/public/other/submit-contact', handler: _lazy_cw9ss0, lazy: true, middleware: false, method: "post" },
  { route: '/api/public/profile-photo', handler: _lazy_56KifM, lazy: true, middleware: false, method: "get" },
  { route: '/api/public/profile-photo/**:slug', handler: _lazy_PDsk5P, lazy: true, middleware: false, method: "get" },
  { route: '/api/reports/:id', handler: _lazy_LmfqIX, lazy: true, middleware: false, method: "patch" },
  { route: '/api/reports', handler: _lazy_Bit3dC, lazy: true, middleware: false, method: "post" },
  { route: '/api/reviews/:id', handler: _lazy_xLcant, lazy: true, middleware: false, method: "delete" },
  { route: '/api/reviews', handler: _lazy_R24BMY, lazy: true, middleware: false, method: "post" },
  { route: '/api/shipper/announce/create', handler: _lazy_RxoKbi, lazy: true, middleware: false, method: "post" },
  { route: '/api/shipper/announce/delete', handler: _lazy_jCzrPy, lazy: true, middleware: false, method: "delete" },
  { route: '/api/shipper/announce/get', handler: _lazy_wOlwzH, lazy: true, middleware: false, method: "get" },
  { route: '/api/shipper/announce/list-mine', handler: _lazy_ei_20R, lazy: true, middleware: false, method: "get" },
  { route: '/api/shipper/announce/offer-accept', handler: _lazy_EvJlFr, lazy: true, middleware: false, method: "post" },
  { route: '/api/shipper/announce/offer-list', handler: _lazy_FSfq1r, lazy: true, middleware: false, method: "get" },
  { route: '/api/shipper/announce/offer-reject', handler: _lazy_SBVGbu, lazy: true, middleware: false, method: "post" },
  { route: '/api/shipper/announce/update', handler: _lazy_OR_xtX, lazy: true, middleware: false, method: "patch" },
  { route: '/api/shipper/availability/booking-accept', handler: _lazy_8Hp1d4, lazy: true, middleware: false, method: "post" },
  { route: '/api/shipper/availability/booking-reject', handler: _lazy_VCfAdo, lazy: true, middleware: false, method: "post" },
  { route: '/api/shipper/availability/counter', handler: _lazy_Mw8m3I, lazy: true, middleware: false, method: "post" },
  { route: '/api/shipper/availability/enroll', handler: _lazy_3HHkqS, lazy: true, middleware: false, method: "post" },
  { route: '/api/shipper/availability/list', handler: _lazy_O7GNYR, lazy: true, middleware: false, method: "get" },
  { route: '/api/shipper/availability/mine', handler: _lazy_jXDHtp, lazy: true, middleware: false, method: "get" },
  { route: '/api/v1/**', handler: _lazy_9YWsga, lazy: true, middleware: false, method: undefined },
  { route: '/__nuxt_error', handler: _lazy_6YHiCk, lazy: true, middleware: false, method: undefined },
  { route: '/__nuxt_island/**', handler: _SxA8c9, lazy: false, middleware: false, method: undefined },
  { route: '', handler: _IFziFF, lazy: false, middleware: true, method: undefined },
  { route: '/robots.txt', handler: _Dra0D3, lazy: false, middleware: false, method: undefined },
  { route: '', handler: _OJed1M, lazy: false, middleware: true, method: undefined },
  { route: '/__sitemap__/style.xsl', handler: _WJydXw, lazy: false, middleware: false, method: undefined },
  { route: '/sitemap.xml', handler: _XZ6SnB, lazy: false, middleware: false, method: undefined },
  { route: '/**', handler: _lazy_6YHiCk, lazy: true, middleware: false, method: undefined }
];

function createNitroApp() {
  const config = useRuntimeConfig();
  const hooks = createHooks();
  const captureError = (error, context = {}) => {
    const promise = hooks.callHookParallel("error", error, context).catch((error_) => {
      console.error("Error while capturing another error", error_);
    });
    if (context.event && isEvent(context.event)) {
      const errors = context.event.context.nitro?.errors;
      if (errors) {
        errors.push({ error, context });
      }
      if (context.event.waitUntil) {
        context.event.waitUntil(promise);
      }
    }
  };
  const h3App = createApp({
    debug: destr(false),
    onError: (error, event) => {
      captureError(error, { event, tags: ["request"] });
      return errorHandler(error, event);
    },
    onRequest: async (event) => {
      event.context.nitro = event.context.nitro || { errors: [] };
      const fetchContext = event.node.req?.__unenv__;
      if (fetchContext?._platform) {
        event.context = {
          _platform: fetchContext?._platform,
          // #3335
          ...fetchContext._platform,
          ...event.context
        };
      }
      if (!event.context.waitUntil && fetchContext?.waitUntil) {
        event.context.waitUntil = fetchContext.waitUntil;
      }
      event.fetch = (req, init) => fetchWithEvent(event, req, init, { fetch: localFetch });
      event.$fetch = (req, init) => fetchWithEvent(event, req, init, {
        fetch: $fetch
      });
      event.waitUntil = (promise) => {
        if (!event.context.nitro._waitUntilPromises) {
          event.context.nitro._waitUntilPromises = [];
        }
        event.context.nitro._waitUntilPromises.push(promise);
        if (event.context.waitUntil) {
          event.context.waitUntil(promise);
        }
      };
      event.captureError = (error, context) => {
        captureError(error, { event, ...context });
      };
      await nitroApp$1.hooks.callHook("request", event).catch((error) => {
        captureError(error, { event, tags: ["request"] });
      });
    },
    onBeforeResponse: async (event, response) => {
      await nitroApp$1.hooks.callHook("beforeResponse", event, response).catch((error) => {
        captureError(error, { event, tags: ["request", "response"] });
      });
    },
    onAfterResponse: async (event, response) => {
      await nitroApp$1.hooks.callHook("afterResponse", event, response).catch((error) => {
        captureError(error, { event, tags: ["request", "response"] });
      });
    }
  });
  const router = createRouter({
    preemptive: true
  });
  const nodeHandler = toNodeListener(h3App);
  const localCall = (aRequest) => b$1(
    nodeHandler,
    aRequest
  );
  const localFetch = (input, init) => {
    if (!input.toString().startsWith("/")) {
      return globalThis.fetch(input, init);
    }
    return C$1(
      nodeHandler,
      input,
      init
    ).then((response) => normalizeFetchResponse(response));
  };
  const $fetch = createFetch({
    fetch: localFetch,
    Headers: Headers$1,
    defaults: { baseURL: config.app.baseURL }
  });
  globalThis.$fetch = $fetch;
  h3App.use(createRouteRulesHandler({ localFetch }));
  for (const h of handlers) {
    let handler = h.lazy ? lazyEventHandler(h.handler) : h.handler;
    if (h.middleware || !h.route) {
      const middlewareBase = (config.app.baseURL + (h.route || "/")).replace(
        /\/+/g,
        "/"
      );
      h3App.use(middlewareBase, handler);
    } else {
      const routeRules = getRouteRulesForPath(
        h.route.replace(/:\w+|\*\*/g, "_")
      );
      if (routeRules.cache) {
        handler = cachedEventHandler(handler, {
          group: "nitro/routes",
          ...routeRules.cache
        });
      }
      router.use(h.route, handler, h.method);
    }
  }
  h3App.use(config.app.baseURL, router.handler);
  const app = {
    hooks,
    h3App,
    router,
    localCall,
    localFetch,
    captureError
  };
  return app;
}
function runNitroPlugins(nitroApp2) {
  for (const plugin of plugins) {
    try {
      plugin(nitroApp2);
    } catch (error) {
      nitroApp2.captureError(error, { tags: ["plugin"] });
      throw error;
    }
  }
}
const nitroApp$1 = createNitroApp();
function useNitroApp() {
  return nitroApp$1;
}
runNitroPlugins(nitroApp$1);

function defineNitroPlugin(def) {
  return def;
}

function defineRenderHandler(render) {
  const runtimeConfig = useRuntimeConfig();
  return eventHandler(async (event) => {
    const nitroApp = useNitroApp();
    const ctx = { event, render, response: void 0 };
    await nitroApp.hooks.callHook("render:before", ctx);
    if (!ctx.response) {
      if (event.path === `${runtimeConfig.app.baseURL}favicon.ico`) {
        setResponseHeader(event, "Content-Type", "image/x-icon");
        return send(
          event,
          "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
        );
      }
      ctx.response = await ctx.render(event);
      if (!ctx.response) {
        const _currentStatus = getResponseStatus(event);
        setResponseStatus(event, _currentStatus === 200 ? 500 : _currentStatus);
        return send(
          event,
          "No response returned from render handler: " + event.path
        );
      }
    }
    await nitroApp.hooks.callHook("render:response", ctx.response, ctx);
    if (ctx.response.headers) {
      setResponseHeaders(event, ctx.response.headers);
    }
    if (ctx.response.statusCode || ctx.response.statusMessage) {
      setResponseStatus(
        event,
        ctx.response.statusCode,
        ctx.response.statusMessage
      );
    }
    return ctx.response.body;
  });
}

const debug = (...args) => {
};
function GracefulShutdown(server, opts) {
  opts = opts || {};
  const options = Object.assign(
    {
      signals: "SIGINT SIGTERM",
      timeout: 3e4,
      development: false,
      forceExit: true,
      onShutdown: (signal) => Promise.resolve(signal),
      preShutdown: (signal) => Promise.resolve(signal)
    },
    opts
  );
  let isShuttingDown = false;
  const connections = {};
  let connectionCounter = 0;
  const secureConnections = {};
  let secureConnectionCounter = 0;
  let failed = false;
  let finalRun = false;
  function onceFactory() {
    let called = false;
    return (emitter, events, callback) => {
      function call() {
        if (!called) {
          called = true;
          return Reflect.apply(callback, this, arguments);
        }
      }
      for (const e of events) {
        emitter.on(e, call);
      }
    };
  }
  const signals = options.signals.split(" ").map((s) => s.trim()).filter((s) => s.length > 0);
  const once = onceFactory();
  once(process, signals, (signal) => {
    debug("received shut down signal", signal);
    shutdown(signal).then(() => {
      if (options.forceExit) {
        process.exit(failed ? 1 : 0);
      }
    }).catch((error) => {
      debug("server shut down error occurred", error);
      process.exit(1);
    });
  });
  function isFunction(functionToCheck) {
    const getType = Object.prototype.toString.call(functionToCheck);
    return /^\[object\s([A-Za-z]+)?Function]$/.test(getType);
  }
  function destroy(socket, force = false) {
    if (socket._isIdle && isShuttingDown || force) {
      socket.destroy();
      if (socket.server instanceof http.Server) {
        delete connections[socket._connectionId];
      } else {
        delete secureConnections[socket._connectionId];
      }
    }
  }
  function destroyAllConnections(force = false) {
    debug("Destroy Connections : " + (force ? "forced close" : "close"));
    let counter = 0;
    let secureCounter = 0;
    for (const key of Object.keys(connections)) {
      const socket = connections[key];
      const serverResponse = socket._httpMessage;
      if (serverResponse && !force) {
        if (!serverResponse.headersSent) {
          serverResponse.setHeader("connection", "close");
        }
      } else {
        counter++;
        destroy(socket);
      }
    }
    debug("Connections destroyed : " + counter);
    debug("Connection Counter    : " + connectionCounter);
    for (const key of Object.keys(secureConnections)) {
      const socket = secureConnections[key];
      const serverResponse = socket._httpMessage;
      if (serverResponse && !force) {
        if (!serverResponse.headersSent) {
          serverResponse.setHeader("connection", "close");
        }
      } else {
        secureCounter++;
        destroy(socket);
      }
    }
    debug("Secure Connections destroyed : " + secureCounter);
    debug("Secure Connection Counter    : " + secureConnectionCounter);
  }
  server.on("request", (req, res) => {
    req.socket._isIdle = false;
    if (isShuttingDown && !res.headersSent) {
      res.setHeader("connection", "close");
    }
    res.on("finish", () => {
      req.socket._isIdle = true;
      destroy(req.socket);
    });
  });
  server.on("connection", (socket) => {
    if (isShuttingDown) {
      socket.destroy();
    } else {
      const id = connectionCounter++;
      socket._isIdle = true;
      socket._connectionId = id;
      connections[id] = socket;
      socket.once("close", () => {
        delete connections[socket._connectionId];
      });
    }
  });
  server.on("secureConnection", (socket) => {
    if (isShuttingDown) {
      socket.destroy();
    } else {
      const id = secureConnectionCounter++;
      socket._isIdle = true;
      socket._connectionId = id;
      secureConnections[id] = socket;
      socket.once("close", () => {
        delete secureConnections[socket._connectionId];
      });
    }
  });
  process.on("close", () => {
    debug("closed");
  });
  function shutdown(sig) {
    function cleanupHttp() {
      destroyAllConnections();
      debug("Close http server");
      return new Promise((resolve, reject) => {
        server.close((err) => {
          if (err) {
            return reject(err);
          }
          return resolve(true);
        });
      });
    }
    debug("shutdown signal - " + sig);
    if (options.development) {
      debug("DEV-Mode - immediate forceful shutdown");
      return process.exit(0);
    }
    function finalHandler() {
      if (!finalRun) {
        finalRun = true;
        if (options.finally && isFunction(options.finally)) {
          debug("executing finally()");
          options.finally();
        }
      }
      return Promise.resolve();
    }
    function waitForReadyToShutDown(totalNumInterval) {
      debug(`waitForReadyToShutDown... ${totalNumInterval}`);
      if (totalNumInterval === 0) {
        debug(
          `Could not close connections in time (${options.timeout}ms), will forcefully shut down`
        );
        return Promise.resolve(true);
      }
      const allConnectionsClosed = Object.keys(connections).length === 0 && Object.keys(secureConnections).length === 0;
      if (allConnectionsClosed) {
        debug("All connections closed. Continue to shutting down");
        return Promise.resolve(false);
      }
      debug("Schedule the next waitForReadyToShutdown");
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(waitForReadyToShutDown(totalNumInterval - 1));
        }, 250);
      });
    }
    if (isShuttingDown) {
      return Promise.resolve();
    }
    debug("shutting down");
    return options.preShutdown(sig).then(() => {
      isShuttingDown = true;
      cleanupHttp();
    }).then(() => {
      const pollIterations = options.timeout ? Math.round(options.timeout / 250) : 0;
      return waitForReadyToShutDown(pollIterations);
    }).then((force) => {
      debug("Do onShutdown now");
      if (force) {
        destroyAllConnections(force);
      }
      return options.onShutdown(sig);
    }).then(finalHandler).catch((error) => {
      const errString = typeof error === "string" ? error : JSON.stringify(error);
      debug(errString);
      failed = true;
      throw errString;
    });
  }
  function shutdownManual() {
    return shutdown("manual");
  }
  return shutdownManual;
}

function getGracefulShutdownConfig() {
  return {
    disabled: !!process.env.NITRO_SHUTDOWN_DISABLED,
    signals: (process.env.NITRO_SHUTDOWN_SIGNALS || "SIGTERM SIGINT").split(" ").map((s) => s.trim()),
    timeout: Number.parseInt(process.env.NITRO_SHUTDOWN_TIMEOUT || "", 10) || 3e4,
    forceExit: !process.env.NITRO_SHUTDOWN_NO_FORCE_EXIT
  };
}
function setupGracefulShutdown(listener, nitroApp) {
  const shutdownConfig = getGracefulShutdownConfig();
  if (shutdownConfig.disabled) {
    return;
  }
  GracefulShutdown(listener, {
    signals: shutdownConfig.signals.join(" "),
    timeout: shutdownConfig.timeout,
    forceExit: shutdownConfig.forceExit,
    onShutdown: async () => {
      await new Promise((resolve) => {
        const timeout = setTimeout(() => {
          console.warn("Graceful shutdown timeout, force exiting...");
          resolve();
        }, shutdownConfig.timeout);
        nitroApp.hooks.callHook("close").catch((error) => {
          console.error(error);
        }).finally(() => {
          clearTimeout(timeout);
          resolve();
        });
      });
    }
  });
}

const cert = process.env.NITRO_SSL_CERT;
const key = process.env.NITRO_SSL_KEY;
const nitroApp = useNitroApp();
const server = cert && key ? new Server({ key, cert }, toNodeListener(nitroApp.h3App)) : new Server$1(toNodeListener(nitroApp.h3App));
const port = destr(process.env.NITRO_PORT || process.env.PORT) || 3e3;
const host = process.env.NITRO_HOST || process.env.HOST;
const path = process.env.NITRO_UNIX_SOCKET;
const listener = server.listen(path ? { path } : { port, host }, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  const protocol = cert && key ? "https" : "http";
  const addressInfo = listener.address();
  if (typeof addressInfo === "string") {
    console.log(`Listening on unix socket ${addressInfo}`);
    return;
  }
  const baseURL = (useRuntimeConfig().app.baseURL || "").replace(/\/$/, "");
  const url = `${protocol}://${addressInfo.family === "IPv6" ? `[${addressInfo.address}]` : addressInfo.address}:${addressInfo.port}${baseURL}`;
  console.log(`Listening on ${url}`);
});
trapUnhandledNodeErrors();
setupGracefulShutdown(listener, nitroApp);
const nodeServer = {};

export { deleteCookie as a, getHeader as b, createError$1 as c, defineEventHandler as d, getCookie as e, getRouterParam as f, getQuery as g, getResponseStatusText as h, getResponseStatus as i, joinRelativeURL as j, defineRenderHandler as k, getRouteRules as l, useNitroApp as m, nodeServer as n, proxyRequest as p, readBody as r, setResponseHeader as s, useRuntimeConfig as u };
//# sourceMappingURL=nitro.mjs.map
