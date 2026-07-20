<script lang="ts">
  /**
   * 首頁／列表用筆記預覽卡（Svelte）
   * 靜態展示為主；樣式靠全域 toon 類別
   */
  interface Props {
    href: string;
    title: string;
    description?: string;
    dateLabel: string;
    dateIso: string;
    categoryLabel: string;
    /** 讓 bento 第一張較大 */
    featured?: boolean;
  }

  let {
    href,
    title,
    description = '',
    dateLabel,
    dateIso,
    categoryLabel,
    featured = false,
  }: Props = $props();
</script>

<a {href} class="toon-card home-note-card" class:is-featured={featured}>
  <div class="home-note-card-meta">
    <span class="toon-badge">{categoryLabel}</span>
    <time datetime={dateIso}>{dateLabel}</time>
  </div>
  <h3 class="home-note-card-title">{title}</h3>
  {#if description}
    <p class="home-note-card-desc">{description}</p>
  {/if}
  <span class="home-note-card-cta" aria-hidden="true">閱讀 →</span>
</a>
