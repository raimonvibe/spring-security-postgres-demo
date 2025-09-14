'use client';

import { useEffect, useState } from 'react';

type Mode = 'light' | 'dark' | 'system';

function applyTheme(mode: Mode) {
  const root = document.documentElement;
  if (mode === 'system') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    root.classList.toggle('dark', prefersDark);
  } else {
    root.classList.toggle('dark', mode === 'dark');
  }
}

export default function ThemeToggle() {
  const [mode, setMode] = useState<Mode>('system');

  // Load saved theme on mount
  useEffect(() => {
    const saved = (localStorage.getItem('theme') as Mode) || 'system';
    setMode(saved);
    applyTheme(saved);

    // React to OS changes if on system
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const listener = () => {
      const current = (localStorage.getItem('theme') as Mode) || 'system';
      if (current === 'system') applyTheme('system');
    };
    mq.addEventListener('change', listener);
    return () => mq.removeEventListener('change', listener);
  }, []);

  const change = (next: Mode) => {
    setMode(next);
    localStorage.setItem('theme', next);
    applyTheme(next);
  };

  return (
    <div className="inline-flex items-center gap-1 rounded-xl border px-1 py-1 glass shadow-soft">
      <button
        type="button"
        onClick={() => change('light')}
        className={`px-3 py-1 rounded-lg text-sm ${mode === 'light' ? 'btn btn-ghost ring-theme' : 'btn-ghost'}`}
        aria-pressed={mode === 'light'}
      >
        Light
      </button>
      <button
        type="button"
        onClick={() => change('dark')}
        className={`px-3 py-1 rounded-lg text-sm ${mode === 'dark' ? 'btn btn-ghost ring-theme' : 'btn-ghost'}`}
        aria-pressed={mode === 'dark'}
      >
        Dark
      </button>
      <button
        type="button"
        onClick={() => change('system')}
        className={`px-3 py-1 rounded-lg text-sm ${mode === 'system' ? 'btn btn-ghost ring-theme' : 'btn-ghost'}`}
        aria-pressed={mode === 'system'}
      >
        System
      </button>
    </div>
  );
}
