const puppeteer = require('puppeteer');

async function scrapeReelData(reelUrl) {

  const browser = await puppeteer.launch({

    headless: true,

    executablePath:
      process.env.PUPPETEER_EXECUTABLE_PATH ||
      puppeteer.executablePath(),

    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--single-process'
    ]
  });

  try {

    const page = await browser.newPage();

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

    const data = await page.evaluate(() => {

      const scripts =
        Array.from(document.querySelectorAll('script'));

      let raw = '';

      for (const script of scripts) {

        if (
          script.textContent.includes('like_count')
        ) {

          raw = script.textContent;

          break;
        }
      }

      const likeMatch =
        raw.match(/"like_count":(\\d+)/);

      const commentMatch =
        raw.match(/"comment_count":(\\d+)/);

      const viewMatch =
        raw.match(/"play_count":(\\d+)/);

      const ownerMatch =
        raw.match(/"username":"(.*?)"/);

      const captionMatch =
        raw.match(/"text":"(.*?)"/);

      const imageMatch =
        raw.match(/"display_url":"(.*?)"/);

      return {

        likes:
          likeMatch?.[1] || 'Hidden',

        comments:
          commentMatch?.[1] || 'Hidden',

        views:
          viewMatch?.[1] || 'Hidden',

        author:
          ownerMatch?.[1] || 'Unknown',

        caption:
          captionMatch?.[1] || null,

        thumbnail:
          imageMatch?.[1]
            ?.replace(/\\\\u0026/g, '&')
          || null,

        timestamp:
          new Date().toISOString()
      };
    });

    await browser.close();

    return data;

  } catch (err) {

    await browser.close();

    throw err;
  }
}

module.exports = scrapeReelData;