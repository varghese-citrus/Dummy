import { getBrowser } from "./start-browser.ts";
import { Browser, Page } from "./deps-test.ts";

interface OpenBrowser {
  browser: Browser;
  page: Page;
}

async function openBrowser(
  site = "https://koeppel-demo.fixedops.cc/auth/login"
): Promise<OpenBrowser> {
  const browser = await getBrowser();
  try {
    const page = await browser.newPage();

    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3419.0 Safari/537.36"
    );
    // await page.setUserAgent(
    //   "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.88 Safari/537.36",
    // );

    page.setDefaultNavigationTimeout(120000);
    await page.setViewport({ width: 1920, height: 1080 });
    await page.goto(site, { waitUntil: "networkidle2", timeout: 0 });
    await page.waitForTimeout(1000);
    const cookieButton = await page.$(
      "body > article > div.cookie-bottom > div > div > div:nth-child(2) > div > form > button"
    );
    const buttonVisible = await cookieButton?.boundingBox();
    if (buttonVisible) {
      await cookieButton?.click().catch((e) => {
        console.log(e);
      });
    }
    await page.waitForTimeout(4000);
    return { browser, page };
  } catch (error) {
    console.error(error);
    await browser?.close();
    throw error;
  }
}
export { openBrowser };
