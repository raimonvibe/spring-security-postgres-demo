// src/app/login/page.js
'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import '../globals.css';

/**
 * Login page (SPA-friendly)
 * - Posts x-www-form-urlencoded to /perform_login
 * - Expects 200 on success, 401 on failure (no redirects)
 * - Dark/Light/System toggle (persists in localStorage)
 */
export default function LoginPage() {
  const router = useRouter();
  const API_BASE = useMemo(
    () => (process.env.NEXT_PUBLIC_API_BASE?.replace(/\/+$/, '') || 'http://localhost:8080'),
    []
  );

  // form state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');

  // theme state
  const [mode, setMode] = useState('system'); // 'light' | 'dark' | 'system'

  // Apply theme ASAP to avoid flash
  useEffect(() => {
    const saved = localStorage.getItem('theme') || 'system';
    setMode(saved);
    applyTheme(saved);
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => {
      const current = localStorage.getItem('theme') || 'system';
      if (current === 'system') applyTheme('system');
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  function applyTheme(next) {
    const root = document.documentElement;
    if (next === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.toggle('dark', prefersDark);
    } else {
      root.classList.toggle('dark', next === 'dark');
    }
  }

  function changeTheme(next) {
    setMode(next);
    localStorage.setItem('theme', next);
    applyTheme(next);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setPending(true);

    try {
      // IMPORTANT: Spring formLogin expects urlencoded, not multipart
      const body = new URLSearchParams();
      body.set('username', username.trim());
      body.set('password', password);

      const res = await fetch(`${API_BASE}/perform_login`, {
        method: 'POST',
        body,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        credentials: 'include',
        mode: 'cors',
        redirect: 'manual', // avoid following 302 to /login
      });

      if (res.status === 200) {
        router.push('/');
        return;
      }
      if (res.status === 401) {
        setError('Invalid credentials');
        return;
      }

      // Fallback: try to surface short server message
      let message = `Login failed (status ${res.status})`;
      try {
        const text = await res.text();
        if (text && text.length < 300) message = text;
      } catch {}
      setError(message);
    } catch {
      setError('Cannot reach server. Check NEXT_PUBLIC_API_BASE and CORS.');
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <section className="glass shadow-soft w-full max-w-md p-6 sm:p-8">
        {/* Header */}
        <header className="mb-6 flex items-start justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold">Sign in</h1>
            <p className="text-sm text-slate-500">Welcome back — please log in</p>
          </div>

          {/* Theme toggle */}
          <div className="inline-flex items-center gap-1 rounded-xl border px-1 py-1">
            <button
              type="button"
              onClick={() => changeTheme('light')}
              className={`px-3 py-1 rounded-lg text-sm btn-ghost ${mode === 'light' ? 'ring-theme' : ''}`}
              aria-pressed={mode === 'light'}
            >
              Light
            </button>
            <button
              type="button"
              onClick={() => changeTheme('dark')}
              className={`px-3 py-1 rounded-lg text-sm btn-ghost ${mode === 'dark' ? 'ring-theme' : ''}`}
              aria-pressed={mode === 'dark'}
            >
              Dark
            </button>
            <button
              type="button"
              onClick={() => changeTheme('system')}
              className={`px-3 py-1 rounded-lg text-sm btn-ghost ${mode === 'system' ? 'ring-theme' : ''}`}
              aria-pressed={mode === 'system'}
            >
              System
            </button>
          </div>
        </header>

        {/* Error */}
        {error ? (
          <div role="alert" className="mb-4 rounded-xl border px-3 py-2 text-sm bg-red-50 border-red-200 text-red-700">
            {error}
          </div>
        ) : null}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label htmlFor="username" className="block text-sm font-medium mb-1">
              Username
            </label>
            <input
              id="username"
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-theme"
              placeholder="you@example.com"
              required
              inputMode="email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPw ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border px-3 py-2 pr-12 focus:outline-none focus:ring-theme"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                className="absolute inset-y-0 right-2 my-auto text-sm px-2 rounded-lg btn-ghost"
                aria-label={showPw ? 'Hide password' : 'Show password'}
              >
                {showPw ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="inline-flex items-center gap-2 select-none">
              <input type="checkbox" className="rounded" />
              Remember me
            </label>
            <a className="text-indigo-600 hover:underline" href="#">
              Forgot password?
            </a>
          </div>

          <button type="submit" disabled={pending} className="btn btn-primary w-full" aria-busy={pending}>
            {pending ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <footer className="mt-6 text-center text-xs text-slate-500">
          API: <code>{API_BASE}</code>
        </footer>
      </section>
    </main>
  );
}
