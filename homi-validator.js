#!/usr/bin/env node

/**
 * HōMI Brand Identity Validator
 * Checks for brand consistency: colors, fonts, spacing, and design tokens
 */

const fs = require('fs');
const path = require('path');

// HōMI Brand Guidelines
const BRAND_GUIDELINES = {
  colors: {
    primary: {
      indigo: ['#4f46e5', '#6366f1', '#818cf8', '#a5b4fc'],
      purple: ['#7c3aed', '#8b5cf6', '#a78bfa', '#c4b5fd'],
      pink: ['#ec4899', '#f472b6', '#f9a8d4', '#fbcfe8'],
    },
    neutral: {
      slate: ['#0f172a', '#1e293b', '#334155', '#475569', '#64748b', '#94a3b8'],
      gray: ['#1f2937', '#374151', '#4b5563', '#6b7280', '#9ca3af'],
    },
    semantic: {
      success: ['#10b981', '#34d399', '#6ee7b7'],
      warning: ['#f59e0b', '#fbbf24', '#fcd34d'],
      error: ['#ef4444', '#f87171', '#fca5a5'],
    },
  },

  typography: {
    fonts: {
      system: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      custom: ['Geist', 'Geist Sans', 'Inter', 'system-ui'],
    },
    sizes: {
      heading: ['text-6xl', 'text-5xl', 'text-4xl', 'text-3xl', 'text-2xl', 'text-xl'],
      body: ['text-base', 'text-lg', 'text-sm', 'text-xs'],
    },
  },

  spacing: {
    scale: ['0', '1', '2', '3', '4', '5', '6', '8', '10', '12', '16', '20', '24'],
  },

  brandElements: {
    logo: 'HōMI',
    taglines: [
      'Unlock Your Home\'s True Potential',
      'Your AI-Powered Home Buying Companion',
      'Your personalized homebuying and financial wellness companion',
    ],
  },
};

class BrandValidator {
  constructor(filePath) {
    this.filePath = filePath;
    this.content = '';
    this.errors = [];
    this.warnings = [];
    this.passes = [];
  }

  async validate() {
    console.log('\n🎨 HōMI Brand Identity Validator\n');
    console.log(`📄 Validating: ${this.filePath}\n`);

    try {
      this.content = fs.readFileSync(this.filePath, 'utf-8');
    } catch (error) {
      console.error(`❌ Error reading file: ${error.message}`);
      process.exit(1);
    }

    this.checkBrandName();
    this.checkColors();
    this.checkTypography();
    this.checkSpacing();
    this.checkAccessibility();
    this.checkBrandConsistency();

    this.printResults();
  }

  checkBrandName() {
    const variations = ['HoMI', 'Homi', 'homi', 'HOMI'];
    const correctBrand = 'HōMI';

    let found = false;
    variations.forEach(variant => {
      if (this.content.includes(variant) && variant !== correctBrand) {
        this.warnings.push(`Found "${variant}" - should be "${correctBrand}" with macron (ō)`);
        found = true;
      }
    });

    if (this.content.includes(correctBrand)) {
      this.passes.push(`✓ Correct brand name used: ${correctBrand}`);
    }
  }

  checkColors() {
    // Check for primary brand colors
    const colorPattern = /#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})\b/g;
    const colors = this.content.match(colorPattern) || [];

    const brandColors = [
      ...BRAND_GUIDELINES.colors.primary.indigo,
      ...BRAND_GUIDELINES.colors.primary.purple,
      ...BRAND_GUIDELINES.colors.primary.pink,
    ];

    const usedBrandColors = colors.filter(color =>
      brandColors.some(brandColor => brandColor.toLowerCase() === color.toLowerCase())
    );

    if (usedBrandColors.length > 0) {
      this.passes.push(`✓ Using ${usedBrandColors.length} brand colors`);
    }

    // Check for off-brand colors
    const offBrandColors = colors.filter(color =>
      !brandColors.some(brandColor => brandColor.toLowerCase() === color.toLowerCase()) &&
      !BRAND_GUIDELINES.colors.neutral.slate.includes(color.toLowerCase()) &&
      !BRAND_GUIDELINES.colors.neutral.gray.includes(color.toLowerCase())
    );

    if (offBrandColors.length > 3) {
      this.warnings.push(`⚠️  Found ${offBrandColors.length} non-brand colors - review for consistency`);
    }
  }

