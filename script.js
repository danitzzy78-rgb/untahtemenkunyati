/* =========================================================
   KONFIGURASI — GANTI SESUAI DATA KAMU
   ========================================================= */
const CONFIG = {
  recipientName: "Sayangku",
  fromName: "Aku",
  birthdayDate: "2026-09-01T00:00:00+07:00",
  togetherSince: "2023-02-14",
  photoCount: 6,
  photoCaptions: [
    "Momen ini ♥",
    "Ketawa terus",
    "Tak terlupakan",
    "Favorit banget",
    "Selalu diingat",
    "Bahagia itu ini",
  ],
  letter1:
    "Hari ini adalah hari yang paling spesial, karena hari ini adalah hari lahirnya orang yang paling berarti dalam hidupku.\n\nTerima kasih sudah selalu ada, sudah bikin hari-hariku jauh lebih hangat. Aku bersyukur banget bisa mengenalmu.",
  letter2:
    "Aku doain kamu selalu sehat, selalu bahagia, dan selalu jadi versi terbaik dari dirimu sendiri.\n\nMakasih sudah jadi kamu. Selamat ulang tahun, sayangku. Aku sayang kamu, sekarang dan nanti.",
  timeline: [
    {
      date: "Awal Cerita",
      text: "Ganti dengan cerita gimana kalian pertama kali kenal.",
    },
    {
      date: "Momen Berkesan",
      text: "Ceritain satu momen yang paling kalian ingat berdua.",
    },
    { date: "Hari Ini", text: "Merayakan hari lahirmu dengan penuh syukur." },
  ],
  songs: [
    { name: "Laskar Pelangi", file: "musik/laskar-pelangi.mp3" },
    { name: "The One That Got Away", file: "musik/the-one-that-got-away.mp3" },
  ],
};

const isFuture = new Date(CONFIG.birthdayDate).getTime() > Date.now();

/* =========================================================
   SUSUN SLIDE
   ========================================================= */
let slides = [];
slides.push({ type: "lock" });
slides.push({ type: "notif" });
slides.push({ type: "gift" });
if (isFuture) slides.push({ type: "countdown" });
slides.push({ type: "greeting" });
slides.push({
  type: "letter",
  text: CONFIG.letter1,
  sign: `— ${CONFIG.fromName}, dengan sayang`,
  showCounter: true,
});
slides.push({ type: "timeline" });
for (let i = 1; i <= CONFIG.photoCount; i++)
  slides.push({ type: "photo", index: i });
slides.push({ type: "video", side: "a" });
slides.push({ type: "video", side: "b" });
slides.push({
  type: "letter",
  text: CONFIG.letter2,
  sign: `— dari ${CONFIG.fromName}, untuk kamu`,
  eyebrow: "Sebelum Ditutup",
  title: "Satu Doa Terakhir",
});
slides.push({ type: "final" });

const track = document.getElementById("track");
const progressEl = document.getElementById("progress");
let current = 0;
let typed = new Set();

