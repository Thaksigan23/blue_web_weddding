# Archived mobile opening video

Source preserved: `gemini_generated_video_a161eba3.mp4` (5,646,913 bytes).
Runtime copy: `engagement-opening-mobile.mp4` (byte-identical; original not deleted).
Poster: `engagement-opening-mobile-poster.jpg`, extracted from the actual first frame.

The supplied MP4 is H.264/yuv420p with AAC audio, 1280x720 landscape, 24 FPS, duration 10.005 seconds. It contains a central couple scene with blurred side scenery; it is not a native 9:16 export. The source and runtime copy are retained unchanged, but the video is no longer part of the active opening.

## Active opening behavior

- The same responsive SVG opening is used on desktop and mobile.
- Animated original artwork depicts a Tamil-inspired ceremony stage with mango-leaf thoranam, jasmine, kuthu vilakku lamps and kolam linework around the illustrated couple.
- `src/mobileOpening.js` keeps the supplied-video configuration disabled. The MP4 and poster are not preloaded, requested or played by the active app.
- Reduced-motion visitors bypass the opening and go directly to the invitation. Skip and replay remain available.

## Verification

The updated SVG scene was checked in a browser at mobile (390 × 844) and desktop (1366 × 768) sizes. Both rendered the same opening with no video element or MP4/poster network request. The source video assets remain available for an explicitly approved future reactivation.
