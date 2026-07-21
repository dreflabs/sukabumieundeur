# 03 — System Requirements

> Dokumen ini menjabarkan kebutuhan sistem secara teknis, mencakup kebutuhan fungsional tingkat tinggi, kebutuhan non-fungsional, arsitektur sistem, rasionalisasi pemilihan teknologi, strategi environment, integrasi pihak ketiga, serta batasan teknis platform **Sukabumi Eundeur**.

---

## 📌 Daftar Isi

- [Penjelasan](#-penjelasan)
- [Tujuan](#-tujuan)
- [Scope](#-scope)
- [Kebutuhan Fungsional Tingkat Tinggi](#-kebutuhan-fungsional-tingkat-tinggi)
- [Kebutuhan Non-Fungsional](#-kebutuhan-non-fungsional)
- [Arsitektur Sistem Tingkat Tinggi](#-arsitektur-sistem-tingkat-tinggi)
- [Rasionalisasi Tech Stack](#-rasionalisasi-tech-stack)
- [Flow — Alur Request Sistem](#-flow--alur-request-sistem)
- [Diagram Arsitektur](#-diagram-arsitektur)
- [Strategi Environment](#-strategi-environment)
- [Integrasi Pihak Ketiga](#-integrasi-pihak-ketiga)
- [Infrastruktur & Hosting](#-infrastruktur--hosting)
- [Batasan Teknis (Technical Constraints)](#-batasan-teknis-technical-constraints)
- [Kepatuhan & Regulasi](#-kepatuhan--regulasi)
- [Checklist](#-checklist)
- [Catatan](#-catatan)
- [Best Practice](#-best-practice)
- [Enterprise Recommendation](#-enterprise-recommendation)
- [Future Improvement](#-future-improvement)

---

## 🎯 Penjelasan

Dokumen *System Requirements* menerjemahkan kebutuhan bisnis (lihat [`02-business-requirements.md`](./02-business-requirements.md)) menjadi **kebutuhan teknis tingkat tinggi**. Dokumen ini menjadi jembatan antara dunia bisnis dan dunia implementasi teknis, mencakup:

- Apa saja kemampuan fungsional yang harus dimiliki sistem
- Standar kualitas non-fungsional (performa, keamanan, skalabilitas)
- Bagaimana arsitektur sistem secara garis besar
- Teknologi apa yang digunakan dan mengapa
- Bagaimana sistem berinteraksi dengan pihak ketiga
- Batasan teknis yang harus diperhitungkan sejak awal

> **Catatan**
> Dokumen ini bersifat **arsitektur tingkat tinggi (high-level)**. Detail struktur folder dibahas pada [`21-folder-structure.md`](./21-folder-structure.md), detail API pada [`10-api-planning.md`](./10-api-planning.md), dan detail database pada [`09-database-planning.md`](./09-database-planning.md).

---

## 🎯 Tujuan

1. Menetapkan kebutuhan fungsional tingkat tinggi sebagai dasar perencanaan fitur detail.
2. Menetapkan standar kebutuhan non-fungsional (*performance, security, scalability, availability, maintainability, usability*).
3. Menjelaskan arsitektur sistem secara konseptual sebelum masuk ke detail implementasi.
4. Memberikan justifikasi teknis (*rationale*) atas pemilihan setiap komponen tech stack.
5. Mendefinisikan strategi environment (development, staging, production).
6. Mengidentifikasi kebutuhan integrasi pihak ketiga sejak tahap perencanaan.

---

## 📐 Scope

Dokumen ini mencakup:

- Kebutuhan fungsional & non-fungsional tingkat sistem
- Arsitektur aplikasi (frontend, backend, database, storage)
- Strategi rendering Next.js (SSR, SSG, ISR)
- Strategi environment dan deployment tingkat tinggi
- Kebutuhan integrasi eksternal (payment gateway, media sosial, maps, email)
- Batasan teknis dan regulasi yang relevan

Dokumen ini **tidak mencakup**:

- Detail schema database (lihat `09-database-planning.md`)
- Detail endpoint API (lihat `10-api-planning.md`)
- Detail struktur folder proyek (lihat `21-folder-structure.md`)
- Detail strategi deployment CI/CD (lihat `24-deployment-plan.md`)

---

## ⚙️ Kebutuhan Fungsional Tingkat Tinggi

| Kategori | Kebutuhan Fungsional |
|---|---|
| **Manajemen Konten** | Sistem harus menyediakan CMS terpusat untuk mengelola seluruh konten (event, news, artist, gallery, merchandise) |
| **Autentikasi & Otorisasi** | Sistem harus mendukung multi-role authentication (Super Admin, Editor, Organizer, Member, Guest) |
| **Ticketing** | Sistem harus mendukung pembelian tiket, validasi QR Code, dan pelacakan kehadiran |
| **E-Commerce** | Sistem harus mendukung katalog produk, checkout, dan pelacakan pesanan merchandise |
| **Media Management** | Sistem harus mendukung upload, penyimpanan, dan pengelolaan media (gambar, video) berskala besar |
| **Pencarian & Filter** | Sistem harus menyediakan pencarian dan filter untuk news, event, artist, dan produk |
| **Notifikasi** | Sistem harus dapat mengirimkan notifikasi transaksional (email konfirmasi tiket/order) |
| **Integrasi Sosial** | Sistem harus dapat menampilkan feed dari Instagram, YouTube, Spotify, dan TikTok |

> **Penting**
> Detail lengkap seluruh fitur fungsional dijabarkan pada [`04-feature-list.md`](./04-feature-list.md). Tabel di atas hanya mencerminkan kebutuhan **tingkat sistem**, bukan daftar fitur lengkap.

---

## 📊 Kebutuhan Non-Fungsional

| Aspek | Kebutuhan | Target Indikatif |
|---|---|---|
| **Performance** | Waktu muat halaman cepat, terutama halaman publik (Home, Event, News) | Largest Contentful Paint (LCP) < 2.5 detik |
| **Scalability** | Sistem mampu menangani lonjakan trafik saat event besar/penjualan tiket dibuka | Mendukung horizontal scaling di level aplikasi |
| **Availability** | Sistem tersedia secara konsisten, terutama saat periode kritis (pembukaan tiket) | Target uptime ≥ 99.5% |
| **Security** | Perlindungan data pengguna dan transaksi dari ancaman umum | Mengacu pada `19-security.md` (RBAC, RLS, enkripsi, dsb) |
| **Maintainability** | Kode terstruktur, modular, dan mudah dipelihara developer baru | Mengikuti struktur folder standar (`21-folder-structure.md`) |
| **Usability** | Antarmuka intuitif untuk pengguna umum maupun admin CMS | Desain responsif, aksesibel (WCAG dasar) |
| **Compatibility** | Kompatibel di berbagai perangkat dan browser modern | Mendukung browser modern (2 versi terakhir) & mobile responsive |
| **SEO-Friendliness** | Konten publik dapat diindeks optimal oleh mesin pencari | Mengacu pada `18-seo-strategy.md` |

---

## 🏗️ Arsitektur Sistem Tingkat Tinggi

Sukabumi Eundeur menggunakan pendekatan **Modern Jamstack-inspired Architecture** dengan kombinasi rendering hybrid (SSR/SSG/ISR) dan **Backend-as-a-Service (BaaS)** melalui Supabase.

| Layer | Komponen | Peran |
|---|---|---|
| **Presentation Layer** | Next.js 16 + React 19 + Tailwind CSS v4 | Rendering UI, routing, interaktivitas |
| **Application Layer** | Next.js Route Handlers / Server Actions | Logika bisnis sisi server, orkestrasi request |
| **Data Layer** | Supabase (PostgreSQL) | Penyimpanan data terstruktur |
| **Storage Layer** | Supabase Storage | Penyimpanan file media (gambar, dokumen, video) |
| **Auth Layer** | Supabase Auth | Autentikasi & manajemen sesi pengguna |
| **Infrastructure Layer** | VPS | Hosting aplikasi & proses deployment |
| **Version Control** | GitHub | Kolaborasi kode & CI/CD trigger |

> **Catatan**
> Pendekatan ini dipilih untuk menyeimbangkan antara **kecepatan pengembangan** (BaaS mengurangi kebutuhan membangun backend dari nol) dan **kontrol penuh atas infrastruktur** (VPS self-managed, bukan vendor-locked serverless penuh).

---

## 🧩 Rasionalisasi Tech Stack

| Teknologi | Alasan Pemilihan |
|---|---|
| **Next.js 16** | Mendukung hybrid rendering (SSR/SSG/ISR) yang esensial untuk kombinasi konten dinamis (ticketing, order) dan konten statis-SEO-friendly (news, event, artist) |
| **React 19** | Ekosistem matang, mendukung server components, performa rendering optimal |
| **TypeScript** | Type-safety mengurangi bug pada sistem kompleks dengan banyak modul (ticketing, commerce, CMS) |
| **Tailwind CSS v4** | Konsistensi desain, kecepatan pengembangan UI, ukuran bundel CSS optimal |
| **Supabase** | Menyediakan Auth, Database, Storage, dan Realtime dalam satu ekosistem terintegrasi, mempercepat pengembangan tanpa membangun backend custom penuh |
| **PostgreSQL** | Database relasional yang matang, mendukung relasi kompleks antar entitas (event, tiket, order, user) |
| **GitHub** | Standar industri untuk version control, kolaborasi tim, dan integrasi CI/CD |
| **VPS Deployment** | Kontrol penuh atas biaya dan konfigurasi server, cocok untuk fase awal dengan kebutuhan skala menengah |

---

## 🔄 Flow — Alur Request Sistem

```mermaid
flowchart LR
    U[User Browser] -->|HTTP Request| NX[Next.js Application]
    NX -->|Server Component/Action| API[Route Handler / Server Action]
    API -->|Query/Mutation| SB[Supabase]
    SB -->|Data| API
    API -->|Response/HTML/JSON| NX
    NX -->|Rendered Page| U

    SB --> DB[(PostgreSQL)]
    SB --> ST[(Supabase Storage)]
    SB --> AU[Supabase Auth]
```

---

## 🖼️ Diagram Arsitektur

```mermaid
flowchart TB
    subgraph Client["Client Layer"]
        Browser[Web Browser<br/>Desktop & Mobile]
    end

    subgraph App["Application Layer — VPS"]
        NextJS[Next.js 16 App<br/>React 19 + TypeScript + Tailwind v4]
    end

    subgraph Backend["Backend Layer — Supabase"]
        Auth[Supabase Auth]
        DB[(PostgreSQL Database)]
        Storage[(Supabase Storage)]
        Realtime[Supabase Realtime]
    end

    subgraph External["Integrasi Eksternal"]
        Payment[Payment Gateway]
        Social[Instagram / YouTube / Spotify / TikTok]
        Maps[Google Maps]
        EmailSvc[Email Service]
    end

    Browser <--> NextJS
    NextJS <--> Auth
    NextJS <--> DB
    NextJS <--> Storage
    NextJS <--> Realtime
    NextJS <--> Payment
    NextJS <--> Social
    NextJS <--> Maps
    NextJS <--> EmailSvc
```

---

## 🌐 Strategi Environment

| Environment | Fungsi | Karakteristik |
|---|---|---|
| **Development** | Pengembangan fitur oleh developer | Data dummy/mock, konfigurasi longgar untuk debugging |
| **Staging** | Pengujian sebelum rilis ke production | Mendekati kondisi production, digunakan untuk QA & UAT |
| **Production** | Lingkungan aktif digunakan pengguna nyata | Data nyata, konfigurasi keamanan penuh, monitoring aktif |

> **Best Practice**
> Setiap environment harus memiliki **instance Supabase project terpisah** (atau minimal skema/database terpisah) untuk mencegah data development/staging tercampur dengan data production.

---

## 🔌 Integrasi Pihak Ketiga

| Integrasi | Fungsi | Kebutuhan |
|---|---|---|
| **Payment Gateway** | Pemrosesan pembayaran tiket & merchandise | Mendukung metode pembayaran populer di Indonesia (VA, e-wallet, QRIS) |
| **Instagram API/Embed** | Menampilkan feed sosial media resmi | Autentikasi dan rate-limit sesuai kebijakan platform |
| **YouTube API/Embed** | Menampilkan video aftermovie/dokumentasi | Embed player resmi |
| **Spotify Embed** | Menampilkan playlist/preview musik artis | Embed widget resmi Spotify |
| **TikTok Embed** | Menampilkan konten TikTok resmi | Embed widget resmi TikTok |
| **Google Maps** | Menampilkan lokasi event | API key dengan pembatasan domain (*domain restriction*) |
| **Email Service** | Notifikasi transaksional (invoice, konfirmasi order) | Layanan pengiriman email transaksional yang andal |

> **Penting**
> Pemilihan vendor spesifik (misalnya nama payment gateway atau email service tertentu) akan ditentukan pada fase evaluasi vendor, di luar scope dokumen perencanaan ini.

---

## 🖥️ Infrastruktur & Hosting

- **Model Hosting:** VPS (Virtual Private Server) — self-managed.
- **Deployment Target:** Aplikasi Next.js dijalankan pada VPS dengan proses manajemen (process manager) yang sesuai untuk aplikasi Node.js.
- **Reverse Proxy:** Direkomendasikan menggunakan reverse proxy untuk pengelolaan domain, SSL/TLS, dan load balancing dasar.
- **Backup Strategy:** Backup berkala untuk database (PostgreSQL/Supabase) dan storage media.
- **Monitoring:** Direkomendasikan penggunaan tools monitoring uptime dan resource server.

> **Catatan**
> Detail teknis konfigurasi VPS, proses deployment, dan pipeline CI/CD dijabarkan lengkap pada [`24-deployment-plan.md`](./24-deployment-plan.md).

---

## 🚧 Batasan Teknis (Technical Constraints)

- Infrastruktur awal menggunakan **VPS tunggal**, bukan arsitektur multi-server/cloud-native dari awal.
- Ketergantungan pada **Supabase** sebagai BaaS berarti batasan skalabilitas mengikuti kapasitas paket Supabase yang digunakan.
- Tidak ada dukungan native mobile app pada fase awal — seluruh akses dilakukan melalui browser (web responsive).
- Kapasitas tim pengembang pada fase awal kemungkinan terbatas (*lean team*), memengaruhi kecepatan pengembangan paralel antar modul.

---

## 📜 Kepatuhan & Regulasi

- Sistem harus mempertimbangkan kepatuhan terhadap **Undang-Undang Pelindungan Data Pribadi (UU PDP) Indonesia** dalam pengelolaan data pengguna.
- Transaksi pembayaran harus melalui payment gateway yang **berizin resmi** dan mematuhi standar keamanan transaksi (mengacu prinsip umum PCI-DSS meskipun implementasi detail di luar scope platform, karena diserahkan ke payment gateway pihak ketiga).
- Kebijakan privasi dan syarat & ketentuan platform harus tersedia dan mudah diakses pengguna.

---

## ✅ Checklist

- [x] Kebutuhan fungsional tingkat tinggi terdefinisi
- [x] Kebutuhan non-fungsional terdefinisi dengan target indikatif
- [x] Arsitektur sistem tingkat tinggi terdokumentasi
- [x] Rasionalisasi pemilihan tech stack terdokumentasi
- [x] Strategi environment terdefinisi
- [x] Kebutuhan integrasi pihak ketiga teridentifikasi
- [x] Batasan teknis dan kepatuhan regulasi terdokumentasi
- [ ] Validasi kapasitas VPS sesuai proyeksi trafik (menunggu data estimasi dari organizer)
- [ ] Pemilihan vendor payment gateway & email service final

---

## 📝 Catatan

- Dokumen ini akan menjadi acuan utama saat menyusun dokumen teknis lanjutan (`09`, `10`, `11`, `21`, `24`).
- Setiap perubahan besar pada arsitektur (misalnya migrasi dari VPS ke cloud-native) wajib memperbarui dokumen ini beserta dokumen turunannya.

---

## 💡 Best Practice

- Terapkan prinsip **Separation of Concerns** antara presentation layer (Next.js) dan data layer (Supabase) agar setiap layer dapat berkembang secara independen.
- Gunakan **Environment Variables** untuk seluruh konfigurasi sensitif (API key, database URL) — jangan pernah hardcode kredensial dalam kode sumber.
- Terapkan **Infrastructure as Code (IaC)** secara bertahap untuk konfigurasi VPS agar proses provisioning dapat direplikasi dan diaudit.

---

## 🏢 Enterprise Recommendation

> Perusahaan seperti Vercel dan Linear menerapkan **arsitektur hybrid rendering** untuk menyeimbangkan kecepatan (SEO, performa) dengan interaktivitas (dashboard, transaksi). Pendekatan serupa direkomendasikan untuk Sukabumi Eundeur: gunakan **SSG/ISR** untuk halaman publik (News, Event, Artist) dan **SSR/Client Rendering** untuk halaman transaksional (Checkout, Dashboard Admin).

Rekomendasi tambahan:

- Terapkan **Health Check Endpoint** sejak awal untuk mendukung monitoring uptime.
- Siapkan **Rollback Strategy** sederhana pada VPS (misalnya via tagging release di GitHub) sebelum sistem CI/CD penuh diimplementasikan.

---

## 🚀 Future Improvement

- Migrasi bertahap dari **VPS tunggal** ke **arsitektur multi-instance dengan load balancer** seiring pertumbuhan trafik.
- Evaluasi migrasi sebagian beban kerja ke **CDN** untuk aset statis dan media guna meningkatkan performa global.
- Evaluasi penggunaan **message queue** (misalnya untuk proses notifikasi/email asinkron) seiring kompleksitas sistem bertambah.
- Evaluasi kebutuhan **multi-region deployment** apabila platform berkembang ke skala nasional.

Detail lebih lanjut dibahas pada [`20-performance.md`](./20-performance.md) dan [`25-future-roadmap.md`](./25-future-roadmap.md).

---

<div align="center">

⬅️ [Kembali ke 02. Business Requirements](./02-business-requirements.md) · ➡️ [Lanjut ke 04. Feature List](./04-feature-list.md)

</div>