/* ---------- Render helpers ---------- */
function renderSlide(s, i) {
  const el = document.createElement("div");
  el.className = "slide";
  el.dataset.index = i;

  if (s.type === "lock") {
    el.innerHTML = `<div class="slide-inner">
      <div class="lock-time" id="lock-time">--:--</div>
      <div class="lock-date" id="lock-date">-</div>
      <div class="lock-msg">Ada sesuatu untukmu, ${CONFIG.recipientName} ✦</div>
      <div class="tap-hint">sentuh layar untuk membuka</div>
    </div>`;
  } else if (s.type === "notif") {
    el.innerHTML = `<div class="slide-inner">
      <div class="eyebrow" style="margin-bottom:26px;">Notifikasi</div>
      <div class="notif-card" id="notif-card">
        <div class="notif-icon">🎁</div>
        <div style="flex:1;">
          <div class="notif-title">1 hadiah baru</div>
          <div class="notif-sub">Dari: ${CONFIG.fromName} ❤️ — tap untuk membuka</div>
        </div>
        <div class="notif-time">now</div>
      </div>
      <div class="tap-hint">ketuk notifikasinya</div>
    </div>`;
  } else if (s.type === "gift") {
    el.innerHTML = `<div class="slide-inner">
      <div class="eyebrow" style="margin-bottom:22px;">Untukmu</div>
      <div class="gift-box" id="gift-box">🎁</div>
      <div class="sub" style="margin-top:22px;">ketuk kotaknya untuk membuka</div>
    </div>`;
  } else if (s.type === "countdown") {
    el.innerHTML = `<div class="slide-inner">
      <div class="eyebrow">Menghitung Hari</div>
      <h1 class="big-title">Hari Spesialmu<br>Sudah Dekat</h1>
      <p class="sub">Semua yang indah sedang menunggu waktunya ✦</p>
      <div class="cd-row" id="cd-row">
        <div class="cd-box"><span class="num" id="cd-d">00</span><span class="lbl">Hari</span></div>
        <div class="cd-box"><span class="num" id="cd-h">00</span><span class="lbl">Jam</span></div>
        <div class="cd-box"><span class="num" id="cd-m">00</span><span class="lbl">Menit</span></div>
        <div class="cd-box"><span class="num" id="cd-s">00</span><span class="lbl">Detik</span></div>
      </div>
      <div class="tap-hint">ketuk untuk lanjut</div>
    </div>`;
  } else if (s.type === "greeting") {
    el.innerHTML = `<div class="slide-inner">
      <div class="eyebrow">Untuk Kamu</div>
      <h1 class="big-title">Selamat Ulang<br>Tahun, ${CONFIG.recipientName}</h1>
      <p class="sub">semoga hari ini penuh hal-hal baik ✦</p>
      <div class="tap-hint">ketuk untuk baca suratnya</div>
    </div>`;
  } else if (s.type === "letter") {
    el.innerHTML = `<div class="slide-inner">
      <div class="eyebrow" style="margin-bottom:14px;">${s.eyebrow || "Sebuah Surat"}</div>
      <div class="card">
        <h2 style="font-size:1.3rem;color:var(--gold-light);margin-bottom:12px;">${s.title || "Untukmu"}</h2>
        <div class="letter-body" data-fulltext="${encodeURIComponent(s.text)}" id="letter-${i}"></div>
        <div class="signature">${s.sign}</div>
      </div>
      ${
        s.showCounter
          ? `<div class="love-counter">
        <span class="n" id="days-together">0000</span>
        <span class="t">hari kita bersama,<br>dan terus bertambah</span>
      </div>`
          : ""
      }
    </div>`;
  } else if (s.type === "timeline") {
    const items = CONFIG.timeline
      .map(
        (t) => `
      <div class="t-item"><div class="t-dot">✦</div>
        <div><div class="t-date">${t.date}</div><div class="t-text">${t.text}</div></div>
      </div>`,
      )
      .join("");
    el.innerHTML = `<div class="slide-inner">
      <div class="eyebrow" style="margin-bottom:20px;">Kisah Kita</div>
      ${items}
    </div>`;
  } else if (s.type === "photo") {
    const cap =
      CONFIG.photoCaptions[(s.index - 1) % CONFIG.photoCaptions.length];
    el.innerHTML = `<div class="slide-inner">
      <div class="eyebrow" style="margin-bottom:18px;">Galeri Kenangan</div>
      <div class="polaroid">
        <div class="ph"><img src="foto/foto-${s.index}.jpg" alt="${cap}" onerror="this.parentElement.innerHTML='Ganti dengan<br>foto/foto-${s.index}.jpg'"></div>
        <div class="cap">${cap}</div>
      </div>
      <div class="photo-counter">Foto ${s.index} / ${CONFIG.photoCount}</div>
    </div>`;
  } else if (s.type === "video") {
    const label =
      s.side === "a" ? "Side A — Pesan Pertama" : "Side B — Pesan Kedua";
    const file = s.side === "a" ? "video/pesan-1.mp4" : "video/pesan-2.mp4";
    el.innerHTML = `<div class="slide-inner">
      <div class="eyebrow" style="margin-bottom:16px;">Sebuah Mixtape</div>
      <div class="cassette">
        <div class="cassette-top"><span class="cassette-label">${label}</span></div>
        <div class="reel-row"><div class="reel" id="reel-l-${s.side}"></div><div class="reel" id="reel-r-${s.side}"></div></div>
        <video controls id="video-${s.side}"><source src="${file}" type="video/mp4">Video tidak didukung.</video>
        <p class="video-note">Ganti file <code>${file}</code> dengan video aslimu.</p>
      </div>
    </div>`;
  } else if (s.type === "final") {
    el.innerHTML = `
      <canvas id="fire-canvas"></canvas>
      <div class="slide-inner" style="position:relative;z-index:2;">
        <div class="eyebrow" style="margin-bottom:14px;">Penutup</div>
        <h1 class="final-title">Happy Birthday,<br>${CONFIG.recipientName} 🎉</h1>
        <p class="sub" style="margin-top:14px;">dibuat dengan ♥ khusus untuk hari spesialmu</p>
        <button class="replay-btn" id="replay-btn">✦ Putar Ulang ✦</button>
      </div>`;
  }
  return el;
}

