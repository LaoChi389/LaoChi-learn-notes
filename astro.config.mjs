// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import svelte from '@astrojs/svelte';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
// site：正式網址（sitemap / canonical / OG 會用到）
// 部署到自訂網域或 GitHub Project Pages 時，請改成實際網址
// Project Pages 範例：site: 'https://xxx.github.io', base: '/repo-name'
export default defineConfig({
  site: 'https://laochi389.github.io',
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [svelte(), sitemap()],
  // Markdown：內文標題從 h2 起算，避免與頁面 h1 搶層級
  markdown: {
    shikiConfig: {
      themes: {
        light: 'github-dark',
        dark: 'github-dark',
      },
    },
  },
});
