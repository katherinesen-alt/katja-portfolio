# katjasenina.com — site notes

Static site. No build step, no dependencies. Open `index.html` and it runs.

## Local preview

Serve it over HTTP rather than opening the file directly:

    python3 -m http.server 8765

Then go to http://localhost:8765/index.html

Opening the pages as `file://` breaks images. Chrome will not resolve a query
string on a local path (`ds-cover.png?v=2`), and folder names with spaces
(`case studies/`) are unreliable. Over HTTP both work.

## Structure

    index.html          Home: hero, throwable tag pills, selected work, brand marquee
    case-*.html         One file per case study, each with its own inline styles
    header.js           Shared header, injected into every page
    fonts.css           Font faces (Fraunces for display, Onest for body)
    sync-titles.py      Copies each case page <h1> into its own <title> and into its card
    case studies/       Images and video per case
    logos/              Client logos for the brand marquee

### Adding a case study

1. Copy an existing `case-*.html` as a starting point. `case-mcs.html` is the
   light template, `case-pleier.html` the dark one.
2. Put the images in `case studies/<name>/`.
3. Add a card to `index.html`, inside `.work-feature` or `.work-rest`.
4. Run `python3 sync-titles.py`. The `<h1>` is the source of truth: the script
   copies it into the page's own `<title>` and into the card headline on the
   home page, so the three never drift apart.

The work grid is two cards per row at every width above 640px.

### Hidden cards

Two cards are commented out in `index.html` rather than deleted:

    case-ecommerce.html     A full e-commerce experience for a platform with verified products.
    case-spaceit-web.html   Spaceit website redesign.

Both case pages are still there and still open if you link to them directly.
To show a card again, delete the two comment markers around it.

## Removed: the "Work with me" button

The header used to carry a black pill on the right, on the home page and on
every case page. It was taken out on 2026-09-10.

Form it pointed at:

    https://tally.so/r/VLQD1l

To put it back, open `header.js` and set:

    var SHOW_CTA = true;

That is the only change needed. The markup, the styles and the mobile layout
for it are all still in the file, switched off by that flag. Note that with
the button gone, on mobile the case pages show the "← Back" text link instead
of the round arrow icon; turning the flag back on returns the icon too.

## Contact

The header carries an `Email` link that opens the visitor's mail app with the
address already filled in. It sits in the nav on the home page, in the mobile
menu, and on the right of the header on case pages, where there is no nav.
The address lives in one place, `header.js`:

    var EMAIL = 'katherine.senina@gmail.com';

Alongside it, the header nav and mobile menu link out to LinkedIn and Instagram.