  checkTypography() {
    // Check for font usage
    const fontPattern = /font-family\s*:\s*([^;]+)/gi;
    const fonts = this.content.match(fontPattern) || [];

    if (fonts.length > 0) {
      this.passes.push(`✓ Typography defined in ${fonts.length} places`);
    }

    // Check for heading hierarchy
    const headings = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
    const foundHeadings = headings.filter(h => this.content.includes(`<${h}>`));

    if (foundHeadings.length > 0) {
      this.passes.push(`✓ Heading hierarchy used: ${foundHeadings.join(', ')}`);
    }
  }

  checkSpacing() {
    // Check for consistent spacing patterns
    const spacingClasses = [
      'p-', 'm-', 'px-', 'py-', 'mx-', 'my-',
      'gap-', 'space-x-', 'space-y-'
    ];

    let spacingCount = 0;
    spacingClasses.forEach(prefix => {
      const pattern = new RegExp(prefix + '\\d+', 'g');
      const matches = this.content.match(pattern) || [];
      spacingCount += matches.length;
    });

    if (spacingCount > 0) {
      this.passes.push(`✓ Consistent spacing: ${spacingCount} spacing utilities found`);
    }
  }

  checkAccessibility() {
    // Check for alt text on images
    const imgPattern = /<img[^>]*>/gi;
    const images = this.content.match(imgPattern) || [];
    const imagesWithoutAlt = images.filter(img => !img.includes('alt='));

    if (imagesWithoutAlt.length > 0) {
      this.errors.push(`❌ ${imagesWithoutAlt.length} images missing alt text`);
    } else if (images.length > 0) {
      this.passes.push(`✓ All ${images.length} images have alt text`);
    }

    // Check for semantic HTML
    const semanticTags = ['header', 'nav', 'main', 'section', 'article', 'aside', 'footer'];
    const foundSemantic = semanticTags.filter(tag => this.content.includes(`<${tag}`));

    if (foundSemantic.length >= 3) {
      this.passes.push(`✓ Semantic HTML used: ${foundSemantic.join(', ')}`);
    } else if (foundSemantic.length > 0) {
      this.warnings.push(`⚠️  Limited semantic HTML - found only: ${foundSemantic.join(', ')}`);
    }

    // Check for ARIA labels
    if (this.content.includes('aria-label') || this.content.includes('aria-labelledby')) {
      this.passes.push(`✓ ARIA labels present for accessibility`);
    }
  }

  checkBrandConsistency() {
    // Check for brand taglines
    const taglines = BRAND_GUIDELINES.brandElements.taglines;
    const foundTaglines = taglines.filter(tagline => this.content.includes(tagline));

    if (foundTaglines.length > 0) {
      this.passes.push(`✓ Brand tagline found: "${foundTaglines[0]}"`);
    }

    // Check for gradient usage (brand signature)
    if (this.content.includes('gradient')) {
      this.passes.push(`✓ Gradient styling used (brand signature)`);
    }
  }

  printResults() {
    console.log('═══════════════════════════════════════════════════\n');

    // Print passes
    if (this.passes.length > 0) {
      console.log('✅ PASSES:\n');
      this.passes.forEach(pass => console.log(`  ${pass}`));
      console.log('');
    }

    // Print warnings
    if (this.warnings.length > 0) {
      console.log('⚠️  WARNINGS:\n');
      this.warnings.forEach(warning => console.log(`  ${warning}`));
      console.log('');
    }

    // Print errors
    if (this.errors.length > 0) {
      console.log('❌ ERRORS:\n');
      this.errors.forEach(error => console.log(`  ${error}`));
      console.log('');
    }

    // Summary
    console.log('═══════════════════════════════════════════════════\n');
    console.log(`📊 Summary:`);
    console.log(`   Passes:   ${this.passes.length}`);
    console.log(`   Warnings: ${this.warnings.length}`);
    console.log(`   Errors:   ${this.errors.length}`);
    console.log('');

    if (this.errors.length === 0 && this.warnings.length === 0) {
      console.log('🎉 Perfect! Brand identity is consistent!\n');
      process.exit(0);
    } else if (this.errors.length === 0) {
      console.log('✅ Good! Minor warnings to address.\n');
      process.exit(0);
    } else {
      console.log('⚠️  Issues found. Please review and fix.\n');
      process.exit(1);
    }
  }
}

// CLI Usage
const args = process.argv.slice(2);
if (args.length === 0) {
  console.log('Usage: node homi-validator.js <file-path>');
  console.log('Example: node homi-validator.js homi-press-kit.html');
  process.exit(1);
}

const validator = new BrandValidator(args[0]);
validator.validate();
