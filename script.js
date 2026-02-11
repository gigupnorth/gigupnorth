// Venue images lookup table
const venueImages = {
  "The Globe": "https://gigupnorth.github.io/gigupnorth/images/globe.jpg",
  "Trillians": "https://gigupnorth.github.io/gigupnorth/images/trillians.jpg",
  "NE Volume Bar": "https://gigupnorth.github.io/gigupnorth/images/nevolume.jpg",
  "Cobalt Studios": "https://gigupnorth.github.io/gigupnorth/images/cobalt.jpg",
  "The Cluny": "https://gigupnorth.github.io/gigupnorth/images/cluny1.jpg",
  "Little Buildings": "https://gigupnorth.github.io/gigupnorth/images/littlb.jpg",
   "The Forum": "https://gigupnorth.github.io/gigupnorth/images/forumm.jpg",
   "Billy Bootleggers": "https://gigupnorth.github.io/gigupnorth/images/billy.jpg",
  "The White Room Music Cafe": "https://gigupnorth.github.io/gigupnorth/images/whiter.jpg",
  "Cafe Etch": "https://gigupnorth.github.io/gigupnorth/images/etch.jpg",
  "Cumberland Arms": "https://gigupnorth.github.io/gigupnorth/images/cumberland.jpg",
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
};


let gigs = [];
  const hiddenAreas = new Set();

  /* ---------------------------------------------
     LAZY  GLOBALS
  --------------------------------------------- */
  let lazyList = [];          // gigs currently being ed (after filters)
  let Index = 0;        // where we are in the list
  const CHUNK_SIZE = 40;      // tweak this if needed
  let lazyActive = false;     // prevents double-triggering
  let scrollAttached = false; // ensures only one scroll listener

async function loadGigs() {
  const url = "https://script.google.com/macros/s/AKfycbwQai3AEldoeZlXj6PNjqWauaJn2vShdPDMcR3DeDz1DyEDh_tOJ7o152QHrvxF4oA4rw/exec";

  // First attempt
  let res = await fetch(url);

  // If Google Apps Script is still waking up, retry once after 1 second
  if (!res.ok) {
    await new Promise(r => setTimeout(r, 1000));
    res = await fetch(url);
  }


  const all = await res.json();
gigs = all;
  // Continue with your existing logic
  // Filter out past gigs
const today = new Date();
today.setHours(0,0,0,0);

gigs = all.filter(g => {
  if (!g.date) return false;
  const gigDate = parseGigDate(g.date);
  return gigDate >= today;
});

// Start ing
startLazy(gigs);
Text(gigs);

// If you have a venue menu function
if (typeof buildVenueMenu === "function") {
  buildVenueMenu();
}

}



  




  function parseTime(t) {
    return t && t.startsWith("time-") ? t.replace("time-", "") : t;
  }

  /* ---------------------------------------------
     LAZY : START
  --------------------------------------------- */
  function startLazy(list) {
    const container = document.getElementById("cards-view");
    container.innerHTML = "";

    lazyList = list;
    Index = 0;
    lazyActive = true;

    NextChunk();

    if (!scrollAttached) {
      window.addEventListener("scroll", handleLazyScroll);
      scrollAttached = true;
    }
  }

  /* ---------------------------------------------
     LAZY : CHUNK ING
  --------------------------------------------- */
  function NextChunk() {
    if (!lazyActive) return;

    const container = document.getElementById("cards-view");
    const slice = lazyList.slice(Index, Index + CHUNK_SIZE);

    slice.forEach(g => {
      const card = buildCard(g);
      container.appendChild(card);
    });

    Index += CHUNK_SIZE;

    filterCardsByArea();

    if (renderIndex >= lazyList.length) {
      lazyActive = false;
    }
  }

  /* ---------------------------------------------
     LAZY RENDER: SCROLL TRIGGER
  --------------------------------------------- */
function handleLazyScroll() {
  if (!lazyActive) return;

  const scrollPos = window.innerHeight + window.scrollY;
  const threshold = document.body.offsetHeight - 800;

  if (scrollPos > threshold) {
    renderNextChunk();
  }
}



  /* ---------------------------------------------
     CARD BUILDER (unchanged except extracted)
  --------------------------------------------- */

