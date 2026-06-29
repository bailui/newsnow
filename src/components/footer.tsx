export function Footer() {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-3 text-xs">
        <a href={`${Homepage}/blob/main/LICENSE`} target="_blank" className="hover:color-[var(--brand-pink)] transition-colors">
          MIT LICENSE
        </a>
        <span className="color-neutral-300">·</span>
        <a href={Author.url} target="_blank" className="hover:color-[var(--brand-pink)] transition-colors">
          @{Author.name}
        </a>
      </div>
      <span className="text-xs color-neutral-400">
        白鹿io © 2024 — 实时热点新闻聚合
      </span>
    </div>
  )
}
