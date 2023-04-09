import Browser from './browser.js';
import { Page } from 'puppeteer';
import { JSDOM } from 'jsdom';
import { Readability } from '@mozilla/readability';
import { Article } from '../trafilatura/scraper.js';

let page: Page | undefined;

export async function scrape(bookmarks: {[key: string]: any}) {
  const articles: Article[] = [];

  if (!page) {
    page = await new Browser().newPage();
  }

  for (const {item_id, given_title, resolved_title, resolved_url} of Object.values(bookmarks)) {
    try {
      await page.goto(resolved_url);
      console.log(`Scraping: ${resolved_url} ...`);
      
      const innerHTML = await page.$eval('body', (el: any) => el.innerHTML);
      const reader = new Readability(new JSDOM(innerHTML).window.document);
      const parsed = reader.parse();

      articles.push({
        id: item_id,
        url: resolved_url,
        title: given_title || resolved_title,
        text: parsed?.textContent,
        htmlContent: parsed?.content,
      });

    } catch (e: any) {
      console.error(e);
    }
  }

  page.browser().close();
  return articles;
}