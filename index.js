const express = require('express');
const { CheerioCrawler } = require('crawlee');

const app = express();
const PORT = process.env.PORT || 3000;

// Dynamic endpoint: pass ?url=<website-url> to scrape
app.get('/products', async (req, res) => {
    const url = req.query.url;
    if (!url) return res.status(400).send({ error: 'No URL provided' });

    const results = [];

    const crawler = new CheerioCrawler({
        async requestHandler({ $, request }) {
            // Default selectors — can override per domain
            let productSelector = '.product-item';
            let nameSelector = '.product-title';
            let priceSelector = '.price';
            let stockSelector = '.sold-out';

            // Domain-specific overrides (example: PerfumeLand)
            if (url.includes('perfumeland.co.za')) {
                productSelector = '.product-item';
                nameSelector = '.product-title';
                priceSelector = '.price';
                stockSelector = '.sold-out';
            }

            $(productSelector).each((i, el) => {
                results.push({
                    name: $(el).find(nameSelector).text().trim(),
                    price: $(el).find(priceSelector).text().trim(),
                    stock: $(el).find(stockSelector).length > 0 ? 'Out of Stock' : 'In Stock',
                    url: url.replace(/\/$/, '') + $(el).find('a').attr('href'),
                });
            });
        },
    });

    try {
        await crawler.run([url]);
        res.json(results);
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

app.listen(PORT, () => console.log(`Dynamic scraper running on port ${PORT}`));

const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello from Crawlee on Railway!");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

