# 14 — News & Content System

> Dokumen ini memaparkan arsitektur logika dan operasional dari **Sistem Berita (News Portal)** di platform Sukabumi Eundeur, mencakup manajemen artikel, pengelompokan (kategori & tag), peran penulis (*author*), serta mekanisme penentuan artikel terpopuler (*trending*).

---

## 📌 Daftar Isi

- [Penjelasan](#-penjelasan)
- [Tujuan](#-tujuan)
- [Scope](#-scope)
- [Flow — Siklus Editorial Berita](#-flow--siklus-editorial-berita)
- [Diagram Arsitektur News System](#-diagram-arsitektur-news-system)
- [Struktur Konten Artikel](#-struktur-konten-artikel)
- [Taksonomi (Kategori & Tag)](#-taksonomi-kategori--tag)
- [Pencarian & Kalkulasi Trending](#-pencarian--kalkulasi-trending)
- [Checklist](#-checklist)
- [Catatan](#-catatan)
- [Best Practice](#-best-practice)
- [Enterprise Recommendation](#-enterprise-recommendation)
- [Future Improvement](#-future-improvement)

---

## 🎯 Overview

Di luar masa penjualan tiket, platform festival musik membutuhkan mesin penggerak agar pengguna terus kembali berkunjung (*user retention*). **News Portal** adalah solusi utamanya. Portal berita ini akan menyajikan liputan tentang musisi lokal, pengumuman *line-up*, hingga liputan kegiatan komunitas di Sukabumi.

Sistem ini didesain agar mudah digunakan oleh tim redaksi (Jurnalis/Editor) melalui CMS, sekaligus sangat cepat diakses oleh pengguna (*SEO-optimized*) menggunakan metode *Static Site Generation* (SSG).

---

## 🎯 Objective

1. Menyediakan ruang sentral untuk publikasi rilis pers, artikel, dan berita komunitas.
2. Membangun struktur SEO (*Search Engine Optimization*) yang kuat agar Sukabumi Eundeur mendominasi pencarian terkait "Musik Sukabumi" di Google.
3. Menciptakan sistem relasional di mana sebuah artikel dapat ditautkan (*linked*) langsung ke profil Artis atau jadwal Event tertentu.
4. Mendefinisikan mekanisme alur kerja editorial (Draft -> Review -> Published).

---

## 📐 Scope

Dokumen ini mencakup:
- Struktur data artikel (Judul, Thumbnail, Rich Text).
- Pengelolaan Taksonomi (Kategori dan Tagar).
- Algoritma sederhana penentuan artikel *Trending*.
- Sistem Pencarian (Search) teks pada berita.

Dokumen ini **tidak mencakup**:
- Koding spesifik pengaturan *Rich Text Editor* di React (diurus di implementasi).
- Strategi SEO teknis (meta tag, canonical) yang dibahas khusus di `18-seo-strategy.md`.

---

## 🔄 User Flow

### Alur Processes
 Siklus Editorial Berita

Untuk menjaga kualitas publikasi, pembuatan berita mengikuti alur keredaksian standar:

1. **Drafting:** *Author* (Penulis) membuat draf artikel, mengunggah gambar, dan menulis isi berita. (Status: `Draft`).
2. **Reviewing:** *Author* mengajukan artikel. *Editor* atau *Super Admin* meninjau tata bahasa dan kesesuaian gambar. (Status: `In Review`).
3. **Publishing:** *Editor* menekan tombol *Publish*. Server (Next.js) memicu Revalidasi (ISR) agar halaman statis baru terbentuk. (Status: `Published`).
4. **Archiving (Opsional):** Berita yang sudah sangat kedaluwarsa atau tidak relevan dapat ditarik (*unpublish*). (Status: `Archived`).

---

## 🖼️ Diagram Arsitektur News System

```mermaid
flowchart TD
    subgraph CMS["CMS Editorial"]
        A[Author / Journalist] -->|Buat Draft| B(Article Editor)
        E[Chief Editor] -->|Approve & Publish| B
    end

    subgraph Database["PostgreSQL (Self-Hosted VPS)"]
        B -->|Simpan| T_Art[(Tabel: News)]
        T_Art -->|Relasi FK| T_Cat[(Tabel: Categories)]
        T_Art -->|Relasi M:N| T_Tag[(Tabel: Tags)]
    end

    subgraph Frontend["Next.js App"]
        T_Art -->|Revalidate ISR| H_Home[Homepage - Latest News]
        T_Art -->|Revalidate ISR| H_List[News Listing Page]
        T_Art -->|Revalidate ISR| H_Detail[Article Detail Page]
        
        U[Pembaca] -->|Pageview Event| T_Art
    end
    
    H_Detail --> U
```

---

## 📝 Struktur Konten Artikel

Setiap artikel (*News*) di dalam *database* harus menyimpan informasi berikut:

- **Judul (Title):** Maksimal 100 karakter.
- **Slug (URL):** URL ramah-SEO (*SEO-friendly URL*). (contoh: `pengumuman-lineup-fase-satu-2026`).
- **Thumbnail (Cover Image):** URL gambar utama resolusi tinggi (dari *Media Library*).
- **Konten (Body):** Disimpan dalam format **HTML** atau **JSON (Tiptap/Editor.js)**, bukan teks biasa (*plaintext*), agar mendukung format huruf tebal, miring, dan *embed* video.
- **Author (Penulis):** Relasi ke tabel `Users` dengan atribut nama dan foto profil.
- **Published At:** Waktu dan tanggal rilis (mendukung *Scheduled Publishing*).

---

## 🗂️ Taksonomi (Kategori & Tag)

Untuk mempermudah navigasi, sistem berita menggunakan sistem taksonomi dua lapis:

### 1. Kategori (Ketat / Strict)
Kategori bersifat hierarkis dan eksklusif (1 Artikel = 1 Kategori Utama).
*Contoh:*
- `Festival News` (Pembaruan seputar Eundeur Fest)
- `Local Scene` (Kabar band lokal)
- `Interviews` (Wawancara eksklusif)

### 2. Tags (Bebas / Fleksibel)
Tagar bersifat non-hierarkis dan plural (1 Artikel = Banyak Tags). Berguna untuk menghubungkan topik spesifik.
*Contoh:* `#Metal`, `#IndieRock`, `#RoadToEundeur`, `#InfoTiket`.

---

## 📈 Pencarian & Kalkulasi Trending

### Sistem Pencarian (Search)
- Kolom pencarian di halaman *News* akan melakukan *Full-Text Search* ke kolom `title` dan `content` pada PostgreSQL (Self-Hosted VPS) PostgreSQL.
- Pencarian didukung oleh filter berdasarkan *Kategori* dan *Rentang Tanggal*.

### Kalkulasi Trending
Alih-alih menggunakan sistem algoritma rekomendasi *machine learning* yang berat, "Artikel Trending" pada fase 1 dihitung dengan formula sederhana:
- **Parameter:** Jumlah Kunjungan Halaman (*Pageviews*).
- **Timeframe:** Dihitung berdasarkan *views* terbanyak dalam **7 hari terakhir** (bukan terbanyak sepanjang masa, agar berita lama tidak terus mendominasi).
- **Implementasi:** Next.js memanggil *Server Action* yang mengeksekusi RPC (*Remote Procedure Call*) di PostgreSQL (Self-Hosted VPS) untuk menghitung statistik *views* per artikel per pekan.

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

### Sequence Diagram — Editorial Publishing Flow

```mermaid
sequenceDiagram
    autonumber
    actor Author as Jurnalis / Admin Content
    participant CMS as CMS Editorial UI
    participant API as Next.js API Route
    participant DB as PostgreSQL (PostgreSQL (Self-Hosted VPS))
    participant CDN as Vercel / Nginx Edge Cache

    Author->>CMS: Input Artikel (Title, Excerpt, Content Markdown, Cover)
    CMS->>API: POST /api/v1/news (Status: DRAFT)
    API->>DB: INSERT INTO news_articles (status = 'DRAFT')
    DB-->>API: 201 Created (Article ID)
    API-->>CMS: Draf Tersimpan

    Author->>CMS: Klik 'Publish Artikel'
    CMS->>API: PATCH /api/v1/news/:id/publish
    API->>DB: UPDATE news_articles SET status = 'PUBLISHED', published_at = NOW()
    DB-->>API: 200 OK
    API->>CDN: Trigger On-Demand ISR Revalidation (`/news`, `/news/:slug`)
    CDN-->>API: Cache Cleared & Regenerated
    API-->>CMS: Status Artikel Live di Website Publik
```

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

- [x] Alur kerja keredaksian (Draft -> Review -> Publish) terdefinisi.
- [x] Atribut data artikel (Judul, Slug, Body, Thumbnail) lengkap.
- [x] Strategi pembagian Kategori vs Tag dijelaskan.
- [x] Logika pencarian (*Full-Text Search*) dan penentuan *Trending* dirancang.
- [ ] Memilih *Library Rich Text Editor* (misal: TipTap, Lexical) yang akan digunakan di CMS (Tugas Frontend).

---

## 📝 Catatan

- **Scheduled Publishing:** Sistem harus mendukung fitur *publish* di masa depan. Admin menyimpan status `Published` namun dengan tanggal `published_at` besok pagi jam 08:00. *Query* publik (di *Frontend*) wajib memiliki filter `WHERE published_at <= NOW()`.

---

## 💡 Best Practice

- **Relasi Entitas Terkait (Related Entities):** Jangan menulis nama artis secara manual jika artis tersebut akan tampil di Eundeur. Sediakan relasi (kolom *Foreign Key* atau relasi JSON) pada artikel yang mengarah ke tabel `Artists`. Sehingga, di bagian bawah berita, sistem otomatis memunculkan blok *"Lihat Profil Artis: [Nama Artis]"*.
- **Oversized Images:** Pastikan gambar di dalam konten (Body) menggunakan sistem komponen `next/image` agar otomatis di-*resize* dan dikonversi ke WebP, menjaga skor *LCP (Largest Contentful Paint)* tetap hijau.

---

## 🏢 Enterprise Recommendation

> **Headless CMS Approach**
> Arsitektur News System ini menggunakan pola *Headless CMS*. Artinya, *Frontend* web publik benar-benar terpisah dari panel keredaksian. Di masa mendatang, konten berita ini bisa ditarik secara bebas oleh aplikasi *Mobile App* native iOS/Android, atau bahkan ditampilkan di layar *digital signage* di *venue* acara hanya dengan memanggil API GraphQL/REST yang sama tanpa mengubah struktur *database*.

---

## 🚀 Future Improvement

- **Comment Section:** Mengaktifkan kolom komentar di bawah artikel berita khusus bagi *Member* terverifikasi, terhubung langsung dengan sistem moderasi *Community*.
- **Newsletter Automation:** Integrasi dengan sistem email pihak ketiga (misal: Resend atau Mailchimp). Setiap kali berita dengan kategori `Major Announcement` diterbitkan, sistem otomatis menyebarkan ringkasannya (HTML *email*) ke ribuan *subscriber*.
- **Content Personalization:** Memberikan tag pada profil pembaca berdasarkan berita yang sering mereka klik (misal: sering baca berita "Metal"), lalu mengubah urutan berita di beranda berdasarkan preferensi tersebut.

---

<div align="center">

⬅️ [Kembali ke 13. Merchandise Store](./13-merchandise-store.md) · ➡️ [Lanjut ke 15. Community System](./15-community-system.md)

</div>
