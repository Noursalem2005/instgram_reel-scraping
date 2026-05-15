const chromium = require('chrome-aws-lambda');
const puppeteer = require('puppeteer-core');

async function scrapeReelData(reelUrl) {
    const browser = await puppeteer.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath,
        headless: chromium.headless,
      }); 
      console.log("Executable path:", await chromium.executablePath);
  const page = await browser.newPage();
  await page.goto(reelUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });

  const result = await page.evaluate(() => {
    const getMeta = (name) => document.querySelector(`meta[property="${name}"]`)?.content;

    const description = getMeta('og:description') || "";
    const regexLikes = /([\d.,]+[KkMm]?) likes/;
    const regexComments = /([\d.,]+) comments/;
    const regexAuthor = /- (.*?) on/;
    const regexDate = /on ([A-Za-z]+ \d{1,2}, \d{4})/;

    const likes = description.match(regexLikes)?.[1] || null;
    const comments = description.match(regexComments)?.[1] || null;
    const author = description.match(regexAuthor)?.[1] || null;
    const postedDate = description.match(regexDate)?.[1] || null;

    const captionAndTags = description.split("‎: ")[1] || "";
    const caption = captionAndTags.split("\n")[0];
    const hashtags = captionAndTags.match(/#[^\s#]+/g) || [];

    return {
      likes,
      comments,
      author,
      postedDate,
      caption,
      hashtags,
      thumbnail: getMeta('og:image'),
      videoUrl: getMeta('og:video'),
      timestamp: new Date().toISOString()
    };
  });

  await browser.close();
  return result;
}

module.exports = scrapeReelData;
