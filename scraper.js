const puppeteer = require('puppeteer-core');

const chromium =
  require('@sparticuz/chromium');

async function scrapeReelData(reelUrl) {

  const browser =
    await puppeteer.launch({

      args: chromium.args,

      defaultViewport:
        chromium.defaultViewport,

      executablePath:
        await chromium.executablePath(),

      headless: chromium.headless
    });

  try {

    const page =
      await browser.newPage();

    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/122.0.0.0 Safari/537.36'
    );

    await page.goto(reelUrl, {

      waitUntil: 'networkidle2',

      timeout: 90000
    });

    const html =
      await page.content();

    await browser.close();

    return {

      likes:
        html.match(/"like_count":(\\d+)/)?.[1]
        || 'Hidden',

      comments:
        html.match(/"comment_count":(\\d+)/)?.[1]
        || 'Hidden',

      views:
        html.match(/"play_count":(\\d+)/)?.[1]
        || 'Hidden',

      author:
        html.match(/"username":"(.*?)"/)?.[1]
        || 'Unknown',

      timestamp:
        new Date().toISOString()
    };

  } catch (err) {

    await browser.close();

    throw err;
  }
}

module.exports =
  scrapeReelData;