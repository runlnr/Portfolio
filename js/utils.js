/**
 * UI & Styling Utilities
 * - cn(...inputs): Class merging utility (clsx + tailwind-merge equivalent)
 * - cva(base, config): Class Variance Authority helper for UI variants
 * - initIcons(): Initializes Lucide icons on the page
 */

export function cn(...inputs) {
  const classes = [];
  
  for (const input of inputs) {
    if (!input) continue;
    if (typeof input === 'string') {
      classes.push(input);
    } else if (Array.isArray(input)) {
      classes.push(cn(...input));
    } else if (typeof input === 'object') {
      for (const [key, value] of Object.entries(input)) {
        if (value) classes.push(key);
      }
    }
  }
  
  // Clean duplicates and extra spaces
  return Array.from(new Set(classes.join(' ').trim().split(/\s+/))).join(' ');
}

export function cva(base = '', config = {}) {
  return function(props = {}) {
    const { variants = {}, defaultVariants = {} } = config;
    const resolvedProps = { ...defaultVariants, ...props };
    const classes = [base];

    for (const [variantName, variantOptions] of Object.entries(variants)) {
      const selectedValue = resolvedProps[variantName];
      if (selectedValue && variantOptions[selectedValue]) {
        classes.push(variantOptions[selectedValue]);
      }
    }

    if (props.className) {
      classes.push(props.className);
    }

    return cn(...classes);
  };
}

export function initIcons() {
  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }
}

// Global exposure for non-module script access
window.cn = cn;
window.cva = cva;
window.initIcons = initIcons;
