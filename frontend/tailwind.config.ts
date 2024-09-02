import type { Config } from "tailwindcss";
import  { nextui } from "@nextui-org/react";
const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        "theme-dark": "#1E1414",
        "theme-off-white-light": "#F4F2EF",
        "theme-off-white": "#EBE8E0",
        "theme-off-white-dark": "#EFDFD0",
        "theme-green": "#C0DFAF",
        "theme-green-light": "#D2E9C9",
        "theme-green-dark": "#6E9854",
        "theme-purple": "#DFCAE9",
        "theme-purple-light": "#E5DAEA",
        "theme-purple-dark": "#997CA5",
        "theme-gray": "#CCD2D8",
        "theme-gray-light": "#DCE5EB",
        "theme-gray-dark": "#94A0AB",
      },
    },
  },
  darkMode: "class",
  plugins: [nextui()],
};
export default config;

// t