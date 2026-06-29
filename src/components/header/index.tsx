import { Link } from "@tanstack/react-router"
import { useIsFetching } from "@tanstack/react-query"
import type { SourceID } from "@shared/types"
import { NavBar } from "../navbar"
import { currentSourcesAtom, goToTopAtom } from "~/atoms"

function GoTop() {
  const { ok, fn: goToTop } = useAtomValue(goToTopAtom)
  return (
    <button
      type="button"
      title="Go To Top"
      className={$("i-ph:arrow-fat-up-duotone", ok ? "op-50 btn" : "op-0")}
      onClick={goToTop}
    />
  )
}

function Refresh() {
  const currentSources = useAtomValue(currentSourcesAtom)
  const { refresh } = useRefetch()
  const refreshAll = useCallback(() => refresh(...currentSources), [refresh, currentSources])

  const isFetching = useIsFetching({
    predicate: (query) => {
      const [type, id] = query.queryKey as ["source" | "entire", SourceID]
      return (type === "source" && currentSources.includes(id)) || type === "entire"
    },
  })

  return (
    <button
      type="button"
      title="Refresh"
      className={$("i-ph:arrow-counter-clockwise-duotone btn", isFetching && "animate-spin i-ph:circle-dashed-duotone")}
      onClick={refreshAll}
    />
  )
}

export function Header() {
  return (
    <>
      <span className="flex justify-self-start items-center gap-3">
        <Link to="/" className="flex gap-2 items-center no-underline flex-shrink-0">
          <div className="h-7 w-7 rounded-lg bg-cover flex-shrink-0" title="白鹿新闻" style={{ backgroundImage: "url(/icon.svg)" }} />
          <span className="text-sm font-700 color-primary tracking-tight hidden sm:inline">白鹿新闻</span>
        </Link>
        <a
          href="https://www.bailuioai.com"
          target="_blank"
          className="text-xs color-neutral-400 hover:color-[var(--brand-pink)] transition-colors duration-150 hidden lg:inline whitespace-nowrap"
          rel="noopener noreferrer"
        >
          bailuioai.com →
        </a>
      </span>
      <span className="justify-self-center">
        <span className="hidden md:(inline-block)">
          <NavBar />
        </span>
      </span>
      <span className="justify-self-end flex gap-1 items-center text-lg color-neutral-400">
        <Refresh />
        <GoTop />
      </span>
    </>
  )
}
