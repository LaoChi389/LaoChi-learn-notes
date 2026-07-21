/**
 * 網站分類設定（頂部導覽 / 列表 / 內容集合 id）
 * 新增分類：在此加一筆，並建立 src/content/{id}/ 與 content.config.ts 集合
 */
export const categories = [
  {
    id: 'ai' as const,
    title: 'AI工具與實作',
    description: 'AI 工具使用、實作流程與學習筆記',
    href: '/ai',
  },
  {
    id: 'electrical' as const,
    title: '電氣與電子設備',
    description: '電氣、電子設備相關原理與實務筆記',
    href: '/electrical',
  },
  {
    id: 'system' as const,
    title: '系統與網路',
    description: '系統管理、網路與安全相關筆記',
    href: '/system',
  },
  {
    id: 'about' as const,
    title: '關於本人',
    description: '自我介紹與聯絡方式',
    href: '/about',
  },
] as const;

/** 分類 id 型別 */
export type CategoryId = (typeof categories)[number]['id'];

/** 依 id 取得分類資訊；找不到就回傳 undefined */
export function getCategory(id: string) {
  return categories.find((c) => c.id === id);
}
