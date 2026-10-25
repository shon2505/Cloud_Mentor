'use client';

import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export const ThemeToggle: React.FC = () => {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Determine initial theme preference
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
      <div className="w-8 h-8 rounded-lg border border-[#E5E2D8] dark:border-[#3E3E3A] opacity-50" />
    );
  }

  return (
    <button
      onClick={toggleTheme}
      type="button"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="p-2 rounded-lg text-[#73726C] dark:text-[#9E9C96] hover:text-[#1F1E1D] dark:hover:text-[#F5F4EE] hover:bg-[#EAE7DD] dark:hover:bg-[#383835] transition-colors"
    >
      {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </button>
  );
};
