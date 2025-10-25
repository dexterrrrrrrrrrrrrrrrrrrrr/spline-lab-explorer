/**
 * Utilities for converting CSS HSL variables into Canvas-friendly color strings
 */

/**
 * Returns a CSS HSL string from a variable, space-separated as defined in tokens.
 * Example output: 'hsl(240 65% 45%)'. Useful for CSS-in-JS, not for Canvas.
 */
export function getCSSColor(varName: string): string {
  const root = document.documentElement;
  const hslValue = getComputedStyle(root).getPropertyValue(varName).trim();

  if (!hslValue) {
    console.warn(`CSS variable ${varName} not found`);
    return "hsl(240 65% 45%)"; // fallback color
  }

  return `hsl(${hslValue})`;
}

/**
 * Returns a Canvas-friendly HSL/HSLA string with comma-separated components.
 * Example outputs:
 *  - getCanvasColor('--primary') => 'hsl(240, 65%, 45%)'
 *  - getCanvasColor('--primary', 0.5) => 'hsla(240, 65%, 45%, 0.5)'
 */
export function getCanvasColor(varName: string, alpha?: number): string {
  const root = document.documentElement;
  let hslValue = getComputedStyle(root).getPropertyValue(varName).trim();

  if (!hslValue) {
    // Fallback to a sensible brand color
    const fallback = [240, "65%", "45%"] as const;
    return alpha !== undefined
      ? `hsla(${fallback[0]}, ${fallback[1]}, ${fallback[2]}, ${alpha})`
      : `hsl(${fallback[0]}, ${fallback[1]}, ${fallback[2]})`;
  }

  // Expect values like: "240 65% 45%" or "240deg 65% 45%"
  // Strip potential unit on hue and split by whitespace
  const parts = hslValue
    .replace(/deg/g, "")
    .trim()
    .split(/\s+/);

  const [h, s, l] = [parts[0] ?? "240", parts[1] ?? "65%", parts[2] ?? "45%"];

  if (alpha !== undefined) {
    return `hsla(${h}, ${s}, ${l}, ${alpha})`;
  }

  return `hsl(${h}, ${s}, ${l})`;
}

export function getCSSColors(...varNames: string[]): string[] {
  return varNames.map(getCSSColor);
}

