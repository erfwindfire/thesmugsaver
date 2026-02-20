import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: "#385F5E", // Dark Teal
                    light: "#4A7A79",
                },
                secondary: {
                    DEFAULT: "#CD9B9B", // Rose / Muted Pink
                    hover: "#B88A8A",
                },
                accent: {
                    DEFAULT: "#FF9A62", // Vibrant Orange
                },
                neutral: {
                    light: "#F5F5F5",
                    dark: "#1A1A1A",
                }
            },
            fontFamily: {
                serif: ["var(--font-merriweather)", "serif"],
                sans: ["var(--font-inter)", "sans-serif"],
            },
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic":
                    "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
            },
        },
    },
    plugins: [],
};
export default config;
