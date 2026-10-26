# Actual mobile opening validation

Source: public/videos/gemini_generated_video_a161eba3.mp4.
Active copy: public/videos/engagement-opening-mobile.mp4 (byte-identical SHA-256).
Format: MP4,H.264/yuv420p + AAC;1280x720 landscape;24FPS;10.005 seconds;5,646,913 bytes.
Poster: actual first frame, not generated artwork.

PASS at360x800,390x844,430x932: muted autoplay, playsInline attribute, object-fit cover/position50%50%, natural completion into React invitation, replay starting below0.2s, Skip Intro into invitation, no horizontal overflow. Default desktop1280px verified procedural-svg with no video element. Media-error fallback verified at all three phone widths on isolated Vite port5184 using unavailable-source environment override; fallback loads the existing SVG and skip opens the real invitation.

Frame review: 1fps contact sheets across the10-second source and tall-phone crop are retained beside this report. Both faces stay inside centered tall-phone crop; some outer outfit/arm/scenery content is cropped because this master is landscape, not9:16. No stretching or re-rendering of source video. Original and canonical copy match hashes.

Source docs: public/videos/README.md. Controller tests cover loading/stall limits, autoplay rejection, error/completion race, background pause/resume and cleanup. OS reduced-motion path remains implemented with a synchronous preference check plus Framer preference subscription; no MP4 is mounted for that preference. Physical iOS Safari/Android and real OS preference testing remain recommended; this report does not claim those device tests occurred.

Experimental2.5D rigs were not activated. No RSVP or invitation content changes. Production build and automated tests recorded after final source changes.
