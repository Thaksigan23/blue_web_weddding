# Mobile opening — actual supplied video enabled

Source preserved: `gemini_generated_video_a161eba3.mp4` (5,646,913 bytes).
Runtime copy: `engagement-opening-mobile.mp4` (byte-identical; original not deleted).
Poster: `engagement-opening-mobile-poster.jpg`, extracted from the actual first frame.

The supplied MP4 is H.264/yuv420p with AAC audio, 1280x720 landscape, 24 FPS, duration 10.005 seconds. It contains a central couple scene with blurred side scenery; it is not a native 9:16 export. No substitute footage or generated media was used.

## Runtime behavior

- `src/mobileOpening.js`: enabled:true; source `/videos/engagement-opening-mobile.mp4`; `(max-width: 767px)` on any orientation.
- >767px retains the existing procedural SVG opening. Experimental character media remains null.
- Full viewport `object-fit:cover`, object-position 50% 50%. The centered phone crop keeps faces visible. Outer scenery, and some outfit/arm edges at particular frames, are necessarily cropped from this landscape source. A native portrait master could provide more room if desired.
- First-frame image is preloaded for <=767px and sits beneath the video with identical cover/positioning. First playback fades the video in; no black video rectangle or visible loading message. Navy remains the background if both image and footage are still loading.
- Muted, playsInline, preload auto; no audio plays. The video runs once and fades into the existing React invitation. Skip Intro is always reachable, with safe-area padding. Replay mounts a fresh player at time zero.
- Reduced-motion visitors bypass both openings and see the invitation directly. Their replay also bypasses motion.
- Unsupported format, decode/network error, rejected play(), initial load over2.5s or persistent stalls over5s use the full SVG fallback. Background pauses are excluded from stalled-playback checks. Skip/unmount clears timers/listeners and releases the video source.

## Verification

Browser preview: actual muted inline decoding, natural end, fresh replay and skip verified at360x800,390x844,430x932. Missing-media fallback verified at all three widths on a separate QA server, using an unavailable source override. Actual source files were never renamed or damaged for the failure test. Desktop retains SVG. No horizontal overflow observed.

For isolated QA only, launch Vite with `VITE_MOBILE_OPENING_SRC=/__qa_missing_opening__.mp4` on a separate port. Do not set this override in production. Normal builds use the canonical actual source. Unit tests cover autoplay rejection, loading/stall timeout, errors, completion, visibility and cleanup. Physical Safari/Android autoplay, low-power settings and OS reduced-motion testing remain recommended.
