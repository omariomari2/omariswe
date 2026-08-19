# Single-Page Portfolio Design

## Goal
Consolidate the portfolio into one scrolling page while preserving the existing visual system, typography, motion, and interaction style.

## Information architecture
The rendered page order is:
1. Hero
2. About
3. Experience
4. Projects
5. Contact

The menu contains only `About`, `Experience`, `Projects`, and `Contact`. The `Bright Owusu` mark returns to the hero. There is no Home menu item.

## Content rules
- Remove Certifications entirely.
- Do not migrate content from the old standalone About page.
- The existing homepage intro becomes the About section.
- Rewrite visible copy to be terse, technical, and senior in tone.
- Remove marketing filler, student-showcase phrasing, and playful CTA language.

## Experience
Show five substantive entries only:
- Palo Alto Networks — Product Security Intern
- Wayfair — AI Automation Extern
- Orda Rides — Software Engineer
- Maddy Group Ltd — Software Engineering Intern
- GSU College of Arts & Science, Digital Technologies — Undergraduate Researcher

## Projects
Show a focused set of engineering projects without duplicating Experience:
- Immigration Assistant
- Uncluster
- Go-Shop
- WVS 1.02
- LintKit

## Navigation
Use same-page anchors backed by Locomotive Scroll. Links must not trigger Barba page transitions. Opening a section from the hamburger menu must close the menu and resume scrolling before navigation.

## Removed pages
The standalone Work and About pages are no longer part of the site and should be removed after their required content has been consolidated.

## Design constraints
- Preserve the current Neue Montreal typography, dark hero/footer, whitespace, rounded footer transition, magnetic buttons, Locomotive Scroll, and GSAP motion.
- Do not redesign the visual identity.
- Do not introduce a framework migration or new dependency.
