const https = require('https');
const fs = require('fs');
const path = require('path');

const VERCEL_TOKEN = process.env.VERCEL_TOKEN;
const PROJECT_ID = 'prj_C5btxM4cOPG3Fq7unS63JJSZlArb';

const htmlContent = fs.readFileSync('/home/runner/ai-agent-story/index.html');
const b64 = htmlContent.toString('base64');

const payload = JSON.stringify({
  name: 'ai-business-os-story',
  files: [{ file: 'index.html', data: b64, encoding: 'base64' }],
  project: PROJECT_ID,
  target: 'production'
});

const options = {
  hostname: 'api.vercel.com',
  path: '/v13/deployments',
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + VERCEL_TOKEN,
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(payload)
  }
};

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    try {
      const j = JSON.parse(data);
      console.log('Deploy ID:', j.id);
      console.log('Deploy URL:', j.url);
      console.log('Status:', j.readyState || j.status);
      if (j.error) console.log('Error:', JSON.stringify(j.error));
      // Save deploy ID for polling
      fs.writeFileSync('/tmp/deploy_id.txt', j.id || '');
      fs.writeFileSync('/tmp/deploy_url.txt', j.url || '');
    } catch(e) {
      console.log('Raw response:', data.substring(0, 500));
    }
  });
});

req.on('error', (e) => console.error('Request error:', e.message));
req.write(payload);
req.end();
