# KOMPAS.com — Mobile App (Prototype)

Prototipe aplikasi mobile KOMPAS.com: HTML/CSS/JS vanilla yang dibungkus
[Capacitor](https://capacitorjs.com/) menjadi aplikasi Android/iOS.

> Detail teknis & peta kode lengkap ada di **[ARCHITECTURE.md](ARCHITECTURE.md)**.
> Cara build APK ada di **[APK_BUILD.md](APK_BUILD.md)**.

## Struktur folder

```
app-kompas/
├── index.html              # Shell + semua markup layar (15 view)
├── styles.css              # Seluruh style aplikasi utama
├── js/                     # Logika app, dipecah per-fitur (dulu app.js)
│   ├── 01-core.js          #   selektor DOM, state, data konstanta (load PERTAMA)
│   ├── 02-shell.js … 12-extras.js   #   modul per-fitur
│   └── 99-init.js          #   pasang listener & bootstrap (load TERAKHIR)
├── assets/                 # Gambar, ikon, audio, font, mini-site "original"
│   └── original/           # Konten branded "Original" (di-load via iframe)
├── media-source/           # Video berat — TIDAK di-bundle (di-host di CDN) ⚠ gitignored
├── scripts/prepare-web.mjs # Menyalin source → dist/
├── dist/                   # Output build (di-generate) ⚠ gitignored
├── android/                # Project Android Capacitor (build/ gitignored)
├── sw.js                   # Service worker (PWA caching)
├── manifest.webmanifest    # Manifest PWA
└── capacitor.config.json
```

## Menjalankan

```sh
npm install
npm run prepare:web      # bangun dist/ dari source
# buka dist/index.html di browser untuk preview cepat
```

Build APK Android: lihat [APK_BUILD.md](APK_BUILD.md) → ringkasnya `npm run apk:debug`.

## ⚠ Konfigurasi video (CDN)

Video konten "Original" (~64 MB) **tidak lagi di-bundle** ke APK supaya ukuran
tetap kecil. File-nya ada di `media-source/` (lokal, gitignored).

Untuk mengaktifkan video:

1. Unggah `media-source/tato-dayak/*.m4v` ke CDN/hosting Anda.
2. Buka [`assets/original/original-reader.html`](assets/original/original-reader.html),
   isi konstanta `MEDIA_BASE` dengan base URL CDN tersebut.

Jika `MEDIA_BASE` kosong, slide menampilkan poster (slide 1 tetap via YouTube).

## Catatan ukuran APK

| Komponen | Sebelum | Sesudah |
|---|---|---|
| Video di bundle | ~64 MB | 0 (streaming CDN) |
| `dist/` (payload web) | 84 MB | ~23 MB |
| File yang di-track git | 2000+ (incl. node_modules) | ~90 |

Optimasi lanjutan (kompres gambar, stream audio, dll.) ada di
roadmap **[ARCHITECTURE.md → Roadmap](ARCHITECTURE.md#roadmap-langkah-berikutnya)**.
