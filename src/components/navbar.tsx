import { fixedColumnIds, metadata } from "@shared/metadata"
import { Link } from "@tanstack/react-router"
import { currentColumnIDAtom } from "~/atoms"

export function NavBar() {
  const currentId = useAtomValue(currentColumnIDAtom)
  const { toggle } = useSearchBar()
  return (
    <span className="flex items-center gap-1 text-sm">
      <button
        type="button"
        onClick={() => toggle(true)}
        className={$(
          "px-3 py-1.5 rounded-lg cursor-pointer transition-all font-500",
          "color-[var(--ink-soft)] hover:color-[var(--brand-pink)]",
        )}
      >
        更多
      </button>
      {fixedColumnIds.map(columnId => (
        <Link
          key={columnId}
          to="/c/$column"
          params={{ column: columnId }}
          className={$(
            "px-3 py-1.5 rounded-lg cursor-pointer transition-all font-500",
            currentId === columnId
              ? "color-[var(--brand-pink)] font-600"
              : "color-[var(--ink-soft)] hover:color-[var(--brand-pink)]",
          )}
        >
          {metadata[columnId].name}
        </Link>
      ))}
    </span>
  )
}
