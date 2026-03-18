import { useState } from "react";
import Task from "./Task";
import type { Goal } from "../types";
import { useGoalsStore } from "../store/goalsStore";

type GoalProps = {
  goal: Goal;
  onEditGoal: () => void;
  onEditTask: (taskId: string) => void;
  onEditTodo: (taskId: string, todoId: string) => void;
  onAddTask: () => void;
  onAddTodo: (taskId: string) => void;
}

export default function Goal({ goal, onEditGoal, onEditTask, onEditTodo, onAddTask, onAddTodo }: GoalProps) {
  const { toggleGoalStatus } = useGoalsStore();
  const [expanded, setExpanded] = useState(false);
  const isCompleted = goal.status === 'completed';
  const taskCount = goal.tasks.length;
  const completedTasks = goal.tasks.filter(t => t.status === 'completed').length;

  return (
    <div className="mb-3">
      {/* Goal Row */}
      <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200 group">
        {/* Round Checkbox */}
        <button
          onClick={() => toggleGoalStatus(goal.id)}
          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200 cursor-pointer ${isCompleted
            ? 'bg-emerald-500 border-emerald-500'
            : 'border-slate-300 hover:border-emerald-400'
            }`}
        >
          {isCompleted && (
            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
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
            className={`w-5 h-5 transition-transform duration-200 ${expanded ? 'rotate-90' : ''}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Goal Info */}
        <div className="flex-1 min-w-0 cursor-pointer" onClick={onEditGoal}>
          <div className="flex items-center gap-2">
            <span className={`text-base font-semibold transition-all ${isCompleted ? 'text-slate-400 line-through' : 'text-slate-800'
              }`}>
              {goal.name}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${goal.status === 'completed'
              ? 'bg-emerald-50 text-emerald-600'
              : goal.status === 'active'
                ? 'bg-blue-50 text-blue-600'
                : 'bg-slate-100 text-slate-500'
              }`}>
              {goal.status}
            </span>
          </div>
          {goal.description && (
            <p className="text-xs text-slate-400 mt-0.5 truncate">{goal.description}</p>
          )}
        </div>

        {/* Right-side meta */}
        <div className="flex items-center gap-3 text-xs text-slate-400">
          {taskCount > 0 && (
            <span className="hidden sm:inline">
              {completedTasks}/{taskCount} tasks
            </span>
          )}
          {goal.allocatedTime > 0 && (
            <span className="hidden sm:inline px-2 py-1 rounded-md bg-slate-50 text-slate-500 font-medium">
              {goal.allocatedTime}m
            </span>
          )}
        </div>
      </div>

      {/* Tasks (expandable) */}
      {expanded && (
        <div className="ml-6 mt-2 pl-4 border-l-2 border-slate-100">
          {goal.tasks.map((task) => (
            <Task
              key={task.id}
              task={task}
              goalId={goal.id}
              onEdit={() => onEditTask(task.id)}
              onEditTodo={(todoId) => onEditTodo(task.id, todoId)}
              onAddTodo={() => onAddTodo(task.id)}
            />
          ))}
          {/* Add Task button */}
          <button
            onClick={onAddTask}
            className="flex items-center gap-2 py-1.5 px-2 text-sm text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer mt-1"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add task
          </button>
        </div>
      )}
    </div>
  )
}
