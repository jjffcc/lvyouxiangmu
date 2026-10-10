const fs = require("fs");
const path = require("path");

const dir = path.join(__dirname, "..", "assets");
const files = ["views-trip.js", "views-plan.js", "views-manage.js", "views-live.js"];

function countDoubleQuotes(line) {
  let count = 0;
  for (let i = 0; i < line.length; i++) {
    if (line[i] === '"' && line[i - 1] !== "\\") count++;
  }
  return count;
}

function repairLine(line) {
  let out = "";
  let state = "code";
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    const rest = line.slice(i);
    if (state === "code") {
      if (ch === '"') state = "dq";
      else if (ch === "'") state = "sq";
      out += ch;
      continue;
    }
    if (state === "sq") {
      if (ch === "'") state = "code";
      out += ch;
      continue;
    }
    // inside a double-quoted string
    if (ch === '"') {
      state = "code";
      out += ch;
      continue;
    }
    const looksLikeCloser = ch === "'" && /^'\s*(\+|;|,|\)|$)/.test(rest);
    if (looksLikeCloser) {
      state = "code";
      out += '"';
      continue;
    }
    out += ch;
  }
  return out;
}

let changed = 0;
for (const name of files) {
  const file = path.join(dir, name);
  const lines = fs.readFileSync(file, "utf8").split(/\r?\n/);
  const next = lines.map((line) => {
    if (countDoubleQuotes(line) % 2 === 0) return line;
    const fixed = repairLine(line);
    if (fixed !== line) changed++;
    return fixed;
  });
  fs.writeFileSync(file, next.join("\n"), "utf8");
}

console.log("repaired lines:", changed);

for (const name of files) {
  const file = path.join(dir, name);
  const lines = fs.readFileSync(file, "utf8").split(/\r?\n/);
  const bad = lines.filter((l) => countDoubleQuotes(l) % 2 !== 0).length;
  console.log(name, "unbalanced lines:", bad);
}
