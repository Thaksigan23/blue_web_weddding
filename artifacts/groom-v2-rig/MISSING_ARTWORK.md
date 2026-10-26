# Groom V2 joint repair audit

Status: DIAGNOSTIC ONLY — NOT ANIMATION READY. Existing website and SVG fallback remain active and unchanged.

## What was repaired without new pixels

- Split the existing torso image by SVG masks into upper torso, sleeves, and lower coat foreground. The coat remains body-anchored while independent thighs/shins rotate behind it. No repeated sleeve silhouettes follow the legs.
- Moved the relaxed hands behind the original embroidered cuffs; clipped the redundant upper hand/cuff artwork. Both relaxed wrist intersections are visually joined in the standing preview. This does not establish a joined-couple grip.
- Masked the separate pelvis to retain its original white cloth and hide baked blue coat tabs.
- Registered trouser skins with rigid rest rotations around the existing bones, using measured proximal/distal cloth centers. No nonuniform scale or painted limb extension.
- Reordered thighs over shins and shins over shoes, masking dark end rims where existing overlapping pixels cover them. Knee alpha coverage improves, but the visible cuff-like rims still fail material continuity.
- Inserted a masked strip of existing neck detail behind the head/collar. Local transparency closes, but a dark neck mark and shading discontinuity remain: not a visual pass.

## Joint decisions

- Torso/coat separation: PASS for this fixed view; original detail and proportion retained. Not a rear-view or twisting skin.
- Relaxed wrists: PASS for static pose; approximately 99.7–100% sampled local coverage. Grip wrist remains unapproved.
- Shoulders: RESTRICTED CANDIDATE. The -3/-2/0/+2/+3 degree trials retain approximately 99.8–100% sampled original shoulder support and show no obvious detached arm at review size. Limit a future prototype to +/-2 degrees. Keep sleeves static in the eight-phase diagnostic until combined motion is verified.
- Right elbow: EXPERIMENTAL. Source sleeve divided with an 8-unit overlapping elbow band; sampled elbow alpha is 100% through 0 to -59.85 degrees. Angled cloth looks less continuous at large flexion. No need to demand a whole new arm yet; a small matching elbow gusset is the remaining fallback if a higher-resolution motion review rejects the seam.
- Shared grip: FAIL. Candidate contact misses the current target by roughly 5 rig units at maximum trial flexion; exact palm/finger interleave with the bride is not available. Do not solve this by stretching the arm.
- Pelvis/outer hips: FAIL. White waist material does not reach the outer thighs below the coat. Moving existing thigh textures upward by 2–4 units improves hip coverage but leaves waist holes and worsens knee coverage (down to 95.2%). These shifts were rejected; production candidate uses shift 0.
- Knees: FAIL visually. Alpha coverage is 99.5–100% in the eight phase samples, but widened open tops of the shins make conspicuous cuff/ridge silhouettes. Green rings are coverage diagnostics only, not approval.
- Ankles: RESTRICTED PASS for overlap in these nine discrete poses; no local alpha holes detected. Heel/toe animation is not approved because shoes have incompatible facing/perspective.
- Head: source face/hair preserved; neck finish still FAILS visual continuity. No independent hair replacement needed for this limited view.

## Smallest currently justified painted additions

These are targeted patches, not another reference sheet or a request to redraw the entire character. Transparent RGBA PNGs, same scale, perspective, lighting and embroidery. Preserve the supplied face and all reusable garment pixels. Coordinates below use body rig units, not PNG pixels.

1. `groom-waist-hip-bridge.png`: one continuous white trouser waist/crotch/outer-hip underlay, spanning approximately x=-22..22, y=163..188, behind the coat and above the independently moving thighs. Include concealed overlap on both thigh roots. Paint the actual missing hip surfaces; do not widen a copied thigh.
2. `groom-knee-left-overlap.png` and `groom-knee-right-overlap.png`: two matching white cloth transition skins, centered on each knee at local (0,0), roughly x=-9..9, y=-7..9. Must replace the open shin-top rims and bridge both adjoining cloth shapes during the demonstrated bends. Paint folds for the original trouser perspective rather than copying one side to the other.
3. `groom-neck-finish.png`: small matching skin/neck repair around body (0,65), with concealed overlap under beard and collar; remove the source detail's dark artifact and blend the head-to-collar lighting. No replacement face required.
4. `groom-joined-grip-contact.png`: matching right palm/thumb/finger contact artwork with a concealed wrist attachment, drawn against the bride's actual hand position (shared target currently x=61.5,y=136 in the coupled rig). Can be supplied as back-palm and front-finger layers if interleaving is required. Validate reach first; do not lengthen the forearm artificially.
5. `groom-shoe-left-walking.png`: replace the shoe whose facing conflicts with the other foot; match walking direction and three-quarter perspective, with explicit heel, ankle and toe landmarks. A corrected artist-supplied pair is acceptable, but two new shoes are not yet proven necessary.

Conditional only: `groom-elbow-right-gusset.png`, a small navy cloth underlap at body elbow (31.5,118), if the overlap experiment cannot pass continuous large-angle visual review. No new shoulder skins, complete torso, full sleeves, shins, face, hair or rear coat are presently mandatory for this restricted forward-view rig. Wider swings, independent hair, turns or rear views require a new audit.

## Evidence and limits

- `standing.png` / `standing.svg`: full-size diagnostic standing assembly, with failures deliberately exposed.
- `walking-phases.png` / `walking-phases.svg`: all eight existing gait phases, generated from the website's walkMath IK, not arbitrary pose drawings.
- `arm-tests.png`: five shoulder and five elbow trials. Shoulder tests are separate from the walking test.
- `joint-audit.json`: per-joint alpha sampling plus rejected thigh-shift experiments and neck tests. Coverage only; not anatomy or cloth-quality certification.
- `rig.json`: disabled mask/layer recipe. Original preparation manifest and PNGs are unchanged and hash-checked by the generator.
- Reproduce with `node scripts/rig-groom-v2.mjs`; SVGs reference embedded existing source pixels. PNGs are browser-rendered inspection captures.

No full-body assembly passes yet. No live replacement, connected-hand claim, continuous gait approval, or romantic-stop approval is made. Standing and discrete gait samples expose the minimum remaining defects before animation integration.
