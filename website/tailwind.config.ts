import forms from "@tailwindcss/forms";
import typography from "@tailwindcss/typography";
import type { Config } from "tailwindcss";

export default {
    darkMode: "class",
    content: ["./src/**/*.{html,js,svelte,ts}"],
    theme: {
        extend: {
            colors: {
                foreground: "#323232",
                pale: "#e8e8e8",
                dark: "#212121",
                muted: "#d3d3d3",
                shadow: "#d3d3d3",
            },
            boxShadow: ({ theme }) => ({
                square: `4px 4px ${theme("colors").foreground}`,
            }),
        },
    },
    plugins: [forms, typography],
} satisfies Config;
