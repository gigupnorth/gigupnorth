
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

async function loadData() {
  try {
    const res = await fetch('data.json'); // or your JSON path
    const data = await res.json();
    console.log("Loaded data:", data);
    return data;
  } catch (err) {
    console.error("Failed to load JSON data:", err);
    return [];
  }
}

// Run on page load
window.addEventListener("DOMContentLoaded", loadData);
