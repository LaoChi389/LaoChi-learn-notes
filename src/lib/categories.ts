/**
 * 三大分類的共用設定
 * 顯示名稱集中在這裡；資料夾 / 網址仍用英文 id（方便維護）
 *
 * - ai         → AI工具與實作
 * - electrical → 電氣&電子設備
 * - system     → 系統&網路
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
] as const;

/** 分類 id 型別：'ai' | 'electrical' | 'system' */
export type CategoryId = (typeof categories)[number]['id'];

/** 依 id 取得分類資訊；找不到就回傳 undefined */
export function getCategory(id: string) {
  return categories.find((c) => c.id === id);
}
