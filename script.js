// Venue images lookup table
const venueImages = {
  "The Globe": "https://gigupnorth.github.io/gigupnorth/images/globe.jpg",
  "Trillians": "https://gigupnorth.github.io/gigupnorth/images/trillians.jpg",
  "NE Volume Bar": "https://gigupnorth.github.io/gigupnorth/images/nevolume.jpg",
  "Cobalt Studios": "https://gigupnorth.github.io/gigupnorth/images/cobalt.jpg"
};


let gigs = [];
  const hiddenAreas = new Set();

  /* ---------------------------------------------
     LAZY RENDER GLOBALS
  --------------------------------------------- */
  let lazyList = [];          // gigs currently being rendered (after filters)
  let renderIndex = 0;        // where we are in the list
  const CHUNK_SIZE = 40;      // tweak this if needed
  let lazyActive = false;     // prevents double-triggering
  let scrollAttached = false; // ensures only one scroll listener

async function loadGigs() {
  const res = await fetch("https://script.google.com/macros/s/AKfycbxih_kGm7aUQ2j6DfR5_tuYO12Khr6mbDbWmwAjMeJ4r5czcGlS4NSKm__mhKxWdFW3Xw/exec?json=1");
  let all = await res.json();

  const today = new Date();
  today.setHours(0,0,0,0);

  // ⭐ FILTER using human-readable date
  gigs = all.filter(g => {
    if (!g.date) return false;
    const gigDate = parseGigDate(g.date);
    return gigDate >= today;
  });

  startLazyRender(gigs);
  renderText();
  if (typeof buildVenueMenu === "function") {
    buildVenueMenu();
  }
}




  function parseTime(t) {
    return t && t.startsWith("time-") ? t.replace("time-", "") : t;
  }

  /* ---------------------------------------------
     LAZY RENDER: START
  --------------------------------------------- */
  function startLazyRender(list) {
    const container = document.getElementById("cards-view");
    container.innerHTML = "";

    lazyList = list;
    renderIndex = 0;
    lazyActive = true;

    renderNextChunk();

    if (!scrollAttached) {
      window.addEventListener("scroll", handleLazyScroll);
      scrollAttached = true;
    }
  }

  /* ---------------------------------------------
     LAZY RENDER: CHUNK RENDERING
  --------------------------------------------- */
  function renderNextChunk() {
    if (!lazyActive) return;

    const container = document.getElementById("cards-view");
    const slice = lazyList.slice(renderIndex, renderIndex + CHUNK_SIZE);

    slice.forEach(g => {
      const card = buildCard(g);
      container.appendChild(card);
    });

    renderIndex += CHUNK_SIZE;

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

  const img = venueImages[g.venue] || "";

  const card = document.createElement("article");

  // Background image for full-card logo
  if (img) {
    card.style.backgroundImage = `url(${img})`;
    card.style.backgroundSize = "cover";
    card.style.backgroundPosition = "center";
    card.style.backgroundRepeat = "no-repeat";
  }

  card.className = `gig-card ${
    g.venue && g.venue.toLowerCase().includes("trillians")
      ? "trillians"
      : ""
  }`;

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

  card.innerHTML = `
    <div class="gig-main">
      <div class="gig-date">${g.date}</div>
      <div class="gig-title"><strong>${g.title}</strong></div>
      <div class="gig-venue">
        ${g.venue}${g.extraInfo ? ", " + g.extraInfo : ""}
      </div>
      <div class="gig-time">${parseTime(g.time) || ""}</div>
    </div>

    <div class="gig-extra hidden">
      ${g.extra || ""}
    </div>

    ${g.extra && g.extra.trim() !== "" ? '<button class="more-btn">more</button>' : ''}
  `;

  const moreBtn = card.querySelector(".more-btn");
  const extra = card.querySelector(".gig-extra");
  if (moreBtn) {
    moreBtn.addEventListener("click", () => {
      extra.classList.toggle("hidden");
      moreBtn.textContent = extra.classList.contains("hidden") ? "more" : "less";
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
  function renderText(list = gigs) {
    const container = document.getElementById("text-view");

    let lastDate = "";
    let lines = [];

    list.forEach(g => {
      const t = parseTime(g.time);

      if (g.date !== lastDate) {
        lines.push(`<span class="date-badge">${g.date}</span>`);
        lastDate = g.date;
      }

      const colour = (g.colour || "black").toString().trim().toLowerCase();
    

      // Title / artist first (ONLY this part gets bigger)
let line = `<span class="gig-title-text">${g.title}</span>`;

// Add time (normal size)
if (t) line += ` — ${t}`;

// Add extra info (normal size)
if (g.extra) line += ` — ${g.extra}`;

lines.push(line);

// Venue LAST
lines.push(`<span class="colour-square ${colour}"></span> ${g.venue}`);

lines.push(""); // blank line between gigs


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
