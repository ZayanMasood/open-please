(() => {
  "use strict";

  const html = document.documentElement;
  const body = document.body;

  /* -----------------------------
     Theme
  ----------------------------- */

  const themeButton = document.querySelector(".theme-toggle");

  const savedTheme = localStorage.getItem("open-please-theme");

  if (savedTheme === "dark" || savedTheme === "light") {
    html.dataset.theme = savedTheme;
  }

  themeButton?.addEventListener("click", () => {
    const nextTheme =
      html.dataset.theme === "dark" ? "light" : "dark";

    html.dataset.theme = nextTheme;
    localStorage.setItem("open-please-theme", nextTheme);
  });


  /* -----------------------------
     Mobile menu
  ----------------------------- */

  const menuButton = document.querySelector(".menu-toggle");
  const mobileMenu = document.querySelector(".mobile-menu");

  function closeMenu() {
    if (!menuButton || !mobileMenu) return;

    menuButton.setAttribute("aria-expanded", "false");
    mobileMenu.hidden = true;
    body.classList.remove("menu-open");
  }

  menuButton?.addEventListener("click", () => {
    const isOpen =
      menuButton.getAttribute("aria-expanded") === "true";

    menuButton.setAttribute(
      "aria-expanded",
      String(!isOpen)
    );

    mobileMenu.hidden = isOpen;
    body.classList.toggle("menu-open", !isOpen);
  });

  mobileMenu?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });


  /* -----------------------------
     Reveal on scroll
  ----------------------------- */

  const revealItems =
    document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {

    const observer = new IntersectionObserver(
      (entries, observerInstance) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("visible");
          observerInstance.unobserve(entry.target);
        });
      },
      {
        threshold: 0.12,
      }
    );

    revealItems.forEach((item) => {
      observer.observe(item);
    });

  } else {

    revealItems.forEach((item) => {
      item.classList.add("visible");
    });

  }


  /* -----------------------------
     Contact form
  ----------------------------- */

  const form = document.querySelector("#contact-form");
  const toast = document.querySelector(".toast");

  function showToast(message) {
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("show");

    window.setTimeout(() => {
      toast.classList.remove("show");
    }, 4500);
  }

  form?.addEventListener("submit", (event) => {
    event.preventDefault();

    const email =
      body.dataset.contactEmail;

    if (!email || email.includes("REPLACE_WITH")) {
      showToast(
        "Please contact Open Please by email."
      );
      return;
    }

    const formData = new FormData(form);

    const name =
      String(formData.get("name") || "").trim();

    const sender =
      String(formData.get("email") || "").trim();

    const interest =
      String(formData.get("interest") || "").trim();

    const message =
      String(formData.get("message") || "").trim();

    const subject =
      `Open Please inquiry — ${interest}`;

    const bodyText =
`Name: ${name}

Email: ${sender}

Interested in: ${interest}

Message:
${message}`;

    const mailto =
      `mailto:${encodeURIComponent(email)}` +
      `?subject=${encodeURIComponent(subject)}` +
      `&body=${encodeURIComponent(bodyText)}`;

    window.location.href = mailto;

    showToast(
      "Your email application should open now."
    );
  });


  /* -----------------------------
     Footer year
  ----------------------------- */

  const year = document.querySelector("#year");

  if (year) {
    year.textContent =
      new Date().getFullYear();
  }


  /* -----------------------------
     Close menu on resize
  ----------------------------- */

  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) {
      closeMenu();
    }
  });

})();
