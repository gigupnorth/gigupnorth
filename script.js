
// Venue images lookup table
const venueImages = {
  "The Globe": "https://gigupnorth.github.io/gigupnorth/images/globe.jpg",
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

document.addEventListener("DOMContentLoaded", () => {
  loadData();
});

async function loadData() {
  try {
    const res = await fetch(DATA_URL);
    const data = await res.json();

    console.log("DATA:", data);

    renderEvents(data);
  } catch (err) {
    console.error("Error loading data:", err);
  }
}

function renderEvents(events) {
  const container = document.getElementById("cards-container");
  container.innerHTML = "";

  // sort by date
  events.sort((a, b) => new Date(a.date) - new Date(b.date));

  // group by date
  const grouped = {};
  events.forEach(ev => {
    const date = formatDate(ev.date);
    if (!grouped[date]) grouped[date] = [];
    grouped[date].push(ev);
  });

  // render each date group
  Object.keys(grouped).forEach(date => {

    // 🔹 date header
    const dateBar = document.createElement("div");
    dateBar.className = "date-bar";
    dateBar.textContent = date;
    container.appendChild(dateBar);

    // 🔹 sort inside date by colour order
    const dayEvents = grouped[date];
    dayEvents.sort((a, b) => {
      return COLOUR_ORDER.indexOf(a.colour?.toLowerCase()) -
             COLOUR_ORDER.indexOf(b.colour?.toLowerCase());
    });

    // 🔹 create cards
    dayEvents.forEach(ev => {
      const card = createCard(ev);
      container.appendChild(card);
    });

  });

  initLazyLoading();
}

function createCard(ev) {
  const card = document.createElement("div");
  card.className = `card ${ev.colour?.toLowerCase() || ""}`;

  card.innerHTML = `
    <div class="card-inner">
      
      <div class="card-text">
        <h2>${ev.title || ""}</h2>
        <p class="venue">${ev.venue || ""}</p>

        <button class="more-btn">more</button>

        <div class="extra hidden">
          <p>${ev.date || ""}</p>
          <p>${ev.time || ""}</p>
          <p>${ev.price || ""}</p>
          <p>${ev.area || ""}</p>
          <p>${ev.extra || ""}</p>
        </div>
      </div>

      <div class="card-image">
        <img data-src="${ev.image || ""}" alt="">
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

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB");
}

function initLazyLoading() {
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
