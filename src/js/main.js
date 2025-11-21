//Modal login

const loginModal = document.getElementById("loginModal");
const userIcon = document.querySelector(".account-icon"); 
const closeBtn = document.querySelector(".login-close");
const loginForm = document.getElementById("loginForm");
const togglePassword = document.getElementById('togglePassword');
const passwordInput = document.getElementById('loginPassword');

loginModal.style.display = "none";


document.addEventListener("DOMContentLoaded", () => {
  const savedUser = localStorage.getItem("loggedUser");
  if (savedUser) {
    setUserCircle(savedUser);
    userIcon.classList.add("logged-in");
  }
});


userIcon.addEventListener("click", (e) => {
  e.preventDefault();
  if (userIcon.classList.contains("logged-in")) {

    if (confirm("Вы уверены, что хотите выйти?")) {
      logoutUser();
    }
  } else {
    loginModal.style.display = "flex";
  }
});

closeBtn.addEventListener("click", () => {
  loginModal.style.display = "none";
});

loginModal.addEventListener("click", (e) => {
  if (e.target === loginModal) loginModal.style.display = "none";
});

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value.trim();
  const emailPattern = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z]+$/;


  if (!emailPattern.test(email)) {
    alert("Email должен быть в формате test@domain.com.");
    return;
  }

  if (password.length < 4) {
    alert("Пароль должен быть не менее 4 символов.");
    return;
  }

  localStorage.setItem("loggedUser", email);

  setUserCircle(email);
  userIcon.classList.add("logged-in");

  loginModal.style.display = "none";
});

togglePassword.addEventListener('click', () => {
  const type = passwordInput.type === 'password' ? 'text' : 'password';
  passwordInput.type = type;
});

function setUserCircle(email) {
  const firstLetter = email.charAt(0).toUpperCase();
  userIcon.textContent = firstLetter;
  userIcon.style.display = "flex";
  userIcon.style.alignItems = "center";
  userIcon.style.justifyContent = "center";
  userIcon.style.width = "40px";
  userIcon.style.height = "40px";
  userIcon.style.borderRadius = "50%";
  userIcon.style.backgroundColor = "#ec4c84";
  userIcon.style.color = "#fff";
  userIcon.style.fontWeight = "bold";
  userIcon.style.fontSize = "18px";
  userIcon.style.cursor = "pointer";
}

function logoutUser() {
  localStorage.removeItem("loggedUser");
  userIcon.classList.remove("logged-in");
  userIcon.innerHTML = `<img src="./src/assets/images/account.svg" alt="Account">`;
  userIcon.style.cssText = ""; 
}
