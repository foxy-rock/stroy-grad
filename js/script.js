/* ====== Шапка при скролле ====== */
const header = document.getElementById("header");
const logoPrimary = document.querySelector(".logo__primary");
window.addEventListener("scroll", () => {
  header.classList.toggle("scrolled", window.scrollY > 40);
  logoPrimary.style.color = "#10151f";

  if (window.scrollY < 40) {
    logoPrimary.style.color = "white";
  }
});

/* ====== Бургер-меню ====== */
const burgerSpan = document.querySelectorAll(".burger__span");
const burger = document.getElementById("burger");
const nav = document.getElementById("nav");
burger.addEventListener("click", () => {
  nav.classList.toggle("open");
  burgerSpan.forEach((span) => {
    span.style.background = nav.classList.contains("open")
      ? "white"
      : "#232b3a";
  });
});
nav
  .querySelectorAll("a")
  .forEach((a) =>
    a.addEventListener("click", () => nav.classList.remove("open")),
  );

/* ====== Анимация появления блоков ====== */
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          setTimeout(() => e.target.classList.add("visible"), i * 60);
          observer.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12 },
  );
  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
} else {
  document
    .querySelectorAll(".reveal")
    .forEach((el) => el.classList.add("visible"));
}

/* ====== Счётчики на главном экране ====== */
const counters = document.querySelectorAll("[data-count]");
if ("IntersectionObserver" in window) {
  const counterObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target,
          target = +el.dataset.count,
          dur = 1600,
          t0 = performance.now();
        const tick = (now) => {
          const p = Math.min((now - t0) / dur, 1);
          el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        counterObs.unobserve(el);
      });
    },
    { threshold: 0.5 },
  );
  counters.forEach((c) => counterObs.observe(c));
} else {
  counters.forEach((c) => (c.textContent = c.dataset.count));
}

/* ====== Фильтр проектов ====== */
const filterBtns = document.querySelectorAll(".filter__btn");
const projects = document.querySelectorAll(".project");
filterBtns.forEach((btn) =>
  btn.addEventListener("click", () => {
    filterBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    const f = btn.dataset.filter;
    projects.forEach((p) =>
      p.classList.toggle("hidden", f !== "all" && p.dataset.cat !== f),
    );
  }),
);

/* ====== Калькулятор ====== */
const calcType = document.getElementById("calcType");
const calcArea = document.getElementById("calcArea");
const calcKit = document.getElementById("calcKit");
const calcPrice = document.getElementById("calcPrice");
const areaOut = document.getElementById("areaOut");
const fmt = (n) =>
  new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 0 }).format(n) + " ₽";

function updateCalc() {
  if (!calcType || !calcArea || !calcKit || !calcPrice || !areaOut) return;
  areaOut.textContent = calcArea.value;
  const price =
    Number(calcType.value) * Number(calcArea.value) * Number(calcKit.value);
  calcPrice.textContent = fmt(price);
}
[calcType, calcArea, calcKit].filter(Boolean).forEach((el) => {
  el.addEventListener("input", updateCalc);
  el.addEventListener("change", updateCalc);
});
updateCalc();

/* ====== Табы материалов ====== */
const tabBtns = document.querySelectorAll(".tabs__btn");
const tabs = document.querySelectorAll(".tab");
tabBtns.forEach((btn) =>
  btn.addEventListener("click", () => {
    tabBtns.forEach((b) => b.classList.remove("active"));
    tabs.forEach((t) => t.classList.remove("active"));
    btn.classList.add("active");
    tabs[btn.dataset.tab].classList.add("active");
  }),
);

/* ====== Слайдер отзывов ====== */
const track = document.getElementById("sliderTrack");
const slides = track.children.length;
const dotsBox = document.getElementById("sliderDots");

let cur = 0;

const visibleSlides = 2;
const maxSlide = Math.max(0, slides - visibleSlides);

for (let i = 0; i <= maxSlide; i++) {
  const d = document.createElement("span");

  if (i === 0) d.classList.add("active");

  d.addEventListener("click", () => go(i));

  dotsBox.appendChild(d);
}

function go(i) {
  cur = (i + maxSlide + 1) % (maxSlide + 1);

  track.style.transform = `translateX(-${cur * 50}%)`;

  dotsBox.querySelectorAll("span").forEach((d, n) => {
    d.classList.toggle("active", n === cur);
  });
}

document
  .getElementById("prevSlide")
  .addEventListener("click", () => go(cur - 1));

document
  .getElementById("nextSlide")
  .addEventListener("click", () => go(cur + 1));

let auto = setInterval(() => go(cur + 1), 6000);

document
  .getElementById("reviewsSlider")
  .addEventListener("mouseenter", () => clearInterval(auto));

document.getElementById("reviewsSlider").addEventListener("mouseleave", () => {
  clearInterval(auto);
  auto = setInterval(() => go(cur + 1), 6000);
});

/* ======== Демо-обработка формы ======== */
document.querySelectorAll("[data-form]").forEach((form) => {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    if (!btn) return;
    const old = btn.innerHTML;
    const input = form.querySelector('input[type="tel"]');
    btn.innerHTML = "✓ Спасибо! Мы скоро позвоним";
    btn.disabled = true;
    form.reset();
    if (input) input.focus();
    setTimeout(() => {
      btn.innerHTML = old;
      btn.disabled = false;
    }, 4000);
  });
});
