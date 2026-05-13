---
'@pixelore/react': patch
---

Fix two visual bugs in Tabs and Dialog:

- **Tabs:** the right-edge divider on the active tab could render against a
  half-pixel boundary, producing a thin blurry gap. Dividers now come from
  a 2px gap with the parent's black background showing through, so they
  always pixel-snap. No API change.

- **Dialog:** when content exceeded the viewport height, the dialog spilled
  off the top and bottom of the page with no way to scroll. Content is now
  capped to `calc(100vh - 2rem)` with an internal scroll body; the close
  button stays pinned in the dialog frame while the body scrolls. No API
  change.
