module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
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
