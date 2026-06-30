import type { FixedColumnID } from "@shared/types"
import { useTitle } from "react-use"
import { NavBar } from "../navbar"
import { Dnd } from "./dnd"
import { currentColumnIDAtom } from "~/atoms"

export function Column({ id }: { id: FixedColumnID }) {
  const [currentColumnID, setCurrentColumnID] = useAtom(currentColumnIDAtom)
  useEffect(() => {
    setCurrentColumnID(id)
  }, [id, setCurrentColumnID])

  useTitle(`白鹿新闻 | ${metadata[id].name}`)

  return (
    <>
      <div className="mobile-nav-wrap md:hidden">
        <NavBar />
      </div>
      {id === currentColumnID && <Dnd />}
    </>
  )
}
