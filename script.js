
// Venue images lookup table
const venueImages = {
  "The Globe": "https://gigupnorth.github.io/gigupnorth/images/globe.jpg",
  "Independent": "https://gigupnorth.github.io/gigupnorth/images/Independent.jpg",
   "The Studio": "https://gigupnorth.github.io/gigupnorth/images/studio.jpg",
  "Anarchy Brew": "https://gigupnorth.github.io/gigupnorth/images/anarchy.jpg",
  "Trillians": "https://gigupnorth.github.io/gigupnorth/images/trillians.jpg",
  "NE Volume Bar": "https://gigupnorth.github.io/gigupnorth/images/nevolume.jpg",
  "Cobalt Studios": "https://gigupnorth.github.io/gigupnorth/images/cobalt.jpg",
  "The Cluny": "https://gigupnorth.github.io/gigupnorth/images/cluny1.jpg",
  "Little Buildings": "https://gigupnorth.github.io/gigupnorth/images/littlb.jpg",
   "The Forum": "https://gigupnorth.github.io/gigupnorth/images/forumm.jpg",
   "Billy Bootleggers": "https://gigupnorth.github.io/gigupnorth/images/billy.jpg",
  "The White Room Music Cafe": "https://gigupnorth.github.io/gigupnorth/images/whiter.jpg",
  "Cafe Etch": "https://gigupnorth.github.io/gigupnorth/images/etch.jpg",
  "The Cumberland Arms": "https://gigupnorth.github.io/gigupnorth/images/cumberland.jpg",
  "Black Bull": "https://gigupnorth.github.io/gigupnorth/images/blackb.jpg",
  "Cluny 2": "https://gigupnorth.github.io/gigupnorth/images/cluny2.jpg",
  "The Grove": "https://gigupnorth.github.io/gigupnorth/images/grove.jpg",
  "Pop Recs": "https://gigupnorth.github.io/gigupnorth/images/pop.jpg",
  "O2 City Hall": "https://gigupnorth.github.io/gigupnorth/images/o2.jpg",
  "ZeroX": "https://gigupnorth.github.io/gigupnorth/images/zerox.jpg",
    "The Bunker": "https://gigupnorth.github.io/gigupnorth/images/bunker.jpg",
  "The Central": "https://gigupnorth.github.io/gigupnorth/images/central.jpg",
   "The Lubber Fiend": "https://gigupnorth.github.io/gigupnorth/images/lubber.jpg",
   "NX": "https://gigupnorth.github.io/gigupnorth/images/nxnew.jpg",
   "Pealie's Barn": "https://gigupnorth.github.io/gigupnorth/images/pealie.jpg",
   "Dovecot Bar": "https://gigupnorth.github.io/gigupnorth/images/dovecot.jpg",
   "Boiler Shop": "https://gigupnorth.github.io/gigupnorth/images/boiler.jpg",
   "Salt Market Social": "https://gigupnorth.github.io/gigupnorth/images/salt.jpg",
   "Station East": "https://gigupnorth.github.io/gigupnorth/images/statione.jpg",
   "Star and Shadow": "https://gigupnorth.github.io/gigupnorth/images/starands.jpg",
  "The Quakerhouse": "https://gigupnorth.github.io/gigupnorth/images/quaker.jpg",
  "Wylam Brewery": "https://gigupnorth.github.io/gigupnorth/images/wylam.jpg",
    "The Angel": "https://gigupnorth.github.io/gigupnorth/images/angel.jpg",
  "The Fire Station": "https://gigupnorth.github.io/gigupnorth/images/fire.jpg",
   "Georgian Theatre": "https://gigupnorth.github.io/gigupnorth/images/george.jpg",
  "Red": "https://gigupnorth.github.io/gigupnorth/images/red.jpg",
};

