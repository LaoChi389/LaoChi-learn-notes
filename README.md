# 紀錄學習的老紀 — 網站操作手冊

這份文件是給**網站主人自己**看的。  
之後新增筆記、更新內容、推上線，照這裡做就好。

GitHub 倉庫：https://github.com/LaoChi389/LaoChi-learn-notes

---

## 1. 網站簡介

這是一個用 **Astro** 建置的個人學習筆記網站，主要用來：

- 整理 **AI 工具與實作**、**電氣與電子設備**、**系統與網路** 的筆記
- 首頁有「精選內容」與「最新筆記」
- 提供搜尋、標籤、關於本人等頁面
- 推上 GitHub 後，由 **Cloudflare** 自動部署上線

日常你最常做的事只有兩件：**寫 Markdown 筆記**，然後 **git push**。

---

## 2. 如何新增一篇筆記

### 2-1. 要放在哪個資料夾？

筆記都在 `src/content/` 底下，依分類放：

| 分類（畫面上的名稱） | 資料夾路徑 | 網址範例 |
|----------------------|------------|----------|
| AI工具與實作 | `src/content/ai/` | `/ai/檔名` |
| 電氣與電子設備 | `src/content/electrical/` | `/electrical/檔名` |
| 系統與網路 | `src/content/system/` | `/system/檔名` |
| 關於本人 | `src/content/about/me.md` | `/about`（單頁，通常只改這支） |

**步驟：**

1. 打開對應分類資料夾  
2. 新增一個 `.md` 檔，例如：`selinux-basics.md`  
3. 寫好開頭的 Frontmatter 與正文  
4. 存檔 → 用 git 推上去（見第 3 章）

> 檔名會變成網址的一部分。  
> 建議用英文小寫、數字、連字號，例如：`npm-scripts.md`、`relay-wiring-01.md`。  
> 不要用空白或奇怪符號。

---

### 2-2. Frontmatter 要寫什麼？

每一篇筆記**最開頭**必須有一段用 `---` 包起來的設定（Frontmatter）：

```markdown
---
title: 筆記標題
description: 列表與搜尋會用到的一句話摘要
date: 2026-07-21
tags:
  - 入門
  - 指令
draft: false
featured: false
featuredOrder: 100
---

正文從這裡開始……
```

#### 欄位說明

| 欄位 | 必填？ | 說明 |
|------|--------|------|
| `title` | **是** | 筆記標題（也會用在 SEO 標題） |
| `date` | **是** | 日期，格式 `YYYY-MM-DD`，例如 `2026-07-21` |
| `description` | 建議填 | 簡短描述；列表、搜尋、SEO 都會用到 |
| `tags` | 否 | 標籤列表；會出現在標籤頁與搜尋 |
| `draft` | 否 | `true` 時不會出現在網站上（草稿） |
| `featured` | 否 | `true` 時會出現在首頁「精選內容」 |
| `featuredOrder` | 否 | 精選排序，**數字越小越前面**（預設 100） |

#### 分類怎麼指定？

**分類是由「資料夾」決定的，不是 Frontmatter 裡的欄位。**

- 放在 `src/content/ai/` → 就是 AI 分類  
- 放在 `src/content/system/` → 就是系統與網路  

#### 首頁精選（和最新筆記是分開的）

想讓某篇出現在首頁「精選內容」：

```markdown
featured: true
featuredOrder: 1
```

- 精選：只顯示 `featured: true` 的文章  
- 最新筆記：依日期最新 10 篇，**會自動排除已精選的**，兩邊不會重複  

取消精選：刪掉這兩行，或設 `featured: false`。

---

### 2-3. 圖片要放哪裡？怎麼引用？

**建議放法：**

1. 在 `public/` 下建資料夾，例如：`public/images/`  
2. 圖片放進去，例如：`public/images/relay-board.jpg`  
3. 在 Markdown 裡這樣寫：

```markdown
![繼電器接線示意](/images/relay-board.jpg)
```

