const scrapeReelData = require('../scraper');

module.exports = async (req, res) => {
  const { url } = req.query;

  if (!url || !url.includes("instagram.com/reel")) {
    return res.status(400).json({ error: "Invalid or missing Instagram reel URL" });
  }

  try {
    const data = await scrapeReelData(url);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to scrape reel", details: err.message });
  }
};
