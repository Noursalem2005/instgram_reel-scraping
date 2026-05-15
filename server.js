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

  try {

    console.log('Incoming URL:', url);

    const data =
      await scrapeReelData(url);

    console.log('Scrape success');

    res.json(data);

  } catch (err) {

    console.error('SCRAPER ERROR:');
    console.error(err);

    res.status(500).json({
      error: err.message,
      stack: err.stack
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