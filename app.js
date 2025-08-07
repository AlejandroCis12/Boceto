document.addEventListener("DOMContentLoaded", function() {
    const slider = document.querySelector(".slider");
    const slides = document.querySelectorAll(".slide");
    const dots = document.querySelectorAll(".dot");
    let isDragging = false;
    let startPos = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let animationID = 0;
    let currentIndex = 0;

    // Clonamos el primer y último slide para efecto infinito
    const firstClone = slides[0].cloneNode(true);
    const lastClone = slides[slides.length - 1].cloneNode(true);
    
    slider.appendChild(firstClone);
    slider.insertBefore(lastClone, slides[0]);
    
    // Actualizamos la lista de slides
    const allSlides = document.querySelectorAll(".slide");
    const slideCount = allSlides.length;
    
    // Posicionamos inicialmente el slider en el slide "real" 1 (que es el clon al inicio)
    currentIndex = 1;
    setPositionByIndex();

    // Configuración inicial
    allSlides.forEach((slide, index) => {
        // Prevent image drag
        const slideImage = slide.querySelector('img');
        slideImage.addEventListener('dragstart', (e) => e.preventDefault());
        
        // Touch events
        slide.addEventListener('touchstart', touchStart(index));
        slide.addEventListener('touchend', touchEnd);
        slide.addEventListener('touchmove', touchMove);
        
        // Mouse events
        slide.addEventListener('mousedown', touchStart(index));
        slide.addEventListener('mouseup', touchEnd);
        slide.addEventListener('mouseleave', touchEnd);
        slide.addEventListener('mousemove', touchMove);
    });

    // Dot click events
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            goToSlide(index + 1); // +1 porque tenemos un slide clonado al inicio
        });
    });

    function touchStart(index) {
        return function(event) {
            currentIndex = index;
            startPos = getPositionX(event);
            isDragging = true;
            
            animationID = requestAnimationFrame(animation);
            slider.style.cursor = 'grabbing';
            slider.style.transition = 'none'; // Quitamos transición durante el arrastre
        }
    }

    function touchEnd() {
        isDragging = false;
        cancelAnimationFrame(animationID);
        slider.style.transition = 'transform 0.5s ease-out';
        
        const movedBy = currentTranslate - prevTranslate;
        
        if (movedBy < -100) {
            currentIndex += 1;
        } else if (movedBy > 100) {
            currentIndex -= 1;
        }
        
        // Efecto infinito
        if (currentIndex >= slideCount - 1) {
            // Si estamos en el último slide (clon), saltamos al primero real sin animación
            setTimeout(() => {
                slider.style.transition = 'none';
                currentIndex = 1;
                setPositionByIndex();
            }, 500);
        } else if (currentIndex <= 0) {
            // Si estamos en el primer slide (clon), saltamos al último real sin animación
            setTimeout(() => {
                slider.style.transition = 'none';
                currentIndex = slideCount - 2;
                setPositionByIndex();
            }, 500);
        }
        
        setPositionByIndex();
        slider.style.cursor = 'grab';
    }

    function touchMove(event) {
        if (isDragging) {
            const currentPosition = getPositionX(event);
            currentTranslate = prevTranslate + currentPosition - startPos;
        }
    }

    function getPositionX(event) {
        return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
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
        slider.style.transition = 'transform 0.5s ease-out';
        setPositionByIndex();
        
        // Manejo del efecto infinito para navegación con dots
        if (currentIndex >= slideCount - 1) {
            setTimeout(() => {
                slider.style.transition = 'none';
                currentIndex = 1;
                setPositionByIndex();
            }, 500);
        } else if (currentIndex <= 0) {
            setTimeout(() => {
                slider.style.transition = 'none';
                currentIndex = slideCount - 2;
                setPositionByIndex();
            }, 500);
        }
    }

    function updateDots() {
        let dotIndex = currentIndex - 1;
        if (dotIndex < 0) dotIndex = dots.length - 1;
        if (dotIndex >= dots.length) dotIndex = 0;
        
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === dotIndex);
        });
    }

    // Make slider responsive to window resize
    window.addEventListener('resize', () => {
        setPositionByIndex();
    });

    // Auto-rotate slider (opcional)
    let autoSlideInterval = setInterval(() => {
        goToSlide(currentIndex + 1);
    }, 5000);

    // Pause auto-rotate on hover/touch
    slider.addEventListener('mouseenter', () => {
        clearInterval(autoSlideInterval);
    });
    
    slider.addEventListener('mouseleave', () => {
        autoSlideInterval = setInterval(() => {
            goToSlide(currentIndex + 1);
        }, 5000);
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