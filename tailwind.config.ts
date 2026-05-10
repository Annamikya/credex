import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        surface: '#0f172a',
        panel: '#111827',
        border: '#1f2937',
        muted: '#64748b'
      },
      boxShadow: {
        soft: '0 20px 90px rgba(15, 23, 42, 0.15)'
      }
    }
  },
  plugins: []
};

export default config;
