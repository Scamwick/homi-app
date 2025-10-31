# HōMI Brand Validation Tools

## Overview

Automated tools to ensure brand consistency across HōMI marketing materials and web pages.

## Tools

### 1. Brand Validator (`homi-validator.js`)

Node.js script that validates:
- ✅ Brand name consistency (HōMI with macron ō)
- ✅ Color palette adherence
- ✅ Typography patterns
- ✅ Spacing consistency
- ✅ Accessibility standards
- ✅ Semantic HTML structure
- ✅ Brand tagline presence

### 2. Press Automation Kit (`homi-press-automation-kit.html`)

Complete press kit HTML featuring:
- Brand color showcase with swatches
- Key features grid
- Technology stack documentation
- Statistics display
- Press contact information
- Download sections for brand assets

## Usage

### Validate a File

```bash
node homi-validator.js <file-to-validate.html>
```

### Example

```bash
node homi-validator.js homi-press-automation-kit.html
```

### Output

```
🎨 HōMI Brand Identity Validator

✅ PASSES:
  ✓ Correct brand name used: HōMI
  ✓ Using 32 brand colors
  ✓ Typography defined
  ✓ Semantic HTML used
  ✓ ARIA labels present
  ✓ Brand tagline found
  ✓ Gradient styling used

⚠️  WARNINGS:
  Found "homi" in URLs/emails (acceptable)

📊 Summary: 8 passes, 3 warnings, 0 errors
```

## Brand Guidelines

### Brand Name
**Always use:** HōMI (with macron over the 'o')
**Exceptions:** URLs, email addresses, social handles (use "homi" or "HoMI")

### Color Palette

#### Primary Colors
- **Indigo:** `#4f46e5` to `#a5b4fc` - Trust & Stability
- **Purple:** `#7c3aed` to `#c4b5fd` - Innovation & AI
- **Pink:** `#ec4899` to `#fbcfe8` - Energy & Growth

#### Background Colors
- **Slate:** `#0f172a` to `#94a3b8` - Depth & Foundation

### Typography
- **Font Family:** -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif
- **Heading Hierarchy:** h1, h2, h3 with proper nesting
- **Font Weights:** 500 (medium), 600 (semibold), 700 (bold), 800 (extrabold)

### Design Patterns
- **Gradients:** Linear gradients (135deg) with brand colors
- **Glassmorphism:** backdrop-blur with semi-transparent backgrounds
- **Border Radius:** 0.75rem to 2rem for cards and sections
- **Shadows:** Colored shadows using brand colors with transparency

### Accessibility
- ✅ ARIA labels for interactive elements
- ✅ Semantic HTML (header, main, section, article, footer)
- ✅ Alt text for images
- ✅ Proper heading hierarchy
- ✅ Color contrast ratios for text

## Validation Checklist

Before publishing any HōMI material:

- [ ] Brand name uses "HōMI" with macron (except URLs/handles)
- [ ] Colors match brand palette (indigo/purple/pink/slate)
- [ ] Typography follows system font stack
- [ ] Gradients use 135deg angle with brand colors
- [ ] Semantic HTML structure is used
- [ ] ARIA labels are present on interactive elements
- [ ] Alt text provided for all images
- [ ] Tagline is present ("Your AI-Powered Home Buying Companion")
- [ ] Footer includes copyright and team attribution

## Test Results (Latest)

**File:** `homi-press-automation-kit.html`
**Date:** 2025-10-27
**Result:** ✅ PASSED

- **Passes:** 8
- **Warnings:** 3 (URL/email formatting - acceptable)
- **Errors:** 0

### Details
- ✅ Brand name "HōMI" used correctly in all content
- ✅ 32 brand color instances found
- ✅ Typography defined consistently
- ✅ Semantic HTML structure (header, main, section, article, footer)
- ✅ ARIA labels present for accessibility
- ✅ Brand tagline present
- ✅ Gradient styling used throughout
- ⚠️  URLs/handles use plain ASCII (press@homi.ai, @HoMI_AI) - **acceptable**

## Files

- `homi-validator.js` - Brand validation script
- `homi-press-automation-kit.html` - Press kit HTML template
- `BRAND-VALIDATION.md` - This documentation

## Notes

The validator automatically checks for common brand consistency issues but should be used alongside manual review for design quality and message alignment.
