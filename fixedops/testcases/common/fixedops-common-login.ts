// deno-lint-ignore-file
import { getBrowser } from "../../start-browser.ts";
import { testingAsserts as ts } from "../../deps-test.ts";
import { LoginSelectors as lg } from "../../selectors/login.ts";
import { switchController } from "../../continuous-quality/role-handle.ts";
import { Page } from "../../deps-test.ts";
import { startLogger } from "../../utilities/utils.ts";

const credentials = switchController();
const storeName: any = Deno.env.get("STORE");

const logger = await startLogger();
const errors: string[] = [];

async function fixedopsCommonLogin(
  site = "https://koeppel-demo.fixedops.cc/auth/login"
) {
  const browser = await getBrowser();
  const context = await browser.createIncognitoBrowserContext();
  const page: Page = await context.newPage();
  //const page: Page = await browser.newPage();
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.5112.79  Safari/537.36"
  );
  try {
    await page.setViewport({ width: 1280, height: 720 });
    const navigationPromise = page.waitForNavigation({
      waitUntil: ["domcontentloaded", "networkidle2", "load"],
    });

    page.setDefaultNavigationTimeout(0);
    await page.goto(site, { waitUntil: "networkidle2", timeout: 0 });
    await navigationPromise;
    await page.waitForTimeout(45000);
    logger.info("url opened");
    await page.waitForSelector(lg.signButton);
    await page.click(lg.signButton);
    await navigationPromise;
    await page.waitForTimeout(8000);
    logger.info("sign button clicked");
    const username = credentials.user;
    const password = credentials.pass;

    await page.waitForSelector(lg.signIn);
    await page.type(lg.username, username);
    logger.info("username entered");
    await page.waitForTimeout(2000);
    await page.type(lg.password, password);
    logger.info("password entered");

    await page.click(lg.signIn);
    await navigationPromise;
    await page.waitForTimeout(15000);
    logger.info("sign in button clicked");

    await page.click(lg.storeSelect);
    await page.waitForTimeout(4000);

    try {
      await page.click(lg.koeppelStore(storeName), { clickCount: 2 });
      await page.waitForTimeout(5000);
      logger.info(`${storeName} store selected`);
    } catch (error) {
      const storeErr = [];
      storeErr.push(error);
      const err = storeErr.find((x) => x === error);

      if (err) {
        logger.error("please provide valid store name as per role");
        errors.push("please provide valid store name as per role");

        ts.assert(
          errors.length == 0,
          `Error in  common login: ${errors.join("\n")}`
        );
      }
    }
    await page.click(lg.btnViewDashborad);
    await navigationPromise;
    await page.waitForTimeout(12000);
    logger.info("view dashboard button clicked");
    return { browser, page, navigationPromise };
  } catch (error) {
    throw error;
  }
}
export { fixedopsCommonLogin };
