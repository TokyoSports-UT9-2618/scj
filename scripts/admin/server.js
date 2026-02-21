#!/usr/bin/env node
/**
 * SCJ セミナー登録 管理サーバー
 * 使い方: node scripts/admin/server.js
 * ブラウザで http://localhost:4000 を開く
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// .env.local を読み込む
function loadEnv() {
  const envPath = path.join(__dirname, '../../.env.local');
  if (!fs.existsSync(envPath)) return;
  const lines = fs.readFileSync(envPath, 'utf-8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const idx = trimmed.indexOf('=');
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    const val = trimmed.slice(idx + 1).trim();
    if (!process.env[key]) process.env[key] = val;
  }
}
loadEnv();

const PORT = 4000;
const SPACE_ID = process.env.CONTENTFUL_SPACE_ID;
const MANAGEMENT_TOKEN = process.env.CONTENTFUL_MANAGEMENT_TOKEN;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

// ─── PDF テキスト抽出 ────────────────────────────────────────────────────────
async function extractPdfText(buffer) {
  const pdfParse = require('pdf-parse');
  const data = await pdfParse(buffer);
  return data.text;
}


// ─── Claude API でフィールド解析 ────────────────────────────────────────────
async function analyzeWithClaude(pdfText) {
  if (!ANTHROPIC_API_KEY) {
    // APIキーなし → 簡易パース
    return simpleParse(pdfText);
  }

  const Anthropic = require('@anthropic-ai/sdk');
  const client = new Anthropic.default({ apiKey: ANTHROPIC_API_KEY });

  const prompt = `以下はスポーツコミッション研究会・セミナーの開催概要PDFから抽出したテキストです。
このテキストを解析して、以下のJSONフォーマットで情報を抽出してください。

テキスト:
${pdfText}

出力するJSONフォーマット（コードブロックなしで純粋なJSONのみ）:
{
  "title": "セミナーのタイトル（サブタイトル含む）",
  "date": "YYYY-MM-DD形式の開催日（不明な場合は空文字）",
  "venue": "開催場所",
  "summary": "開催趣旨の要約（100文字程度）",
  "speakers": [
    {"name": "氏名", "affiliation": "所属・役職", "topic": "演題"}
  ],
  "tags": ["検索用タグ（講演者名・キーワードなど）の配列"]
}

注意:
- dateは「令和X年Y月Z日」「R7.2.20」などを YYYY-MM-DD に変換
- 令和7年=2025年、令和8年=2026年
- tagsは講演者全員の名前 + セミナーのキーワードを含める
- speakersはコーディネーター・パネリストも含む`;

  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 2048,
    messages: [{ role: 'user', content: prompt }],
  });

  const responseText = message.content[0].text.trim();
  // JSON部分だけ抽出
  const jsonMatch = responseText.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('JSONの抽出に失敗しました');
  return JSON.parse(jsonMatch[0]);
}

// ─── APIキーなし時の簡易パース ───────────────────────────────────────────────
function simpleParse(text) {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  const title = lines[0] || 'タイトル未設定';

  // 全角数字 → 半角変換
  function toHalfNum(s) {
    return s.replace(/[０-９]/g, c => String.fromCharCode(c.charCodeAt(0) - 0xFEE0));
  }
  const textH = toHalfNum(text);

  // 日付パターン: 「日時：２月20日」（全角・半角混在に対応）
  let date = '';
  const jitsuMatch = textH.match(/日時[：:]\s*(\d{1,2})\s*月\s*(\d{1,2})\s*日/);
  // 年は「令和X年度」「令和X年」から取得（全角→半角変換済みテキストで）
  const reiwaMatch = textH.match(/令和\s*(\d+)\s*年/);
  if (jitsuMatch) {
    let year = new Date().getFullYear();
    if (reiwaMatch) {
      const reiwaNum = parseInt(reiwaMatch[1]);
      year = 2018 + reiwaNum;
      // 1〜3月の場合、年度の翌年（例：令和7年度の2月 = 2026年）
      const month = parseInt(jitsuMatch[1]);
      if (month <= 3) year = 2018 + reiwaNum + 1;
    }
    const month = String(jitsuMatch[1]).padStart(2, '0');
    const day = String(jitsuMatch[2]).padStart(2, '0');
    date = `${year}-${month}-${day}`;
  }

  // 会場
  const venueMatch = text.match(/開催場所[：:]\s*(.+)/);
  const venue = venueMatch ? venueMatch[1].trim() : '';

  // 講演者名（①②③④ + 「氏名：所属」パターン）
  const speakerMatches = [...text.matchAll(/[①②③④⑤⑥]\s*([\u4e00-\u9fa5ぁ-んァ-ン　\s]{2,10})[：:]/g)];
  const speakers = speakerMatches.map(m => ({ name: m[1].trim(), affiliation: '', topic: '' }));

  // タグ：講演者名 + キーワード抽出
  const tags = speakers.map(s => s.name);
  // 基調講演者も追加（「氏名：スポーツ庁」パターン）
  const keynotMatch = [...text.matchAll(/([\u4e00-\u9fa5ぁ-んァ-ン　]{2,6})\s*([\u4e00-\u9fa5]{2,4})\s*[：:]\s*スポーツ庁/g)];
  keynotMatch.forEach(m => {
    const name = (m[1] + m[2]).trim();
    if (!tags.includes(name)) tags.push(name);
  });

  return { title, date, venue, summary: '', speakers, tags };
}

// ─── Contentful に登録 ───────────────────────────────────────────────────────
async function postToContentful(fields) {
  const { title, date, venue, bodyText, tags, category } = fields;

  // slug 自動生成
  const now = new Date();
  const slug = `seminar-${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}-${Math.random().toString(36).slice(2,6)}`;

  // publishedAt: 開催日 or 今日
  const publishedAt = date
    ? new Date(date).toISOString()
    : now.toISOString();

  const body = {
    fields: {
      title:           { 'en-US': title },
      slug:            { 'en-US': slug },
      publishedAt:     { 'en-US': publishedAt },
      category:        { 'en-US': category || 'レポート' },
      projectCategory: { 'en-US': 'seminars' },
      projectTags:     { 'en-US': tags },
      metaDescription: { 'en-US': venue || '' },
      body: {
        'en-US': {
          nodeType: 'document',
          data: {},
          content: bodyText.split('\n\n').filter(Boolean).map(para => ({
            nodeType: 'paragraph',
            data: {},
            content: [{ nodeType: 'text', value: para.replace(/\n/g, ' '), marks: [], data: {} }]
          }))
        }
      }
    }
  };

  // エントリ作成
  const createRes = await fetch(
    `https://api.contentful.com/spaces/${SPACE_ID}/environments/master/entries`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MANAGEMENT_TOKEN}`,
        'Content-Type': 'application/vnd.contentful.management.v1+json',
        'X-Contentful-Content-Type': 'news',
      },
      body: JSON.stringify(body),
    }
  );

  if (!createRes.ok) {
    const err = await createRes.text();
    throw new Error(`Contentful エントリ作成失敗: ${err}`);
  }

  const entry = await createRes.json();
  const entryId = entry.sys.id;
  const version = entry.sys.version;

  // 公開
  const publishRes = await fetch(
    `https://api.contentful.com/spaces/${SPACE_ID}/environments/master/entries/${entryId}/published`,
    {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${MANAGEMENT_TOKEN}`,
        'X-Contentful-Version': String(version),
      },
    }
  );

  if (!publishRes.ok) {
    const err = await publishRes.text();
    throw new Error(`Contentful 公開失敗: ${err}`);
  }

  return entryId;
}

// ─── multipart/form-data パーサー ────────────────────────────────────────────
function parseMultipart(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', chunk => chunks.push(chunk));
    req.on('end', () => {
      const body = Buffer.concat(chunks);
      const contentType = req.headers['content-type'] || '';
      const boundaryMatch = contentType.match(/boundary=(.+)$/);
      if (!boundaryMatch) return reject(new Error('boundary not found'));

      const boundary = '--' + boundaryMatch[1];
      const parts = body.toString('binary').split(boundary);
      const files = {};
      const fields = {};

      for (const part of parts) {
        if (part === '--\r\n' || part.trim() === '--') continue;
        const [headerRaw, ...bodyParts] = part.split('\r\n\r\n');
        if (!headerRaw) continue;
        const bodyContent = bodyParts.join('\r\n\r\n').replace(/\r\n$/, '');
        const nameMatch = headerRaw.match(/name="([^"]+)"/);
        const filenameMatch = headerRaw.match(/filename="([^"]+)"/);
        if (!nameMatch) continue;
        const fieldName = nameMatch[1];
        if (filenameMatch) {
          files[fieldName] = Buffer.from(bodyContent, 'binary');
        } else {
          fields[fieldName] = bodyContent;
        }
      }
      resolve({ files, fields });
    });
    req.on('error', reject);
  });
}

// ─── JSON パーサー ───────────────────────────────────────────────────────────
function parseJson(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', c => chunks.push(c));
    req.on('end', () => {
      try { resolve(JSON.parse(Buffer.concat(chunks).toString())); }
      catch (e) { reject(e); }
    });
    req.on('error', reject);
  });
}

// ─── HTTP サーバー ───────────────────────────────────────────────────────────
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);

  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.writeHead(204); return res.end(); }

  // ── GET / → HTML管理画面
  if (req.method === 'GET' && url.pathname === '/') {
    const htmlPath = path.join(__dirname, 'index.html');
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    return res.end(fs.readFileSync(htmlPath));
  }

  // ── POST /analyze → PDFアップロード → 解析
  if (req.method === 'POST' && url.pathname === '/analyze') {
    try {
      const { files } = await parseMultipart(req);
      if (!files.pdf) throw new Error('PDFファイルが見つかりません');

      const pdfText = await extractPdfText(files.pdf);
      const parsed = await analyzeWithClaude(pdfText);

      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ ok: true, parsed, rawText: pdfText }));
    } catch (e) {
      res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ ok: false, error: e.message }));
    }
    return;
  }

  // ── POST /submit → Contentfulに登録
  if (req.method === 'POST' && url.pathname === '/submit') {
    try {
      const data = await parseJson(req);
      const entryId = await postToContentful(data);
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ ok: true, entryId }));
    } catch (e) {
      res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ ok: false, error: e.message }));
    }
    return;
  }

  res.writeHead(404);
  res.end('Not found');
});

server.listen(PORT, () => {
  console.log(`\n✅ SCJ 管理サーバー起動中`);
  console.log(`   http://localhost:${PORT} をブラウザで開いてください\n`);
  console.log(`   Contentful Space: ${SPACE_ID}`);
  console.log(`   Claude API: ${ANTHROPIC_API_KEY ? '✅ 設定済み（自動解析ON）' : '⚠️  未設定（手動入力モード）'}\n`);
});
