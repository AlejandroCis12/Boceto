// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function () {
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  const dropdownToggle = document.querySelector('.dropdown-toggle');
  const dropdownMobile = document.querySelector('.dropdown-mobile');

  // Verificar si los elementos existen
  if (!menuToggle || !mobileMenu) {
    console.warn('Menú hamburguesa no encontrado. ¿Están las clases correctas?');
    return;
  }

  // Crear overlay
  const overlay = document.createElement('div');
  overlay.classList.add('overlay');
  document.body.appendChild(overlay);

  // Abrir/cerrar menú hamburguesa
  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    overlay.style.display = mobileMenu.classList.contains('active') ? 'block' : 'none';
  });

  // Cerrar menú al hacer clic en el overlay
  overlay.addEventListener('click', closeMobileMenu);

  // Toggle del submenú "Servicios" en móvil (si existe)
  if (dropdownToggle && dropdownMobile) {
    dropdownToggle.addEventListener('click', (e) => {
      e.preventDefault();
      dropdownMobile.classList.toggle('active');
    });
  }

  // Cerrar menú al hacer clic en cualquier enlace (excepto Servicios)
  document.querySelectorAll('.mobile-menu a').forEach(link => {
    link.addEventListener('click', (e) => {
      // No cerrar si es el botón de desplegar servicios
      if (link.classList.contains('dropdown-toggle')) return;

      // Cerrar menú
      closeMobileMenu();
    });
  });

  // Función para cerrar el menú
  function closeMobileMenu() {
    if (menuToggle) menuToggle.classList.remove('active');
    if (mobileMenu) mobileMenu.classList.remove('active');
    overlay.style.display = 'none';
    if (dropdownMobile) dropdownMobile.classList.remove('active');
  }
});

document.addEventListener("DOMContentLoaded", function () {
    const slider = document.querySelector(".slider");
    const slides = document.querySelectorAll(".slide");
    const dotsContainer = document.querySelector(".dots");
    const prevBtn = document.querySelector(".prev");
    const nextBtn = document.querySelector(".next");
    
    // Create dots
    slides.forEach((_, i) => {
        const dot = document.createElement("span");
        dot.classList.add("dot");
        if (i === 0) dot.classList.add("active");
        dot.addEventListener("click", () => goToSlide(i));
        dotsContainer.appendChild(dot);
    });
    
    const dots = document.querySelectorAll(".dot");
    
    // Clone first and last slides for infinite effect
    const firstClone = slides[0].cloneNode(true);
    const lastClone = slides[slides.length - 1].cloneNode(true);
    firstClone.classList.add("clone");
    lastClone.classList.add("clone");
    slider.appendChild(firstClone);
    slider.insertBefore(lastClone, slides[0]);
    
    let currentIndex = 1;
    let isTransitioning = false;
    let touchStartX = 0;
    let touchEndX = 0;
    
    // Set initial position
    slider.style.transform = `translateX(-${currentIndex * 100}%)`;
    
    // Auto-rotate slides
    let interval = setInterval(nextSlide, 5000);
    
    function updateSlider() {
        if (isTransitioning) return;
        
        isTransitioning = true;
        slider.style.transition = "transform 0.6s cubic-bezier(0.645, 0.045, 0.355, 1)";
        slider.style.transform = `translateX(-${currentIndex * 100}%)`;
        
        // Update dots
        dots.forEach((dot, i) => {
            dot.classList.toggle("active", i === (currentIndex - 1 + slides.length) % slides.length);
        });
    }
    
    function nextSlide() {
        if (isTransitioning) return;
        currentIndex++;
        updateSlider();
    }
    
    function prevSlide() {
        if (isTransitioning) return;
        currentIndex--;
        updateSlider();
    }
    
    function goToSlide(index) {
        if (isTransitioning) return;
        currentIndex = index + 1;
        updateSlider();
        resetInterval();
    }
    
    function resetInterval() {
        clearInterval(interval);
        interval = setInterval(nextSlide, 5000);
    }
    
    slider.addEventListener("transitionend", () => {
        // Handle infinite loop
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
    
    // Touch events
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
    
    // Button controls
    nextBtn.addEventListener("click", () => {
        nextSlide();
        resetInterval();
    });
    
    prevBtn.addEventListener("click", () => {
        prevSlide();
        resetInterval();
    });
    
    // Pause on hover
    slider.addEventListener("mouseenter", () => {
        clearInterval(interval);
    });
    
    slider.addEventListener("mouseleave", () => {
        resetInterval();
    });
    
    // Keyboard navigation
    document.addEventListener("keydown", (e) => {
        if (e.key === "ArrowRight") {
            nextSlide();
            resetInterval();
        } else if (e.key === "ArrowLeft") {
            prevSlide();
            resetInterval();
        }
    });
    
    // Responsive adjustments
    window.addEventListener("resize", () => {
        slider.style.transition = "none";
        slider.style.transform = `translateX(-${currentIndex * 100}%)`;
    });
});

//marcas
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