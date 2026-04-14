
// Venue images lookup table
const venueImages = {
  "The Globe": "https://gigupnorth.github.io/gigupnorth/images/globe.jpg",
  "Downcast": "https://gigupnorth.github.io/gigupnorth/images/downcast.jpg",
  "Independent": "https://gigupnorth.github.io/gigupnorth/images/independent.jpg",
   "The Studio": "https://gigupnorth.github.io/gigupnorth/images/studio.jpeg",
  "Anarchy Brew": "https://gigupnorth.github.io/gigupnorth/images/anarchy.jpeg",
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
  "BLACK BULL": "https://gigupnorth.github.io/gigupnorth/images/blackb.jpg",
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
   "Georgian Theatre": "https://gigupnorth.github.io/gigupnorth/images/george.jpeg",
  "Red": "https://gigupnorth.github.io/gigupnorth/images/red.jpeg",
};
let currentView = "cards"; // "cards" or "text"
let cachedEvents = [];

const DATA_URL = "https://script.googleusercontent.com/macros/echo?user_content_key=AWDtjMUO0zHzz3R8HcA9qi4m2a-TYhCsM3V-PpaOtrhoZ-Gauy2M5MtvdeYbAejv2wySLFts8mlxD6zzPQk3BgVvTpAF7bGRTWSsqSlypgCQGKyYpbwTuqaFi4x2FG8eNKgVPeNYU5EASTzZmo7RgcGsoW4et611NOqTA2reH_2pR5y3mzmBElvm0va4Jyjjy55GD5eP8UCKY3eIAkGTME2iTh2im0pkHZ6uS7rIx5oSUnvrMZyfIYzKHTIjhYHGzwyfpfamPWRg1aeFhBKV4sNKkhWoncf8R59YQd5cX6py&lib=MkZMWNRlE8Gssf6ZnwbShhlx9cXOLXORo";

const COLOUR_ORDER = ["blue", "green", "orange", "red", "black"];

/* ---------------------------
   INIT
----------------------------*/
document.addEventListener("DOMContentLoaded", () => {
  loadData();

  const btn = document.getElementById("view-toggle");

  if (!btn) {
    console.error("view-toggle button not found");
    return;
  }

  btn.setAttribute("aria-pressed", "false");

  btn.addEventListener("click", () => {
    if (currentView === "cards") {
      currentView = "text";
      renderTextView(cachedEvents);
      btn.textContent = "Card View";
    } else {
      currentView = "cards";
      renderEvents(cachedEvents);
      btn.textContent = "Text View";
    }

    btn.setAttribute("aria-pressed", currentView === "text");
  });
});

/* ---------------------------
   DATA
----------------------------*/
async function loadData() {
  try {
    const res = await fetch(DATA_URL);
    const data = await res.json();

    cachedEvents = data;
    renderEvents(data);
  } catch (err) {
    console.error(err);
  }
}

/* ---------------------------
   CARD VIEW
----------------------------*/
function renderEvents(events) {
  const container = document.getElementById("cards-view");
  container.innerHTML = "";

  const sortedEvents = [...events].sort(
    (a, b) => parseDate(a.date) - parseDate(b.date)
  );

  const grouped = {};

  sortedEvents.forEach(ev => {
    const dateKey = ev.date;
    if (!grouped[dateKey]) grouped[dateKey] = [];
    grouped[dateKey].push(ev);
  });

  Object.keys(grouped).forEach(date => {
    const bar = document.createElement("div");
    bar.className = "date-bar";
    bar.textContent = date;
    container.appendChild(bar);

    grouped[date].sort((a, b) => {
      return (
        COLOUR_ORDER.indexOf((a.colour || "").toLowerCase()) -
        COLOUR_ORDER.indexOf((b.colour || "").toLowerCase())
      );
    });

    grouped[date].forEach(ev => {
      container.appendChild(createCard(ev));
    });
  });

  initLazyLoad();
}

/* ---------------------------
   TEXT VIEW
----------------------------*/
function renderTextView(events) {
  const container = document.getElementById("cards-view");
  container.innerHTML = "";

  const sortedEvents = [...events].sort(
    (a, b) => parseDate(a.date) - parseDate(b.date)
  );

  const grouped = {};

  sortedEvents.forEach(ev => {
    const dateKey = ev.date;
    if (!grouped[dateKey]) grouped[dateKey] = [];
    grouped[dateKey].push(ev);
  });

  Object.keys(grouped).forEach(date => {
    const header = document.createElement("div");
    header.className = "date-bar";
    header.textContent = date;
    container.appendChild(header);

    grouped[date].sort((a, b) => {
      return (
        COLOUR_ORDER.indexOf((a.colour || "").toLowerCase()) -
        COLOUR_ORDER.indexOf((b.colour || "").toLowerCase())
      );
    });

    grouped[date].forEach(ev => {
      const row = document.createElement("div");
      row.className = "text-row";

      row.innerHTML = `
        <span class="text-title">${ev.title || ""}</span>
        <span class="text-venue">${ev.venue || ""}</span>
        <span class="text-time">${ev.time || ""}</span>
        <span class="text-price">${ev.price || ""}</span>
      `;

      container.appendChild(row);
    });
  });
}

/* ---------------------------
   CARD CREATION
----------------------------*/
function createCard(ev) {
  const card = document.createElement("div");
  card.className = `card ${ev.colour?.toLowerCase() || ""}`;

  let image = "";

  const override = ev.imageOverride?.trim();
  const venueKey = ev.venue?.trim();

  if (override && override.startsWith("http")) {
    image = override;
  } else if (venueImages && venueImages[venueKey]) {
    image = venueImages[venueKey];
  } else {
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

/* ---------------------------
   DATE PARSER
----------------------------*/
function parseDate(str) {
  return new Date(str.replace(/^[A-Za-z]{3} /, ""));
}

/* ---------------------------
   LAZY LOAD IMAGES
----------------------------*/
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
