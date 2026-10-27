# Realistic character animation delivery brief

## Current result and limitation

The live site still uses the existing illustrated SVG fallback. No realistic animation footage, layered realistic character master, or rigged 3D model is available in this project. The invitation JPEGs and rejected generated sheets cannot supply missing anatomy, physically plausible gait, or stable fabric motion. This update does not claim to achieve realistic character animation.

`src/RenderedCouple.jsx` provides an opt-in native video path. `src/characterMedia.js` deliberately exports `null` until actual approved media exists. No placeholder video or unrelated stock couple is used.

## Artwork and performance to commission

Use `public/images/blue-couple-opening.png` as the approved appearance and face reference. Build full-length, human-proportioned South Asian character masters before animation. Preserve the groom's styled black hair and natural beard, with a navy embroidered sherwani, ivory veshti/dhoti, and blue accents. Preserve the bride's long dark hair styled with jasmine, and use the same deep-blue saree with silver-blue embroidery and jewelry shown in the reference. Keep their facial appearance, clothing colors, and proportions consistent. Avoid large cartoon heads, changing facial identity, flickering embroidery and limb distortion.

The characters must hold hands throughout. Use a proper alternating two-step gait with heel strike, toe-off, knee flexion, pelvis/shoulder counter-rotation, weight transfer and restrained secondary cloth/hair motion. A 3D rig with foot contact constraints, shared hand constraints and cloth simulation is preferred. Do not regenerate each frame independently.

## Required exports

1. **In-place walk cycle**, with both full-body characters on one transparent canvas. Export a seamless complete left/right cycle, preferably 1–1.2 seconds at 24 or 30 fps. No camera motion or baked horizontal root translation: the website supplies travel. Record the projected stride distance so playback cadence can match that travel. Keep scale, lighting, silhouettes, hand connection and baseline stable across frames.
2. **Settle-and-glance clip**, approximately 0.8–1 second, on the identical canvas. Begin in a compatible walking stance, plant feet, straighten naturally and turn affectionately toward each other. End in a balanced standing pose that can be held indefinitely. The current player crossfades from walk to settle over 0.3 seconds; inspect this transition at both desktop and phone cadence before approval. If a single settle clip cannot blend cleanly from arbitrary walk phases, supply phase-specific stops and adapt the player before enabling it.
3. **Standing poster**, transparent WebP/PNG, matching the final frame exactly. This is used for reduced motion.
4. **Editable source**, ideally Blender/FBX/glTF plus textures, skeleton, contact markers and cloth settings. This enables corrections without regenerating the couple.

For each video supply VP9 WebM **with genuine alpha**, and an HEVC alpha alternative for browsers that cannot composite the WebM correctly. An opaque MP4 is not an alpha alternative. Do not add checkerboard pixels, labels, shadows baked into a rectangle, music or audio tracks. Keep at least the top-left pixel entirely transparent: the player tests actual decoded alpha there.

Use **510 × 580** pixels (the existing 255 × 290 SVG stage at 2×), with a consistent transparent gutter. Match the current SVG framing: both bodies centered together, top of hair near 10px, foot soles near 558px, joined hands around x253/y272. No silhouette may touch the canvas edge. Render the cloth inside this safe area throughout. A soft contact shadow is supplied by the site. At this resolution, aim for a few megabytes total, with a small standing poster. Quality-check edges on both navy and icy-blue backgrounds.

## Activation and compatibility behavior

Place approved files under `public/characters/` and replace the `null` configuration in `src/characterMedia.js` using its example. Set `stride` to the projected full-cycle travel in **255 × 290 stage units**, not output pixels. The existing root trajectory and cycle playback rate share the travel speed; an incorrect stride value produces foot sliding.

The player checks codec decoding and a transparent corner pixel, tries alternate sources, and keeps the synchronized SVG if media is unavailable, too slow to prepare before the walk, opaque, rejected by autoplay policy, or fails decoding. Videos are muted, inline, and loaded only when configured. Reduced motion uses the standing poster rather than playing video. Replay remounts and restarts media. The SVG stays synchronized underneath so runtime errors can fall back without restarting the entrance.

**The rendered path cannot be visually verified until these real files are provided.** After activation, test real footage on Safari/iOS, Chrome/Android and desktop browsers, including slow connections, reduced motion, denied autoplay and replay. Check sole contact, stop blending, transparency edges, face stability and cloth motion before treating the realistic result as complete.
