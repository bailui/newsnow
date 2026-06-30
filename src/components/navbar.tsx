import { fixedColumnIds, metadata } from "@shared/metadata"
import { Link } from "@tanstack/react-router"
import { currentColumnIDAtom } from "~/atoms"

export function NavBar() {
  const currentId = useAtomValue(currentColumnIDAtom)
  const { toggle } = useSearchBar()
  return (
    <nav className="nav-tabs" aria-label="新闻分类">
      <button
        type="button"
        onClick={() => toggle(true)}
        className={$(
          "nav-tab cursor-pointer whitespace-nowrap",
          "color-[var(--ink-soft)] hover:color-[var(--brand-pink)]",
        )}
      >
        <span className="i-ph:magnifying-glass-duotone inline-block text-base"></span>
        <span>更多</span>
      </button>
      {fixedColumnIds.map(columnId => (
        <Link
          key={columnId}
          to="/c/$column"
          params={{ column: columnId }}
          className={$(
            "nav-tab cursor-pointer whitespace-nowrap",
            currentId === columnId
              ? "nav-tab-active color-[var(--brand-pink)] font-700"
              : "color-[var(--ink-soft)] hover:color-[var(--brand-pink)]",
          )}
        >
          {metadata[columnId].name}
        </Link>
      ))}
    </nav>
  )
}
