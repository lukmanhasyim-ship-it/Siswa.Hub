## Siswa.Hub v5.0.1 — Antrean Catatan Terlambat

Rilis pembaruan kecil di atas v5.0.0 yang fokus pada alur pencatatan keterlambatan, penyimpanan kas tanpa reload, dan ringananya navigasi.

### Yang baru

- **Antrean catatan terlambat per tanggal** — tombol **Catat Terlambat** memasukkan siswa ke antrean lokal sesuai tanggal yang dipilih di header. Antrean pada tanggal lain tetap tersimpan terpisah.
- **Simpan massal** — tombol **Simpan Catatan** mengirim seluruh antrean tanggal tersebut dalam satu permintaan `BULK_CREATE_TERLAMBAT`.
- **Draft yang bertahan** — keterangan dan antrean tetap ada setelah halaman di-refresh.
- **Simpan kas tanpa pindah halaman** — data transaksi disegarkan di tempat setelah **Simpan Transaksi**; browser tidak di-reload.

### Perbaikan

- Satu siswa maksimal satu catatan terlambat per hari. Jika ada duplikat saat penyimpanan, seluruh antrean ditolak dan pengguna diminta memperbaikinya terlebih dahulu.
- Notifikasi hasil penyimpanan kini berupa toast ringkas.
- Halaman berat dimuat secara lazy per rute sehingga bundle awal lebih kecil.
- Cache pengecekan versi divalidasi terhadap versi aplikasi yang aktif, sehingga status update tidak tertinggal setelah deploy.
- Dependensi diperbarui: `xlsx` 0.20.3 (CDN resmi SheetJS) dan `react-router-dom` 7.18.6.

### Catatan deployment

1. **Backend wajib di-deploy ulang.** Kode `gas/Code.gs` memiliki action baru `BULK_CREATE_TERLAMBAT`. Lakukan **Deploy → New Deployment** agar action tersebut dikenal. Jika belum, frontend akan menampilkan pesan *Unknown action*. URL Web App (`/exec`) tidak berubah.
2. **Frontend:** jalankan `npm ci && npm run build`, lalu deploy ulang folder `dist` ke Firebase Hosting.
3. Karena PWA menyimpan bundle lama, lakukan **hard refresh** (Ctrl+Shift+R) atau hapus service worker jika nomor versi di sidebar/Profil belum menampilkan **5.0.1**.
4. Sheet `Catatan_Terlambat` harus memiliki header sesuai README; kolom tambahan dibuat otomatis oleh `ensureHeaders()`.

**Full Changelog**: https://github.com/lukmanhasyim-ship-it/Siswa.Hub/compare/v5.0.0...v5.0.1
