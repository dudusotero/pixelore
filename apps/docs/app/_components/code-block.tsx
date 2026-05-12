'use client'

import { useState, type HTMLAttributes } from 'react'
import { Button } from '@pixelore/react'

interface CodeBlockProps extends HTMLAttributes<HTMLPreElement> {
  raw?: string
}

export function CodeBlock({ children, raw, className, ...props }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    const text =
      raw ??
      (typeof children === 'string'
        ? children
        : extractTextContent(children as React.ReactNode))
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // ignore — clipboard not available
    }
  }

  return (
    <div className="relative my-4 group">
      <pre
        className={
          'po-pixel-border bg-po-bg-elevated overflow-x-auto p-4 font-mono text-sm leading-relaxed text-po-fg ' +
          (className ?? '')
        }
        {...props}
      >
        {children}
      </pre>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={handleCopy}
        aria-label={copied ? 'Copied!' : 'Copy code'}
        className="absolute right-2 top-2 opacity-0 transition-opacity focus:opacity-100 group-hover:opacity-100"
      >
        {copied ? 'OK' : 'Copy'}
      </Button>
    </div>
  )
}

function extractTextContent(node: React.ReactNode): string {
  if (node == null || typeof node === 'boolean') return ''
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(extractTextContent).join('')
  if (typeof node === 'object' && 'props' in (node as object)) {
    return extractTextContent(
      (node as { props: { children?: React.ReactNode } }).props?.children,
    )
  }
  return ''
}
