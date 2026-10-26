# Groom preparation — incomplete, do not activate

The live website and animation source were not changed by this preparation. The original `public/characters/groom_reference.png` is preserved, with SHA-256 recorded in `manifest.json`.

Open `preview.html` through the existing Vite server to inspect the component gallery and partial rest assembly. `assembled-preview.svg` is a standalone diagnostic: orange points indicate existing rig targets; dashed torso/arm outlines indicate missing valid layers. The displayed head is an alternate left-facing view, not an approved groom orientation. The assembly is not a finished character or a walking test.

## What was exported

22 PNG exports use the original image pixels and transparency:

- Isolated alternate head/right and head/back composites, each still including neck/collar.
- Four isolated sleeve drawings. These are useful art references but **not** true independent upper/lower-arm skins.
- Four individual relaxed/open hand-and-cuff drawings.
- Four white trouser sections (two thigh and two shin drawings).
- Two side-view shoes and one front-view and one back-view shoe reference.
- Four merged reference groups: left/front heads, front/back torsos, coat panels, and paired holding hands. These were deliberately kept together because they cannot be honestly exported as clean independent layers from their touching silhouettes.

The 18 isolated components are cleanly separated visible artwork; that does not make them rig-ready. All entries have `rigReady: false`, and the package is disabled.

## Transparency and extraction

The master has a real alpha channel. Its hidden RGB contains painted background colors, which made its image preview appear opaque. The original alpha, rather than color keying, was used; white trousers and black shoes were not keyed out. The source is already slightly translucent in some ostensibly opaque painted regions. No opacity normalization or color correction was applied.

The preparation script identifies connected alpha components at alpha >=32, then recovers up to three pixels of original low-alpha antialiasing. It selects the original foreground component and exports it with a four-pixel transparent gutter. Separate labels and unrelated components are excluded. Joined groups remain references rather than being arbitrarily cut through. Fine disconnected hair flyaways and very low-alpha detail still require manual matte review against the original before any production use.

`alpha-components.json` records component areas and source bounds. Some groups contain labels attached to the same alpha component; merged references may therefore retain those labels and are not production textures. There are no generated pixels in the exported assets. A generative background-removal attempt was discarded when pixel inspection confirmed the original alpha could be used directly.

Reproduce with `node scripts/prepare-groom.mjs` from the project root (FFmpeg required). This writes preparation artifacts only, not website assets or runtime configuration.

## Registration status

`manifest.json` includes original bounds, crop dimensions, source-space pivots, crop-local pivots, parent bones, draw order, uniform scale, parent-local target pivots, image bounds in parent space and the actual SVG bone hierarchy.

**All pivots/scales are provisional hand estimates**, not anatomical or animation-verified registration. Source labels do not establish anatomical left/right. Different drawings have different rest orientations and scales. Bone lengths are kept at the current 48/48 leg and 35/38 arm lengths; geometry must be retargeted together with IK if approved natural anatomy cannot fit them without distortion. No non-uniform stretching was used to claim a fit.

The partial preview places the exported legs, shoes, relaxed hands and alternate head against the existing rest targets. It intentionally excludes invalid merged torso/head art and ambiguous complete sleeves. Shoe orientation and rest angle are not finalized. It does not test eight-phase deformation because the required complete skins do not exist.

## Exactly what must be recreated

1. **Primary head, neck and hair:** provide the groom's approved right-looking three-quarter head as a clean independent layer, with a fully painted neck beneath the beard. Separate collar from neck; provide front/back hair if independent secondary motion is needed. The sheet's left/front heads overlap and cannot both be recovered completely by separating their visible pixels. Do not mirror an asymmetric face or embroidery to claim an exact match.
2. **Torso and coat:** repaint separate front and back torso layers, with no sleeves baked in. Complete both shoulder/armpit surfaces and the pelvis/waist hidden beneath the coat. Separate clean coat panels with matching embroidered borders. Front/back torso and coat drawings touch; independent complete silhouettes cannot be recovered without repainting.
3. **Arms:** create actual independent upper-arm and forearm sleeves for each side. The labeled upper-arm drawings contain a bent full sleeve, elbow and cuff. Repaint missing shoulder and elbow caps and at least 8 logical units of concealed overlap; match the existing 35/38-unit bone structure or supply measured anatomy for retargeting.
4. **Holding hand:** paint the groom's hand alone, with a defined wrist pivot and shared grip contact. The paired holding-hands drawing contains fused anatomy; it cannot serve as one groom hand. Match skin tone, sleeve cuff and wrist direction to the approved arm artwork.
5. **Legs:** retain these white trouser pixels, but paint the concealed hip, knee and ankle overlap/caps, including folds visible during flexion. Current cut ends are open and do not supply the required overlap. Preserve complete soles and ankles.
6. **Shoes and registration:** approve both shoe orientations in the groom's walking perspective. Register ankle, heel and toe landmarks to the sole. The left side-view shoe points left and the right one points right; the current diagnostic does not pretend these are an approved matched pair.

After repainting, assemble a neutral and romantic pose, verify parent-local pivots and joint overlap, and inspect every gait phase on navy and icy backgrounds before activating any skin. Existing SVG fallback, camera, reduced-motion support, replay and invitation remain the production result.
