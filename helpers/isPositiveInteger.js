const MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || 9007199254740991;

export default function isSafePositiveInteger(x) {
  return (
    // Docs → // isTypeNumber, // isInteger, // isPositive, // isLessThanMaxSafeInteger
    Object.prototype.toString.call(x) === '[object Number]' && (x % 1 === 0) && (x > 0) && (x <= MAX_SAFE_INTEGER)
  );
}
