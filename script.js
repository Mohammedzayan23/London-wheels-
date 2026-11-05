
// Mobile navigation
const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

menuBtn.addEventListener("click", () => {
  navLinks.classList.toggle("active");
});

document.querySelectorAll("#navLinks a").forEach(link => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("active");
  });
});

// Hero slider
const slides = [
  {
    title: "TRAVEL IN",
    subtitle: "PURE LUXURY.",
    image: "photo-1503376780353-7e6692767b70",
    text: "Experience elegance, comfort and excellence with London Wheels."
  },
  {
    title: "ARRIVE IN",
    subtitle: "STYLE.",
    image: "photo-1492144534655-ae79c964c9d7",
    text: "Discover premium chauffeur services for every occasion."
  },
  {
    title: "YOUR JOURNEY",
    subtitle: "OUR PRIORITY.",
    image: "photo-1549317661-bd32c8ce0db2",
    text: "Enjoy exceptional travel with comfort and confidence."
  }
];

let current = 0;

function showSlide() {
  const slide = slides[current];

  document.querySelector(".hero h1").innerHTML =
    slide.title + "<br><span>" + slide.subtitle + "</span>";

  document.querySelector(".hero-content > p:not(.tagline)").textContent =
    slide.text;

  document.querySelector(".hero").style.backgroundImage =
    `linear-gradient(90deg, #07111f 10%, #07111f99),
    url("https://images.unsplash.com/${slide.image}?w=1600")`;
}

document.getElementById("next").addEventListener("click", () => {
  current = (current + 1) % slides.length;
  showSlide();
});

document.getElementById("prev").addEventListener("click", () => {
  current = (current - 1 + slides.length) % slides.length;
  showSlide();
});

// Newsletter demo
document.getElementById("newsletterForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const email = document.getElementById("email").value;

  document.getElementById("message").textContent =
    "Thank you! Your email: " + email + " has been entered in this demo.";

  this.reset();
});
// Booking enquiry form
const bookingForm = document.getElementById("bookingForm");

if (bookingForm) {
  bookingForm.addEventListener("submit", async function(e) {
    e.preventDefault();

    const message = document.getElementById("bookingMessage");
    const submitButton = bookingForm.querySelector("button[type='submit']");

    const booking = {
      name: document.getElementById("customerName").value.trim(),
      email: document.getElementById("customerEmail").value.trim(),
      pickup: document.getElementById("pickup").value.trim(),
      destination: document.getElementById("destination").value.trim(),
      date: document.getElementById("travelDate").value,
      time: document.getElementById("travelTime").value,
      vehicle: document.getElementById("vehicle").value
    };

    submitButton.disabled = true;
    message.textContent = "Submitting your enquiry...";

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(booking)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Submission failed.");
      }

      message.textContent =
        `Enquiry received! Reference: ${result.bookingId}`;
      bookingForm.reset();

    } catch (error) {
      message.textContent = error.message;
    } finally {
      submitButton.disabled = false;
    }
  });
}
