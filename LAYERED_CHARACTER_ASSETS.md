# Layered 2.5D character replacement brief

## Inspection result

Only `public/images/light-invitation.jpg` and `dark-invitation.jpg` are available as original artwork. Both are flattened seated portraits. The light portrait is the primary face, hair, outfit and rendering reference; the dark portrait supplies additional navy/silver styling. Neither contains independent body layers, complete standing leg anatomy or hidden garment surfaces. Cropping them cannot produce clean walking characters.

No character replacement has been activated. `IllustratedCouple.jsx` still mounts the working procedural SVG, with `WalkingCoupleFallback.jsx` retained. The scene, camera push-in, arch, names, ceremony content, reduced-motion behavior and replay are unchanged.

## Recommended integration

Commission one coordinated, painted character set. Mount transparent PNG/WebP cutouts as SVG `<image>` elements inside the current joint groups, replacing drawing shapes rather than replacing their transforms. This keeps the eight gait phases, distance-based foot planting, heel/toe roll, shared hand target, acceleration, stop and glance. Separate artwork from motion before integrating: the present `WalkingCouple.jsx` contains both, and is not yet a generic raster-skin loader.

This supports high-quality illustrated shading without generating unrelated poses frame by frame. For long flowing cloth, use separately painted skirt and dupatta panels with conservative movement, or provide a weighted 2D mesh. A single full-body PNG cannot articulate. A single rigid skirt layer cannot reproduce complex fabric deformation; do not promise that it can.

If a mesh rig is supplied, keep the current gait solver as the source of hip, knee, ankle and hand targets, and write an adapter for the rig's named bones. A Rive/Spine/other runtime export is not automatically compatible: bone names, coordinates, scale and deformation weights must be inspected and mapped before changing the active renderer. Do not add a runtime dependency without an actual asset requiring it.

## Required artwork

Deliver two approved full-length standing masters in coordinated three-quarter perspectives, groom looking toward the bride and bride toward the groom. Use natural adult proportions and the original portrait's facial identity. Include fully painted surfaces behind overlapping limbs. Use consistent soft blue rim light and restrained neutral fill; keep hard ground shadows out of the textures.

For **each person**, deliver separate named layers:

- `torso`, `pelvis`, `neck`, `head`, plus optional independent irises and eyelids for a restrained glance.
- `upper-arm-left`, `forearm-left`, `hand-left`; corresponding right-side layers. Supply neutral and connected-hand artwork, with matching wrist orientation and identical joined-hand contact marks.
- `thigh-left`, `shin-left`, `shoe-left`; corresponding right-side layers. Paint complete white trouser legs for the groom, including knee overlap and ankle folds. Hidden bride legs must also be complete wherever a moving hem could reveal them.
- `hair-back`, `hair-front`, with a few separately painted wavy strands; jewelry must remain registered to its supporting head/neck layer.

**Groom-specific:** styled black hair, natural beard, detailed eyes/nose/jaw shading, navy sherwani front and back panels, collar, sleeve cuffs and restrained silver embroidery. Keep all white trouser pixels opaque. Include complete black shoes with sole/contact landmarks.

**Bride-specific:** royal-blue bodice, skirt-back, skirt-front, left/right outer skirt folds, optional central fold panels, dupatta-back, dupatta-front and trailing dupatta. Preserve silver embroidery continuity across panels. Deliver clean straight-alpha transparency for sheer fabric; use a partially transparent layer rather than deleting it. Long dark hair needs painted highlights and complete hidden roots. Include earrings, necklace and hair ornaments as appropriate to the approved reference design.

## Rig registration

The shared stage is **255 × 290 logical units**, SVG viewBox `-65 -6 255 290`. Groom origin is `(0,0)` and bride origin is `(123,0)`. These are current attachment coordinates, not an instruction to distort natural anatomy: if the approved masters need revised bone proportions, update geometry and IK lengths together and rerun foot/hand tests.

- Hip attachments: `(-12,177)` and `(12,177)` in each person's local space.
- Femur and shin: 48 units each. Knee and ankle groups use local translations `(0,48)`.
- Shoulder attachments: `(-23,83)` and `(23,83)`.
- Upper arm: 35 units; forearm/hand contact: 38 units. Elbow group translates `(0,35)`; hand contact is `(0,38)` in the lower-arm group.
- Upper-body pivot: `(0,160)`; head pivot: `(0,65)`.
- Shared holding point settles near `(61.5,136)` in the pair's world space. Convert through body/shoulder transforms rather than independently placing the hands.
- Ankle reference near y268; sole contact is y278. Mark heel and toe as well as the ankle, since the player compensates rolling contact.

For every exported cutout provide: filename, logical bounds `(x,y,width,height)`, source pixel dimensions, pivot coordinates, parent bone, draw order, and overlap margin. Include a manifest in JSON and a composite preview showing all layers assembled. Paint at least 8 logical units of hidden overlap around knees, elbows and shoulders, adjusted if required by the maximum joint rotation. Do not include visible pivot marks in production textures.

## Delivery format and approval

- Layered PSD/Krita/other editable painting source, plus individual lossless transparent PNGs. WebP derivatives may be produced after visual approval.
- Use a 4× master reference canvas (1020 × 1160 for the complete pair). Translate logical stage coordinates into that canvas with `pixelX=(x+65)*4`, `pixelY=(y+6)*4`. Individual layers may be cropped only when their bounds and pivots are recorded in the manifest.
- No labels, checkerboard pixels, neighboring characters, clipped silhouettes or colored edge halos. Test edges and sheer layers over both navy and icy blue.
- Keep character identity, proportions, lighting, jewelry and embroidery consistent across all layers. Supply neutral standing and romantic composite previews made from the same pieces, not independently generated replacements.
- Before activation, inspect all eight gait phases and the final stop. Verify hidden joint fills, unbroken white trousers, connected hands, sole contact, stable faces, no garment popping, and no overlap with names or button at 360/390/430px and desktop.
- Require all images to decode before selecting the new skin for an intro run. Missing, incomplete or failed assets must retain the existing SVG for that whole run. Reduced motion must show a finished standing pose; replay must reset the same verified rig.

## Current stopping point

Artwork creation/cleanup is required outside the current project assets. Do not replace visible characters with the JPEG crops, an unverified generated sheet, or isolated realistic heads pasted onto the old simplified body. Realistic illustration quality has **not** been achieved by this inspection. Activate only after the complete registered set exists and passes the checks above.
