import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { KanbanTaskType } from '../types'

type PomodoroPhase = 'work' | 'break';

interface BoardState {
  [key: string]: KanbanTaskType[];
}

interface SessionState {
  // Timer
  isPomodoro: boolean;
  workTime: number;
  breakTime: number;
  currentTime: number;
  pauseTime: number;
  isRunning: boolean;
  hasStarted: boolean;
  phase: PomodoroPhase;
  totalWork: number;

  // Kanban
  board: BoardState;
  activeTaskName: string;

  // Timer actions
  setPomodoro: (isPomodoro: boolean) => void;
  setWorkTime: (time: number) => void;
  setBreakTime: (time: number) => void;
  start: () => void;
  pause: () => void;
  reset: () => void;
  tick: () => void;

  // Kanban actions
  setBoard: (board: BoardState) => void;
  moveCard: (source: { droppableId: string; index: number }, destination: { droppableId: string; index: number }) => void;
  loadFromTask: (taskName: string, todos: { id: string; name: string; status: string }[]) => void;
}

export const useSessionStore = create<SessionState>()(
  devtools(
    (set, get) => ({
      // Timer state
      isPomodoro: false,
      workTime: 10,
      breakTime: 10,
      currentTime: 0,
      pauseTime: 0,
      isRunning: false,
      hasStarted: false,
      phase: 'work',
      totalWork: 0,

      // Kanban state
      board: {
        todo: [],
        doing: [],
        done: [],
        'not doing': [],
      },
      activeTaskName: '',

      // Timer actions
      setPomodoro: (isPomodoro: boolean) => set((state) => {
        if (state.isPomodoro === isPomodoro) return {};

        const newTime = isPomodoro ? state.workTime : 0;
        return {
          isPomodoro,
          isRunning: false,
          hasStarted: false,
          pauseTime: 0,
          phase: 'work',
          currentTime: newTime,
          totalWork: 0,
        };
      }),

      setWorkTime: (minutes: number) => set((state) => ({
        workTime: minutes * 60,
        currentTime: state.isPomodoro && state.phase === 'work' && !state.isRunning ? minutes * 60 : state.currentTime
      })),

      setBreakTime: (minutes: number) => set((state) => ({
        breakTime: minutes * 60,
        currentTime: state.isPomodoro && state.phase === 'break' && !state.isRunning ? minutes * 60 : state.currentTime
      })),

      start: () => set({ isRunning: true, hasStarted: true }),

      pause: () => {
        const { phase, workTime } = get()
        if (phase === 'break') {
          set({ currentTime: workTime, phase: 'work' })
        } else {
          set({ isRunning: false })
        }
      },

      reset: () => set((state) => ({
        isRunning: false,
        hasStarted: false,
        pauseTime: 0,
        currentTime: state.isPomodoro ? state.workTime : 0,
        phase: 'work'
      })),

      tick: () => set((state) => {
        if (state.hasStarted && !state.isRunning) {
          return { pauseTime: state.pauseTime + 1 };
        }

        if (!state.isRunning) return {};

        if (!state.isPomodoro) {
          return { currentTime: state.currentTime + 1, totalWork: state.totalWork + 1 };
        }

        if (state.currentTime > 0) {
          return { currentTime: state.currentTime - 1, totalWork: state.totalWork + (state.phase === "work" ? 1 : 0) };
        }

        const nextPhase = state.phase === 'work' ? 'break' : 'work';
        const nextTime = nextPhase === 'work' ? state.workTime : state.breakTime;
        return { phase: nextPhase, currentTime: nextTime };
      }),

      // Kanban actions
      setBoard: (board) => set({ board }),

      moveCard: (source, destination) => set((state) => {
        const startColumn = source.droppableId;
        const finishColumn = destination.droppableId;

        if (startColumn === finishColumn) {
          const newList = Array.from(state.board[startColumn]);
          const [removed] = newList.splice(source.index, 1);
          newList.splice(destination.index, 0, removed);
          return { board: { ...state.board, [startColumn]: newList } };
        }

        const startList = Array.from(state.board[startColumn]);
        const [removed] = startList.splice(source.index, 1);
        const finishList = Array.from(state.board[finishColumn]);
        finishList.splice(destination.index, 0, removed);

        return {
          board: {
            ...state.board,
            [startColumn]: startList,
            [finishColumn]: finishList,
          }
        };
      }),

      loadFromTask: (taskName, todos) => {
        const todoItems: KanbanTaskType[] = [];
        const doneItems: KanbanTaskType[] = [];

        todos.forEach((todo) => {
          const item = { id: todo.id, title: todo.name };
          if (todo.status === 'completed') {
            doneItems.push(item);
          } else {
            todoItems.push(item);
          }
        });

        set({
          board: {
            todo: todoItems,
            doing: [],
            done: doneItems,
            'not doing': [],
          },
          activeTaskName: taskName,
          // Reset timer
          isRunning: false,
          hasStarted: false,
          pauseTime: 0,
          currentTime: 0,
          totalWork: 0,
          phase: 'work',
        });
      },
    }),
    { name: "SessionState" }
  )
)