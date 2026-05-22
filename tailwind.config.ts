import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cc: {
          bg:     '#0a0a0a',
          gray:   '#1a1a1a',
          gray2:  '#222222',
          gray3:  '#2a2a2a',
          green:  '#00E87A',
          purple: '#7B2FFF',
          orange: '#FF5C1A',
          white:  '#F5F0E8',
          muted:  '#666666',
        },
      },
      fontFamily: {
        display: ['Bebas Neue', 'sans-serif'],
        mono:    ['Space Mono', 'monospace'],
        sans:    ['DM Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
