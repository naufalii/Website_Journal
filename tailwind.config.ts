import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './context/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#4F46E5',    // Indigo Utama
          deep: '#4338CA',       // Indigo Gelap
          vibrant: '#6366F1',    // Aksen Glow / Dark Highlight
          cyan: '#06B6D4',       // Dot Status / Cyan Accent
        },
        app: {
          light: '#F3F4FA',      // Background Layar Light Mode
          dark: '#0B0E1B',       // Background Layar Dark Mode
        },
        surface: {
          light: '#FFFFFF',      // Card Light
          lightPill: '#ECEBFD',  // Task/Schedule Pill Light
          dark: '#161B2E',       // Card Dark
          darkPill: '#202640',   // Task/Schedule Pill Dark
        },
        content: {
          primaryLight: '#1E1B4B',
          mutedLight: '#7C7E96',
          primaryDark: '#F8FAFC',
          mutedDark: '#94A3B8',
        },
      },
      borderRadius: {
        '2xl': '1.25rem',
        '3xl': '1.75rem',
        '4xl': '2.25rem',
      },
      boxShadow: {
        soft: '0 4px 20px -2px rgba(79, 70, 229, 0.08)',
        glow: '0 0 25px -5px rgba(99, 102, 241, 0.35)',
      },
    },
  },
  plugins: [],
};

export default config;
