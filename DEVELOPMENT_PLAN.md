# Engagement invitation development plan

Updated: 26 October 2026. Scope: guest-facing invitation for S. Sharon & R. Ramaniya. RSVP is excluded by explicit request.

## Current opening — 27 October 2026

The active desktop and mobile opening and the guest-hero artwork use the exact approved transparent blue couple image at `public/images/blue-couple-opening.png`. The opening animates the complete image with a gentle reveal and subtle floating sway; the flat image does not animate individual human gestures. This is a browser animation rather than an exported video; the preserved mobile MP4 is inactive.

The earlier articulated couple rig and ceremony motion remain in source but are no longer used for the opening or guest hero. Game card titles are not displayed below their images; card names remain available as accessible button labels.

## Current review status

Full invitation and original SVG/video openings are retained. Current branding uses original SVG S & R assets. Get Directions now opens the live-verified Concord Grand Hotel Google Maps property listing (earlier search-only notes below are historical). Responsive, accessibility-token, navigation, calendar, media and build checks are recorded in artifacts/ui-polish/REPORT.md. Interactive paper-card opening remains a future specification only. No GitHub push or deployment is authorized in this pass.
## Completed

- Preserve the existing cinematic moonlit opening, procedural SVG couple, eight-phase gait, camera, arch, skip and replay. Experimental 2.5D rigs remain disabled and all diagnostic files retained.
- Add a separate, original responsive invitation page with readable typography, icy-blue artwork hero, introduction and both families, live countdown, event details, calendar download, gallery empty state, venue directions, closing and footer.
- Countdown uses 2026-12-14T18:00:00+05:30; calendar uses 20261214T123000Z. No unconfirmed event duration is added.
- Keep the original floral image fully visible at its original proportion; ceremony text is now outside its constrained blank center for mobile readability.
- Add semantic section navigation, skip link, focus on invitation entry, visible focus controls, accessible countdown without per-second announcements, reduced-motion-aware section reveals and no autoplay gallery media. The approved mobile opening is muted autoplay.
- Remove/omit all RSVP UI, attendance controls, guest counts, forms and submission handling. No backend required and no guest data collected.

## Content awaiting approval

- Photo/video gallery: honest empty state, no stock photographs presented as the couple. Add approved images/video to invitationContent.gallery in src/engagement.js with descriptive alt text, caption and video caption track where needed.
- Story: empty array; section hidden until approved facts are provided. No invented milestones or guest-visible fake timeline.
- Dress code: null; section hidden until confirmed.
- Venue: confirmed name/city link opens a Google Maps search. Replace with an approved precise venue pin when provided. Decorative location illustration is not a geographic map.

## Validation

- Production build: pass.
- Gait, timezone/countdown, calendar escaping/UTC/line folding, and optional empty content tests: node --test src/engagement.test.js src/walkMath.test.js.
- Desktop and 360px/430px browser checks: section links, countdown, calendar download, gallery empty state, venue link, closing and replay. Check final screenshots in artifacts/website-development.
- Existing character diagnostics are untouched; live character mode remains procedural-svg.

## Next steps

1. Supply approved gallery media; optimize each file and include accessible descriptions/captions.
2. Confirm exact venue map pin; current search is clearly labelled.
3. Test physical iOS Safari and Android Chrome, reduced-motion OS preference, keyboard and screen reader behavior.
4. Review final copy and verify calendar import in Apple Calendar, Google Calendar and Outlook.
5. Deploy the approved build; no deployment or new GitHub push is performed in this change.

Realistic character work is paused. Do not activate experimental rigs or remove preparation artifacts without a new explicit request.

## Mobile portrait opening architecture — ready, media pending

- `src/mobileOpening.js` has a separate disabled configuration for `/videos/engagement-opening-mobile.mp4`. The default creates zero video elements or MP4 requests. Experimental characterMedia remains null.
- `src/MobileVideoOpening.jsx` provides a fixed viewport, object-fit:cover with configurable focal position, muted inline playback, persistent Skip Intro, completion fade and source cleanup.
- Portrait phones <=600px can use the video once it is supplied and enabled. Desktop and landscape retain the unchanged SVG scene. Each replay gets a fresh opening attempt. Unsupported formats, rejected playback, decoding/network errors, 2.5-second initial timeout and 5-second persistent stalls select the SVG fallback.
- Reduced-motion visitors bypass both openings and go directly to the React invitation; replay also respects this preference.
- Confirmed event details, calendar, countdown, gallery, navigation and desktop invitation styling were not edited for this change.
- Automated tests cover selection, completion, autoplay rejection, errors, loading/stall timeout, source release and visibility pause/resume. Tests use in-memory event mocks only; no fake media asset is installed.
- Browser checks at desktop 1280px and 360x800, 390x844, 430x932 confirm the default SVG mode, zero video elements and no horizontal overflow. Default-mode invitation navigation/replay also checked.
- Pending: supply the real MP4, review safe framing/objectPosition and final frame, then verify actual playback/autoplay, decoder errors and replay on iOS Safari/Android Chrome. End-of-video browser timing cannot be certified without that file. See `public/videos/README.md` for the delivery and activation steps.

