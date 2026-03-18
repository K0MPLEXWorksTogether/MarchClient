import type { Todo } from "../types"
import { useGoalsStore } from "../store/goalsStore"

type TodoProps = {
  todo: Todo;
  goalId: string;
  taskId: string;
  onEdit: () => void;
}

export default function Todo({ todo, goalId, taskId, onEdit }: TodoProps) {
  const { toggleTodoStatus } = useGoalsStore();
  const isCompleted = todo.status === 'completed';

  return (
    <div className="flex items-center gap-3 py-1.5 px-2 rounded-lg hover:bg-slate-50 transition-colors group">
      {/* Round Checkbox */}
      <button
        onClick={() => toggleTodoStatus(goalId, taskId, todo.id)}
        className={`w-4.5 h-4.5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200 cursor-pointer ${isCompleted
            ? 'bg-emerald-500 border-emerald-500'
            : 'border-slate-300 hover:border-emerald-400'
          }`}
      >
        {isCompleted && (
          <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>

      {/* Name */}
      <span
        onClick={onEdit}
        className={`text-sm cursor-pointer flex-1 transition-all ${isCompleted
            ? 'text-slate-400 line-through'
            : 'text-slate-600 hover:text-slate-800'
          }`}
      >
        {todo.name}
      </span>
    </div>
  )
}
