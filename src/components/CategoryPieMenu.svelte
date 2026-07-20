<script lang="ts">
  /**
   * 三大分類圓餅選單
   * - fixed 固定，預設垂直置中（偏左，方便往右展開）
   * - 可拖動到任意位置（位置會記住）
   * - 展開時分類在圓餅「右側」直向排列
   * - 桌面：滑鼠移入展開、移出收合（不持續開著）
   * - 手機：點擊展開／收合；拖動時不觸發切換
   */
  type Item = {
    id: string;
    title: string;
    href: string;
    short: string;
  };

  interface Props {
    items: Item[];
  }

  let { items }: Props = $props();

  const BTN = 68; // 主鈕邊長
  const STORAGE_KEY = 'category-pie-pos';
  const DRAG_THRESHOLD = 6;

  let open = $state(false);
  let x = $state(16);
  let y = $state(120);
  let rootEl: HTMLDivElement | undefined = $state();

  let dragging = $state(false);
  let moved = false;
  let startPX = 0;
  let startPY = 0;
  let originX = 0;
  let originY = 0;

  function clamp(v: number, min: number, max: number) {
    return Math.min(max, Math.max(min, v));
  }

  function maxX() {
    // 展開時預留右側空間（約 220px）
    const reserve = open ? 230 : 8;
    return Math.max(8, window.innerWidth - BTN - reserve);
  }

  function maxY() {
    const stackH = open ? items.length * 52 + 16 : 0;
    const h = Math.max(BTN, stackH);
    return Math.max(8, window.innerHeight - h - 8);
  }

  function applyClamp() {
    x = clamp(x, 8, maxX());
    y = clamp(y, 8, maxY());
  }

  function loadPos() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const p = JSON.parse(raw) as { x?: number; y?: number };
        if (typeof p.x === 'number' && typeof p.y === 'number') {
          x = p.x;
          y = p.y;
          applyClamp();
          return;
        }
      }
    } catch {
      /* ignore */
    }
    // 預設：左側 + 垂直中間
    x = 16;
    y = Math.max(8, (window.innerHeight - BTN) / 2);
  }

  function savePos() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ x, y }));
    } catch {
      /* ignore */
    }
  }

  /** 滑鼠裝置：靠 hover 展開；觸控：靠點擊 */
  function canHover() {
    return (
      typeof window !== 'undefined' &&
      window.matchMedia('(hover: hover) and (pointer: fine)').matches
    );
  }

  function onPointerDown(e: PointerEvent) {
    if (e.button !== 0) return;
    const el = e.currentTarget as HTMLElement;
    el.setPointerCapture(e.pointerId);
    dragging = true;
    moved = false;
    startPX = e.clientX;
    startPY = e.clientY;
    originX = x;
    originY = y;
  }

  function onPointerMove(e: PointerEvent) {
    if (!dragging) return;
    const dx = e.clientX - startPX;
    const dy = e.clientY - startPY;
    if (Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD) {
      moved = true;
      // 拖動中先收合，避免誤點分類
      if (open) open = false;
    }
    if (!moved) return;
    x = clamp(originX + dx, 8, window.innerWidth - BTN - 8);
    y = clamp(originY + dy, 8, window.innerHeight - BTN - 8);
  }

  function onPointerUp(e: PointerEvent) {
    if (!dragging) return;
    dragging = false;
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
    if (moved) {
      applyClamp();
      savePos();
      return;
    }
    // 桌面滑鼠：用 hover，不靠點擊鎖住展開
    if (canHover()) return;
    // 觸控：點擊切換展開／收合
    open = !open;
    queueMicrotask(() => {
      applyClamp();
      savePos();
    });
  }

  function onMouseEnter() {
    if (dragging || !canHover()) return;
    open = true;
    queueMicrotask(() => applyClamp());
  }

  function onMouseLeave() {
    if (dragging || !canHover()) return;
    open = false;
  }

  function onKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') open = false;
  }

  function onDocPointer(e: PointerEvent) {
    // 觸控展開時，點外面收合
    if (!open || !rootEl || dragging || canHover()) return;
    const t = e.target as Node | null;
    if (t && !rootEl.contains(t)) open = false;
  }

  function onResize() {
    applyClamp();
  }

  $effect(() => {
    loadPos();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  });

  $effect(() => {
    if (!open) return;
    applyClamp();
    document.addEventListener('pointerdown', onDocPointer);
    document.addEventListener('keydown', onKeydown);
    return () => {
      document.removeEventListener('pointerdown', onDocPointer);
      document.removeEventListener('keydown', onKeydown);
    };
  });
</script>

<div
  class="pie-menu"
  class:is-open={open}
  class:is-dragging={dragging && moved}
  bind:this={rootEl}
  style={`left:${x}px;top:${y}px;`}
  onmouseenter={onMouseEnter}
  onmouseleave={onMouseLeave}
