  document.addEventListener('DOMContentLoaded', function () {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (menuToggle && navMenu) {
      menuToggle.addEventListener('click', function () {
        navMenu.classList.toggle('active');
      });
    }
  });

document.addEventListener("DOMContentLoaded", function () {
  const slider = document.querySelector(".slider");
  const dots = document.querySelectorAll(".dot");

  let slides = document.querySelectorAll(".slide");

  // Clonación infinita
  const firstClone = slides[0].cloneNode(true);
  const lastClone = slides[slides.length - 1].cloneNode(true);
  slider.appendChild(firstClone);
  slider.insertBefore(lastClone, slides[0]);

  slides = document.querySelectorAll(".slide");
  const slideCount = slides.length;

  let currentIndex = 1;
  let startPos = 0;
  let currentTranslate = 0;
  let prevTranslate = 0;
  let isDragging = false;
  let animationID;

  setPositionByIndex();

  slides.forEach((slide, index) => {
    const img = slide.querySelector("img");
    if (img) img.addEventListener("dragstart", (e) => e.preventDefault());

    slide.addEventListener("mousedown", touchStart(index));
    slide.addEventListener("mouseup", touchEnd);
    slide.addEventListener("mouseleave", touchEnd);
    slide.addEventListener("mousemove", touchMove);

    slide.addEventListener("touchstart", touchStart(index), { passive: true });
    slide.addEventListener("touchend", touchEnd);
    slide.addEventListener("touchmove", touchMove, { passive: false });
  });

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      goToSlide(index + 1);
    });
  });

  function touchStart(index) {
    return function (event) {
      isDragging = true;
      currentIndex = index;
      startPos = getPositionX(event);
      slider.style.transition = "none";
      animationID = requestAnimationFrame(animation);
    };
  }

  function touchEnd() {
    if (!isDragging) return;
    isDragging = false;
    cancelAnimationFrame(animationID);
    slider.style.transition = "transform 0.5s ease-out";
    const movedBy = currentTranslate - prevTranslate;

    if (movedBy < -100) currentIndex++;
    else if (movedBy > 100) currentIndex--;

    setPositionByIndex();

    if (currentIndex >= slideCount - 1) {
      setTimeout(() => {
        slider.style.transition = "none";
        currentIndex = 1;
        setPositionByIndex();
      }, 500);
    } else if (currentIndex <= 0) {
      setTimeout(() => {
        slider.style.transition = "none";
        currentIndex = slideCount - 2;
        setPositionByIndex();
      }, 500);
    }
  }

  function touchMove(event) {
    if (!isDragging) return;
    const currentPosition = getPositionX(event);
    currentTranslate = prevTranslate + currentPosition - startPos;
    event.preventDefault();
  }

  function getPositionX(event) {
    return event.type.includes("mouse") ? event.pageX : event.touches[0].clientX;
  }

  function animation() {
    setSliderPosition();
    if (isDragging) requestAnimationFrame(animation);
  }

  function setSliderPosition() {
    slider.style.transform = `translateX(${currentTranslate}px)`;
  }

  function setPositionByIndex() {
    currentTranslate = currentIndex * -slider.offsetWidth;
    prevTranslate = currentTranslate;
    setSliderPosition();
    updateDots();
  }

  function goToSlide(index) {
    currentIndex = index;
    slider.style.transition = "transform 0.5s ease-out";
    setPositionByIndex();

    if (currentIndex >= slideCount - 1) {
      setTimeout(() => {
        slider.style.transition = "none";
        currentIndex = 1;
        setPositionByIndex();
      }, 500);
    } else if (currentIndex <= 0) {
      setTimeout(() => {
        slider.style.transition = "none";
        currentIndex = slideCount - 2;
        setPositionByIndex();
      }, 500);
    }
  }

  function updateDots() {
    let dotIndex = currentIndex - 1;
    if (dotIndex < 0) dotIndex = dots.length - 1;
    if (dotIndex >= dots.length) dotIndex = 0;

    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === dotIndex);
    });
  }

  window.addEventListener("resize", () => {
    slider.style.transition = "none";
    setPositionByIndex();
  });
});


// script.js
document.addEventListener("DOMContentLoaded", function () {
    const slideTrack = document.querySelector(".slide-track");
    const slides = document.querySelectorAll(".slide");

    // Pausar animación al pasar el mouse
    slideTrack.addEventListener("mouseenter", () => {
        slideTrack.style.animationPlayState = "paused";
    });

    slideTrack.addEventListener("mouseleave", () => {
        slideTrack.style.animationPlayState = "running";
    });
});

function initMap() {
    const map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 20.0583, lng: -98.2522 }, // Coordenadas de ejemplo
        zoom: 15,
    });

    const marker = new google.maps.Marker({
        position: { lat: 20.0583, lng: -98.2522 },
        map: map,
        title: "Hidrosistemas de Hidalgo",
    });
}