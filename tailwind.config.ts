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
        "grullo": "#B39D91"
      }
    },
  },
  plugins: [],
};
export default config;
