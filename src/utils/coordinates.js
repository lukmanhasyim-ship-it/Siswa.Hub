// Helper koordinat bersama untuk MasterSiswa dan Profile.
// Fungsi murni di level modul: tidak dibuat ulang tiap render.

export function normalizeDecimalString(value) {
  if (value === undefined || value === null) return '';
  let str = value.toString().trim().replace(/,/g, '.');
  str = str.replace(/[^0-9.-]/g, '');
  str = str.replace(/(?!^)-/g, '');
  const parts = str.split('.');
  if (parts.length > 2) {
    const last = parts.pop();
    const integerPart = parts.join('');
    str = `${integerPart}.${last}`;
  }
  return str;
}

export function decimalToDMS(value, isLatitude) {
  if (typeof value !== 'number' || Number.isNaN(value)) return '';
  const sign = value < 0 ? -1 : 1;
  const absValue = Math.abs(value);
  const degrees = Math.floor(absValue);
  const minutes = Math.floor((absValue - degrees) * 60);
  const seconds = ((absValue - degrees) * 60 - minutes) * 60;
  const direction = isLatitude ? (sign < 0 ? 'S' : 'N') : (sign < 0 ? 'W' : 'E');
  return `${degrees}°${minutes}'${seconds.toFixed(2)}"${direction}`;
}

export function dmsToDecimal(value) {
  if (value === undefined || value === null) return null;
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  const str = value.toString().trim();
  const dmsMatch = str.match(/^(-?\d+(?:\.\d*)?)°\s*(\d+(?:\.\d*)?)'\s*(\d+(?:\.\d*)?)"?\s*([NSEW])?$/i);
  if (dmsMatch) {
    const degrees = Number(dmsMatch[1]);
    const minutes = Number(dmsMatch[2]);
    const seconds = Number(dmsMatch[3]);
    const direction = dmsMatch[4] ? dmsMatch[4].toUpperCase() : null;
    let decimal = Math.abs(degrees) + minutes / 60 + seconds / 3600;
    if (degrees < 0 || direction === 'S' || direction === 'W') decimal *= -1;
    return decimal;
  }
  const normalized = normalizeDecimalString(str);
  return normalized ? Number(normalized) : null;
}

export function isDMSValue(value) {
  return typeof value === 'string' && /[°'"NSEW]/i.test(value);
}

export function formatCoordinateInput(value, isLatitude) {
  if (!value && value !== 0) return '';
  const text = value.toString().trim();
  if (isDMSValue(text)) return text;
  const decimal = Number(normalizeDecimalString(text));
  return Number.isFinite(decimal) ? decimalToDMS(decimal, isLatitude) : '';
}

export function createMapsLink(lat, lng) {
  const latDecimal = dmsToDecimal(lat);
  const lngDecimal = dmsToDecimal(lng);
  if (latDecimal === null || lngDecimal === null) return '';
  return `https://www.google.com/maps?q=${latDecimal},${lngDecimal}`;
}
