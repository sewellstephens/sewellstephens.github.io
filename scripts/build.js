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
const IGNORE_DIRS = ["./anchorpenewersoft"];

// Clean dist folder except ignored dirs

const isDev = process.env.NODE_ENV === "development";

if (IGNORE_DIRS) {

}

// configure nunjucks to read from src/
nunjucks.configure(SRC, { autoescape: false });

// Helper: output clean URL file (folder/index.html instead of .html)
async function writeClean(distPath, html) {
  // distPath example: "./blog/my-post"
  await ensureDir(distPath);
  await outputFile(`${distPath}/index.html`, html);
}

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
      `,
      isDev: isDev
    });

    // Write clean URL style: /blog/slug/index.html
    await writeClean(`${DIST}/blog/${slug}`, rendered);

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
          <a href="/blog/${post.slug}/">${post.title}</a>
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
        ${pageNum > 1 ? `<a href="/blog/page-${pageNum - 1}/">← Prev</a>` : ""}
        ${pageNum < totalPages ? `<a href="/blog/page-${pageNum + 1}/">Next →</a>` : ""}
      </div>
    `;

    const rendered = nunjucks.render("layout.njk", {
      title: `Blog – Page ${pageNum}`,
      content: `<h3>Blog</h3>${list}${pagination}`,
      isDev: isDev
    });

    // Only page-1 is special: it's the root /blog/index.html
    if (pageNum === 1) {
      await writeClean(`${DIST}/blog`, rendered);
    } else {
      await writeClean(`${DIST}/blog/page-${pageNum}`, rendered);
    }
  }

  // ----- Render normal pages (.njk) -----
  const pageFiles = (await readdir(`${SRC}/pages`)).filter(f =>
    f.endsWith(".njk")
  );

  for (const file of pageFiles) {
    const raw = await readFile(`${SRC}/pages/${file}`, "utf8");

    const { data: front, content: njkContent } = matter(raw);

    let content = njkContent;

    // replace blog list
    if (content.includes(`id="blog-list"`)) {
      content = content.replace(
        `<div id="blog-list"></div>`,
        `<div id="blog-list" class="blog-posts">${blogListHTML(posts)}</div>`
      );
    }

    const title = front.title || file.replace(".njk", "");
    const rendered = nunjucks.render("layout.njk", {
      title,
      content,
      isDev: isDev
    });

    const slug = file.replace(".njk", "");
    const pageDir = `${DIST}/${slug}`;

    // only write clean url for non index.html
    if (slug === 'index') {
      await outputFile(`${DIST}/${file.replace(".njk", ".html")}`, rendered);
    }
    else {
      await writeClean(pageDir, rendered);
    }
  }

  console.log("Build complete with clean URLs!");
}

build();
