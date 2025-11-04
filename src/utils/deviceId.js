const DEVICE_ID_KEY = 'eag_device_id';
const INSTALL_ID_KEY = DEVICE_ID_KEY + '_install';

function cryptoRandomHex(len = 32) {
  const arr = new Uint8Array(len);
  if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
    window.crypto.getRandomValues(arr);
  } else {
    for (let i = 0; i < len; i++) arr[i] = Math.floor(Math.random() * 256);
  }
  return Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('');
}

function getOrCreateInstallId() {
  try {
    let installId = localStorage.getItem(INSTALL_ID_KEY);
    if (installId) return installId;
    installId = cryptoRandomHex(16);
    try { localStorage.setItem(INSTALL_ID_KEY, installId); } catch (e) {}
    return installId;
  } catch (e) {
    return 'localStorage_disabled';
  }
}

async function computeFingerprint() {
  const nav = typeof navigator !== 'undefined' ? navigator : {};
  const screenInfo = typeof screen !== 'undefined' ? screen : {};
  const parts = [];

  parts.push(nav.userAgent || '');
  parts.push(nav.platform || '');
  parts.push((nav.languages && nav.languages.join(',')) || nav.language || '');
  try { parts.push(Intl?.DateTimeFormat().resolvedOptions().timeZone || ''); } catch (e) { parts.push(''); }
  parts.push(String(screenInfo.width || '') + 'x' + String(screenInfo.height || '') + 'x' + String(screenInfo.colorDepth || ''));
  parts.push(String(navigator.hardwareConcurrency || ''));
  if (typeof navigator.deviceMemory !== 'undefined') parts.push(String(navigator.deviceMemory));

  // Add stable installation id to improve resilience across minor UA changes
  parts.push(getOrCreateInstallId());

  const raw = parts.join('||');

  if (typeof crypto !== 'undefined' && crypto.subtle && crypto.subtle.digest) {
    try {
      const enc = new TextEncoder().encode(raw);
      const hashBuffer = await crypto.subtle.digest('SHA-256', enc);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      return 'v1:' + hashHex;
    } catch (e) {
      // fallthrough to fallback
    }
  }

  // Fallback: persistent random id
  try {
    let id = localStorage.getItem(DEVICE_ID_KEY);
    if (id) return id;
    id = cryptoRandomHex(32);
    try { localStorage.setItem(DEVICE_ID_KEY, id); } catch (e) {}
    return id;
  } catch (e) {
    return cryptoRandomHex(32);
  }
}

/**
 * Returns a stable device id (string). If not present, computes fingerprint and persists it.
 * Note: this is async because crypto.subtle.digest is asynchronous in most browsers.
 */
export async function getDeviceId() {
  try {
    let id = localStorage.getItem(DEVICE_ID_KEY);
    if (id) return id;
    id = await computeFingerprint();
    try { localStorage.setItem(DEVICE_ID_KEY, id); } catch (e) {}
    return id;
  } catch (e) {
    return cryptoRandomHex(32);
  }
}

export function clearDeviceId() {
  try {
    localStorage.removeItem(DEVICE_ID_KEY);
    localStorage.removeItem(INSTALL_ID_KEY);
  } catch (e) {}
}
