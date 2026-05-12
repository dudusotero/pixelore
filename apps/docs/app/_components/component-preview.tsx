'use client'

import { useState, type ReactNode } from 'react'

export interface ComponentPreviewProps {
  /** The live component(s) to render in the preview pane. */
  children: ReactNode
  /** The source code shown in the "code" tab. */
  code: string
  /** Defaults to "preview". Set to "code" to start with the source visible. */
  defaultTab?: 'preview' | 'code'
}

/**
 * A tabbed preview of a component plus its source — the docs site uses this
 * everywhere a live example is shown. Built locally (rather than reusing
 * pixelore's Tabs) to avoid coupling docs to library internals.
 */
export function ComponentPreview({
  children,
  code,
  defaultTab = 'preview',
}: ComponentPreviewProps) {
  const [tab, setTab] = useState<'preview' | 'code'>(defaultTab)

  return (
    <div className="my-6">
      <div
        role="tablist"
        aria-label="Preview tabs"
        className="inline-flex border-2 border-black bg-po-bg-elevated"
      >
        <TabButton active={tab === 'preview'} onClick={() => setTab('preview')}>
          Preview
        </TabButton>
        <TabButton active={tab === 'code'} onClick={() => setTab('code')}>
          Code
        </TabButton>
      </div>

      {tab === 'preview' ? (
        <div
          role="tabpanel"
          aria-label="Preview"
          className="mt-2 flex min-h-[200px] items-center justify-center border-2 border-po-border bg-po-surface p-8"
        >
          {children}
        </div>
      ) : (
        <div className="relative mt-2 group">
          <pre
            role="tabpanel"
            aria-label="Source code"
            className="overflow-x-auto border-2 border-po-border bg-po-bg-elevated p-4 font-mono text-sm leading-relaxed text-po-fg"
          >
            <code>{code}</code>
          </pre>
          <CopyButton text={code} />
        </div>
      )}
    </div>
  )
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // Clipboard unavailable (no permissions, insecure context, etc.).
    }
  }
  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? 'Copied!' : 'Copy code to clipboard'}
      className={
        'absolute right-2 top-2 px-2 py-1 text-[9px] font-display uppercase tracking-wider ' +
        'border-2 border-black bg-po-bg-elevated text-po-fg-muted ' +
        'hover:bg-po-surface hover:text-po-fg ' +
        'opacity-0 transition-opacity focus:opacity-100 group-hover:opacity-100 ' +
        'focus-visible:outline-2 focus-visible:outline-po-accent focus-visible:outline-offset-2'
      }
    >
      {copied ? 'OK!' : 'Copy'}
    </button>
  )
}

function TabButton({
  active,
  children,
  onClick,
}: {
  active: boolean
  children: ReactNode
  onClick: () => void
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={
        'px-4 py-2 font-display text-[10px] uppercase tracking-wider transition-colors ' +
        'border-r-2 border-black last:border-r-0 ' +
        'focus-visible:outline-2 focus-visible:outline-po-accent focus-visible:outline-offset-2 ' +
        (active
          ? 'bg-po-primary text-po-primary-fg'
          : 'text-po-fg-muted hover:bg-po-surface hover:text-po-fg')
      }
    >
      {children}
    </button>
  )
}
