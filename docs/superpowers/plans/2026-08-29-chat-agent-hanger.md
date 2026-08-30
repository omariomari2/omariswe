# Chat Agent Hanger Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the header location/globe badge with a clickable Chat Agent badge that uses the existing manifest-only ChatGPT handoff.

**Architecture:** The header hanger will become a semantic link containing the existing label and `assets/chat.webp`. Both the header link and About-section button will share a `data-agent-handoff` hook, allowing `initAskAgent()` to assign the same canonical manifest-only ChatGPT URL to both controls.

**Tech Stack:** Static HTML, CSS, vanilla JavaScript, Node.js structural tests.

## Global Constraints

- Send only the public manifest URL in the ChatGPT query string.
- Do not expose private phone or email data in the manifest or generated URL.
- Preserve the existing header layout and responsive behavior.
- Keep the existing About-section Ask Agent control as a fallback.

---

### Task 1: Add the clickable header Chat Agent badge

**Files:**
- Modify: `index.html:135-161`
- Modify: `assets/css/style-new.css:904-1015`

**Interfaces:**
- Consumes: `assets/chat.webp` and the shared `data-agent-handoff` hook.
- Produces: Keyboard-accessible `#ask-agent-hanger` link labelled “Ask your agent about me”.

- [ ] **Step 1: Replace the hanger SVG/globe markup**

Wrap the hanger contents in an anchor, replace the location text, and use the chat image:

```html
<div class="overlay get-height once-in once-in-secondary">
  <a class="hanger" id="ask-agent-hanger" data-agent-handoff href="https://chatgpt.com/"
    target="_blank" rel="noopener noreferrer" aria-label="Ask your agent about me">
    <p><span>Ask your agent about me</span></p>
    <img class="hanger-chat-image" src="assets/chat.webp" alt="">
  </a>
</div>
```

- [ ] **Step 2: Add responsive image and focus styles**

Keep the badge positioned by `.home-header .hanger`, hide its text on mobile, and replace globe-specific selectors with image sizing:

```css
.home-header .hanger {
   color: inherit;
   text-decoration: none;
}

.home-header .hanger-chat-image {
   display: block;
   width: 3em;
   height: 3em;
   object-fit: contain;
}

.home-header .hanger:focus-visible {
   outline: 2px solid var(--color-blue);
   outline-offset: .35em;
}
```

- [ ] **Step 3: Run the structural test**

Run: `node tests/single-page-portfolio-check.mjs`

Expected: FAIL because the new header hook and label assertions are not yet present.

### Task 2: Reuse the manifest-only handoff

**Files:**
- Modify: `index.html:252-259`
- Modify: `assets/js/index-new.js:1696-1707`

**Interfaces:**
- Consumes: every `[data-agent-handoff]` anchor and the canonical manifest link.
- Produces: both agent controls with `href=https://chatgpt.com/?q=<encoded-manifest-url>`.

- [ ] **Step 1: Mark the existing About control**

Add `data-agent-handoff` to the existing `#ask-agent` link without changing its fallback URL.

- [ ] **Step 2: Update the initializer**

Use all shared handoff links while retaining the current fallback behavior:

```javascript
const buttons = document.querySelectorAll('[data-agent-handoff], #ask-agent');
if (!buttons.length) return;

const manifestLink = document.querySelector('link[rel="alternate"][type="application/json"]');
const manifestUrl = manifestLink
    ? new URL(manifestLink.getAttribute('href'), window.location.href).href
    : new URL('agent-manifest.json', window.location.href).href;

buttons.forEach((button) => {
    button.href = `https://chatgpt.com/?q=${encodeURIComponent(manifestUrl)}`;
    button.dataset.manifestUrl = manifestUrl;
});
```

- [ ] **Step 3: Run syntax and structural checks**

Run:

```powershell
node tests/single-page-portfolio-check.mjs
node --check assets/js/index-new.js
```

Expected: PASS.

### Task 3: Verify browser behavior and accessibility

**Files:**
- Test: `tests/single-page-portfolio-check.mjs`

- [ ] **Step 1: Add structural assertions**

Assert the header label, `assets/chat.webp`, `#ask-agent-hanger`, and shared handoff hook are present.

- [ ] **Step 2: Verify runtime URL equality**

In the browser, confirm both links have the same decoded query value and that it equals `https://omari.is-a.dev/agent-manifest.json`.

- [ ] **Step 3: Verify responsive rendering**

Check the header at desktop and mobile widths; confirm the image remains visible, the text hides only on mobile, and keyboard focus is visible.

- [ ] **Step 4: Run final checks**

Run:

```powershell
node tests/single-page-portfolio-check.mjs
node --check assets/js/index-new.js
git diff --check
```

Expected: all commands pass.
