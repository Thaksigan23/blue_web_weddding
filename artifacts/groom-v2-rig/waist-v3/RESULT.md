# Groom waist V3 — FAIL

Tested 440 × 250 RGBA source with genuine transparency. Pivot assigned (220,140), uniform scale 0.1, attached to body (0,177), above moving thighs and below unmodified coat. Original pelvis suppressed only in diagnostic AFTER. Thigh masks hide local y<6; source artwork is untouched. No stretch, recoloring or generated pixels.

- Waist continuity: PASS for the two sampled waist discs in standing plus eight gait phases; alpha>0.5 coverage is 100%. This is not a full-silhouette pass.
- Thigh-root coverage: FAIL. Some tilted root edges remain exposed beyond the candidate sides.
- Silhouette / shorts-like edges: FAIL. Fixed flared lobes and lower hems remain obvious over articulated trousers.
- Fabric consistency: FAIL. Radial folds and brightness do not blend into the original thigh fabric.
- Extraneous embroidery: PASS. V3 has none; the sherwani remains unchanged.

Replace lower shorts silhouette with joint-compatible hip-to-thigh transitions matched to each original trouser leg. Paint concealed overlap without a finished hem. Any masking must remain within overlap supported across the full gait; do not clip more leg material merely to hide protrusions.

Comparisons: standing-comparison.png, walking-comparison.png; full-body standing-comparison.svg. Reproduce with node scripts/test-groom-waist-v3.mjs. No live website or SVG fallback edited. Candidate remains disabled. No continuous animation approval.
