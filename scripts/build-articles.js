const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

const srcPath = path.join(__dirname, "../data/articles.yaml");
const distDir = path.join(__dirname, "../public/api");
const distPath = path.join(distDir, "articles.json");

try {
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  const fileContents = fs.readFileSync(srcPath, "utf8");
  const data = yaml.load(fileContents);

  if (Array.isArray(data)) {
    data.forEach((article) => {
      if (article.published_at) {
        article.published_at = new Date(article.published_at).toISOString();
      }
    });

    data.sort((a, b) => new Date(b.published_at) - new Date(a.published_at));
  }

  fs.writeFileSync(distPath, JSON.stringify(data, null, 2));
  console.log(`✅ Articles JSON generated at ${distPath}`);
} catch (e) {
  console.error("Failed to generate articles JSON:", e);
  process.exit(1);
}
