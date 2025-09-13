const cache = new Map(); // key -> expiry ms

function throttleByKey(key, windowMs) {
  const now = Date.now();
  const expiry = cache.get(key) || 0;
  if (expiry > now) return false;
  cache.set(key, now + windowMs);
  return true;
}

module.exports = throttleByKey;
