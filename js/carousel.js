/**
 * Dalton's Family Medicine
 * Hero Carousel Module
 * Handles the image carousel in the hero section
 */

function initHeroCarousel() {
    const carouselInner = document.querySelector(".hero-carousel-inner");
    const prevBtn = document.querySelector(".carousel-prev");
    const nextBtn = document.querySelector(".carousel-next");
    const indicators = document.querySelectorAll(".carousel-indicator");
    const heroImages = document.querySelectorAll(".hero-image");
    const imageCount = 7; // Number of unique images
    let currentIndex = 0;
    let startX, moveX;
    let isTransitioning = false;
    
    // Set initial position
    updateCarousel();
  
    // Create clones for smooth looping
    function setupCarousel() {
      const firstClone = heroImages[0].cloneNode(true);
      const lastClone = heroImages[imageCount - 1].cloneNode(true);
  
      carouselInner.appendChild(firstClone);
      carouselInner.insertBefore(lastClone, heroImages[0]);
  
      // Adjust initial position to show first real image (not clone)
      carouselInner.style.transform = `translateX(-${heroImages[0].offsetWidth}px)`;
    }
  
    // Call setup on load
    setupCarousel();
  
    // Event listeners for navigation buttons
    prevBtn.addEventListener("click", function() {
      if (isTransitioning) return;
      currentIndex = (currentIndex - 1 + imageCount) % imageCount;
      slideCarousel();
    });
  
    nextBtn.addEventListener("click", function() {
      if (isTransitioning) return;
      currentIndex = (currentIndex + 1) % imageCount;
      slideCarousel();
    });
  
    // Event listeners for indicators
    indicators.forEach((indicator, index) => {
      indicator.addEventListener("click", function() {
        if (isTransitioning) return;
        currentIndex = index;
        slideCarousel();
      });
    });
  
    // Touch events for swipe functionality
    carouselInner.addEventListener("touchstart", function(e) {
      startX = e.touches[0].clientX;
    });
  
    carouselInner.addEventListener("touchmove", function(e) {
      moveX = e.touches[0].clientX;
    });
  
    carouselInner.addEventListener("touchend", function() {
      if (startX - moveX > 50) {
        // Swipe left
        if (isTransitioning) return;
        currentIndex = (currentIndex + 1) % imageCount;
        slideCarousel();
      } else if (moveX - startX > 50) {
        // Swipe right
        if (isTransitioning) return;
        currentIndex = (currentIndex - 1 + imageCount) % imageCount;
        slideCarousel();
      }
    });
  
    // Auto-advance carousel
    setInterval(function() {
      if (isTransitioning) return;
      currentIndex = (currentIndex + 1) % imageCount;
      slideCarousel();
    }, 5000);
  
    function slideCarousel() {
      isTransitioning = true;
  
      // Get all hero images again (now including clones)
      const allImages = document.querySelectorAll(".hero-image");
  
      // Calculate position (+1 to account for the first clone)
      let position = allImages[0].offsetWidth; // Start with the width of the clone
  
      for (let i = 0; i < currentIndex; i++) {
        position += allImages[i + 1].offsetWidth; // +1 because we have a clone at the beginning
      }
  
      carouselInner.style.transition = "transform 0.5s ease";
      carouselInner.style.transform = `translateX(-${position}px)`;
  
      // Update indicators
      updateIndicators();
  
      // Handle the loop transition
      carouselInner.addEventListener("transitionend", function handleTransition() {
        carouselInner.removeEventListener("transitionend", handleTransition);
  
        if (currentIndex === -1) {
          // If we went to the left clone, jump to the last real image
          currentIndex = imageCount - 1;
          resetToRealImage();
        } else if (currentIndex === imageCount) {
          // If we went to the right clone, jump to the first real image
          currentIndex = 0;
          resetToRealImage();
        }
  
        isTransitioning = false;
      });
    }
  
    function resetToRealImage() {
      // Get all hero images again
      const allImages = document.querySelectorAll(".hero-image");
  
      // Calculate position (+1 to account for the first clone)
      let position = allImages[0].offsetWidth; // Start with the width of the clone
  
      for (let i = 0; i < currentIndex; i++) {
        position += allImages[i + 1].offsetWidth; // +1 because we have a clone at the beginning
      }
  
      // Remove transition and jump to correct position
      carouselInner.style.transition = "none";
      carouselInner.style.transform = `translateX(-${position}px)`;
  
      // Force a reflow to make sure the transition removal takes effect
      carouselInner.offsetHeight;
    }
  
    function updateIndicators() {
      indicators.forEach((indicator, index) => {
        if (index === currentIndex) {
          indicator.classList.add("active");
        } else {
          indicator.classList.remove("active");
        }
      });
    }
  
    function updateCarousel() {
      // This function is now just for the initial setup and to update indicators
      updateIndicators();
    }
  }