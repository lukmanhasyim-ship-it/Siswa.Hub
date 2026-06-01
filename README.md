# Siswa.Hub v4.9.3 - Ekosistem Manajemen Kelas Digital Premium

![License](https://img.shields.io/badge/License-Private-red.svg)
![Version](https://img.shields.io/badge/Version-4.9.3-emerald.svg)
![React](https://img.shields.io/badge/Frontend-React%2019-blue.svg)
![Backend](https://img.shields.io/badge/Backend-Google%20Apps%20Script-orange.svg)

**Siswa.Hub** adalah platform manajemen kelas revolusioner berbasis *Serverless* yang dirancang untuk mentransformasi kinerja Wali Kelas. Aplikasi ini menggabungkan keindahan desain modern dengan sistem backend yang tangguh menggunakan Google Workspace Ecosystem, memberikan pengalaman pengelolaan administrasi siswa yang cerdas, transparan, dan sangat efisien.

---

## 🆕 Versi 4.9.3 - Peningkatan Stabilitas & Visual
*   **Perbaikan Gambar Bukti**: Menggunakan metode `thumbnailLink` via Drive API v3 dan format `lh3` publik untuk mengatasi masalah CORS dan link rusak.
*   **Grafik Responsif**: Memperbaiki error dimensi Recharts pada halaman laporan sehingga grafik tampil sempurna di semua layar.
*   **Header "Always on Top"**: Memastikan bilah navigasi tetap menempel di atas (sticky) saat digulir, khususnya untuk kenyamanan pengguna mobile.
*   **Redundansi Link**: Menambahkan tautan teks cadangan di bawah setiap foto bukti panggilan sebagai jaminan akses data.

---

## 📊 Fitur Unggulan
*   **Dashboard Analitik**: Visualisasi kehadiran, keuangan, dan kedisiplinan secara real-time.
*   **Presensi Dual-Session**: Pencatatan kehadiran pagi dan siang dengan timestamp otomatis.
*   **Kas Kelas Digital**: Manajemen iuran dengan sistem draf transaksi massal (Bulk Save).
*   **Log Panggilan & Home Visit**: Pendataan kasus siswa lengkap dengan dokumentasi foto langsung ke Google Drive.
*   **Leger & Buku Klaper**: Ekspor data akademik ke format profesional yang siap cetak.
*   **Otomasi Arsip**: Sistem otomatis memindahkan data lama ke sheet arsip setiap bulan.

---

## 🛠️ Panduan Instalasi Detil

### 1. Persiapan Database (Google Sheets)
1.  Buat **Google Spreadsheet** baru.
2.  Buat sheet berikut dengan nama yang **PERSIS** sama. Di baris pertama (Header), masukkan kolom-kolom berikut:
    *   **Master_Siswa**: `ID_Siswa, NIS, NISN, Nama_Siswa, L/P, Email, Jabatan, Tempat_Lahir, Tanggal_Lahir, Tanggal_Masuk_X, Tanggal_Naik_XI, Tanggal_Naik_XII, Tanggal_Tamat_Sekolah, No_WA_Siswa, Nama_Wali, No_WA_Wali, Alamat, Latitude, Longitude, Lokasi, Status_Aktif, Last_Active, Keterangan, Created_At`
    *   **Presensi**: `ID_Presensi, Tanggal, ID_Siswa, Status_Pagi, Status_Siang, Keterangan, Timestamp_Pagi, Timestamp_Siang`
    *   **Keuangan**: `ID_Transaksi, Tanggal, ID_Siswa, NISN, Tipe, Jumlah, Keterangan`
    *   **Daftar_Nilai**: `ID_Nilai, ID_Siswa, NISN, Jenjang, Semester, Kategori_Mapel, Nama_Mapel, Topik, Nilai, Timestamp`
    *   **Log_Panggilan**: `ID_Panggilan, Tanggal, ID_Siswa, NISN, Kategori, Alasan, Tanggal_Pemanggilan, Waktu_Diskusi, Hasil_Pertemuan, Status_Selesai, Bukti_File_URL`
    *   **Profil_Wali_Kelas**: `Id_Wali, Nama, Email, Bio, Gaya_Ajar, Kontak, Created_At, Nominal_Iuran, Kelas`
    *   **Notifikasi**: `ID, Message, Type, Target_Email, Is_Read, Timestamp, Target_Role, Role, Email`

### 2. Setup Backend (Google Apps Script)
1.  Di Spreadsheet, klik **Extensions** > **Apps Script**.
2.  Beri nama proyek: `SiswaHub_API`.
3.  Salin kode dari file `gas/Code.gs` ke editor script.
4.  Klik ikon **Settings (oda gigi)**, lalu centang "Show 'appsscript.json' manifest file".
5.  Pastikan file `appsscript.json` menyertakan scope berikut:
    ```json
    "oauthScopes": [
      "https://www.googleapis.com/auth/spreadsheets",
      "https://www.googleapis.com/auth/drive.readonly",
      "https://www.googleapis.com/auth/drive.file",
      "https://www.googleapis.com/auth/script.send_mail"
    ]
    ```
6.  Klik **Deploy** > **New Deployment**.
7.  Type: **Web App**. Execute as: **Me**. Who has access: **Anyone**.
8.  Salin **Web App URL** (Contoh: `https://script.google.com/macros/s/.../exec`).

### 3. Setup Autentikasi (Google Cloud Console)
1.  Buka [Google Cloud Console](https://console.cloud.google.com/).
2.  Buat Proyek baru. Pergi ke **APIs & Services** > **Credentials**.
3.  Klik **Create Credentials** > **OAuth client ID**.
4.  Pilih **Web Application**.
5.  Pada **Authorized JavaScript origins**, tambahkan URL hosting Anda dan `http://localhost:5173`.
6.  Salin **Client ID** yang dihasilkan.

### 4. Setup Frontend (Lokal)
1.  Download/Clone repository ini.
2.  Buka terminal di folder proyek dan jalankan:
    ```bash
    npm install
    ```
3.  Buat file `.env` di root folder:
    ```env
    VITE_GOOGLE_CLIENT_ID=masukkan_client_id_anda
    VITE_GAS_API_URL=masukkan_url_deployment_gas
    ```
4.  Jalankan aplikasi:
    ```bash
    npm run dev
    ```

### 5. Deployment ke Firebase
1.  Jalankan `npm run build`.
2.  Gunakan Firebase CLI:
    ```bash
    npx firebase login
    npx firebase init  # Pilih Hosting, tunjuk folder 'dist'
    npx firebase deploy
    ```

---

## 💻 Tech Stack
*   **Frontend**: React 19, Vite 7, Tailwind CSS 3.4.
*   **Backend**: Google Apps Script (GAS).
*   **Database**: Google Sheets (Cloud-based Spreadsheet).
*   **Integrasi**: Google Drive API, Google OAuth 2.0.

---

> **Didesain dengan ❤️ oleh Mohamad Lukman Nurhasyim, S.Kom, Gr.**  
> *Aplikasi ini dibangun dengan kolaborasi cerdas bersama AI.*

© 2026 Siswa.Hub. All rights reserved.
