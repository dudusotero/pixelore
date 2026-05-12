'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

interface Heading {
  id: string
  text: string
  level: 2 | 3
}

/**
 * On mount, scans the page's `<article>` for h2/h3 headings, slugs them
 * (if not already given an id by rehype-slug or hand-authored), and renders
 * a right-rail anchor list that scroll-syncs to the article. The heading is
 * marked active as the user scrolls.
 */
export function TableOfContents() {
  const pathname = usePathname()
  const [headings, setHeadings] = useState<Heading[]>([])
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    const article = document.querySelector('article')
    if (!article) return

    const nodes = Array.from(article.querySelectorAll('h2, h3')) as HTMLHeadingElement[]
    const out: Heading[] = []
    for (const node of nodes) {
      if (!node.id) {
        node.id = slugify(node.textContent ?? '')
      }
      out.push({
        id: node.id,
        text: node.textContent ?? '',
        level: node.tagName === 'H2' ? 2 : 3,
      })
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- headings are derived from the rendered DOM on mount; nowhere else can produce them.
    setHeadings(out)

    // Highlight the most-visible heading as the active one.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        }
      },
      { rootMargin: '-100px 0px -70% 0px', threshold: 0 },
    )
    nodes.forEach((n) => observer.observe(n))
    return () => observer.disconnect()
  }, [pathname])

  if (headings.length === 0) return null

  return (
    <nav
      aria-label="On this page"
      className="sticky top-24 hidden max-h-[calc(100vh-7rem)] overflow-y-auto xl:block"
    >
      <h2 className="mb-2 font-display text-[10px] uppercase tracking-widest text-po-fg-muted">
        On this page
      </h2>
      <ul className="flex flex-col gap-1 border-l-2 border-po-border">
        {headings.map((h) => (
          <li key={h.id} className={h.level === 3 ? 'pl-3' : ''}>
            <a
              href={`#${h.id}`}
              aria-current={activeId === h.id ? 'true' : undefined}
              className={
                'block pl-3 py-0.5 font-body text-base transition-colors ' +
                'focus-visible:outline-2 focus-visible:outline-po-accent focus-visible:outline-offset-2 ' +
                (activeId === h.id
                  ? 'border-l-2 -ml-[2px] border-po-primary text-po-primary'
                  : 'text-po-fg-muted hover:text-po-fg')
              }
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
