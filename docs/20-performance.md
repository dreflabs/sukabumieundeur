# 20 — Performance Strategy

> Dokumen ini memaparkan strategi optimisasi performa (*Performance Strategy*) untuk platform **Sukabumi Eundeur**, memastikan website dimuat dengan cepat, hemat *bandwidth*, dan tangguh dalam menangani lonjakan pengunjung (seperti saat *Ticket War*).

---

## 📌 Daftar Isi

- [Penjelasan](#-penjelasan)
- [Tujuan](#-tujuan)
- [Scope](#-scope)
- [Flow — Peta Pemuatan Halaman (Page Load)](#-flow--peta-pemuatan-halaman-page-load)
- [Strategi Rendering (SSG, ISR, SSR)](#-strategi-rendering-ssg-isr-ssr)
- [Optimasi Aset (Gambar & Bundle)](#-optimasi-aset-gambar--bundle)
- [Optimasi Database & Caching](#-optimasi-database--caching)
- [Checklist](#-checklist)
- [Catatan](#-catatan)
- [Best Practice](#-best-practice)
- [Enterprise Recommendation](#-enterprise-recommendation)
- [Future Improvement](#-future-improvement)

---

## 🎯 Overview

Pengguna modern memiliki toleransi waktu tunggu (*attention span*) yang sangat rendah. Website yang lambat (membutuhkan waktu lebih dari 3 detik untuk memuat) tidak hanya dibenci oleh pengunjung, tetapi juga dikenai penalti oleh Google (skor SEO anjlok). 

Kinerja website adalah fitur (*Performance is a feature*). Strategi ini memastikan skor **Core Web Vitals (LCP, FID, CLS)** tetap berada di zona hijau (Lulus).

---

## 🎯 Objective

1. Mencapai *Largest Contentful Paint* (LCP) di bawah 2.5 detik untuk semua halaman publik.
2. Mencegah *Layout Shift* (CLS) saat gambar atau *font* dimuat terlambat.
3. Mengurangi ukuran bundel *JavaScript* agar *Time to Interactive* (TTI) cepat di perangkat *mobile* kelas menengah.
4. Meminimalkan beban baca/tulis ke *database* PostgreSQL (Self-Hosted VPS) melalui strategi *Caching*.

---

## 📐 Scope

Dokumen ini mencakup:
- Strategi rendering statis vs dinamis di Next.js.
- Praktik optimasi aset media (*Images*, *Fonts*).
- Manajemen bundel (*Lazy Loading*).
- Penanganan basis data (Indeks dan *Query Caching*).

---

## 🔄 User Flow

### Alur Processes
 Peta Pemuatan Halaman (Page Load)

```mermaid
flowchart LR
    A[Pengguna Akses /events] --> B(Hit CDN / Vercel Edge)
    B -->|Cache Tersedia (SSG/ISR)| C[Kirim File HTML Statis]
    B -->|Cache Kedaluwarsa| D[Server Re-Render Data (ISR)]
    C --> E[Browser Muat HTML/CSS/Fonts]
    D --> E
    E -->|Lazy Load| F[Muat Gambar (WebP)]
    E -->|Hydration| G[Muat Bundel JavaScript (Client)]
```

---

## ⚡ Strategi Rendering (SSG, ISR, SSR)

Menggunakan fitur bawaan **Next.js App Router**:

1. **SSG (Static Site Generation):**
   Halaman yang jarang berubah seperti `About Us`, `Terms and Conditions`, `Contact` harus di- *render* secara statis murni pada saat *Build*. (Cepat 100%, beban server 0%).
2. **ISR (Incremental Static Regeneration):**
   Halaman publik yang dinamis namun tidak butuh *real-time* detik-per-detik, seperti `News List`, `Artist List`, dan `Event List`. Server Next.js akan mem-*cache* halaman ini, dan hanya akan membangun ulang (*revalidate*) secara asinkron di latar belakang tiap `x` detik, atau berdasarkan pembaruan data dari CMS (`revalidatePath`).
3. **SSR (Server-Side Rendering) / Dynamic:**
   Halaman yang butuh *real-time* mutlak, bergantung pada sesi *user*, atau parameter pencarian. Contoh: Halaman *Checkout* Tiket, *Dashboard* Akun, dan keranjang *Merchandise*.

---

## 🖼️ Optimasi Aset (Gambar & Bundle)

1. **Image Optimization:**
   - **Wajib** menggunakan komponen `next/image` untuk seluruh poster, galeri, dan *merch*.
   - *Placeholder:* Gunakan opsi `placeholder="blur"` untuk mencegah *Cumulative Layout Shift* (CLS).
   - Format: Secara otomatis *Next.js* akan mengubah *output* gambar JPG/PNG ke **WebP** sesuai kemampuan browser pengunjung.
2. **Lazy Loading Komponen Bawah (Below The Fold):**
   Gunakan fitur `next/dynamic` untuk mengimpor komponen interaktif berat yang tidak langsung terlihat di layar awal. Contoh: *Video Player Embed* atau *Peta Interaktif (Google Maps)* hanya dimuat saat pengunjung menggulir (*scroll*) ke bawah.
3. **Font Optimization:**
   Gunakan `next/font` (Google Fonts) agar *file font* diunduh dan diinang secara lokal (*self-hosted* secara otomatis) selama proses *build*, menghilangkan *network roundtrip* tambahan ke server Google saat halaman dimuat.

---

## 💾 Optimasi Database & Caching

1. **Database Indexing:**
   Kolom-kolom di PostgreSQL (Self-Hosted VPS) PostgreSQL yang sering dijadikan parameter pencarian atau filter **wajib** diberi indeks (`CREATE INDEX`). Contoh: kolom `slug` pada tabel `Events`, `category` pada `News`, dan `user_id` pada `Orders`.
2. **Data Caching Layer (React / Next.js `unstable_cache`):**
   Kueri ke PostgreSQL (Self-Hosted VPS) untuk mendapatkan daftar wilayah, kategori, atau konfigurasi sistem yang tidak berubah harus dibungkus dengan metode *cache* Next.js, agar tidak membuat koneksi ke *database* berulang-ulang untuk *request* yang sama.
3. **Connection Pooling:**
   Jika trafik (*traffic*) sangat tinggi, aplikasi harus mengakses *database* melalui port *Connection Pooling* (seperti PgBouncer bawaan PostgreSQL (Self-Hosted VPS)) alih-alih port TCP langsung, demi mencegah matinya *database* akibat kehabisan kuota koneksi (sering terjadi saat arsitektur *Serverless/Edge*).

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

- [x] Pemisahan rute untuk SSG, ISR, dan SSR terpetakan jelas.
- [x] Kewajiban penggunaan `next/image` dan `next/font` diatur.
- [x] Konsep penambahan Indeks pada Database disertakan.
- [ ] Validasi *Bundle Size Analyzer* saat proses *build* di pipeline CI/CD (diatur saat pengembangan).

---

## 📝 Catatan

- Jika aplikasi *frontend* di- *hosting* di VPS mandiri secara tradisional (Node.js/PM2), fitur "Image Optimization" Next.js akan membebani CPU VPS. Pertimbangkan menaikkan RAM/CPU VPS atau mendelegasikan optimasi gambar ke layanan CDN pihak ketiga.

---

## 💡 Best Practice

- **Hindari Moment.js:** Untuk aplikasi berkinerja tinggi, dilarang menggunakan pustaka manipulasi tanggal (*date parser*) raksasa seperti `moment.js`. Gunakan bawaan JS `Intl.DateTimeFormat` atau pustaka modern ringan seperti `date-fns` atau `dayjs`.

---

## 🏢 Enterprise Recommendation

> **Server-Driven Pagination & Filtering**
> Pada daftar berita, produk, atau sejarah event yang memuat ribuan baris, jangan pernah mengirim seluruh data (*fetch all*) lalu memfilternya di browser klien menggunakan JavaScript. Paginasi dan *filtering* harus diselesaikan di sisi *database/server* (limit & offset), sehingga ukuran *payload* JSON yang dikirimkan ke *browser* pengguna tetap sangat kecil dan stabil (O(1)).

---

## 🚀 Future Improvement

- **CDN Edge Caching penuh:** Jika web akhirnya berpindah dari VPS ke layanan seperti Vercel atau Cloudflare Pages, atur *Cache-Control headers* secara ketat agar halaman didistribusikan ke ratusan *Edge Node* di seluruh dunia, membuat *latency* halaman statis mendekati nol bagi seluruh pengunjung terlepas dari lokasi geografis.
- **Service Workers (PWA):** Menambahkan kapabilitas *Progressive Web App* agar aset *website* dapat di- *cache* di penyimpanan luring (*offline*) peramban pengguna, membuat muatan halaman kunjungan kedua (dan seterusnya) menjadi instan.

---

<div align="center">

⬅️ [Kembali ke 19. Security](./19-security.md) · ➡️ [Lanjut ke 21. Folder Structure](./21-folder-structure.md)

</div>