slides.forEach((s, i) => track.appendChild(renderSlide(s, i)));
slides.forEach((_, i) => {
  const seg = document.createElement("div");
  seg.className = "seg";
  seg.innerHTML = "<i></i>";
  progressEl.appendChild(seg);
});

/* =========================================================
   NAVIGASI (klik / tap, tanpa scroll halaman)
   ========================================================= */
function updateProgress() {
  [...progressEl.children].forEach((seg, i) => {
    seg.classList.toggle("done", i <= current);
    seg.querySelector("i").style.width = i <= current ? "100%" : "0%";
  });
}
function updateArrows() {
  document.getElementById("nav-prev").classList.toggle("hidden", current === 0);
  document
    .getElementById("nav-next")
    .classList.toggle("hidden", current === slides.length - 1);
}
function goTo(i) {
  if (i < 0 || i >= slides.length) return;
  current = i;
  track.style.transform = `translateX(-${current * 100}%)`;
  updateProgress();
  updateArrows();
  onEnter(current);
}
function next() {
  if (current < slides.length - 1) goTo(current + 1);
}
function prev() {
  if (current > 0) goTo(current - 1);
}

document.getElementById("zone-next").addEventListener("click", next);
document.getElementById("zone-prev").addEventListener("click", prev);
document.getElementById("nav-next").addEventListener("click", next);
document.getElementById("nav-prev").addEventListener("click", prev);
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") next();
  if (e.key === "ArrowLeft") prev();
});
let touchX = null;
document.getElementById("device").addEventListener("touchstart", (e) => {
  touchX = e.touches[0].clientX;
});
document.getElementById("device").addEventListener("touchend", (e) => {
  if (touchX === null) return;
  const dx = e.changedTouches[0].clientX - touchX;
  if (Math.abs(dx) > 50) {
    dx < 0 ? next() : prev();
  }
  touchX = null;
});

/* =========================================================
   PER-SLIDE BEHAVIOUR
   ========================================================= */
function onEnter(i) {
  const s = slides[i];

  if (s.type === "letter" && !typed.has(i)) {
    typed.add(i);
    const el = document.getElementById("letter-" + i);
    const text = decodeURIComponent(el.dataset.fulltext);
    let c = 0;
    el.innerHTML = '<span class="cursor-blink"></span>';
    const iv = setInterval(() => {
      c++;
      el.innerHTML =
        escapeHtml(text.slice(0, c)).replace(/\n/g, "<br>") +
        '<span class="cursor-blink"></span>';
      if (c >= text.length) {
        clearInterval(iv);
      }
    }, 18);
    if (s.showCounter) updateLoveCounter();
  }
  if (s.type === "countdown") {
    startCountdown();
  } else {
    stopCountdown();
  }
  if (s.type === "final") {
    startFireworks();
  } else {
    stopFireworks();
  }
}
function escapeHtml(str) {
  return str.replace(
    /[&<>]/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c],
  );
}

/* Lock clock */
function tickClock() {
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  const t = document.getElementById("lock-time");
  const d = document.getElementById("lock-date");
  if (t) t.textContent = `${hh}:${mm}`;
  if (d)
    d.textContent = now.toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
}
tickClock();
setInterval(tickClock, 1000 * 10);

