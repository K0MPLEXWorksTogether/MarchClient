import { useState } from 'react'
import { useGoalsStore } from '../store/goalsStore'
import Goal from '../components/Goal'
import GoalModal from '../components/GoalModal'

type ModalState =
  | null
  | { type: 'goal'; goalId: string }
  | { type: 'task'; goalId: string; taskId: string }
  | { type: 'todo'; goalId: string; taskId: string; todoId: string };

function genId() {
  return Math.random().toString(36).substring(2, 10);
}

export default function Goals() {
  const { goals, addGoal, addTask, addTodo } = useGoalsStore();
  const [modal, setModal] = useState<ModalState>(null);

  const getModalMode = () => {
    if (!modal) return null;

    if (modal.type === 'goal') {
      const goal = goals.find(g => g.id === modal.goalId);
      if (!goal) return null;
      return { type: 'goal' as const, goal };
    }
    if (modal.type === 'task') {
      const goal = goals.find(g => g.id === modal.goalId);
      const task = goal?.tasks.find(t => t.id === modal.taskId);
      if (!goal || !task) return null;
      return { type: 'task' as const, goalId: goal.id, task };
    }
    if (modal.type === 'todo') {
      const goal = goals.find(g => g.id === modal.goalId);
      const task = goal?.tasks.find(t => t.id === modal.taskId);
      const todo = task?.todos.find(td => td.id === modal.todoId);
      if (!goal || !task || !todo) return null;
      return { type: 'todo' as const, goalId: goal.id, taskId: task.id, todo };
    }
    return null;
  };

  const handleAddGoal = () => {
    const id = genId();
    addGoal(id, 'New Goal', '', 'active', 0, 0, 0);
    setModal({ type: 'goal', goalId: id });
  };

  const handleAddTask = (goalId: string) => {
    const id = genId();
    addTask(goalId, id, 'New Task', 0, 'active', 0, 0);
    setModal({ type: 'task', goalId, taskId: id });
  };

  const handleAddTodo = (goalId: string, taskId: string) => {
    const id = genId();
    addTodo(goalId, taskId, id, 'New Todo');
    setModal({ type: 'todo', goalId, taskId, todoId: id });
  };

  const modalMode = getModalMode();

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-white to-stone-100'>
      {/* Header */}
      <div className="max-w-3xl mx-auto px-6 pt-10 pb-6 flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Goals</h1>
          <p className="text-sm text-slate-400 mt-1">Track your progress and stay focused</p>
        </div>
        <button
          onClick={handleAddGoal}
          className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-slate-800 hover:bg-slate-700 rounded-lg shadow-sm transition-colors cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add Goal
        </button>
      </div>

      {/* Goals List */}
      <div className="max-w-3xl mx-auto px-6 pb-10">
        {goals.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-4xl mb-3">🎯</div>
            <p className="text-slate-400 text-sm">No goals yet. Start by adding one!</p>
          </div>
        ) : (
          goals.map((goal) => (
            <Goal
              key={goal.id}
              goal={goal}
              onEditGoal={() => setModal({ type: 'goal', goalId: goal.id })}
              onEditTask={(taskId) => setModal({ type: 'task', goalId: goal.id, taskId })}
              onEditTodo={(taskId, todoId) => setModal({ type: 'todo', goalId: goal.id, taskId, todoId })}
              onAddTask={() => handleAddTask(goal.id)}
              onAddTodo={(taskId) => handleAddTodo(goal.id, taskId)}
            />
          ))
        )}
      </div>

      {/* Modal */}
      {modalMode && (
        <GoalModal
          mode={modalMode}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  )
}
