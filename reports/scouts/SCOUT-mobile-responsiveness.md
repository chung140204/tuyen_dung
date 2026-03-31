# Scout Report: Mobile Responsiveness (Revision 2)

## Exploration Scope
- Target: `index.html`, `style.css`
- Boundaries: Mobile viewport rendering, `max-width` overflow, layout bugs.

## Patterns Discovered
### Pattern: Horizontal Overflow Triggers (white-space: nowrap)
- **Location**: `style.css` (classes: `.title-red`, `.title-black`, `.opp-title-white`, `.opp-title-gold`), `index.html` (inline style for "BẠN ĐƯỢC GÌ" header).
- **Usage**: Used to force titles onto a single line. On mobile screens (`< 768px`), this prevents text wrapping and forces the entire page to expand horizontally, creating an unwanted horizontal scrollbar.

### Pattern: Oversized Form Wrapper
- **Location**: `style.css` (`.form-wrapper`)
- **Usage**: `width: 110%;` is used on desktop for a pop-out effect. On some smaller screens, if not restricted, this overflows the viewport.

### Pattern: Hardcoded Inline Font Sizes
- **Location**: `index.html` (phone number inline style `font-size: 2.5rem`).
- **Usage**: Blocks CSS media queries from scaling text down.

## Integration Points
| Point | File | Function | New Code Location |
| ------ | ------ | -------- | ----------------- |
| Titles CSS | `style.css` | Typography layout | Update `@media (max-width: 768px)` to override all `white-space: nowrap` |
| Inline Styles | `index.html` | Content styling | Move inline phone size and "BẠN ĐƯỢC GÌ" inline styles into generic CSS classes |

## Conventions
- Use CSS Media queries for responsive typography limit.
- Prefer `white-space: normal` or `word-break: break-word` on mobile.

## Warnings
- ⚠️ Ensure changing `width: 110%` to `100%` on mobile doesn't break the intended aesthetic.
