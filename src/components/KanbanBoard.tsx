import React from 'react';
import { DragDropContext, Droppable, Draggable, type DropResult } from '@hello-pangea/dnd';
import { useSessionStore } from '../store/sessionStore';

export const KanbanBoard: React.FC = () => {
  const { board, activeTaskName, moveCard } = useSessionStore();

  const columnNames: Record<string, string> = {
    todo: 'To Do',
    doing: 'In Progress',
    done: 'Done',
    'not doing': 'Not Doing',
  };

  const columnColors: Record<string, string> = {
    todo: 'bg-amber-400',
    doing: 'bg-blue-400',
    done: 'bg-emerald-400',
    'not doing': 'bg-slate-300',
  };

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;
    moveCard(source, destination);
  };

  const isEmpty = Object.values(board).every(col => col.length === 0);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex flex-col w-full pt-6">
        {/* Task name header */}
        {activeTaskName && (
          <div className="px-5 mb-4">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Working on</span>
            <h2 className="text-lg font-bold text-slate-700 tracking-tight">{activeTaskName}</h2>
          </div>
        )}

        {isEmpty && !activeTaskName && (
          <div className="flex items-center justify-center h-64 text-slate-400 text-sm">
            Start a session from a task to populate the board
          </div>
        )}

        <div className="flex gap-4 px-5 items-start justify-center w-full">
          {Object.keys(board).map((columnId) => (
            <div key={columnId} className='w-1/4'>
              <div className="flex items-center gap-2 m-2 pb-2">
                <span className={`w-2.5 h-2.5 rounded-full ${columnColors[columnId]}`}></span>
                <h3 className='text-slate-700 font-semibold text-lg tracking-tight'>
                  {columnNames[columnId]}
                </h3>
                <span className="text-xs text-slate-400 font-medium ml-1">
                  {board[columnId].length}
                </span>
              </div>

              <Droppable droppableId={columnId}>
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={`p-2 rounded-xl min-h-32 transition-colors duration-200 border border-dashed ${snapshot.isDraggingOver
                        ? "bg-blue-50/80 border-blue-300"
                        : "bg-slate-50/50 border-slate-200"
                      }`}
                  >
                    {board[columnId].map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`p-3 mb-2 rounded-lg text-sm font-medium transition-shadow duration-200 ${snapshot.isDragging
                                ? "bg-white shadow-lg text-slate-800 ring-2 ring-blue-200"
                                : "bg-white shadow-sm text-slate-600 border border-slate-100 hover:shadow-md"
                              }`}
                            style={{
                              ...provided.draggableProps.style,
                            }}
                          >
                            {task.title}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </div>
    </DragDropContext>
  );
};