module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      animation: {
        'spin-slow': 'spin 240s linear infinite',
        'twinkle': 'twinkle 5s ease-in-out infinite',
      },
      keyframes: {
        twinkle: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 },
        },
      },
      colors: {
        'plast-red': '#CA4E4E',
        'plast-main': '#F9F3EC',
        'plast-background': '#FDFBF9',
        'plast-dark-background': '#B88F88',
      },
      fontFamily: {
        'sans': ['Pretendard', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
