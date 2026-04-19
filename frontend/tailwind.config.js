/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Manrope', 'ui-sans-serif', 'system-ui', '-apple-system', 'Helvetica', 'Arial', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'Menlo', 'Monaco', 'monospace'],
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: { DEFAULT: 'hsl(var(--card))', foreground: 'hsl(var(--card-foreground))' },
        popover: { DEFAULT: 'hsl(var(--popover))', foreground: 'hsl(var(--popover-foreground))' },
        primary: { DEFAULT: 'hsl(var(--primary))', foreground: 'hsl(var(--primary-foreground))' },
        secondary: { DEFAULT: 'hsl(var(--secondary))', foreground: 'hsl(var(--secondary-foreground))' },
        muted: { DEFAULT: 'hsl(var(--muted))', foreground: 'hsl(var(--muted-foreground))' },
        accent: { DEFAULT: 'hsl(var(--accent))', foreground: 'hsl(var(--accent-foreground))' },
        destructive: { DEFAULT: 'hsl(var(--destructive))', foreground: 'hsl(var(--destructive-foreground))' },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        icen: {
          // Light institutional palette
          paper: '#FFFFFF',
          ivory: '#F7F5EF',       // warm off-white
          mist:  '#F1EEE6',       // subtle band
          line:  '#E6E1D5',       // hairline
          ink:   '#0A1628',       // deep navy — primary text
          inkSoft: '#334155',     // secondary text
          muted: '#6B7280',       // tertiary
          // Accents
          navy: '#0A1628',
          blue: '#0057FF',
          blueSoft: '#3B82F6',
          green: '#008F4C',       // slightly darker green for contrast on white
          greenSoft: '#00A859',
          // Dark sections (for cinematic contrast)
          deep: '#0A1628',
          deepSurface: '#0F1A2E',
          deepElevated: '#162238',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      boxShadow: {
        soft: '0 1px 2px rgba(10,22,40,0.04), 0 8px 24px rgba(10,22,40,0.06)',
        card: '0 1px 0 rgba(10,22,40,0.04), 0 12px 40px rgba(10,22,40,0.08)',
        glow: '0 0 24px rgba(0, 87, 255, 0.25)',
        glowStrong: '0 0 48px rgba(0, 87, 255, 0.35)',
      },
      keyframes: {
        'accordion-down': { from: { height: '0' }, to: { height: 'var(--radix-accordion-content-height)' } },
        'accordion-up': { from: { height: 'var(--radix-accordion-content-height)' }, to: { height: '0' } },
        'fade-up': { '0%': { opacity: '0', transform: 'translateY(24px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        'slow-spin': { from: { transform: 'rotate(0deg)' }, to: { transform: 'rotate(360deg)' } },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-up': 'fade-up 0.8s ease-out both',
        'slow-spin': 'slow-spin 120s linear infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
