const puppeteer = require('puppeteer');

async function scrapeReelData(reelUrl) {

  console.log('Launching browser...');

  const browser =
    await puppeteer.launch({

      headless: true,

      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--single-process'
      ]
    });

  try {

    console.log('Browser launched');

    const page =
      await browser.newPage();

    console.log('Page created');

    await page.goto(reelUrl, {

      waitUntil: 'domcontentloaded',

      timeout: 60000
    });

    console.log('Instagram loaded');

    const title =
      await page.title();

    console.log('PAGE TITLE:', title);

    await browser.close();

    return {

      success: true,

      title,

      timestamp:
        new Date().toISOString()
    };

  } catch (err) {

    console.log('SCRAPER INNER ERROR');
    console.log(err);

    await browser.close();

    throw err;
  }
}

module.exports = scrapeReelData;