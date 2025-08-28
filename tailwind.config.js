/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./**/*.{html,js,ts,jsx,tsx,mdx}",
        "./popup/**/ *.{ html, ts, tsx }"
    ],
    theme: {
        extend: {},
    },
    plugins: [require("shadcn-ui/tailwind")],
}
