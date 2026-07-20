/**
 * Content Collections 設定
 * 定義三大分類的 Markdown 筆記格式與讀取方式
 *
 * 之後新增筆記：在對應資料夾放 .md 檔，並填好 frontmatter 即可
 */
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/** 所有筆記共用的 frontmatter 結構 */
const noteSchema = z.object({
  /** 筆記標題（列表與內頁都會顯示） */
  title: z.string(),
  /** 簡短說明（可選，列表頁摘要用） */
  description: z.string().optional(),
  /** 撰寫 / 更新日期，例如 2026-07-20 */
  date: z.coerce.date(),
  /**
   * 標籤（可選）
   * 範例：tags: [入門, 指令]
   */
  tags: z.array(z.string()).default([]),
  /** 是否從列表隱藏（草稿用，預設 false） */
  draft: z.boolean().optional().default(false),
});

/** AI工具與實作：src/content/ai/*.md */
const ai = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/ai' }),
  schema: noteSchema,
});

/** 電氣&電子設備：src/content/electrical/*.md */
const electrical = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/electrical' }),
  schema: noteSchema,
});

/** 系統&網路：src/content/system/*.md */
const system = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/system' }),
  schema: noteSchema,
});

export const collections = { ai, electrical, system };
