import { defineConfig, type ConfigEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { VitePWA } from 'vite-plugin-pwa';
import tsconfigPaths from 'vite-tsconfig-paths';
import { visualizer } from 'rollup-plugin-visualizer';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Security headers configuration
const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Cross-Origin-Embedder-Policy': 'require-corp',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Resource-Policy': 'same-site'
};

// CSP configuration
const cspDirectives = {
  'default-src': ["'self'"],
  'script-src': ["'self'"],
  'style-src': ["'self'"],
  'img-src': ["'self'", 'data:', 'blob:'],
  'font-src': ["'self'"],
  'connect-src': [
    "'self'",
    'https://*.firebaseio.com',
    'https://*.googleapis.com',
    'https://*.firebase.com'
  ],
  'frame-src': [
    'https://*.firebaseapp.com',
    'https://*.google.com'
  ],
  'worker-src': ["'self'"],
  'form-action': ["'self'"],
  'upgrade-insecure-requests': []
};

// Convert CSP object to header string
const csp = Object.entries(cspDirectives)
  .map(([key, values]) => values.length ? `${key} ${values.join(' ')}` : key)
  .join('; ');

// Define the configuration function with proper typing
export default defineConfig(({ mode }: ConfigEnv) => {
  const isProduction = mode === 'production';
  const isAnalyze = process.env.ANALYZE === 'true';
  
  // Create a base configuration object
  const config: import('vite').UserConfig = {
    base: '/',
    plugins: [
      react({
        jsxImportSource: '@emotion/react',
        tsDecorators: true,
      }),
      tsconfigPaths(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: [
          'favicon.ico',
          'robots.txt',
          'apple-touch-icon.png',
          'safari-pinned-tab.svg',
          'sitemap.xml',
          'pwa-192x192.png',
          'pwa-512x512.png',
          'offline.html'
        ],
        manifest: {
          name: 'Tinder for Work',
          short_name: 'T4W',
          description: 'Find your next career match with Tinder for Work',
          theme_color: '#ff4b4b',
          background_color: '#ffffff',
          display: 'standalone',
          orientation: 'portrait',
          start_url: '/',
          scope: '/',
          prefer_related_applications: false,
          icons: [
            {
              src: '/pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any maskable',
            },
            {
              src: '/pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any maskable',
            },
          ],
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg,gif,webp,woff,woff2,ttf,eot,json}'],
          navigateFallback: '/index.html',
          clientsClaim: true,
          skipWaiting: true,
          runtimeCaching: [
            // Google Fonts
            {
              urlPattern: /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            // API requests
            {
              urlPattern: /^https?:\/\/api\.yourdomain\.com\/.*/i,
              handler: 'NetworkFirst',
              options: {
                cacheName: 'api-cache',
                expiration: {
                  maxEntries: 50,
                  maxAgeSeconds: 60 * 5, // 5 minutes
                },
                networkTimeoutSeconds: 10,
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            // Static assets
            {
              urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/i,
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'image-cache',
                expiration: {
                  maxEntries: 100,
                  maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
          ],
        },
      }),
      isAnalyze && visualizer({
        open: true,
        filename: 'dist/stats.html',
        gzipSize: true,
        brotliSize: true,
      }),
    ].filter(Boolean),
    server: {
      port: 3000,
      open: true,
      strictPort: true,
      host: true,
      proxy: {
        // Proxy API requests in development to avoid CORS issues
        '/api': {
          target: 'http://localhost:3001',
          changeOrigin: true,
          secure: false,
        },
      },
      cors: true,
      fs: {
        allow: ['..'],
      },
      headers: {
        ...securityHeaders,
        'Content-Security-Policy': csp,
      },
    },
    preview: {
      port: 3001,
      headers: {
        ...securityHeaders,
        'Content-Security-Policy': csp,
      },
      https: isProduction ? undefined : {},
    },
    build: {
      outDir: 'dist',
      sourcemap: isProduction ? 'hidden' : true,
      minify: isProduction ? 'terser' : false,
      cssCodeSplit: true,
      reportCompressedSize: false,
      chunkSizeWarningLimit: 2000,
      rollupOptions: {
        output: {
          manualChunks: (id: string) => {
            if (id.includes('node_modules')) {
              if (id.includes('react') || id.includes('react-dom') || id.includes('scheduler')) {
                return 'vendor_react';
              }
              if (id.includes('@radix-ui')) {
                return 'vendor_radix';
              }
              if (id.includes('firebase')) {
                return 'vendor_firebase';
              }
              if (id.includes('lodash') || id.includes('date-fns') || id.includes('classnames')) {
                return 'vendor_utils';
              }
              return 'vendor_other';
            }
          },
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: (assetInfo) => {
            if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico|webp|avif)$/i.test(assetInfo.name || '')) {
              return 'assets/images/[name]-[hash][extname]';
            }
            if (/\.(woff|woff2|eot|ttf|otf)$/i.test(assetInfo.name || '')) {
              return 'assets/fonts/[name]-[hash][extname]';
            }
            if (/\.css$/i.test(assetInfo.name || '')) {
              return 'assets/css/[name]-[hash][extname]';
            }
            return 'assets/[name]-[hash][extname]';
          },
        },
      },
      terserOptions: isProduction ? {
        compress: {
          drop_console: true,
          drop_debugger: true,
          pure_funcs: ['console.log', 'console.info'],
        },
        format: {
          comments: false,
        },
      } : undefined,
    },
    css: {
      modules: {
        localsConvention: 'camelCaseOnly' as const,
        generateScopedName: isProduction 
          ? '[hash:base64:8]' 
          : '[path][name]__[local]--[hash:base64:5]',
      },
      preprocessorOptions: {
        scss: {
          additionalData: `@use "sass:math"; @import "./src/styles/variables.scss";`,
        },
      },
      devSourcemap: !isProduction,
    },
    resolve: {
      alias: [
        { find: '@', replacement: path.resolve(__dirname, 'src') },
        { find: '@components', replacement: path.resolve(__dirname, 'src/components') },
        { find: '@assets', replacement: path.resolve(__dirname, 'src/assets') },
        { find: '@hooks', replacement: path.resolve(__dirname, 'src/hooks') },
        { find: '@utils', replacement: path.resolve(__dirname, 'src/utils') },
        { find: '@services', replacement: path.resolve(__dirname, 'src/services') },
        { find: '@pages', replacement: path.resolve(__dirname, 'src/pages') },
        { find: '@styles', replacement: path.resolve(__dirname, 'src/styles') },
      ],
      extensions: [
        '.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json', '.scss', '.css'
      ],
    },
    define: {
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      'process.env.VITE_APP_VERSION': JSON.stringify(process.env.npm_package_version || '1.0.0'),
      'process.env.VITE_APP_BUILD_DATE': JSON.stringify(new Date().toISOString()),
    },
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-dom/client',
        'react-router-dom',
        '@emotion/react',
        '@emotion/styled',
      ],
      exclude: ['@swc/core', 'esbuild'],
      esbuildOptions: {
        target: 'es2020',
        treeShaking: true,
        minify: isProduction,
        sourcemap: !isProduction,
      },
    },
    logLevel: isProduction ? 'warn' : 'info',
    clearScreen: !isProduction,
    mode: isProduction ? 'production' : 'development',
  };

  return config;
});
