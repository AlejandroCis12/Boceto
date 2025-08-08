// =======================
// 1. MENÚ MÓVIL (solo si existe)
// =======================
document.addEventListener('DOMContentLoaded', function () {
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  const dropdownToggle = document.querySelector('.dropdown-toggle');
  const dropdownMobile = document.querySelector('.dropdown-mobile');

  // Si no hay menú, no ejecutar nada de esto
  if (!menuToggle || !mobileMenu) {
    // Puedes comentar esto en producción
    // console.log('Menú no encontrado. Saltando funcionalidad de menú.');
    return;
  }

  // Crear overlay solo si hay menú
  const overlay = document.createElement('div');
  overlay.classList.add('overlay');
  document.body.appendChild(overlay);

  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    overlay.style.display = mobileMenu.classList.contains('active') ? 'block' : 'none';
  });

  overlay.addEventListener('click', closeMobileMenu);

  if (dropdownToggle && dropdownMobile) {
    dropdownToggle.addEventListener('click', (e) => {
      e.preventDefault();
      dropdownMobile.classList.toggle('active');
    });
  }

  document.querySelectorAll('.mobile-menu a').forEach(link => {
    link.addEventListener('click', (e) => {
      if (link.classList.contains('dropdown-toggle')) return;
      closeMobileMenu();
    });
  });

  function closeMobileMenu() {
    menuToggle.classList.remove('active');
    mobileMenu.classList.remove('active');
    overlay.style.display = 'none';
    if (dropdownMobile) dropdownMobile.classList.remove('active');
  }
});

// =======================
// 2. SLIDER (solo si existe)
// =======================
document.addEventListener('DOMContentLoaded', function () {
  const slider = document.querySelector(".slider");
  const slides = document.querySelectorAll(".slide");
  const dotsContainer = document.querySelector(".dots");
  const prevBtn = document.querySelector(".prev");
  const nextBtn = document.querySelector(".next");

  // ✅ Verificar si el slider existe
  if (!slider || slides.length === 0 || !dotsContainer) {
    // console.log('Slider no encontrado o sin slides. Saltando slider.');
    return;
  }

  // ✅ Crear puntos (dots)
  slides.forEach((_, i) => {
    const dot = document.createElement("span");
    dot.classList.add("dot");
    if (i === 0) dot.classList.add("active");
    dot.addEventListener("click", () => goToSlide(i));
    dotsContainer.appendChild(dot);
  });

  const dots = document.querySelectorAll(".dot");

  // ✅ Clonar slides solo si hay al menos un slide
  if (slides.length > 0) {
    const firstClone = slides[0].cloneNode(true);
    const lastClone = slides[slides.length - 1].cloneNode(true);
    firstClone.classList.add("clone");
    lastClone.classList.add("clone");
    slider.appendChild(firstClone);
    slider.insertBefore(lastClone, slides[0]);
  }

  let currentIndex = 1;
  let isTransitioning = false;
  let touchStartX = 0;
  let touchEndX = 0;

  // Posición inicial
  if (slides.length > 0) {
    slider.style.transform = `translateX(-${currentIndex * 100}%)`;
  }

  let interval = null;
  if (slides.length > 0) {
    interval = setInterval(nextSlide, 5000);
  }

  function updateSlider() {
    if (isTransitioning || slides.length === 0) return;
    isTransitioning = true;
    slider.style.transition = "transform 0.6s cubic-bezier(0.645, 0.045, 0.355, 1)";
    slider.style.transform = `translateX(-${currentIndex * 100}%)`;

    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === (currentIndex - 1 + slides.length) % slides.length);
    });
  }

  function nextSlide() {
    if (isTransitioning || slides.length === 0) return;
    currentIndex++;
    updateSlider();
    resetInterval();
  }

  function prevSlide() {
    if (isTransitioning || slides.length === 0) return;
    currentIndex--;
    updateSlider();
    resetInterval();
  }

  function goToSlide(index) {
    if (isTransitioning || slides.length === 0) return;
    currentIndex = index + 1;
    updateSlider();
    resetInterval();
  }

  function resetInterval() {
    if (interval) clearInterval(interval);
    interval = setInterval(nextSlide, 5000);
  }

  // transitionend
  slider.addEventListener("transitionend", () => {
    if (slides.length === 0) return;

    if (currentIndex === 0) {
      slider.style.transition = "none";
      currentIndex = slides.length;
      slider.style.transform = `translateX(-${currentIndex * 100}%)`;
      setTimeout(() => {
        slider.style.transition = "transform 0.6s cubic-bezier(0.645, 0.045, 0.355, 1)";
      }, 20);
    } else if (currentIndex === slides.length + 1) {
      slider.style.transition = "none";
      currentIndex = 1;
      slider.style.transform = `translateX(-${currentIndex * 100}%)`;
      setTimeout(() => {
        slider.style.transition = "transform 0.6s cubic-bezier(0.645, 0.045, 0.355, 1)";
      }, 20);
    }

    isTransitioning = false;
  });

  // Touch
  slider.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  slider.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
    resetInterval();
  }, { passive: true });

  function handleSwipe() {
    const difference = touchStartX - touchEndX;
    if (difference > 50) nextSlide();
    if (difference < -50) prevSlide();
  }

  // Botones
  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      prevSlide();
      resetInterval();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      nextSlide();
      resetInterval();
    });
  }

  // Hover
  slider.addEventListener("mouseenter", () => {
    if (interval) clearInterval(interval);
  });

  slider.addEventListener("mouseleave", () => {
    resetInterval();
  });

  // Teclado
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") {
      nextSlide();
      resetInterval();
    } else if (e.key === "ArrowLeft") {
      prevSlide();
      resetInterval();
    }
  });

  // Resize
  window.addEventListener("resize", () => {
    slider.style.transition = "none";
    slider.style.transform = `translateX(-${currentIndex * 100}%)`;
  });
});

// =======================
// 3. CARRUSEL DE MARCAS (solo si existe)
// =======================
document.addEventListener('DOMContentLoaded', function () {
  const slideTrack = document.querySelector(".slide-track");
  if (!slideTrack) {
    // console.log('Carrusel de marcas no encontrado. Saltando.');
    return;
  }

  slideTrack.addEventListener("mouseenter", () => {
    slideTrack.style.animationPlayState = "paused";
  });

  slideTrack.addEventListener("mouseleave", () => {
    slideTrack.style.animationPlayState = "running";
  });
});

// =======================
// 4. MAPA DE GOOGLE (si existe el contenedor)
// =======================
function initMap() {
  const mapElement = document.getElementById("map");
  if (!mapElement) {
    // console.log('Mapa no encontrado en esta página.');
    return;
  }

  const map = new google.maps.Map(mapElement, {
    center: { lat: 20.0583, lng: -98.2522 },
    zoom: 15,
  });

  new google.maps.Marker({
    position: { lat: 20.0583, lng: -98.2522 },
    map: map,
    title: "Hidrosistemas de Hidalgo",
  });
}