# Siswa.Hub v5.0.1 — Ekosistem Manajemen Kelas Digital Premium

![License](https://img.shields.io/badge/License-Private-red.svg)
![Version](https://img.shields.io/badge/Version-5.0.1-emerald.svg)
![React](https://img.shields.io/badge/Frontend-React%2019-blue.svg)
![Backend](https://img.shields.io/badge/Backend-Google%20Apps%20Script-orange.svg)

**Siswa.Hub** adalah platform manajemen kelas revolusioner berbasis *Serverless* yang dirancang untuk mentransformasi kinerja Wali Kelas. Aplikasi ini menggabungkan keindahan desain modern dengan sistem backend yang tangguh menggunakan Google Workspace Ecosystem, memberikan pengalaman pengelolaan administrasi siswa yang cerdas, transparan, dan sangat efisien.

---

## 🆕 Versi 5.0.1 — Antrean Catatan Terlambat

*   **Antrean per Tanggal**: Tombol **Catat Terlambat** kini memasukkan siswa ke daftar antrean lokal sesuai tanggal yang dipilih di header (bukan langsung ke Sheet). Antrean tanggal lain tetap tersimpan dan tidak tercampur.
*   **Simpan Massal & Draft**: Tombol **Simpan Catatan** di bawah daftar antrean mengirim seluruh catatan tanggal itu dalam satu permintaan `BULK_CREATE_TERLAMBAT`. Draft keterangan dan antrean bertahan setelah halaman di-refresh.
*   **Proteksi Duplikat**: Satu siswa maksimal satu catatan per hari. Jika ada duplikat saat penyimpanan, seluruh antrean ditolak dan user diminta memperbaiki terlebih dahulu. Notifikasi cukup berupa toast ringkas.
*   **Simpan Kas Tanpa Pindah Halaman**: Tombol **Simpan Transaksi** kini menyegarkan data di tempat. Browser tidak di-reload dan pengguna tetap berada di halaman KAS setelah transaksi tersimpan.

---

## Versi 5.0.0 — Antrean Kas Massal & Performa Navigasi

*   **Antrean Transaksi Kas**: Tombol **Catat Kas** memasukkan transaksi ke daftar antrean lokal per akun. Banyak siswa bisa dicatat berurutan, lalu disimpan sekaligus lewat tombol **Simpan Transaksi** di bawah daftar antrean.
*   **Simpan Massal & Notifikasi Ringkas**: Seluruh antrean dikirim dalam satu permintaan `BULK_CREATE` dengan satu notifikasi ringkasan. Draft form tetap tersimpan otomatis dan antrean bertahan setelah halaman di-refresh.
*   **Cache & Responsivitas**: Data sheet memakai cache memori TanStack Query dengan invalidasi otomatis, `GET_ALL` memakai `CacheService` di Apps Script, dan font Google di-cache oleh service worker.
*   **Navigasi & Stabilitas**: Navigasi bawah dan sidebar lebih ramah layar kecil, perpindahan halaman tidak lagi mereset state form, serta pengecekan versi dan polling notifikasi lebih hemat.

---

## Versi 4.9.4 — Alert Per-Bulan & Catatan Terlambat

*   **Evaluasi Kedisiplinan Per-Bulan**: Alert Alfa/Bolos kini dihitung per bulan (bukan akumulasi global). Data minggu terakhir bulan sebelumnya tetap diperhitungkan untuk transisi yang mulus. Panggilan yang sudah ditindaklanjuti (Selesai/Ditolak) tidak memicu alert ganda.
*   **Catatan Terlambat (Mandiri)**: Modul khusus untuk mencatat siswa terlambat, terpisah dari Presensi. Seorang siswa bisa Hadir tetapi tetap tercatat Terlambat. Dilengkapi pencarian siswa, inline edit keterangan, dan proteksi duplikasi per hari.
*   **Detail Pemanggilan di Dashboard**: Kartu alert menampilkan detail pemanggilan (Jadwal, Kategori, Alasan, Status) lengkap dengan tombol **Tolak** untuk membatalkan panggilan yang pending.
*   **Status Ditolak**: Status baru `Ditolak` pada Log Panggilan. Panggilan yang diabaikan Wali Kelas tidak akan muncul lagi sebagai alert.
*   **Proxy Gambar Drive**: Mengganti metode thumbnail publik dengan `GET_FILE` (base64 via DriveApp) karena Google Workspace for Education memblokir akses publik. Gambar bukti panggilan tetap tampil tanpa CORS error.

---

## 📊 Fitur Unggulan

*   **Dashboard Analitik**: Visualisasi kehadiran, keuangan, dan kedisiplinan secara real-time dengan grafik Pie & Area.
*   **Presensi Dual-Session**: Pencatatan kehadiran pagi dan siang dengan timestamp otomatis per sesi.
*   **Kas Kelas Digital**: Manajemen iuran dengan antrean transaksi massal (Bulk Save).
*   **Catatan Terlambat**: Pencatatan siswa terlambat mandiri (terpisah dari status presensi).
*   **Log Panggilan & Home Visit**: Pendataan kasus siswa lengkap dengan dokumentasi foto langsung ke Google Drive.
*   **Leger & Buku Klaper**: Ekspor data akademik ke format profesional yang siap cetak.
*   **Laporan Komprehensif**: Rekap presensi, keuangan, keterlambatan, panggilan, dan nilai dalam satu halaman.
*   **Piket Terjadwal**: Manajemen jadwal piket harian dengan notifikasi otomatis.
*   **Otomasi Arsip**: Sistem otomatis memindahkan data lama ke sheet arsip setiap tanggal 1.

---

## 🛠️ Panduan Instalasi Detail

### 1. Persiapan Google Spreadsheet

Buat **Google Spreadsheet** baru. Jalankan `setupSpreadsheet()` dari editor Apps Script sekali saat awal setup (lihat langkah 2). Berikut struktur sheet yang dihasilkan. Kolom tambahan seperti `Status_Aktif`, `Latitude`, dan `Longitude` akan ditambahkan otomatis oleh fungsi `ensureHeaders()` saat aplikasi pertama kali menyimpan data siswa.

**Sheet Aktif:**

| Nama Sheet | Header (baris 1) |
|---|---|
| **Master_Siswa** | `ID_Siswa, NIS, NISN, Nama_Siswa, L/P, Email, Jabatan, Tempat_Lahir, Tanggal_Lahir, No_WA_Siswa, Nama_Wali, No_WA_Wali, Alamat, Latitude, Longitude, Lokasi, Status_Aktif, Last_Active, Keterangan, Created_At` |
| **Presensi** | `ID_Presensi, Tanggal, ID_Siswa, NISN, Status_Pagi, Timestamp_Pagi, Status_Siang, Timestamp_Siang, Keterangan` |
| **Keuangan** | `ID_Transaksi, Tanggal, ID_Siswa, NISN, Tipe, Jumlah, Keterangan` |
| **Daftar_Nilai** | `ID_Nilai, ID_Siswa, NISN, Jenjang, Semester, Kategori_Mapel, Nama_Mapel, Topik, Nilai, Timestamp` |
| **Log_Panggilan** | `ID_Panggilan, Tanggal, ID_Siswa, NISN, Kategori, Alasan, Tanggal_Pemanggilan, Waktu_Diskusi, Hasil_Pertemuan, Status_Selesai, Bukti_File_URL` |
| **Catatan_Terlambat** | `ID_Terlambat, Tanggal, ID_Siswa, NISN, Nama_Siswa, Keterangan, Dicatat_Oleh, Created_At` |
| **Profil_Wali_Kelas** | `Id_Wali, Nama, Email, Bio, Gaya_Ajar, Kontak, Created_At, Nominal_Iuran, Kelas` |
| **Lokasi** | `ID_Lokasi, Nama_Lokasi, Deskripsi, Alamat, Latitude, Longitude, Lokasi, Created_By, Created_By_Email, Created_At` |
| **Notifikasi** | `ID, Message, Type, Target_Email, Is_Read, Timestamp, Target_Role, Role, Email` |
| **Piket** | `ID_Piket, Hari, ID_Siswa, Nama_Siswa, Email` |

**Sheet Arsip (dibuat otomatis oleh `ensureArchiveSheets()` saat setup dan sebelum pengarsipan):**

| Nama Sheet | Header (baris 1) |
|---|---|
| **Archive_Rekap_Absensi** | `ID_Siswa, Bulan, H, I, S, A, B` |
| **Archive_Rekap_Keuangan** | `Bulan, Saldo_Awal, Total_Masuk, Total_Keluar, Saldo_Akhir` |
| **Archive_Detail_Absensi** | `ID_Presensi, Tanggal, ID_Siswa, NISN, Status_Pagi, Timestamp_Pagi, Status_Siang, Timestamp_Siang, Keterangan` |
| **Archive_Catatan_Terlambat** | `ID_Terlambat, Tanggal, ID_Siswa, NISN, Nama_Siswa, Keterangan, Dicatat_Oleh, Created_At` |
| **Archive_Detail_Keuangan** | `ID_Transaksi, Tanggal, ID_Siswa, NISN, Tipe, Jumlah, Keterangan` |

> **Catatan Penting:** Nama sheet dan header **HARUS PERSIS** termasuk huruf besar/kecil dan underscore. Cara paling aman adalah membiarkan `setupSpreadsheet()` yang membuat sheet beserta headernya. Jangan membuat sheet arsip manual dengan nama yang berbeda.

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

> **⚠️ PENTING:** Setiap kali Anda mengubah kode `Code.gs`, Anda harus melakukan **Deploy > New Deployment** (atau **Manage Deployments > Deploy**) agar perubahan diterapkan. URL Web App (`/exec`) tetap sama, yang berubah adalah versi deployment yang aktif — jadi URL di `.env` tidak perlu diganti.

#### Menjalankan Setup Awal Spreadsheet

Fungsi `setupSpreadsheet()` **tidak** bisa dipanggil lewat parameter URL Web App. Web App hanya menerima permintaan **POST** dengan body JSON. Jalankan fungsi tersebut langsung dari editor Apps Script:

1. Buka proyek `SiswaHub_API` di editor Apps Script.
2. Pilih fungsi `setupSpreadsheet` pada dropdown fungsi di toolbar.
3. Klik **Run** dan setujui izin akses spreadsheet bila diminta.
4. Fungsi ini membuat sheet aktif, sheet arsip, dan satu notifikasi awal sekaligus.

> **Catatan:** `setupSpreadsheet()` menggunakan `insertSheet()`, jadi jalankan **hanya sekali** pada spreadsheet yang masih kosong. Jika sheet dengan nama sama sudah ada, fungsi akan gagal karena duplikat nama sheet.

#### Menjadwalkan Arsip Otomatis

Action `SETUP_TRIGGERS` baru diproses lewat POST JSON ke Web App, bukan dengan membuka URL di browser. Contoh `curl`:

```bash
curl -X POST "https://script.google.com/macros/s/ABCDEF12345/exec" \
  -H "Content-Type: text/plain;charset=utf-8" \
  -d '{"action":"SETUP_TRIGGERS"}'
```

Trigger yang dibuat berjalan setiap tanggal 1 pukul 01:00 untuk mengarsipkan data bulan sebelumnya. Statusnya bisa dicek dengan action `GET_TRIGGER_STATUS` menggunakan pola POST yang sama.

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
git clone https://github.com/lukmanhasyim-ship-it/Wali-Kelas.git
cd Wali-Kelas

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
```

Hanya dua variabel di atas yang dibaca aplikasi (`VITE_GOOGLE_CLIENT_ID` oleh `App.jsx`, `VITE_GAS_API_URL` oleh `utils/gasClient.js`). Firebase dipakai untuk hosting statis saja, jadi tidak perlu variabel environment Firebase.

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
```

> Firebase di sini hanya berfungsi sebagai **hosting statis** untuk folder `dist`. Proses login sepenuhnya memakai Google OAuth (Google Identity Services) di sisi klien, jadi tidak perlu mengaktifkan Firebase Authentication.

---

### 6. Mengisi Data Awal

Setelah semua terhubung, login sebagai **Wali Kelas** (email harus terdaftar di sheet `Profil_Wali_Kelas`).

1. **Master Siswa**: Impor data siswa via halaman **Data Siswa** > Tambah/Import.
2. **Profil Wali Kelas**: Isi manual di sheet `Profil_Wali_Kelas` (minimal: Id_Wali, Nama, Email, Kelas).
3. **Setoran Iuran**: Atur nominal iuran di Profil Wali Kelas (kolom `Nominal_Iuran`).
4. **Piket**: Atur jadwal piket di halaman Piket.
5. Data Presensi, Keuangan, dan Panggilan bisa langsung diinput lewat aplikasi.

---

## 🔄 Alur Kerja Utama

### Presensi Harian
1. Buka halaman **Presensi Pagi** atau **Presensi Siang** (menu grup Presensi).
2. Pilih tanggal yang akan dicatat.
3. Klik status per siswa: **H** (Hadir), **S** (Sakit), **I** (Ijin), **A** (Alfa), **B** (Bolos).
4. Kedua sesi disimpan terpisah di sheet `Presensi` (`Status_Pagi` / `Status_Siang` beserta timestamp-nya).

### Kas Kelas
1. Buka halaman **KAS Kelas**.
2. Pilih siswa, masukkan jumlah, tipe (**Masuk** / **Keluar**), keterangan, dan tanggal.
3. Klik **Catat Kas** — transaksi masuk ke **antrean lokal** (belum tersimpan di Sheet).
4. Ulangi untuk beberapa transaksi. Draft form dan antrean tetap bertahan setelah halaman di-refresh.
5. Klik **Simpan Transaksi (n)** di bawah daftar antrean. Seluruh antrean dikirim sekaligus lewat `BULK_CREATE`.
6. Setelah berhasil, antrean dikosongkan, data tabel di-refresh di tempat, dan halaman tetap di `/keuangan` (tidak kembali ke dashboard maupun di-reload).

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
2. Pastikan tanggal yang diinginkan sudah dipilih di header — antrean disimpan **per tanggal**, antrean tanggal lain tidak tercampur.
3. Cari siswa, isi keterangan (opsional), lalu klik **Catat Terlambat**. Siswa masuk ke antrean lokal, belum langsung ditulis ke Sheet.
4. Klik **Simpan Catatan (n)** di bawah daftar antrean untuk mengirim seluruh catatan tanggal itu sekaligus lewat `BULK_CREATE_TERLAMBAT`.
5. Satu siswa maksimal satu catatan per hari. Jika ada duplikat (baik di antrean maupun di Sheet), **seluruh antrean ditolak** dan Anda diminta memperbaikinya terlebih dahulu. Hasilnya hanya muncul sebagai toast ringkas.

---

## 👥 Peran & Hak Akses

Aplikasi mengenal delapan peran. Peran menentukan menu yang tampil di sidebar/navigasi bawah dan route yang boleh diakses. Jika pengguna membuka route yang tidak diizinkan, mereka dialihkan ke Dashboard.

| Peran | Akses utama |
|---|---|
| **Wali Kelas** | Semua menu: Data Siswa, Buku Klaper, Leger, Tanggungan KAS, KAS Kelas, Presensi Pagi/Siang, Catatan Terlambat, Laporan Akhir, Laporan Harian, Log Panggilan, Jadwal Piket |
| **Ketua Kelas / Wakil Ketua Kelas** | Presensi Pagi/Siang, KAS Kelas, Jadwal Piket |
| **Bendahara / Wakil Bendahara** | Tanggungan KAS, KAS Kelas, Jadwal Piket |
| **Sekretaris / Wakil Sekretaris** | Presensi Pagi/Siang, Jadwal Piket |
| **Siswa** | Dashboard, Profil, Jadwal Piket, Notifikasi, Feedback |

Semua peran bisa mengakses **Dashboard, Profil, Notifikasi, Feedback, dan Jadwal Piket**. Role disimpan di `wali_kelas_user` pada `localStorage` saat login dan dipakai oleh `config/navigation.js` sebagai sumber kebenaran tunggal untuk navigasi maupun pembatasan route.

---

## 🧩 Struktur Proyek

```
Wali-Kelas/
├── gas/
│   └── Code.gs                  # Backend Google Apps Script (semua logika + action API)
├── public/                      # Aset statis (favicon, logo, dll)
├── src/
│   ├── components/              # Komponen React reusable
│   │   ├── navigation/          # BottomNav + style navigasi bawah
│   │   ├── Breadcrumbs.jsx      # Jejak navigasi halaman
│   │   ├── ErrorBoundary.jsx    # Penangkap error render
│   │   ├── Loading.jsx          # Fallback lazy route
│   │   ├── Skeleton.jsx         # Skeleton loading
│   │   ├── EmptyState.jsx       # State kosong
│   │   ├── StudentCard.jsx      # Kartu alert siswa di dashboard
│   │   ├── ImageLightbox.jsx    # Preview gambar fullscreen
│   │   ├── NotificationDrawer.jsx
│   │   ├── PageGuide.jsx        # Panduan singkat tiap halaman
│   │   ├── SearchModal.jsx      # Pencarian cepat
│   │   ├── Toast.jsx            # Panel toast
│   │   ├── UpdateCheck.jsx      # Panel pengecekan versi di Profil
│   │   └── Layout.jsx           # Shell: sidebar, header, navigasi bawah
│   ├── config/
│   │   └── navigation.js        # Daftar menu + pembatasan role (sumber kebenaran)
│   ├── context/
│   │   ├── AuthContext.jsx      # Context autentikasi Google OAuth
│   │   └── ToastContext.jsx     # Context notifikasi toast
│   ├── lib/
│   │   └── queryClient.js       # Instance TanStack Query
│   ├── pages/
│   │   ├── Dashboard.jsx        # Alert + statistik utama
│   │   ├── MasterSiswa.jsx      # Data siswa (import/ekspor)
│   │   ├── PresensiPagi.jsx     # Presensi sesi pagi
│   │   ├── PresensiSiang.jsx    # Presensi sesi siang
│   │   ├── Presensi.jsx         # Presensi umum (route non-menu)
│   │   ├── Piket.jsx            # Jadwal piket
│   │   ├── CatatanTerlambat.jsx # Antrean catatan terlambat per tanggal
│   │   ├── Keuangan.jsx         # KAS kelas + antrean transaksi
│   │   ├── Tanggungan.jsx       # Tagihan KAS
│   │   ├── Panggilan.jsx        # Log panggilan & home visit
│   │   ├── Laporan.jsx          # Laporan akhir komprehensif
│   │   ├── LaporanHarian.jsx    # Rekap harian
│   │   ├── BukuKlaper.jsx       # Buku klaper
│   │   ├── DKN.jsx              # Leger digital
│   │   ├── Profile.jsx          # Profil + Update Sistem
│   │   ├── Notifications.jsx    # Pusat notifikasi
│   │   ├── Feedback.jsx         # Kirim feedback
│   │   ├── Login.jsx            # Login Google OAuth
│   │   ├── Register.jsx         # Pendaftaran
│   │   ├── Terms.jsx            # Syarat & ketentuan
│   │   └── Privacy.jsx          # Kebijakan privasi
│   ├── utils/
│   │   ├── gasClient.js         # Helper POST ke GAS + cache TanStack Query
│   │   ├── logic.js             # Format, kalkulasi, tanggal
│   │   ├── notifications.js     # Kirim notifikasi via GAS
│   │   ├── version.js           # Versi aplikasi + pengecekan update GitHub
│   │   ├── coordinates.js       # Konversi koordinat DMS
│   │   └── xlsxLoader.js        # Loader XLSX via CDN SheetJS
│   ├── App.jsx                  # Routing + proteksi role
│   └── main.jsx                 # Entry point Vite
├── .env                         # Environment variables (TIDAK di-commit)
├── firebase.json                # Konfigurasi Firebase Hosting (public: dist)
├── vite.config.js               # Vite + PWA service worker
├── tailwind.config.js
├── package.json
└── README.md
```

---

## 💻 Tech Stack

*   **Frontend**: React 19, Vite 7, React Router 7, Tailwind CSS 3.4, Recharts, date-fns, Lucide Icons
*   **State & Data**: TanStack Query untuk cache server-state; `localStorage` untuk draft/antrean dan sesi login
*   **Backend**: Google Apps Script (GAS) runtime V8 — API berbasis action lewat POST JSON
*   **Database**: Google Sheets (sheet aktif + sheet arsip bulanan)
*   **Autentikasi**: Google OAuth 2.0 via Google Identity Services (`@react-oauth/google`)
*   **Integrasi**: Google Drive (upload bukti & `GET_FILE` base64), Google Sheets API, GitHub REST API untuk pengecekan versi
*   **Ekspor/Impor**: SheetJS (xlsx), jsPDF + html2canvas
*   **Hosting**: Firebase Hosting; PWA dengan service worker auto-update via `vite-plugin-pwa`

---

## ⚠️ Catatan Penting

*   **Biaya**: Google Sheets gratis untuk penggunaan normal. Batas 10MB per sheet dan 5 juta cells per spreadsheet sudah lebih dari cukup untuk satu kelas (30-40 siswa selama 3 tahun).
*   **Ketersediaan**: Pastikan spreadsheet tidak dihapus/dipindahkan. Cadangan (backup) spreadsheet secara berkala.
*   **Keamanan**: GAS Web App dijalankan sebagai **pemilik script** (Anda). File yang diupload ke Drive hanya bisa diakses oleh script via `DriveApp.getFileById()` — tidak ada akses publik.
*   **CORS**: GAS Web App sudah mendukung CORS. Jika ada error CORS, pastikan Anda mendeploy ulang setelah perubahan.
*   **Deploy Backend**: Setiap perubahan `gas/Code.gs` **wajib** di-deploy ulang lewat **Deploy → New Deployment** (bukan hanya Save/Update deployment). Action baru seperti `BULK_CREATE_TERLAMBAT` tidak akan dikenal sampai deployment baru aktif — frontend akan menampilkan pesan "Unknown action" sebagai petunjuk.
*   **Deploy Frontend**: Setiap perubahan kode harus diikuti `npm run build` lalu deploy ulang folder `dist`. Karena service worker PWA menyimpan bundle lama, lakukan **hard refresh** (Ctrl+Shift+R) atau hapus service worker jika nomor versi di sidebar belum berubah.
*   **Versi Aplikasi**: Nomor versi dibaca dari `package.json`, ditampilkan di sidebar/login dan di panel **Profil → Update Sistem**. Keduanya akan sinkron setelah bundle baru berhasil di-deploy.

---

> **Didesain dengan ❤️ oleh Mohamad Lukman Nurhasyim, S.Kom, Gr.**
> *Aplikasi ini dibangun dengan kolaborasi cerdas bersama AI.*

© 2026 Siswa.Hub. All rights reserved.
