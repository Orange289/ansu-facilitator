export const productSlugs = [
  "breathwork-library",
  "alive-breathwork-group",
  "free-breathwork-balance",
  "free-somatic-inner-support",
  "individual-breathwork-session",
  "individual-somatic-session"
] as const;

export type ProductSlug = (typeof productSlugs)[number];
