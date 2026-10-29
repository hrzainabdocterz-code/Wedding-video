"use strict";

const doorScreen = document.getElementById("doorScreen");
const openDoorButton = document.getElementById("openDoor");
const roomScreen = document.getElementById("roomScreen");
const roomVideo = document.getElementById("roomVideo");
const invitation = document.getElementById("invitation");
const videoError = document.getElementById("videoError");

const slides = Array.from(document.querySelectorAll(".slide"));
const previousButton = document.getElementById("previousSlide");
const nextButton = document.getElementById("nextSlide");
const slideCounter = document.getElementById("slideCounter");

let currentSlide = 0;
let startX = 0;
let startY = 0;
let isOpening = false;

// Event details: 28 December 2026, 8:00 PM Mumbai time.
const eventDate = new Date("2026-12-28T20:00:00+05:30");

function showSlide(index, direction = "left") {
  if (index < 0 || index >= slides.length) return;

  currentSlide = index;

  slides.forEach((slide, i) => {
    slide.classList.toggle("active", i === currentSlide);
  });

  slideCounter.textContent =
    `${currentSlide + 1} / ${slides.length}`;

  previousButton.style.visibility =
    currentSlide === 0 ? "hidden" : "visible";

  nextButton.style.visibility =
    currentSlide === slides.length - 1 ? "hidden" : "visible";
}

previousButton.addEventListener("click", () => {
  showSlide(currentSlide - 1, "right");
});

nextButton.addEventListener("click", () => {
  showSlide(currentSlide + 1, "left");
});

// Swipe navigation, while allowing vertical scrolling within a slide.
invitation.addEventListener("touchstart", (event) => {
  const touch = event.changedTouches[0];
  startX = touch.clientX;
  startY = touch.clientY;
}, { passive: true });

invitation.addEventListener("touchend", (event) => {
  const touch = event.changedTouches[0];
  const dx = touch.clientX - startX;
  const dy = touch.clientY - startY;

  if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.2) {
    if (dx < 0) {
      showSlide(currentSlide + 1, "left");
    } else {
      showSlide(currentSlide - 1, "right");
    }
  }
}, { passive: true });

// Door tap -> play the uploaded video.
openDoorButton.addEventListener("click", async () => {
  if (isOpening) return;
  isOpening = true;
  openDoorButton.disabled = true;
  videoError.hidden = true;

  roomScreen.hidden = false;

  try {
    roomVideo.currentTime = 0;
    await roomVideo.play();

    doorScreen.classList.add("leaving");

    window.setTimeout(() => {
      doorScreen.hidden = true;
    }, 650);
  } catch (error) {
    isOpening = false;
    openDoorButton.disabled = false;

    roomScreen.hidden = true;
    videoError.hidden = false;
    videoError.textContent =
      "Video start nahi hui. Check karo ki video ka filename aur folder path sahi hai.";
  }
});

// Video ends -> retain the final frame and show the invitation.
roomVideo.addEventListener("ended", () => {
  // Do not hide the video or reset its currentTime.
  // The final video frame remains behind the card.
  invitation.hidden = false;
  showSlide(0);
});

roomVideo.addEventListener("error", () => {
  videoError.hidden = false;
  videoError.textContent =
    "Video load nahi hui. assets/videos/room-entrance.webm ka filename check karo.";
});

// Countdown timer.
function updateCountdown() {
  const remaining = Math.max(
    0,
    eventDate.getTime() - Date.now()
  );

  const totalSeconds = Math.floor(remaining / 1000);

  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  document.getElementById("days").textContent =
    String(days).padStart(2, "0");

  document.getElementById("hours").textContent =
    String(hours).padStart(2, "0");

  document.getElementById("minutes").textContent =
    String(minutes).padStart(2, "0");

  document.getElementById("seconds").textContent =
    String(seconds).padStart(2, "0");
}

updateCountdown();
window.setInterval(updateCountdown, 1000);

// Calendar event download, using the Asia/Kolkata timezone.
document.getElementById("calendarButton").addEventListener("click", () => {
  const calendarData = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Hamid and Saniya//Walima Invitation//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VTIMEZONE",
    "TZID:Asia/Kolkata",
    "BEGIN:STANDARD",
    "DTSTART:19700101T000000",
    "TZOFFSETFROM:+0530",
    "TZOFFSETTO:+0530",
    "TZNAME:IST",
    "END:STANDARD",
    "END:VTIMEZONE",
    "BEGIN:VEVENT",
    "UID:hamid-saniya-walima-20261228@wedding-invitation",
    "DTSTAMP:20261029T000000Z",
    "DTSTART;TZID=Asia/Kolkata:20261228T200000",
    "SUMMARY:Walima Ceremony - Hamid Khan & Saniya Khan",
    "LOCATION:Sona Lawns, Chembur, Mumbai",
    "DESCRIPTION:Walima Ceremony - 8:00 PM onwards",
    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\r\n");

  const blob = new Blob([calendarData], {
    type: "text/calendar;charset=utf-8"
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "Hamid-Saniya-Walima.ics";
  document.body.appendChild(link);
  link.click();
  link.remove();

  window.setTimeout(() => URL.revokeObjectURL(url), 1500);
});

// Google Maps venue button.
document.getElementById("locationButton").addEventListener("click", () => {
  const venue =
    "Sona Lawns, Plot No. 340, Waman Tukaram Patil Marg, near Amar Talkies, next to Bank of Maharashtra, Shivneri Nagar, Chembur, Mumbai 400043";

  const mapsUrl =
    "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent(venue);

  window.open(mapsUrl, "_blank", "noopener,noreferrer");
});

showSlide(0);
