// Mobile menu functionality
document.addEventListener('DOMContentLoaded', function() {
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  
  if (mobileMenuToggle && navMenu) {
    mobileMenuToggle.addEventListener('click', function() {
      navMenu.classList.toggle('active');
      mobileMenuToggle.classList.toggle('active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
      if (!mobileMenuToggle.contains(event.target) && !navMenu.contains(event.target)) {
        navMenu.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
      }
    });

    // Close menu when window is resized to desktop size
    window.addEventListener('resize', function() {
      if (window.innerWidth > 768) {
        navMenu.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
      }
    });

    // Close menu when clicking on menu links
    const menuLinks = navMenu.querySelectorAll('a');
    menuLinks.forEach(link => {
      link.addEventListener('click', function() {
        navMenu.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
      });
    });
  }
});
