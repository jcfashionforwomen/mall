document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('contactForm');
  const message = document.getElementById('formMessage');

  form.addEventListener('submit', async function (e) {
    e.preventDefault(); // Prevent default form submission

    const formData = new FormData(form);

    try {
      const response = await fetch("https://formspree.io/f/mldnkrrj", {
        method: "POST",
        headers: { 'Accept': 'application/json' },
        body: formData
      });

      if (response.ok) {
        message.textContent = "✅ Your message has been submitted.";
        message.style.color = "green";
        form.reset(); // Clear form fields
      } else {
        message.textContent = "❌ There was a problem submitting your message. Please try again.";
        message.style.color = 'red';
      }
    } catch (error) {
      console.error("Form submission error:", error);
      message.textContent = "❌ Error connecting to the server. Please try again later.";
      message.style.color = 'red';
    }

    // Clear message after 4 seconds
    setTimeout(() => {
      message.textContent = "";
    }, 4000);
  });
});
