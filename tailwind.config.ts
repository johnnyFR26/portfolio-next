import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
  	extend: {
  		fontFamily: {
  			headline: ['Space Grotesk', 'sans-serif'],
  			body: ['Inter', 'sans-serif'],
  			code: ['JetBrains Mono', 'monospace'],
  		},
  		colors: {
  			// Kinetic Precision Design System Colors
  			surface: {
  				DEFAULT: '#131313',
  				dim: '#131313',
  				bright: '#393939',
  				'container-lowest': '#0e0e0e',
  				'container-low': '#1c1b1b',
  				'container': '#201f1f',
  				'container-high': '#2a2a2a',
  				'container-highest': '#353534',
  				variant: '#353534',
  			},
  			kinetic: {
  				primary: '#00F5FF',
  				'primary-dim': '#00DCE5',
  				'primary-container': '#00F5FF',
  				secondary: '#BF00FF',
  				'secondary-light': '#ecb1ff',
  				'secondary-container': '#d05bff',
  			},
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			},
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			}
  		},
  		borderRadius: {
  			lg: '0px',
  			md: '0px',
  			sm: '0px',
  			DEFAULT: '0px',
  		},
  		boxShadow: {
  			'glow-primary': '0 0 20px rgba(0, 245, 255, 0.15), 0 0 40px rgba(0, 245, 255, 0.1)',
  			'glow-primary-intense': '0 0 10px rgba(0, 245, 255, 0.3), 0 0 20px rgba(0, 245, 255, 0.2), 0 0 40px rgba(0, 245, 255, 0.15)',
  			'glow-secondary': '0 0 20px rgba(191, 0, 255, 0.15), 0 0 40px rgba(191, 0, 255, 0.1)',
  			'glow-secondary-intense': '0 0 10px rgba(191, 0, 255, 0.3), 0 0 20px rgba(191, 0, 255, 0.2), 0 0 40px rgba(191, 0, 255, 0.15)',
  		},
  		keyframes: {
  			'accordion-down': {
  				from: { height: '0' },
  				to: { height: 'var(--radix-accordion-content-height)' }
  			},
  			'accordion-up': {
  				from: { height: 'var(--radix-accordion-content-height)' },
  				to: { height: '0' }
  			},
  			'glow-pulse': {
  				'0%, 100%': { boxShadow: '0 0 20px rgba(0, 245, 255, 0.15)' },
  				'50%': { boxShadow: '0 0 40px rgba(0, 245, 255, 0.25)' }
  			},
  			'terminal-blink': {
  				'0%, 50%': { opacity: '1' },
  				'51%, 100%': { opacity: '0' }
  			},
  			'kinetic-slide': {
  				'0%': { opacity: '0', transform: 'translateX(-30px)' },
  				'100%': { opacity: '1', transform: 'translateX(0)' }
  			},
  			'fade-up': {
  				'0%': { opacity: '0', transform: 'translateY(40px)' },
  				'100%': { opacity: '1', transform: 'translateY(0)' }
  			},
  			'scale-in': {
  				'0%': { opacity: '0', transform: 'scale(0.9)' },
  				'100%': { opacity: '1', transform: 'scale(1)' }
  			},
  			'text-shimmer': {
  				'0%': { backgroundPosition: '-200% 0' },
  				'100%': { backgroundPosition: '200% 0' }
  			},
  			'scan-line': {
  				'0%': { transform: 'translateY(-100%)' },
  				'100%': { transform: 'translateY(100vh)' }
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out',
  			'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
  			'terminal-blink': 'terminal-blink 1s step-end infinite',
  			'kinetic-slide': 'kinetic-slide 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
  			'fade-up': 'fade-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
  			'scale-in': 'scale-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
  			'text-shimmer': 'text-shimmer 3s ease-in-out infinite',
  			'scan-line': 'scan-line 8s linear infinite',
  		},
  		backgroundImage: {
  			'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
  			'gradient-kinetic': 'linear-gradient(135deg, #00F5FF 0%, #00DCE5 100%)',
  			'gradient-kinetic-secondary': 'linear-gradient(135deg, #BF00FF 0%, #d05bff 100%)',
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