An unassigned public/videos/gemini_generated_video_a161eba3.mp4 was observed during integration. It remains untouched and unselected; the configured engagement-opening-mobile.mp4 is still not present. Real-media review is pending.


## Actual mobile video activation — 26 October 2026

This supersedes the earlier disabled/media-pending notes above. The supplied gemini_generated_video_a161eba3.mp4 is now copied byte-identically to the configured public/videos/engagement-opening-mobile.mp4; original retained. H.264/AAC,1280x720 landscape,24FPS,10.005s. An actual first-frame poster prevents blank loading frames. Mobile threshold is now767px including landscape. Desktop still uses SVG and experimental rigs remain disabled. Existing invitation sections and business logic are unchanged.

Actual browser tests passed at360x800,390x844,430x932: muted inline playback, natural completion, replay from zero, skip, no horizontal overflow, invitation countdown retained. Missing-media QA server confirmed automatic SVG fallback and working skip at all sizes. Remaining platform check: physical iOS Safari/Android and OS-level reduced motion. Crop is centered and faces remain visible; the landscape source necessarily loses outer scenery on tall phones.

## Mobile opening visual refinement

Skip Intro moved to the safe-area top-right, clear of the S & R monogram. Mobile-only completion/skip now mounts the original hero beneath a held-frame1.4s video dissolve, omitting the bright sweep on this path. Complete10.005-second playback, original video bytes, centered50%cover, desktopSVG, fallback controller and invitation content are preserved. Browser completion/skip/replay/fallback checks passed at360x800,390x844,430x932. Production build and15 automated tests pass. Screenshots and measured states: artifacts/mobile-opening/refinement/index.html and checks.json. Physical safe-area device testing remains recommended.

## UI/UX, identity and venue refinement — 26 October 2026

Completed in this pass:
- Original path-based S & R monogram, light/dark SVG variants, reusable Monogram component and SVG favicon. Used in header, mobile overlay, desktop branding, footer and empty album. No raster logo, stock mark, web-font dependency or new library.
- Shared spacing/colour/button rules; tighter375x667 hero, readable labels,44px navigation targets, balanced large-screen split hero, tablet stacking and preserved full-proportion floral image. Gallery remains an honest empty state; story/dress code remain hidden. RSVP remains excluded.
- Focusable anchor targets and native smooth section navigation, disabled smooth behavior for reduced-motion preference. Explicit new-tab label on venue action. Contrast token checks retained under artifacts/ui-polish.
- React root is retained across Vite entry hot updates to fix repeated createRoot warnings. Production rendering behavior unchanged.
- Venue business/locality corroborated by Google hotel listing and Sri Lanka Telecom directory. Official hotel domain could not be reached; no exact Maps place URL or coordinate pin is claimed. Final action is a country-qualified Google Maps search. Venue illustration is explicitly decorative and no third-party map iframe is loaded.
- Original10.005s video,50%cover, top-right safe areas,1.4s final-frame dissolve, SVG fallback and reduced-motion startup are preserved. Source video/original and all experimental2.5D assets are retained, disabled.

Remaining guest content/platform checks:
- Approved photo/video gallery media; optional factual story and dress-code information if desired.
- Optional owner-confirmed exact Google Maps place URL; search action is working meanwhile.
- Physical iPhone Safari/Android, actual notched safe areas and assistive-technology review. Local viewport and preference-harness checks do not replace real hardware checks.
- No field Core Web Vitals/INP data yet; production bundle/resource sizes and local behavior are reviewed, not presented as field metrics.
- Deployment and GitHub push require a new approval; neither is performed here.

## Future feature ONLY — interactive invitation-card cover (NOT IMPLEMENTED)

Concept: retain the original blue floral artwork as a paper cover. As guests scroll naturally, the card comes into focus and opens gently in3D, revealing a readable inner page containing the real engagement details and parents' blessings. Continued normal scrolling reaches countdown and venue sections.

