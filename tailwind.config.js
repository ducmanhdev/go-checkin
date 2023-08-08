/** @type {import('tailwindcss').Config} */
module.exports = {
  corePlugins: {
    preflight: true,
  },
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '375px',
      },
      colors: {
        primary: 'var(--color-primary)',
        'primary-lighter': 'var(--color-primary-lighter)',
        secondary: 'var(--color-secondary)',
        black: 'var(--color-3A)',
        C82: 'var(--color-C82)',
        C90: 'var(--color-C90)',
        C84: 'var(--color-C84)',
        CED: 'var(--color-CED)',
        C99: 'var(--color-C99)',
        CF5: 'var(--color-CF5)',
        CA4: 'var(--color-CA4)',
        C12: 'var(--color-C12)',
        error: 'var(--color-error)',
        success: 'var(--color-success)',
        CEA: 'var(--color-CEA)',
        C91: 'var(--color-C91)',
        C92: 'var(--color-C92)',
        CF2: 'var(--color-CF2)',
        CEB: 'var(--color-CEB)',
        C55: 'var(--color-C55)',
        CEE: 'var(--color-CEE)',
        C27: 'var(--color-C27)',
        CD3: 'var(--color-CD3)',
        C9: 'var(--color-C9)',
        CD9: 'var(--color-CD9)',
        C128: 'var(--color-C128)',
        CF6: 'var(--color-F6)',
        C62: 'var(--color-C62)',
      },
      borderColor: {
        DEFAULT: 'var(--color-CED)',
      },
      boxShadow: {
        DEFAULT: 'var(--base-box-shadow)',
        sm: 'var(--base-box-shadow-sm)',
        md: 'var(--base-box-shadow-md)',
      },
      borderRadius: {
        base: 'var(--base-radius)',
      }
    },
  },
  plugins: [
    function ({addVariant}) {
      addVariant('child', '& > *');
      addVariant('child-hover', '& > *:hover');
      addVariant('self', '&');
    }
  ],
}