const DATA_URL = "https://script.googleusercontent.com/macros/echo?user_content_key=AWDtjMUO0zHzz3R8HcA9qi4m2a-TYhCsM3V-PpaOtrhoZ-Gauy2M5MtvdeYbAejv2wySLFts8mlxD6zzPQk3BgVvTpAF7bGRTWSsqSlypgCQGKyYpbwTuqaFi4x2FG8eNKgVPeNYU5EASTzZmo7RgcGsoW4et611NOqTA2reH_2pR5y3mzmBElvm0va4Jyjjy55GD5eP8UCKY3eIAkGTME2iTh2im0pkHZ6uS7rIx5oSUnvrMZyfIYzKHTIjhYHGzwyfpfamPWRg1aeFhBKV4sNKkhWoncf8R59YQd5cX6py&lib=MkZMWNRlE8Gssf6ZnwbShhlx9cXOLXORo";

const COLOUR_ORDER = ["blue", "green", "orange", "red", "black"];

document.addEventListener("DOMContentLoaded", loadData);

async function loadData() {
  try {
    const res = await fetch(DATA_URL);
    const data = await res.json();

    console.log("DATA:", data);

    renderEvents(data);
  } catch (err) {
    console.error(err);
  }
}

function renderEvents(events) {
  const container = document.getElementById("cards-view");
  container.innerHTML = "";

  // 🔹 sort by parsed date
  events.sort((a, b) => parseDate(a.date) - parseDate(b.date));

  // 🔹 group by date string
  const grouped = {};

  events.forEach(ev => {
    const dateKey = ev.date;

    if (!grouped[dateKey]) grouped[dateKey] = [];
    grouped[dateKey].push(ev);
  });

  Object.keys(grouped).forEach(date => {

    // 🔸 DATE BAR
    const bar = document.createElement("div");
    bar.className = "date-bar";
    bar.textContent = date;
    container.appendChild(bar);

    // 🔸 sort by colour
    grouped[date].sort((a, b) => {
      return COLOUR_ORDER.indexOf((a.colour || "").toLowerCase()) -
             COLOUR_ORDER.indexOf((b.colour || "").toLowerCase());
    });

    // 🔸 cards
    grouped[date].forEach(ev => {
      container.appendChild(createCard(ev));
    });

  });

  initLazyLoad();
}

function createCard(ev) {
  const card = document.createElement("div");
  card.className = `card ${ev.colour?.toLowerCase() || ""}`;

let image = "";

// Clean values
const override = ev.imageOverride?.trim();
const venueKey = ev.venue?.trim();

// 1. Use override ONLY if it's a real URL
if (override && override.startsWith("http")) {
  image = override;
} 
// 2. Otherwise use venue fallback
else if (venueImages[venueKey]) {
  image = venueImages[venueKey];
} 
// 3. Final fallback
else {
  image = "https://gigupnorth.github.io/gigupnorth/images/default.jpg";
}

  card.innerHTML = `
    <div class="card-inner">
      
      <div class="card-text">
        <h2>${ev.title || ""}</h2>
        <p>${ev.venue || ""}</p>

        <button class="more-btn">more</button>

        <div class="extra hidden">
          <p>${ev.date || ""}</p>
          <p>${ev.time || ""}</p>
          <p>${ev.price || ""}</p>
          <p>${ev.c6 || ""}</p>
          <p>${ev.extraInfo || ev.extra || ""}</p>
        </div>
      </div>

      <div class="card-image">
        ${image ? `<img data-src="${image}" alt="">` : ""}
      </div>

    </div>
  `;

  const btn = card.querySelector(".more-btn");
  const extra = card.querySelector(".extra");

  btn.addEventListener("click", () => {
    extra.classList.toggle("hidden");
    btn.textContent = extra.classList.contains("hidden") ? "more" : "less";
  });

  return card;
}

// 🔹 Convert "Fri 20 Mar 2026" → Date object
function parseDate(str) {
  return new Date(str);
}

// 🔹 Lazy loading
function initLazyLoad() {
  const imgs = document.querySelectorAll("img[data-src]");

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute("data-src");
        observer.unobserve(img);
      }
    });
  });

  imgs.forEach(img => observer.observe(img));
}
