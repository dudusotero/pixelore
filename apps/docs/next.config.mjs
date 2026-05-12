import createMDX from '@next/mdx'

// Turbopack (the default bundler in Next.js 16) requires loader options to be
// serializable, so MDX plugins are passed as string references instead of
// imported functions. Next resolves the strings on its side.
const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [['remark-gfm']],
    rehypePlugins: [
      ['rehype-slug'],
      [
        'rehype-pretty-code',
        {
          theme: 'github-dark-dimmed',
          keepBackground: false,
        },
      ],
    ],
  },
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['ts', 'tsx', 'mdx'],
  transpilePackages: ['@pixelore/react'],
  reactStrictMode: true,
}

export default withMDX(nextConfig)
