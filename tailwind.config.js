/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        display: ["-apple-system", "BlinkMacSystemFont", "SF Pro Display", "SF Pro Text", "Segoe UI", "Arial", "sans-serif"],
        sans: ["-apple-system", "BlinkMacSystemFont", "SF Pro Display", "SF Pro Text", "Segoe UI", "Arial", "sans-serif"]
      },
      colors: {
        bg: "#F8F7FF",
        primary: "#6C4DFF",
        secondary: "#3B82F6",
        bluex: "#3B82F6",
        text: "#151326",
        muted: "#7C7892",
        success: "#22C55E",
        warning: "#F59E0B",
        danger: "#EF476F",
        white: "#FFFFFF",
        line: "#DDD8F6",
        lavender: "#F0EDFF",
        primaryLight: "#EDE9FF",
        blueLight: "#EAF2FF",
        successLight: "#E8FAF0",
        warningLight: "#FFF6DB",
        dangerLight: "#FFE8EF"
      }
    }
  },
  plugins: []
};
