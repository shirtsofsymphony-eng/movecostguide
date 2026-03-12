'use client';
import { useState, useEffect } from 'react';
import { checklistData } from '../data/checklist-data';
import { ChevronDownIcon, PrinterIcon, CheckIcon } from './icons';

const STORAGE_KEY = 'mcg-checklist';

export default function MovingChecklist() {
  const [completed, setCompleted] = useState(new Set());
  const [expandedPhases, setExpandedPhases] = useState(
    new Set(checklistData.map((p) => p.id))
  );
  const [expandedTips, setExpandedTips] = useState(new Set());
  const [mounted, setMounted] = useState(false);

  /* Load from localStorage on mount */
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setCompleted(new Set(JSON.parse(saved)));
      }
    } catch {
      /* ignore parse errors */
    }
    setMounted(true);
  }, []);

  /* Persist to localStorage on change */
  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...completed]));
  }, [completed, mounted]);

  /* Totals */
  const totalTasks = checklistData.reduce((s, p) => s + p.tasks.length, 0);
  const completedCount = completed.size;
  const pct = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  /* Handlers */
  function toggleTask(taskId) {
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(taskId)) next.delete(taskId);
      else next.add(taskId);
      return next;
    });
  }

  function togglePhase(phaseId) {
    setExpandedPhases((prev) => {
      const next = new Set(prev);
      if (next.has(phaseId)) next.delete(phaseId);
      else next.add(phaseId);
      return next;
    });
  }

  function toggleTip(taskId) {
    setExpandedTips((prev) => {
      const next = new Set(prev);
      if (next.has(taskId)) next.delete(taskId);
      else next.add(taskId);
      return next;
    });
  }

  function handleReset() {
    if (window.confirm('Reset all checkmarks? This cannot be undone.')) {
      setCompleted(new Set());
    }
  }

  function phaseCompletedCount(phase) {
    return phase.tasks.filter((t) => completed.has(t.id)).length;
  }

  return (
    <div className="space-y-6">
      {/* ── Progress bar ── */}
      <div className="card-elevated p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-gray-700">
              {completedCount} of {totalTasks} tasks complete
            </span>
            <span className="text-xs font-bold text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full">
              {pct}%
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-orange-600 transition-colors"
              title="Print Checklist"
            >
              <PrinterIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Print Checklist</span>
            </button>
            <button
              onClick={handleReset}
              className="text-xs text-gray-400 hover:text-red-500 transition-colors underline"
            >
              Reset
            </button>
          </div>
        </div>
        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${pct}%`,
              background: 'linear-gradient(135deg, #f97316, #ea580c)',
            }}
          />
        </div>
      </div>

      {/* ── Phase sections ── */}
      {checklistData.map((phase) => {
        const isExpanded = expandedPhases.has(phase.id);
        const doneCount = phaseCompletedCount(phase);
        const allDone = doneCount === phase.tasks.length;

        return (
          <div key={phase.id} className="rounded-xl overflow-hidden border border-orange-200">
            {/* Phase header */}
            <button
              onClick={() => togglePhase(phase.id)}
              className="w-full card-warm flex items-center justify-between px-5 py-4 cursor-pointer select-none"
              style={{ borderRadius: isExpanded ? '0.75rem 0.75rem 0 0' : '0.75rem' }}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{phase.emoji}</span>
                <span className="font-semibold text-gray-800">{phase.label}</span>
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    allDone
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {doneCount}/{phase.tasks.length} tasks
                </span>
              </div>
              <ChevronDownIcon
                className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
                  isExpanded ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Task list */}
            {isExpanded && (
              <div className="bg-white divide-y divide-gray-100">
                {phase.tasks.map((task) => {
                  const isDone = completed.has(task.id);
                  const tipOpen = expandedTips.has(task.id);

                  return (
                    <div
                      key={task.id}
                      className="checklist-item px-5 py-3 hover:bg-orange-50/40 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={isDone}
                          onChange={() => toggleTask(task.id)}
                          aria-label={task.text}
                        />
                        <div className="flex-1 min-w-0">
                          <button
                            onClick={() => toggleTip(task.id)}
                            className={`text-left text-sm leading-relaxed transition-colors ${
                              isDone
                                ? 'text-gray-400 line-through'
                                : 'text-gray-700'
                            }`}
                          >
                            {task.text}
                          </button>

                          {/* Tip */}
                          {task.tip && (
                            <div
                              className={`overflow-hidden transition-all duration-300 ease-out ${
                                tipOpen ? 'max-h-40 opacity-100 mt-1.5' : 'max-h-0 opacity-0'
                              }`}
                            >
                              <p className="text-sm text-gray-500 italic pl-0.5">
                                💡 {task.tip}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
