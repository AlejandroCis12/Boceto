document.addEventListener('DOMContentLoaded', function() {
  // Elementos del DOM
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  const overlay = document.querySelector('.overlay');
  const dropdownToggle = document.querySelector('.dropdown-toggle');
  const dropdownMobile = document.querySelector('.dropdown-mobile');
  
  // Toggle menú móvil
  if (menuToggle) {
      menuToggle.addEventListener('click', function() {
          this.classList.toggle('active');
          mobileMenu.classList.toggle('active');
          overlay.classList.toggle('active');
          document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
      });
  }
  
  // Cerrar menú al hacer clic en overlay
  if (overlay) {
      overlay.addEventListener('click', function() {
          menuToggle.classList.remove('active');
          mobileMenu.classList.remove('active');
          overlay.classList.remove('active');
          document.body.style.overflow = '';
      });
  }
  
  // Toggle submenú móvil
  if (dropdownToggle && dropdownMobile) {
      dropdownToggle.addEventListener('click', function(e) {
          e.preventDefault();
          dropdownMobile.classList.toggle('active');
      });
  }
  
  // Cerrar menú al hacer clic en un enlace
  document.querySelectorAll('.mobile-menu a').forEach(link => {
      if (!link.classList.contains('dropdown-toggle') && !link.classList.contains('mobile-contact')) {
          link.addEventListener('click', function() {
              menuToggle.classList.remove('active');
              mobileMenu.classList.remove('active');
              overlay.classList.remove('active');
              document.body.style.overflow = '';
          });
      }
  });
  
  // Scroll suave para todos los enlaces
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
          e.preventDefault();
          
          const targetId = this.getAttribute('href');
          if (targetId === '#') return;
          
          const targetElement = document.querySelector(targetId);
          if (targetElement) {
              const headerHeight = document.querySelector('header').offsetHeight;
              const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
              
              window.scrollTo({
                  top: targetPosition,
                  behavior: 'smooth'
              });
          }
      });
  });
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
const cards = document.querySelectorAll('.container-Productos, container-nosotros, .container-marcas, .contact-section');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
      if (entry.isIntersecting) {
          entry.target.style.opacity = 1;
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
      }
  });
}, { threshold: 0.1 });

cards.forEach(card => {
  card.style.opacity = 0;
  card.style.transform = 'translateY(20px)';
  card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  observer.observe(card);
});

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



