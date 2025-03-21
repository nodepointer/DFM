/**
 * Dalton's Family Medicine
 * Navigation Module
 * Handles sticky navigation, smooth scrolling, and scroll spy
 */

function initNavigation() {
    const header = document.querySelector("header");
    const body = document.body;
    const headerHeight = header.offsetHeight;
    const navLinks = document.querySelectorAll(".left-menu a, .right-menu a");
  
    // Handle sticky navigation on scroll
    function handleScroll() {
      if (window.scrollY > 100) {
        // Start sticking after scrolling 100px
        header.classList.add("sticky");
        body.classList.add("sticky-header");
        body.style.paddingTop = headerHeight + "px";
      } else {
        header.classList.remove("sticky");
        body.classList.remove("sticky-header");
        body.style.paddingTop = "0";
      }
    }
  
    // Add smooth scrolling to nav links
    navLinks.forEach((link) => {
      link.addEventListener("click", function(e) {
        e.preventDefault(); // Prevent default anchor behavior
        
        // Get the target section id from the href attribute
        const targetId = this.getAttribute("href");
        
        // Check if it's a valid section ID
        if (targetId.startsWith("#")) {
          const targetSection = document.querySelector(targetId);
          
          if (targetSection) {
            // Update active class
            navLinks.forEach((item) => item.classList.remove("active"));
            this.classList.add("active");
            
            // Get the header height for offset calculation
            const header = document.querySelector("header");
            const headerHeight = header.offsetHeight;
            
            // Calculate the final scroll position with offset for the header
            const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - headerHeight;
            
            // Smooth scroll to the target
            window.scrollTo({
              top: targetPosition,
              behavior: "smooth"
            });
          }
        }
      });
    });
  
    // Listen for scroll events
    window.addEventListener("scroll", handleScroll);
  }
  
  // Add scroll spy functionality to update active nav link based on scroll position
  function updateActiveNavOnScroll() {
    // Get all sections that have IDs corresponding to nav links
    // Added footer[id] to the selector to include the contact section
    const sections = document.querySelectorAll("section[id], div[id], footer[id]");
    const navLinks = document.querySelectorAll(".left-menu a, .right-menu a");
    
    // Get the header height for offset calculation
    const header = document.querySelector("header");
    const headerHeight = header.offsetHeight;
    
    // Listen for scroll events
    window.addEventListener("scroll", function() {
      // Determine which section is currently in view
      let currentSection = "";
      
      sections.forEach((section) => {
        const sectionTop = section.offsetTop - headerHeight - 10; // 10px buffer
        const sectionHeight = section.offsetHeight;
        
        if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
          currentSection = "#" + section.getAttribute("id");
        }
      });
      
      // Check if we're at the bottom of the page - helps with footer highlighting
      const isAtBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 50; // 50px tolerance
      if (isAtBottom && document.getElementById("contact")) {
        currentSection = "#contact";
      }
      
      // Update the active class on nav links
      if (currentSection) {
        navLinks.forEach((link) => {
          link.classList.remove("active");
          if (link.getAttribute("href") === currentSection) {
            link.classList.add("active");
          }
        });
      }
    });
  }