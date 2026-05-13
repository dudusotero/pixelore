import type { MDXComponents } from 'mdx/types'
import { CodeBlock } from './app/_components/code-block'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children, ...props }) => (
      <h1
        className="font-display text-xl sm:text-2xl uppercase tracking-wider text-po-fg mt-8 mb-4 [overflow-wrap:anywhere]"
        {...props}
      >
        {children}
      </h1>
    ),
    h2: ({ children, ...props }) => (
      <h2
        className="font-display text-base sm:text-lg uppercase tracking-wide text-po-fg mt-10 mb-3 border-b-2 border-po-border pb-2 [overflow-wrap:anywhere]"
        {...props}
      >
        {children}
      </h2>
    ),
    h3: ({ children, ...props }) => (
      <h3
        className="font-display text-xs sm:text-sm uppercase tracking-wide text-po-fg mt-8 mb-2 [overflow-wrap:anywhere]"
        {...props}
      >
        {children}
      </h3>
    ),
    p: ({ children, ...props }) => (
      <p className="font-body text-base sm:text-lg leading-relaxed text-po-fg-muted mb-4" {...props}>
        {children}
      </p>
    ),
    a: ({ children, href, ...props }) => (
      <a
        href={href}
        className="text-po-secondary underline underline-offset-2 hover:text-po-accent [overflow-wrap:anywhere]"
        {...props}
      >
        {children}
      </a>
    ),
    ul: ({ children, ...props }) => (
      <ul className="list-disc pl-5 sm:pl-6 font-body text-base sm:text-lg text-po-fg-muted space-y-1 mb-4" {...props}>
        {children}
      </ul>
    ),
    ol: ({ children, ...props }) => (
      <ol
        className="list-decimal pl-5 sm:pl-6 font-body text-base sm:text-lg text-po-fg-muted space-y-1 mb-4"
        {...props}
      >
        {children}
      </ol>
    ),
    pre: ({ children, ...props }) => <CodeBlock {...props}>{children}</CodeBlock>,
    code: ({ children, ...props }) => (
      <code
        className="font-mono bg-po-bg-elevated border border-po-border px-1 py-0.5 text-po-accent text-sm sm:text-base [overflow-wrap:anywhere]"
        {...props}
      >
        {children}
      </code>
    ),
    ...components,
  }
}
