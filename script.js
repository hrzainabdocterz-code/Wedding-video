/* =========================================
   HAMID & SANIYA — WEDDING INVITATION
========================================= */

document.addEventListener("DOMContentLoaded", function () {

  const doorScreen = document.getElementById("doorScreen");
  const roomScreen = document.getElementById("roomScreen");
  const openButton = document.getElementById("openButton");
  const roomVideo = document.getElementById("roomVideo");
  const invitation = document.getElementById("invitation");
  const replayButton = document.getElementById("replayButton");

  const slides = Array.from(document.querySelectorAll(".slide"));
  const dots = Array.from(document.querySelectorAll(".dot"));

  const prevButton = document.getElementById("prevButton");
  const nextButton = document.getElementById("nextButton");
  const calendarButton = document.getElementById("calendarButton");

  let currentSlide = 0;
  let touchStartX = 0;
  let touchStartY = 0;


  /* =====================================
     OPEN DOOR AND PLAY VIDEO
  ===================================== */

  openButton.addEventListener("click", async function () {

    doorScreen.hidden = true;
    roomScreen.hidden = false;

    roomVideo.muted = true;
    roomVideo.playsInline = true;

    try {
      roomVideo.currentTime = 0;
      await roomVideo.play();
    } catch (error) {
      console.error("Video could not play:", error);
      showInvitation();
    }

  });


  /* =====================================
     SHOW INVITATION AFTER VIDEO ENDS
  ===================================== */

  function showInvitation() {

    invitation.hidden = false;
    replayButton.hidden = false;

    showSlide(0);

  }

  roomVideo.addEventListener("ended", function () {

    /*
      Video ko pause ya hide nahi karna.
      Video apne last frame par rahega aur
      invitation card uske upar dikhega.
    */

    showInvitation();

  });


  /* =====================================
     VIDEO ERROR FALLBACK
  ===================================== */

  roomVideo.addEventListener("error", function () {

    console.error(
      "Venue.webm load nahi hua. Filename aur format check karein."
    );

    showInvitation();

  });


  /* =====================================
     REPLAY ENTRANCE VIDEO
  ===================================== */

  replayButton.addEventListener("click", async function () {

    invitation.hidden = true;
    replayButton.hidden = true;

    try {

      roomVideo.currentTime = 0;
      await roomVideo.play();

    } catch (error) {

      showInvitation();

    }

  });


  /* =====================================
     FOUR SLIDES
  ===================================== */

  function showSlide(index) {

    currentSlide = (index + slides.length) % slides.length;

    slides.forEach(function (slide, i) {

      slide.classList.toggle("active", i === currentSlide);

      slide.setAttribute(
        "aria-hidden",
        i === currentSlide ? "false" : "true"
      );

    });

    dots.forEach(function (dot, i) {

      dot.classList.toggle("active", i === currentSlide);

      dot.setAttribute(
        "aria-current",
        i === currentSlide ? "true" : "false"
      );

    });

  }


  /* Previous and next buttons */

  prevButton.addEventListener("click", function () {

    showSlide(currentSlide - 1);

  });

  nextButton.addEventListener("click", function () {

    showSlide(currentSlide + 1);

  });


  /* Slide dots */

  dots.forEach(function (dot) {

    dot.addEventListener("click", function () {

      const slideNumber = Number(dot.dataset.go);

      showSlide(slideNumber);

    });

  });


  /* =====================================
     SWIPE LEFT / RIGHT ON MOBILE
  ===================================== */

  invitation.addEventListener("touchstart", function (event) {

    if (!event.changedTouches.length) return;

    touchStartX = event.changedTouches[0].clientX;
    touchStartY = event.changedTouches[0].clientY;

  }, { passive: true });


  invitation.addEventListener("touchend", function (event) {

    if (!event.changedTouches.length) return;

    const endX = event.changedTouches[0].clientX;
    const endY = event.changedTouches[0].clientY;

    const differenceX = endX - touchStartX;
    const differenceY = endY - touchStartY;

    if (
      Math.abs(differenceX) > 45 &&
      Math.abs(differenceX) > Math.abs(differenceY) * 1.2
    ) {

      if (differenceX < 0) {
        showSlide(currentSlide + 1);
      } else {
        showSlide(currentSlide - 1);
      }

    }

  }, { passive: true });


  /* =====================================
     ADD EVENT TO CALENDAR
  ===================================== */

  calendarButton.addEventListener("click", function (event) {

    event.preventDefault();

    const calendarEvent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Hamid and Saniya//Walima Invitation//EN",
      "CALSCALE:GREGORIAN",
      "BEGIN:VEVENT",
      "UID:hamid-saniya-walima-20261228@example.com",
      "DTSTAMP:20261029T000000Z",
      "DTSTART;TZID=Asia/Kolkata:20261228T200000",
      "DTEND;TZID=Asia/Kolkata:20261228T230000",
      "SUMMARY:Walima Ceremony - Hamid Khan and Saniya Khan",
      "LOCATION:Sona Lawns, Chembur, Mumbai 400043",
      "DESCRIPTION:Walima Ceremony of Hamid Khan and Saniya Khan. Monday 28 December 2026 at 8 PM onwards.",
      "END:VEVENT",
      "END:VCALENDAR"
    ].join("\r\n");

    const file = new Blob(
      [calendarEvent],
      { type: "text/calendar;charset=utf-8" }
    );

    const fileURL = URL.createObjectURL(file);
    const downloadLink = document.createElement("a");

    downloadLink.href = fileURL;
    downloadLink.download = "Hamid-Saniya-Walima.ics";

    document.body.appendChild(downloadLink);
    downloadLink.click();
    downloadLink.remove();

    setTimeout(function () {
      URL.revokeObjectURL(fileURL);
    }, 1000);

  });


  /* =====================================
     COUNTDOWN TIMER
     Event time: 28 December 2026, 8 PM IST
  ===================================== */

  const eventDate = new Date("2026-12-28T20:00:00+05:30");

  const daysElement = document.getElementById("days");
  const hoursElement = document.getElementById("hours");
  const minutesElement = document.getElementById("minutes");
  const secondsElement = document.getElementById("seconds");


  function updateCountdown() {

    let remaining = eventDate.getTime() - Date.now();

    if (remaining <= 0) {

      daysElement.textContent = "0";
      hoursElement.textContent = "00";
      minutesElement.textContent = "00";
      secondsElement.textContent = "00";

      return;

    }

    const days = Math.floor(remaining / (1000 * 60 * 60 * 24));

    remaining %= 1000 * 60 * 60 * 24;

    const hours = Math.floor(remaining / (1000 * 60 * 60));

    remaining %= 1000 * 60 * 60;

    const minutes = Math.floor(remaining / (1000 * 60));

    const seconds = Math.floor((remaining % (1000 * 60)) / 1000);


    daysElement.textContent = days;
    hoursElement.textContent = String(hours).padStart(2, "0");
    minutesElement.textContent = String(minutes).padStart(2, "0");
    secondsElement.textContent = String(seconds).padStart(2, "0");

  }


  /* Start countdown */

  updateCountdown();

  setInterval(updateCountdown, 1000);


  /* Initialise first slide */

  showSlide(0);

});
