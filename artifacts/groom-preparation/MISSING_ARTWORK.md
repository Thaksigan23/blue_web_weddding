> Latest v2 assessment: see [groom-v2-preparation/MISSING_ARTWORK.md](../groom-v2-preparation/MISSING_ARTWORK.md). The newer sheet adds candidates but has not passed the standing-rig completeness gate. This document records the original v1 blockers.

# Required groom artwork — standing gate blocked

No additional sheet extraction can supply the missing anatomy. Keep the live SVG active. The source master, 22 exports and provisional manifest are unchanged.

1. **groom-head-3q-right.png** — Right-looking three-quarter view matching the original full-body face. Complete jaw/neck attachment; no collar or adjacent head pixels.
   Blocker: The existing clean head-right is left-facing; the desired head is merged with another view.

2. **groom-neck.png** — Fully painted neck behind beard and collar, with hidden overlap.
   Blocker: Not independently present.

3. **groom-hair-front.png** — Front hair separate from face, with a complete hidden root.
   Blocker: Hair is baked into head images.

4. **groom-hair-back.png** — Back hair separate, matching the same approved head.
   Blocker: Back-view head is not a front-facing hair layer.

5. **groom-torso-front.png** — Sleeve-free embroidered front torso with painted shoulder/armpit surfaces.
   Blocker: Front/back torso group touches and includes baked sleeves.

6. **groom-torso-back.png** — Matching back torso skin with completed shoulder joins.
   Blocker: No isolated compatible back skin.

7. **groom-pelvis.png** — Complete trouser waist, pelvis and hidden hip surfaces behind sherwani.
   Blocker: Entirely absent from the source parts.

8. **groom-coat-front-left.png** — Independent front hem panel, complete waist attachment and embroidery continuity.
   Blocker: Visible coat drawings touch; cannot separate complete panels cleanly.

9. **groom-coat-front-right.png** — Matching other front hem panel, same lighting and weave.
   Blocker: No verified separate panel.

10. **groom-coat-back.png** — Back hem surface behind both moving legs, including hidden waist overlap.
   Blocker: Not supplied as an independent matching panel.

11. **groom-upper-arm-left.png** — Upper sleeve only; painted shoulder and elbow caps.
   Blocker: Existing upper-arm reference contains a bent whole sleeve and cuff.

12. **groom-upper-arm-right.png** — Other upper sleeve only, from the same character master.
   Blocker: Same mixed upper/lower anatomy problem.

13. **groom-forearm-left.png** — Forearm sleeve only; matching elbow and wrist attachment.
   Blocker: Existing lower sleeve rest orientation and elbow fill are unverified.

14. **groom-forearm-right.png** — Other forearm sleeve only; compatible with holding wrist.
   Blocker: Hidden elbow/wrist surfaces need repainting.

15. **groom-hand-right-hold-back.png** — Groom hand only: rear palm/fingers, matched wrist and shared contact landmark.
   Blocker: Paired holding-hands image contains fused anatomy.

16. **groom-hand-right-hold-front.png** — Matching foreground thumb/finger occlusion layer; no bride skin baked in.
   Blocker: Needed to interleave the connected hands without duplicating anatomy.

17. **groom-thigh-left-complete.png** — Reuse the existing white cloth pixels; repaint hidden hip and knee caps.
   Blocker: Visible piece has open cut ends and no verified overlap.

18. **groom-thigh-right-complete.png** — Same for the other thigh; preserve complete opaque white trousers.
   Blocker: Same missing hip/knee overlap.

19. **groom-shin-left-complete.png** — Reuse current cloth; paint concealed knee/ankle surfaces and folds.
   Blocker: Knee and ankle overlap is absent.

20. **groom-shin-right-complete.png** — Same for the other shin, consistent rest perspective.
   Blocker: Open ends cannot pass flexion checks.

21. **groom-shoe-left-3q.png** — Matched walking-view black shoe with ankle, heel and toe landmarks.
   Blocker: Current side-view pair points in opposite directions.

22. **groom-shoe-right-3q.png** — Matched opposite foot. Existing right shoe may be reused if its perspective is approved.
   Blocker: No verified matched-perspective pair or contact landmarks.

Existing relaxed hands, original facial painting, embroidery, trouser pixels and a perspective-compatible shoe can be reused after registration. Separate front/back hair is required only if that secondary motion is retained; otherwise an approved whole head can carry the hair together. The filenames describe the final complete layer set; existing valid pixels should be retained in corrected layers.

Acceptance: complete standing composite before walking; 8 logical units of hidden overlap; no pose seams, contact drift or changed facial identity; verified parent-local pivots. See audit/validation.json for blocked phase statuses.
