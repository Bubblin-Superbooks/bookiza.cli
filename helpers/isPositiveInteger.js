const MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || 9007199254740991;

export default function isSafePositiveInteger(x) {
  return (
    Object.prototype.toString.call(x) === "[object Number]" &&
    // Is it an integer?
    x % 1 === 0 &&
    // Is it positive?
    x > 0 &&
    x <= MAX_SAFE_INTEGER
  );
}
