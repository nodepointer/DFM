/**
 * Dalton's Family Medicine
 * Testimonial Slider Module
 * Handles the testimonial slider functionality
 */

function initTestimonialSlider() {
    const testimonialContainer = document.querySelector(".testimonial-slider");
    if (!testimonialContainer) return; // Exit if slider doesn't exist
    
    const testimonials = document.querySelectorAll(".testimonial");
    let currentTestimonialIndex = 0;
    let isAnimating = false;
  
    // Create a track element to hold all testimonials in a row
    const track = document.createElement("div");
    track.className = "testimonial-track";
  
    // Move all testimonials into the track
    testimonials.forEach((testimonial) => {
      // Remove any active classes or display styles
      testimonial.classList.remove("active");
      testimonial.style.display = "";
  
      // Detach from current parent and add to track
      testimonial.parentNode.removeChild(testimonial);
      track.appendChild(testimonial);
    });
  
    // Add track to container
    testimonialContainer.insertBefore(track, testimonialContainer.firstChild);
  
    // Add pagination dots
    const paginationContainer = document.createElement("div");
    paginationContainer.className = "testimonial-pagination";
  
    // Create buttons with proper class names
    const prevBtn = document.createElement("button");
    prevBtn.className = "prev-btn";
    prevBtn.innerHTML = "&#10094;";
  
    const nextBtn = document.createElement("button");
    nextBtn.className = "next-btn";
    nextBtn.innerHTML = "&#10095;";
  
    // Create slider controls container
    const sliderControls = document.createElement("div");
    sliderControls.className = "slider-controls";
    sliderControls.appendChild(prevBtn);
    sliderControls.appendChild(nextBtn);
  
    // Add slider controls to container
    testimonialContainer.appendChild(sliderControls);
  
    for (let i = 0; i < testimonials.length; i++) {
      const dot = document.createElement("div");
      dot.className = i === 0 ? "testimonial-dot active" : "testimonial-dot";
      dot.addEventListener("click", () => {
        if (!isAnimating && i !== currentTestimonialIndex) {
          goToTestimonial(i);
        }
      });
      paginationContainer.appendChild(dot);
    }
  
    testimonialContainer.appendChild(paginationContainer);
  
    // Get the pagination dots
    const paginationDots = document.querySelectorAll(".testimonial-dot");
  
    // Function to slide to a specific testimonial
    function goToTestimonial(index) {
      if (isAnimating) return;
      isAnimating = true;
  
      // First, remove active class from all testimonials
      const allTestimonials = track.querySelectorAll(".testimonial");
      allTestimonials.forEach((testimonial) => {
        testimonial.classList.remove("active");
      });
  
      // Add active class to the current testimonial
      allTestimonials[index].classList.add("active");
  
      // Update active dot
      paginationDots[currentTestimonialIndex].classList.remove("active");
      paginationDots[index].classList.add("active");
  
      // Slide the track
      track.style.transform = `translateX(-${index * 100}%)`;
  
      // Update current index
      currentTestimonialIndex = index;
  
      // Reset isAnimating flag after transition completes
      setTimeout(() => {
        isAnimating = false;
      }, 800); // Match this to the CSS transition time
    }
  
    // Navigate to previous testimonial
    prevBtn.addEventListener("click", () => {
      if (isAnimating) return;
      const newIndex = (currentTestimonialIndex - 1 + testimonials.length) % testimonials.length;
      goToTestimonial(newIndex);
    });
  
    // Navigate to next testimonial
    nextBtn.addEventListener("click", () => {
      if (isAnimating) return;
      const newIndex = (currentTestimonialIndex + 1) % testimonials.length;
      goToTestimonial(newIndex);
    });
  
    // Add swipe functionality for mobile
    let touchStartX = 0;
    let touchEndX = 0;
  
    testimonialContainer.addEventListener("touchstart", (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
  
    testimonialContainer.addEventListener("touchend", (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });
  
    function handleSwipe() {
      const swipeThreshold = 50; // Minimum distance for a swipe
  
      if (touchEndX < touchStartX - swipeThreshold) {
        // Swipe left - go to next
        if (!isAnimating) {
          const newIndex = (currentTestimonialIndex + 1) % testimonials.length;
          goToTestimonial(newIndex);
        }
      } else if (touchEndX > touchStartX + swipeThreshold) {
        // Swipe right - go to previous
        if (!isAnimating) {
          const newIndex = (currentTestimonialIndex - 1 + testimonials.length) % testimonials.length;
          goToTestimonial(newIndex);
        }
      }
    }
    
    // Make sure the initial testimonial is marked as active
    track.querySelector('.testimonial').classList.add('active');
  }