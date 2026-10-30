const doorScreen = document.getElementById("doorScreen");
const videoScreen = document.getElementById("videoScreen");
const openButton = document.getElementById("openButton");
const video = document.getElementById("entranceVideo");
const invitation = document.getElementById("invitation");
const videoHint = document.getElementById("videoHint");

const slides = Array.from(document.querySelectorAll(".slide"));
const dots = Array.from(document.querySelectorAll(".dot"));
const slideCounter = document.getElementById("slideCounter");

let currentSlide = 0;
let cardShown = false;
let touchStartX = 0;
let touchStartY = 0;

const SHOW_CARD_AT = 9;
const EVENT_DATE = new Date("2026-12-28T20:00:00+05:30");

/* Door tap: start video with its original audio */
openButton.addEventListener("click", async () => {
  doorScreen.classList.add("hidden");
  videoScreen.classList.remove("hidden");

  video.muted = false;
  video.volume = 1;
  video.currentTime = 0;

  try {
    await video.play();
    videoHint.classList.add("hidden");
  } catch (error) {
    videoHint.textContent = "Tap to play entrance video";
    videoHint.classList.remove("hidden");

    videoScreen.addEventListener("click", async () => {
      try {
        await video.play();
        videoHint.classList.add("hidden");
      } catch (e) {
        videoHint.textContent = "Unable to play video. Please check video format.";
      }
    }, { once: true });
  }
});

/* Show invitation at exactly 9 seconds */
function revealInvitation() {
  if (cardShown) return;

  cardShown = true;
  invitation.classList.remove("hidden");
  showSlide(0);
}

video.addEventListener("timeupdate", () => {
  if (video.currentTime >= SHOW_CARD_AT) {
    revealInvitation();
  }
});

/* Fallback in case timeupdate is delayed */
video.addEventListener("ended", () => {
  revealInvitation();
});

/* Slide navigation */
function showSlide(index) {
  currentSlide = Math.max(0, Math.min(index, slides.length - 1));

  slides.forEach((slide, i) => {
    slide.classList.toggle("active", i === currentSlide);
  });

  dots.forEach((dot, i) => {
    dot.classList.toggle("active", i === currentSlide);
  });

  slideCounter.textContent =
    String(currentSlide + 1).padStart(2, "0") + " / 04";
}

document.getElementById("prevButton").addEventListener("click", () => {
  showSlide(currentSlide - 1);
});

document.getElementById("nextButton").addEventListener("click", () => {
  showSlide(currentSlide + 1);
});

dots.forEach(dot => {
  dot.addEventListener("click", () => {
    showSlide(Number(dot.dataset.slide));
  });
});

/* Swipe support for iPhone and Android */
invitation.addEventListener("touchstart", event => {
  touchStartX = event.changedTouches[0].screenX;
  touchStartY = event.changedTouches[0].screenY;
}, { passive: true });

invitation.addEventListener("touchend", event => {
  const endX = event.changedTouches[0].screenX;
  const endY = event.changedTouches[0].screenY;
  const diffX = endX - touchStartX;
  const diffY = endY - touchStartY;

  if (Math.abs(diffX) > 50 && Math.abs(diffX) > Math.abs(diffY)) {
    if (diffX < 0) {
      showSlide(currentSlide + 1);
    } else {
      showSlide(currentSlide - 1);
    }
  }
}, { passive: true });

/* Live countdown */
function updateCountdown() {
  const now = new Date();
  let remaining = EVENT_DATE.getTime() - now.getTime();

  if (remaining < 0) remaining = 0;

  const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
  const hours = Math.floor((remaining / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((remaining / (1000 * 60)) % 60);
  const seconds = Math.floor((remaining / 1000) % 60);

  document.getElementById("days").textContent = String(days).padStart(2, "0");
  document.getElementById("hours").textContent = String(hours).padStart(2, "0");
  document.getElementById("minutes").textContent = String(minutes).padStart(2, "0");
  document.getElementById("seconds").textContent = String(seconds).padStart(2, "0");
}

updateCountdown();
setInterval(updateCountdown, 1000);

/* Calendar event */
document.getElementById("calendarButton").addEventListener("click", () => {
  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Wedding Invitation//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    "UID:hamid-saniya-walima-20261228",
    "DTSTAMP:20261030T000000Z",
    "DTSTART:20261228T143000Z",
    "DTEND:20261228T173000Z",
    "SUMMARY:Hamid Khan & Saniya Khan - Walima Ceremony",
    "LOCATION:SONA LAWNS, Chembur, Mumbai",
    "DESCRIPTION:Walima Ceremony of Hamid Khan and Saniya Khan.",
    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\r\n");

  const blob = new Blob([icsContent], {
    type: "text/calendar;charset=utf-8"
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "Hamid-Saniya-Walima.ics";
  document.body.appendChild(link);
  link.click();
  link.remove();

  setTimeout(() => URL.revokeObjectURL(url), 3000);
});

/* Google Maps location */
document.getElementById("locationButton").addEventListener("click", () => {
  const address = "SONA LAWNS, Plot No. 340, Waman Tukaram Patil Marg, near Amar Talkies, next to Bank of Maharashtra, Shivneri Nagar, Chembur, Mumbai 400043";

  const mapsUrl =
    "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent(address);

  window.open(mapsUrl, "_blank", "noopener");
});
