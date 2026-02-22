import fs from "fs";
import path from "path";

const dirs = ["content/blog", "content/guides", "content/areas", "content/resources", "content/pillars"];

function fixLine(line) {
  const match = line.match(/^(\w+):\s+(.+)$/);
  if (!match) return line;
  
  const [, key, value] = match;
  if (value.startsWith('"') || value.startsWith("'")) return line;
  if (value.includes(":")) return `${key}: "${value.replace(/"/g, "'")}"`;
  
  return line;
}

for (const dir of dirs) {
  if (!fs.existsSync(dir)) continue;
  
  const files = fs.readdirSync(dir).filter(f => f.endsWith(".md"));
  
  for (const file of files) {
    const fp = path.join(dir, file);
    const raw = fs.readFileSync(fp, "utf8");
    
    const parts = raw.split("---");
    if (parts.length < 3) continue;
    
    const fixedFrontmatter = parts[1]
      .split("\n")
      .map(fixLine)
      .join("\n");
    
    const fixed = ["", fixedFrontmatter, ...parts.slice(2)].join("---");
    
    if (fixed !== raw) {
      fs.writeFileSync(fp, fixed, "utf8");
      console.log("Fixed:", fp);
    }
  }
}

console.log("Done!");