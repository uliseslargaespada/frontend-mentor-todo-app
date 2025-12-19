/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // You can add custom colors here
        // Example:
        // primary: 'var(--primary)',
        // secondary: 'var(--secondary)',
        // Override the white name
        white: '#000',
      },
      borderRadius: {
        // Custom border radius values
        // Example:
        // lg: 'var(--radius)',
      },
      fontFamily: {
        // Custom font families
        // Example:
        // sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      spacing: {
        // Custom spacing values
        // Example:
        // '128': '32rem',
      },
    },
  },
  plugins: [],
};
