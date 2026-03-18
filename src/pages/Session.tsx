import { KanbanBoard } from "../components/KanbanBoard"
import Timer from "../components/Timer"

export default function Session() {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-white to-stone-100 flex-col md:flex-row justify-around">
      <div className="w-full md:w-1/3 flex justify-center align-center">
        <Timer />
      </div>
      <KanbanBoard />
    </div>
  )
}