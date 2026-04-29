const content = document.querySelector("#app-content");
const menuTemplate = content.innerHTML;

const pageData = {
  beranda: {
    title: "Beranda",
    eyebrow: "Kompas.com",
    description: "Kembali ke halaman utama Kompas.com.",
    state: "Arahkan pengguna ke feed berita utama, breaking news, dan kanal pilihan.",
    actions: ["Buka headline terbaru", "Lihat rekomendasi hari ini"],
  },
  login: {
    title: "Login",
    eyebrow: "Akun Kompas.com",
    description: "Masuk untuk menyimpan artikel, mengatur minat, dan menikmati fitur personal.",
    state: "Form login bisa ditempatkan di sini saat flow autentikasi sudah siap.",
    actions: ["Login dengan email", "Buat akun baru"],
  },
  membership: {
    title: "Membership KOMPAS.com Plus",
    eyebrow: "Langganan",
    description: "Nikmati artikel eksklusif, analisis mendalam, dan pengalaman membaca bebas iklan.",
    state: "Halaman ini bisa dipakai untuk paket, benefit, dan CTA berlangganan.",
    actions: ["Lihat paket", "Cek benefit"],
  },
  reward: {
    title: "Reward",
    eyebrow: "Paratroopers Reward",
    description: "Kumpulkan poin dari aktivitas membaca dan tukarkan dengan berbagai benefit.",
    state: "Belum ada reward aktif di akun ini.",
    actions: ["Cari reward", "Pelajari cara mendapat poin"],
  },
  voucher: {
    title: "Voucher",
    eyebrow: "Voucher Buat Kamu",
    description: "Temukan promo langganan dan penawaran khusus yang tersedia untuk akunmu.",
    state: "Belum ada voucher yang bisa digunakan saat ini.",
    actions: ["Lihat promo", "Masukkan kode voucher"],
  },
  riwayat: {
    title: "Riwayat",
    eyebrow: "Aktivitas",
    description: "Daftar artikel yang terakhir dibaca akan tampil di halaman ini.",
    state: "Riwayat bacaan masih kosong.",
    actions: ["Mulai membaca", "Kelola riwayat"],
  },
  "konten-disimpan": {
    title: "Konten Disimpan",
    eyebrow: "Aktivitas",
    description: "Artikel yang kamu simpan akan terkumpul agar mudah dibaca lagi.",
    state: "Belum ada konten yang disimpan.",
    actions: ["Jelajahi artikel", "Buat koleksi"],
  },
  "konten-disukai": {
    title: "Konten Disukai",
    eyebrow: "Aktivitas",
    description: "Semua artikel yang kamu sukai akan muncul di sini.",
    state: "Belum ada konten yang disukai.",
    actions: ["Cari artikel menarik", "Atur minat"],
  },
  "konten-dikomentari": {
    title: "Konten Dikomentari",
    eyebrow: "Aktivitas",
    description: "Pantau diskusi dan komentar yang pernah kamu tulis.",
    state: "Belum ada komentar terbaru.",
    actions: ["Lihat diskusi populer", "Kelola komentar"],
  },
  "riwayat-transaksi": {
    title: "Riwayat Transaksi",
    eyebrow: "Transaksi",
    description: "Cek semua pembelian, langganan, dan status pembayaranmu.",
    state: "Belum ada transaksi pada akun ini.",
    actions: ["Lihat invoice", "Bantuan pembayaran"],
  },
  tiketmu: {
    title: "Tiketmu",
    eyebrow: "Transaksi",
    description: "Tiket event dan akses acara yang kamu beli akan tersedia di sini.",
    state: "Kamu belum memiliki tiket aktif.",
    actions: ["Cari event", "Riwayat tiket"],
  },
  "mode-tampilan": {
    title: "Mode Tampilan",
    eyebrow: "Pengaturan",
    description: "Pilih pengalaman baca yang paling nyaman untuk mata.",
    state: "Mode aktif saat ini: Terang.",
    actions: ["Gunakan mode terang", "Gunakan mode gelap"],
  },
  minat: {
    title: "Minat",
    eyebrow: "Pengaturan",
    description: "Atur topik favorit supaya rekomendasi artikel terasa lebih relevan.",
    state: "Pilih minimal tiga topik untuk memulai personalisasi.",
    actions: ["Politik", "Teknologi", "Olahraga", "Lifestyle"],
  },
  notifikasi: {
    title: "Notifikasi",
    eyebrow: "Pengaturan",
    description: "Kelola kabar penting, update berita, dan pengingat dari Kompas.com.",
    state: "Tidak ada notifikasi baru.",
    actions: ["Aktifkan breaking news", "Atur preferensi"],
  },
  newsletter: {
    title: "Newsletter",
    eyebrow: "Pengaturan",
    description: "Berlangganan ringkasan berita pilihan langsung ke emailmu.",
    state: "Belum ada newsletter yang dipilih.",
    actions: ["Harian Kompas.com", "Teknologi mingguan"],
  },
  masukan: {
    title: "Berikan Masukanmu",
    eyebrow: "Lainnya",
    description: "Bantu kami memahami pengalamanmu saat menggunakan Kompas.com.",
    state: "Form feedback singkat bisa ditempatkan di sini.",
    actions: ["Tulis masukan", "Laporkan kendala"],
  },
  bantuan: {
    title: "Bantuan",
    eyebrow: "Lainnya",
    description: "Temukan jawaban untuk pertanyaan umum seputar akun, membership, dan transaksi.",
    state: "Pilih topik bantuan yang kamu butuhkan.",
    actions: ["Akun", "Membership", "Pembayaran"],
  },
  "kebijakan-privasi": {
    title: "Kebijakan Privasi",
    eyebrow: "Lainnya",
    description: "Pelajari bagaimana Kompas.com mengelola data dan privasi pengguna.",
    state: "Ringkasan kebijakan dan tautan dokumen lengkap bisa ditampilkan di sini.",
    actions: ["Baca ringkasan", "Pengaturan privasi"],
  },
};

function renderMenu() {
  content.innerHTML = menuTemplate;
}

function renderPage(pageKey) {
  const page = pageData[pageKey] || pageData.beranda;

  if (pageKey === "home" || pageKey === "") {
    renderMenu();
    return;
  }

  content.innerHTML = `
    <article class="detail-page">
      <a class="back-link" href="#home" data-page="home" aria-label="Kembali ke menu">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="m15 18-6-6 6-6" />
        </svg>
        <span>Menu</span>
      </a>

      <div class="detail-hero">
        <span class="detail-eyebrow">${page.eyebrow}</span>
        <h1>${page.title}</h1>
        <p>${page.description}</p>
      </div>

      <section class="empty-state" aria-label="Status halaman">
        <span class="empty-icon"></span>
        <h2>${page.state}</h2>
      </section>

      <section class="quick-actions" aria-label="Aksi halaman">
        ${page.actions.map((action) => `<button type="button">${action}</button>`).join("")}
      </section>
    </article>
  `;

}

function renderFromHash() {
  const page = window.location.hash.replace("#", "") || "home";
  renderPage(page);
}

document.addEventListener("click", (event) => {
  const trigger = event.target.closest("[data-page]");
  if (!trigger) return;

  const page = trigger.dataset.page;
  event.preventDefault();
  window.location.hash = page === "home" ? "" : page;
  renderPage(page);
  document.querySelector(".phone-screen").scrollTo?.(0, 0);
  window.scrollTo(0, 0);
});

window.addEventListener("hashchange", renderFromHash);
renderFromHash();
