function toggleMobileMenu() {
  const mobileMenu = document.getElementById("mobileMenu");
  const menuBtn = document.querySelector(".mobile-menu-btn");
  const svg = menuBtn.querySelector("svg");

  mobileMenu.classList.toggle("show");

  if (mobileMenu.classList.contains("show")) {
    svg.innerHTML =
      '<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>';
  } else {
    svg.innerHTML =
      '<path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/>';
  }
}

document.addEventListener("click", function (event) {
  const mobileMenu = document.getElementById("mobileMenu");
  const menuBtn = document.querySelector(".mobile-menu-btn");
  const isClickInside =
    mobileMenu.contains(event.target) || menuBtn.contains(event.target);

  if (!isClickInside && mobileMenu.classList.contains("show")) {
    mobileMenu.classList.remove("show");
    const svg = menuBtn.querySelector("svg");
    svg.innerHTML =
      '<path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/>';
  }
});

window.addEventListener("resize", function () {
  if (window.innerWidth > 768) {
    const mobileMenu = document.getElementById("mobileMenu");
    const menuBtn = document.querySelector(".mobile-menu-btn");
    const svg = menuBtn.querySelector("svg");

    mobileMenu.classList.remove("show");
    svg.innerHTML =
      '<path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/>';
  }
});
