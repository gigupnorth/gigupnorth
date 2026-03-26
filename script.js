console.log("SCRIPT IS RUNNING");
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
let gigs = [];             
let lazyList = [];         
let Index = 0;             
const CHUNK_SIZE = 3;      // number of dates per chunk
let lazyActive = false;
let scrollAttached = false;
let currentAreaFilters = ["Darlo","Durham","Middlesbrough","Newcastle","Sunderland"];
let currentView = "cards"; // "cards" or "text"

// Colour order for sorting within each date
const colourOrder = ["blue","green","orange","black","red"];

/* ---------------------------------------------
   FETCH & INITIALIZE
--------------------------------------------- */
async function loadGigs() {
  const fallbackGigs = [
    {title:"Sample Blue Gig", venue:"Venue A", date: new Date().toISOString().slice(0,10), time:"20:00", price:"£10", area:"Darlo", colour:"blue"},
    {title:"Sample Green Gig", venue:"Venue B", date: new Date().toISOString().slice(0,10), time:"21:00", price:"£12", area:"Durham", colour:"green"},
    {title:"Sample Orange Gig", venue:"Venue C", date: new Date(new Date().setDate(new Date().getDate()+1)).toISOString().slice(0,10), time:"19:30", price:"£15", area:"Middlesbrough", colour:"orange"}
  ];

  try {
    const url = "https://script.google.com/macros/s/AKfycbwQai3AEldoeZlXj6PNjqWauaJn2vShdPDMcR3DeDz1DyEDh_tOJ7o152QHrvxF4oA4rw/exec";
    let res = await fetch(url);
    if (!res.ok) throw new Error("Fetch failed");
    const all = await res.json();
    console.log("RAW DATA:", all);
    console.log("FILTERED GIGS:", gigs);
    const today = new Date();
    today.setHours(0,0,0,0);
    gigs = all;

    // Sort by date ascending
    gigs.sort((a,b)=>new Date(a.date)-new Date(b.date));

    if (!gigs.length) gigs = fallbackGigs; // fallback if empty
  } catch(e) {
    console.warn("Fetch failed, using fallback gigs:", e);
    gigs = fallbackGigs;
  }

  setupAreaButtons();
  setupViewToggle();
  applyFilters();
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
        currentAreaFilters = currentAreaFilters.filter(a=>a!==area);
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
  const cardsBtn = document.querySelector(".view-cards-btn");
  const textBtn = document.querySelector(".view-text-btn");
  if (!cardsBtn || !textBtn) return;

  cardsBtn.addEventListener("click", () => {
    currentView = "cards";
    cardsBtn.classList.add("active");
    textBtn.classList.remove("active");
    applyFilters();
  });

  textBtn.addEventListener("click", () => {
    currentView = "text";
    textBtn.classList.add("active");
    cardsBtn.classList.remove("active");
    applyFilters();
  });
}

/* ---------------------------------------------
   APPLY FILTERS & PREP LAZY LIST
--------------------------------------------- */
function applyFilters() {
  const filtered = gigs.filter(g => currentAreaFilters.includes(g.area));

  const grouped = {};
  filtered.forEach(g=>{
    if(!grouped[g.date]) grouped[g.date]=[];
    grouped[g.date].push(g);
  });

  lazyList = Object.keys(grouped)
                 .sort((a,b)=>new Date(a)-new Date(b))
                 .map(d=>({date:d, gigs:grouped[d]}));

  Index = 0;
  lazyActive = true;

  const cardsContainer = document.getElementById("cards-view");
  const textContainer = document.getElementById("text-view");
  if(cardsContainer) cardsContainer.innerHTML="";
  if(textContainer) textContainer.innerHTML="";

  if(currentView==="cards"){
    if(cardsContainer) cardsContainer.style.display="flex";
    if(textContainer) textContainer.style.display="none";
    NextChunk();
    if(!scrollAttached){
      window.addEventListener("scroll", handleLazyScroll);
      scrollAttached=true;
    }
  } else {
    if(cardsContainer) cardsContainer.style.display="none";
    if(textContainer) textContainer.style.display="block";
    renderTextView();
  }
}

