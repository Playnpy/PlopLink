export type UnitCategory = "length" | "weight" | "temperature";

export const UNIT_OPTIONS: Record<UnitCategory, string[]> = {
  length: ["mm", "cm", "m", "km", "in", "ft", "yd", "mi"],
  weight: ["mg", "g", "kg", "t", "oz", "lb"],
  temperature: ["°C", "°F", "K"],
};

// Length & weight: factor to convert 1 unit into the base unit (meters / grams).
const LENGTH_TO_METERS: Record<string, number> = {
  mm: 0.001,
  cm: 0.01,
  m: 1,
  km: 1000,
  in: 0.0254,
  ft: 0.3048,
  yd: 0.9144,
  mi: 1609.344,
};

const WEIGHT_TO_GRAMS: Record<string, number> = {
  mg: 0.001,
  g: 1,
  kg: 1000,
  t: 1_000_000,
  oz: 28.3495,
  lb: 453.592,
};

function convertTemperature(value: number, from: string, to: string): number {
  let celsius: number;
  if (from === "°C") celsius = value;
  else if (from === "°F") celsius = ((value - 32) * 5) / 9;
  else celsius = value - 273.15; // K

  if (to === "°C") return celsius;
  if (to === "°F") return (celsius * 9) / 5 + 32;
  return celsius + 273.15; // K
}

export function convertUnit(value: number, from: string, to: string, category: UnitCategory): number | null {
  if (Number.isNaN(value)) return null;

  if (category === "temperature") {
    return convertTemperature(value, from, to);
  }

  const table = category === "length" ? LENGTH_TO_METERS : WEIGHT_TO_GRAMS;
  if (!(from in table) || !(to in table)) return null;

  const base = value * table[from];
  return base / table[to];
}
