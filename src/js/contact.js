
const emailInput = document.getElementById("email");
const emailError = document.getElementById("emailError");

emailInput.addEventListener("input", () => {
  const emailValue = emailInput.value.trim();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (emailValue === "") {
    emailError.style.display = "none";
    return;
  }

  if (!emailPattern.test(emailValue)) {
    emailError.textContent = "Invalid email format";
    emailError.style.display = "block";
  } else {
    emailError.style.display = "none";
  }
});

const form = document.getElementById("contactForm");
const statusBox = document.getElementById("formStatus");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = emailInput.value.trim();
  const topic = document.getElementById("topic").value.trim();
  const message = document.getElementById("message").value.trim();

  if (!name || !email || !topic || !message) {
    statusBox.textContent = "Please fill in all required fields.";
    statusBox.className = "form-status error";
    statusBox.style.display = "block";
    return;
  }

  if (emailError.style.display === "block") {
    statusBox.textContent = "Email format is incorrect.";
    statusBox.className = "form-status error";
    statusBox.style.display = "block";
    return;
  }
  statusBox.textContent = "Your message has been successfully sent!";
  statusBox.className = "form-status success";
  statusBox.style.display = "block";

  form.reset();
});
