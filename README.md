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
├── media-source/           # Arsip video "Original" asli (tidak di-bundle) ⚠ gitignored
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

## Konten "Original" (Tato Dayak)

Reader "Original" ([assets/original/original-reader.html](assets/original/original-reader.html))
punya 9 slide:

- **Slide 1** — streaming via embed YouTube.
- **Slide 2–9** — **gambar statis JPEG** (`assets/original/assets/tato-dayak-eps-*.jpg`),
  diekstrak dari frame video aslinya (~0.6 MB total). Ringan, ikut bundle, tanpa CDN.

Dulu slide 2–9 berupa video `.m4v` (~64 MB) yang membengkakkan APK. File asli
itu kini diarsipkan di `media-source/` (gitignored) bila suatu saat ingin dipakai
lagi sebagai video.

## Catatan ukuran APK

| Komponen | Sebelum | Sesudah |
|---|---|---|
| Video di bundle | ~64 MB | 0 (diganti frame JPEG ~0.6 MB) |
| `dist/` (payload web) | 84 MB | ~23 MB |
| File yang di-track git | 2000+ (incl. node_modules) | ~90 |

Optimasi lanjutan (kompres gambar, stream audio, dll.) ada di
roadmap **[ARCHITECTURE.md → Roadmap](ARCHITECTURE.md#roadmap-langkah-berikutnya)**.
