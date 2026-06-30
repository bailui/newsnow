import type { PropsWithChildren } from "react"
import type { SourceID } from "@shared/types"
import type { BaseEventPayload, ElementDragType } from "@atlaskit/pragmatic-drag-and-drop/dist/types/internal-types"
import { extractClosestEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge"
import { reorderWithEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/util/reorder-with-edge"
import { createPortal } from "react-dom"
import { useThrottleFn } from "ahooks"
import { useAutoAnimate } from "@formkit/auto-animate/react"
import { motion } from "framer-motion"
import { useWindowSize } from "react-use"
import { isMobile } from "react-device-detect"
import { DndContext } from "../common/dnd"
import { useSortable } from "../common/dnd/useSortable"
import { OverlayScrollbar } from "../common/overlay-scrollbar"
import type { ItemsProps } from "./card"
import { CardWrapper } from "./card"
import { currentSourcesAtom } from "~/atoms"

const AnimationDuration = 200
const WIDTH = 360

export function Dnd() {
  const [items, setItems] = useAtom(currentSourcesAtom)
  const [parent] = useAutoAnimate({ duration: AnimationDuration })
  useEntireQuery(items)
  const { width } = useWindowSize()
  const minWidth = useMemo(() => Math.min(width - 24, WIDTH), [width])

  if (!items.length) return null

  return (
    <DndWrapper items={items} setItems={setItems} isSingleColumn={isMobile}>
      <OverlayScrollbar defer className="overflow-x-hidden">
        <motion.ol
          className={$(
            "grid w-full gap-4",
            "sm:gap-5",
            "lg:gap-6",
          )}
          ref={parent}
          style={{
            gridTemplateColumns: isMobile
              ? "1fr"
              : `repeat(auto-fill, minmax(${minWidth}px, 1fr))`,
          }}
          initial={!isMobile ? "hidden" : undefined}
          animate={!isMobile ? "visible" : undefined}
          variants={!isMobile ? {
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { delayChildren: 0.05, staggerChildren: 0.05 },
            },
          } : undefined}
        >
          {items.map((id) => (
            <motion.li
              key={id}
              className="w-full"
              variants={!isMobile ? {
                hidden: { y: 12, opacity: 0 },
                visible: { y: 0, opacity: 1 },
              } : undefined}
              transition={{ type: "tween", duration: 0.15 }}
            >
              <SortableCardWrapper id={id} />
            </motion.li>
          ))}
        </motion.ol>
      </OverlayScrollbar>
    </DndWrapper>
  )
}

function DndWrapper({ items, setItems, isSingleColumn, children }: PropsWithChildren<{
  items: SourceID[]
  setItems: (items: SourceID[]) => void
  isSingleColumn: boolean
}>) {
  const onDropTargetChange = useCallback(({ location, source }: BaseEventPayload<ElementDragType>) => {
    const traget = location.current.dropTargets[0]
    if (!traget?.data || !source?.data) return
    const closestEdgeOfTarget = extractClosestEdge(traget.data)
    const fromIndex = items.indexOf(source.data.id as SourceID)
    const toIndex = items.indexOf(traget.data.id as SourceID)
    if (fromIndex === toIndex || fromIndex === -1 || toIndex === -1) return
    const update = reorderWithEdge({
      list: items,
      startIndex: fromIndex,
      indexOfTarget: toIndex,
      closestEdgeOfTarget,
      axis: isSingleColumn ? "vertical" : "vertical",
    })
    setItems(update)
  }, [items, setItems, isSingleColumn])
  const { run } = useThrottleFn(onDropTargetChange, {
    leading: true, trailing: true, wait: AnimationDuration,
  })
  const { el } = useAtomValue(goToTopAtom)
  return (
    <DndContext onDropTargetChange={run} autoscroll={el ? { element: el } : undefined}>
      {children}
    </DndContext>
  )
}

function CardOverlay({ id }: { id: SourceID }) {
  return (
    <div className={$(
      "flex flex-col p-4 backdrop-blur-lg",
      `bg-${sources[id].color}-500 bg-op-30!`,
      !isiOS() && "rounded-2xl",
      "shadow-xl",
    )}>
      <div className="flex justify-between mx-2 items-center">
        <div className="flex gap-2 items-center">
          <div className="w-8 h-8 rounded-full bg-cover"
            style={{ backgroundImage: `url(/icons/${id.split("-")[0]}.png)` }} />
          <span className="flex flex-col">
            <span className="flex items-center gap-2">
              <span className="text-xl font-bold">{sources[id].name}</span>
              {sources[id]?.title && <span className={$("text-sm", `color-${sources[id].color} bg-base op-80 bg-op-50! px-1 rounded`)}>{sources[id].title}</span>}
            </span>
            <span className="text-xs op-80 color-white">拖拽中</span>
          </span>
        </div>
        <div className={$("flex gap-2 text-lg", `color-${sources[id].color}`)}>
          <button type="button" className="i-ph:dots-six-vertical-duotone cursor-grabbing" />
        </div>
      </div>
    </div>
  )
}

function SortableCardWrapper({ id }: ItemsProps) {
  const { isDragging, setNodeRef, setHandleRef, OverlayContainer } = useSortable({ id })
  useEffect(() => {
    if (OverlayContainer) {
      OverlayContainer!.className += $(`bg-base`, !isiOS() && "rounded-2xl")
    }
  }, [OverlayContainer])
  return (
    <>
      <CardWrapper ref={setNodeRef} id={id} isDragging={isDragging} setHandleRef={setHandleRef} />
      {OverlayContainer && createPortal(<CardOverlay id={id} />, OverlayContainer)}
    </>
  )
}
