import { useState } from 'react';
import Todo from './Todo';
import type { Task } from '../types';
import { useGoalsStore } from '../store/goalsStore';

type TaskProps = {
  task: Task;
  goalId: string;
  onEdit: () => void;
  onEditTodo: (todoId: string) => void;
  onAddTodo?: () => void;
}

export default function Task({ task, goalId, onEdit, onEditTodo, onAddTodo }: TaskProps) {
  const { toggleTaskStatus } = useGoalsStore();
  const [expanded, setExpanded] = useState(false);
  const isCompleted = task.status === 'completed';
  const todoCount = task.todos.length;
  const completedTodos = task.todos.filter(t => t.status === 'completed').length;

  return (
    <div className="mb-1">
      <div className="flex items-center gap-3 py-2 px-2 rounded-lg hover:bg-slate-50/80 transition-colors group">
        {/* Round Checkbox */}
        <button
          onClick={() => toggleTaskStatus(goalId, task.id)}
          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200 cursor-pointer ${isCompleted
            ? 'bg-blue-500 border-blue-500'
            : 'border-slate-300 hover:border-blue-400'
            }`}
        >
          {isCompleted && (
            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>

        {/* Expand Toggle */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
        >
          <svg
            className={`w-4 h-4 transition-transform duration-200 ${expanded ? 'rotate-90' : ''}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Name */}
        <span
          onClick={onEdit}
          className={`text-sm font-medium cursor-pointer flex-1 transition-all ${isCompleted
            ? 'text-slate-400 line-through'
            : 'text-slate-700 hover:text-slate-900'
            }`}
        >
          {task.name}
        </span>

        {/* Meta badges */}
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {task.priority > 0 && (
            <span className="text-xs px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-600 font-medium">
              P{task.priority}
            </span>
          )}
          {todoCount > 0 && (
            <span className="text-xs text-slate-400">
              {completedTodos}/{todoCount}
            </span>
          )}
        </div>
      </div>

      {/* Todos (expandable) */}
      {expanded && (
        <div className="ml-10 mt-1 mb-2 pl-3 border-l-2 border-slate-100">
          {task.todos.map((todo) => (
            <Todo
              key={todo.id}
              todo={todo}
              goalId={goalId}
              taskId={task.id}
              onEdit={() => onEditTodo(todo.id)}
            />
          ))}
          {/* Add Todo button */}
          {onAddTodo && (
            <button
              onClick={onAddTodo}
              className="flex items-center gap-2 py-1 px-2 text-xs text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer mt-1"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Add todo
            </button>
          )}
        </div>
      )}
    </div>
  )
}
