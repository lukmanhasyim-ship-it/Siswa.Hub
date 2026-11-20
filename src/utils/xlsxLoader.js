// xlsx (~900 kB) hanya dimuat saat pengguna benar-benar ekspor/impor Excel.
let xlsxPromise = null;

export function loadXLSX() {
  if (!xlsxPromise) {
    xlsxPromise = import('xlsx');
  }
  return xlsxPromise;
}
