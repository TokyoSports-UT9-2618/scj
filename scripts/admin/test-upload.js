const fs = require('fs');
const http = require('http');
const path = require('path');

const pdfPath = path.join(__dirname, '../../public/R7第2回セミナー開催概要.pdf');
const pdfBuffer = fs.readFileSync(pdfPath);
const boundary = '----TestBoundary12345';

const body = Buffer.concat([
  Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="pdf"; filename="test.pdf"\r\nContent-Type: application/pdf\r\n\r\n`),
  pdfBuffer,
  Buffer.from(`\r\n--${boundary}--\r\n`)
]);

const req = http.request({
  hostname: 'localhost',
  port: 4000,
  path: '/analyze',
  method: 'POST',
  headers: {
    'Content-Type': `multipart/form-data; boundary=${boundary}`,
    'Content-Length': body.length
  }
}, (res) => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      if (json.ok) {
        console.log('✅ 解析成功:');
        console.log(JSON.stringify(json.parsed, null, 2));
      } else {
        console.error('❌ エラー:', json.error);
      }
    } catch(e) {
      console.error('JSONパース失敗:', data.slice(0, 500));
    }
  });
});

req.write(body);
req.end();
req.on('error', e => console.error('リクエストエラー:', e.message));