/* Countdown */
let cdInterval = null;
function startCountdown() {
  if (cdInterval) return;
  const tick = () => {
    const diff = new Date(CONFIG.birthdayDate).getTime() - Date.now();
    if (diff <= 0) {
      stopCountdown();
      return;
    }
    const d = Math.floor(diff / 86400000),
      h = Math.floor(diff / 3600000) % 24,
      m = Math.floor(diff / 60000) % 60,
      sec = Math.floor(diff / 1000) % 60;
    const set = (id, v) => {
      const e = document.getElementById(id);
      if (e) e.textContent = String(v).padStart(2, "0");
    };
    set("cd-d", d);
    set("cd-h", h);
    set("cd-m", m);
    set("cd-s", sec);
  };
  tick();
  cdInterval = setInterval(tick, 1000);
}
function stopCountdown() {
  if (cdInterval) {
    clearInterval(cdInterval);
    cdInterval = null;
  }
}

/* Love counter */
function updateLoveCounter() {
  const el = document.getElementById("days-together");
  if (!el) return;
  const start = new Date(CONFIG.togetherSince).getTime();
  const days = Math.max(0, Math.floor((Date.now() - start) / 86400000));
  el.textContent = String(days).padStart(4, "0");
}

/* Gift open */
document.addEventListener("click", (e) => {
  const box = e.target.closest("#gift-box");
  if (box && !box.classList.contains("opened")) {
    box.classList.add("opened");
    burstConfetti();
    setTimeout(next, 550);
  }
  const notif = e.target.closest("#notif-card");
  if (notif) {
    next();
  }
  const lockMsg = e.target.closest(
    ".lock-time, .lock-date, .lock-msg, .tap-hint",
  );
  if (lockMsg && slides[current].type === "lock") {
    next();
  }
  const replay = e.target.closest("#replay-btn");
  if (replay) {
    goTo(0);
  }
});

/* Video reel spin */
document.addEventListener(
  "play",
  (e) => {
    if (e.target.tagName === "VIDEO") {
      const side = e.target.id.split("-")[1];
      document.getElementById("reel-l-" + side)?.classList.add("spin");
      document.getElementById("reel-r-" + side)?.classList.add("spin");
    }
  },
  true,
);
document.addEventListener(
  "pause",
  (e) => {
    if (e.target.tagName === "VIDEO") {
      const side = e.target.id.split("-")[1];
      document.getElementById("reel-l-" + side)?.classList.remove("spin");
      document.getElementById("reel-r-" + side)?.classList.remove("spin");
    }
  },
  true,
);

/* =========================================================
   MUSIK
   ========================================================= */
const audio = document.getElementById("audio-player");
const audioSource = document.getElementById("audio-source");
const musicBtn = document.getElementById("music-btn");
let songIdx = 0,
  musicStarted = false;

function tryStartMusic() {
  if (musicStarted) return;
  musicStarted = true;
  audio
    .play()
    .then(() => {
      musicBtn.classList.add("spin");
    })
    .catch(() => {});
}
musicBtn.addEventListener("click", (ev) => {
  ev.stopPropagation();
  if (audio.paused) {
    if (!musicStarted) {
      tryStartMusic();
      return;
    }
    audio.play();
    musicBtn.classList.add("spin");
  } else {
    audio.pause();
    musicBtn.classList.remove("spin");
  }
});
musicBtn.addEventListener("dblclick", (ev) => {
  ev.stopPropagation();
  songIdx = (songIdx + 1) % CONFIG.songs.length;
  audioSource.src = CONFIG.songs[songIdx].file;
  audio.load();
  if (musicStarted) audio.play().catch(() => {});
});
/* mulai musik begitu user pertama kali menyentuh layar (lock screen) */
document
  .getElementById("device")
  .addEventListener("click", tryStartMusic, { once: true });

/* =========================================================
   AMBIENT: bintang & kelopak
   ========================================================= */
