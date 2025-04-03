import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    react(),
    dts({ 
      include: ['src'],
      exclude: ['**/*.test.ts', '**/*.test.tsx', '**/*.stories.tsx'],
    })
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'FDATrackerFrontend',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'esm' : format}.js`
    },
    rollupOptions: {
      // Externalize peer dependencies
      external: [
        'react', 
        'react-dom', 
        'react-router-dom',
        '@emotion/react',
        '@emotion/styled',
        '@headlessui/react',
        '@mui/material',
        '@stripe/stripe-js',
        'axios',
        'chart.js',
        'date-fns',
        'framer-motion',
        'jwt-decode',
        'lodash',
        'lucide-react',
        'ol',
        'react-chartjs-2',
        'react-ga4',
        'react-google-recaptcha-v3',
        'react-hot-toast',
        'react-icons',
        'react-intersection-observer',
        'react-modal',
        'recharts',
        'tailwind-scrollbar',
        'xlsx'
      ],
      output: {
        // Global variables to use in UMD build for externalized deps
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react-router-dom': 'ReactRouterDOM',
          '@emotion/react': 'emotionReact',
          '@emotion/styled': 'emotionStyled',
          '@headlessui/react': 'Headless',
          '@mui/material': 'MUI',
          '@stripe/stripe-js': 'Stripe',
          'axios': 'axios',
          'chart.js': 'Chart',
          'date-fns': 'dateFns',
          'framer-motion': 'FramerMotion',
          'jwt-decode': 'jwtDecode',
          'lodash': '_',
          'lucide-react': 'LucideReact',
          'ol': 'ol',
          'react-chartjs-2': 'ReactChartjs2',
          'react-ga4': 'ReactGA',
          'react-google-recaptcha-v3': 'ReactGoogleRecaptchaV3',
          'react-hot-toast': 'toast',
          'react-icons': 'ReactIcons',
          'react-intersection-observer': 'ReactIntersectionObserver',
          'react-modal': 'ReactModal',
          'recharts': 'Recharts',
          'tailwind-scrollbar': 'tailwindScrollbar',
          'xlsx': 'XLSX'
        },
        // Preserve module structure
        preserveModules: true,
        preserveModulesRoot: 'src',
        // Generate sourcemaps
        sourcemap: true,
        // Add banner to output files
        banner: '/**\n * FDA Tracker Frontend\n * @license MIT\n * @copyright VijayAditya1609\n */'
      }
    },
    // Generate sourcemaps
    sourcemap: true,
    // Don't minify for better debugging
    minify: false,
    // Ensure CSS is processed correctly
    cssCodeSplit: true,
    // Output directory
    outDir: 'dist',
    // Clean output directory before build
    emptyOutDir: true,
  }
});
