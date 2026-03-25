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

/* ---------------------------------------------
   GLOBALS
--------------------------------------------- */
let gigs = [];             // All fetched gigs
let lazyList = [];         // Filtered gigs for lazy loading
let Index = 0;             // Current position in lazy load
const CHUNK_SIZE = 40;     // How many gigs to render per scroll
let lazyActive = false;    
let scrollAttached = false;
let lastRenderedDate = null;
let currentAreaFilters = ["Darlo","Durham","Middlesbrough","Newcastle","Sunderland"];
let currentView = "cards"; // "cards" or "text"


/* ---------------------------------------------
   FETCH & INITIALIZE
--------------------------------------------- */
async function loadGigs() {
  const url = "https://script.google.com/macros/s/AKfycbwQai3AEldoeZlXj6PNjqWauaJn2vShdPDMcR3DeDz1DyEDh_tOJ7o152QHrvxF4oA4rw/exec";

  let res = await fetch(url);

  if (!res.ok) {
    await new Promise(r => setTimeout(r, 1000));
    res = await fetch(url);
  }

  const all = await res.json();

  // Filter out past gigs
  const today = new Date();
  today.setHours(0,0,0,0);

  gigs = all.filter(g => {
    if (!g.date) return false;
    const gigDate = parseGigDate(g.date);
    return gigDate >= today;
  });

  // Sort by date ascending
  gigs.sort((a,b) => new Date(a.date) - new Date(b.date));

  // Initialize filters and view
  applyFilters();
  setupAreaButtons();
  setupViewToggle();
}


/* ---------------------------------------------
   PARSE DATE (from your API format)
--------------------------------------------- */
function parseGigDate(dateStr) {
  return new Date(dateStr);
}


/* ---------------------------------------------
   AREA FILTERS
--------------------------------------------- */
function setupAreaButtons() {
  const keys = document.querySelectorAll(".area-key .key");
  keys.forEach(key => {
    key.addEventListener("click", () => {
      const area = key.dataset.area;
      if (currentAreaFilters.includes(area)) {
        currentAreaFilters = currentAreaFilters.filter(a => a !== area);
        key.classList.add("hidden-area");
      } else {
        currentAreaFilters.push(area);
        key.classList.remove("hidden-area");
      }
      applyFilters();
    });
  });
}


/* ---------------------------------------------
   VIEW TOGGLE
--------------------------------------------- */
function setupViewToggle() {
  document.querySelector(".view-cards-btn").addEventListener("click", () => {
    currentView = "cards";
    document.querySelector(".view-cards-btn").classList.add("active");
    document.querySelector(".view-text-btn").classList.remove("active");
    applyFilters();
  });

  document.querySelector(".view-text-btn").addEventListener("click", () => {
    currentView = "text";
    document.querySelector(".view-text-btn").classList.add("active");
    document.querySelector(".view-cards-btn").classList.remove("active");
    applyFilters();
  });
}


/* ---------------------------------------------
   APPLY FILTERS & INIT LAZY OR TEXT
--------------------------------------------- */
function applyFilters() {
  // Filter gigs by selected areas
  lazyList = gigs.filter(g => currentAreaFilters.includes(g.area));

  // Reset lazy load index and date
  Index = 0;
  lastRenderedDate = null;

  const cardsContainer = document.getElementById("cards-view");
  const textContainer = document.getElementById("text-view");
  cardsContainer.innerHTML = "";
  textContainer.innerHTML = "";

  if (currentView === "cards") {
    cardsContainer.style.display = "flex";
    textContainer.style.display = "none";
    lazyActive = true;
    NextChunk();
    if (!scrollAttached) {
      window.addEventListener("scroll", handleLazyScroll);
      scrollAttached = true;
    }
  } else {
    cardsContainer.style.display = "none";
    textContainer.style.display = "block";
    renderTextView();
  }
}


/* ---------------------------------------------
   LAZY SCROLL HANDLER
--------------------------------------------- */
function handleLazyScroll() {
  if (!lazyActive) return;

  const scrollPosition = window.scrollY + window.innerHeight;
  const container = document.getElementById("cards-view");
  const threshold = container.offsetTop + container.offsetHeight - 200;

  if (scrollPosition >= threshold) {
    NextChunk();
  }
}


/* ---------------------------------------------
   LAZY RENDER NEXT CHUNK
--------------------------------------------- */
function NextChunk() {
  if (!lazyActive) return;

  const container = document.getElementById("cards-view");
  const slice = lazyList.slice(Index, Index + CHUNK_SIZE);

  slice.forEach(g => {
    const thisDate = g.date;

    // Insert date header if new
    if (thisDate !== lastRenderedDate) {
      const header = document.createElement("div");
      header.className = "gig-date-header sticky"; // sticky class added
      header.textContent = formatDateHeading(thisDate);
      container.appendChild(header);
      lastRenderedDate = thisDate;
    }

    const card = buildCard(g);
    container.appendChild(card);
  });

  Index += CHUNK_SIZE;

  if (Index >= lazyList.length) {
    lazyActive = false;
  }
}


/* ---------------------------------------------
   CREATE A GIG CARD
--------------------------------------------- */
function buildCard(g) {
  const card = document.createElement("div");
  card.className = "gig-card";
  card.dataset.colour = g.colour || "blue";

  const inner = document.createElement("div");
  inner.className = "gig-card-inner";

  // LEFT SIDE TEXT
  const textWrapper = document.createElement("div");
  textWrapper.className = "gig-card-text gig-text-wrapper";
  textWrapper.innerHTML = `
    <div class="gig-title"><strong>${g.title}</strong></div>
    <div class="gig-venue">${g.venue}</div>
    <div class="gig-time">${g.time || ""}</div>
    <div class="gig-price">${g.price || ""}</div>
  `;

  // RIGHT SIDE IMAGE
  const imgDiv = document.createElement("div");
  imgDiv.className = "gig-card-image";
  imgDiv.style.backgroundImage = `url('${g.image || "images/placeholder.png"}')`;

  inner.appendChild(textWrapper);
  inner.appendChild(imgDiv);
  card.appendChild(inner);

  // Optional "more" button
  if (g.extra) {
    const btn = document.createElement("button");
    btn.className = "more-btn";
    btn.textContent = "more";
    btn.addEventListener("click", () => {
      alert(g.extra); // simple way; can be replaced with your expanded info
    });
    textWrapper.appendChild(btn);
  }

  return card;
}


/* ---------------------------------------------
   TEXT VIEW
--------------------------------------------- */
function renderTextView() {
  const container = document.getElementById("text-view");
  container.innerHTML = lazyList
    .map(g => `${g.date} - ${g.title} @ ${g.venue}`)
    .join("\n");
}


/* ---------------------------------------------
   DATE FORMATTER
--------------------------------------------- */
function formatDateHeading(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}


/* ---------------------------------------------
   INITIALIZE
--------------------------------------------- */
window.addEventListener("DOMContentLoaded", loadGigs);
