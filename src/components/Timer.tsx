import { useEffect } from 'react';
import { useSessionStore } from '../store/sessionStore';
import ding from "../assets/ding.mp3"

export default function Timer() {
  const {
    isPomodoro, currentTime, isRunning, phase, hasStarted,
    setPomodoro, start, pause, reset, tick
  } = useSessionStore();

  useEffect(() => {
    const interval = setInterval(() => {
      tick();
    }, 1000);

    return () => clearInterval(interval);
  }, [tick]);

  useEffect(() => {
    const dingSound = new Audio(ding);
    dingSound.volume = 0.8;
    dingSound.play();
  }, [phase])
  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');

    return h > 0 ? `${h}:${m}:${s}` : `${m}:${s}`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 font-sans w-full">
      {/* Mode Tabs */}
      <div className="mb-6 flex gap-1 bg-slate-100 rounded-full p-1 shadow-inner">
        <button
          className={`px-5 py-2 text-sm font-semibold uppercase tracking-wider rounded-full transition-all duration-300 cursor-pointer ${!isPomodoro
              ? "bg-white text-slate-800 shadow-md"
              : "text-slate-400 hover:text-slate-600"
            }`}
          onClick={() => setPomodoro(false)}
        >
          Timer
        </button>
        <button
          className={`px-5 py-2 text-sm font-semibold uppercase tracking-wider rounded-full transition-all duration-300 cursor-pointer ${isPomodoro
              ? "bg-white text-slate-800 shadow-md"
              : "text-slate-400 hover:text-slate-600"
            }`}
          onClick={() => setPomodoro(true)}
        >
          Pomodoro
        </button>
      </div>

      {/* Timer Circle */}
      <div className="mt-3 flex justify-center items-center flex-col text-5xl md:text-7xl font-bold text-slate-800 mb-8 tracking-tighter h-50 w-50 md:h-80 md:w-80 rounded-full border-4 border-slate-200 bg-white shadow-lg">
        <div>{formatTime(currentTime)}</div>
        {isPomodoro ? (<h2 className="text-base md:text-lg font-semibold text-slate-400 mt-5 uppercase tracking-widest h-6">
          {`${phase}`}
        </h2>) : ''}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4 mb-8 mt-2">
        {isRunning ? (
          <button onClick={pause} className="w-24 py-3 border uppercase border-slate-200 text-slate-700 bg-white rounded-xl font-bold shadow-sm hover:shadow-md hover:bg-slate-50 transition-all duration-200 tracking-wider cursor-pointer">
            {phase == 'break' ? "Skip" : "Pause"}
          </button>
        ) : (
          <button onClick={start} className="w-24 py-3 border uppercase border-slate-200 text-slate-700 bg-white rounded-xl font-bold shadow-sm hover:shadow-md hover:bg-slate-50 transition-all duration-200 tracking-wider cursor-pointer">
            Start
          </button>
        )}
        {hasStarted ? (
          <button onClick={reset} className="w-24 py-3 border uppercase border-slate-200 text-slate-700 bg-white rounded-xl font-bold shadow-sm hover:shadow-md hover:bg-slate-50 transition-all duration-200 tracking-wider cursor-pointer">
            Reset
          </button>
        ) : ""}
      </div>
    </div>
  );
}