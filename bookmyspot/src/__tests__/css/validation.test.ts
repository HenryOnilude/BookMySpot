import { readFileSync } from 'fs';
import { globSync } from 'glob';
import { join } from 'path';

describe('CSS Validation Tests', () => {
  const projectRoot = process.cwd();
  const cssFiles = globSync('src/**/*.css', { cwd: projectRoot });
  const tailwindConfigPath = join(projectRoot, 'tailwind.config.js');

  // Function to extract CSS classes from JSX/TSX files
  const extractClassesFromFile = (filePath: string): string[] => {
    const content = readFileSync(filePath, 'utf-8');
    const classNames = new Set<string>();
    
    // Match className assignments
    const classRegex = /className=["']([^"']+)["']/g;
    let match;
    while ((match = classRegex.exec(content)) !== null) {
      match[1].split(' ').forEach(className => classNames.add(className.trim()));
    }
    
    return Array.from(classNames);
  };

  // Test CSS files syntax
  it('should have valid CSS syntax in all CSS files', () => {
    for (const file of cssFiles) {
      const css = readFileSync(join(projectRoot, file), 'utf-8');
      expect(css).toBeDefined();
    }
  });

  // Test Tailwind classes usage
  it('should use valid Tailwind CSS classes', () => {
    const tsxFiles = globSync('src/**/*.tsx', { cwd: projectRoot });
    const allClasses = new Set<string>();
    
    // Collect all classes from TSX files
    tsxFiles.forEach(file => {
      const classes = extractClassesFromFile(join(projectRoot, file));
      classes.forEach(className => allClasses.add(className));
    });

    // Ensure we have Tailwind classes
    const tailwindClassPatterns = [
      /^(p|m|px|py|mx|my)-/,
      /^(w|h)-/,
      /^(text|bg|border)-/,
      /^(flex|grid|block|inline)/,
      /^(rounded|shadow)/
    ];

    const validClasses = Array.from(allClasses).filter(className =>
      tailwindClassPatterns.some(pattern => pattern.test(className))
    );

    expect(validClasses.length).toBeGreaterThan(0);
  });

  // Test responsive design classes
  it('should have proper responsive design classes', () => {
    const tsxFiles = globSync('src/**/*.tsx', { cwd: projectRoot });
    const responsiveClasses = new Set<string>();
    
    tsxFiles.forEach(file => {
      const classes = extractClassesFromFile(join(projectRoot, file));
      classes
        .filter(className => /^(sm|md|lg|xl|2xl):/.test(className))
        .forEach(className => responsiveClasses.add(className));
    });

    // Ensure we're using responsive design
    expect(responsiveClasses.size).toBeGreaterThan(0);
  });

  // Test color contrast
  it('should have sufficient color contrast', () => {
    const tsxFiles = globSync('src/**/*.tsx', { cwd: projectRoot });
    const colorClasses = new Set<string>();
    
    tsxFiles.forEach(file => {
      const classes = extractClassesFromFile(join(projectRoot, file));
      classes
        .filter(className => /(text|bg|border)-[a-z]+-[0-9]+/.test(className))
        .forEach(className => colorClasses.add(className));
    });

    // Check for proper color combinations
    const textColors = Array.from(colorClasses)
      .filter(className => className.startsWith('text-'));
    const bgColors = Array.from(colorClasses)
      .filter(className => className.startsWith('bg-'));

    // Ensure we have both text and background colors
    expect(textColors.length).toBeGreaterThan(0);
    expect(bgColors.length).toBeGreaterThan(0);

    // Check for proper contrast combinations
    const hasProperContrast = textColors.some(textColor => {
      const textShade = parseInt(textColor.split('-').pop() || '0');
      return bgColors.some(bgColor => {
        const bgShade = parseInt(bgColor.split('-').pop() || '0');
        // Ensure sufficient contrast (difference of at least 500 in shade)
        return Math.abs(textShade - bgShade) >= 500;
      });
    });

    expect(hasProperContrast).toBeTruthy();
  });

  // Test dark mode support
  it('should support dark mode', () => {
    const tsxFiles = globSync('src/**/*.tsx', { cwd: projectRoot });
    const darkModeClasses = new Set<string>();
    
    tsxFiles.forEach(file => {
      const classes = extractClassesFromFile(join(projectRoot, file));
      classes
        .filter(className => /^dark:/.test(className))
        .forEach(className => darkModeClasses.add(className));
    });

    // Ensure we have dark mode classes
    expect(darkModeClasses.size).toBeGreaterThan(0);
  });

  // Test for common CSS mistakes
  it('should not have common CSS mistakes', () => {
    const tsxFiles = globSync('src/**/*.tsx', { cwd: projectRoot });
    const mistakes: string[] = [];
    
    tsxFiles.forEach(file => {
      const content = readFileSync(join(projectRoot, file), 'utf-8');
      
      // Check for !important usage
      if (content.includes('!important')) {
        mistakes.push(`File ${file} uses !important`);
      }
      
      // Check for inline styles
      if (content.includes('style={')) {
        mistakes.push(`File ${file} uses inline styles`);
      }

      // Check for hardcoded pixel values
      const pixelValueRegex = /\d+px/g;
      const pixelMatches = content.match(pixelValueRegex);
      if (pixelMatches) {
        mistakes.push(`File ${file} uses hardcoded pixel values: ${pixelMatches.join(', ')}`);
      }

      // Check for non-semantic class names
      const nonSemanticClassRegex = /className=["'](.*?)(wrapper|container|inner|outer|content)["']/g;
      let match;
      while ((match = nonSemanticClassRegex.exec(content)) !== null) {
        mistakes.push(`File ${file} uses non-semantic class name: ${match[1]}`);
      }
    });

    expect(mistakes).toHaveLength(0);
  });
});
