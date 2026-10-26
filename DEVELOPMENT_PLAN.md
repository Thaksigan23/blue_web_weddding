# Engagement invitation develo.pment plan

Updated: 26 October 2026. Scope: guest-facing invitation for S. Sharon & R. Ramaniya. RSVP is excluded by explicit request.

## Completed

- Preserve the existing cinematic moonlit opening, procedural SVG couple, eight-phase gait, camera, arch, skip and replay. Experimental 2.5D rigs remain disabled and all diagnostic files retained.
- Add a separate, original responsive invitation page with readable typography, icy-blue artwork hero, introduction and both families, live countdown, event details, calendar download, gallery empty state, venue directions, closing and footer.
- Countdown uses 2026-12-14T18:00:00+05:30; calendar uses 20261214T123000Z. No unconfirmed event duration is added.
- Keep the original floral image fully visible at its original proportion; ceremony text is now outside its constrained blank center for mobile readability.
- Add semantic section navigation, skip link, focus on invitation entry, visible focus controls, accessible countdown without per-second announcements, reduced-motion-aware section reveals and no autoplay media.
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