Technical approach:
- Reuse React and the existing Framer Motion dependency: useScroll scoped to a card wrapper and useTransform for reversible cover rotation, subtle translation and opacity. CSS perspective/transform-style and restrained paper shadows create depth. No video, WebGL, paid animation library or new dependency is required.
- Cover is the unchanged original image with reserved intrinsic dimensions. Inner details are semantic real HTML driven by engagement.js; no text baked into images. Desktop can suggest a two-leaf stationery composition, but mobile must present ONE centered readable inner page, never two tiny pages.
- Map scroll progress to closed→focused→open; scrolling back reverses the same transform. Use a bounded normal-flow wrapper, never body scroll locking, wheel interception, forced jumps or scroll trapping. Existing section links, calendar and replay must continue working.
- Animate transform/opacity primarily; avoid per-frame layout calculations and large blur effects. Limit compositing layers and test lower-end phones. Keep document text accessible independent of cover position.
- Reduced motion: bypass the fold and show the original cover plus static fully readable HTML inner content. Keyboard users can reach every real action; decorative reverse surfaces are aria-hidden. No essential information depends on animation progress.

Acceptance criteria before any future activation:
1. Reversible scroll-up/down behavior with no snapping traps or unexpected page jumps.
2. One readable mobile inner page at360,375,390,430px; body text at least16px, touch actions at least44px, no clipping/horizontal overflow.
3. Original floral artwork remains complete, proportional and recognizable; calm paper perspective/shadows without excessive rotation.
4. All confirmed ceremony/family details remain correct and selectable HTML; no invented story, dress code, end time or RSVP.
5. Reduced-motion/static mode exposes all details and controls immediately; keyboard/screen-reader order stays coherent.
6. No broken navigation, calendar, countdown, maps, opening video, replay or fallback behavior.
7. No visible layout shift from loading the cover; acceptable frame pacing on physical iOS/Android before launch.

This pass documents the idea only. No scroll-driven cover,3D fold or inner-page implementation has been added.

Venue follow-up in this pass: live Google Maps resolved the search to Concord Grand Hotel at139 Galle Rd. Its displayed name/address and observed provider place URL were verified; Get Directions now uses that exact property listing. This supersedes the earlier search-only notes. No custom coordinates, entrance-pin guarantee or embedded map were introduced. See artifacts/ui-polish/VENUE_VERIFICATION.md.


## Guest interactions — 26 October 2026
- Added the six-pair Secret Keys memory game with shuffled decks, move/time/pair statistics, mismatch locking, completion wish and restart. Its original illustrations depict Tamil wedding traditions: thirumangalyam, kuthu vilakku, kolam, malligai garland, kalasam and mango-leaf thoranam. No RSVP added.
- Added mobile floating navigation (welcome, introduction, ceremony, gallery, venue, game), with the music toggle beside it. Desktop navigation remains unchanged.
- Added interactive blue butterflies across the invitation; touch/click/hover sends them away. Hidden for reduced motion.
- Reused the previous wedding's configured music locally, on-demand with explicit play/pause and a volume panel. Mobile system-volume limitations are stated in the panel.
- Added a side WhatsApp sharing control. It opens a prepared invitation share; it does not automatically send a message or assume a contact number.
- Mobile video Skip is now bottom-right, safe-area aware, labeled “Skip”. The natural ending and 1.4-second dissolve remain unchanged.
- Couple name headings/signature/art inscription remain on one line, with responsive sizing.
- Real Google map now replaces the decorative location card; verified rendering displays Concord Grand Hotel. Existing directions link remains available outside the iframe.
- Footer reuses the original Techloom mark with “Made with love by”.
- Validation: 19 unit tests and production build pass. Browser checks cover card mismatch/completion/restart, audio playback/pause/volume, butterfly response, map rendering, mobile replay/Skip, and responsive name layout. Physical iOS audio/volume and external WhatsApp completion remain device checks.

## Hero and butterfly refinement — 27 October 2026
- Refined the invitation hero with larger single-line couple names, restrained uppercase ceremony label, silver divider and editorial serif date/venue styling.
- Increased butterflies to six on mobile and eight on desktop with wider drifting paths and faster wing motion; tap/hover flight and reduced-motion opt-out remain intact.
- Removed the volume button, slider, panel state and listeners. Music play/pause remains, with a gentle initial volume and normal device volume controls.
- Production build and all 19 automated tests pass.

## Merge reconciliation — 27 October 2026
Merged the friend's illustration opening and updated game artwork with the local hero refinement. The owner explicitly selected the new illustration opening for all screen sizes; the old video and SVG rig remain preserved but inactive. Local single-line hero typography, silver divider, six/eight butterflies and removed volume control remain active. This supersedes earlier notes describing active video playback and volume sliders.
