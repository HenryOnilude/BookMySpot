# CSS Validation Guide for BookMySpot

This document outlines the CSS validation process for the BookMySpot application, including common issues and their solutions.

## Validation Process

1. **Automated Testing**
   - Stylelint for CSS syntax validation
   - PostCSS for processing Tailwind classes
   - Custom tests for responsive design and accessibility

2. **What We Validate**
   - CSS syntax and best practices
   - Tailwind class usage
   - Responsive design implementation
   - Color contrast and accessibility
   - Dark mode support
   - Common CSS mistakes

## Common CSS Issues and Solutions

### 1. Invalid Tailwind Classes
```css
/* ❌ Incorrect */
.invalid-spacing {
  @apply p-3.5.5;  /* Invalid spacing value */
}

/* ✅ Correct */
.valid-spacing {
  @apply p-3.5;  /* Valid spacing value */
}
```

### 2. Improper Responsive Design
```jsx
/* ❌ Incorrect */
<div className="w-full md:w-1/2 sm:w-1/3">  /* Wrong order */
  Content
</div>

/* ✅ Correct */
<div className="w-full sm:w-1/3 md:w-1/2">  /* Correct order */
  Content
</div>
```

### 3. Poor Color Contrast
```jsx
/* ❌ Incorrect */
<div className="bg-gray-100">
  <p className="text-gray-300">Low contrast text</p>
</div>

/* ✅ Correct */
<div className="bg-gray-100">
  <p className="text-gray-700">Good contrast text</p>
</div>
```

### 4. Missing Dark Mode Support
```jsx
/* ❌ Incorrect */
<div className="bg-white text-black">
  Content
</div>

/* ✅ Correct */
<div className="bg-white dark:bg-gray-800 text-black dark:text-white">
  Content
</div>
```

## Running Validation Tests

```bash
# Run all CSS validation tests
npm test src/__tests__/css/validation.test.ts

# Run specific test
npm test -- -t "should have valid CSS syntax"
```

## Best Practices

1. **Use Tailwind's Utility Classes**
   - Prefer utility classes over custom CSS
   - Follow mobile-first responsive design
   - Use consistent spacing and sizing scales

2. **Maintain Color Contrast**
   - Use Tailwind's color palette
   - Ensure WCAG 2.1 compliance
   - Test with color contrast tools

3. **Support Dark Mode**
   - Add dark mode variants
   - Test in both light and dark modes
   - Use semantic color names

4. **Avoid Common Mistakes**
   - No inline styles
   - No !important declarations
   - No conflicting media queries

5. **Follow Responsive Design**
   - Use breakpoint prefixes correctly
   - Test on multiple screen sizes
   - Maintain consistent layouts

## Continuous Integration

Our CSS validation tests are part of the CI pipeline and run on:
- Every pull request
- Main branch merges
- Production deployments

## Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Stylelint Documentation](https://stylelint.io/)
- [WCAG Color Contrast Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
- [PostCSS Documentation](https://postcss.org/)
