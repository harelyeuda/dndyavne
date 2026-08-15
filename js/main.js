// Mobile nav toggle
document.addEventListener("DOMContentLoaded", function () {
  var toggle = document.querySelector(".nav-toggle");
  var links = document.querySelector(".nav-links");

  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var isOpen = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    links.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  initContactForm();
  initRevealAnimations();
});

// Fade/slide in sections as they scroll into view
function initRevealAnimations() {
  var items = document.querySelectorAll(".reveal");
  if (!items.length) return;

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduceMotion || !("IntersectionObserver" in window)) {
    items.forEach(function (el) {
      el.classList.add("in-view");
    });
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );

  items.forEach(function (el) {
    observer.observe(el);
  });
}

// Contact form: validate, then hand off to the visitor's email client via mailto:
function initContactForm() {
  var form = document.getElementById("contact-form");
  if (!form) return;

  var statusBox = document.getElementById("form-status");
  var DESTINATION_EMAIL = "dndyavne@gmail.com";

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    var fields = {
      name: form.querySelector("#name"),
      email: form.querySelector("#email"),
      sessionType: form.querySelector("#session-type"),
      ageGroup: form.querySelector("#age-group"),
      partySize: form.querySelector("#party-size"),
      preferredDate: form.querySelector("#preferred-date"),
      message: form.querySelector("#message"),
    };

    var valid = true;

    Object.keys(fields).forEach(function (key) {
      var field = fields[key];
      if (!field) return;
      var wrapper = field.closest(".field");
      var isRequired = field.hasAttribute("required");
      var value = field.value.trim();

      var fieldValid = true;
      if (isRequired && value === "") {
        fieldValid = false;
      }
      if (field.type === "email" && value !== "") {
        var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(value)) fieldValid = false;
      }

      if (wrapper) {
        wrapper.classList.toggle("invalid", !fieldValid);
      }
      if (!fieldValid) valid = false;
    });

    if (!valid) {
      showStatus("נא למלא את השדות הנדרשים כראוי לפני השליחה.", "error");
      return;
    }

    var subject = "פנייה למפגש מאת " + fields.name.value.trim();
    var bodyLines = [
      "שם: " + fields.name.value.trim(),
      "אימייל: " + fields.email.value.trim(),
      "סוג מפגש: " + (fields.sessionType.value || "לא צוין"),
      "קבוצת גיל: " + (fields.ageGroup.value || "לא צוין"),
      "גודל קבוצה: " + (fields.partySize.value.trim() || "לא צוין"),
      "תאריכים מועדפים: " + (fields.preferredDate.value.trim() || "לא צוין"),
      "",
      "הודעה:",
      fields.message.value.trim(),
    ];

    var mailtoLink =
      "mailto:" +
      DESTINATION_EMAIL +
      "?subject=" +
      encodeURIComponent(subject) +
      "&body=" +
      encodeURIComponent(bodyLines.join("\n"));

    window.location.href = mailtoLink;

    showStatus(
      "תוכנת הדואר האלקטרוני שלכם אמורה להיפתח כעת עם ההודעה שלכם ממולאת מראש. אם שום דבר לא קרה, שלחו לנו אימייל ישירות לכתובת " +
        DESTINATION_EMAIL +
        ".",
      "success"
    );
    form.reset();
  });
}

function showStatus(message, type) {
  var statusBox = document.getElementById("form-status");
  if (!statusBox) return;
  statusBox.textContent = message;
  statusBox.className = "form-status show " + type;
}
