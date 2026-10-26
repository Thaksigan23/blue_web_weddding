# Mobile visual refinement — PASS

Scope: top-right safe-area Skip Intro and mobile-video-to-hero transition only.

- Skip: top/right max(22px, safe-area +12px), 44px minimum height. Monogram has independent left/top safe-area positioning. Actual browser measurements at360/390/430 show no overlap and no horizontal overflow.
- Mobile video completion/skip: the existing hero mounts at full opacity under a fixed video overlay; the held final/current frame dissolves over1.4s using a restrained easing curve. Mark/skip fade out early. The mobile handoff omits the bright light sweep.
- Natural ending stays event-driven: no early time threshold. All three natural-ending checks retain the video through9.75–9.90s, then ended=true at10.005s. Hero is mounted with opacity1 while outgoing video opacity falls. No empty intermediate stage or flash seen in the captured sequence.
- Actual source and original MP4 remain byte-identical; object-fit cover/object-position50%50% unchanged.
- Replay and Skip passed at360x800,390x844,430x932: each replay starts below0.16s, skip opens the same invitation, and video elements are released after exit. Countdown still present.
- Missing-media QA server verified SVG fallback and skip at all three sizes. Failure path retains its previous0.65s exit timing. Controller logic was not changed.
- Desktop1280 preview: procedural-svg, zero video elements, final-push camera unchanged. SVG artwork, invitation sections/styles/event data and experimental rigs not edited.
- Production build passed. All15 automated tests passed: existing gait/calendar/timezone/controller tests plus a natural-ended/no-early-cutoff regression check.

Gallery: index.html. Skip screenshots: skip-360.png,skip-390.png,skip-430.png. Live transition captures for all three sizes: transition-{width}-{last,early,mid,late,hero}.png. checks.json contains measured geometry/opacities/end states; fallback-checks.json contains isolated error-path checks.

Browser safe-area env values are zero in these emulated rectangles; CSS uses device safe-area values when supplied by the browser. Physical notched iOS/Android inspection remains recommended. No claim of exhaustive frame-by-frame flash testing on every device.