function buildCard(g) {
  console.log("VENUE:", g.venue);

  const card = document.createElement("article");
  card.className = "gig-card";

  /* ---------------------------------------------
     IMAGE OVERRIDE LOGIC
  --------------------------------------------- */
  const overrideImg = g.imageOverride && g.imageOverride.trim();
  const venueImg = venueImages[g.venue] || "";
  const finalImg = overrideImg || venueImg;

  /* ---------------------------------------------
     COLOUR + AREA TAGGING
  --------------------------------------------- */
  const colour = (g.colour || "black").toString().trim().toLowerCase();
  card.dataset.colour = colour;

  const colourToArea = {
    blue: "Darlo",
    green: "Durham",
    orange: "Middlesbrough",
    black: "Newcastle",
    red: "Sunderland"
  };

  card.dataset.area = colourToArea[colour] || "";

  const mainArea = card.dataset.area;
  const subArea = g.subarea && g.subarea.trim() !== "" ? g.subarea.trim() : "";
  const fullArea = subArea ? `${mainArea}, ${subArea}` : mainArea;

  /* ---------------------------------------------
     NEW TWO-COLUMN CARD LAYOUT
  --------------------------------------------- */
  card.innerHTML = `
    <div class="gig-card-inner">

      <!-- LEFT SIDE: TEXT -->
      <div class="gig-card-text">

        <div class="gig-main">
          <div class="gig-date">${g.date}</div>
          <div class="gig-title"><strong>${g.title}</strong></div>
          <div class="gig-venue">
            ${g.venue}${g.extraInfo ? ", " + g.extraInfo : ""}
          </div>
          <div class="gig-time">${parseTime(g.time) || ""}</div>
        </div>

        <div class="gig-extra hidden">
          ${g.extra && g.extra.trim() !== "" ? `<div>${g.extra}</div>` : ""}
          ${
            g.tickets && g.tickets.trim() !== ""
              ? `<div><a href="${g.tickets}" target="_blank">Tickets link</a></div>`
              : ""
          }
        </div>

        <div class="gig-buttons">
          ${
            (g.extra && g.extra.trim() !== "") ||
            (g.tickets && g.tickets.trim() !== "")
              ? `<button class="more-btn">${
                  g.tickets && g.tickets.trim() !== ""
                    ? "more / tickets"
                    : "more"
                }</button>`
              : ""
          }
        </div>

      </div>

      <!-- RIGHT SIDE: IMAGE -->
      <div class="gig-card-image"></div>

    </div>
  `;

  /* ---------------------------------------------
     APPLY IMAGE WITH FALLBACK (CORRECT PLACE)
  --------------------------------------------- */
  const imgDiv = card.querySelector(".gig-card-image");
  const testImg = new Image();

  testImg.onload = () => {
    imgDiv.style.backgroundImage = `url("${finalImg}")`;
  };

  testImg.onerror = () => {
    imgDiv.style.backgroundImage = `url("${venueImg}")`;
  };

  testImg.src = finalImg || venueImg;

  /* ---------------------------------------------
     MORE BUTTON LOGIC
  --------------------------------------------- */
  const moreBtn = card.querySelector(".more-btn");
  const extra = card.querySelector(".gig-extra");

  if (moreBtn) {
    const defaultLabel =
      g.tickets && g.tickets.trim() !== "" ? "more / tickets" : "more";

    moreBtn.addEventListener("click", () => {
      extra.classList.toggle("hidden");
      moreBtn.textContent = extra.classList.contains("hidden")
        ? defaultLabel
        : "less";
    });
  }

  return card;
}



  /* ---------------------------------------------
     AREA FILTERING
  --------------------------------------------- */
  function filterCardsByArea() {
    document.querySelectorAll("#cards-view .gig-card").forEach(card => {
      const area = card.dataset.area;
      card.style.display = hiddenAreas.has(area) ? "none" : "";
    });
  }

  /* ---------------------------------------------
     TEXT VIEW
  --------------------------------------------- */
  function escapeHTML(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function renderText(list = gigs) {
  const container = document.getElementById("text-view");

  let lastDate = "";
  let lines = [];

  list.forEach(g => {
    const t = parseTime(g.time);
    const colour = (g.colour || "black").toString().trim().toLowerCase();

    // New date badge
    if (g.date !== lastDate) {
      lines.push(`<span class="date-badge">${escapeHTML(g.date)}</span>`);
      lastDate = g.date;
    }

    // Title (big)
    let line = `<span class="gig-title-text">${escapeHTML(g.title)}</span>`;

    // Time
    if (t) line += ` — ${escapeHTML(t)}`;

    // Extra info
    if (g.extra) line += ` — ${escapeHTML(g.extra)}`;

    lines.push(line);

    // Venue line (with colour square)
    lines.push(
      `<span class="colour-square ${colour}"></span> ${escapeHTML(g.venue)}`
    );

    // Blank line between gigs
    lines.push("");
  });

  container.innerHTML = lines.join("<br>");
}

  function getVisibleGigs() {
    return gigs.filter(g => {
      const colour = (g.colour || "black").toString().trim().toLowerCase();
      const area = {
        blue: "Darlo",
        green: "Durham",
        orange: "Middlesbrough",
        black: "Newcastle",
        red: "Sunderland"
      }[colour] || "";

      return !hiddenAreas.has(area);
    });
  }

  /* ---------------------------------------------
     VIEW TOGGLES
  --------------------------------------------- */
  function showCards() {
    document.getElementById("cards-view").style.display = "grid";
    document.getElementById("text-view").style.display = "none";

    document.querySelectorAll(".toggle-cards").forEach(btn => btn.classList.add("active"));
    document.querySelectorAll(".toggle-text").forEach(btn => btn.classList.remove("active"));

    startLazyRender(getVisibleGigs());
  }

  function showText() {
    document.getElementById("cards-view").style.display = "none";
    document.getElementById("text-view").style.display = "block";

    document.querySelectorAll(".toggle-cards").forEach(btn => btn.classList.remove("active"));
    document.querySelectorAll(".toggle-text").forEach(btn => btn.classList.add("active"));

    renderText(getVisibleGigs());
  }

  /* ---------------------------------------------
     AREA BUTTONS
  --------------------------------------------- */
  document.querySelectorAll(".area-key .key").forEach(btn => {
    btn.addEventListener("click", () => {
      const area = btn.dataset.area;

      if (hiddenAreas.has(area)) {
        hiddenAreas.delete(area);
        btn.querySelector("small").textContent = "(showing)";
        btn.classList.remove("hidden-area");
      } else {
        hiddenAreas.add(area);
        btn.querySelector("small").textContent = "(hidden)";
        btn.classList.add("hidden-area");
      }

      startLazyRender(getVisibleGigs());
      renderText(getVisibleGigs());
    });
  });
function parseGigDate(dateStr) {
  if (!dateStr) return null;

  // Remove weekday (e.g. "Thu ")
  const cleaned = dateStr.replace(/^[A-Za-z]{3}\s/, "");

  // Now cleaned looks like "29 Jan 2026"
  return new Date(cleaned);
}

  loadGigs();
