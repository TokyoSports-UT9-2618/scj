import { createClient } from 'contentful';

// 環境変数のチェック
const spaceId = process.env.CONTENTFUL_SPACE_ID;
const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN;

if (!spaceId && !process.env.USE_MOCK_DATA) {
  console.warn('⚠️ CONTENTFUL_SPACE_ID is not defined. Set USE_MOCK_DATA=true to use dummy data.');
}
if (!accessToken && !process.env.USE_MOCK_DATA) {
  console.warn('⚠️ CONTENTFUL_ACCESS_TOKEN is not defined. Set USE_MOCK_DATA=true to use dummy data.');
}

// Contentfulクライアントの初期化
export const contentfulClient = spaceId && accessToken ? createClient({
  space: spaceId,
  accessToken: accessToken,
}) : null;

// モックデータの使用フラグ
export const USE_MOCK_DATA = process.env.USE_MOCK_DATA === 'true' || !contentfulClient;
