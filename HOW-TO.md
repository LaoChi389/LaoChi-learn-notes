# 學習筆記網站 — 簡短操作手冊

適合之後自己維護：寫筆記、改名稱、改外觀時先看這份。

---

## 1. 啟動網站（預覽）

在專案資料夾開啟終端機：

```bash
npm.cmd run dev
```

瀏覽器開啟：http://localhost:4321/

停止：在終端機按 `Ctrl + C`

建置正式檔（部署前）：

```bash
npm.cmd run build
```

---

## 2. 三大分類對照

| 畫面上的名稱 | 筆記放哪裡 | 網址 |
|--------------|------------|------|
| AI工具與實作 | `src/content/ai/` | `/ai` |
| 電氣&電子設備 | `src/content/electrical/` | `/electrical` |
| 系統&網路 | `src/content/system/` | `/system` |

---

## 3. 新增／修改筆記（最常做）

1. 到對應資料夾（例如 `src/content/ai/`）
2. 新增一個 `.md` 檔，例如 `my-note.md`
3. 開頭寫 frontmatter，下面寫正文：

```markdown
---
title: 筆記標題
description: 列表上的一句話摘要（可省略）
date: 2026-07-20
tags:
  - 入門
  - 指令
draft: false
---

正文從這裡開始。

## 小標題

- 清單項目
- 另一項

行內程式碼：`npm.cmd run dev`

```bash
# 程式碼區塊
echo hello
```
```

### 注意

| 項目 | 說明 |
|------|------|
| 檔名 | 會變成網址，例如 `my-note.md` → `/ai/my-note` |
| `title` | 必填，列表與內頁標題 |
| `date` | 必填，格式 `YYYY-MM-DD` |
| `tags` | 可選；會出現在標籤頁與搜尋 |
| `draft: true` | 草稿，不會出現在列表／搜尋 |
| 刪除筆記 | 直接刪掉對應 `.md` 即可 |

改完存檔，重新整理瀏覽器即可看到（dev 通常會自動更新）。

---

## 4. 改分類顯示名稱／說明

只改這個檔：

```
src/lib/categories.ts
```

- `title` → 導覽列、首頁、列表顯示的名稱  
- `description` → 分類說明文字  
- `href` → 分類網址（進階，改了要一併改資料夾與設定）

一般**只改 `title` / `description` 就好**，資料夾名與網址可維持英文。

---

## 5. 想改網站長相時

| 目的 | 檔案 |
|------|------|
| 網站名稱、導覽 | `src/layouts/BaseLayout.astro`（名稱：紀錄學習的老紀） |
| 首頁佈局與自我介紹 | `src/pages/index.astro` |
| 全站色票（Misty Lightseagreen / Toon） | `src/styles/theme.css` |
| 版面與 Toon 樣式 | `src/styles/global.css` |
| 筆記預覽卡（Svelte） | `src/components/NotePreviewCard.svelte` |
| 首頁 | `src/pages/index.astro` |
| 分類列表頁 | `src/pages/[category]/index.astro` |
| 單篇筆記頁 | `src/pages/[category]/[...slug].astro` |
| 搜尋 | `src/pages/search.astro` |
| 標籤 | `src/pages/tags/` |
| 標籤小膠囊 | `src/components/TagList.astro` |

---

## 6. 其他功能怎麼用

| 功能 | 網址 | 說明 |
|------|------|------|
| 搜尋 | `/search` | 搜標題、說明、標籤、分類 |
| 標籤總覽 | `/tags` | 所有標籤與篇數 |
| 單一標籤 | `/tags/入門` | 該標籤下的筆記 |
| 配色 | 固定 Misty Lightseagreen | 見 `theme.css`，無日間／夜間切換 |

---

## 7. 專案結構（精簡版）

```
learn_note/
├── HOW-TO.md                 ← 本手冊
├── src/
│   ├── content/              ★ 筆記本體（最常改）
│   │   ├── ai/
│   │   ├── electrical/
│   │   └── system/
│   ├── lib/
│   │   ├── categories.ts     ★ 分類名稱／說明
│   │   └── notes.ts          工具函式（較少動）
│   ├── layouts/BaseLayout.astro
│   ├── pages/                各頁面
│   ├── components/           小元件
│   ├── styles/global.css
│   └── content.config.ts     筆記欄位規則（較少動）
└── public/                   圖示等靜態檔
```

**不要手改：** `node_modules/`、`dist/`（建置產物）。

---

## 8. 一句話記住

1. **寫內容** → `src/content/`  
2. **改分類名稱** → `src/lib/categories.ts`  
3. **改長相** → `BaseLayout.astro` + `global.css` + 需要的 `pages/`

有問題時，先確認 dev 有沒有在跑、`.md` 的 frontmatter 有沒有寫對。
