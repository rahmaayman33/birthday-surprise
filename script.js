/* =====================================================================
   CONFIG
===================================================================== */
const SITE_PASSWORD = "3102023"; // change this to update the password

/* =====================================================================
   PASSWORD GATE
===================================================================== */
const gate = document.getElementById("gate");

const gateForm = document.getElementById("gate-form");
const gateInput = document.getElementById("gate-input");
const gateError = document.getElementById("gate-error");
const envelope = document.getElementById("envelope");
const site = document.getElementById("site");
const secretLetter = document.getElementById("secret-letter");
const typewriter = document.getElementById("typewriter");
const continueBtn = document.getElementById("continue-btn");
const letterText = `Happy Birthday, My Love ❤️

كل سنة وأنت أحلى حاجة في حياتي. ❤️

أكيد مستغرب أنا عاملة كل ده ليه 😂

بس كنت عايزة أعملك مفاجأة مختلفة، حاجة كل ما تفتحه تفتكرنا وتبتسم.

كل تفصيلة هنا معمولالَك بحب، علشان أشوفك مبسوط حتى ولو بحاجة بسيطة.

يلا بقى... افتح المفاجأة واستمتع بيها، وأتمنى تفضل فاكرها دايمًا.

بحبك ❤️`;
gateForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const value = gateInput.value.trim();

  if (value === SITE_PASSWORD) {
    unlockSite();
  } else {
    showGateError();
  }
});

function showGateError() {
  gateError.classList.remove("show");
  // restart animation on repeated wrong attempts
  void gateError.offsetWidth;
  gateError.classList.add("show");
  gateInput.value = "";
  gateInput.focus();
}

function unlockSite() {
    
    playMusic(); 
    envelope.classList.add("opening");

    gateForm.style.display = "none";
    gateError.style.display = "none";

    showLetter();
    continueBtn.addEventListener("click", () => {

    secretLetter.style.display = "none";

    gate.classList.add("unlocked");

    setTimeout(() => {

        gate.style.display = "none";

        startLoading();

    },800);

});
}
/* =====================================================================
   BACKGROUND MUSIC
===================================================================== */
const music = document.getElementById("bg-music");
const musicToggle = document.getElementById("music-toggle");
let musicPausedByUser = false;
let musicPausedByVideo = false;

function playMusic() {

    if (!music.paused) return;

    music.play().catch(() => {});

    musicToggle.classList.remove("paused");
    musicToggle.setAttribute("aria-label", "Pause music");

}

function pauseMusic() {
  music.pause();
  musicToggle.classList.add("paused");
  musicToggle.setAttribute("aria-label", "Play music");
}

musicToggle.addEventListener("click", () => {
  if (music.paused) {
    musicPausedByUser = false;
    playMusic();
  } else {
    musicPausedByUser = true;
    pauseMusic();
  }
});

/* =====================================================================
   VIDEO <-> MUSIC HANDOFF
   Pause the background music whenever the video plays, and resume it
   automatically once the video pauses or ends (unless the user has
   deliberately paused the music themselves).
===================================================================== */
const videos = document.querySelectorAll(".birthday-video");

videos.forEach((video) => {

  video.addEventListener("play", () => {

    // إيقاف أي فيديو آخر
    videos.forEach((otherVideo) => {
      if (otherVideo !== video) {
        otherVideo.pause();
      }
    });

    // إيقاف الموسيقى
    if (!music.paused) {
      musicPausedByVideo = true;
      pauseMusic();
    }

  });

  video.addEventListener("pause", () => {

    const anyPlaying = [...videos].some(v => !v.paused);

    if (!anyPlaying && musicPausedByVideo && !musicPausedByUser) {
      musicPausedByVideo = false;
      playMusic();
    }

  });

  video.addEventListener("ended", () => {

    const anyPlaying = [...videos].some(v => !v.paused);

    if (!anyPlaying && musicPausedByVideo && !musicPausedByUser) {
      musicPausedByVideo = false;
      playMusic();
    }

  });

});

