/**
 * 網站分類設定（導覽 / 列表 / 內容集合 id）
 * 新增分類：在此加一筆，並建立 src/content/{id}/ 與 content.config.ts 集合
 *
 * inHeader: 是否出現在頂部導覽（預設 true）
 * 頁尾會放主要連結 + 關於本人
 */
export const categories = [
  {
    id: 'ai' as const,
    title: 'AI工具與實作',
    description: 'AI 工具使用、實作流程與學習筆記',
    href: '/ai',
    inHeader: true,
  },
  {
    id: 'electrical' as const,
    title: '電氣與電子設備',
    description: '電氣、電子設備相關原理與實務筆記',
    href: '/electrical',
    inHeader: true,
  },
  {
    id: 'system' as const,
    title: '系統與網路',
    description: '系統管理、網路與安全相關筆記',
    href: '/system',
    inHeader: true,
  },
  {
    id: 'about' as const,
    title: '關於本人',
    description: '自我介紹與聯絡方式',
    href: '/about',
    /** 不放頂部，改放頁尾 */
    inHeader: false,
  },
] as const;

/** 分類 id 型別 */
export type CategoryId = (typeof categories)[number]['id'];

/** 依 id 取得分類資訊 */
export function getCategory(id: string) {
  return categories.find((c) => c.id === id);
}

/** 頂部導覽用分類 */
export function getHeaderCategories() {
  return categories.filter((c) => c.inHeader !== false);
}
