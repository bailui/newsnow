import { fixedColumnIds, metadata } from "@shared/metadata"
import { Link } from "@tanstack/react-router"
import { currentColumnIDAtom } from "~/atoms"

export function NavBar() {
  const currentId = useAtomValue(currentColumnIDAtom)
  const { toggle } = useSearchBar()
  return (
    <span className={$([
      "flex p-1.5 rounded-xl bg-[var(--surface-card)] text-sm",
      "shadow-sm border border-[var(--line)]",
      "gap-0.5",
    ])}
    >
      <button
        type="button"
        onClick={() => toggle(true)}
        className={$(
          "px-3 py-1.5 rounded-lg",
          "hover:bg-[var(--brand-pink)]/10",
          "op-60 hover:op-100",
          "cursor-pointer transition-all font-500",
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
              ? "bg-[var(--brand-pink)]/12 color-[var(--brand-pink)] font-600"
              : "op-60 hover:op-100 hover:bg-[var(--brand-pink)]/5",
          )}
        >
          {metadata[columnId].name}
        </Link>
      ))}
    </span>
  )
}
