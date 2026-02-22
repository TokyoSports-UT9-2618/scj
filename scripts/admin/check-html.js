const fs = require('fs');
const env = fs.readFileSync('.env.local','utf-8');
for (const line of env.split('\n')) {
  const t = line.trim(); if (!t || t.startsWith('#')) continue;
  const idx = t.indexOf('='); if (idx === -1) continue;
  process.env[t.slice(0,idx).trim()] = t.slice(idx+1).trim();
}
const { createClient } = require('contentful');
const { documentToHtmlString } = require('@contentful/rich-text-html-renderer');
const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
  environment: 'master',
});
async function main() {
  const res = await client.getEntries({ content_type: 'news', 'fields.projectCategory': 'seminars', limit: 1 });
  const item = res.items[0];
  const html = documentToHtmlString(item.fields.body);
  // 最初の1500文字だけ確認
  console.log(html.slice(0, 1500));
}
main();
