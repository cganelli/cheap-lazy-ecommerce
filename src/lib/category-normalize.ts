export type CanonCategory =
  | "Beauty"
  | "Electronics"
  | "Hair Care"
  | "Health"
  | "Household"
  | "Kitchen"
  | "Pet Care";

const MAP: Array<[CanonCategory, RegExp[]]> = [
  ["Beauty", [
    /beauty/i,
    /personal\s*care/i,
    /skin|serum|mask|make[-\s]?up|mascara|lip|retinol/i,
  ]],
  ["Hair Care", [
    /hair\s*care/i,
    /\bhair(?!\s*dryer\b)/i, // hair… but avoid random false positives
    /shampoo|conditioner|hair\s(oil|mask|spray)|heat\sprotect/i,
  ]],
  ["Electronics", [
    /electronic/i,
    /headphone|earbud|bluetooth|hdmi|usb|charger|adapter|speaker|monitor/i,
  ]],
  ["Health", [
    /health/i,
    /vitamin|supplement|bandage|first\s*aid|pain\s(relief|killer)/i,
    /wellness/i,
  ]],
  ["Household", [
    /household|home|clean(ing)?|laundry|trash|bin|organizer|storage|hook|sponge|bag/i,
  ]],
  ["Kitchen", [
    /kitchen|cookware|pan|pot|knife|cutting\s*board|spatula|baking|sheet|grater|whisk/i,
  ]],
  ["Pet Care", [
    /pet|dog|cat|litter|treat|leash|groom|chew/i,
  ]],
];

function normalize(rawCategory?: string, title?: string): CanonCategory {
  const c = (rawCategory || "").toLowerCase().trim();
  const t = (title || "").toLowerCase();

  // 1) try mapping by provided category text
  for (const [canon, pats] of MAP) {
    if (c && pats.some((re) => re.test(c))) return canon;
  }
  // 2) fallback: detect from title keywords
  for (const [canon, pats] of MAP) {
    if (pats.some((re) => re.test(t))) return canon;
  }
  // 3) final fallback when nothing matches
  return "Household";
}

export function normalizeCategory(rawCategory?: string, title?: string): CanonCategory {
  return normalize(rawCategory, title);
}
