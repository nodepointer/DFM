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
  const mainNav = document.querySelector(".main-nav");

  // Create the scroll menu button element
  let scrollMenuButton = document.querySelector(".scroll-menu-button");

  // If the button doesn't exist, create it
  if (!scrollMenuButton) {
    scrollMenuButton = document.createElement("button");
    scrollMenuButton.className = "scroll-menu-button";
    scrollMenuButton.setAttribute("aria-label", "Scroll to navigation menu");
    scrollMenuButton.innerHTML = `
      <div class="hamburger-icon">
        <span></span>
        <span></span>
        <span></span>
      </div>
    `;
    document.body.appendChild(scrollMenuButton);
  }

  // Handle sticky navigation and floating button on scroll
  function handleScroll() {
    const isMobile = window.innerWidth <= 768;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (isMobile) {
      // On mobile: Don't make header sticky, only show floating hamburger
      header.classList.remove("sticky");
      body.classList.remove("sticky-header");
      body.style.paddingTop = "0";

      // Control floating hamburger visibility
      if (scrollTop > headerHeight) {
        scrollMenuButton.classList.add("visible");
        scrollMenuButton.classList.add("fade-in");
        scrollMenuButton.classList.remove("fade-out");
      } else {
        scrollMenuButton.classList.add("fade-out");
        scrollMenuButton.classList.remove("fade-in");

        // Remove visible class after transition completes
        setTimeout(function () {
          if (scrollTop <= headerHeight) {
            scrollMenuButton.classList.remove("visible");
          }
        }, 300);
      }
    } else {
      // On desktop: Use original sticky behavior
      if (scrollTop > 100) {
        header.classList.add("sticky");
        body.classList.add("sticky-header");
        body.style.paddingTop = headerHeight + "px";
      } else {
        header.classList.remove("sticky");
        body.classList.remove("sticky-header");
        body.style.paddingTop = "0";
      }

      // Ensure floating button is hidden on desktop
      scrollMenuButton.classList.remove("visible");
    }
  }

  // Add smooth scrolling to nav links
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
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
          const targetPosition =
            targetSection.getBoundingClientRect().top +
            window.pageYOffset -
            headerHeight;

          // Close mobile menu if it's open
          if (window.innerWidth <= 768) {
            toggleMobileMenu(false);
          }
          // Smooth scroll to the target
          window.scrollTo({
            top: targetPosition,
            behavior: "smooth",
          });
          // Close mobile menu if it's open
          if (
            window.innerWidth <= 768 &&
            mainNav &&
            mainNav.classList.contains("expanded")
          ) {
            toggleMobileMenu(false);
          }
        }
      }
    });
  });

  // Listen for scroll events
  window.addEventListener("scroll", handleScroll);

  // Initialize mobile menu
  initMobileMenu();

  // Handle window resize
  window.addEventListener("resize", handleScroll);

  // Add click event to the scroll menu button to scroll back to top
  scrollMenuButton.addEventListener("click", function () {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

// Set up mobile collapsible menu
function initMobileMenu() {
  const mainNav = document.querySelector(".main-nav");
  const navContainer = document.querySelector(".nav-container");

  // Create mobile menu button if it doesn't exist already
  if (!document.querySelector(".mobile-menu-button")) {
    const mobileMenuButton = document.createElement("button");
    mobileMenuButton.className = "mobile-menu-button";
    mobileMenuButton.setAttribute("aria-label", "Toggle navigation menu");
    mobileMenuButton.setAttribute("aria-expanded", "false");
    mobileMenuButton.innerHTML = `
      <div class="hamburger-icon">
        <span></span>
        <span></span>
        <span></span>
      </div>
    `;

    // Add mobile menu button to the navigation
    mainNav.insertBefore(mobileMenuButton, mainNav.firstChild);

    // Initialize nav as collapsed on mobile
    if (window.innerWidth <= 768) {
      mainNav.classList.add("collapsed");
    }

    // Toggle menu on button click
    mobileMenuButton.addEventListener("click", function () {
      const isExpanded = mainNav.classList.contains("expanded");
      toggleMobileMenu(!isExpanded);
    });
  }

  // Function to toggle mobile menu state
  window.toggleMobileMenu = function (open) {
    const mobileMenuButton = document.querySelector(".mobile-menu-button");

    if (open) {
      // Open the menu
      mainNav.classList.remove("collapsed");
      mainNav.classList.add("expanded");
      navContainer.classList.add("show");
      document.body.classList.add("mobile-menu-open");
      mobileMenuButton.setAttribute("aria-expanded", "true");
    } else {
      // Close the menu
      mainNav.classList.remove("expanded");
      mainNav.classList.add("collapsed");
      navContainer.classList.remove("show");
      document.body.classList.remove("mobile-menu-open");
      mobileMenuButton.setAttribute("aria-expanded", "false");
    }
  };

  // Handle window resize
  window.addEventListener("resize", function () {
    if (window.innerWidth > 768) {
      // Reset on desktop
      mainNav.classList.remove("expanded", "collapsed");
      navContainer.classList.remove("show");
      document.body.classList.remove("mobile-menu-open");
      document
        .querySelector(".mobile-menu-button")
        ?.setAttribute("aria-expanded", "false");
    } else if (
      !mainNav.classList.contains("expanded") &&
      !mainNav.classList.contains("collapsed")
    ) {
      // Initialize as collapsed on mobile
      mainNav.classList.add("collapsed");
    }
  });
}

// Add scroll spy functionality to update active nav link based on scroll position
function updateActiveNavOnScroll() {
  // Get all sections that have IDs corresponding to nav links
  // Added footer[id] to the selector to include the contact section
  const sections = document.querySelectorAll(
    "section[id], div[id], footer[id]"
  );
  const navLinks = document.querySelectorAll(".left-menu a, .right-menu a");

  // Get the header height for offset calculation
  const header = document.querySelector("header");
  const headerHeight = header.offsetHeight;

  // Listen for scroll events
  window.addEventListener("scroll", function () {
    // Determine which section is currently in view
    let currentSection = "";

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - headerHeight - 10; // 10px buffer
      const sectionHeight = section.offsetHeight;

      if (
        window.pageYOffset >= sectionTop &&
        window.pageYOffset < sectionTop + sectionHeight
      ) {
        currentSection = "#" + section.getAttribute("id");
      }
    });

    // Check if we're at the bottom of the page - helps with footer highlighting
    const isAtBottom =
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 50; // 50px tolerance
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
