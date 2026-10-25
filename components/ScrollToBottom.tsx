'use client';

import React from 'react';
import { ArrowDown } from 'lucide-react';

interface ScrollToBottomProps {
  visible: boolean;
  onClick: () => void;
}

export const ScrollToBottom: React.FC<ScrollToBottomProps> = ({ visible, onClick }) => {
  if (!visible) return null;

  return (
    <button
      onClick={onClick}
      type="button"
      aria-label="Scroll to newest message"
      className="absolute bottom-28 right-8 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full shadow-md bg-white dark:bg-[#30302E] border border-[#E5E2D8] dark:border-[#3E3E3A] text-xs font-medium text-[#1F1E1D] dark:text-[#F5F4EE] hover:bg-[#F0EEE6] dark:hover:bg-[#383835] transition-all duration-200 animate-in fade-in slide-in-from-bottom-2"
    >
      <ArrowDown className="w-3.5 h-3.5 text-[#C96442]" />
      <span>New messages</span>
    </button>
  );
};
