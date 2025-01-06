# HTML Validation Guide for BookMySpot

This document outlines the HTML validation process for the BookMySpot application, including common issues and their solutions.

## Validation Process

1. **Automated Testing**
   - We use Jest and Testing Library for component rendering
   - HTML5 Validator checks rendered output against W3C standards
   - JSDOM provides a DOM environment for testing

2. **What We Validate**
   - HTML structure and semantics
   - ARIA attributes and accessibility
   - Form elements and labels
   - Heading hierarchy
   - List structures
   - Button attributes
   - Error state handling

## Common HTML Issues and Solutions

### 1. Missing Document Structure
```html
<!-- ❌ Incorrect -->
<div>
  <h1>My Bookings</h1>
  <div>Content</div>
</div>

<!-- ✅ Correct -->
<main>
  <header>
    <h1>My Bookings</h1>
  </header>
  <div>Content</div>
</main>
```

### 2. Improper Heading Hierarchy
```html
<!-- ❌ Incorrect -->
<h1>My Bookings</h1>
<h3>Booking Details</h3>
<h2>Location</h2>

<!-- ✅ Correct -->
<h1>My Bookings</h1>
<h2>Booking Details</h2>
<h2>Location</h2>
```

### 3. Invalid Form Structure
```html
<!-- ❌ Incorrect -->
<form>
  <input placeholder="Enter location">
  <button>Submit</button>
</form>

<!-- ✅ Correct -->
<form>
  <label for="location">Location</label>
  <input id="location" type="text" aria-label="Enter location">
  <button type="submit">Submit</button>
</form>
```

### 4. Missing List Structure
```html
<!-- ❌ Incorrect -->
<div class="booking-list">
  <div>Booking 1</div>
  <div>Booking 2</div>
</div>

<!-- ✅ Correct -->
<ul class="booking-list">
  <li>Booking 1</li>
  <li>Booking 2</li>
</ul>
```

## Running Validation Tests

```bash
# Run all HTML validation tests
npm test src/__tests__/html/validation.test.tsx

# Run specific test
npm test -- -t "should have valid HTML in Bookings page"
```

## Validation Results

Here are some example validation results from our tests:

### Before Fixes
```
Error: Element "div" not allowed as child of element "ul" in this context
Error: The "button" element must have a "type" attribute
Warning: Consider using the "h1" element as a top-level heading
```

### After Fixes
```
✓ All pages pass HTML validation
✓ Proper document structure maintained
✓ Correct heading hierarchy implemented
✓ Forms properly structured with labels
✓ Lists correctly implemented
```

## Best Practices

1. **Always use semantic HTML elements**
   - `<header>`, `<main>`, `<nav>`, `<footer>`
   - `<article>`, `<section>`, `<aside>`
   - `<h1>` through `<h6>` for proper heading hierarchy

2. **Ensure proper form structure**
   - Label all form controls
   - Use appropriate input types
   - Include proper button types

3. **Maintain list structure**
   - Use `<ul>` or `<ol>` for lists
   - Only use `<li>` as direct children

4. **Include proper ARIA attributes**
   - Add `aria-label` where needed
   - Use `role` attributes appropriately
   - Ensure proper focus management

5. **Handle error states gracefully**
   - Maintain valid HTML in error states
   - Use appropriate error messaging
   - Keep consistent document structure

## Continuous Integration

Our validation tests are part of the CI pipeline and run on:
- Every pull request
- Main branch merges
- Production deployments

## Resources

- [W3C HTML Validator](https://validator.w3.org/)
- [HTML5 Specification](https://html.spec.whatwg.org/)
- [WAI-ARIA Practices](https://www.w3.org/WAI/ARIA/apg/)
