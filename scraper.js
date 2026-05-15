const puppeteer =
  require("puppeteer-core");

async function scrapeReelData(reelUrl) {

  const browser =
    await puppeteer.launch({

      executablePath:
        process.env.PUPPETEER_EXECUTABLE_PATH,

      headless: true,

      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage"
      ]
    });

  try {

    const page =
      await browser.newPage();

    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/122.0.0.0 Safari/537.36"
    );

    await page.goto(reelUrl, {

      waitUntil: "networkidle2",

      timeout: 90000
    });

    const html =
      await page.content();

    return {

      likes:
        html.match(/"like_count":(\d+)/)?.[1]
        || "Hidden",

      comments:
        html.match(/"comment_count":(\d+)/)?.[1]
        || "Hidden",

      views:
        html.match(/"play_count":(\d+)/)?.[1]
        || "Hidden",

      author:
        html.match(/"username":"(.*?)"/)?.[1]
        || "Unknown",

      hashtags:
        [...html.matchAll(/#(\w+)/g)]
          .map(m => "#" + m[1])
          .slice(0, 20)
    };

  } finally {

    await browser.close();
  }
}

module.exports =
  scrapeReelData;