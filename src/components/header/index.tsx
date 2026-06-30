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
      title="回到顶部"
      aria-label="回到顶部"
      className={$("header-icon-btn i-ph:arrow-fat-up-duotone", ok ? "op-70 btn" : "op-0")}
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
      title="刷新"
      aria-label="刷新全部新闻"
      className={$("header-icon-btn i-ph:arrow-counter-clockwise-duotone btn", isFetching && "animate-spin i-ph:circle-dashed-duotone")}
      onClick={refreshAll}
    />
  )
}

export function Header() {
  return (
    <>
      <span className="flex justify-self-start items-center gap-3">
        <Link to="/" className="brand-link flex gap-2 items-center no-underline flex-shrink-0">
          <div className="brand-logo h-8 w-8 bg-cover flex-shrink-0" aria-hidden="true" style={{ backgroundImage: "url(/icon.svg)" }} />
          <span className="brand-title text-base font-800 color-primary">白鹿新闻</span>
        </Link>
        <a
          href="https://www.bailuioai.com"
          target="_blank"
          title="打开白鹿io主站"
          className="site-link text-xs color-neutral-400 hover:color-[var(--brand-pink)] whitespace-nowrap"
          rel="noopener noreferrer"
        >
          主站 →
        </a>
      </span>
      <span className="justify-self-center">
        <span className="hidden md:(inline-block)">
          <NavBar />
        </span>
      </span>
      <span className="justify-self-end flex gap-1.5 items-center text-lg color-neutral-400">
        <Refresh />
        <GoTop />
      </span>
    </>
  )
}
