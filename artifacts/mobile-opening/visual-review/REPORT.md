# Mobile opening — visual quality review

## Verdict

ACCEPTABLE WITH CROPPING COMPROMISES for the current mobile opening. A true portrait video is strongly recommended for a premium full-couple/full-arch composition, but is not technically required to keep faces and joined hands visible. No production animation, crop setting or invitation design was changed by this review.

## Evidence and method

- Actual source: public/videos/engagement-opening-mobile.mp4, H.264,1280x720 landscape,24FPS,10.005s. Not replaced or stretched.
- Twelve PNG captures: exact media times0,3,6,9 seconds at360x800,390x844,430x932.
- Exact-time images use an isolated browser viewer that pauses the real decoded MP4. It imports the production cover/position/shade/mark/skip stylesheet and fonts, with box sizing matched. This avoids claiming a normal live autoplay screenshot can be timed to the exact frame. The production controller is not modified or paused.
- Live natural ending, first-frame replay, poster readiness, Skip Intro and invitation handoff were separately captured at390x844 on the actual application.
- index.html is a filterable comparison gallery. review.html is the isolated exact-time viewer. All screenshot PNGs remain at their requested logical viewport dimensions.

## Framing findings across all twelve captures

- Faces: PASS. Both remain fully inside the crop at every requested time and size. No head is clipped by the frame.
- Joined hands: PASS for framing. Visible inside the frame; near9s fingers/arms overlap the bodies and dress naturally, making the grip less distinct. This is source-footage occlusion, not viewport clipping.
- Couple/full silhouette: PARTIAL. At0s there is comfortable headroom and both figures read clearly. By3s the lateral margins tighten; at6s/9s the groom's outer shoulder/free-arm edge and the bride's outer flowing fabric can touch or cross the crop edge. Feet/hem sit close to the lower boundary in later frames. This is not a consistent full-silhouette presentation.
- Floral arch: PARTIAL at every size. Crown and central flowers remain visible, but the side uprights/outer blooms are substantially cropped. No safe position setting can restore the whole arch while retaining cover.
- Moon: PASS. Remains visible; flowers/foliage overlap it in parts of the source composition, but the viewport does not remove it.
-360x800 is the tightest horizontal framing.390x844 and430x932 have almost identical aspect ratios and therefore similar crops.

Cover shows the full source height but only about324 source pixels horizontally at360x800,333 at390x844 and332 at430x932. Roughly74–75% of the landscape source width is outside the viewport; much of that is the baked blurred side scenery. The central sharp scene is also clipped, which explains the lost arch and outer clothing.

## Timestamp notes

-0s: faces, grip and feet visible; arch sides cropped; moon clear.
-3s: romantic glance and grip read well; body margins begin tightening; outer fabric cropped.
-6s: groom's outside shoulder/free-arm margin is tight; dupatta extends beyond the frame; faces/hands remain safe.
-9s: closest framing, strongest lateral silhouette cuts. Moon and arch crown survive; feet/hem have little bottom breathing room. Skip button overlays a small portion of the lower-right dress/ground, never faces or hands.

## Safe CSS positioning experiments

At360x800 and9s, tested47%,50%,53% horizontal object-position with cover unchanged.47% gives the groom more room but removes more of the bride's right fabric/scenery.53% cuts more of the groom. Both faces remain visible, but neither repairs the complete silhouette/arch. Retain50%50% as the balanced compromise. No stretch, scale distortion, contain letterboxing, or production CSS changes were made.

## Live transition, Skip and replay

- Natural end at10.005s fades the final frame down into navy, followed by the lighter React hero. It is a sequential fade-through-navy, not an overlapping crossfade. The dark-to-light luminance change is noticeable but orderly.
- No abrupt pure-black frame, missing image or broken loading UI was observed in the sampled live sequence. Sequential screenshots are not a frame-by-frame proof for every browser/device.
- Replay returned to0.082s at inspection, with actual first-frame poster complete. No black flash observed on the inspected replay.
- Skip remained legible, anchored lower-right. Measured at390x844:126.8x44px, bottom22px, right approximately22px. It stays inside all three requested screen captures. Production safe-area CSS is preserved; physical notched-device testing is still recommended.
- Skip opens the existing invitation. Hero, countdown and navigation remain actual React content.

## Portrait replacement recommendation

For a stronger premium result, commission a genuine1080x1920 or720x1280 portrait composition, not a landscape clip with baked blur bars. Keep both complete silhouettes, hands, arch and moon composed for the portrait frame throughout the camera move. Keep faces/hands inside the central70–75% of frame width to tolerate taller phones, leave breathing room at the feet, and leave the lower-right control area clear. Do not bake guest-facing event text or controls into the footage.

No new artwork/video was generated, no live design was changed, and experimental2.5D rigs remain disabled.
