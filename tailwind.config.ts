import { Urbanist } from "next/font/google";
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      screens: {
        '1670': '1670px',
        // => @media (min-width: 1670px) { ... }
        '1023': '1023px',
        // => @media (min-width: 1023px) { ... }
        '1150': '1150px',
        // => @media (min-width: 1150px) { ... }
      },

      fontFamily: {
        Urbanist: ['Urbanist'],
      }
    },
  },
  plugins: [],
};
export default config;
