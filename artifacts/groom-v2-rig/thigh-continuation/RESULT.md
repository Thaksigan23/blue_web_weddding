# Independent thigh continuation: FAIL — disabled

## What was tested

Original same-side thigh pixels only, with no waist/shorts overlay. The corrected source band at thigh-local Y=3..15 was translated rigidly upward 10 units, giving a continuation at Y=-7..5. Main fabric fades in over Y=-1..1; continuation fades out over Y=1..5. Earlier underlapping fades produced a dark alpha seam and were rejected; retained trial keeps the original cloth opaque before the cap fades out. Both bands follow their own hip bones. No stretch, recoloring, new extraction, painted pixels or tiled texture. Copied folds are explicitly a diagnostic failure risk.

Existing pelvis white cloth is limited to body X=-6..6,Y=168..177 and rendered behind the legs/coat. Original coat, head, thigh and shin source files unchanged.

## Inspection

Left source has no alpha>0.5 cloth at corrected Y<=-5; first narrow support at Y=-4, X=-3.5..2.5. Right source has no cloth at Y<=-4; first narrow support at Y=-3, X=-6.25..-1.5. There are no concealed hip caps in these files. Full row measurements from Y=-15..15 are in audit.json.

## Findings

- Independent leg movement and no stretch: PASS.
- Fixed shorts-like overlay: avoided.
- Hip-disc coverage: PASS locally in the tested 129 poses. This does not measure side contours.
- Waist continuity: FAIL. Worst tested waist disc has 93.4% coverage at alpha>=0.95.
- Silhouette: FAIL. Lateral ledges and angular roots remain because different-height source cloth bands have different widths.
- Fabric consistency: FAIL. Repeated/shifted folds remain visible; feathered masks cannot supply actual missing cloth.
- Match to original standing reference: FAIL. Reference cloth tapers continuously; trial still has obvious segment transitions. Reference image is display-cropped only, without extracting it into an animation layer.

Measurements: 128 evenly spaced cycle samples plus standing; browser-reviewed standing, eight key phases and eight midpoint poses. Feather alpha is included in numerical sampling; SVG gradients approximate smoothstep with five stops. No continuous full-animation approval is made.

## Minimal missing texture regions

Two same-side, artist-painted upper-thigh continuation caps are required; no shared shorts/waist overlay. Suggested authoring files:

1. groom-thigh-left-hip-continuation.png
2. groom-thigh-right-hip-continuation.png

For each: author in its corrected thigh-bone coordinates, X=-11..11, Y=-14..10 (22x24 logical canvas; at 10px/unit, 220x240 PNG, pivot110,140). These are proposed painting bounds, not validated final silhouette dimensions. Parent hip-left/hip-right at body(-12,177)/(12,177). Upper region Y=-14..-5 must contain newly painted concealed white hip fabric; none exists in the source. Continue side contours around each angled cut/root through Y=0..4, then match the original folds and lighting across a blend area Y=3..10. Paint the two sides separately, with smooth tapered outer contours, no elliptical open-tube rim, no hem, no embroidery and no duplicated fold pattern. Exact alpha outline must be fitted against each phase and its original skin; do not fill the entire canvas as a rectangle. Existing source rows below Y=10 should remain unchanged.

The central crotch triangle remains a validation dependency: keep the original small pelvis underlay until new caps are fitted. If an inter-thigh sliver remains, add only the measured missing central white region within body X=-6..6,Y=168..180; do not commission another broad waist piece now.

## Comparisons

standing-detail.png; walking-phases.png; intermediate-poses.png; reference-comparison.png. Original PNG hashes were verified unchanged by the script. Reproduce with node scripts/test-groom-thigh-continuation.mjs. Live website and SVG fallback remain unchanged; rig enabled=false.
