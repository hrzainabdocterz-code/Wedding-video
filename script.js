document.addEventListener("DOMContentLoaded", function () {

  const doorScreen = document.getElementById("doorScreen");
  const roomScreen = document.getElementById("roomScreen");
  const openButton = document.getElementById("openButton");

  const roomVideo = document.getElementById("roomVideo");
  const invitation = document.getElementById("invitation");
  const replayButton = document.getElementById("replayButton");

  const videoMessage = document.getElementById("videoMessage");
  const videoMessageText = document.getElementById("videoMessageText");
  const retryVideoButton = document.getElementById("retryVideoButton");

  const slides = Array.from(document.querySelectorAll(".slide"));
  const dots = Array.from(document.querySelectorAll(".dot"));

  const prevButton = document.getElementById("prevButton");
  const nextButton = document.getElementById("nextButton");
  const calendarButton = document.getElementById("calendarButton");

  const SHOW_SLIDES_AT = 9;

  let currentSlide = 0;
  let slidesShown = false;
  let touchStartX = 0;
  let touchStartY = 0;

  /* SHOW INVITATION AT 9 SECONDS */

  function showInvitation() {
    if (slidesShown) return;

    slidesShown = true;
    invitation.hidden = false;
    showSlide(0);
  }

  /* START VIDEO */

  async function startVideo() {
    videoMessage.hidden = true;
    videoErrorReset();

    roomVideo.pause();
    roomVideo.currentTime = 0;

    // Keep original video sound enabled.
    roomVideo.muted = false;
    roomVideo.defaultMuted = false;
    roomVideo.volume = 1;

    try {
      await roomVideo.play();
    } catch (error) {
      console.error("Video playback error:", error);

      videoMessageText.textContent =
        "Please tap below to play the entrance video with its original music.";

      videoMessage.hidden = false;
    }
  }

  function videoErrorReset() {
    // Reset the retry message before each playback attempt.
    videoMessageText.textContent =
      "Please tap below to play the entrance video with its original music.";
  }

  /* DOOR TAP */

  openButton.addEventListener("click", function () {
    doorScreen.hidden = true;
    roomScreen.hidden = false;

    invitation.hidden = true;
    replayButton.hidden = true;
    slidesShown = false;

    startVideo();
  });

  /* RETRY VIDEO IF BROWSER BLOCKS PLAYBACK */

  retryVideoButton.addEventListener("click", function () {
    startVideo();
  });

  /* SHOW SLIDES WHEN VIDEO REACHES 9 SECONDS */

  roomVideo.addEventListener("timeupdate", function () {
    if (roomVideo.currentTime >= SHOW_SLIDES_AT) {
      showInvitation();
    }
  });

  /* WHEN VIDEO ENDS, KEEP ITS LAST FRAME */

  roomVideo.addEventListener("ended", function () {
    showInvitation();

    // Do not hide or reset the video.
    // Its final frame remains as the background.
    replayButton.hidden = false;
  });

  /* VIDEO LOAD/DECODE ERROR */

  roomVideo.addEventListener("error", function () {
    console.error("Could not load venue.mp4");

    videoMessageText.textContent =
      "The entrance video could not load. Please check that venue.mp4 is uploaded in the repository root.";

    videoMessage.hidden = false;
  });

  /* REPLAY ENTRANCE */

  replayButton.addEventListener("click", function () {
    invitation.hidden = true;
    replayButton.hidden = true;
    slidesShown = false;

    startVideo();
  });

  /* FOUR SLIDES */

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

  prevButton.addEventListener("click", function () {
    showSlide(currentSlide - 1);
  });

  nextButton.addEventListener("click", function () {
    showSlide(currentSlide + 1);
  });

  dots.forEach(function (dot) {
    dot.addEventListener("click", function () {
      showSlide(Number(dot.dataset.go));
    });
  });

  /* SWIPE LEFT / RIGHT ON MOBILE */

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

  /* COUNTDOWN TO 28 DECEMBER 2026, 8 PM IST */

  const eventDate = new Date("2026-12-28T20:00:00+05:30");

  function updateCountdown() {
    let remaining = eventDate.getTime() - Date.now();

    if (remaining <= 0) {
      document.getElementById("days").textContent = "0";
      document.getElementById("hours").textContent = "00";
      document.getElementById("minutes").textContent = "00";
      document.getElementById("seconds").textContent = "00";
      return;
    }

    const days = Math.floor(remaining / 86400000);
    const hours = Math.floor((remaining % 86400000) / 3600000);
    const minutes = Math.floor((remaining % 3600000) / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);

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
  setInterval(updateCountdown, 1000);

  /* ADD TO CALENDAR */

  calendarButton.addEventListener("click", function () {

    const eventLines = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Hamid and Saniya//Walima Invitation//EN",
      "CALSCALE:GREGORIAN",
      "BEGIN:VEVENT",
      "UID:hamid-saniya-walima-20261228@example.com",
      "DTSTAMP:20261030T000000Z",
      "DTSTART;TZID=Asia/Kolkata:20261228T200000",
      "DTEND;TZID=Asia/Kolkata:20261228T230000",
      "SUMMARY:Walima Ceremony - Hamid Khan and Saniya Khan",
      "LOCATION:Sona Lawns, Chembur, Mumbai 400043",
      "DESCRIPTION:Walima Ceremony of Hamid Khan and Saniya Khan. Monday 28 December 2026 at 8 PM onwards.",
      "END:VEVENT",
      "END:VCALENDAR"
    ];

    const calendarFile = new Blob(
      [eventLines.join("\r\n")],
      { type: "text/calendar;charset=utf-8" }
    );

    const fileURL = URL.createObjectURL(calendarFile);
    const downloadLink = document.createElement("a");

    downloadLink.href = fileURL;
    downloadLink.download = "Hamid-Saniya-Walima.ics";

    document.body.appendChild(downloadLink);
    downloadLink.click();
    downloadLink.remove();

    setTimeout(function () {
      URL.revokeObjectURL(fileURL);
    }, 3000);
  });

  /* INITIAL SLIDE STATE */

  showSlide(0);

});