或外部網址：

```markdown
![示意圖](https://example.com/photo.png)
```

**注意：**

- 路徑以 `/` 開頭，對應 `public/` 根目錄  
- `![說明文字](網址)` 裡的說明文字 = 圖片 alt（對 SEO 與無障礙有幫助）  
- 首頁「最新筆記」列表會自動抓**正文第一張圖**當縮圖；沒圖會顯示占位色塊  

---

### 2-4. 寫筆記時的注意事項

| 項目 | 建議 |
|------|------|
| 檔名 | 英文小寫 + 連字號，例如 `gpio-notes.md` |
| 標題階層 | 頁面標題已是 h1，正文請用 `##`、`###`，**不要**再用單一 `#` |
| 草稿 | 還沒寫完就設 `draft: true` |
| 關於本人 | 改 `src/content/about/me.md` 即可（自我介紹 + 聯絡方式同一頁） |

---

## 3. 如何更新網站

內容改完後，需要推到 GitHub，Cloudflare 才會自動部署。

### 3-1. 本機先預覽（可選但建議）

在專案根目錄開終端機：

```bash
npm.cmd install
npm.cmd run dev
```

瀏覽器打開：http://localhost:4321/

確認沒問題後再推上線。

> PowerShell 若擋 `npm`，請用 `npm.cmd`。

### 3-2. 推上 GitHub（正式更新）

```bash
git add .
git status
git commit -m "說明你這次改了什麼"
git push
```

**範例：**

```bash
git add src/content/ai/my-new-note.md
git commit -m "新增筆記：my-new-note"
git push
```

### 3-3. Cloudflare 自動部署

`git push` 到 GitHub 的 `main` 分支後：

1. Cloudflare 會偵測到變更  
2. 自動建置並部署  
3. 等一兩分鐘（有時更久）後用**強制重新整理**（Ctrl+F5）看線上網站  

你平常**不必**手動跑 Cloudflare 後台，除非部署失敗才需要進去看 log。

### 3-4. 常用指令速查

| 指令 | 用途 |
|------|------|
| `npm.cmd run dev` | 本機開發預覽 |
| `npm.cmd run build` | 建置正式檔到 `dist/` |
| `npm.cmd run preview` | 本機預覽建置結果 |
| `git push` | 推上 GitHub → 觸發自動部署 |

---

## 4. 寫文章時要注意的事情

### 4-1. SEO 建議

| 項目 | 做法 |
|------|------|
| 標題 `title` | 清楚、具體，不要每篇都叫「筆記一」 |
| 描述 `description` | 寫 1～2 句話摘要，會進搜尋與分享卡片 |
| 圖片 alt | `![有意義的說明](/images/xxx.jpg)`，不要空白 |
| 內文標題 | 用 `##`、`###` 分段，不要在正文再寫一個 `# 大標題` |
| 網頁標題格式 | 自動變成：`筆記標題 \| 紀錄學習的老紀` |

### 4-2. 排版建議

- 一段不要太長，適時空行  
- 步驟用清單（`-` 或 `1.`）  
- 指令與程式碼用行內 `` `code` `` 或程式碼區塊：

````markdown
```bash
npm.cmd run dev
```
````

- 重要觀念可用 **粗體**  
- 長文可多用 `##` 小標，方便目錄跳轉  

### 4-3. 分類使用方式

| 你想寫的主題 | 放到 |
|--------------|------|
| AI、工具、模型、自動化 | `src/content/ai/` |
| 電路、硬體、設備 | `src/content/electrical/` |
| Linux、網路、資安、系統 | `src/content/system/` |
| 自我介紹、聯絡方式 | `src/content/about/me.md` |

- **頂部導覽**：AI、電氣、系統  
- **頁尾**：「關於本人」、搜尋、標籤  
- 跨主題可用 `tags` 串連，不必硬塞同一個資料夾  

### 4-4. 若要新增「全新分類」（進階）

一般不常做。若真的要加：

