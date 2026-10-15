/* ZKO site script. No external libraries. */

/* ------------------------------------------------------------------
   FORM CONFIGURATION
   By default the form submits to Netlify Forms (works automatically
   once the site is deployed on Netlify; see README.md).

   To use a different form service instead (e.g. Formspree), paste its
   endpoint URL below. Leave as "" to use Netlify Forms.
   Never put secret API keys here: this file is public.
------------------------------------------------------------------- */
const FORM_ENDPOINT = "";

document.documentElement.classList.remove("no-js");

/* Footer year */
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* Mobile menu */
const toggle = document.getElementById("navToggle");
const menu = document.getElementById("navMenu");
function setMenu(open) {
  menu.classList.toggle("open", open);
  toggle.setAttribute("aria-expanded", String(open));
  toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
}
toggle.addEventListener("click", () => setMenu(!menu.classList.contains("open")));
menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });

/* Active nav link on scroll */
const links = [...document.querySelectorAll('.nav__menu ul a')];
const sections = links.map((a) => document.querySelector(a.getAttribute("href"))).filter(Boolean);
if ("IntersectionObserver" in window) {
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        links.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + entry.target.id));
      }
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  sections.forEach((s) => spy.observe(s));
}

/* Reveal on scroll */
const reveals = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  reveals.forEach((el, i) => {
    el.style.transitionDelay = (i % 3) * 80 + "ms";
    io.observe(el);
  });
} else {
  reveals.forEach((el) => el.classList.add("visible"));
}

/* Contact form */
const form = document.getElementById("contactForm");
const statusEl = document.getElementById("formStatus");
const submitBtn = document.getElementById("submitBtn");

const rules = {
  name: { el: "name", err: "name-error", msg: "Please enter your name." },
  business: { el: "business", err: "business-error", msg: "Please enter your business name." },
  email: { el: "email", err: "email-error", msg: "Please enter a valid email address." },
  type: { el: "type", err: "type-error", msg: "Please tell us your type of business." },
  needs: { el: "needs", err: "needs-error", msg: "Please tell us what you need on your website." },
};

function setError(input, errId, message) {
  const field = input.closest(".field");
  document.getElementById(errId).textContent = message;
  field.classList.toggle("invalid", Boolean(message));
  input.setAttribute("aria-invalid", message ? "true" : "false");
}

function validate() {
  let firstBad = null;
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  for (const key in rules) {
    const r = rules[key];
    const input = document.getElementById(r.el);
    const value = input.value.trim();
    let bad = !value;
    if (key === "email" && value) bad = !emailOk.test(value);
    setError(input, r.err, bad ? r.msg : "");
    if (bad && !firstBad) firstBad = input;
  }
  const phone = document.getElementById("phone");
  const pv = phone.value.trim();
  const phoneBad = pv && !/^[0-9+()\-.\s]{7,20}$/.test(pv);
  setError(phone, "phone-error", phoneBad ? "Please enter a valid phone number, or leave it blank." : "");
  if (phoneBad && !firstBad) firstBad = phone;
  if (firstBad) firstBad.focus();
  return !firstBad;
}

function showStatus(type, text) {
  statusEl.className = "form-status " + type;
  statusEl.textContent = text;
}

form.addEventListener("input", (e) => {
  const id = e.target.id;
  const field = e.target.closest(".field");
  if (field && field.classList.contains("invalid")) {
    const err = document.getElementById(id + "-error") || document.getElementById(
      Object.values(rules).find((r) => r.el === id)?.err || ""
    );
    if (err) err.textContent = "";
    field.classList.remove("invalid");
  }
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  statusEl.className = "form-status";
  statusEl.textContent = "";
  if (!validate()) return;

  // Honeypot: bots fill this in; real people never see it.
  if (form.elements["bot-field"].value) return;

  submitBtn.disabled = true;
  const originalLabel = submitBtn.textContent;
  submitBtn.textContent = "Sending...";

  try {
    const data = new FormData(form);
    let response;
    if (FORM_ENDPOINT) {
      response = await fetch(FORM_ENDPOINT, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
    } else {
      response = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(data).toString(),
      });
    }

    // Only show success when the server confirms it accepted the submission.
    if (response.ok) {
      form.reset();
      showStatus("success", "Thank you! Your request has been received. We'll be in touch soon.");
    } else {
      throw new Error("Status " + response.status);
    }
  } catch (err) {
    showStatus(
      "fail",
      "Sorry, your message could not be sent. Please try again in a moment, or contact us by email directly."
    );
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = originalLabel;
  }
});
