(function () {
  "use strict";

  // ---- Configuration -------------------------------------------------
  var WHATSAPP_NUMBER = "628551111109";
  var DEFAULT_MESSAGE =
    "Hello, I am interested in BRANZ Mega Kuningan as a luxury apartment in Jakarta. Please send me the latest price list, floor plans and available units.";

  function waLink(message) {
    return "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(message);
  }

  // ---- Wire up every plain WhatsApp CTA / FAB -------------------------
  document.querySelectorAll(".whatsapp-link").forEach(function (el) {
    el.setAttribute("href", waLink(DEFAULT_MESSAGE));
    el.setAttribute("target", "_blank");
    el.setAttribute("rel", "noopener");
  });

  // ---- Mobile nav toggle ------------------------------------------------
  var navToggle = document.getElementById("navToggle");
  var mainNav = document.getElementById("mainNav");
  if (navToggle && mainNav) {
    navToggle.addEventListener("click", function () {
      var isOpen = mainNav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
    mainNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mainNav.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // ---- Header shadow on scroll ------------------------------------------
  var header = document.getElementById("siteHeader");
  var lastScrolled = false;
  function onScroll() {
    var scrolled = window.scrollY > 12;
    if (scrolled !== lastScrolled && header) {
      header.style.boxShadow = scrolled ? "0 4px 18px rgba(18,38,31,0.1)" : "none";
      lastScrolled = scrolled;
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // ---- Unit plan tab viewer ----------------------------------------------
  var planData = {
    "3br":   { title: "3 Bedroom",              size: "\u00B1 136 m\u00B2", zone: "18 \u2013 36F", bath: "2", bed: "3" },
    "2br":   { title: "2 Bedroom",               size: "\u00B1 90 m\u00B2",  zone: "18 \u2013 36F", bath: "2", bed: "2" },
    "2brl":  { title: "2 Bedroom Large",          size: "\u00B1 110 m\u00B2", zone: "18 \u2013 36F", bath: "2", bed: "2" },
    "1br1":  { title: "1 Bedroom + 1",            size: "\u00B1 68 m\u00B2",  zone: "18 \u2013 36F", bath: "1", bed: "1+1" },
    "1br":   { title: "1 Bedroom",                size: "\u00B1 52 m\u00B2",  zone: "18 \u2013 36F", bath: "1", bed: "1" },
    "studio":{ title: "Studio",                   size: "\u00B1 32 m\u00B2",  zone: "18 \u2013 36F", bath: "1", bed: "Studio" }
  };

  var planTabs = document.querySelectorAll(".plan-tab");
  var specTitle = document.getElementById("planSpecTitle");
  var specSize = document.getElementById("planSpecSize");
  var specZone = document.getElementById("planSpecZone");
  var specBath = document.getElementById("planSpecBath");
  var specBed = document.getElementById("planSpecBed");

  planTabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      planTabs.forEach(function (t) { t.classList.remove("active"); });
      tab.classList.add("active");
      var data = planData[tab.getAttribute("data-plan")];
      if (!data) return;
      if (specTitle) specTitle.textContent = data.title;
      if (specSize) specSize.textContent = data.size;
      if (specZone) specZone.textContent = data.zone;
      if (specBath) specBath.textContent = data.bath;
      if (specBed) specBed.textContent = data.bed;
    });
  });

  // ---- Lead form -> build a WhatsApp message from the entered details ----
  var tourForm = document.getElementById("tourForm");
  var formNote = document.getElementById("formNote");

  var APPS_SCRIPT_URL = 'https://script.google.com/a/macros/onthesunrise.com/s/AKfycbxN8EqRrZH16_3KXrk5YpRCv1Q3P4urXPAZg_tUNDYMtwHKllCUxCjhiHqWIDt5GXyJsA/exec';

  if (tourForm) {
    tourForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var data = new FormData(tourForm);

      // Send lead data to Google Sheet
      var payload = {
        sheetGid:         '89055764',
        name:             data.get('name'),
        phone:            data.get('phone'),
        email:            data.get('email'),
        address:          data.get('address'),
        budget:     data.get('budget'),
        purpose: data.get('purpose'),
        payment:   data.get('payment'),
        viewingDate:     data.get('viewingDate'),
        viewingTime:     data.get('viewingTime')
      };

      var params = new URLSearchParams();
      params.append('data', JSON.stringify(payload));
      fetch(APPS_SCRIPT_URL, { method: 'POST', mode: 'no-cors', body: params });

      tourForm.reset();
      if (formNote) formNote.hidden = false;
    });
  }
})();
