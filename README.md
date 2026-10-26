# Sharon & Ramaniya — Moonlit engagement

React + Vite + Tailwind CSS v4 + Framer Motion. Run `npm install`, `npm run dev`; production: `npm run build` and `npm run preview`.

The blue Tamil-inspired opening and guest invitation artwork use the exact approved transparent couple illustration at `public/images/blue-couple-opening.png`. The opening gives the complete image a gentle fade and subtle floating sway; its flattened figures do not independently walk or exchange garlands. This is a browser animation, not an exported video file; the optional mobile MP4 path remains inactive. Reduced-motion preferences bypass the opening and disable decorative motion. Intro can be skipped by keyboard or pointer.

The original invitation images remain unchanged. The guest hero uses the approved blue couple artwork at `public/images/blue-couple-opening.png`.

The earlier articulated SVG character rig remains in `src/WalkingCouple.jsx` with its gait and ceremony math in `src/walkMath.js`, but it is not used in the opening or invitation artwork. The supplied couple image is preserved as one image and is not separated into independently animated body parts.

The opening and guest hero both use the same supplied blue artwork. Run `node --test src/walkMath.test.js` for the retained articulated-rig math and ceremony timeline regression checks.

Confirmed event data, countdown and calendar export are in `src/engagement.js`; guest sections are in `src/InvitationPage.jsx`. Typography uses Google Fonts with local serif/cursive fallbacks; the page works without network font access. Garden visuals are local SVG/CSS. No invitation responses or personal data are collected.


## Realistic animation upgrade

The live characters remain the illustrated SVG fallback; realistic rendered footage has not been supplied. `src/RenderedCouple.jsx` adds an opt-in native transparent-video player, configured in `src/characterMedia.js` (disabled by default). It validates decoded alpha, tries alternate sources, retains the synchronized skeleton on failure, and uses a poster for reduced motion. See [CHARACTER_ASSETS.md](CHARACTER_ASSETS.md) for the exact commissioned walk, settle, poster, codec and framing requirements. Actual video appearance and cross-browser behavior must be tested once the real media is delivered.


The active opening uses the supplied blue image with a gentle reveal and subtle floating sway. The older procedural rigs remain in source but are not rendered in the opening. The optional rendered-media component is dormant.

## Full guest invitation

After the preserved opening, guests can browse the invitation hero, family introduction, Sri Lanka-time countdown, ceremony details with a downloadable .ics calendar event, gallery empty state, venue directions and closing. RSVP is intentionally absent: no forms, attendance data or submission integration. Story and dress code remain hidden until real content is supplied. Approved media can be added to invitationContent.gallery in src/engagement.js. The Maps action opens the verified Concord Grand Hotel Google Maps property listing. See DEVELOPMENT_PLAN.md for progress and remaining content. Verify with node --test src/engagement.test.js src/walkMath.test.js src/memoryGame.test.js and npm run build.

The Secret Keys matching game uses original Tamil wedding-inspired illustrations for a thirumangalyam (thaali), kuthu vilakku, kolam, malligai garland, kalasam and mango-leaf thoranam.

## Opening ceremony animation

The shared responsive opening displays the supplied couple image and animates the overall framing only. The supplied MP4 and poster remain in `public/videos/` but are not requested or played. Reduced motion skips the animated opening.

## Identity and UI refinement

Original path-based monogram assets live in public/branding, reused by src/Monogram.jsx. The guest page keeps the editorial desktop split, uses a readable stacked tablet layout and compact mobile rhythm. The venue illustration is explicitly decorative; the directions link is the provider-observed property URL, not an invented coordinate pin. See artifacts/ui-polish/index.html for responsive before/after screenshots and artifacts/ui-polish/REPORT.md for file changes, tests and remaining platform checks. DEVELOPMENT_PLAN.md documents the interactive invitation-card idea as future-only.