1. 在 `src/lib/categories.ts` 加一筆設定  
2. 在 `src/content.config.ts` 加對應 collection  
3. 建立 `src/content/新id/` 資料夾  

不確定時先不要動這兩個設定檔，只在現有三個分類寫筆記即可。

---

## 5. 常見問題

### Q1：推上 Git 了，線上網站怎麼還沒變？

1. 等 Cloudflare 建置完成（約 1～5 分鐘）  
2. 用 **Ctrl+F5** 強制重新整理（瀏覽器快取）  
3. 到 GitHub 確認 `main` 分支有最新 commit  
4. 到 Cloudflare 部署紀錄看是否失敗  

### Q2：本機有檔案，但列表看不到這篇筆記？

檢查 Frontmatter：

- 是否有 `title`、`date`  
- 是否設了 `draft: true`（草稿不會顯示）  
- 檔案是否在正確分類資料夾  
- 本機有沒有重新整理 / 重開 `npm.cmd run dev`  

### Q3：圖片沒顯示？

- 路徑是否以 `/` 開頭（對應 `public/`）  
- 檔名大小寫是否完全一致  
- 檔案是否已 `git add` 並 `push` 上去  
- 正確：`/images/foo.jpg`（檔案在 `public/images/foo.jpg`）  
- 錯誤：`images/foo.jpg`、`./foo.jpg`、或只在本機、沒推上 Git  

### Q4：精選區沒出現我設的文章？

- 是否有 `featured: true`  
- 是否 `draft: true`（草稿不會上精選）  
- `featuredOrder` 是否被其他篇蓋過（數字越小越前面）  
- 推上線後有沒有強制重新整理  

### Q5：想改網站名稱、顏色、Logo？

| 想改的東西 | 檔案 |
|------------|------|
| 分類名稱／說明 | `src/lib/categories.ts` |
| 全站色票 | `src/styles/theme.css` |
| Logo／Favicon | `public/logo.png`、`public/favicon-v2.png` |
| 關於本人內文 | `src/content/about/me.md` |
| 頂部導覽行為 | `src/components/SiteNav.svelte` |
| 頁尾 | `src/components/SiteFooter.astro` |

### Q6：PowerShell 執行 `npm` 失敗？

改用：

```bash
npm.cmd run dev
```

### Q7：建置失敗怎麼辦？

本機先跑：

```bash
npm.cmd run build
```

終端機若出現 Frontmatter 錯誤（例如日期格式不對、少了 title），依訊息修正對應的 `.md` 再推。

### Q8：SEO / sitemap 相關檔在哪？

- 每頁標題與描述：`src/layouts/BaseLayout.astro` + 各頁傳入的 `title` / `description`  
- Sitemap：建置後在 `dist/sitemap-index.xml`（需 `astro.config.mjs` 的 `site` 設對）  
- robots：`public/robots.txt`  

正式網址若更換，記得改 `astro.config.mjs` 的 `site` 與 `robots.txt` 裡的 Sitemap 網址。

---

## 附錄：專案結構（精簡）

```text
learn_note/
├── README.md                 ← 本手冊
├── HOW-TO.md                 ← 較短的速查（可選）
├── public/                   ← 圖片、favicon、robots.txt
│   └── images/               ← 建議放筆記用圖
├── src/
│   ├── content/              ← ★ 筆記本體（最常改）
│   │   ├── ai/
│   │   ├── electrical/
│   │   ├── system/
│   │   └── about/me.md
│   ├── lib/categories.ts     ← 分類名稱設定
│   ├── content.config.ts     ← 筆記欄位規則
│   ├── layouts/              ← 全站版面
│   ├── components/           ← 導覽、頁尾、卡片等
│   ├── pages/                ← 頁面路由
│   └── styles/               ← 樣式與色票
└── package.json
```

---

**一句話記住：**  
寫筆記放 `src/content/對應分類/` → 填好 Frontmatter → `git add` / `commit` / `push` → 等 Cloudflare 部署完成。
