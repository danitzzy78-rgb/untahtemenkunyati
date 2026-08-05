# Cara Pakai Website Ini (Versi Story / Mobile-First)

Sekarang websitenya **bukan halaman scroll** lagi — dibuka seperti Instagram
Story / kartu geser di HP. Alurnya:

1. 🔒 Layar kunci HP (jam & tanggal) → sentuh untuk buka
2. 🔔 Notifikasi "1 hadiah baru" → tap untuk buka
3. 🎁 Kotak hadiah → tap untuk buka (keluar confetti)
4. ⏳ Countdown (otomatis dilewati kalau hari ini sudah hari-H)
5. 💌 Surat ucapan dengan efek mesin ketik + penghitung "hari bersama"
6. 📖 Kisah kita (timeline singkat)
7. 🖼️ Galeri foto — satu foto per tap, geser/klik buat pindah
8. 📼 Video pesan Side A & Side B (gaya kaset)
9. 💌 Surat penutup
10. 🎆 Halaman akhir dengan kembang api + tombol "Putar Ulang"

**Cara pindah slide:** klik/tap sisi kanan layar = lanjut, sisi kiri = kembali.
Bisa juga pakai tombol panah kecil di pojok bawah, geser jari (swipe), atau
tombol panah keyboard (di desktop). Progress bar tipis di atas menunjukkan
posisi kamu.

## 1. Ganti data
Buka `index.html` dengan text editor, cari bagian `CONFIG` di dalam `<script>`, lalu ubah:
- `recipientName`, `fromName`
- `birthdayDate`, `togetherSince`
- `photoCount` (jumlah slide foto)
- `letter1`, `letter2` (isi surat)
- `timeline` (cerita kalian)

## 2. Foto
Buat folder `foto/`, isi `foto-1.jpg` sampai `foto-N.jpg` (sesuai `photoCount`).
Kirim ke aku fotonya kalau mau langsung aku pasangkan ke kodenya.

## 3. Video (2 video — Side A & Side B)
Buat folder `video/`, isi `pesan-1.mp4` dan `pesan-2.mp4`.

## 4. Musik latar
Buat folder `musik/`, isi file mp3 **milikmu sendiri** dengan nama:
- `laskar-pelangi.mp3`
- `the-one-that-got-away.mp3`

Musik mulai otomatis begitu layar kunci disentuh pertama kali (browser
memang perlu sentuhan dulu sebelum bisa autoplay). Tombol nada di pojok
kanan atas: **tap** = play/pause, **tap 2x** = ganti lagu.

> Catatan: lagu aslinya (Nidji & Katy Perry) berhak cipta, jadi aku nggak
> bisa nyisipin file lagunya langsung — kamu tinggal taruh mp3 yang kamu
> punya di folder `musik` dengan nama persis di atas.

## Soal referensi yang kamu kirim
Dari daftar ide yang kamu kasih, yang aku pakai & gabungkan di versi ini:
**iPhone Lock Screen** (pembuka) + **Notifikasi gaya Messenger** + **Gift Box**
+ **Instagram Story style** (navigasi tap, progress bar) + **Scrapbook/Polaroid**
(galeri) + **Cinematic** (musik, confetti, kembang api, mesin ketik).

Yang belum dipakai tapi bisa aku tambahin kalau kamu mau: **Night Sky** (bintang
bisa diklik buat buka cerita), **Galaxy/3D Book**, atau **game pixel kecil**
sebelum halaman penutup — tinggal bilang aja mau yang mana.