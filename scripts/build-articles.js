const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

const dataDir = path.join(__dirname, "../data");
const distDir = path.join(__dirname, "../public/api");

function loadYaml(fileName) {
  return yaml.load(fs.readFileSync(path.join(dataDir, fileName), "utf8"));
}

function writeJson(fileName, data) {
  const dest = path.join(distDir, fileName);
  fs.writeFileSync(dest, JSON.stringify(data, null, 2));
  console.log(`✅ ${fileName} generated at ${dest}`);
}

try {
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  // Articles API
  const articles = loadYaml("articles.yaml");
  if (Array.isArray(articles)) {
    articles.forEach((article) => {
      if (article.published_at) {
        article.published_at = new Date(article.published_at).toISOString();
      }
    });

    articles.sort((a, b) => new Date(b.published_at) - new Date(a.published_at));
  }
  writeJson("articles.json", articles);

  // Tags API
  const tags = loadYaml("tags.yaml");
  writeJson("tags.json", tags);
} catch (e) {
  console.error("Failed to generate JSON:", e);
  process.exit(1);
}
