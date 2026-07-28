export const C = {
  bg: "#F4F7F6", surface: "#FFFFFF", surface2: "#EDF3F1",
  ink: "#0F2723", inkSoft: "#5B6F6A", inkFaint: "#93A29D",
  primary: "#0C4A43", primarySoft: "#E1EEEB",
  teal: "#187B6F", tealSoft: "#DCF0EB",
  urgent: "#B23A2E", urgentSoft: "#FBEAE7",
  amber: "#B5741F", amberSoft: "#FBF0DF",
  green: "#2E7D51", greenSoft: "#E4F3E9",
  border: "#DEE7E3", borderSoft: "#EAF0EE",
};

export const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500;600&display=swap');
`;

export function matches(query: string, ...fields: Array<string | number | undefined>): boolean {
  return !query || fields.some((f) => (f ?? "").toString().toLowerCase().includes(query.toLowerCase()));
}
