import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  modules: [
    '@nuxt/content',
    '@nuxtjs/google-fonts',
  ],

  devtools: { enabled: false },
  compatibilityDate: '2026-08-14',

  css: ['~/assets/css/main.css'],

  vite: {
    plugins: [tailwindcss()],
  },

  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
      ],
      script: [
        {
          innerHTML: [
            'try{',
            'var t=localStorage.getItem("front-heaven:theme");',
            'var d=t?t==="dark":window.matchMedia("(prefers-color-scheme: dark)").matches;',
            'document.documentElement.classList.toggle("dark",d);',
            '}catch(e){}',
          ].join(''),
        },
      ],
    },
  },

  experimental: {
    payloadExtraction: 'client',
  },

  googleFonts: {
    families: {
      Inter: [400, 500, 600, 700],
      'Space Grotesk': [500, 600, 700],
      'JetBrains Mono': [400, 500],
    },
    display: 'swap',
    subsets: ['latin'],
  },

  runtimeConfig: {
    public: {
      siteUrl: 'https://front-heaven.dev',
    },
  },

  content: {
    build: {
      markdown: {
        toc: { depth: 3, searchDepth: 3 },
        highlight: {
          theme: {
            default: 'vitesse-light',
            dark: 'vitesse-dark',
          },
          langs: ['html', 'css', 'javascript', 'typescript', 'json', 'bash', 'markdown'],
        },
      },
    },
  },

  nitro: {
    prerender: {
      crawlLinks: true,
      routes: [
        '/',
        '/roadmap',
        '/diagram',
        '/about',
        '/learn/html',
        '/learn/css',
        '/learn/javascript',
        '/learn/git',
        '/learn/responsive-design',
        '/learn/accessibility',
        '/learn/http-and-apis',
        '/learn/typescript',
        '/learn/react',
        '/learn/vue',
        '/learn/angular',
        '/learn/svelte',
        '/learn/solidjs',
        '/learn/nextjs',
        '/learn/nuxtjs',
        '/learn/tailwindcss',
        '/learn/bootstrap',
        '/learn/advanced-topics',
      ],
    },
  },

  typescript: { strict: true },
})
