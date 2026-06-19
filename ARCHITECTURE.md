# Arsitektur — KOMPAS Mobile App

## Teknologi

- **Frontend:** HTML + CSS + JavaScript vanilla (tanpa framework, tanpa bundler).
- **Wrapper native:** Capacitor 7 (Android & iOS).
- **PWA:** service worker (`sw.js`) + `manifest.webmanifest`.
- Saat berjalan di dalam Capacitor, service worker sengaja di-_unregister_
  (lihat `js/99-init.js`); SW hanya aktif untuk versi web/PWA.

## Pola aplikasi: single-page, banyak "view"

Aplikasi adalah satu halaman (`index.html`) berisi **15 layar/"view"** yang
disembunyikan/ditampilkan via class CSS — bukan multi-halaman. Navigasi
dikelola lewat hash routing (`syncRoute()` di `js/11-home-router.js`).

| View (class CSS)             | Fungsi pembuka              | Modul JS                |
|------------------------------|-----------------------------|-------------------------|
| `.business-view`             | `openBusinessView`          | 04-business-epaper      |
| `.epaper-view`               | `openEpaperView`            | 04-business-epaper      |
| `.original-frame-view`       | `openOriginalView`          | 05-original             |
| `.podcast-view`              | `openPodcastView`           | 06-podcast              |
| `.podcast-player-view`       | `openPodcastPlayerView`     | 06-podcast              |
| `.article-view`              | `openArticleView`           | 07-article              |
| `.appreciation-view`         | `openAppreciationView`      | 08-appreciation         |
| `.transaction-success-view`  | `openTransactionSuccess`    | 08-appreciation         |
| `.ai-chat-view`              | `openAiView`                | 09-ai-chat              |
| `.karin-answer-view`         | `openKarinAnswer`           | 09-ai-chat              |
| `.account-view`              | `openAccountView`           | 10-account-event        |
| `.account-detail-view`       | `openAccountDetail`         | 02-shell                |
| `.event-view`                | `openEventView`             | 10-account-event        |
| `.event-detail-view`         | `openEventDetailView`       | 10-account-event        |
| `.ticket-select-view`        | `openTicketSelectView`      | 10-account-event        |
| `.order-detail-view`         | `openOrderDetailView`       | 10-account-event        |

## Peta modul `js/`

`app.js` (2103 baris) dipecah menjadi file-file berurutan. Semuanya dimuat
sebagai **classic `<script>`** (bukan ES module) sehingga berbagi satu global
scope — perilaku identik dengan file tunggal sebelumnya. **Urutan wajib:**
`01-core` pertama, `99-init` terakhir.

| File                     | Isi |
|--------------------------|-----|
| `01-core.js`             | Selektor DOM, variabel state, data konstanta (fondasi) |
| `02-shell.js`            | Status bar, bottom-nav, skeleton, randomizer konten, detail akun |
| `03-comments.js`         | Sheet komentar |
| `04-business-epaper.js`  | View Business Insight & e-Paper |
| `05-original.js`         | Konten "Original" (reader iframe) |
| `06-podcast.js`          | Podcast view, audio player, TTS artikel, mini-player (PIP) |
| `07-article.js`          | View artikel |
| `08-appreciation.js`     | Apresiasi/donasi, pembayaran, transaksi, like |
| `09-ai-chat.js`          | Asisten AI "Karin" |
| `10-account-event.js`    | Akun, Event, tiket, order, login |
| `11-home-router.js`      | Home view & hash routing |
| `12-extras.js`           | Infinite-scroll Business, helper pesan AI |
| `99-init.js`             | Pasang event listener & bootstrap (TERAKHIR) |

> Jika perlu menambah/menggeser fungsi antar-modul: aman, karena semua
> deklarasi `function` ter-hoist di global scope. Yang **tidak boleh** berubah:
> `01-core` tetap pertama (deklarasi dipakai modul lain) dan `99-init` tetap
> terakhir (satu-satunya kode yang dieksekusi saat load).

## Alur build

```
source (index.html, styles.css, js/, assets/, sw.js, manifest)
   │  npm run prepare:web  (scripts/prepare-web.mjs)
   ▼
dist/                      ← webDir Capacitor (capacitor.config.json)
   │  npx cap sync android
   ▼
android/app/src/main/assets/public/
   │  ./gradlew assembleDebug
   ▼
android/app/build/outputs/apk/debug/app-debug.apk
```

`dist/`, `node_modules/`, `android/app/build/`, dan `media-source/`
semuanya **gitignored** (di-generate atau aset berat).

## Aset & media

- `assets/` — gambar, ikon, font Inter (woff2), audio podcast, dan mini-site
  `assets/original/` (HTML+CSS terpisah, di-load via iframe).
- `media-source/` — video berat yang **di-host di CDN**, tidak di-bundle.
  Lihat `media-source/README.md` dan konstanta `MEDIA_BASE`.

---

## Roadmap (langkah berikutnya)

Sudah selesai: repo hygiene (`.gitignore` + untrack), video keluar dari bundle
(streaming CDN), pemecahan `app.js` per-fitur, dokumentasi.

### Prioritas tinggi
- [ ] **Isi `MEDIA_BASE`** dengan URL CDN setelah video diunggah, lalu uji
      pemutaran di perangkat.
- [ ] **Kompres gambar:** beberapa PNG masih 1–3 MB (`tato-dayak1.png`,
      `original-tato-dayak*.png`). Konversi ke **WebP** + resize → hemat ~7–8 MB.
- [ ] **Dedupe aset:** `tato-dayak1.png`/`tato-dayak2.png` ada ganda di
      `assets/` dan `assets/original/assets/`.
- [ ] **Audio podcast** (`podcast-sample.mp3`, 3.8 MB) — stream dari CDN juga.

### Menengah
- [ ] **Pecah `styles.css`** (152 KB) per-komponen (mis. via folder `css/` +
      concat saat build). Saat ini satu file tanpa penanda section.
- [ ] **Build tooling (Vite/esbuild):** minify otomatis, hashing, code-split,
      dev server dengan hot reload. Menggantikan `prepare-web.mjs` manual.
- [ ] **Ekstrak markup view** dari `index.html` (110 KB) menjadi partial/template
      — paling rapi setelah ada build tool.

### Rendah / kebersihan
- [ ] **Bersihkan history git** (`.git` ~107 MB karena commit lama berisi
      node_modules/video). Gunakan `git filter-repo` / BFG bila perlu repo ringan.
- [ ] **Versioning rilis** & CI untuk build APK otomatis.
