const setup = require('./lib/setup');
const fs = require('fs');
const ossClient = require('./lib/oss-client');

let browser;

module.exports.initializer = (context, callback) => {
  setup.getBrowser(context)
    .then(b => {
      browser = b
      callback(null, '');
    }).catch(callback);
};


module.exports.handler = (event, context, callback) => {
  let evtStr = event.toString();
  let pageUrl = evtStr !== '{}' ? evtStr : 'https://www.aliyun.com';
  console.log(`page url: ${pageUrl}`);
  screenshot(pageUrl)
    .then(file => uploadToOss(context, file))
    .then(url => callback(null, `The screenshot has been uploaded to ${url}`))
    .catch(callback);
};

async function screenshot(url) {
  const page = await browser.newPage();
  const outputFile = '/tmp/screenshot.png';
  await page.goto(url);
  await page.screenshot({
    path: outputFile,
    fullPage: true
  });
  return outputFile;
};

async function uploadToOss(context, file) {
  let client = ossClient(context);

  let result = await client.put('screenshot.png', file);
  await client.putACL('screenshot.png', 'public-read');

  return result.url.replace('-internal.aliyuncs.com/', '.aliyuncs.com/');
}