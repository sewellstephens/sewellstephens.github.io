# Build Process

Your website now uses a build system that generates static HTML from markdown files.

## How it works

1. **Markdown Content**: Store your content in markdown files:
   - About page: `src/content/about.md`
   - Blog posts: `src/blog/*.md`

2. **Build Script**: The `scripts/build-pages.js` script reads these markdown files and generates static HTML pages at:
   - `about/index.html` - About page
   - `blog/index.html` - Blog listing
   - `blog/{slug}/index.html` - Individual blog posts

3. **Static Output**: All HTML is pre-rendered with content directly in the HTML (not loaded via JavaScript), so search engines can crawl it perfectly.

## Commands

Build static pages:
```bash
npm run build
```

This generates all HTML pages from your markdown files. Run this before deploying to GitHub Pages.

## Adding content

### Update About Page
Edit `src/content/about.md` and run `npm run build`.

### Add a Blog Post
1. Create a new markdown file in `src/blog/` with frontmatter:
```markdown
---
title: Your Post Title
date: 2024-01-14
---

Your content here...
```

2. Run `npm run build` to generate the HTML pages

The blog will automatically pick up new posts and display them in reverse chronological order.
