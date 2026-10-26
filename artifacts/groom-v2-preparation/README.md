# Groom v2 — candidate artwork, not an approved animation rig

The requested groom_rig_v2.png filename does not exist. The new upload is public/characters/Groom Character Rig Asset Sheet.png; this is the source inspected. Its printed claims of 24 individual PNGs and 1020×1160 master dimensions describe content, not the actual file: the actual file is one 1536×1024 RGBA sheet.

## Deliverables

- 26 v2 source-pixel PNG candidates in layers/, plus the existing v1 relaxed left-hand cutout reused without mirroring or redraw (27 files total).
- manifest.json: all 22 previous missing-artwork items compared, source coordinates, estimated uniform registration, hierarchy, draw order and explicit blocked validation states.
- standing-preview.svg: 900×1200 provisional rest composite with source torso sleeves still baked in, visible seams and rig guide marks. It is not a completed layered skin or a verified standing pose.
- contact-sheet.html: all candidates shown against light and navy backgrounds for label/matte review.
- MISSING_ARTWORK.md: updated per-file findings and remaining repainting.
- verification.json: original source hashes and exact retained RGBA checks.

## Complete visible artwork versus complete rig layers

Newly available isolated candidates include the right-looking three-quarter head, separate hair drawings, front/back torso and coat references, a neck/collar view, a pelvis/shorts view, forearm/hand references, white trouser sections and side shoes. These are useful painted pieces. None has passed complete bone-skin verification.

The desired head is now separable; the hair and neck still need matched roots and perspective. The front torso includes whole sleeves. The rear torso has unresolved sleeve/side attachments. The pelvis includes coat panels. Upper-arm drawings are long cuffed sleeves rather than proven shoulder-to-elbow skins, the left forearm contains a fist, and the holding pair is fused. A separate curled right hand is present but its grip/occlusion is not registered to the bride. Trouser openings do not prove hidden hip/knee/ankle caps. Side shoes face opposite directions and need contact landmarks/perspective review.

## Alpha and fidelity

The source has noisy partial background alpha. Extraction uses connected foreground cores at alpha >=220, plus at most two adjacent pixels of original edge alpha >=64. Exterior alpha is zero in candidate PNGs. No white-color keying was performed; retained white cloth and black shoes preserve source RGBA. Caption regions under the collar detail, torso and side shoes were excluded. The 27-file contact sheet was reviewed; these remain candidate mattes, not artist-approved fine hair/edge masks. Very faint disconnected detail may need manual restoration.

No source RGB was repainted, no anatomy was invented, no non-uniform stretching or mirrored duplicate limbs were used. The left relaxed hand comes from the earlier original sheet, with its source recorded in the manifest. Source masters and the original v1 manifest are unchanged.

## Validation gate

The static composite exposes neck/collar, pelvis/coat and joint seams. It has not passed the complete standing-rig gate. All eight gait tests and the romantic-stop test for this new skin are NOT RUN. Testing an incomplete rigid-sleeve composite would not demonstrate articulation. All pivots/scales are provisional; enabled is false and rigReady is false.

The React site, active SVG, Framer Motion timeline, camera, arch, content, replay and reduced-motion behavior are unchanged. Run node scripts/prepare-groom-v2.mjs to reproduce candidates, and node scripts/verify-groom-v2.mjs to verify their declared sources.
