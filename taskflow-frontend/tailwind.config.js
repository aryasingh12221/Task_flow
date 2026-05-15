/** @type {import('tailwindcss').Config} */
export default {
  darkMode: false,
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        jira: {
          bg: '#1D2125',
          surface: '#22272B',
          elevated: '#282E33',
          overlay: '#2C333A',
          border: '#2C333A',
          'border-bold': '#738496',
          text: '#B6C2CF',
          'text-subtle': '#8C9BAB',
          'text-disabled': '#626F86',
          blue: '#0C66E4',
          'blue-hover': '#0055CC',
          'blue-bold': '#579DFF',
          'blue-bg': '#1C2B41',
          green: '#1F845A',
          'green-bold': '#4BCE97',
          'green-bg': '#1C3329',
          yellow: '#F1A10D',
          'yellow-bold': '#F8E6A0',
          'yellow-bg': '#332500',
          red: '#CA3521',
          'red-bold': '#F87168',
          'red-bg': '#3D1A1A',
          purple: '#6E5DC6',
          'purple-bold': '#9F8FEF',
          'purple-bg': '#2B2358',
          sidebar: '#1D2125',
          'sidebar-icon': 'rgba(255,255,255,0.08)'
        }
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'sans-serif']
      },
      borderRadius: {
        sm: '3px',
        DEFAULT: '4px',
        md: '4px',
        lg: '8px'
      },
      boxShadow: {
        panel: 'none'
      }
    }
  },
  plugins: []
}
