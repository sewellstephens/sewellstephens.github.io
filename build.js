import { marked } from "marked";
import matter from "gray-matter";
import nunjucks from "nunjucks";
import fsExtra from "fs-extra";

const {
    readdir,
    readFile,
    outputFile,
    ensureDir,
    remove
  } = fsExtra;

const SRC = "./src";
const DIST = ".";
const POSTS_PER_PAGE = 5;

// configure nunjucks to read from src/
nunjucks.configure(SRC, { autoescape: false });

async function build() {
  await ensureDir(`${DIST}/blog`);

  // ----- Load and parse blog posts -----
  const blogFiles = (await readdir(`${SRC}/blog`)).filter(f =>
    f.endsWith(".md")
  );

  let posts = [];

  for (const file of blogFiles) {
    const raw = await readFile(`${SRC}/blog/${file}`, "utf8");
    const { data: front, content } = matter(raw);

    const slug = file.replace(".md", "");
    const title = front.title || slug;
    const date = new Date(front.date || new Date());

    const htmlContent = marked(content);

    const rendered = nunjucks.render("layout2.njk", {
      title,
      content: `
        <article class="blog-post">
          <p class="post-date">${date.toDateString()}</p>
          ${htmlContent}
        </article>
      `
    });

    await outputFile(`${DIST}/blog/${slug}.html`, rendered);

    posts.push({ title, slug, date });
  }

  // ----- Sort by date -----
  posts.sort((a, b) => b.date - a.date);

  // Helper: generate blog list HTML
  function blogListHTML(data) {
    let list = `<ul class="blog-list">`;
    for (const post of data) {
      list += `
        <li class="blog-item">
          <a href="/blog/${post.slug}.html">${post.title}</a>
          <span class="blog-date">${post.date.toDateString()}</span>
        </li>`;
    }
    list += `</ul>`;
    return list;
  }

  // ----- Pagination -----
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);

  for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
    const start = (pageNum - 1) * POSTS_PER_PAGE;
    const pagePosts = posts.slice(start, start + POSTS_PER_PAGE);
    const list = blogListHTML(pagePosts);

    const pagination = `
      <div class="pagination">
        ${pageNum > 1 ? `<a href="page-${pageNum - 1}.html">← Prev</a>` : ""}
        ${pageNum < totalPages ? `<a href="page-${pageNum + 1}.html">Next →</a>` : ""}
      </div>
    `;

    const rendered = nunjucks.render("layout.njk", {
      title: `Blog – Page ${pageNum}`,
      content: `<h3>Blog</h3>${list}${pagination}`
    });

    if (pageNum > 1) {
        const pageDir = `./blog/page-${pageNum}`;
        await ensureDir(pageDir);
        await outputFile(`${pageDir}/index.html`, rendered);
    }
      
  }

  // ----- Render normal pages (.njk) -----
  const pageFiles = (await readdir(`${SRC}/pages`)).filter(f =>
    f.endsWith(".njk")
  );

  for (const file of pageFiles) {
    const raw = await readFile(`${SRC}/pages/${file}`, "utf8");

// Parse frontmatter
const { data: front, content: njkContent } = matter(raw);

let content = njkContent;

// replace blog list
if (content.includes(`id="blog-list"`)) {
  content = content.replace(
    `<div id="blog-list"></div>`,
    `<div id="blog-list" class="blog-posts">${blogListHTML(posts)}</div>`
  );
}

// Use custom title OR fallback to filename
const title = front.title || file.replace(".njk", "");

const rendered = nunjucks.render("layout.njk", {
  title,
  content
});

    await outputFile(`${DIST}/${file.replace(".njk", ".html")}`, rendered);
  }

  console.log("Build complete (Nunjucks + Markdown + Pagination + List Injection)!");
}

build();