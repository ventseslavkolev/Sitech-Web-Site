SITECH CONSULTING / SENSOR NETWORK WEBSITE
Static site to replace sitech.consulting. Built October 2026.

WHAT IS IN THIS FOLDER
  index.html          Home
  snth.html           SNTH temperature and humidity sensor
  snit.html           SNIT infrared sensor
  gateway.html        SNGW04 gateway (three models)
  timber.html         Timber / wood moisture monitoring, oak tower reference
  concrete.html       Concrete curing, maturity and drying (CureShift), 2026 field results
  applications.html   Other applications with the standards that ask for records
  platform.html       sensornetwork.cloud platform
  pricing.html        Packages, unit prices, what is included, process
  about.html          Company
  contact.html        Contact details and form
  legal.html          Imprint and privacy
  sitemap.xml, robots.txt
  assets/css/style.css   one stylesheet for all pages
  assets/js/main.js      menu, product drop-down, contact form
  assets/fonts/          Barlow and Barlow Semi Condensed (self-hosted, no Google request)
  assets/img/            web-optimised WebP images, logo, favicon
  assets/video/          two short installation videos (timber, concrete), MP4 without sound

HOW TO PUBLISH
  Upload the whole folder (keep the structure) to the web root of the hosting account
  so that index.html sits at https://sitech.consulting/. No server-side code is needed;
  any static hosting works. Replace the old site files completely so the old pages
  (humidity.html, flooring.html, ...) disappear or, better, redirect them to the new pages:
    humidity.html -> snth.html        infrared.html -> snit.html
    gatewaywifi.html -> gateway.html  flooring.html / concrete.html -> concrete.html
    construction.html / infrastructure.html / buildings.html -> applications.html
    support.html -> about.html        page-aboutus.html -> about.html
    contact-one.html -> contact.html

CONTACT FORM
  The form opens the visitor's mail program with the message addressed to
  info@sitech.consulting (no server needed). To receive form posts directly instead,
  sign up with a form service (Formspree, Basin, Netlify Forms or similar), set the
  form's action="..." attribute in contact.html to the address they give you, and the
  script will leave the form alone.

IMAGES
  Only real material is used: the CAD renders of the sensors and gateway, the
  installation photos and videos, screenshots of sensornetwork.cloud and pages from
  the monitoring report. The AI-generated scene images from the old site
  (concrete-floor and solar-panel illustrations, hero JPGs, viber images) are not used.
  The 2023 installation photos show the red housing; the current temperature/humidity
  sensor is yellow. Swap in newer photos when available (same file names, assets/img/).

EDITING TEXT
  Each page is a plain HTML file. The header and footer are repeated in every page;
  change them in all twelve files (search and replace) to keep them identical.
  Specifications follow the October 2026 company presentation.
  Photos, renders and screenshots open full-size in a lightbox when clicked.

PRICES BEHIND AN ACCESS CODE (this branch)
  Every price is replaced by a "Show price" chip. Clicking a chip, or "Enter access
  code" on the pricing page, opens a dialog for the 5-digit code. With the right code
  all prices on that page are shown. Nothing is remembered: every page load or refresh
  asks for the code again. The amounts are stored encrypted in the HTML and the code
  itself is not in the files; the code hash is on <main data-pc>. This is a light gate
  for casual visitors, not strong security: a 5-digit code can be guessed by trying all
  100,000 combinations. For real protection serve prices only after a login.
  Changing the code requires regenerating the pages (ask for a rebuild with a new code).
  The pages need HTTPS (or a local file) for the code check to work.

POINTS TO CONFIRM
  - Phone number: the site uses +359 888 920 108 (presentation). The old contact page
    showed +359 884 87 41 14.
  - The tower reference is described only as "timber lattice tower, 62 sensors": no
    customer name and no location, at the owner's request (18 Oct 2026).
  - Support hours are given as Mon-Fri 9-18 CET as in the presentation.
  - If analytics or cookies are added later, a cookie notice is required (none now).
