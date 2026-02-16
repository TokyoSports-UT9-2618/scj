import { createClient } from 'newt-client-js';

// 環境変数のチェック
if (!process.env.NEWT_SPACE_UID) {
  throw new Error('NEWT_SPACE_UID is not defined');
}
if (!process.env.NEWT_API_TOKEN) {
  throw new Error('NEWT_API_TOKEN is not defined');
}

// Newtクライアントの初期化
export const newtClient = createClient({
  spaceUid: process.env.NEWT_SPACE_UID,
  token: process.env.NEWT_API_TOKEN,
  apiType: 'cdn', // CDN API (高速・キャッシュあり)
});

// App UID
export const APP_UID = process.env.NEWT_APP_UID || 'website';

// モデルUID
export const MODELS = {
  NEWS: 'news',
  PAGE: 'page',
} as const;
