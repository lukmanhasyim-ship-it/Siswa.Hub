# Changelog

Semua perubahan signifikan pada Siswa.Hub dicatat di file ini. Format mengikuti [Keep a Changelog](https://keepachangelog.com/id/1.1.0/) dan versi menggunakan [Semantic Versioning](https://semver.org/lang/id/).

## [5.0.1] - 2026-11-20

### Ditambahkan

- Antrean catatan terlambat per tanggal pada halaman **Catatan Terlambat**. Siswa yang ditandai terlambat masuk ke antrean lokal sesuai tanggal yang dipilih, bukan langsung tersimpan ke Sheet.
- Tombol **Simpan Catatan** mengirim seluruh antrean tanggal aktif sekaligus melalui action `BULK_CREATE_TERLAMBAT`.
- Draft keterangan dan daftar antrean disimpan di `localStorage` sehingga tetap ada setelah halaman di-refresh.
- File `CHANGELOG.md` dan catatan rilis `RELEASE_NOTES_v5.0.1.md` sebagai dokumentasi publik di GitHub.

### Diubah

- Tombol **Simpan Transaksi** di halaman KAS kini menyegarkan data di tempat tanpa me-reload browser dan tanpa meninggalkan halaman.
- Halaman berat (Dashboard, Master Siswa, Laporan, DKN, Tanggungan, Buku Klaper) dimuat secara lazy per rute agar bundle awal lebih ringan.
- Cache pengecekan versi divalidasi terhadap nomor versi aplikasi yang aktif; hasil pengecekan lama tidak dipakai setelah deploy versi baru.
- Dependensi diperbarui: `xlsx` 0.20.3 dari CDN resmi SheetJS dan `react-router-dom` 7.18.6.
- Dokumentasi diselaraskan: README menambahkan rincian v5.0.1 dan URL klon repo kanonik, `SECURITY.md` mengikuti versi yang didukung saat ini.

### Diperbaiki

- Proteksi duplikat satu siswa per hari pada catatan terlambat. Jika ada duplikat saat penyimpanan, seluruh antrean ditolak dan pengguna diminta memperbaikinya terlebih dahulu.
- Notifikasi hasil penyimpanan kini berupa toast ringkas, bukan dialog yang mengganggu alur kerja.

## [5.0.0] - 2026-11-19

### Ditambahkan

- Antrean transaksi kas per akun. Beberapa transaksi dapat dicatat berurutan lalu disimpan sekaligus lewat tombol **Simpan Transaksi**.
- Penyimpanan massal melalui action `BULK_CREATE` dengan satu notifikasi ringkasan.
- Draft form dan antrean kas bertahan setelah halaman di-refresh.

### Diubah

- Data sheet memakai cache memori TanStack Query dengan invalidasi otomatis.
- `GET_ALL` memakai `CacheService` pada Google Apps Script.
- Font Google di-cache oleh service worker.
- Navigasi bawah dan sidebar lebih ramah layar kecil; perpindahan halaman tidak lagi mereset state form.
- Pengecekan versi dan polling notifikasi dibuat lebih hemat.

[5.0.1]: https://github.com/lukmanhasyim-ship-it/Siswa.Hub/releases/tag/v5.0.1
[5.0.0]: https://github.com/lukmanhasyim-ship-it/Siswa.Hub/releases/tag/v5.0.0
