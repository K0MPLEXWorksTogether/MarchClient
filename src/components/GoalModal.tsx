import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useGoalsStore } from '../store/goalsStore';
import { useSessionStore } from '../store/sessionStore';
import type { Goal, Task, Todo, status } from '../types';

type ModalMode =
    | { type: 'goal'; goal: Goal }
    | { type: 'task'; goalId: string; task: Task }
    | { type: 'todo'; goalId: string; taskId: string; todo: Todo };

interface GoalModalProps {
    mode: ModalMode;
    onClose: () => void;
}

export default function GoalModal({ mode, onClose }: GoalModalProps) {
    const { updateGoal, updateTask, updateTodo, deleteGoal, deleteTask, deleteTodo } = useGoalsStore();
    const { loadFromTask } = useSessionStore();
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [allocatedTime, setAllocatedTime] = useState(0);
    const [spentTime, setSpentTime] = useState(0);
    const [priority, setPriority] = useState(0);
    const [statusVal, setStatusVal] = useState<status>('active');
    const [order, setOrder] = useState(0);

    useEffect(() => {
        if (mode.type === 'goal') {
            setName(mode.goal.name);
            setDescription(mode.goal.description);
            setAllocatedTime(mode.goal.allocatedTime);
            setStatusVal(mode.goal.status);
        } else if (mode.type === 'task') {
            setName(mode.task.name);
            setAllocatedTime(mode.task.allocatedTime);
            setSpentTime(mode.task.spentTime);
            setPriority(mode.task.priority);
            setStatusVal(mode.task.status);
        } else {
            setName(mode.todo.name);
            setStatusVal(mode.todo.status);
            setOrder(mode.todo.order);
        }
    }, [mode]);

    const handleSave = () => {
        if (mode.type === 'goal') {
            updateGoal(mode.goal.id, { name, description, allocatedTime, status: statusVal });
        } else if (mode.type === 'task') {
            updateTask(mode.goalId, mode.task.id, { name, allocatedTime, spentTime, priority, status: statusVal });
        } else {
            updateTodo(mode.goalId, mode.taskId, mode.todo.id, { name, status: statusVal, order });
        }
        onClose();
    };

    const handleDelete = () => {
        if (mode.type === 'goal') {
            deleteGoal(mode.goal.id);
        } else if (mode.type === 'task') {
            deleteTask(mode.goalId, mode.task.id);
        } else {
            deleteTodo(mode.goalId, mode.taskId, mode.todo.id);
        }
        onClose();
    };

    const handleStartSession = () => {
        if (mode.type !== 'task') return;
        loadFromTask(mode.task.name, mode.task.todos.map(t => ({
            id: t.id,
            name: t.name,
            status: t.status,
        })));
        onClose();
        navigate('/session');
    };

    const title = mode.type === 'goal' ? 'Edit Goal' : mode.type === 'task' ? 'Edit Task' : 'Edit Todo';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />

            {/* Modal */}
            <div
                className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 pt-6 pb-2">
                    <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                    >
                        ✕
                    </button>
                </div>

                {/* Body */}
                <div className="px-6 py-4 space-y-4 max-h-[60vh] overflow-y-auto">
                    {/* Name */}
                    <FieldGroup label="Name">
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all"
                        />
                    </FieldGroup>

                    {/* Description (goal only) */}
                    {mode.type === 'goal' && (
                        <FieldGroup label="Description">
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={2}
                                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all resize-none"
                            />
                        </FieldGroup>
                    )}

                    {/* Status */}
                    <FieldGroup label="Status">
                        <select
                            value={statusVal}
                            onChange={(e) => setStatusVal(e.target.value as status)}
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all"
                        >
                            <option value="active">Active</option>
                            <option value="pending">Pending</option>
                            <option value="completed">Completed</option>
                        </select>
                    </FieldGroup>

                    {/* Allocated Time (goal & task) */}
                    {(mode.type === 'goal' || mode.type === 'task') && (
                        <FieldGroup label="Allocated Time (min)">
                            <input
                                type="number"
                                value={allocatedTime}
                                onChange={(e) => setAllocatedTime(Number(e.target.value))}
                                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all"
                            />
                        </FieldGroup>
                    )}

                    {/* Spent Time (task only) */}
                    {mode.type === 'task' && (
                        <FieldGroup label="Spent Time (min)">
                            <input
                                type="number"
                                value={spentTime}
                                onChange={(e) => setSpentTime(Number(e.target.value))}
                                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all"
                            />
                        </FieldGroup>
                    )}

                    {/* Priority (task only) */}
                    {mode.type === 'task' && (
                        <FieldGroup label="Priority">
                            <input
                                type="number"
                                value={priority}
                                min={0}
                                max={5}
                                onChange={(e) => setPriority(Number(e.target.value))}
                                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all"
                            />
                        </FieldGroup>
                    )}

                    {/* Order (todo only) */}
                    {mode.type === 'todo' && (
                        <FieldGroup label="Order">
                            <input
                                type="number"
                                value={order}
                                onChange={(e) => setOrder(Number(e.target.value))}
                                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all"
                            />
                        </FieldGroup>
                    )}

                    {/* Start Session button (task only) */}
                    {mode.type === 'task' && (
                        <button
                            onClick={handleStartSession}
                            className="w-full py-2.5 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Start Session
                        </button>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100">
                    <button
                        onClick={handleDelete}
                        className="px-4 py-2 text-sm font-medium text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    >
                        Delete
                    </button>
                    <div className="flex gap-2">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="px-5 py-2 text-sm font-semibold text-white bg-slate-800 hover:bg-slate-700 rounded-lg shadow-sm transition-colors cursor-pointer"
                        >
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function FieldGroup({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                {label}
            </label>
            {children}
        </div>
    );
}
