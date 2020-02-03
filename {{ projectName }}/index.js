const fs = require('fs');
const puppeteer = require('puppeteer');

let browser;

module.exports.initializer = async (context, callback) => {
  const options = {
    headless: true,
    args: [
      // error when launch(); No usable sandbox! Update your kernel
      '--no-sandbox',
      // error when launch(); Failed to load libosmesa.so
      '--disable-gpu',
      // freeze when newPage()
      '--single-process',
    ],
    dumpio: !!process.env.DEBUG,
  }
  try {
    browser = await puppeteer.launch(options);
  } catch (e) {
    callback(e, 'puppeteer launch error');
    return;
  }
  callback(null, '');
};

const screenshot = async (url) => {
  const page = await browser.newPage();
  const outputFile = '/tmp/screenshot.png';
  await page.goto(url);
  await page.screenshot({
    path: outputFile,
    fullPage: true
  });
  console.log(`The screenshot for url ${url} saved to ${outputFile}`);
  page.close();
  return outputFile;
};

module.exports.handler = async (req, resp, context) => {
  const pageUrl = req.queries["url"] || 'https://www.aliyun.com';
  console.log(`page url: ${pageUrl}`);
  const file = await screenshot(pageUrl);
  const filename = "screenshot.png";
  resp.setHeader('Context-Type', 'application/octet-stream');
  resp.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  resp.send(fs.createReadStream(file));
}