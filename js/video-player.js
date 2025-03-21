/**
 * Dalton's Family Medicine
 * Video Player Module
 * Handles video autoplay, play/pause and visibility detection
 */

function initVideoPlayer() {
    const dpcVideo = document.getElementById("dpcVideo");
    
    if (!dpcVideo) return; // Exit if video element doesn't exist
    
    // Set default volume (0.7 = 70% volume)
    dpcVideo.volume = 0.7;
  
    // Add play button overlay for mobile compatibility (hidden by default)
    const videoContainer = document.querySelector(".full-width-video-container");
    const playButton = document.createElement("div");
    playButton.className = "video-play-button";
    playButton.innerHTML = "<span>▶</span>";
    playButton.style.display = "none"; // Hide by default
    videoContainer.appendChild(playButton);
  
    // Variable to track user interactions
    let userHasInteracted = false;
    let userPaused = false; // Track if user manually paused the video
  
    // Hide play button whenever the video starts playing
    dpcVideo.addEventListener("playing", function() {
      playButton.style.display = "none";
    });
  
    // Also hide the button when the video is clicked directly
    dpcVideo.addEventListener("click", function() {
      if (dpcVideo.paused) {
        dpcVideo.play()
          .then(() => {
            playButton.style.display = "none";
          })
          .catch((error) => {
            console.log("Video play failed:", error);
          });
      }
    });
  
    // Listen for pause events initiated by the user
    dpcVideo.addEventListener("pause", () => {
      // Check if this was a user-initiated pause (not a programmatic one)
      if (document.activeElement === dpcVideo || document.activeElement.tagName === "BUTTON") {
        userPaused = true;
      }
    });
  
    // Listen for play events to reset userPaused flag
    dpcVideo.addEventListener("play", () => {
      userPaused = false;
    });
  
    // Handle play button click (for mobile where autoplay is restricted)
    playButton.addEventListener("click", () => {
      dpcVideo.play()
        .then(() => {
          // Hide play button on successful play
          playButton.style.display = "none";
          userHasInteracted = true;
          userPaused = false; // User is playing the video, so reset the pause flag
        })
        .catch((error) => {
          console.log("Play failed:", error);
        });
    });
  
    // Create an Intersection Observer
    const videoObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Only try to play if the video is visible AND the user hasn't paused it
          if (entry.isIntersecting && !userPaused) {
            // Try to play the video with audio
            const playPromise = dpcVideo.play();
  
            // Handle potential errors (especially on mobile devices)
            if (playPromise !== undefined) {
              playPromise
                .then(() => {
                  // Play started successfully
                  userHasInteracted = true;
                  // Ensure play button is hidden
                  playButton.style.display = "none";
                })
                .catch((error) => {
                  console.log(
                    "Auto-play with audio was prevented. This is normal on some devices and browsers.",
                    error
                  );
                  // Show play button only when autoplay fails
                  playButton.style.display = "flex";
                });
            }
          }
          // No else clause - video continues playing when scrolled away
        });
      },
      { threshold: 0.1 }
    ); // Trigger when 10% of the video is visible
  
    // Start observing the video element
    videoObserver.observe(dpcVideo);
  
    // For videos that finish playing, loop them (only if not manually paused)
    dpcVideo.addEventListener("ended", () => {
      if (!userPaused) {
        dpcVideo.currentTime = 0;
        dpcVideo.play();
      }
    });
  }