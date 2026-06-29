import { fixedColumnIds, metadata } from "@shared/metadata"
import { Link } from "@tanstack/react-router"
import { currentColumnIDAtom } from "~/atoms"

export function NavBar() {
  const currentId = useAtomValue(currentColumnIDAtom)
  const { toggle } = useSearchBar()
  return (
    <span className="flex items-center gap-0 text-sm">
      <button
        type="button"
        onClick={() => toggle(true)}
        className={$(
          "px-3 py-1.5 cursor-pointer transition-colors duration-150 whitespace-nowrap",
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
            "relative px-3 py-1.5 cursor-pointer transition-colors duration-150 whitespace-nowrap",
            currentId === columnId
              ? "color-[var(--brand-pink)] font-600"
              : "color-[var(--ink-soft)] hover:color-[var(--brand-pink)]",
          )}
        >
          {metadata[columnId].name}
          {currentId === columnId && (
            <span className="absolute bottom-0 left-3 right-3 h-[2px] rounded-full bg-[var(--brand-pink)]" />
          )}
        </Link>
      ))}
    </span>
  )
}
