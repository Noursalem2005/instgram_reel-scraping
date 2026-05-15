const express =
  require("express");

const path =
  require("path");

const scrapeReelData =
  require("./scraper");

const app =
  express();

const PORT =
  process.env.PORT || 8080;

app.use(
  express.static(
    path.join(__dirname, "public")
  )
);

app.get("/api/analyze", async (req, res) => {

  try {

    const reelUrl =
      req.query.url;

    if (!reelUrl) {

      return res.status(400).json({

        error: "No URL provided"
      });
    }

    const data =
      await scrapeReelData(reelUrl);

    return res.json({

      success: true,

      ...data
    });

  } catch (err) {

    console.error(err);

    return res.status(500).json({

      success: false,

      error: err.message
    });
  }
});

app.get("*", (req, res) => {

  res.sendFile(
    path.join(__dirname, "public", "index.html")
  );
});

app.listen(PORT, () => {

  console.log(
    `Server running on port ${PORT}`
  );
});