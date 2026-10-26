# Sharon & Ramaniya — Moonlit engagement

React + Vite + Tailwind CSS v4 + Framer Motion. Run `npm install`, `npm run dev`; production: `npm run build` and `npm run preview`.

An eight-second garden opening, procedural SVG skeletal walking, floral arch, names, invitation transition, directions and replay. Reduced-motion preferences show the final intro immediately and disable decorative motion. No audio plays. Intro can be skipped by keyboard or pointer.

Both original reference images are included in `public/images/`. The light artwork renders at its original 2:3 proportion without cropping, tinting or replacement flowers. Its seated couple remains intact. Typography scales with the artwork using container units.

`src/WalkingCouple.jsx` reuses the reference-informed vector characters. A single Framer Motion animation clock drives both stage travel and the skeletal solver in `src/walkMath.js`. Eight named phases alternate contact, down, passing and up. Legs use hip/knee/ankle IK; stance targets compensate root distance to keep the soles planted. Both held arms solve to one shared world-space hand position. Free arms swing opposite the steps; weight shifts and lagging hair, dress and dupatta motion decay during slowdown. Final feet settle one at a time before the romantic head tilt. Reduced motion starts in the finished standing pose, and replay creates a fresh clock. Generated sprite sheets are no longer loaded or requested.

The faces and outfits remain the existing SVG interpretation of the invitation illustration, not a pixel-exact reproduction. Run `node --test src/walkMath.test.js` to check foot locking, IK endpoint accuracy, the eight phases and travel timing.

All ceremony details are in `src/main.jsx`. Typography uses Google Fonts with local serif/cursive fallbacks; the page works without network font access. Garden visuals are local SVG/CSS. No invitation responses or personal data are collected.


## Realistic animation upgrade

The live characters remain the illustrated SVG fallback; realistic rendered footage has not been supplied. `src/RenderedCouple.jsx` adds an opt-in native transparent-video player, configured in `src/characterMedia.js` (disabled by default). It validates decoded alpha, tries alternate sources, retains the synchronized skeleton on failure, and uses a poster for reduced motion. See [CHARACTER_ASSETS.md](CHARACTER_ASSETS.md) for the exact commissioned walk, settle, poster, codec and framing requirements. Actual video appearance and cross-browser behavior must be tested once the real media is delivered.


The active opening uses `IllustratedCouple.jsx` and the refined procedural SVG. The earlier rig is retained in `WalkingCoupleFallback.jsx` with its own original gait math, behind a render-error boundary. No video or sprite files are required. The refined gait uses a 120-unit full stride, heel/toe contact compensation, torso sway with inverse hand targeting, smaller head artwork anchored to the existing neck pivots, and darker flowing hair. The optional rendered-media component is dormant.
