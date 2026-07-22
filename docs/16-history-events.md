# 16 — History Events System

> Dokumen ini menjelaskan arsitektur dan sistem pengarsipan digital (*Digital Archiving*) pada modul **History Events**, yang bertugas mendokumentasikan, membekukan data, dan menyajikan kembali rekam jejak penyelenggaraan festival/event Sukabumi Eundeur dari masa ke masa.

---

## 📌 Daftar Isi

- [Penjelasan](#-penjelasan)
- [Tujuan](#-tujuan)
- [Scope](#-scope)
- [Flow — Proses Pengarsipan (Archiving)](#-flow--proses-pengarsipan-archiving)
- [Diagram Alur History System](#-diagram-alur-history-system)
- [Struktur Halaman History (Front-End)](#-struktur-halaman-history-front-end)
- [Mekanisme Pembekuan Data (Data Freezing)](#-mekanisme-pembekuan-data-data-freezing)
- [Checklist](#-checklist)
- [Catatan](#-catatan)
- [Best Practice](#-best-practice)
- [Enterprise Recommendation](#-enterprise-recommendation)
- [Future Improvement](#-future-improvement)

---

## 🎯 Overview

Seiring berjalannya waktu, sebuah festival akan memiliki nilai budaya (*cultural value*) dan histori yang kuat. Halaman **History** tidak sekadar memindahkan event ke tab "Past Events", melainkan menyajikan laman rangkuman (*Recap*) yang kaya akan visual, statistik, dan cerita sukses (*success story*) purna-acara. 

Modul ini juga krusial secara bisnis sebagai "Portofolio" untuk dipresentasikan kepada calon sponsor di tahun-tahun berikutnya.

---

## 🎯 Objective

1. Menyediakan monumen digital untuk setiap penyelenggaraan acara Eundeur.
2. Memisahkan data aktif (*Active Event*) dengan data mati (*Archived Event*) pada sistem *database* agar proses *query* operasional tetap cepat.
3. Menampilkan rangkuman impresif berupa Aftermovie, Line-up, jumlah pengunjung, dan publikasi media eksternal.

---

## 📐 Scope

Dokumen ini mencakup:
- Struktur informasi pada setiap rilis *History Event* per tahun.
- Tata cara CMS membekukan (*freeze*) data dari event aktif menjadi event sejarah.
- Daftar komponen yang tampil di halaman publik (Poster, Galeri, Statistik, Sponsor).

Dokumen ini **tidak mencakup**:
- Manajemen penyimpanan raw file video berukuran raksasa (video *Aftermovie* akan mengandalkan *embed* dari YouTube, bukan disimpan di server sendiri).

---

## 🔄 User Flow

### Alur Processes
 Proses Pengarsipan (Archiving)

Proses mengubah sebuah Event menjadi History dilakukan secara manual oleh Super Admin melalui CMS ketika masa evaluasi pasca-event telah selesai.

1. **Trigger:** Event X telah selesai (Tanggal Berakhir terlampaui).
2. **Review:** Admin meninjau data statistik akhir (Total Hadir, Total Tiket Terjual).
3. **Enrichment:** Admin menambahkan aset pasca-acara (Video *Aftermovie* dari YouTube, Teks *Recap*, dan tautan liputan media).
4. **Freezing:** Admin menekan tombol *"Archive to History"*. Sistem menduplikasi dan mengubah format data ke dalam tabel khusus `History`, melepaskan ketergantungan dari tabel operasional `Tickets` atau `Orders`.
5. **Publish:** Halaman History baru (contoh: `/history/2026/eundeur-fest-1`) mengudara di web publik.

---

## 🖼️ Diagram Alur History System

```mermaid
flowchart TD
    A[Event Selesai (Past Event)] -->|Masuk CMS History| B[Isi Data Rangkuman]
    B --> C[Tautkan YouTube Aftermovie]
    B --> D[Unggah Galeri Foto Terpilih]
    B --> E[Input Statistik Manual]
    B --> F[Tautkan Logo Sponsor Pasca-Acara]
    
    C & D & E & F --> G{Konfirmasi Arsip?}
    G -->|Ya| H[(Simpan ke Tabel History)]
    H --> I[Revalidate Halaman /history]
    I --> J[Tampil di Halaman Publik]
```

---

## 🏛️ Struktur Halaman History (Front-End)

Saat pengguna mengunjungi `/history/2026/nama-event`, mereka akan melihat struktur halaman (*Landing Page* gaya dokumenter) berikut:

1. **Hero Header:** Background foto epik (*crowd* penonton), Nama Event, Tanggal, dan Lokasi.
2. **The Story (Recap):** Teks narasi singkat tentang keberhasilan dan kesan-pesan dari acara tersebut.
3. **Aftermovie:** Layar besar (*embed* YouTube) yang memutar video resmi pasca-acara.
4. **The Line-Up:** Daftar artis/band yang tampil (bisa berupa teks *grid* atau poster asli).
5. **By The Numbers (Statistik):** Angka infografis (contoh: "5.000+ Penonton", "20+ Musisi", "3 Panggung").
6. **Gallery Highlights:** *Grid* foto-foto terbaik (penonton, panggung, *merch*).
7. **Media Coverage & Sponsors:** Logo media yang meliput dan sponsor yang mendanai acara tersebut.

---

## ❄️ Mekanisme Pembekuan Data (Data Freezing)

**Mengapa butuh Pembekuan (Freezing)?**
Misalkan sebuah "Band A" tampil di Eundeur 2026. Di tahun 2028, profil "Band A" dihapus dari CMS karena sudah bubar. Jika halaman History 2026 bergantung langsung (*JOIN table*) ke tabel `Artists`, maka hilangnya profil "Band A" akan membuat sejarah 2026 ikut rusak/hilang.

**Solusinya (Data Freezing):**
Saat Admin menekan *"Archive"*, sistem akan **mengkopi teks mentah (Hardcode/Denormalization)** nama-nama artis, daftar sponsor, dan statistik ke dalam kolom JSON di tabel `History`. Sehingga, meskipun data sumber diubah atau dihapus, halaman sejarah tidak akan pernah berubah (abadi).

---



## 💼 Business Rules
- Seluruh aturan bisnis modul harus tunduk pada Single Source of Truth (SSOT) Sukabumi Eundeur.
- Transaksi & data mutasi wajib mencatat audit log timestamp.


## ⚙️ Functional Requirements
- Mengimplementasikan seluruh endpoint API & komponen UI terkait.
- Mengelola state & autentikasi pengguna secara otomatis melalui JWT & Self-Hosted Auth Handler.


## 🚀 Non Functional Requirements
- Latensi respon < 200ms.
- Uptime target 99.9%.
- Aksesibilitas WCAG 2.1 Level AA.


## 🏗️ Architecture
- **Frontend**: Next.js 16 (App Router) + React 19.
- **Backend**: PostgreSQL (Self-Hosted VPS) (PostgreSQL + RLS + Storage).
- **Infrastructure**: VPS Ubuntu + Nginx + PM2.


## 🔗 Dependencies
- `@PostgreSQL (Self-Hosted VPS)/PostgreSQL (Self-Hosted VPS)-js`
- `next` v16
- `react` v19
- `tailwindcss` v4


## ⚠️ Risks
- Kegagalan koneksi database saat lonjakan trafik -> Mitigasi: Connection Pooling & Caching.


## 🧪 Edge Cases
- Sesi pengguna kadaluarsa di tengah transaksi -> Redirect otomatis ke login dengan restore state.


## 📋 Validation Rules
- Format input wajib disanitasi dari potensi XSS & SQL Injection.


## 🛠️ Technical Notes
- Implementasi wajib mengikuti konvensi kode di [`21-folder-structure.md`](./21-folder-structure.md).


## 🚀 Future Improvements
- Integrasi analitik real-time dan rekomendasi berbasis AI.


## ✅ Checklist

- [x] Struktur visual halaman (Aftermovie, Statistik, Recap, Sponsor) terdefinisi.
- [x] Alur pengarsipan dari Event ke History tergambar.
- [x] Strategi pembekuan data (Denormalisasi/JSON) untuk menjaga integritas sejarah telah direncanakan.
- [ ] Desainer UI perlu membuat templat halaman History yang memberikan kesan *nostalgic* dan *premium*.

---

## 📝 Catatan

- **Kapasitas Penyimpanan (Storage):** Galeri foto yang masuk ke halaman History harus dipilih (*curated*), maksimal 20-30 foto resolusi optimal. Sisanya dapat diunggah ke Google Drive eksternal atau Google Photos yang ditautkan, demi menghemat *bandwidth* MinIO / Local VPS Storage.

---

## 💡 Best Practice

- **SEO & Permalink:** URL untuk *History* harus bersifat statis dan jangan pernah diubah (contoh: `/history/2026/eundeur-fest-vol-1`). Ini akan menjadi ladang *backlink* yang sangat berharga ketika media-media online (portal berita) merujuk kembali ke acara Anda setahun kemudian.

---

## 🏢 Enterprise Recommendation

> **Static Site Generation (SSG) Abadi**
> Karena data History tidak akan pernah berubah lagi (bersifat statis), pada Next.js, pastikan rute `/history/[year]/[slug]` di- *render* menggunakan metode SSG murni (tanpa ISR atau waktu revalidasi). File HTML akan di-*cache* selamanya di CDN, membuat halaman sejarah memuat secara instan (0 milidetik *latency* database).

---

## 🚀 Future Improvement

- **User Reflection / "I Was There":** Menambahkan tombol interaktif `"Saya Hadir!"` di halaman History. Pengguna yang berhasil membuktikan kehadiran (berdasarkan riwayat tiket mereka) akan disematkan avatarnya di bagian bawah halaman, membentuk "Dinding Kenangan" digital.
- **Spotify Integration:** Menambahkan *embed* "Official Setlist Playlist" dari Spotify yang memutar lagu-lagu yang dibawakan pada event tersebut.

---

<div align="center">

⬅️ [Kembali ke 15. Community System](./15-community-system.md) · ➡️ [Lanjut ke 17. Media Gallery](./17-media-gallery.md)

</div>
