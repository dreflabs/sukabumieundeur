 

# 06 — User Flow

> Dokumen ini menjabarkan alur interaksi pengguna (*User Flow*) dari awal hingga akhir untuk proses-proses inti di platform **Sukabumi Eundeur**, memastikan pengalaman pengguna (*User Experience*) yang logis, efisien, dan minim friksi.

---

## 📌 Daftar Isi

- [Penjelasan](#-penjelasan)
- [Tujuan](#-tujuan)
- [Scope](#-scope)
- [Flow — Peta Alur Utama](#-flow--peta-alur-utama)
- [Diagram Alur Tiket (Ticketing Flow)](#-diagram-alur-tiket-ticketing-flow)
- [Diagram Alur E-Commerce (Merchandise Flow)](#-diagram-alur-e-commerce-merchandise-flow)
- [Diagram Alur Komunitas (Community Flow)](#-diagram-alur-komunitas-community-flow)
- [Diagram Alur Manajemen (CMS Flow)](#-diagram-alur-manajemen-cms-flow)
- [Checklist](#-checklist)
- [Catatan](#-catatan)
- [Best Practice](#-best-practice)
- [Enterprise Recommendation](#-enterprise-recommendation)
- [Future Improvement](#-future-improvement)

---

## 🎯 Overview

*User Flow* adalah representasi visual langkah-demi-langkah yang dilalui oleh pengguna untuk menyelesaikan suatu tujuan spesifik di dalam platform. Dokumen ini menerjemahkan daftar fitur (dari `04-feature-list.md`) menjadi urutan tindakan interaktif.

Mengingat Sukabumi Eundeur menggabungkan fungsi portal informasi dan platform transaksional (e-commerce & ticketing), desain *flow* harus mampu mengakomodasi pengguna yang sekadar ingin membaca berita (tanpa login) maupun yang ingin melakukan pembelian (wajib login).

---

## 🎯 Objective

1. Memetakan perjalanan (*journey*) yang optimal untuk setiap *use case* utama.
2. Mengidentifikasi titik henti (*drop-off points*) atau potensi hambatan (*friction*) dalam proses checkout.
3. Menjadi acuan tim UI/UX dalam pembuatan *Wireframe* dan *Prototype*.
4. Memastikan proses *onboarding* pengguna baru berjalan mulus.

---

## 📐 Scope

Dokumen ini mencakup alur untuk 4 aktivitas utama (Core Journeys):

1. **Ticketing Flow:** Pencarian event hingga penerimaan *e-ticket*.
2. **Merchandise Flow:** Pencarian produk hingga pelacakan pesanan.
3. **Community Flow:** Interaksi pada forum dan diskusi.
4. **CMS Flow:** Alur pembuatan konten (Event) oleh Admin.

Dokumen ini **tidak mencakup**:

- Alur *edge-case* langka (misal: penanganan *error timeout payment gateway* spesifik). Hal tersebut akan ditangani pada tingkat implementasi teknis.
- Detail teknis logika *database* di setiap langkah.

---

## 🔄 User Flow

### Alur Processes
 Peta Alur Utama

Konsep dasar *user flow* di platform ini menganut prinsip **"Browsing is free, Action requires Identity"**.
Artinya, pengguna dapat berselancar (*browsing*) seluruh katalog publik tanpa harus login. Autentikasi (Sign In/Sign Up) hanya diminta (di-*prompt*) pada saat pengguna menekan tombol aksi transaksional (Beli Tiket, Tambah Keranjang, Post Forum).

```mermaid
flowchart LR
    Start([Kunjungan Web]) --> Browse[Eksplorasi (Event/Merch/News)]
    Browse --> Action{Klik Aksi?}
    Action --> |Tidak| Browse
    Action --> |Ya: Transaksional| CekAuth{Sudah Login?}
    CekAuth --> |Belum| Auth[Sign In / Sign Up]
    Auth --> Lanjut[Lanjutkan Aksi]
    CekAuth --> |Sudah| Lanjut
    Lanjut --> Selesai([Tujuan Tercapai])
```

---

## 🖼️ Diagram Alur Tiket (Ticketing Flow)

Alur ketika seorang penonton ingin membeli tiket untuk sebuah festival musik.

```mermaid
flowchart TD
    A([Mulai: Halaman Event]) --> B[Pilih Event & Klik 'Beli Tiket']
    B --> C{Sudah Login?}
    C --> |Belum| D[Login / Register]
    D --> E
    C --> |Sudah| E[Pilih Kategori & Jumlah Tiket]
    E --> F[Isi Form Data Pengunjung]
    F --> G[Pilih Metode Pembayaran]
    G --> H[Checkout & Terima Invoice]
    H --> I{Pembayaran Berhasil?}
    I --> |Tidak| J[Notifikasi Gagal / Kadaluarsa]
    I --> |Ya| K[Notifikasi Sukses]
    K --> L[E-Ticket (QR) Terbit di Dashboard/Email]
    L --> M([Selesai])
```

---

## 🖼️ Diagram Alur E-Commerce (Merchandise Flow)

Alur ketika pengguna berbelanja produk *merchandise* resmi.

```mermaid
flowchart TD
    A([Mulai: Halaman Merch]) --> B[Pilih Kategori/Produk]
    B --> C[Lihat Detail (Ukuran, Warna, Stok)]
    C --> D[Klik 'Tambah ke Keranjang']
    D --> E[Buka Keranjang & Klik 'Checkout']
    E --> F{Sudah Login?}
    F --> |Belum| G[Login / Register]
    G --> H
    F --> |Sudah| H[Isi/Pilih Alamat Pengiriman]
    H --> I[Pilih Kurir & Metode Pembayaran]
    I --> J[Checkout & Bayar]
    J --> K{Pembayaran Berhasil?}
    K --> |Ya| L[Pesanan Masuk ke Antrean (Processing)]
    L --> M[Admin Kirim Barang -> Status 'Shipped']
    M --> N[Barang Diterima -> Status 'Delivered']
    N --> O([Selesai: Bisa Beri Review])
```

---

## 🖼️ Diagram Alur Komunitas (Community Flow)

Alur ketika pengguna berinteraksi dalam ekosistem forum komunitas.

```mermaid
flowchart TD
    A([Mulai: Halaman Forum]) --> B[Lihat Daftar Topik Diskusi]
    B --> C[Klik 'Buat Topik' atau 'Balas']
    C --> D{Sudah Login?}
    D --> |Belum| E[Login / Register]
    E --> F
    D --> |Sudah| F{Akun Terverifikasi?}
    F --> |Belum| G[Minta Verifikasi Email/No HP]
    F --> |Sudah| H[Tulis Konten (Teks/Gambar)]
    H --> I[Klik 'Publish']
    I --> J{Melanggar Kata Kasar?}
    J --> |Ya| K[Gagal Publish / Masuk Moderasi]
    J --> |Tidak| L[Konten Tayang Publik]
    L --> M([Selesai])
```

---

## 🖼️ Diagram Alur Manajemen (CMS Flow)

Alur internal bagi **Event Manager** saat membuat jadwal dan publikasi event baru.

```mermaid
flowchart TD
    A([Mulai: Login CMS]) --> B[Masuk Menu 'Events']
    B --> C[Klik 'Create New Event']
    C --> D[Isi Detail (Nama, Deskripsi, Jadwal, Lokasi)]
    D --> E[Upload Aset Visual (Poster, Banner)]
    E --> F[Pilih / Tambah Artis (Line Up)]
    F --> G[Set Jenis & Harga Tiket]
    G --> H[Simpan sebagai Draft]
    H --> I[Review Tampilan (Preview)]
    I --> J{Sudah Sesuai?}
    J --> |Belum| D
    J --> |Sudah| K[Klik 'Publish']
    K --> L[Event Tayang di Web Publik]
    L --> M([Selesai])
```

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

- [X] Alur fundamental (*Browsing is free, Action requires Identity*) terdefinisi.
- [X] Ticketing flow mencakup *checkout*, pembayaran, dan penerbitan tiket.
- [X] Merchandise flow mencakup keranjang, ongkos kirim, dan *tracking*.
- [X] Community flow mempertimbangkan filter moderasi dan verifikasi pengguna.
- [X] CMS flow memberikan opsi *Draft* dan *Preview* sebelum publikasi.
- [ ] Memastikan dukungan API pihak ketiga (Gateway, Kurir) sejalan dengan diagram *checkout*.

---

## 📝 Catatan

- Pemisahan keranjang (*cart*) belanja: Keranjang untuk pembelian **Merchandise** dipisah dari keranjang **Tiket**. Tiket menggunakan konsep aliran langsung (*direct checkout flow*) untuk mencegah *booking* kursi palsu, sedangkan *merchandise* menggunakan *cart* konvensional.
- Saat proses pemesanan tiket pada event skala besar (*Ticket War*), perlu diterapkan *timer* (misalnya 15 menit) saat tiket di-*hold*. Jika melewati *timer* tanpa pembayaran, tiket otomatis kembali ke *pool* (stok).

---

## 💡 Best Practice

- **Guest Checkout / Social Login:** Untuk menekan angka *abandoned cart* (keranjang yang ditinggalkan), sediakan opsi **Social Login (Google/Apple)** agar proses pendaftaran (Sign Up) dapat selesai dalam 1 klik (tanpa harus mengisi *form* panjang).
- **Progress Indicator:** Pada alur panjang seperti *Checkout* Merch atau Tiket, selalu sediakan indikator langkah (contoh: *1. Data Diri -> 2. Pengiriman -> 3. Pembayaran*) agar pengguna mengetahui posisi mereka.

---

## 🏢 Enterprise Recommendation

> **Frictionless Onboarding**
> Platform terkemuka seperti Notion dan Linear mengadopsi pola "Magic Link" atau OTP (One-Time Password) ke WhatsApp/Email sebagai ganti kata sandi tradisional. Mempertimbangkan segmen *user* Sukabumi Eundeur yang cenderung *mobile-first*, opsi *Passwordless Login (OTP)* akan sangat mempercepat konversi pengguna.

---

## 🚀 Future Improvement

- **Guest Checkout (No-Account Buy):** Memungkinkan pembelian tiket anonim yang dikirimkan via email (tanpa membuat akun web), dengan risiko tidak ada pelacakan riwayat pesanan (hanya resi via email).
- **Abandoned Cart Recovery:** Alur email otomatis yang dikirimkan kepada pengguna jika mereka meninggalkan keranjang *merchandise* tanpa melakukan pembayaran dalam 24 jam.
- **One-Click Checkout:** Menyimpan data metode pembayaran (secara aman melalui token pihak ketiga) agar pembelian tiket event selanjutnya cukup dengan 1 klik.

---

<div align="center">

⬅️ [Kembali ke 05. User Roles](./05-user-roles.md) · ➡️ [Lanjut ke 07. Information Architecture](./07-information-architecture.md)

</div>
