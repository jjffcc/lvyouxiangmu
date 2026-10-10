// Compile the confirmed Markdown into a standalone, mobile-friendly document.
// Optional argument: path to an existing marked package. No browser dependency.
const fs = require('node:fs');
const path = require('node:path');
const { marked } = require(process.argv[2] || 'marked');
const prototypeDir = path.join(__dirname, '..');
const source = path.join(prototypeDir, '..', 'docs', '旅游规划产品总需求文档.md');
const markdown = fs.readFileSync(source, 'utf8');
const sections = Array.from(markdown.matchAll(/^## (\d+)\. (.+)$/gm), match => ({
  id: match[1], label: match[2].trim()
}));
let content = marked.parse(markdown, { gfm: true });
content = content.replace(/<h2>(\d+)\. /g, '<h2 id="section-$1">$1. ');
content = content.replace(/<table>/g, '<div class="table-wrap"><table class="table">')
  .replace(/<\/table>/g, '</table></div>');
const nav = sections.map(section => `<a href="#section-${section.id}">${section.id}. ${section.label}</a>`).join('\n');
const html = `<!doctype html>
<html lang="zh-CN"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="color-scheme" content="light">
<title>旅游规划产品总需求文档 v1.1 · 行迹</title>
<link rel="stylesheet" href="assets/styles.css?v=1.1-icons">
<style>
.doc-header { background: #fff; border-bottom: 1px solid var(--line); padding: 16px 24px; }
.doc-header-inner { max-width: 1320px; margin: auto; display: flex; flex-wrap: wrap; gap: 14px; align-items: center; justify-content: space-between; }
.doc-header strong { display: block; font-size: 18px; }
.doc-shell { max-width: 1320px; margin: 24px auto; padding: 0 24px; display: grid; grid-template-columns: 248px minmax(0,1fr); gap: 24px; align-items: start; }
.doc-nav { position: sticky; top: 24px; padding: 16px; background: #fff; border: 1px solid var(--line); border-radius: 12px; }
.doc-nav summary { font-weight: 600; margin-bottom: 10px; cursor: pointer; }
.doc-nav nav { display: grid; gap: 7px; font-size: 13px; }
.doc-main { min-width: 0; background: #fff; border: 1px solid var(--line); border-radius: 16px; padding: 32px; }
.doc-main h1 { font-size: clamp(24px, 4vw, 32px); margin-bottom: 18px; }
.doc-main h2 { font-size: 23px; padding-top: 20px; margin: 28px 0 14px; border-top: 1px solid var(--line); scroll-margin-top: 16px; }
.doc-main h3 { font-size: 18px; margin: 24px 0 12px; }
.doc-main p, .doc-main ul, .doc-main ol { margin-bottom: 14px; }
.doc-main .table-wrap { margin-bottom: 18px; }
.doc-main code { background: var(--blue-50); border-radius: 4px; padding: 2px 5px; font-size: .9em; }
.doc-main a { overflow-wrap: anywhere; }
.doc-main .table { min-width: 520px; }
@media(max-width: 900px) { .doc-shell { display: block; padding: 0 14px; margin: 14px auto; } .doc-nav { position: static; margin-bottom: 14px; } .doc-main { padding: 20px 16px; } .doc-header { padding: 14px; } .doc-header .chip-row { gap: 6px; } }
@media print { .doc-header, .doc-nav { display: none; } .doc-shell { display: block; margin: 0; padding: 0; } .doc-main { border: 0; padding: 0; } .doc-main .table { min-width: 0; } .table-wrap { overflow: visible; } body { background: #fff; font-size: 11px; } h2,h3 { break-after: avoid; } tr { break-inside: avoid; } }
</style></head><body>
<header class="doc-header"><div class="doc-header-inner"><div><strong>行迹 · 完整需求文档</strong><span class="small muted">v1.1 · 2026-10-05 修订 · 方案已确认，真实功能待实现</span></div>
<div class="chip-row"><a class="btn small" href="index.html#/trips" data-doc-icon="luggage">返回旅游规划</a><button class="btn small" id="print-document" data-doc-icon="printer">打印文档</button><a class="btn small" href="requirements.md" download="旅游规划产品总需求文档-v1.1.md" data-doc-icon="download">下载文档</a></div></div></header>
<div class="doc-shell"><aside class="doc-nav"><details open><summary>文档目录</summary><nav aria-label="文档章节">${nav}</nav></details></aside><main class="doc-main">${content}</main></div>
<script src="assets/icons.js?v=1.1-icons"></script><script>
document.querySelectorAll('[data-doc-icon]').forEach(function (control) {
  control.insertAdjacentHTML('afterbegin', window.travelIcon(control.getAttribute('data-doc-icon')));
  control.classList.add('with-icon');
});
document.getElementById('print-document').addEventListener('click', function () { window.print(); });
if (window.matchMedia('(max-width: 900px)').matches) document.querySelector('.doc-nav details').open = false;
</script></body></html>`;
fs.writeFileSync(path.join(prototypeDir, 'requirements.html'), html, 'utf8');
fs.writeFileSync(path.join(prototypeDir, 'requirements.md'), markdown, 'utf8');
console.log(`Generated requirements.html and requirements.md; ${sections.length} document sections.`);
