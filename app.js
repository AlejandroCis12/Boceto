document.addEventListener("DOMContentLoaded", function () {
    const slider = document.querySelector(".slider");
    const slides = document.querySelectorAll(".slide");
    const dots = document.querySelectorAll(".dot");
    let currentIndex = 0;
    let isDragging = false;
    let startX, scrollStart;

    // Actualiza los puntos activos
    function updateDots(index) {
        dots.forEach((dot, i) => {
            dot.classList.toggle("active", i === index);
        });
        currentIndex = index;
    }

    // Detecta el slide actual
    function getCurrentSlide() {
        const slideWidth = slides[0].offsetWidth;
        const scrollLeft = slider.scrollLeft;
        const index = Math.round(scrollLeft / slideWidth);
        return Math.max(0, Math.min(index, slides.length - 1));
    }

    // Evento de clic en puntos
    dots.forEach((dot, index) => {
        dot.addEventListener("click", () => {
            slider.scrollTo({
                left: index * slides[0].offsetWidth,
                behavior: "smooth"
            });
            updateDots(index);
        });
    });

    // Inicialización
    updateDots(0);

    // Manejo del arrastre
    slider.addEventListener("mousedown", (e) => {
        isDragging = true;
        startX = e.pageX - slider.offsetLeft;
        scrollStart = slider.scrollLeft;
        slider.style.cursor = "grabbing";
    });

    slider.addEventListener("mouseleave", () => {
        isDragging = false;
        slider.style.cursor = "grab";
    });

    slider.addEventListener("mouseup", () => {
        isDragging = false;
        slider.style.cursor = "grab";
    });

    slider.addEventListener("mousemove", (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - slider.offsetLeft;
        const walk = (x - startX); // Cuánto se ha movido el mouse
        slider.scrollLeft = scrollStart - walk; // Desplazamiento del slider
    });

    // Evento de desplazamiento
    slider.addEventListener("scroll", () => {
        const index = getCurrentSlide();
        updateDots(index);
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