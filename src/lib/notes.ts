/**
 * 筆記相關小工具
 * 集中處理：讀取集合、排序、日期格式、網址、標籤
 */
import { getCollection, type CollectionEntry } from 'astro:content';
import { categories, type CategoryId } from './categories';

/** 任一分類的筆記型別 */
export type NoteEntry =
  | CollectionEntry<'ai'>
  | CollectionEntry<'electrical'>
  | CollectionEntry<'system'>
  | CollectionEntry<'about'>;

export type NoteWithCategory = NoteEntry & { categoryId: CategoryId };

/** 搜尋索引用的精簡資料（給瀏覽器端過濾） */
export type SearchItem = {
  title: string;
  description: string;
  tags: string[];
  categoryId: CategoryId;
  categoryTitle: string;
  href: string;
  date: string;
  dateValue: number;
};

/** 取得某分類的已發佈筆記（排除 draft），預設依日期由新到舊 */
export async function getNotes(categoryId: CategoryId): Promise<NoteEntry[]> {
  const notes = await getCollection(categoryId, ({ data }) => !data.draft);
  return notes.sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
  ) as NoteEntry[];
}

/** 取得全部已發佈筆記（各分類合併），依日期由新到舊 */
export async function getAllNotes(): Promise<NoteWithCategory[]> {
  const results: NoteWithCategory[] = [];

  for (const cat of categories) {
    const notes = await getNotes(cat.id);
    for (const note of notes) {
      results.push(Object.assign(note, { categoryId: cat.id }));
    }
  }

  return results.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

/**
 * 首頁精選筆記
 * 條件：featured: true（且非 draft）
 * 排序：featuredOrder 小到大，再比日期新到舊
 */
export async function getFeaturedNotes(): Promise<NoteWithCategory[]> {
  const notes = await getAllNotes();
  return notes
    .filter((n) => n.data.featured && n.categoryId !== 'about')
    .sort((a, b) => {
      const ao = a.data.featuredOrder ?? 100;
      const bo = b.data.featuredOrder ?? 100;
      if (ao !== bo) return ao - bo;
      return b.data.date.valueOf() - a.data.date.valueOf();
    });
}

/**
 * 從 Markdown 正文取出第一張圖片網址
 * 支援 ![alt](url) 與 <img src="url">
 */
export function extractFirstImage(body: string | undefined): string | undefined {
  if (!body) return undefined;
  const md = body.match(/!\[[^\]]*]\(([^)\s]+)(?:\s+"[^"]*")?\)/);
  if (md?.[1]) return md[1];
  const html = body.match(/<img[^>]+src=["']([^"']+)["']/i);
  return html?.[1];
}

/** 把 Date 格式化成 AstroPaper 風格，例如 20 Jul, 2026 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/** 單篇筆記的網址：/ai/test */
export function noteHref(categoryId: string, entryId: string): string {
  return `/${categoryId}/${entryId}`;
}

/** 標籤列表頁網址 */
export function tagHref(tag: string): string {
  return `/tags/${encodeURIComponent(tag)}`;
}

/**
 * 統計全部標籤與出現次數
 * 回傳依名稱排序的陣列
 */
export async function getAllTags(): Promise<Array<{ tag: string; count: number }>> {
  const notes = await getAllNotes();
  const map = new Map<string, number>();

  for (const note of notes) {
    for (const tag of note.data.tags) {
      const name = tag.trim();
      if (!name) continue;
      map.set(name, (map.get(name) ?? 0) + 1);
    }
  }

  return [...map.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => a.tag.localeCompare(b.tag, 'zh-Hant'));
}

/** 依標籤篩選筆記（不分大小寫） */
export async function getNotesByTag(tag: string): Promise<
  Array<NoteEntry & { categoryId: CategoryId }>
> {
  const target = tag.trim().toLowerCase();
  const notes = await getAllNotes();
  return notes.filter((note) =>
    note.data.tags.some((t) => t.trim().toLowerCase() === target),
  );
}

/** 建搜尋用的精簡清單 */
export async function buildSearchIndex(): Promise<SearchItem[]> {
  const notes = await getAllNotes();
  return notes.map((note) => {
    const cat = categories.find((c) => c.id === note.categoryId)!;
    return {
      title: note.data.title,
      description: note.data.description ?? '',
      tags: note.data.tags,
      categoryId: note.categoryId,
      categoryTitle: cat.title,
      href: noteHref(note.categoryId, note.id),
      date: formatDate(note.data.date),
      dateValue: note.data.date.valueOf(),
    };
  });
}

/**
 * 在已排序列表中找「較新 / 較舊」鄰居
 * 列表需已依日期由新到舊排序
 */
export function getNeighborNotes(notes: NoteEntry[], currentId: string) {
  const index = notes.findIndex((n) => n.id === currentId);
  return {
    /** 較新的一篇（列表中的前一項） */
    newer: index > 0 ? notes[index - 1] : undefined,
    /** 較舊的一篇（列表中的後一項） */
    older: index >= 0 && index < notes.length - 1 ? notes[index + 1] : undefined,
  };
}
