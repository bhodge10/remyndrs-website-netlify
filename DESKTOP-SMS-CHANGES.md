# Desktop SMS Link Replacement — Website Changes (2026-02-03)

## Summary

All `sms:` links across the Remyndrs website have been replaced with desktop-friendly alternatives. On mobile devices (<769px), the original SMS links remain unchanged. On desktop (769px+), users get contextually appropriate alternatives instead of broken SMS prompts.

---

## Files Modified

### `index.html`
### `faq.html`
### `commands.html`

(`privacy.html` and `terms.html` had no SMS links — no changes needed.)

---

## What Was Done

### 1. CSS Utility Classes Added (all 3 files)

Added mobile/desktop visibility utility classes using a **769px breakpoint**:

- `.mobile-only` — visible by default, hidden at 769px+ (`display: none !important`)
- `.desktop-only-block` — hidden by default, `display: block` at 769px+
- `.desktop-only-inline` — hidden by default, `display: inline` at 769px+
- `.desktop-only-inline-block` — hidden by default, `display: inline-block` at 769px+
- `.desktop-only-inline-flex` — hidden by default, `display: inline-flex` at 769px+
- `.desktop-only-flex` — hidden by default, `display: flex` at 769px+

All use `!important` to override inline styles on existing elements.

### 2. Smooth Scrolling (`index.html` only)

- `html { scroll-behavior: smooth; }` for anchor link scrolling
- `scroll-margin-top: 80px` on `#hero` and `#contact` to offset the sticky header
- Added `id="hero"` to the hero `<section>` element

### 3. Share Button Styles (all 3 files)

- `.share-copy-btn` — resets button styles (border, cursor, font) so `<button>` share elements match existing `<a>` styling
- `.floating-share-btn[data-copied]::before` — "Copied!" tooltip CSS (`index.html` only)

---

## Desktop Replacement Strategy by Link Category

### Category A: "Start Free Trial" / CTA Buttons → Scroll to Hero Form

**Applies to:** `index.html` (pricing CTA, final CTA section), `commands.html` (bottom CTA)

- **Mobile:** Original `sms:+18555521950&body=START` links remain (with `mobile-only` class)
- **Desktop on `index.html`:** `<a href="#hero">Get Started Now</a>` — scrolls to the existing hero signup form which collects phone number and calls the backend `/api/signup` endpoint
- **Desktop on `commands.html`:** `<a href="index.html#hero">Get Started Now</a>` — links to the home page hero form
- Subtitle/disclaimer text split into mobile and desktop versions

### Category B: "Ask a Question" Links → Contact Form or Email

**Applies to:** `index.html` (FAQ intro link, FAQ bottom button), `faq.html` (intro link, bottom button)

- **Mobile:** Original `sms:+18555521950&body=QUESTION` links remain (with `mobile-only`)
- **Desktop on `index.html`:** `<a href="#contact" class="desktop-scroll-to-contact" data-contact-type="question">` — scrolls to #contact section and auto-opens the Question card via JS
- **Desktop on `faq.html`:** `<a href="mailto:support@remyndrs.com">Email us your question</a>` — since faq.html doesn't have its own contact form

### Category C: Contact Buttons (Privacy section, Footer) → Contact Form or Index Link

**Applies to:** `index.html` (privacy section 3 buttons, footer 3 buttons), `faq.html` (footer), `commands.html` (footer)

- **Mobile:** Original SMS links remain (with `mobile-only`)
- **Desktop on `index.html`:** `<a href="#contact" class="desktop-scroll-to-contact" data-contact-type="support|feedback|question">` — scrolls to #contact and auto-opens the matching card
- **Desktop on `faq.html` / `commands.html`:** `<a href="index.html#contact">` — links to the home page contact section
- Email button (`mailto:`) is unchanged on all pages (works on both mobile and desktop)

### Category D: Share Buttons → Clipboard Copy

**Applies to:** `index.html` (share section, footer, floating button), `faq.html` (footer), `commands.html` (footer)

- **Mobile:** Original `sms:?&body=...` share links remain (with `mobile-only`)
- **Desktop:** `<button class="share-copy-btn">` elements that copy the share message to clipboard
- Share message copied: `I'm loving Remyndrs! Never forget anything again. Text START to +1 (855) 552-1950 for a free trial`
- Uses `navigator.clipboard.writeText()` with `document.execCommand('copy')` fallback
- Shows "Copied!" text feedback for 2 seconds

---

## JavaScript Handlers Added

### Scroll-to-Contact Handler (`index.html` only)

```javascript
// On click of .desktop-scroll-to-contact elements:
// 1. Browser smooth-scrolls to #contact (via href="#contact")
// 2. After 600ms delay (for scroll to complete), programmatically clicks
//    the matching .contact-card-header to open the correct form card
// Matches via data-contact-type attribute ("support", "feedback", "question")
```

### Clipboard Copy Handler (all 3 files)

```javascript
// On click of .share-copy-btn elements:
// 1. Copies share message via navigator.clipboard.writeText()
// 2. Falls back to document.execCommand('copy') for older browsers
// 3. Shows "Copied!" feedback for 2 seconds
// 4. Floating share button uses data-copied attribute for CSS tooltip
```

---

## Backend Implications

- **No backend changes required** — all changes are purely frontend CSS/HTML/JS
- The existing `/api/signup` endpoint (called by the hero form) is now the primary desktop conversion path
- The existing `/api/contact` endpoint (called by the #contact form cards) handles desktop contact submissions
- The share message text is hardcoded in the JS clipboard handler — if the share message or phone number changes, update it in all 3 files

---

## Testing Checklist

- [ ] **Desktop (>769px):** All SMS links hidden. CTA buttons scroll to hero form or link to index.html. Contact links scroll to #contact (or link to index.html#contact on subpages). Share buttons copy to clipboard.
- [ ] **Mobile (<769px):** All original SMS links visible and working. Desktop-only elements hidden.
- [ ] **769px breakpoint:** Resize browser across breakpoint — clean toggle, no flash of wrong content.
- [ ] **Smooth scroll:** Header doesn't overlap target sections (scroll-margin-top working).
- [ ] **Clipboard:** "Copied!" feedback appears and resets after 2 seconds.
- [ ] **Contact auto-open:** Clicking "Ask a Question" on desktop scrolls to #contact and opens the Question card.
