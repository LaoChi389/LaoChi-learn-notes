<script lang="ts">
  /**
   * TechCrunch 風格頂部導覽
   * - 深色全寬橫列
   * - 桌面顯示主要分類
   * - 右上：搜尋 + 漢堡選單（集中管理分類，之後新增分類只需改 categories）
   */
  export type NavItem = {
    title: string;
    href: string;
    description?: string;
  };

  interface Props {
    siteName: string;
    items: NavItem[];
    /** 目前路徑，用來標示 active */
    currentPath?: string;
    /** 站名旁 Logo */
    logoSrc?: string;
  }

  let { siteName, items, currentPath = '/', logoSrc = '/logo.png' }: Props = $props();

  let menuOpen = $state(false);

  function normalize(path: string) {
    return path.replace(/\/$/, '') || '/';
  }

  function isActive(href: string) {
    const p = normalize(currentPath);
    const h = normalize(href);
    if (h === '/') return p === '/';
    return p === h || p.startsWith(`${h}/`);
  }

  function toggleMenu() {
    menuOpen = !menuOpen;
  }

  function closeMenu() {
    menuOpen = false;
  }

  function onKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') menuOpen = false;
  }

  $effect(() => {
    if (!menuOpen) return;
    document.addEventListener('keydown', onKeydown);
    // 開選單時鎖一下捲動，行動版較好操作
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeydown);
      document.body.style.overflow = prev;
    };
  });
</script>

<header class="tc-header">
  <div class="tc-bar">
    <div class="tc-bar-inner">
      <a href="/" class="tc-brand" onclick={closeMenu} aria-label={`${siteName}（回首頁）`}>
        <img
          src={logoSrc}
          alt=""
          width="36"
          height="36"
          class="tc-brand-logo"
          decoding="async"
        />
        <span class="tc-brand-text">{siteName}</span>
      </a>

      <!-- 桌面：主要分類橫向 -->
      <nav class="tc-nav-desktop" aria-label="主要分類">
        {#each items as item (item.href)}
          <a
            href={item.href}
            class="tc-nav-link"
            class:is-active={isActive(item.href)}
          >
            {item.title}
          </a>
        {/each}
      </nav>

      <div class="tc-tools">
        <a href="/search" class="tc-icon-btn" aria-label="搜尋筆記" title="搜尋">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="11" cy="11" r="6.5" stroke="currentColor" stroke-width="2" />
            <path d="M16 16l4.5 4.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
          </svg>
        </a>

        <button
          type="button"
          class="tc-icon-btn tc-burger"
          aria-label={menuOpen ? '關閉選單' : '開啟選單'}
          aria-expanded={menuOpen}
          aria-controls="tc-mobile-panel"
          onclick={toggleMenu}
        >
          {#if menuOpen}
            <span class="tc-burger-x" aria-hidden="true">✕</span>
          {:else}
            <span class="tc-burger-lines" aria-hidden="true">
              <span></span><span></span><span></span>
            </span>
          {/if}
        </button>
      </div>
    </div>
  </div>

  <!-- 漢堡面板：分類集中管理入口 -->
  <div
    id="tc-mobile-panel"
    class="tc-panel"
    class:is-open={menuOpen}
    hidden={!menuOpen}
  >
    <div class="tc-panel-backdrop" onclick={closeMenu} aria-hidden="true"></div>
    <nav class="tc-panel-sheet" aria-label="全部分類選單">
      <p class="tc-panel-label">分類</p>
      <ul class="tc-panel-list" role="list">
        {#each items as item (item.href)}
          <li>
            <a
              href={item.href}
              class="tc-panel-link"
              class:is-active={isActive(item.href)}
              onclick={closeMenu}
            >
              <span class="tc-panel-link-title">{item.title}</span>
              {#if item.description}
                <span class="tc-panel-link-desc">{item.description}</span>
              {/if}
            </a>
          </li>
        {/each}
      </ul>

      <p class="tc-panel-label">其他</p>
      <ul class="tc-panel-list" role="list">
        <li>
          <a href="/search" class="tc-panel-link" onclick={closeMenu}>
            <span class="tc-panel-link-title">搜尋</span>
            <span class="tc-panel-link-desc">搜尋全部筆記</span>
          </a>
        </li>
        <li>
          <a href="/tags" class="tc-panel-link" onclick={closeMenu}>
            <span class="tc-panel-link-title">標籤</span>
            <span class="tc-panel-link-desc">依標籤瀏覽</span>
          </a>
        </li>
      </ul>
    </nav>
  </div>
</header>
