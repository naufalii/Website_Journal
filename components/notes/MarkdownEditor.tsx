'use client';

import React, { useRef, useState } from 'react';
import {
  Bold,
  Italic,
  Heading,
  List,
  CheckSquare,
  Quote,
  Code,
  Link as LinkIcon,
  Eye,
  Edit3,
  Columns,
} from 'lucide-react';
import { MarkdownViewer } from './MarkdownViewer';

interface MarkdownEditorProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  rows?: number;
}

export function MarkdownEditor({
  value,
  onChange,
  placeholder = 'Tuliskan catatan dalam format Markdown...',
  rows = 10,
}: MarkdownEditorProps) {
  const [viewMode, setViewMode] = useState<'edit' | 'preview' | 'split'>('edit');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Helper to insert formatting at cursor or around selection
  const insertFormat = (prefix: string, suffix: string = '', defaultText: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const textToInsert = selectedText || defaultText;

    const newText =
      value.substring(0, start) +
      prefix +
      textToInsert +
      suffix +
      value.substring(end);

    onChange(newText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + prefix.length,
        start + prefix.length + textToInsert.length
      );
    }, 0);
  };

  const toolbarButtons = [
    {
      label: 'Tebal (Bold)',
      icon: Bold,
      action: () => insertFormat('**', '**', 'teks tebal'),
    },
    {
      label: 'Miring (Italic)',
      icon: Italic,
      action: () => insertFormat('*', '*', 'teks miring'),
    },
    {
      label: 'Judul (Heading)',
      icon: Heading,
      action: () => insertFormat('### ', '', 'Judul Bagian'),
    },
    {
      label: 'Daftar Poin (List)',
      icon: List,
      action: () => insertFormat('- ', '', 'Poin daftar'),
    },
    {
      label: 'Daftar Checklist',
      icon: CheckSquare,
      action: () => insertFormat('- [ ] ', '', 'Tugas baru'),
    },
    {
      label: 'Kutipan (Quote)',
      icon: Quote,
      action: () => insertFormat('> ', '', 'Kutipan penting'),
    },
    {
      label: 'Blok Kode (Code Block)',
      icon: Code,
      action: () => insertFormat('```javascript\n', '\n```', '// Tulis kode di sini'),
    },
    {
      label: 'Tautan (Link)',
      icon: LinkIcon,
      action: () => insertFormat('[', '](https://example.com)', 'Nama Tautan'),
    },
  ];

  return (
    <div className="space-y-2">
      {/* Top Toolbar & View Mode Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-1.5 rounded-2xl bg-surface-lightPill dark:bg-surface-darkPill border border-slate-200/60 dark:border-white/5">
        {/* Formatting Actions */}
        <div className="flex items-center gap-1 overflow-x-auto pb-0.5 no-scrollbar">
          {toolbarButtons.map((btn, idx) => {
            const Icon = btn.icon;
            return (
              <button
                key={idx}
                type="button"
                onClick={btn.action}
                className="p-1.5 rounded-xl text-content-mutedLight dark:text-content-mutedDark hover:text-brand-primary dark:hover:text-brand-vibrant hover:bg-white dark:hover:bg-surface-dark transition-colors"
                title={btn.label}
              >
                <Icon className="h-4 w-4" />
              </button>
            );
          })}
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1 p-0.5 rounded-xl bg-white dark:bg-surface-dark shadow-soft">
          <button
            type="button"
            onClick={() => setViewMode('edit')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
              viewMode === 'edit'
                ? 'bg-brand-primary text-white shadow-soft'
                : 'text-content-mutedLight dark:text-content-mutedDark hover:text-content-primaryLight'
            }`}
          >
            <Edit3 className="h-3.5 w-3.5" />
            <span>Tulis</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('preview')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
              viewMode === 'preview'
                ? 'bg-brand-primary text-white shadow-soft'
                : 'text-content-mutedLight dark:text-content-mutedDark hover:text-content-primaryLight'
            }`}
          >
            <Eye className="h-3.5 w-3.5" />
            <span>Pratinjau</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('split')}
            className={`hidden md:flex px-2.5 py-1 rounded-lg text-xs font-bold items-center gap-1 transition-all ${
              viewMode === 'split'
                ? 'bg-brand-primary text-white shadow-soft'
                : 'text-content-mutedLight dark:text-content-mutedDark hover:text-content-primaryLight'
            }`}
            title="Split View (Berdampingan)"
          >
            <Columns className="h-3.5 w-3.5" />
            <span>Split</span>
          </button>
        </div>
      </div>

      {/* Editor & Preview Workspace */}
      <div className="min-h-[220px]">
        {viewMode === 'edit' && (
          <textarea
            ref={textareaRef}
            rows={rows}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full p-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-surface-light dark:bg-surface-dark text-xs sm:text-sm font-mono text-content-primaryLight dark:text-content-primaryDark placeholder:text-content-mutedLight dark:placeholder:text-content-mutedDark focus:outline-none focus:ring-2 focus:ring-brand-primary/20 shadow-soft leading-relaxed resize-y"
          />
        )}

        {viewMode === 'preview' && (
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-surface-light dark:bg-surface-dark min-h-[220px] max-h-[380px] overflow-y-auto shadow-soft">
            {value.trim() ? (
              <MarkdownViewer content={value} />
            ) : (
              <p className="text-xs text-content-mutedLight dark:text-content-mutedDark italic">
                Pratinjau kosong. Tuliskan teks di tab Tulis untuk melihat hasilnya.
              </p>
            )}
          </div>
        )}

        {viewMode === 'split' && (
          <div className="grid grid-cols-2 gap-3">
            <textarea
              ref={textareaRef}
              rows={rows}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              className="w-full p-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-surface-light dark:bg-surface-dark text-xs sm:text-sm font-mono text-content-primaryLight dark:text-content-primaryDark placeholder:text-content-mutedLight dark:placeholder:text-content-mutedDark focus:outline-none focus:ring-2 focus:ring-brand-primary/20 shadow-soft leading-relaxed resize-none"
            />
            <div className="p-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-surface-light dark:bg-surface-dark min-h-[220px] max-h-[380px] overflow-y-auto shadow-soft">
              {value.trim() ? (
                <MarkdownViewer content={value} />
              ) : (
                <p className="text-xs text-content-mutedLight dark:text-content-mutedDark italic">
                  Pratinjau akan muncul di sini...
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
