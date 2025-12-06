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
                primary: "#A2D2FF",
                secondary: "#C8E6C9",
                "background-light": "#F8F9FA", // İşte aradığımız beyaz renk bu
                "background-dark": "#101922",
                "text-light": "#0d141b",
                "text-dark": "#f6f7f8",
                "text-muted-light": "#4c739a",
                "text-muted-dark": "#a0b4c8",
            },
            fontFamily: {
                display: ['var(--font-manrope)', "sans-serif"],
            },
            boxShadow: {
                'soft': '0 4px 14px 0 rgba(0, 0, 0, 0.05)',
            }
        },
    },
    darkMode: "class",
    plugins: [],
};
export default config;