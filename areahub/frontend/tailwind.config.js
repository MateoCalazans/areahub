/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#022448', container: '#1E3A5F', fixed: '#d5e3ff', 'fixed-dim': '#adc8f5' },
        surface: { DEFAULT: '#f8f9fd', bright: '#f8f9fd', dim: '#d9dade', container: '#edeef2', 'container-high': '#e7e8ec', 'container-highest': '#e1e2e6', 'container-low': '#f2f3f7', 'container-lowest': '#ffffff' },
        'on-surface': { DEFAULT: '#191c1f', variant: '#43474e' },
        'on-primary': { DEFAULT: '#ffffff', container: '#8aa4cf' },
        outline: { DEFAULT: '#74777f', variant: '#c4c6cf' },
        secondary: { DEFAULT: '#555f70', container: '#d6e0f4' },
        'on-secondary': { DEFAULT: '#ffffff', container: '#5a6374' },
        tertiary: { DEFAULT: '#341f00', container: '#503300' },
        error: { DEFAULT: '#ba1a1a', container: '#ffdad6' },
        'on-error': { DEFAULT: '#ffffff', container: '#93000a' },
        success: { DEFAULT: '#16a34a', light: '#dcfce7' },
        warning: { DEFAULT: '#ca8a04', light: '#fef9c3' },
      },
      fontFamily: {
        headline: ['Manrope', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        xl: '0.75rem',
      },
      boxShadow: {
        ambient: '0 8px 40px rgba(25,28,31,0.04)',
        'ambient-lg': '0 12px 48px rgba(25,28,31,0.08)',
      },
    },
  },
  plugins: [],
}
