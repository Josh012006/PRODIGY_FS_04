import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundColor: {
        "ocean-call": "#2D6D90",
        "crystal": "#A3D0DA",
        "isabelline": "#F2ECEA",
        "bone": "#E2D8CD",
        "grullo": "#B39D91",
        "pastel-blue": "#B7CAD1",
        "alice-blue": "#E4EEF3",
        "soft-mint": "#E2F8F0",
        "charcoal": "#2A3A45",
        "aqua-splash": "#8ACED2",
      }
    },
  },
  plugins: [],
};
export default config;
