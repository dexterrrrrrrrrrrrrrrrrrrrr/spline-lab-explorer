/**
 * Gets the computed HSL color value from a CSS variable
 * @param varName - CSS variable name (e.g., '--primary')
 * @returns HSL color string (e.g., 'hsl(240, 65%, 45%)')
 */
export function getCSSColor(varName: string): string {
  const root = document.documentElement;
  const hslValue = getComputedStyle(root).getPropertyValue(varName).trim();
  
  if (!hslValue) {
    console.warn(`CSS variable ${varName} not found`);
    return 'hsl(240, 65%, 45%)'; // fallback color
  }
  
  return `hsl(${hslValue})`;
}

/**
 * Gets multiple CSS colors at once
 */
export function getCSSColors(...varNames: string[]): string[] {
  return varNames.map(getCSSColor);
}
