const express = require("express");
const { CheerioCrawler } = require("crawlee");

const app = express();
const PORT = process.env.PORT || 3000;

// Simple route
app.get("/", (req, res) => {
  res.send("Crawlee app running on Railway!");
});

// Example scraping route
app.get("/scrape", async (req, res) => {
  let results = [];

  const crawler = new CheerioCrawler({
    async requestHandler({ $, request }) {
      results.push({
        title: $("title").text(),
        url: request.url
      });
    },
  });

  await crawler.run(["https://example.com"]);

  res.json(results);
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