const canvas = document.getElementById("stars");
const ctx = canvas.getContext("2d");
let stars = [];
function sizeCanvas() {
  const r = document.getElementById("device").getBoundingClientRect();
  canvas.width = r.width;
  canvas.height = r.height;
  stars = Array.from({ length: 70 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 1.2 + 0.2,
    a: Math.random(),
  }));
}
function drawStars() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#f2dfae";
  stars.forEach((s) => {
    s.a += (Math.random() - 0.5) * 0.02;
    s.a = Math.max(0.1, Math.min(1, s.a));
    ctx.globalAlpha = s.a;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.globalAlpha = 1;
  requestAnimationFrame(drawStars);
}
window.addEventListener("resize", sizeCanvas);
sizeCanvas();
drawStars();

const petalHost = document.getElementById("petals");
for (let i = 0; i < 10; i++) {
  const p = document.createElement("div");
  p.className = "petal";
  p.textContent = ["✦", "♥", "✧"][i % 3];
  p.style.left = Math.random() * 100 + "%";
  p.style.fontSize = 9 + Math.random() * 8 + "px";
  p.style.animationDuration = 9 + Math.random() * 10 + "s";
  p.style.animationDelay = Math.random() * 8 + "s";
  petalHost.appendChild(p);
}

/* =========================================================
   CONFETTI (buka kado)
   ========================================================= */
function burstConfetti() {
  const device = document.getElementById("device");
  const rect = device.getBoundingClientRect();
  const colors = ["#d8b26a", "#d99aa0", "#f2dfae"];
  for (let i = 0; i < 36; i++) {
    const c = document.createElement("div");
    const size = 5 + Math.random() * 5;
    c.style.position = "absolute";
    c.style.left = rect.width / 2 + "px";
    c.style.top = rect.height * 0.4 + "px";
    c.style.width = size + "px";
    c.style.height = size + "px";
    c.style.background = colors[i % colors.length];
    c.style.borderRadius = Math.random() > 0.5 ? "50%" : "2px";
    c.style.zIndex = 90;
    c.style.pointerEvents = "none";
    device.appendChild(c);
    const angle = Math.random() * Math.PI * 2,
      dist = 80 + Math.random() * 160;
    const dx = Math.cos(angle) * dist,
      dy = Math.sin(angle) * dist - 60;
    c.animate(
      [
        { transform: "translate(0,0) rotate(0deg)", opacity: 1 },
        {
          transform: `translate(${dx}px, ${dy + 240}px) rotate(${Math.random() * 360}deg)`,
          opacity: 0,
        },
      ],
      {
        duration: 1200 + Math.random() * 500,
        easing: "cubic-bezier(.2,.8,.3,1)",
      },
    );
    setTimeout(() => c.remove(), 1900);
  }
}

/* =========================================================
   FIREWORKS (slide penutup)
   ========================================================= */
let fireCtx = null,
  fireParticles = [],
  fireRAF = null,
  fireInterval = null;
function startFireworks() {
  const cv = document.getElementById("fire-canvas");
  if (!cv) return;
  const rect = document.getElementById("device").getBoundingClientRect();
  cv.width = rect.width;
  cv.height = rect.height;
  fireCtx = cv.getContext("2d");
  fireParticles = [];
  function launch() {
    const x = Math.random() * cv.width,
      y = cv.height * 0.3 + Math.random() * cv.height * 0.3;
    const colors = ["#d8b26a", "#f2dfae", "#d99aa0", "#ffffff"];
    const color = colors[Math.floor(Math.random() * colors.length)];
    for (let i = 0; i < 26; i++) {
      const angle = ((Math.PI * 2) / 26) * i,
        speed = 1.2 + Math.random() * 1.6;
      fireParticles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        color,
      });
    }
  }
  function frame() {
    fireCtx.clearRect(0, 0, cv.width, cv.height);
    fireParticles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.02;
      p.life -= 0.015;
      fireCtx.globalAlpha = Math.max(p.life, 0);
      fireCtx.fillStyle = p.color;
      fireCtx.beginPath();
      fireCtx.arc(p.x, p.y, 2, 0, Math.PI * 2);
      fireCtx.fill();
    });
    fireCtx.globalAlpha = 1;
    fireParticles = fireParticles.filter((p) => p.life > 0);
    fireRAF = requestAnimationFrame(frame);
  }
  launch();
  fireInterval = setInterval(launch, 1100);
  frame();
}
function stopFireworks() {
  if (fireRAF) cancelAnimationFrame(fireRAF);
  if (fireInterval) clearInterval(fireInterval);
  fireRAF = null;
  fireInterval = null;
  fireParticles = [];
}

/* Init */
updateProgress();
updateArrows();
onEnter(0);
