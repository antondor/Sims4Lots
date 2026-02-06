// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        "./resources/views/**/*.blade.php",
        "./resources/js/**/*.{ts,tsx}",
    ],
    theme: {
        extend: {},
    },
    plugins: [require("tailwindcss-animate")],
};
