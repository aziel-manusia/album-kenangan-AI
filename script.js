// =============================
// PENGATURAN WEBSITE
// =============================
// Ubah tanggal di bawah. Format: TAHUN-BULAN-TANGGALTJam:Menit:Detik
const memoryDate = "2026-08-06T09:00:00";

// Musik akan menggunakan file "musik.mp3" di folder utama.
// Browser biasanya tidak mengizinkan musik autoplay tanpa interaksi,
// jadi musik dimulai ketika tombol ♫ ditekan.

// Loader
window.addEventListener("load", () => {
  setTimeout(() => document.getElementById("loader").classList.add("hide"), 500);
});

// Smooth scroll
function scrollToSection(id) {
  document.getElementById(id).scrollIntoView({ behavior: "smooth" });
}

// Musik
const music = document.getElementById("bgMusic");
const musicBtn = document.getElementById("musicBtn");

musicBtn.addEventListener("click", async () => {
  if (music.paused) {
    try {
      await music.play();
      musicBtn.classList.add("playing");
      musicBtn.textContent = "❚❚";
    } catch (e) {
      alert("Tambahkan file musik.mp3 di folder website terlebih dahulu.");
    }
  } else {
    music.pause();
    musicBtn.classList.remove("playing");
    musicBtn.textContent = "♫";
  }
});

// Slideshow
const slides = [...document.querySelectorAll(".slide")];
const dotsContainer = document.getElementById("dots");
let currentSlide = 0;

slides.forEach((_, i) => {
  const dot = document.createElement("span");
  dot.className = "dot" + (i === 0 ? " active" : "");
  dot.addEventListener("click", () => showSlide(i));
  dotsContainer.appendChild(dot);
});

function showSlide(index) {
  currentSlide = (index + slides.length) % slides.length;
  slides.forEach((s, i) => s.classList.toggle("active", i === currentSlide));
  [...dotsContainer.children].forEach((d, i) => d.classList.toggle("active", i === currentSlide));
}

document.getElementById("prevSlide").addEventListener("click", () => showSlide(currentSlide - 1));
document.getElementById("nextSlide").addEventListener("click", () => showSlide(currentSlide + 1));

setInterval(() => showSlide(currentSlide + 1), 5000);

// Countdown
const target = new Date(memoryDate).getTime();
function updateCountdown() {
  const diff = target - Date.now();
  const safeDiff = Math.max(diff, 0);

  const days = Math.floor(safeDiff / 86400000);
  const hours = Math.floor((safeDiff % 86400000) / 3600000);
  const minutes = Math.floor((safeDiff % 3600000) / 60000);
  const seconds = Math.floor((safeDiff % 60000) / 1000);

  document.getElementById("days").textContent = String(days).padStart(2, "0");
  document.getElementById("hours").textContent = String(hours).padStart(2, "0");
  document.getElementById("minutes").textContent = String(minutes).padStart(2, "0");
  document.getElementById("seconds").textContent = String(seconds).padStart(2, "0");

  document.getElementById("targetDateText").textContent =
    "Tanggal kenangan: " +
    new Date(memoryDate).toLocaleString("id-ID", {
      dateStyle: "full",
      timeStyle: "short"
    });
}
updateCountdown();
setInterval(updateCountdown, 1000);

// Modal + zoom
const modal = document.getElementById("imageModal");
const modalImage = document.getElementById("modalImage");
const zoomableImages = document.querySelectorAll(".zoomable, .slide");
let scale = 1;
let translateX = 0;
let translateY = 0;
let startX = 0;
let startY = 0;
let dragging = false;

function updateZoom() {
  modalImage.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
}

function openModal(src, alt) {
  modal.classList.add("show");
  modal.setAttribute("aria-hidden", "false");
  modalImage.src = src;
  modalImage.alt = alt || "Foto kenangan";
  scale = 1;
  translateX = 0;
  translateY = 0;
  updateZoom();
  document.body.style.overflow = "hidden";
}

zoomableImages.forEach(img => {
  img.addEventListener("click", () => openModal(img.src, img.alt));
});

function closeModal() {
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

document.getElementById("modalClose").addEventListener("click", closeModal);
modal.addEventListener("click", e => {
  if (e.target === modal) closeModal();
});

document.getElementById("zoomIn").addEventListener("click", () => {
  scale = Math.min(scale + 0.25, 4);
  updateZoom();
});

document.getElementById("zoomOut").addEventListener("click", () => {
  scale = Math.max(scale - 0.25, 0.5);
  updateZoom();
});

document.getElementById("zoomReset").addEventListener("click", () => {
  scale = 1; translateX = 0; translateY = 0; updateZoom();
});

// Drag foto saat diperbesar
modalImage.addEventListener("pointerdown", e => {
  dragging = true;
  startX = e.clientX - translateX;
  startY = e.clientY - translateY;
  modalImage.setPointerCapture(e.pointerId);
});

modalImage.addEventListener("pointermove", e => {
  if (!dragging || scale <= 1) return;
  translateX = e.clientX - startX;
  translateY = e.clientY - startY;
  updateZoom();
});

modalImage.addEventListener("pointerup", () => dragging = false);

// Pinch/scroll zoom sederhana
modal.addEventListener("wheel", e => {
  if (!modal.classList.contains("show")) return;
  e.preventDefault();
  scale += e.deltaY < 0 ? 0.15 : -0.15;
  scale = Math.min(Math.max(scale, 0.5), 4);
  updateZoom();
}, { passive: false });

// Keyboard
document.addEventListener("keydown", e => {
  if (e.key === "Escape") closeModal();
  if (e.key === "ArrowRight") showSlide(currentSlide + 1);
  if (e.key === "ArrowLeft") showSlide(currentSlide - 1);
});

// Animasi saat masuk viewport
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add("visible");
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
