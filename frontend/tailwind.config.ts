import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "theme-gray-dark": "#1E1414",
        "theme-off-white-light": "#F9F7F6",
        "theme-off-white": "#EBE8E0",
        "theme-off-white-dark": "#EFDFD0",
        "theme-light-green": "#D2E8C8",
        "theme-light-purple": "#DAD1EE",
        "theme-light-blue": "#DCE5EB",
      },
    },
  },
  plugins: [],
};
export default config;
