/**
 * Dalton's Family Medicine
 * Main JavaScript Entry Point
 * Initializes all components and functionality
 */

// Wait for DOM to be fully loaded before initializing components
document.addEventListener("DOMContentLoaded", function() {
    // Initialize navigation
    initNavigation();
    
    // Initialize hero carousel
    initHeroCarousel();
    
    // Initialize video player
    initVideoPlayer();
    
    // Initialize testimonial slider
    initTestimonialSlider();
    
    // Add scroll spy functionality to update active nav link
    updateActiveNavOnScroll();
  });