# Build APK

Project ini sudah disiapkan untuk dibungkus menjadi aplikasi Android/iOS memakai Capacitor.

> **Sebelum build:** video konten "Original" tidak lagi di-bundle (di-stream dari
> CDN) agar APK kecil. Isi `MEDIA_BASE` di `assets/original/original-reader.html`
> dengan URL CDN bila video ingin tampil. Lihat
> [README.md](README.md) & [ARCHITECTURE.md](ARCHITECTURE.md).

## Android

1. Install Node.js + npm.
2. Install JDK 21. Rekomendasi paling mudah: Eclipse Temurin 21.
3. Install Android Studio, lalu install Android SDK dan Android SDK Build-Tools.
4. Pastikan Java terbaca:

```sh
java -version
/usr/libexec/java_home -V
```

5. Dari folder project ini, jalankan:

```sh
npm install
npm run cap:add:android
npm run apk:debug
```

APK debug akan muncul di:

```text
android/app/build/outputs/apk/debug/app-debug.apk
```

Untuk build berikutnya cukup jalankan:

```sh
npm run apk:debug
```

Jika muncul error `Unable to locate a Java Runtime`, berarti JDK belum terinstall atau `JAVA_HOME` belum terbaca oleh terminal.

Jika muncul error `invalid source release: 21`, berarti Java yang aktif masih di bawah JDK 21. Install JDK 21, buka Terminal baru, lalu cek lagi dengan `java -version`.

## iOS

Butuh Xcode lengkap, bukan hanya Command Line Tools.

```sh
npm install
npm run cap:add:ios
npm run cap:sync:ios
npx cap open ios
```
