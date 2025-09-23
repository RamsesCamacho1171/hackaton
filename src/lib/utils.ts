export function parseToDecimalRight(value: string): string {

  const raw = value.replace(".", "")

  const padded = raw.padStart(3, "0")

  const intPart = padded.slice(0, -2) || "0"
  const decimalPart = padded.slice(-2)

  return `${intPart}.${decimalPart}`
}
