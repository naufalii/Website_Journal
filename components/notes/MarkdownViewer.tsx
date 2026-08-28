'use client';

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';
import { Check, Copy } from 'lucide-react';

interface MarkdownViewerProps {
  content: string;
  className?: string;
}

export function MarkdownViewer({ content, className = '' }: MarkdownViewerProps) {
  return (
    <div className={`prose dark:prose-invert max-w-none text-content-primaryLight dark:text-content-primaryDark ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          // Custom Code Block with Copy Button
          pre: ({ children, ...props }) => {
            return (
              <div className="relative group my-3">
                <pre
                  {...props}
                  className="rounded-2xl bg-[#0d1117] text-slate-100 p-4 pt-8 overflow-x-auto text-xs font-mono border border-slate-800"
                >
                  {children}
                </pre>
              </div>
            );
          },
          code: ({ node, inline, className, children, ...props }: any) => {
            const match = /language-(\w+)/.exec(className || '');
            const codeString = String(children).replace(/\n$/, '');

            if (!inline && match) {
              return (
                <CodeWithCopy language={match[1]} codeString={codeString}>
                  <code className={className} {...props}>
                    {children}
                  </code>
                </CodeWithCopy>
              );
            }

            if (inline) {
              return (
                <code
                  className="px-1.5 py-0.5 rounded-lg bg-surface-lightPill dark:bg-surface-darkPill text-brand-primary dark:text-brand-vibrant font-mono text-[11px] font-bold"
                  {...props}
                >
                  {children}
                </code>
              );
            }

            return (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
          // Headings styling
          h1: ({ children }) => (
            <h1 className="text-base sm:text-lg font-black text-content-primaryLight dark:text-content-primaryDark mt-4 mb-2">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-sm sm:text-base font-bold text-content-primaryLight dark:text-content-primaryDark mt-3 mb-1.5">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xs sm:text-sm font-bold text-content-primaryLight dark:text-content-primaryDark mt-2.5 mb-1">
              {children}
            </h3>
          ),
          // Paragraphs & Lists
          p: ({ children }) => (
            <p className="text-xs sm:text-sm text-content-primaryLight dark:text-content-primaryDark leading-relaxed mb-2.5">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-inside space-y-1 mb-2.5 text-xs sm:text-sm text-content-primaryLight dark:text-content-primaryDark">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside space-y-1 mb-2.5 text-xs sm:text-sm text-content-primaryLight dark:text-content-primaryDark">
              {children}
            </ol>
          ),
          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
          // Blockquote
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-brand-primary pl-3 py-1 my-2 text-content-mutedLight dark:text-content-mutedDark italic text-xs sm:text-sm bg-brand-primary/5 dark:bg-brand-primary/10 rounded-r-xl">
              {children}
            </blockquote>
          ),
          // Links
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-primary dark:text-brand-vibrant hover:underline font-bold"
            >
              {children}
            </a>
          ),
          // Tables
          table: ({ children }) => (
            <div className="overflow-x-auto my-3">
              <table className="min-w-full text-xs text-left border-collapse border border-slate-200 dark:border-white/10 rounded-xl overflow-hidden">
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => (
            <th className="bg-surface-lightPill dark:bg-surface-darkPill p-2.5 font-bold border-b border-slate-200 dark:border-white/10">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="p-2.5 border-b border-slate-100 dark:border-white/5">
              {children}
            </td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

function CodeWithCopy({
  language,
  codeString,
  children,
}: {
  language: string;
  codeString: string;
  children: React.ReactNode;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(codeString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <div className="absolute top-2 left-3 right-3 flex items-center justify-between pointer-events-none">
        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 font-mono">
          {language}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="pointer-events-auto flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors font-medium"
          title="Salin Kode"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 text-emerald-400" />
              <span className="text-emerald-400">Tersalin</span>
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              <span>Salin</span>
            </>
          )}
        </button>
      </div>
      {children}
    </>
  );
}
