document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("reviewContainer");
  const wrapper = document.getElementById("reviewsWrapper");
  let scrollSpeed = 0.8;
  let isPaused = false;

  const reviewsData = [
    { name: "Sravani Reddy", comment: "Loved the collection!", stars: "★★★★★" },
    { name: "Anjali Kumar", comment: "Great variety of styles.", stars: "★★★★☆" },
    { name: "Bhavana Naidu", comment: "Excellent quality products.", stars: "★★★★★" },
    { name: "Lakshmi Devi", comment: "Very satisfied with service.", stars: "★★★★☆" },
    { name: "Swathi Rao", comment: "Beautiful designs every time.", stars: "★★★★★" },
    { name: "Deepthi Varma", comment: "Affordable and trendy outfits.", stars: "★★★★☆" },
    { name: "Harika Goud", comment: "Good range, but stitching could improve.", stars: "★★★☆☆" },
    { name: "Pavani Reddy", comment: "Love shopping here regularly.", stars: "★★★★★" },
    { name: "Chaitanya Sri", comment: "Recommended for all women's wear.", stars: "★★★★☆" },
    { name: "Mounika K", comment: "Delivery was late but worth it.", stars: "★★★☆☆" },
  ];

  function renderReviews(reviews) {
    wrapper.innerHTML = "";
    [reviews, reviews].forEach((reviewSet) => {
      reviewSet.forEach((review) => {
        const reviewElement = document.createElement("div");
        reviewElement.className = "review";
        reviewElement.innerHTML = `
          <h4>${review.name}</h4>
          <p>${review.comment}</p>
          <div class="stars">${review.stars}</div>
        `;
        wrapper.appendChild(reviewElement);
      });
    });
  }

  async function fetchReviews() {
    try {
      // Replace this with real API endpoint if needed
      // const response = await fetch('https://your-api/reviews');
      // const data = await response.json();
      renderReviews(reviewsData); // Using mock data for now
    } catch (error) {
      console.error("Error fetching reviews:", error);
      renderReviews(reviewsData); // Fallback to mock data
    }
  }

  fetchReviews();

  function autoScroll() {
    if (!isPaused) {
      container.scrollLeft += scrollSpeed;
      if (container.scrollLeft >= wrapper.scrollWidth / 2) {
        container.scrollLeft = 0;
      }
    }
    requestAnimationFrame(autoScroll);
  }

  // Pause on hover
  container.addEventListener("mouseenter", () => (isPaused = true));
  container.addEventListener("mouseleave", () => (isPaused = false));

  // Mouse drag support
  let isDragging = false;
  let startX, scrollLeft;

  container.addEventListener("mousedown", (e) => {
    isDragging = true;
    startX = e.pageX - container.offsetLeft;
    scrollLeft = container.scrollLeft;
    container.style.cursor = "grabbing";
  });

  container.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    const x = e.pageX - container.offsetLeft;
    const walk = (x - startX) * 2;
    container.scrollLeft = scrollLeft - walk;
  });

  container.addEventListener("mouseup", () => {
    isDragging = false;
    container.style.cursor = "grab";
  });

  container.addEventListener("mouseleave", () => {
    if (isDragging) {
      isDragging = false;
      container.style.cursor = "grab";
    }
  });

  // Touch support
  container.addEventListener("touchstart", (e) => {
    isDragging = true;
    startX = e.touches[0].pageX - container.offsetLeft;
    scrollLeft = container.scrollLeft;
  });

  container.addEventListener("touchmove", (e) => {
    if (!isDragging) return;
    const x = e.touches[0].pageX - container.offsetLeft;
    const walk = (x - startX) * 2;
    container.scrollLeft = scrollLeft - walk;
  });

  container.addEventListener("touchend", () => {
    isDragging = false;
  });

  autoScroll();
});
