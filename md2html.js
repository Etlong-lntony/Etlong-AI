const fs = require('fs');
const md = fs.readFileSync('D:/workbuddy/2026-11-24-14-39-52/GUIDE.md', 'utf8');

// escape & and < (but NOT > so markdown > links survive for image regex)
let text = md.replace(/&/g, '&amp;').replace(/</g, '&lt;');

const lines = text.split('\n');
let out = [];
let inCode = false;
let codeBuf = [];
let tableRows = [];

function flushTable() {
  if (tableRows.length) {
    out.push('<table>' + tableRows.join('') + '</table>');
    tableRows = [];
  }
}

function inline(s) {
  return s
    .replace(/!\[([^\]]*)\]\((https?:\/\/[^)\s]+)\)/g, '<img src="$2" alt="$1">')
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2">$1</a>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/`([^`]+)`/g, '<code>$1</code>');
}

for (let line of lines) {
  const t = line.trim();
  if (/^```/.test(t)) {
    if (inCode) {
      out.push('<pre><code>' + codeBuf.join('\n') + '</code></pre>');
      codeBuf = [];
      inCode = false;
    } else {
      flushTable();
      inCode = true;
    }
    continue;
  }
  if (inCode) { codeBuf.push(line); continue; }
  if (/^\|/.test(t) && t.endsWith('|')) {
    const cells = t.replace(/^\||\|$/g, '').split('|');
    if (cells.every(c => /^:?-+:?$/.test(c.trim()) || c.trim() === '')) continue;
    const tag = tableRows.length === 0 ? 'th' : 'td';
    tableRows.push('<tr>' + cells.map(c => `<${tag}>${inline(c.trim())}</${tag}>`).join('') + '</tr>');
    continue;
  }
  flushTable();
  if (t === '') { out.push(''); continue; }
  if (t === '---') { out.push('<hr/>'); continue; }
  if (t.startsWith('# ')) out.push('<h1>' + inline(t.slice(2)) + '</h1>');
  else if (t.startsWith('## ')) out.push('<h2>' + inline(t.slice(3)) + '</h2>');
  else if (t.startsWith('### ')) out.push('<h3>' + inline(t.slice(4)) + '</h3>');
  else if (t.startsWith('>')) {
    out.push('<blockquote>' + inline(t.replace(/^>\s?/, '')) + '</blockquote>');
  } else if (/^[-*] /.test(t)) out.push('<li>' + inline(t.slice(2)) + '</li>');
  else out.push('<p>' + inline(t) + '</p>');
}
flushTable();
if (inCode && codeBuf.length) out.push('<pre><code>' + codeBuf.join('\n') + '</code></pre>');
let html = out.join('\n');
// merge standalone <li> runs into <ul>
html = html.replace(/(?:\n<li>[\s\S]*?<\/li>)+/g, (m) => '\n<ul>' + m.replace(/^/g, '\n').replace(/<\/li>/g, '</li>') + '</ul>');

// Merge a standalone <p>图：...</p> that follows an <img> into a figure with caption.
// Pattern: <p><img ...></p>\n<p>图：...</p>  ->  <figure><img ...><figcaption>图：...</figcaption></figure>
html = html.replace(/<p>(<img[^>]*>)<\/p>\s*<p>(图：[^<]*)<\/p>/g,
  (m, img, cap) => `<figure>${img}<figcaption>${cap}</figcaption></figure>`);

const css = `
:root{
  --bg:#ffffff; --ink:#1f2328; --muted:#6a737d; --accent:#0969da;
  --line:#d0d7de; --soft:#f6f8fa; --code:#f6f8fa;
}
*{box-sizing:border-box}
body{
  font-family:"Segoe UI","Microsoft YaHei","PingFang SC",sans-serif;
  max-width:840px;margin:0 auto;padding:0 28px;line-height:1.75;
  color:var(--ink);background:var(--bg);
  font-size:14.5px;
}
/* Cover header */
h1{
  font-size:26px;font-weight:700;margin:0 0 4px;
  padding:26px 0 14px;border-bottom:2px solid var(--accent);
  color:#0b3b66;letter-spacing:.5px;
}
h2{
  font-size:18.5px;font-weight:700;margin-top:38px;margin-bottom:10px;
  padding:8px 0 8px 12px;border-left:4px solid var(--accent);
  background:linear-gradient(90deg,#f0f6ff 0%,#ffffff 70%);
  color:#0b3b66;border-radius:0 4px 4px 0;
}
h3{font-size:15.5px;font-weight:700;margin-top:22px;margin-bottom:8px;color:#24292f}
p{margin:10px 0}
ul,ol{margin:10px 0;padding-left:22px}
li{margin:5px 0}
a{color:var(--accent);text-decoration:none}
a:hover{text-decoration:underline}
code{
  background:var(--code);padding:2px 6px;border-radius:4px;
  font-size:12.5px;font-family:"Cascadia Code","Consolas","Courier New",monospace;
  color:#0550ae;
}
pre{
  background:#0d1117;color:#e6edf3;padding:14px 16px;border-radius:8px;
  overflow-x:auto;font-size:12.5px;line-height:1.6;margin:12px 0;
}
pre code{background:none;color:inherit;padding:0}
blockquote{
  border-left:4px solid #ffd33d;margin:12px 0;padding:10px 16px;
  color:#57606a;background:#fff8e6;border-radius:0 6px 6px 0;font-size:13.5px;
}
blockquote strong{color:#b58a0a}
table{border-collapse:collapse;width:100%;margin:14px 0;font-size:13px}
td,th{border:1px solid var(--line);padding:8px 12px;text-align:left}
th{background:var(--soft);font-weight:600}
tr:nth-child(even) td{background:#fafbfc}
figure{
  margin:16px 0;text-align:center;
}
figure img{
  max-width:100%;border:1px solid var(--line);border-radius:10px;
  box-shadow:0 2px 8px rgba(0,0,0,.08);
}
figcaption{
  margin-top:8px;font-size:12.5px;color:var(--muted);font-style:italic;
}
hr{border:none;border-top:1px solid var(--line);margin:30px 0}
/* print-friendly: keep figures and blocks on same page */
@page{margin:14mm 12mm}
@media print{
  body{max-width:none;padding:0;font-size:12.5px}
  h1{padding-top:0}
  figure,pre,table,blockquote{break-inside:avoid}
}
`;

const full = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>GitHub 个人档案库搭建指南</title><style>${css}</style></head><body>` + html + `</body></html>`;
fs.writeFileSync('D:/workbuddy/2026-11-24-14-39-52/GUIDE-build.html', full, 'utf8');
console.log('HTML written:', full.length, 'bytes');
