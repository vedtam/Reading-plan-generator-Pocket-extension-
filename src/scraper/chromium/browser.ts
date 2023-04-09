import * as puppeteer from 'puppeteer';

export default class Browser {
  width = 1920;
  height = 1080;

  async open() {
    return await puppeteer.launch({
      headless: true,
      args: [
        `--window-size=${this.width},${this.height}`,
        '--incognito',
      ],
      // userDataDir: 'chrome_session',
      // executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    });
  }
  
  async newPage() {
    const browser = await this.open();
    const page = await browser?.newPage();

    await page?.setExtraHTTPHeaders({
      'Accept-Language': 'en-US,en;q=0.9',
    });
    await page?.setUserAgent(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36'
    );
    await page?.setViewport({
      width: this.width,
      height: this.height,
      deviceScaleFactor: 1
    });
    //Enable WebDriver
    await page?.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, 'webdriver', {
        get: () => false,
      });
    });

    return page;
  }
};

