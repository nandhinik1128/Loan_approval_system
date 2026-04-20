export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#08111f',
        panel: '#101b30',
        panelSoft: '#16233d',
        gold: '#d6a74c',
        mint: '#7fd1b9',
        danger: '#ef6f6c',
        warning: '#f4b942'
      },
      fontFamily: {
        sans: ['"Space Grotesk"', 'sans-serif'],
        serif: ['"Source Serif 4"', 'serif']
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(214,167,76,0.24), 0 20px 60px rgba(0,0,0,0.35)'
      }
    }
  },
  plugins: []
};