>
  <!-- 主圓餅（可拖、可點） -->
  <button
    type="button"
    class="pie-menu-trigger"
    aria-expanded={open}
    aria-controls="pie-menu-items"
    aria-label="分類選單（滑鼠移上展開；可拖動位置）"
    onpointerdown={onPointerDown}
    onpointermove={onPointerMove}
    onpointerup={onPointerUp}
    onpointercancel={onPointerUp}
  >
    <span class="pie-menu-trigger-icon" aria-hidden="true">{open ? '✕' : '◎'}</span>
    <span class="pie-menu-trigger-text">{open ? '關閉' : '分類'}</span>
  </button>

  <!-- 展開：右側直向列表 -->
  <ul
    id="pie-menu-items"
    class="pie-menu-items"
    role="list"
    aria-hidden={!open}
  >
    {#each items as item, i (item.id)}
      <li class="pie-menu-item" style={`--i: ${i}`}>
        <a
          href={item.href}
          class="pie-menu-link"
          tabindex={open ? 0 : -1}
          title={item.title}
          onclick={() => {
            open = false;
          }}
        >
          <span class="pie-menu-short" aria-hidden="true">{item.short}</span>
          <span class="pie-menu-label">{item.title}</span>
        </a>
      </li>
    {/each}
  </ul>
</div>

<style>
  .pie-menu {
    position: fixed;
    z-index: 200;
    width: 4.25rem;
    height: 4.25rem;
    touch-action: none;
    user-select: none;
  }

  .pie-menu.is-dragging {
    cursor: grabbing;
  }

  .pie-menu-trigger {
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.1rem;
    width: 4.25rem;
    height: 4.25rem;
    padding: 0;
    border: 3px solid var(--border, #6eb8b8);
    border-radius: 999px;
    background:
      radial-gradient(
        circle at 30% 28%,
        #ffffff 0%,
        var(--surface, #f7fcfb) 45%,
        color-mix(in srgb, var(--accent, #1f9aab) 22%, white) 100%
      );
    color: var(--foreground, #0f2f3a);
    box-shadow:
      4px 5px 0 color-mix(in srgb, var(--accent, #1f9aab) 22%, transparent),
      0 12px 28px var(--shadow-color, rgba(15, 80, 90, 0.16));
    cursor: grab;
    transition:
      transform 0.22s ease,
      box-shadow 0.22s ease,
      border-color 0.2s ease,
      background 0.22s ease;
  }

  .pie-menu.is-dragging .pie-menu-trigger {
    cursor: grabbing;
    transform: scale(1.06);
    border-color: var(--accent, #1f9aab);
  }

  .pie-menu.is-open .pie-menu-trigger {
    border-color: var(--accent, #1f9aab);
    background:
      radial-gradient(
        circle at 30% 28%,
        #fff 0%,
        color-mix(in srgb, var(--accent, #1f9aab) 18%, white) 100%
      );
  }

  .pie-menu-trigger-icon {
    font-size: 1.15rem;
    line-height: 1;
    font-weight: 700;
    color: var(--accent-hover, #0d7f91);
    pointer-events: none;
  }

  .pie-menu-trigger-text {
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    pointer-events: none;
  }

  /* 右側展開面板 */
  .pie-menu-items {
    position: absolute;
    left: calc(100% + 0.65rem);
    top: 50%;
    display: flex;
    flex-direction: column;
    gap: 0.45rem;
    margin: 0;
    padding: 0;
    list-style: none;
    transform: translateY(-50%);
    pointer-events: none;
  }

  .pie-menu-item {
    opacity: 0;
    transform: translateX(-0.6rem) scale(0.92);
    transition:
      opacity 0.28s ease,
      transform 0.32s cubic-bezier(0.22, 1, 0.36, 1);
    transition-delay: 0ms;
  }

  .pie-menu.is-open .pie-menu-item {
    opacity: 1;
    transform: translateX(0) scale(1);
    pointer-events: auto;
    transition-delay: calc(var(--i) * 45ms);
  }

  .pie-menu-link {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    min-width: max-content;
    max-width: min(14rem, calc(100vw - 6rem));
    padding: 0.5rem 0.8rem 0.5rem 0.45rem;
    border: 2.5px solid var(--border, #6eb8b8);
    border-radius: 999px;
    background: var(--surface-pop, #fffef9);
    color: var(--foreground, #0f2f3a);
    text-decoration: none;
    box-shadow:
      3px 3px 0 color-mix(in srgb, var(--accent, #1f9aab) 18%, transparent),
      0 8px 18px var(--shadow-color, rgba(15, 80, 90, 0.12));
    transition:
      transform 0.18s ease,
      border-color 0.18s ease,
      box-shadow 0.18s ease;
  }

  .pie-menu-link:hover {
    border-color: var(--accent, #1f9aab);
    transform: translateX(3px) scale(1.02);
    box-shadow:
      3px 4px 0 color-mix(in srgb, var(--accent, #1f9aab) 28%, transparent),
      0 10px 22px var(--shadow-pop, rgba(31, 154, 171, 0.2));
  }

  .pie-menu-short {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.9rem;
    height: 1.9rem;
    border-radius: 999px;
    border: 2px solid color-mix(in srgb, var(--accent, #1f9aab) 40%, transparent);
    background: color-mix(in srgb, var(--accent, #1f9aab) 16%, white);
    color: var(--accent-hover, #0d7f91);
    font-size: 0.72rem;
    font-weight: 800;
    flex-shrink: 0;
  }

  .pie-menu-label {
    font-size: 0.8rem;
    font-weight: 700;
    line-height: 1.25;
  }
</style>
