# Implementation Plan: Comprehensive Mobile Redesign

## 📌 User Request (VERBATIM)
> bạn đang hiểu sai vấn đề, cả trang web đang bị to khi xem điện thoại. Tôi cần bạn thiết kế lại sao cho phù hợp khi xem tren điện thoại

## 🎯 Acceptance Criteria (Derived from User Request)
| ID | Criterion | Verification Method |
|----|-----------|---------------------|
| AC1 | Mobile layout does not overflow horizontally. | Inspect element < 768px, ensure `html` width == `viewport` width (no horizontal scrollbar). |
| AC2 | All large text scales down properly for mobile. | Verify phone number, banner text, and section headers are readable without forcing scale out. |

## 📋 Context Summary
**Architecture**: Vanilla HTML/CSS landing page.
**Patterns**: Extensive use of `white-space: nowrap` and absolute large rem sizes on titles.
**Constraints**: Must preserve desktop view. Fix inline styles.

## Prerequisites
- [x] Analyze `style.css` for `white-space: nowrap` and `width`.

## Phase 1: Clean Up Inline HTML Styles
### Tasks
- [ ] Task 1.1: Refactor `index.html` inline styles.
  - Create standard classes for phone number and section titles.
  - Remove `white-space: nowrap;` inline style for the "BẠN ĐƯỢC GÌ" heading.
  - Remove inline `font-size: 2.5rem;` for the phone number.
  - Agent: `frontend-engineer`
  - File(s): `index.html`
  - Acceptance: AC1, AC2

## Phase 2: Implement Mobile-First Media Queries
### Tasks
- [ ] Task 2.1: Add global responsive resets into `style.css`.
  - Add a `@media (max-width: 768px)` block to reset `.title-red`, `.title-black`, `.opp-title-white`, `.opp-title-gold` to `white-space: normal !important;`.
  - Resize the banners, subtitles, and phone number classes.
  - Fix `.form-wrapper` to have `width: 100%` max on mobile and prevent horizontal overflow.
  - Adjust `.hero-new-title` and `padding` to fit mobile widths securely with `box-sizing`.
  - Agent: `frontend-engineer`
  - File(s): `style.css`
  - Acceptance: AC1, AC2

## Risks
| Risk | Impact | Mitigation | Rollback |
|------|--------|------------|----------|
| Overriding `white-space` causing ugly line breaks | Medium | Ensure font-sizes are also reduced so words fit naturally. | `git checkout style.css` |

## Rollback Strategy
Revert `style.css` and `index.html` using version control or local backup.

## Implementation Notes
Focus on `max-width: 768px` media query. The root issue is `white-space: nowrap` applied to multiple large titles. Overriding this on mobile is the key to preventing the "zoomed-in/overflowing" display bug on iPhones/Androids.
