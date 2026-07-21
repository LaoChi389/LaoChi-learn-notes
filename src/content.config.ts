/**
 * Content Collections 設定
 * 各分類 Markdown 格式與讀取方式
 *
 * 首頁精選：在 frontmatter 設 featured: true
 * 排序可用 featuredOrder（數字越小越前面）
 */
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/** 所有筆記共用的 frontmatter */
const noteSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  date: z.coerce.date(),
  tags: z.array(z.string()).default([]),
  draft: z.boolean().optional().default(false),
  /**
   * 是否出現在首頁「精選區」
   * 你想推薦哪篇，就設 featured: true
   */
  featured: z.boolean().optional().default(false),
  /** 精選排序，數字越小越靠前（可省略，預設 100） */
  featuredOrder: z.number().optional().default(100),
});

const ai = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/ai' }),
  schema: noteSchema,
});

const electrical = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/electrical' }),
  schema: noteSchema,
});

const system = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/system' }),
  schema: noteSchema,
});

/** 關於本人：src/content/about/*.md */
const about = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/about' }),
  schema: noteSchema,
});

export const collections = { ai, electrical, system, about };
