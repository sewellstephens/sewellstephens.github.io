import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { marked } from 'marked';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to parse markdown frontmatter
function parseFrontmatter(content) {
  const lines = content.split('\n');
  let metadata = {};
  let contentStart = 0;

  if (lines[0]?.trim() === '---') {
    contentStart = 1;
    for (let i = 1; i < lines.length; i++) {
      if (lines[i]?.trim() === '---') {
        contentStart = i + 1;
        break;
      }
      const colonIndex = lines[i].indexOf(':');
      if (colonIndex > -1) {
        const key = lines[i].substring(0, colonIndex).trim();
        const value = lines[i].substring(colonIndex + 1).trim();
        metadata[key] = value;
      }
    }
  }

  return {
    metadata,
    content: lines.slice(contentStart).join('\n')
  };
}

// Function to generate HTML wrapper
function generateHTML(title, htmlContent, isAbout = false) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <link rel="stylesheet" href="/site-assets/style.css">
    <title>${title} - Sewell Stephens</title>
    <link rel="icon" href="/site-assets/favicon.png" />
    <link rel="apple-touch-icon" href="/site-assets/favicon.png" />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap" rel="stylesheet">
    <!-- Responsiveness -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
    <main class="max-width">

        ${isAbout ? `<section class="profile-container">
            <img src="/site-assets/pic.webp" alt="Sewell Stephens" class="profile-pic">
            <h2>Hi, I'm Sewell Stephens</h2>
            <p>I'm a software dev and business owner with a passion for building products that help people live better lives.</p>
            <p>I'm the founder of <a href="https://anchorclick.com">Anchorclick</a>. </p>
        </section>

        <section class="nav-container">
            <ul>
                <li><a href="/">Home</a></li>
                <li><a href="/about/">About</a></li>
                <li><a href="/blog/">Blog</a></li>
            </ul>
        </section>

        <section class="social-links" style="margin-bottom: 20px;">
            <a href="https://x.com/sewell_stephens"><img src="/site-assets/icons/x.svg" width="20" height="20" alt="X" class="social-icon"></a>
            <a href="https://www.linkedin.com/in/sewellstephens104/"><img src="/site-assets/icons/linkedin.svg" width="20" height="20" alt="LinkedIn" class="social-icon"></a>
            <a href="https://github.com/SewellStephens"><img src="/site-assets/icons/github.svg" width="20" height="20" alt="GitHub" class="social-icon"></a>
        </section>` : `<nav class="blog-nav">
            <a href="/blog/">&#8592; Back to site</a>
        </nav>`}

        ${isAbout ? `<section class="backstory-container">${htmlContent}</section>` : `<article class="blog-post">${htmlContent}</article>`}

        <footer style="margin-top: 50px; margin-bottom: 10px;">
            <p style="font-size: 12px;">Copyright &copy; 2025 Sewell Stephens</p>
        </footer>
    </main>
</body>
</html>`;
}

// Build about page
function buildAboutPage() {
  const aboutPath = path.join(__dirname, '../src/content/about.md');
  if (fs.existsSync(aboutPath)) {
    const content = fs.readFileSync(aboutPath, 'utf-8');
    const { content: markdownContent } = parseFrontmatter(content);
    const htmlContent = marked.parse(markdownContent);
    const html = generateHTML('About', htmlContent, true);
    
    fs.writeFileSync(
      path.join(__dirname, '../about/index.html'),
      html,
      'utf-8'
    );
    console.log('✓ Built about/index.html');
  } else {
    console.warn('Warning: src/content/about.md not found');
  }
}

// Build blog post pages
function buildBlogPosts() {
  const blogDir = path.join(__dirname, '../src/blog');
  if (!fs.existsSync(blogDir)) {
    console.warn('Warning: src/blog directory not found');
    return;
  }

  const files = fs.readdirSync(blogDir).filter(f => f.endsWith('.md'));
  
  files.forEach(file => {
    const filePath = path.join(blogDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const { metadata, content: markdownContent } = parseFrontmatter(content);
    const htmlContent = marked.parse(markdownContent);
    
    const slug = file.replace(/\.md$/, '');
    const title = metadata.title || slug;
    const html = generateHTML(title, htmlContent, false);
    
    const outputDir = path.join(__dirname, `../blog/${slug}`);
    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(
      path.join(outputDir, 'index.html'),
      html,
      'utf-8'
    );
    console.log(`✓ Built blog/${slug}/index.html`);
  });
}

// Build blog index page
function buildBlogIndex() {
  const blogDir = path.join(__dirname, '../src/blog');
  if (!fs.existsSync(blogDir)) {
    return;
  }

  const files = fs.readdirSync(blogDir).filter(f => f.endsWith('.md'));
  
  const posts = files.map(file => {
    const filePath = path.join(blogDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const { metadata } = parseFrontmatter(content);
    const slug = file.replace(/\.md$/, '');
    
    return {
      slug,
      title: metadata.title || slug,
      date: metadata.date ? new Date(metadata.date) : new Date()
    };
  }).sort((a, b) => b.date - a.date);

  const postsList = posts.map(post => {
    const dateStr = post.date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: '2-digit'
    });
    return `        <li class="blog-item">
            <a href="/blog/${post.slug}/">${post.title}</a>
            <span class="blog-date">${dateStr}</span>
        </li>`;
  }).join('\n');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <link rel="stylesheet" href="/site-assets/style.css">
    <title>Blog - Sewell Stephens</title>
    <link rel="icon" href="/site-assets/favicon.png" />
    <link rel="apple-touch-icon" href="/site-assets/favicon.png" />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap" rel="stylesheet">
    <!-- Responsiveness -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
    <main class="max-width">
        <section class="profile-container">
            <img src="/site-assets/pic.webp" alt="Sewell Stephens" class="profile-pic">
            <h2>Hi, I'm Sewell Stephens</h2>
            <p>I'm a software dev and business owner with a passion for building products that help people live better lives.</p>
            <p>I'm the founder of <a href="https://anchorclick.com">Anchorclick</a>. </p>
        </section>

        <section class="nav-container">
            <ul>
                <li><a href="/">Home</a></li>
                <li><a href="/about/">About</a></li>
                <li><a href="/blog/">Blog</a></li>
            </ul>
        </section>

        <section class="social-links" style="margin-bottom: 20px;">
            <a href="https://x.com/sewell_stephens"><img src="/site-assets/icons/x.svg" width="20" height="20" alt="X" class="social-icon"></a>
            <a href="https://www.linkedin.com/in/sewellstephens104/"><img src="/site-assets/icons/linkedin.svg" width="20" height="20" alt="LinkedIn" class="social-icon"></a>
            <a href="https://github.com/SewellStephens"><img src="/site-assets/icons/github.svg" width="20" height="20" alt="GitHub" class="social-icon"></a>
        </section>

        <div id="blog-list" class="blog-posts">
            <ul class="blog-list">
${postsList}
            </ul>
        </div>

        <footer style="margin-top: 50px; margin-bottom: 10px;">
            <p style="font-size: 12px;">Copyright &copy; 2025 Sewell Stephens</p>
        </footer>
    </main>
</body>
</html>`;

  fs.writeFileSync(
    path.join(__dirname, '../blog/index.html'),
    html,
    'utf-8'
  );
  console.log('✓ Built blog/index.html');
}

// Run all build tasks
console.log('Building static pages from markdown...\n');
buildAboutPage();
buildBlogPosts();
buildBlogIndex();
console.log('\n✓ Build complete!');