/* ---------------------------------------------
   LAZY SCROLL HANDLER
--------------------------------------------- */
function handleLazyScroll(){
  if(!lazyActive) return;
  const container = document.getElementById("cards-view");
  if(!container) return;
  const scrollPos = window.scrollY+window.innerHeight;
  const threshold = container.offsetTop+container.offsetHeight-200;
  if(scrollPos>=threshold) NextChunk();
}

/* ---------------------------------------------
   LOAD NEXT CHUNK
--------------------------------------------- */
function NextChunk(){
  if(!lazyActive) return;
  const container = document.getElementById("cards-view");
  if(!container) return;

  const slice = lazyList.slice(Index, Index+CHUNK_SIZE);
  slice.forEach(day=>{
    const header = document.createElement("div");
    header.className="gig-date-header sticky";
    header.textContent=formatDateHeading(day.date);
    container.appendChild(header);

    // sort by colour order
    day.gigs.sort((a,b)=>colourOrder.indexOf(a.colour||"blue")-colourOrder.indexOf(b.colour||"blue"));
    day.gigs.forEach(g=>container.appendChild(buildCard(g)));
  });

  Index+=CHUNK_SIZE;
  if(Index>=lazyList.length) lazyActive=false;
}

/* ---------------------------------------------
   BUILD CARD
--------------------------------------------- */
function buildCard(g){
  const card = document.createElement("div");
  card.className="gig-card";
  card.dataset.colour=g.colour||"blue";

  const inner=document.createElement("div");
  inner.className="gig-card-inner";

  const textWrapper=document.createElement("div");
  textWrapper.className="gig-card-text gig-text-wrapper";
  textWrapper.innerHTML=`
    <div class="gig-title"><strong>${g.title}</strong></div>
    <div class="gig-venue">${g.venue}</div>
    <div class="gig-time">${g.time||""}</div>
    <div class="gig-price">${g.price||""}</div>
  `;

  const imgDiv=document.createElement("div");
  imgDiv.className="gig-card-image";
  imgDiv.style.backgroundImage=`url('${g.image||"images/placeholder.png"}')`;

  inner.appendChild(textWrapper);
  inner.appendChild(imgDiv);
  card.appendChild(inner);

  if(g.extra){
    const btn=document.createElement("button");
    btn.className="more-btn";
    btn.textContent="more";
    btn.addEventListener("click", ()=>alert(g.extra));
    textWrapper.appendChild(btn);
  }

  return card;
}

/* ---------------------------------------------
   TEXT VIEW
--------------------------------------------- */
function renderTextView(){
  const container=document.getElementById("text-view");
  if(!container) return;
  container.innerHTML="";
  lazyList.forEach(day=>{
    const header=document.createElement("div");
    header.className="gig-date-header";
    header.textContent=formatDateHeading(day.date);
    container.appendChild(header);

    day.gigs.sort((a,b)=>colourOrder.indexOf(a.colour||"blue")-colourOrder.indexOf(b.colour||"blue"));
    day.gigs.forEach(g=>{
      const div=document.createElement("div");
      div.textContent=`${g.title} @ ${g.venue} ${g.time||""} ${g.price||""}`;
      container.appendChild(div);
    });
  });
}

/* ---------------------------------------------
   DATE FORMATTER
--------------------------------------------- */
function formatDateHeading(dateStr){
  const date=new Date(dateStr);
  return date.toLocaleDateString("en-GB",{
    weekday:"long", day:"numeric", month:"long", year:"numeric"
  });
}

/* ---------------------------------------------
   INITIALIZE
--------------------------------------------- */
window.addEventListener("DOMContentLoaded", loadGigs);
