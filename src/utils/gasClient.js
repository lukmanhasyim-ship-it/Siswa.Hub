import { queryClient } from '../lib/queryClient';

const GAS_URL = import.meta.env.VITE_GAS_API_URL;

// Hanya aksi baca yang boleh masuk cache. Semua mutation menginvalidasi cache.
const READ_ACTIONS = new Set([
  'GET_ALL',
  'GET_NOTIFICATIONS',
  'GET_TERLAMBAT',
  'GET_THUMBNAILS',
  'GET_FILE',
  'GET_PROFILE_WALI',
  'LOGIN_WALI',
  'GET_TRIGGER_STATUS',
]);

const SHEET_STALE_TIME = {
  Master_Siswa: 5 * 60_000,
  Profil_Wali_Kelas: 5 * 60_000,
  Daftar_Nilai: 5 * 60_000,
  Archive_Rekap_Keuangan: 15 * 60_000,
  Archive_Rekap_Absensi: 15 * 60_000,
  Archive_Detail_Absensi: 15 * 60_000,
  Archive_Catatan_Terlambat: 15 * 60_000,
  Archive_Detail_Keuangan: 15 * 60_000,
};

const CACHE_TIME = 15 * 60_000;

// Urutan kunci objek dibuat stabil agar payload yang sama menghasilkan query key sama.
function stableValue(value) {
  if (value === null || typeof value !== 'object') return value ?? null;
  if (Array.isArray(value)) return value.map(stableValue);

  return Object.keys(value)
    .sort()
    .reduce((acc, key) => {
      if (value[key] !== undefined) acc[key] = stableValue(value[key]);
      return acc;
    }, {});
}

export function gasQueryKey(action, payload = {}) {
  return ['gas', action, stableValue(payload)];
}

function staleTimeFor(action, payload) {
  if (action === 'GET_NOTIFICATIONS') return 30_000;
  if (action === 'GET_THUMBNAILS' || action === 'GET_FILE') return 10 * 60_000;
  if (action === 'GET_ALL' && payload?.sheet) {
    return SHEET_STALE_TIME[payload.sheet] ?? 60_000;
  }
  return 60_000;
}

async function postToGAS(action, payload) {
  try {
    const response = await fetch(GAS_URL, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify({ action, payload }),
    });

    if (!response.ok) {
      throw new Error('Gagal terhubung ke Google Apps Script. Pastikan Web App sudah di-deploy sebagai "Anyone".');
    }

    const result = await response.json();
    if (result.status === 'error') {
      let msg = result.message;
      if (msg.includes('Unknown action')) {
        msg += '. Silakan DEPLOY ULANG Google Apps Script Anda sebagai "New Version" untuk menerapkan pembaruan fungsi.';
      }
      throw new Error(msg);
    }
    return result;
  } catch (error) {
    console.error('GAS Fetch Error:', error);
    throw error;
  }
}

export async function fetchGAS(action, payload = {}) {
  if (!GAS_URL) {
    throw new Error('VITE_GAS_API_URL tidak ditemukan. Silakan set environment variable VITE_GAS_API_URL dengan URL Google Apps Script Web App Anda.');
  }

  if (!READ_ACTIONS.has(action)) {
    const result = await postToGAS(action, payload);
    // Mutation berhasil → cache lama dibuang, pembacaan berikutnya wajib fresh.
    queryClient.removeQueries({ queryKey: ['gas'] });
    return result;
  }

  const queryKey = gasQueryKey(action, payload);
  const options = {
    queryKey,
    queryFn: () => postToGAS(action, payload),
    staleTime: staleTimeFor(action, payload),
    gcTime: CACHE_TIME,
    retry: 0,
  };

  const cached = queryClient.getQueryData(queryKey);
  if (cached !== undefined) {
    // Stale-while-revalidate: pakai data lama seketika, perbarui di background.
    queryClient.fetchQuery(options).catch(() => {});
    return cached;
  }

  try {
    return await queryClient.fetchQuery(options);
  } catch (error) {
    // Jangan simpan state error: percobaan berikutnya harus benar-benar retry.
    queryClient.removeQueries({ queryKey });
    throw error;
  }
}

