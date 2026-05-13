import { EditOnGithub } from '../_components/edit-on-github'
import { Sidebar } from '../_components/sidebar'
import { TableOfContents } from '../_components/toc'

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10">
      <div className="grid gap-8 md:grid-cols-[var(--docs-sidebar-width)_1fr] xl:grid-cols-[var(--docs-sidebar-width)_1fr_220px]">
        <aside className="hidden md:block">
          <Sidebar />
        </aside>
        <article className="min-w-0 max-w-[var(--docs-content-max-width)]">
          {children}
          <EditOnGithub />
        </article>
        <aside className="hidden xl:block">
          <TableOfContents />
        </aside>
      </div>
    </div>
  )
}
