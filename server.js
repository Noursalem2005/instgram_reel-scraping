const express = require('express');
const path = require('path');

const scrapeReelData = require('./scraper');

const app = express();

app.use(
  express.static(
    path.join(__dirname, 'public')
  )
);

app.get('/', (req, res) => {

  res.sendFile(
    path.join(__dirname, 'public', 'index.html')
  );
});

app.get('/api/analyze', async (req, res) => {

  const { url } = req.query;

  if (
    !url ||
    !url.includes('instagram.com/reel')
  ) {

    return res.status(400).json({
      error: 'Invalid Instagram reel URL'
    });
  }

  try {

    const data =
      await scrapeReelData(url);

    res.json(data);

  } catch (err) {

    res.status(500).json({
      error: 'Failed to scrape reel',
      details: err.message
    });
  }
});

const PORT =
  process.env.PORT || 8000;

app.listen(PORT, () => {

  console.log(
    `Server running on port ${PORT}`
  );
});