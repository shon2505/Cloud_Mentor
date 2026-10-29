'use client';

import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export const ThemeToggle: React.FC = () => {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const storedTheme = localStorage.getItem('cloudmentor_theme');
    if (storedTheme) {
      const darkActive = storedTheme === 'dark';
      setIsDark(darkActive);
      document.documentElement.classList.toggle('dark', darkActive);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDark(prefersDark);
      document.documentElement.classList.toggle('dark', prefersDark);
    }
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    document.documentElement.classList.toggle('dark', nextDark);
    localStorage.setItem('cloudmentor_theme', nextDark ? 'dark' : 'light');
  };

  if (!mounted) {
    return (
      <div className="w-8 h-8 rounded-lg border border-light-border dark:border-dark-border opacity-50" />
    );
  }

  return (
    <button
      onClick={toggleTheme}
      type="button"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="p-2 rounded-xl text-light-muted dark:text-dark-muted hover:text-aurora-cyan hover:bg-light-hover dark:hover:bg-dark-hover transition-colors"
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-aurora-cyan animate-in spin-in-180 duration-200" />
      ) : (
        <Moon className="w-4 h-4 text-aurora-blue animate-in spin-in-180 duration-200" />
      )}
    </button>
  );
};
