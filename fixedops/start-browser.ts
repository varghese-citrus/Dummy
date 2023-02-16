import { puppeteer } from "./deps-test.ts";

async function getBrowser() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--start-maximized", "--no-sandbox"],
    product: "chrome",
  });

  return browser;
}
export { getBrowser };
