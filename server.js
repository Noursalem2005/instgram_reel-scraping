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

  try {

    const { url } = req.query;

    console.log('================================');
    console.log('NEW REQUEST');
    console.log('URL:', url);

    if (!url) {

      console.log('Missing URL');

      return res.status(400).json({
        error: 'Missing URL'
      });
    }

    const data =
      await scrapeReelData(url);

    console.log('SCRAPE SUCCESS');

    return res.json(data);

  } catch (err) {

    console.log('SCRAPER FAILED');
    console.log(err);
    console.log(err.message);
    console.log(err.stack);

    return res.status(500).json({

      error: err.message,

      stack: err.stack
    });
  }
});

const PORT =
  process.env.PORT || 8080;

app.listen(PORT, () => {

  console.log(
    `Server running on port ${PORT}`
  );
});