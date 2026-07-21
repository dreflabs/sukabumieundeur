# 18 — SEO Strategy & Discoverability

> Dokumen ini memaparkan strategi **Search Engine Optimization (SEO)** dan keterlihatan digital (*Discoverability*) untuk memastikan platform Sukabumi Eundeur mudah ditemukan oleh mesin pencari (Google) dan menarik saat dibagikan di media sosial.

---

## 📌 Daftar Isi

- [Penjelasan](#-penjelasan)
- [Tujuan](#-tujuan)
- [Scope](#-scope)
- [Flow — Peta Perayapan Mesin Pencari](#-flow--peta-perayapan-mesin-pencari)
- [Metadata & OpenGraph (Social Sharing)](#-metadata--opengraph-social-sharing)
- [Struktur URL & Canonical](#-struktur-url--canonical)
- [Schema Markup (Structured Data)](#-schema-markup-structured-data)
- [Strategi Rendering (SSG & ISR)](#-strategi-rendering-ssg--isr)
- [Sitemap & Robots.txt](#-sitemap--robotstxt)
- [Checklist](#-checklist)
- [Catatan](#-catatan)
- [Best Practice](#-best-practice)
- [Enterprise Recommendation](#-enterprise-recommendation)
- [Future Improvement](#-future-improvement)

---

## 🎯 Penjelasan

Sebagai platform informasi event dan portal berita, **keterlihatan (SEO)** adalah harga mati. Jika seseorang mengetik "Festival Musik di Sukabumi" di Google dan situs Eundeur tidak muncul di halaman pertama, platform telah kehilangan potensi konversi pembeli tiket organik.

Selain SEO konvensional (untuk Google), strategi *OpenGraph* (untuk sosial media) sangat vital agar saat tautan dibagikan di WhatsApp, Twitter (X), atau Facebook, *thumbnail* poster dan judul muncul dengan rapi.

---

## 🎯 Tujuan

1. Mencapai peringkat atas (Halaman 1) mesin pencari untuk kata kunci (*keywords*) relevan terkait skena musik Sukabumi.
2. Memastikan setiap pembagian tautan (*link sharing*) memunculkan visual *preview* yang memikat, bukan tautan teks mentah.
3. Menginstruksikan mesin pencari untuk memahami konten secara semantik (membedakan mana halaman Event, Produk, atau Artikel).
4. Menyediakan rute (*crawler path*) yang jelas melalui *Sitemap XML*.

---

## 📐 Scope

Dokumen ini mencakup:
- Strategi implementasi Metadata dinamis berbasis halaman.
- Desain *OpenGraph* (Twitter Card / WhatsApp Preview).
- Konsep dasar *Schema.org Structured Data* untuk JSON-LD.
- Manajemen indeksasi (*Robots.txt* & *Sitemap*).

Dokumen ini **tidak mencakup**:
- Riset *Keywords* atau konten *copywriting* aktual (tugas Tim *Digital Marketing* / *SEO Specialist*).

---

## 🔄 Flow — Peta Perayapan Mesin Pencari

```mermaid
flowchart LR
    A[Google Bot] -->|Cek Aturan| B(robots.txt)
    B -->|Boleh Crawl| C(sitemap.xml)
    C -->|Membaca URL| D[Halaman Berita & Event]
    D -->|Parsing HTML| E{Ada JSON-LD?}
    E -->|Ya| F[Pahami Entitas: 'Ini Event Musik!']
    E -->|Tidak| G[Membaca Teks Biasa]
    F --> H[Tampil Kaya (Rich Snippet) di Google Search]
    G --> I[Tampil Standar di Google Search]
```

---

## 🪧 Metadata & OpenGraph (Social Sharing)

Next.js memiliki API Metadata yang sangat mumpuni. Setiap halaman di Sukabumi Eundeur **wajib** memiliki konfigurasi *generateMetadata*.

### Parameter Wajib per Halaman (Dinamis):
1. **Title:** Berformat `[Nama Halaman / Judul Artikel] | Sukabumi Eundeur`. (contoh: *"Eundeur Fest 2026 Phase 1 Lineup | Sukabumi Eundeur"*).
2. **Description:** Ringkasan 150-160 karakter untuk Google.
3. **OpenGraph Image (`og:image`):** Gambar dengan rasio `1.91:1` (idealnya `1200x630 px`).
    - *Halaman Event:* Menggunakan poster event lanskap.
    - *Halaman Berita:* Menggunakan sampul berita.
    - *Halaman Merch:* Menggunakan foto produk.

---

## 🔗 Struktur URL & Canonical

- **Bersih & Deskriptif (Slug):**
  Hindari URL berbasis ID seperti `/event/view?id=9912`. Selalu gunakan *slug* ramah-SEO: `/events/eundeur-fest-2026`.
- **Canonical Tags (`rel="canonical"`):**
  Mencegah penalti konten duplikat (*duplicate content*). Jika sebuah berita dapat diakses via `/news/festival/batal` dan `/news/batal`, sistem harus menunjuk salah satu sebagai URL utama melalui *tag canonical*.

---

## 🧱 Schema Markup (Structured Data)

Menggunakan standar format `JSON-LD` (diinjeksikan ke dalam tag `<head>`) untuk memberi tahu mesin pencari mengenai konteks data.

1. **Halaman Hometage (Organisasi):** Menggunakan schema `Organization` & `WebSite`.
2. **Halaman Daftar Event:** Menggunakan schema `Event`. Jika event akan datang, Google sering kali menampilkan tanggal event langsung di halaman pencariannya (*Rich Snippet*).
3. **Halaman Berita:** Menggunakan schema `NewsArticle`.
4. **Halaman Merchandise:** Menggunakan schema `Product` (mendeklarasikan Harga, Stok, dan Rating).

---

## ⚡ Strategi Rendering (SSG & ISR)

SEO sangat bergantung pada performa (skor *Core Web Vitals*).
- Halaman Publik (Beranda, News, Artist, History) akan dirender di server saat *build time* (SSG) dan diperbarui di latar belakang menggunakan ISR (*Incremental Static Regeneration*).
- Dengan ISR, robot Google (Googlebot) akan selalu menerima respons HTML murni dalam hitungan milidetik, tanpa perlu menjalankan *JavaScript* klien atau menunggu *query database* selesai. Kecepatan muat (TTFB) ini adalah faktor kunci ranking SEO.

---

## 🗺️ Sitemap & Robots.txt

- **sitemap.xml:** Di-*generate* secara dinamis oleh rute Next.js (bukan file statis). Sitemap ini me- *looping* seluruh baris di *database* tabel (Event, News, Product, Artist) agar setiap penambahan entitas baru otomatis terdaftar di sitemap. Sitemap ini dibagi menjadi: `/sitemap/events.xml`, `/sitemap/news.xml` (Sitemap Index) agar mudah di- *crawl*.
- **robots.txt:** 
  - `Allow: /` (Izinkan perayapan ke seluruh halaman publik).
  - `Disallow: /admin/*` (Larang keras mesin pencari mengindeks halaman CMS).
  - `Disallow: /account/*` (Larang akses area dasbor pribadi).

---

## ✅ Checklist

- [x] Rencana Metadata & OpenGraph dinamis terdefinisi.
- [x] Struktur URL ramah SEO (Slug) dipastikan.
- [x] Penggunaan *JSON-LD Schema Markup* untuk Event, Artikel, dan Produk direncanakan.
- [x] Logika *Dynamic Sitemap* dan aturan *robots.txt* terpetakan.
- [ ] Daftarkan properti web ke **Google Search Console** segera setelah web *Go-Live*.

---

## 📝 Catatan

- **Halaman Error (404):** Jangan meremehkan desain halaman "Not Found" (`not-found.tsx`). Halaman 404 yang baik harus menyediakan kotak pencarian (*Search*) dan tombol "Kembali ke Beranda" untuk menjaga pengguna (dan Googlebot) tidak keluar (*bounce*) dari website.

---

## 💡 Best Practice

- **Dynamic OG Image Generation:** Menggunakan fitur `next/og` (Edge Runtime) untuk membuat gambar *thumbnail OpenGraph* secara otomatis dan dinamis (*on-the-fly*). Misalnya: merangkai teks Judul Artikel secara otomatis di atas sebuah *template banner*, sehingga Editor CMS tidak perlu membuat *banner* secara manual di Photoshop untuk setiap berita kecil.

---

## 🏢 Enterprise Recommendation

> **Programmatic SEO**
> Untuk memenangkan pencarian hiper-lokal, perusahaan *enterprise* (seperti platform *travel* atau tiket nasional) menggunakan SEO terprogram. Sukabumi Eundeur bisa menerapkannya dengan membuat ratusan halaman statis berbasis data, misalnya: direktori `/artis/genre/[genre-name]` (contoh: *"Artis Metal Sukabumi"*). Halaman ini otomatis ter-*generate* dan akan menjadi umpan SEO yang masif untuk kata kunci ekor panjang (*Long-tail Keywords*).

---

## 🚀 Future Improvement

- **AMP (Accelerated Mobile Pages):** Walau kepopulerannya menurun, untuk platform portal berita murni, menyediakan versi AMP dapat meningkatkan probabilitas masuk ke Google Discover (kartu berita di halaman depan Google Chrome Mobile).
- **International SEO (Hreflang):** Jika kelak Sukabumi Eundeur menargetkan penonton asing dan menerjemahkan situs ke Bahasa Inggris, implementasi `hreflang` tag harus diterapkan untuk memisahkan hasil pencarian lokal dan internasional.

---

<div align="center">

⬅️ [Kembali ke 17. Media Gallery](./17-media-gallery.md) · ➡️ [Lanjut ke 19. Security](./19-security.md)

</div>
