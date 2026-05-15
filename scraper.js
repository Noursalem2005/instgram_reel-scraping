const puppeteer = require('puppeteer-extra');

const StealthPlugin = require('puppeteer-extra-plugin-stealth');

puppeteer.use(StealthPlugin());

async function scrapeReelData(reelUrl) {

  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox'
    ]
  });

  try {

    const page = await browser.newPage();

    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/122.0.0.0 Safari/537.36'
    );

    await page.setViewport({
      width: 1366,
      height: 768
    });

    await page.goto(reelUrl, {
      waitUntil: 'networkidle2',
      timeout: 60000
    });

    await new Promise(resolve =>
      setTimeout(resolve, 6000)
    );

    const data = await page.evaluate(() => {

      const scripts =
        Array.from(document.querySelectorAll('script'));

      let raw = '';

      for (const script of scripts) {

        if (
          script.textContent.includes('like_count') ||
          script.textContent.includes('play_count')
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

      const videoMatch =
        raw.match(/"video_url":"(.*?)"/);

      const imageMatch =
        raw.match(/"display_url":"(.*?)"/);

      const captionMatch =
        raw.match(/"text":"(.*?)"/);

      const ownerMatch =
        raw.match(/"username":"(.*?)"/);

      const hashtags =
        captionMatch?.[1]?.match(/#[^\\s#]+/g) || [];

      return {

        likes:
          likeMatch?.[1] || 'Hidden',

        comments:
          commentMatch?.[1] || 'Hidden',

        views:
          viewMatch?.[1] || 'Hidden',

        caption:
          captionMatch?.[1]
            ?.replace(/\\\\n/g, ' ')
            ?.replace(/\\\\u0026/g, '&')
          || null,

        author:
          ownerMatch?.[1] || 'Unknown',

        hashtags,

        thumbnail:
          imageMatch?.[1]
            ?.replace(/\\\\u0026/g, '&')
          || null,

        videoUrl:
          videoMatch?.[1]
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