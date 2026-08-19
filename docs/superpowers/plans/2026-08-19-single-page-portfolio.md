# Single-Page Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Consolidate the existing portfolio into one scrolling page with terse engineering-focused copy, five experience entries, five selected projects, and no certifications or standalone Work/About pages.

**Architecture:** Replace the homepage markup with a single document that reuses the current CSS, GSAP, Locomotive Scroll, footer treatment, and navigation components. Same-page links use explicit scroll targets and a small inline Locomotive navigation handler so Barba never performs a page transition for section navigation. The legacy Work and About documents are deleted only after all retained content is represented on the homepage.

**Tech Stack:** Static HTML, existing CSS, jQuery, GSAP/ScrollTrigger, Locomotive Scroll, Barba.js

**Spec:** `docs/superpowers/specs/2026-08-19-single-page-portfolio-design.md`

## Global Constraints

- Page order: Hero → About → Experience → Projects → Contact.
- Menu: About / Experience / Projects / Contact. No Home item.
- Bright Owusu returns to the hero.
- Remove Certifications entirely.
- Do not migrate standalone About-page content.
- Preserve the existing visual system and dependencies.
- Copy must be terse, technical, and non-playful.

---

### Task 1: Define structural validation

**Files:**
- Create: `tests/single-page-portfolio-check.mjs`

**Interfaces:**
- Consumes: `index.html`
- Produces: exit code 0 only when the single-page structure is present and legacy navigation/certification copy is absent.

- [ ] **Step 1: Add assertions for required section IDs, menu labels, five experience companies, five selected projects, and no certification/legacy-page links.**
- [ ] **Step 2: Run the validator against the current homepage and confirm it fails because the current site still links to Work/About pages and lacks Experience/Projects section IDs.**
- [ ] **Step 3: Keep the validator unchanged for the implementation task.**

### Task 2: Consolidate the homepage

**Files:**
- Modify: `index.html`

**Interfaces:**
- Consumes: existing CSS and JS assets.
- Produces: `#top`, `#about`, `#experience`, `#projects`, and `#contact` targets plus `data-scroll-target` navigation links.

- [ ] **Step 1: Replace legacy page links with same-page section links in desktop and hamburger navigation.**
- [ ] **Step 2: Rewrite hero/meta/about/footer copy to concise engineering language.**
- [ ] **Step 3: Add the five approved Experience rows.**
- [ ] **Step 4: Add the five selected Project rows.**
- [ ] **Step 5: Remove certifications, the More Work CTA, and the promotional horizontal ORDA strip.**
- [ ] **Step 6: Add a small same-page Locomotive navigation handler that closes the hamburger menu before scrolling.**
- [ ] **Step 7: Run the structural validator and confirm it passes.**

### Task 3: Remove legacy pages

**Files:**
- Delete: `works/work.html`
- Delete: `about/about.html`

**Interfaces:**
- Consumes: completed single-page homepage.
- Produces: no standalone Work or About documents.

- [ ] **Step 1: Delete both legacy HTML files.**
- [ ] **Step 2: Search the branch for `works/work.html`, `about/about.html`, and `Certifications` references that can still be reached from the homepage.**
- [ ] **Step 3: Re-run the structural validator.**

### Task 4: Final verification

**Files:**
- Verify: `index.html`
- Verify: `tests/single-page-portfolio-check.mjs`

**Interfaces:**
- Produces: a reviewable branch diff with no unrelated changes.

- [ ] **Step 1: Compare the feature branch against `main` and confirm changes are limited to the approved consolidation, its validation script, and design/plan docs.**
- [ ] **Step 2: Verify the final homepage source contains no Home menu item, Work nav item, certification section, standalone About link, or standalone Work link.**
- [ ] **Step 3: Open a draft PR for review rather than merging directly.**
