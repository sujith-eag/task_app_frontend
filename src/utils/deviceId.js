const DEVICE_ID_KEY = 'eag_device_id';

export function getDeviceId() {
  try {
    let id = localStorage.getItem(DEVICE_ID_KEY);
    if (!id) {
      id = cryptoRandomHex(16);
      localStorage.setItem(DEVICE_ID_KEY, id);
    }
    return id;
  } catch (e) {
    // Fallback: generate non-persistent id
    return cryptoRandomHex(16);
  }
}

function cryptoRandomHex(len = 16) {
  // Browser-safe random hex
  const arr = new Uint8Array(len);
  if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
    window.crypto.getRandomValues(arr);
  } else {
    for (let i = 0; i < len; i++) arr[i] = Math.floor(Math.random() * 256);
  }
  return Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('');
}

export function clearDeviceId() {
  try { localStorage.removeItem(DEVICE_ID_KEY); } catch (e) {}
}
