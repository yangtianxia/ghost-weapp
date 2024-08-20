export function getCSSVar(input: string, alpha = 1) {
  return `rgba(var(--color-${input}-base), ${alpha})`
}
