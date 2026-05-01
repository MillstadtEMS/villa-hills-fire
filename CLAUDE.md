@AGENTS.md

## Visual QA — Puppeteer Screenshot Workflow

After any UI change (new page, component edit, layout tweak, styling fix), run the
screenshot workflow below before considering the work done. The goal is to catch
aesthetic and layout problems that aren't visible in code alone.

### How to run

1. **Make sure the dev server is running** on the project's port (default `3000`).
2. **Navigate Puppeteer** to the page you changed:
   ```
   mcp__puppeteer__puppeteer_navigate → url: "http://localhost:3000/the-page"
   ```
3. **Take screenshots at three breakpoints** — desktop, tablet, and mobile:

   | Breakpoint | Width | Height | Name convention          |
   |------------|-------|--------|--------------------------|
   | Desktop    | 1440  | 900    | `{page}-desktop`         |
   | Tablet     | 768   | 1024   | `{page}-tablet`          |
   | Mobile     | 375   | 812    | `{page}-mobile`          |

   ```
   mcp__puppeteer__puppeteer_screenshot → name: "home-desktop", width: 1440, height: 900
   mcp__puppeteer__puppeteer_screenshot → name: "home-tablet",  width: 768,  height: 1024
   mcp__puppeteer__puppeteer_screenshot → name: "home-mobile",  width: 375,  height: 812
   ```
4. **Scroll and capture below-the-fold content** when the page is longer than one
   viewport. Use `puppeteer_evaluate` to scroll, then screenshot again:
   ```
   mcp__puppeteer__puppeteer_evaluate → script: "window.scrollTo(0, document.body.scrollHeight / 2)"
   mcp__puppeteer__puppeteer_screenshot → name: "home-desktop-mid"
   mcp__puppeteer__puppeteer_evaluate → script: "window.scrollTo(0, document.body.scrollHeight)"
   mcp__puppeteer__puppeteer_screenshot → name: "home-desktop-bottom"
   ```

### What to look for (checklist)

Analyze every screenshot against this checklist. If any item fails, fix the code
and re-screenshot to confirm.

**Layout & Symmetry**
- [ ] Content is horizontally centered or intentionally aligned (no accidental drift)
- [ ] Grid columns / card rows are evenly spaced — no orphan card stretching full width
- [ ] Sections have consistent vertical spacing (padding/margin rhythm)
- [ ] Left and right gutters are equal and nothing bleeds to the screen edge without purpose

**Text & Readability**
- [ ] No text is cut off, overflowing its container, or running off-screen
- [ ] No text overlaps other text or overlaps images
- [ ] Line lengths are comfortable (~50-80 chars on desktop); not stretching edge-to-edge
- [ ] Font sizes create a clear hierarchy (h1 > h2 > body) and nothing looks out of scale
- [ ] Text has sufficient contrast against its background

**Responsive Behavior**
- [ ] Navigation collapses properly on mobile (hamburger or equivalent, no horizontal overflow)
- [ ] Images scale down without cropping important content or breaking layout
- [ ] Touch targets (buttons, links) are adequately sized on mobile (min ~44px)
- [ ] No horizontal scrollbar appears at any breakpoint
- [ ] Content stacks vertically on mobile in a logical reading order

**Visual Polish**
- [ ] Buttons, cards, and inputs have consistent border-radius and styling
- [ ] Colors match the project's brand palette — no default blues or unstyled elements
- [ ] Images are not stretched, squished, or pixelated
- [ ] Dark backgrounds have appropriate text colors (no dark-on-dark)
- [ ] Hover states and interactive elements look intentional (spot-check with puppeteer_hover)
- [ ] No placeholder text ("Lorem ipsum", "TODO", "test") visible on the page
- [ ] Favicon and page title are correct

**Carousels, Video Backgrounds & Animations**
- [ ] Screenshots capture a static frame — do NOT flag animation mid-states as bugs
      (e.g., a carousel between slides, a fade transition half-complete)
- [ ] For video backgrounds: ignore the frozen frame content, but DO check that the
      video container is correctly sized, has no layout shift, and any overlay text
      is legible against both light and dark frames
- [ ] Carousel indicators / dots / arrows are visible and properly positioned

**Image & Media Quality**
- [ ] All photos and logos must be clear and high-resolution — no blurry, low-res,
      or pixelated images anywhere on the site
- [ ] Logos should be crisp vector (SVG) or high-DPI raster (at least 2x display size)
- [ ] Hero images and background photos must be sharp at full viewport width
- [ ] If an image looks soft, compressed, or unclear — flag it and replace with a
      higher quality source

### When to skip

- Pure back-end / API-only changes with zero UI impact
- Changes limited to data files, env config, or docs
