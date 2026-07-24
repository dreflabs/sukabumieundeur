# 📖 Sukabumi Eundeur — Dokumentasi Proyek

> **Digital Music & Creative Ecosystem Platform**
> Dokumentasi resmi untuk perencanaan, arsitektur, dan pengembangan platform **Sukabumi Eundeur**.

[![Status](https://img.shields.io/badge/status-in--planning-yellow)]()
[![Docs](https://img.shields.io/badge/docs-25%20files-blue)]()
[![Language](https://img.shields.io/badge/language-Bahasa%20Indonesia-red)]()
[![License](https://img.shields.io/badge/license-internal--use--only-lightgrey)]()

---

## 📌 Daftar Isi

- [Tentang Dokumen Ini](#-tentang-dokumen-ini)
- [Apa itu Sukabumi Eundeur?](#-apa-itu-sukabumi-eundeur)
- [Visi Produk](#-visi-produk)
- [Referensi Inspirasi](#-referensi-inspirasi)
- [Tech Stack](#-tech-stack)
- [Struktur Dokumentasi](#-struktur-dokumentasi)
- [Peta Navigasi Dokumen](#-peta-navigasi-dokumen)
- [Cara Membaca Dokumentasi Ini](#-cara-membaca-dokumentasi-ini)
- [Status Pengerjaan Dokumen](#-status-pengerjaan-dokumen)
- [Konvensi Penulisan](#-konvensi-penulisan)
- [Audiens Dokumen](#-audiens-dokumen)
- [Kontribusi &amp; Maintenance](#-kontribusi--maintenance)
- [Catatan Penting](#-catatan-penting)

---

## 🎯 Tentang Dokumen Ini

Folder `docs/` ini merupakan **single source of truth (SSOT)** untuk seluruh perencanaan produk, arsitektur sistem, dan strategi pengembangan platform **Sukabumi Eundeur**.

Dokumentasi ini disusun agar:

- Developer baru dapat memahami keseluruhan sistem hanya dengan membaca folder `docs/`.
- Product Manager dan Stakeholder memiliki acuan yang jelas terhadap ruang lingkup produk.
- Tim Design, Engineering, QA, dan DevOps memiliki referensi yang konsisten.
- Proses onboarding tim baru menjadi lebih cepat dan terstandarisasi.
- Keputusan teknis dan bisnis terdokumentasi secara formal dan dapat ditelusuri (traceable).

> **Callout — Penting**
> Dokumentasi ini adalah dokumen **perencanaan (planning)**, bukan dokumentasi implementasi kode. Tidak ada kode program, schema SQL final, maupun konfigurasi teknis final di dalam dokumen ini. Fokus dokumen adalah **apa** yang akan dibangun dan **mengapa**, sebagai dasar sebelum masuk ke tahap **bagaimana** (development).

---

## 🎪 Apa itu Sukabumi Eundeur?

**Sukabumi Eundeur** bukan sekadar website informasi acara musik. Platform ini dirancang sebagai **ekosistem digital musik dan kreatif** yang menaungi:

| Domain                     | Deskripsi Singkat                                                 |
| -------------------------- | ----------------------------------------------------------------- |
| 🎫**Event & Ticketing**    | Penyelenggaraan festival musik, penjualan tiket, check-in digital |
| 🛍️**Merchandise Store**    | E-commerce resmi untuk produk official festival                   |
| 📰**News Portal**          | Media pemberitaan seputar musik, event, dan komunitas lokal       |
| 👥**Community Platform**   | Ruang interaksi komunitas musik dan kreatif Sukabumi              |
| 🎤**Artist Platform**      | Profil, riwayat performa, dan galeri artis/musisi                 |
| 🤝**Sponsor Platform**     | Manajemen kemitraan sponsor dan media partner                     |
| 🖼️**Media Gallery**        | Dokumentasi visual seluruh rangkaian acara                        |
| 🕰️**History Event**        | Arsip resmi seluruh penyelenggaraan event dari masa ke masa       |
| 🏢**Organization Profile** | Profil resmi penyelenggara, visi, misi, dan tim                   |
| ⚙️**CMS (Super Admin)**    | Sistem manajemen konten terpusat untuk seluruh platform           |

Filosofi produk ini setara dengan platform festival musik kelas dunia seperti **Hellfest**, **Wacken Open Air**, **Download Festival**, dan **Knotfest** — namun dengan **identitas lokal Sukabumi** yang kuat, dan dirancang agar dapat **berkembang menjadi platform berskala nasional** di masa depan.

---

## 🧭 Visi Produk

> Menjadikan **Sukabumi Eundeur** sebagai pusat ekosistem digital musik dan kreatif berbasis komunitas lokal, yang mampu bertransformasi menjadi rujukan platform festival musik berskala nasional, dengan standar teknologi, keamanan, dan pengalaman pengguna setara platform kelas dunia.

Detail lengkap visi, misi, dan tujuan bisnis dijabarkan pada dokumen [`02-business-requirements.md`](./02-business-requirements.md).

---

## 🌍 Referensi Inspirasi

Platform ini mengambil inspirasi model bisnis dan pengalaman digital dari:

- **Hellfest** (Prancis) — Ekosistem festival dengan brand identity yang kuat
- **Wacken Open Air** (Jerman) — Digital ticketing & community engagement
- **Download Festival** (Inggris) — News portal & artist platform terintegrasi
- **Knotfest** (Global, oleh Slipknot) — Merchandise ecosystem & media gallery

Sukabumi Eundeur mengadaptasi pola-pola tersebut dengan konteks lokal, budaya, dan skena musik Sukabumi, sekaligus mempersiapkan fondasi arsitektur agar dapat berkembang ke skala nasional tanpa perlu re-arsitektur besar (_future-proof architecture_).

---

## 🛠️ Tech Stack

| Layer                | Teknologi                                        |
| -------------------- | ------------------------------------------------ |
| Frontend Framework   | **Next.js 16** (App Router)                      |
| UI Library           | **React 19**                                     |
| Bahasa Pemrograman   | **TypeScript**                                   |
| Styling              | **Tailwind CSS v4**                              |
| Backend as a Service | **PostgreSQL (Self-Hosted VPS)** (Auth, Database, Storage, Realtime) |
| Database             | **PostgreSQL**                                   |
| File Storage         | **MinIO / Local VPS Storage**                             |
| Version Control      | **GitHub** (`git@github.com:dreflabs/sukabumieundeur.git`) |
| Hosting/Deployment   | **VPS (Self-managed)**                           |

> **Catatan**
> Detail arsitektur teknis, alasan pemilihan stack, serta pertimbangan skalabilitas dijelaskan lebih lanjut pada [`03-system-requirements.md`](./03-system-requirements.md) dan [`21-folder-structure.md`](./21-folder-structure.md).

---

## 🗂️ Struktur Dokumentasi

```
docs/
├── README.md                      → Dokumen ini (indeks utama)
├── 01-project-overview.md         → Gambaran umum proyek
├── 02-business-requirements.md    → Kebutuhan bisnis & tujuan strategis
├── 03-system-requirements.md      → Kebutuhan sistem & arsitektur teknis
├── 04-feature-list.md             → Daftar lengkap fitur platform
├─├── 07-information-architecture.md → Arsitektur informasi platform
├── 08-page-structure.md           → Struktur halaman & layout
├── 08-b-design-system.md         → Design system & UI component specification
├── 09-database-planning.md        → Perencanaan entitas database
├── 10-api-planning.md             → Perencanaan API & kontrak data
├── 11-cms-planning.md             → Perencanaan sistem CMS
├── 12-ticketing-system.md         → Sistem ticketing end-to-end
├── 13-merchandise-store.md        → Sistem e-commerce merchandise
├── 14-news-system.md              → Sistem news portal
├── 15-community-system.md         → Sistem komunitas & forum
├── 16-history-events.md           → Arsip & histori event
├── 17-media-gallery.md            → Sistem galeri media
├── 18-seo-strategy.md             → Strategi SEO & discoverability
├── 19-security.md                 → Strategi keamanan sistem
├── 20-performance.md              → Strategi performa & optimisasi
├── 21-folder-structure.md         → Struktur folder proyek
├── 22-development-roadmap.md      → Roadmap pengembangan
├── 23-testing-plan.md             → Rencana pengujian
├── 24-deployment-plan.md          → Rencana deployment
└── 25-future-roadmap.md           → Roadmap jangka panjang
```

---

## 🧩 Peta Navigasi Dokumen

Diagram berikut menggambarkan hubungan antar kategori dokumen dan alur logis pembacaannya:

```mermaid
flowchart TD
    A[README.md] --> B[01. Project Overview]
    B --> C[02. Business Requirements]
    C --> D[03. System Requirements]
    D --> E[04. Feature List]
    E --> F[05. User Roles]
    F --> G[06. User Flow]
    G --> H[07. Information Architecture]
    H --> I[08. Page Structure]
    I --> I2[08-B. Design System]
    I2 --> J[09. Database Planning]
    J --> K[10. API Planning]
    K --> L[11. CMS Planning]   C --> D[03. System Requirements]
    D --> E[04. Feature List]
    E --> F[05. User Roles]
    F --> G[06. User Flow]
    G --> H[07. Information Architecture]
    H --> I[08. Page Structure]

    I --> J[09. Database Planning]
    J --> K[10. API Planning]
    K --> L[11. CMS Planning]

    L --> M[12. Ticketing System]
    L --> N[13. Merchandise Store]
    L --> O[14. News System]
    L --> P[15. Community System]
    L --> Q[16. History Events]
    L --> R[17. Media Gallery]

    R --> S[18. SEO Strategy]
    S --> T[19. Security]
    T --> U[20. Performance]

    U --> V[21. Folder Structure]
    V --> W[22. Development Roadmap]
    W --> X[23. Testing Plan]
    X --> Y[24. Deployment Plan]
    Y --> Z[25. Future Roadmap]
```

---

## 📚 Cara Membaca Dokumentasi Ini

Dokumentasi ini disusun secara **berurutan dan progresif** — setiap dokumen membangun konteks dari dokumen sebelumnya. Disarankan untuk membaca sesuai kategori berikut:

### 1️⃣ Fondasi Produk & Bisnis

`01` → `02` → `03`
Memahami _apa_ produk ini, _mengapa_ dibangun, dan _bagaimana_ kebutuhan sistem secara umum.

### 2️⃣ Perencanaan Fungsional

`04` → `05` → `06` → `07` → `08`
Memahami fitur, peran pengguna, alur penggunaan, dan struktur informasi/halaman.

### 3️⃣ Perencanaan Data & Backend

`09` → `10` → `11`
Memahami entitas data, kontrak API, dan sistem manajemen konten.

### 4️⃣ Modul Fungsional Utama

`12` → `13` → `14` → `15` → `16` → `17`
Deep-dive ke setiap modul bisnis inti: ticketing, merchandise, news, community, history, gallery.

### 5️⃣ Kualitas Non-Fungsional

`18` → `19` → `20`
SEO, keamanan, dan performa sistem.

### 6️⃣ Eksekusi & Operasional

`21` → `22` → `23` → `24` → `25`
Struktur proyek, roadmap pengembangan, pengujian, deployment, dan visi jangka panjang.

> **Rekomendasi**
> Developer baru **wajib** membaca minimal kategori 1, 2, dan 6 sebelum mulai berkontribusi pada codebase.

---

## ✅ Status Pengerjaan Dokumen

| No  | Dokumen                  | Status      |
| --- | ------------------------ | ----------- |
| —   | README.md                | ✅ Selesai  |
| 01  | Project Overview         | ✅ Selesai  |
| 02  | Business Requirements    | ✅ Selesai  |
| 03  | System Requirements      | ✅ Selesai  |
| 04  | Feature List             | ✅ Selesai  |
| 05  | User Roles               | ✅ Selesai  |
| 06  | User Flow                | ✅ Selesai  |
| 07  | Information Architecture | ✅ Selesai  |
| 08  | Page Structure           | ✅ Selesai  |
| 09  | Database Planning        | ✅ Selesai  |
| 10  | API Planning             | ✅ Selesai  |
| 11  | CMS Planning             | ✅ Selesai  |
| 12  | Ticketing System         | ✅ Selesai  |
| 13  | Merchandise Store        | ✅ Selesai  |
| 14  | News System              | ✅ Selesai  |
| 15  | Community System         | ✅ Selesai  |
| 16  | History Events           | ✅ Selesai  |
| 17  | Media Gallery            | ✅ Selesai  |
| 18  | SEO Strategy             | ✅ Selesai  |
| 19  | Security                 | ✅ Selesai  |
| 20  | Performance              | ✅ Selesai  |
| 21  | Folder Structure         | ✅ Selesai  |
| 22  | Development Roadmap      | ✅ Selesai  |
| 23  | Testing Plan             | ✅ Selesai  |
| 24  | Deployment Plan          | ✅ Selesai  |
| 25  | Future Roadmap           | ✅ Selesai  |

**Legenda:** ✅ Selesai · 🔄 Dalam Proses · ⏳ Menunggu

---

## ✍️ Konvensi Penulisan

Seluruh dokumen dalam folder `docs/` mengikuti struktur standar berikut agar konsisten dan mudah dinavigasi:

- [ ] **Judul & Ringkasan** — Penjelasan singkat isi dokumen
- [ ] **Tujuan** — Alasan dokumen ini dibuat
- [ ] **Scope** — Batasan cakupan pembahasan
- [ ] **Flow** — Alur proses terkait (jika relevan)
- [ ] **Diagram** — Visualisasi menggunakan Mermaid (jika relevan)
- [ ] **Checklist** — Daftar poin yang harus dipenuhi/diperhatikan
- [ ] **Catatan** — Informasi tambahan penting
- [ ] **Best Practice** — Praktik terbaik industri terkait topik
- [ ] **Enterprise Recommendation** — Rekomendasi setara standar enterprise
- [ ] **Future Improvement** — Potensi pengembangan lanjutan

### Standar Referensi

Struktur dan gaya penulisan dokumentasi ini mengacu pada standar dokumentasi perusahaan teknologi kelas dunia, antara lain:

`Microsoft` · `Google` · `Stripe` · `Vercel` · `Linear` · `Shopify` · `Notion` · `GitLab`

### Format Umum

- Format berkas: **Markdown murni (`.md`)**
- Bahasa: **Indonesia formal**
- Diagram: **Mermaid syntax**
- Tabel: **Markdown table**
- Callout: format blockquote `>` dengan label tebal (`**Catatan**`, `**Penting**`, dsb.)

---

## 👥 Audiens Dokumen

| Peran                          | Manfaat Dokumentasi                                        |
| ------------------------------ | ---------------------------------------------------------- |
| **Product Manager**            | Memahami ruang lingkup produk & prioritas fitur            |
| **Software Architect**         | Memahami arsitektur sistem & keputusan teknis              |
| **Frontend/Backend Developer** | Memahami struktur data, API, dan alur fitur sebelum coding |
| **UI/UX Designer**             | Memahami user flow & information architecture              |
| **QA Engineer**                | Memahami skenario pengujian berdasarkan fitur              |
| **DevOps Engineer**            | Memahami strategi deployment & infrastruktur               |
| **Stakeholder/Investor**       | Memahami visi produk & roadmap jangka panjang              |

---

## 🔧 Kontribusi & Maintenance

> **Enterprise Recommendation**
> Dokumentasi ini bersifat **living document**. Setiap perubahan signifikan pada arsitektur, fitur, atau kebijakan produk **wajib** diikuti dengan pembaruan dokumen terkait, agar dokumentasi tetap menjadi sumber kebenaran tunggal (_single source of truth_).

Panduan kontribusi dokumentasi:

1. Setiap perubahan besar pada produk harus tercermin di dokumen terkait.
2. Gunakan format dan struktur yang konsisten dengan dokumen lain.
3. Diskusikan perubahan besar melalui review sebelum merge.
4. Update tabel [Status Pengerjaan Dokumen](#-status-pengerjaan-dokumen) setiap kali dokumen selesai/berubah.

---

## ⚠️ Catatan Penting

> **Perhatian**
>
> - Dokumentasi ini adalah **dokumen perencanaan**, bukan dokumentasi kode/implementasi.
> - Skema database yang dibahas bersifat **konsep entitas**, bukan SQL final.
> - Seluruh keputusan teknis final akan divalidasi kembali pada fase pengembangan aktual.
> - Dokumen ini akan terus diperbarui seiring proses discovery dan validasi kebutuhan bisnis.

---

<div align="center">
