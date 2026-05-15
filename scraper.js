const puppeteer = require('puppeteer');

async function scrapeReelData(reelUrl) {

  const browser = await puppeteer.launch({

    headless: true,

    executablePath:
      process.env.PUPPETEER_EXECUTABLE_PATH,

    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage'
    ]
  });

  try {

    const page =
      await browser.newPage();

    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/122.0.0.0 Safari/537.36'
    );

    await page.goto(reelUrl, {

      waitUntil: 'networkidle2',

      timeout: 60000
    });

    await new Promise(resolve =>
      setTimeout(resolve, 5000)
    );

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

      caption:
        html.match(/"text":"(.*?)"/)?.[1]
        || null,

      timestamp:
        new Date().toISOString()
    };

  } catch (err) {

    await browser.close();

    throw err;
  }
}

module.exports = scrapeReelData;