/* =====================================================================
   GALLERY PLACEHOLDER FALLBACK
   Until real photos are dropped into assets/photos/, show a soft
   placeholder label instead of a broken image icon.
===================================================================== */
document.querySelectorAll(".gallery-item img").forEach((img) => {
  img.addEventListener("error", () => {
    const figure = img.closest(".gallery-item");
    img.style.display = "none";
    const label = document.createElement("span");
    label.className = "gallery-placeholder-label";
    label.textContent = "Add photo: " + img.getAttribute("src").split("/").pop();
    figure.appendChild(label);
  }, { once: true });
});

/* =====================================================================
   SCROLL REVEAL for .fade-in elements
===================================================================== */
function initScrollReveal() {
  const targets = document.querySelectorAll(".fade-in");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  targets.forEach((el) => observer.observe(el));
}

/* =====================================================================
   FLOATING HEARTS — ambient canvas background
===================================================================== */
const canvas = document.getElementById("hearts-canvas");
const ctx = canvas.getContext("2d");
let hearts = [];
let canvasWidth, canvasHeight;
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function resizeCanvas() {
  canvasWidth = canvas.width = window.innerWidth;
  canvasHeight = canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function createHeart() {
  return {
    x: Math.random() * canvasWidth,
    y: canvasHeight + 40,
    size: 8 + Math.random() * 14,
    speed: 0.3 + Math.random() * 0.6,
    drift: (Math.random() - 0.5) * 0.6,
    opacity: 0.08 + Math.random() * 0.18,
    wobble: Math.random() * Math.PI * 2,
  };
}

function drawHeart(h) {
  ctx.save();
  ctx.translate(h.x, h.y);
  ctx.globalAlpha = h.opacity;
  ctx.fillStyle = "#c9436a";
  const s = h.size;
  ctx.beginPath();
  ctx.moveTo(0, s * 0.3);
  ctx.bezierCurveTo(-s / 2, -s * 0.4, -s, s * 0.2, 0, s);
  ctx.bezierCurveTo(s, s * 0.2, s / 2, -s * 0.4, 0, s * 0.3);
  ctx.fill();
  ctx.restore();
}

const HEART_COUNT = reducedMotion ? 0 : 22;
for (let i = 0; i < HEART_COUNT; i++) {
  const h = createHeart();
  h.y = Math.random() * canvasHeight; // spread initial positions
  hearts.push(h);
}

function animateHearts() {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  hearts.forEach((h) => {
    h.y -= h.speed;
    h.wobble += 0.02;
    h.x += Math.sin(h.wobble) * h.drift;
    if (h.y < -30) {
      Object.assign(h, createHeart());
    }
    drawHeart(h);
  });
  if (!reducedMotion) requestAnimationFrame(animateHearts);
}
if (!reducedMotion) requestAnimationFrame(animateHearts);
/* ================= LOADING SCREEN ================= */

const loadingScreen = document.getElementById("loading-screen");
const loadingProgress = document.getElementById("loading-progress");
const loadingText = document.getElementById("loading-text");

const loadingMessages = [

"Collecting our beautiful memories... ❤️",

"Finding our happiest moments... 💕",

"Preparing your surprise... 🎁",

"Almost there... ✨"

];

function startLoading(){

loadingScreen.classList.add("show");

let progress = 0;

let message = 0;

loadingText.innerHTML = loadingMessages[0];

const interval = setInterval(()=>{

progress += 2;

loadingProgress.style.width = progress + "%";

if(progress==25){

loadingText.innerHTML=loadingMessages[1];

}

if(progress==55){

loadingText.innerHTML=loadingMessages[2];

}

if(progress==80){

loadingText.innerHTML=loadingMessages[3];

}

if(progress>=100){

clearInterval(interval);

loadingScreen.classList.remove("show");

site.classList.add("revealed");

site.setAttribute("aria-hidden","false");

playMusic();

initScrollReveal();

}

},50);

}
function showLetter(){

secretLetter.classList.add("show");

let i=0;

const timer=setInterval(()=>{

typewriter.innerHTML+=letterText.charAt(i);

i++;

if(i>=letterText.length){

clearInterval(timer);

continueBtn.style.display="inline-block";

}

},40);

}