import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { Goal, Task, Todo, status } from '../types';


interface GoalsState {
  goals: Goal[];

  addGoal: (goalId: string, goalName: string, goalDesc: string, goalStatus: status, goalAllocatedTime: number, goalRemainingTime: number, goalTimeRemaining: number) => void;
  toggleGoalStatus: (goalId: string) => void;
  deleteGoal: (goalId: string) => void;
  updateGoal: (goalId: string, updates: Partial<Omit<Goal, 'id' | 'tasks'>>) => void;

  addTask: (goalId: string, taskId: string, taskName: string, taskAllocatedTime: number, status: status, priority: number, spentTime: number) => void;
  toggleTaskStatus: (goalId: string, taskId: string) => void;
  deleteTask: (goalId: string, taskId: string) => void;
  updateTask: (goalId: string, taskId: string, updates: Partial<Omit<Task, 'id' | 'todos'>>) => void;

  addTodo: (goalId: string, taskId: string, todoId: string, todoName: string) => void;
  toggleTodoStatus: (goalId: string, taskId: string, todoId: string) => void;
  deleteTodo: (goalId: string, taskId: string, todoId: string) => void;
  updateTodo: (goalId: string, taskId: string, todoId: string, updates: Partial<Omit<Todo, 'id'>>) => void;
}

export const useGoalsStore = create<GoalsState>()(
  devtools((set) => ({
    goals: [
      {
        id: "abd",
        name: "Create Goals Page",
        description: "Finish styles for the entire page",
        status: "active",
        allocatedTime: 100,
        remainingTime: 100,
        timeRemainingForTasks: 100,
        tasks: [
          {
            id: "asdfasdf",
            name: "Finish functionality",
            allocatedTime: 40,
            spentTime: 0,
            status: 'active',
            priority: 1,
            todos: [
              {
                id: "aldf",
                name: "Add goals",
                status: "active",
                order: 0
              },
              {
                id: "bkdf",
                name: "Style components",
                status: "completed",
                order: 1
              }
            ]
          },
          {
            id: "task2",
            name: "Write tests",
            allocatedTime: 20,
            spentTime: 5,
            status: 'pending',
            priority: 2,
            todos: []
          }
        ]
      },
      {
        id: "goal2",
        name: "Setup CI/CD Pipeline",
        description: "Automate build, test, and deployment",
        status: "pending",
        allocatedTime: 60,
        remainingTime: 60,
        timeRemainingForTasks: 60,
        tasks: []
      }
    ],

    addGoal: (goalId, goalName, goalDesc, goalStatus, goalAllocatedTime, goalRemainingTime, goalTimeRemaining) =>
      set((state) => ({
        goals: [...state.goals, {
          id: goalId,
          name: goalName,
          description: goalDesc,
          status: goalStatus,
          allocatedTime: goalAllocatedTime,
          remainingTime: goalRemainingTime,
          timeRemainingForTasks: goalTimeRemaining,
          tasks: []
        }]
      })),

    toggleGoalStatus: (goalId) => set((state) => ({
      goals: state.goals.map((goal) =>
        goal.id === goalId
          ? { ...goal, status: (goal.status === 'completed' ? 'active' : 'completed') as status }
          : goal
      )
    })),

    deleteGoal: (goalId) => set((state) => ({
      goals: state.goals.filter((goal) => goal.id !== goalId)
    })),

    updateGoal: (goalId, updates) => set((state) => ({
      goals: state.goals.map((goal) =>
        goal.id === goalId ? { ...goal, ...updates } : goal
      )
    })),

    addTask: (goalId, taskId, taskName, taskAllocatedTime, status, priority, spentTime) =>
      set((state) => ({
        goals: state.goals.map((goal) => goal.id !== goalId ? goal : {
          ...goal,
          tasks: [...goal.tasks, {
            id: taskId,
            name: taskName,
            allocatedTime: taskAllocatedTime,
            spentTime: spentTime,
            status: status,
            priority: priority,
            todos: []
          }]
        })
      })),

    toggleTaskStatus: (goalId, taskId) => set((state) => ({
      goals: state.goals.map((goal) =>
        goal.id !== goalId ? goal : {
          ...goal,
          tasks: goal.tasks.map((task) =>
            task.id === taskId
              ? { ...task, status: (task.status === 'completed' ? 'active' : 'completed') as status }
              : task
          )
        })
    })),

    deleteTask: (goalId, taskId) => set((state) => ({
      goals: state.goals.map((goal) =>
        goal.id !== goalId ? goal : { ...goal, tasks: goal.tasks.filter((task) => task.id !== taskId) })
    })),

    updateTask: (goalId, taskId, updates) => set((state) => ({
      goals: state.goals.map((goal) =>
        goal.id !== goalId ? goal : {
          ...goal,
          tasks: goal.tasks.map((task) =>
            task.id === taskId ? { ...task, ...updates } : task
          )
        })
    })),

    addTodo: (goalId, taskId, todoId, todoName) => set((state) => ({
      goals: state.goals.map((goal) =>
        goal.id !== goalId ? goal : {
          ...goal,
          tasks: goal.tasks.map((task) =>
            task.id !== taskId ? task : {
              ...task,
              todos: [...task.todos, {
                id: todoId,
                name: todoName,
                status: 'active' as status,
                order: task.todos.length
              }]
            })
        })
    })),

    toggleTodoStatus: (goalId, taskId, todoId) => set((state) => ({
      goals: state.goals.map((goal) =>
        goal.id !== goalId ? goal : {
          ...goal,
          tasks: goal.tasks.map((task) =>
            task.id !== taskId ? task : {
              ...task,
              todos: task.todos.map((todo) =>
                todo.id === todoId
                  ? { ...todo, status: (todo.status === 'completed' ? 'active' : 'completed') as status }
                  : todo
              )
            })
        })
    })),

    deleteTodo: (goalId, taskId, todoId) => set((state) => ({
      goals: state.goals.map((goal) =>
        goal.id !== goalId ? goal : {
          ...goal,
          tasks: goal.tasks.map((task) =>
            task.id !== taskId ? task : {
              ...task,
              todos: task.todos.filter((todo) => todo.id !== todoId)
            })
        })
    })),

    updateTodo: (goalId, taskId, todoId, updates) => set((state) => ({
      goals: state.goals.map((goal) =>
        goal.id !== goalId ? goal : {
          ...goal,
          tasks: goal.tasks.map((task) =>
            task.id !== taskId ? task : {
              ...task,
              todos: task.todos.map((todo) =>
                todo.id === todoId ? { ...todo, ...updates } : todo
              )
            })
        })
    })),
  }))
)