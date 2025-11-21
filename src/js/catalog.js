// Проверяем что мы на catalog.html
if (window.location.pathname.includes("catalog")) {
  const catalogMenu = document.querySelector(".catalog-menu");

  if (catalogMenu) {
    catalogMenu.addEventListener("mouseenter", () => {
      catalogMenu.classList.add("show-dropdown");
    });

    catalogMenu.addEventListener("mouseleave", () => {
      catalogMenu.classList.remove("show-dropdown");
    });
  }
} else {
  // На других страницах dropdown удаляем
  const dropdown = document.querySelector(".catalog-dropdown");
  if (dropdown) dropdown.remove();
}
