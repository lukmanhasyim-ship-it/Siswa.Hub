# Siswa.Hub v4.9.4 — Ekosistem Manajemen Kelas Digital Premium

![License](https://img.shields.io/badge/License-Private-red.svg)
![Version](https://img.shields.io/badge/Version-4.9.4-emerald.svg)
![React](https://img.shields.io/badge/Frontend-React%2019-blue.svg)
![Backend](https://img.shields.io/badge/Backend-Google%20Apps%20Script-orange.svg)

**Siswa.Hub** adalah platform manajemen kelas revolusioner berbasis *Serverless* yang dirancang untuk mentransformasi kinerja Wali Kelas. Aplikasi ini menggabungkan keindahan desain modern dengan sistem backend yang tangguh menggunakan Google Workspace Ecosystem, memberikan pengalaman pengelolaan administrasi siswa yang cerdas, transparan, dan sangat efisien.

---

## 🆕 Versi 4.9.4 — Alert Per-Bulan & Catatan Terlambat

*   **Evaluasi Kedisiplinan Per-Bulan**: Alert Alfa/Bolos kini dihitung per bulan (bukan akumulasi global). Data minggu terakhir bulan sebelumnya tetap diperhitungkan untuk transisi yang mulus. Panggilan yang sudah ditindaklanjuti (Selesai/Ditolak) tidak memicu alert ganda.
*   **Catatan Terlambat (Mandiri)**: Modul khusus untuk mencatat siswa terlambat, terpisah dari Presensi. Seorang siswa bisa Hadir tetapi tetap tercatat Terlambat. Dilengkapi pencarian siswa, inline edit keterangan, dan proteksi duplikasi per hari.
*   **Detail Pemanggilan di Dashboard**: Kartu alert menampilkan detail pemanggilan (Jadwal, Kategori, Alasan, Status) lengkap dengan tombol **Tolak** untuk membatalkan panggilan yang pending.
*   **Status Ditolak**: Status baru `Ditolak` pada Log Panggilan. Panggilan yang diabaikan Wali Kelas tidak akan muncul lagi sebagai alert.
*   **Proxy Gambar Drive**: Mengganti metode thumbnail publik dengan `GET_FILE` (base64 via DriveApp) karena Google Workspace for Education memblokir akses publik. Gambar bukti panggilan tetap tampil tanpa CORS error.

---

## 📊 Fitur Unggulan

*   **Dashboard Analitik**: Visualisasi kehadiran, keuangan, dan kedisiplinan secara real-time dengan grafik Pie & Area.
*   **Presensi Dual-Session**: Pencatatan kehadiran pagi dan siang dengan timestamp otomatis per sesi.
*   **Kas Kelas Digital**: Manajemen iuran dengan sistem draf transaksi massal (Bulk Save).
*   **Catatan Terlambat**: Pencatatan siswa terlambat mandiri (terpisah dari status presensi).
*   **Log Panggilan & Home Visit**: Pendataan kasus siswa lengkap dengan dokumentasi foto langsung ke Google Drive.
*   **Leger & Buku Klaper**: Ekspor data akademik ke format profesional yang siap cetak.
*   **Laporan Komprehensif**: Rekap presensi, keuangan, keterlambatan, panggilan, dan nilai dalam satu halaman.
*   **Piket Terjadwal**: Manajemen jadwal piket harian dengan notifikasi otomatis.
*   **Otomasi Arsip**: Sistem otomatis memindahkan data lama ke sheet arsip setiap tanggal 1.

---

## 🛠️ Panduan Instalasi Detail

### 1. Persiapan Google Spreadsheet

Buat **Google Spreadsheet** baru. Aplikasi akan membuat semua sheet secara otomatis saat pertama kali menjalankan perintah `setupSpreadsheet()` dari Kode.gs. Namun jika ingin membuat manual, berikut daftar lengkap sheet dan header baris pertamanya:

**Sheet Aktif:**

| Nama Sheet | Header (baris 1) |
|---|---|
| **Master_Siswa** | `ID_Siswa, NIS, NISN, Nama_Siswa, L/P, Email, Jabatan, Tempat_Lahir, Tanggal_Lahir, No_WA_Siswa, Nama_Wali, No_WA_Wali, Alamat, Latitude, Longitude, Lokasi, Status_Aktif, Last_Active, Keterangan, Created_At` |
| **Presensi** | `ID_Presensi, Tanggal, ID_Siswa, NISN, Status_Pagi, Timestamp_Pagi, Status_Siang, Timestamp_Siang, Keterangan` |
| **Keuangan** | `ID_Transaksi, Tanggal, ID_Siswa, NISN, Tipe, Jumlah, Keterangan` |
| **Daftar_Nilai** | `ID_Nilai, ID_Siswa, NISN, Jenjang, Semester, Kategori_Mapel, Nama_Mapel, Topik, Nilai, Timestamp` |
| **Log_Panggilan** | `ID_Panggilan, Tanggal, NISN, Kategori, Alasan, Tanggal_Pemanggilan, Waktu_Diskusi, Hasil_Pertemuan, Status_Selesai, Bukti_File_URL` |
| **Catatan_Terlambat** | `ID_Terlambat, Tanggal, ID_Siswa, NISN, Nama_Siswa, Keterangan, Dicatat_Oleh, Created_At` |
| **Profil_Wali_Kelas** | `Id_Wali, Nama, Email, Bio, Gaya_Ajar, Kontak, Created_At, Nominal_Iuran, Kelas` |
| **Lokasi** | `ID_Lokasi, Nama_Lokasi, Deskripsi, Alamat, Latitude, Longitude, Lokasi, Created_By, Created_By_Email, Created_At` |
| **Notifikasi** | `ID, Message, Type, Target_Email, Is_Read, Timestamp, Target_Role, Role, Email` |
| **Piket** | `ID_Piket, Hari, ID_Siswa, Nama_Siswa, Email` |

**Sheet Arsip (dibuat otomatis oleh trigger bulanan):**

| Nama Sheet | Header (baris 1) |
|---|---|
| **Archive_Rekap_Absensi** | `ID_Siswa, Bulan, H, I, S, A, B` |
| **Archive_Rekap_Keuangan** | `Bulan, Saldo_Awal, Total_Masuk, Total_Keluar, Saldo_Akhir` |
| **Archive_Detail_Absensi** | `ID_Presensi, Tanggal, ID_Siswa, NISN, Status_Pagi, Timestamp_Pagi, Status_Siang, Timestamp_Siang, Keterangan` |

> **Catatan Penting:** Nama sheet dan header **HARUS PERSIS** termasuk huruf besar/kecil dan underscore. Aplikasi akan error jika ada ketidakcocokan nama sheet.

---

### 2. Setup Backend (Google Apps Script)

1. Buka Spreadsheet yang sudah dibuat.
2. Klik menu **Extensions** > **Apps Script**.
3. Beri nama proyek: `SiswaHub_API` (atau terserah).
4. Hapus semua kode default di editor, lalu salin seluruh isi file [`gas/Code.gs`](gas/Code.gs) ke editor.
5. Klik ikon **Settings** (roda gigi) di sidebar kiri, lalu centang **"Show 'appsscript.json' manifest file"**.
6. Klik file `appsscript.json` di editor, pastikan isinya seperti berikut (scope yang benar sangat penting):

```json
{
  "timeZone": "Asia/Jakarta",
  "dependencies": {},
  "exceptionLogging": "STACKDRIVER",
  "runtimeVersion": "V8",
  "oauthScopes": [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive.readonly",
    "https://www.googleapis.com/auth/drive.file",
    "https://www.googleapis.com/auth/script.send_mail",
    "https://www.googleapis.com/auth/script.external_request",
    "https://www.googleapis.com/auth/userinfo.email"
  ],
  "webapp": {
    "executeAs": "USER_DEPLOYING",
    "access": "ANYONE_ANONYMOUS"
  }
}
```

7. Klik **Deploy** > **New Deployment**.
   - **Type**: Web App
   - **Execute as**: Me (email Anda)
   - **Who has access**: Anyone
   - Klik **Deploy**.
8. **Izinkan (Grant) semua permission** yang diminta saat pertama deploy. Jika ada peringatan "This app isn't verified", klik **Advanced** > **Go to SiswaHub_API (unsafe)** — ini aman karena script Anda sendiri.
9. Setelah deploy berhasil, **salin Web App URL** (contoh: `https://script.google.com/macros/s/ABCDEF12345/exec`). URL ini akan digunakan di frontend.

> **⚠️ PENTING:** Setiap kali Anda mengubah kode `Code.gs`, Anda harus melakukan **Deploy > New Deployment** (atau **Manage Deployments > Deploy**) agar perubahan diterapkan. Deploy ulang akan menghasilkan URL baru.

#### Menjalankan Setup Awal Spreadsheet

Setelah deploy pertama, buka URL Web App Anda dan tambahkan parameter `?action=SETUP` di akhir URL:

```
https://script.google.com/macros/s/ABCDEF12345/exec?action=SETUP
```

Ini akan membuat semua sheet yang diperlukan dan mengisi data awal. Biasanya Anda perlu menjalankan ini hanya sekali.

#### Menjadwalkan Arsip Otomatis

Untuk mengaktifkan trigger arsip bulanan (setiap tanggal 1), akses:

```
https://script.google.com/macros/s/ABCDEF12345/exec?action=SETUP_TRIGGERS
```

Ini akan membuat trigger time-based yang menjalankan `runMonthlyArchive()` otomatis.

---

### 3. Setup Autentikasi (Google Cloud Console)

Aplikasi menggunakan **Google OAuth 2.0** untuk login. Ikuti langkah berikut:

1. Buka [Google Cloud Console](https://console.cloud.google.com/).
2. Buat **Proyek Baru** (atau pilih proyek yang sudah ada).
3. Pergi ke **APIs & Services** > **OAuth consent screen**.
   - Pilih **External** (kecuali Anda dalam organisasi Google Workspace).
   - Isi nama aplikasi: `Siswa.Hub`
   - Tambahkan scope: `.../auth/userinfo.email`, `.../auth/userinfo.profile`
   - Tambahkan email support dan developer.
   - **Publish** aplikasi (meskipun status "Testing", Anda bisa menambahkan email penguji).
4. Pergi ke **Credentials** > **Create Credentials** > **OAuth client ID**.
   - **Application type**: Web application
   - **Name**: SiswaHub Web Client
   - **Authorized JavaScript origins**:
     ```
     http://localhost:5173
     https://your-firebase-domain.web.app
     https://your-custom-domain.com (jika ada)
     ```
   - **Authorized redirect URIs** (kosongkan saja).
   - Klik **Create**.
5. Salin **Client ID** yang dihasilkan.

> **Tips:** Jika aplikasi masih dalam mode "Testing", Anda harus mendaftarkan email setiap penguji di halaman OAuth consent screen > **Test users**.

---

### 4. Setup Frontend (Lokal)

```bash
# 1. Clone/download repository
git clone https://github.com/username/siswa-hub.git
cd siswa-hub

# 2. Install dependencies
npm install

# 3. Buat file .env di root folder proyek
```

Isi file `.env` dengan:

```env
# Client ID dari Google Cloud Console (langkah 3)
VITE_GOOGLE_CLIENT_ID=123456789-xxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com

# URL Web App dari Google Apps Script (langkah 2.9)
VITE_GAS_API_URL=https://script.google.com/macros/s/ABCDEF12345/exec

# (Opsional) Jika menggunakan Firebase
VITE_FIREBASE_API_KEY=your-firebase-api-key
```

```bash
# 4. Jalankan development server
npm run dev
```

Akses di browser: `http://localhost:5173`

---

### 5. Deployment ke Firebase Hosting

```bash
# 1. Build produksi
npm run build

# 2. Install Firebase CLI (jika belum)
npm install -g firebase-tools

# 3. Login Firebase
npx firebase login

# 4. Inisialisasi project Firebase
npx firebase init
#   - Pilih: Hosting
#   - Pilih: Use an existing project (atau buat baru)
#   - Public directory: dist
#   - Configure as single-page app: Yes
#   - Set up automatic builds: No (atau Yes jika mau CI/CD)

# 5. Deploy
npx firebase deploy

# 6. (Opsional) Jika menggunakan Firebase Authentication:
#    - Di Firebase Console > Authentication > Sign-in method
#    - Aktifkan provider Google
#    - Masukkan Client ID dan Client Secret dari Google Cloud Console
```

---

### 6. Mengisi Data Awal

Setelah semua terhubung, login sebagai **Wali Kelas** (email harus terdaftar di sheet `Profil_Wali_Kelas`).

1. **Master Siswa**: Impor data siswa via halaman Siswa > Tambah/Import.
2. **Profil Wali Kelas**: Isi manual di sheet `Profil_Wali_Kelas` (minimal: Id_Wali, Nama, Email, Kelas).
3. **Setoran Iuran**: Atur nominal iuran di Profil Wali Kelas (kolom `Nominal_Iuran`).
4. **Piket**: Atur jadwal piket di halaman Piket.
5. Data Presensi, Keuangan, dan Panggilan bisa langsung diinput lewat aplikasi.

---

## 🔄 Alur Kerja Utama

### Presensi Harian
1. Buka halaman Presensi.
2. Pilih tanggal.
3. Klik status per siswa: **H** (Hadir), **S** (Sakit), **I** (Ijin), **A** (Alfa), **B** (Bolos).
4. Status Siang bisa diisi terpisah (menggantikan Status Pagi jika berbeda).

### Panggilan Orang Tua
1. Sistem mendeteksi **3x Alfa** dalam sebulan → alert "Siap Panggil".
2. Wali Kelas klik card alert → masuk ke halaman Panggilan dengan data terisi.
3. Isi kategori dan jadwal, submit.
4. Setelah pertemuan, isi **Tindak Lanjut** (upload foto bukti).
5. Status berubah menjadi **Selesai**.
6. Jika panggilan tidak perlu ditindaklanjuti, klik **Tolak** → status **Ditolak**.
7. Alert akan hilang sampai bulan berikutnya (karena evaluasi per bulan).

### Catatan Terlambat
1. Buka halaman **Catatan Terlambat** (menu sidebar di grup Presensi).
2. Cari siswa, pilih tanggal, isi keterangan (opsional), klik **Catat**.
3. Data tersimpan di sheet `Catatan_Terlambat`, terpisah dari Presensi.
4. Satu siswa hanya bisa dicatat sekali per hari (duplikasi dicegah otomatis).

---

## 🧩 Struktur Proyek

```
siswa-hub/
├── gas/
│   └── Code.gs                  # Backend Google Apps Script (semua logika)
├── public/
│   └── (favicon, manifest, dll)
├── src/
│   ├── components/              # Komponen React reusable
│   │   ├── StudentCard.jsx      # Kartu siswa (alert dashboard)
│   │   ├── ImageLightbox.jsx    # Preview gambar fullscreen
│   │   ├── Loading.jsx          # Loading spinner
│   │   ├── Skeleton.jsx         # Skeleton loading
│   │   └── EmptyState.jsx       # State kosong
│   ├── context/
│   │   ├── AuthContext.jsx      # Context autentikasi Google OAuth
│   │   └── ToastContext.jsx     # Context notifikasi toast
│   ├── pages/
│   │   ├── Dashboard.jsx        # Halaman utama (alert + statistik)
│   │   ├── Presensi.jsx         # Presensi harian
│   │   ├── Keuangan.jsx         # Manajemen kas kelas
│   │   ├── Panggilan.jsx        # Log panggilan & home visit
│   │   ├── CatatanTerlambat.jsx # Catatan siswa terlambat
│   │   ├── Laporan.jsx          # Laporan komprehensif
│   │   ├── Nilai.jsx            # Input dan rekap nilai
│   │   ├── Siswa.jsx            # Manajemen data siswa
│   │   ├── Piket.jsx            # Jadwal piket
│   │   └── Lainnya.jsx          # Pengaturan profil wali kelas
│   ├── utils/
│   │   ├── gasClient.js         # Helper fetch ke GAS Web App
│   │   ├── logic.js             # Fungsi utilitas (format, kalkulasi)
│   │   └── notifications.js     # Kirim notifikasi via GAS
│   ├── App.jsx                  # Root komponen + routing
│   └── main.jsx                 # Entry point Vite
├── .env                         # Environment variables (TIDAK di-commit)
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

---

## 💻 Tech Stack

*   **Frontend**: React 19, Vite 7, Tailwind CSS 3.4, Recharts, date-fns, Lucide Icons
*   **Backend**: Google Apps Script (GAS) dengan runtime V8
*   **Database**: Google Sheets (Cloud-based Spreadsheet)
*   **Autentikasi**: Google OAuth 2.0 (via Google Identity Services)
*   **Integrasi**: Google Drive API (upload & read file), Google Sheets API
*   **Hosting**: Firebase Hosting (PWA-enabled via vite-plugin-pwa)

---

## ⚠️ Catatan Penting

*   **Biaya**: Google Sheets gratis untuk penggunaan normal. Batas 10MB per sheet dan 5 juta cells per spreadsheet sudah lebih dari cukup untuk satu kelas (30-40 siswa selama 3 tahun).
*   **Ketersediaan**: Pastikan spreadsheet tidak dihapus/dipindahkan. Cadangan (backup) spreadsheet secara berkala.
*   **Keamanan**: GAS Web App dijalankan sebagai **pemilik script** (Anda). File yang diupload ke Drive hanya bisa diakses oleh script via `DriveApp.getFileById()` — tidak ada akses publik.
*   **CORS**: GAS Web App sudah mendukung CORS. Jika ada error CORS, pastikan Anda mendeploy ulang setelah perubahan.

---

> **Didesain dengan ❤️ oleh Mohamad Lukman Nurhasyim, S.Kom, Gr.**
> *Aplikasi ini dibangun dengan kolaborasi cerdas bersama AI.*

© 2026 Siswa.Hub. All rights reserved.
