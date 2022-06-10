module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],

  theme: {
    screens: {
      //need to update while developing
      xs: { max: '575px' }, // Mobile (iPhone 3 - iPhone XS Max).
      sm: { min: '576px', max: '767px' }, // Mobile (matches max: iPhone 11 Pro .
      md: { min: '768px', max: '1199px' }, // Tablet (matches max: iPad Pro @ 1112px).
      lg: { min: '1200px', max: '1359px' }, // Desktop smallest.
      xl: { min: '1440px' },
    },
    fontFamily: {
      sans: ['Poppins', 'sans-serif'],
    },
    colors: {
      primary: {
        500: '#9D5CFF',
      },
      secondary: {
        500: '#32C2AD',
      },
      info: {
        500: '#396CDB',
      },
      success: {
        500: '#78F33F',
      },
      error: {
        500: '#F43552',
      },
      warning: {
        500: '#F97316',
      },
      muted: {
        500: '#1C112E',
      },
      text: {
        500: '#706B75',
      },
    },
    fontSize: {
      f32: ['32px', '40px'],
      f24: ['24px', '38px'],
      f20: ['20px', '32px'],
      f18: ['18px', '26px'],
      f16: ['16px', '24px'],
      f12: ['12px', '18px'],
      f14: ['14px', '20px'],
      f10: ['10px', '16px'],
    },
  },
  plugins: [],
};
