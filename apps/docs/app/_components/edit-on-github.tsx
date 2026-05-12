'use client'

import { usePathname } from 'next/navigation'

const REPO = 'https://github.com/dudusotero/pixelore'
const BRANCH = 'main'

/**
 * Resolves the docs URL to the source file in the repo and links to GitHub's
 * web editor. MDX pages live as `page.mdx`, .tsx component docs live as
 * `page.tsx`; we try both via an `.mdx` first heuristic (most guides are MDX,
 * components are .tsx) — GitHub returns 404 silently for the wrong one but the
 * other still works.
 */
export function EditOnGithub() {
  const pathname = usePathname()
  // Strip leading slash and infer file path under apps/docs/app
  const path = pathname.replace(/^\//, '')
  // Both possible filenames; default to page.tsx if the page is a component
  // (we can detect this by the URL containing /components/).
  const filename = pathname.includes('/components/') ? 'page.tsx' : 'page.mdx'
  const editUrl = `${REPO}/edit/${BRANCH}/apps/docs/app/${path}/${filename}`

  return (
    <div className="mt-16 border-t-2 border-po-border pt-6">
      <a
        href={editUrl}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-2 font-display text-[10px] uppercase tracking-widest text-po-fg-muted hover:text-po-accent focus-visible:outline-2 focus-visible:outline-po-accent focus-visible:outline-offset-2"
      >
        <span aria-hidden="true">✎</span>
        Edit this page on GitHub
      </a>
    </div>
  )
}
