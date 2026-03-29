import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer';
import express from 'express';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST_DIR = path.resolve(__dirname, '../dist');

async function prerender() {
  const routesPath = path.resolve(__dirname, '../sitemap-routes.json');
  if (!fs.existsSync(routesPath)) {
    console.error('sitemap-routes.json not found! Run generate-sitemap-routes.js first.');
    process.exit(1);
  }

  const routes = JSON.parse(fs.readFileSync(routesPath, 'utf-8'));
  console.log(`Starting prerender for ${routes.length} routes...`);

  const app = express();
  app.use(express.static(DIST_DIR));
  app.use((req, res) => res.sendFile(path.join(DIST_DIR, 'index.html')));

  const server = app.listen(0, async () => {
    const port = server.address().port;
    const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--disable-setuid-sandbox'] });

    try {
      for (const route of routes) {
        console.log(`Pre-rendering ${route}...`);
        const page = await browser.newPage();
        
        // Suppress network requests to analytics/external sources to speed it up
        await page.setRequestInterception(true);
        page.on('request', (req) => {
          if (['image', 'stylesheet', 'font'].includes(req.resourceType()) || req.url().includes('google-analytics')) {
            req.abort();
          } else {
            req.continue();
          }
        });

        const url = `http://localhost:${port}${route}`;
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
        // Give React Helmet and Firebase 2 seconds to fetch data and update the DOM
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Replace innerHTML of main root
        const html = await page.content();
        
        // Find output path
        const fileDir = path.join(DIST_DIR, route);
        if (!fs.existsSync(fileDir)) {
          fs.mkdirSync(fileDir, { recursive: true });
        }
        
        const filePath = path.join(fileDir, 'index.html');
        fs.writeFileSync(filePath, html);
        await page.close();
      }

      console.log('✅ Pre-rendering complete!');
    } catch (e) {
      console.error('Prerender failed:', e);
      process.exitCode = 1;
    } finally {
      await browser.close();
      server.close();
    }
  });
}

prerender();
