import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { FavoriteSelectors as fs } from "../selectors/favorite.ts";
import { fixedopsCommonLogin } from "./common/fixedops-common-login.ts";
import { getRandomNumberBetween, startLogger } from "../utilities/utils.ts";

const logger = startLogger();
const errors: string[] = [];

function fixedOpsFavoriteTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[AEC-FOCP-UI-FN-LD-0064] ${site.name} FixedOps Favorite Page Common Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-UI-FN-LD-0064",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await favoritePageCommonTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Favorite Page Common Test";
          execMetrics.labels.object.finalizeOn = new Date();
          metrics.record(execMetrics);
          await metrics.persistUitMetrics(metrics);
          throw error;
        }
        metrics.record(execMetrics);
        execMetrics.labels.object.finalizeOn = new Date();
        await metrics.persistUitMetrics(metrics);
      },
      sanitizeOps: false,
      sanitizeResources: false,
    });
  });
}

async function favoritePageCommonTest(baseURL: string) {
  let browser = null;

  try {
    const oBrowser = await fixedopsCommonLogin(baseURL);
    const page = oBrowser.page;
    browser = oBrowser.browser;
    const navigationPromise = oBrowser.navigationPromise;
    await navigationPromise;
    await page.waitForTimeout(5000);

    await page.waitForSelector(fs.favoriteLink);
    await page.click(fs.favoriteLink);
    await navigationPromise;
    await page.waitForTimeout(10000);
    logger.info("favorite link clicked");
    await page.reload();
    await navigationPromise;
    await page.waitForTimeout(10000);

    const title = await page.title();
    if (title == "MyFavorites") {
      logger.info("My favorites page title verify success");
      const [favHeading] = await page.$x(fs.favoriteHeading);
      await page.waitForTimeout(2000);
      const heading: string = await (
        await favHeading.getProperty("textContent")
      ).jsonValue();
      await page.waitForTimeout(2000);
      if (heading == "My Favorites") {
        logger.info("heading verify success");
        await page.waitForXPath(fs.dataAsOf);
        const x = await page.$x(fs.dataAsOf);
        const str: string = await (
          await x[0].getProperty("textContent")
        ).jsonValue();
        await page.waitForTimeout(2000);
        str.split(":")[0].includes("Data as of")
          ? logger.info("data as of field properly displayed")
          : [
              logger.info("data as of field not properly displayed"),
              errors.push("data as of field not properly displayed"),
            ];

        await page.waitForTimeout(2000);
        await page
          .waitForSelector(fs.resetBtn, {
            visible: true,
            timeout: 4000,
          })
          .then(() => {
            logger.info("reset layout button display properly");
          })
          .catch(() => {
            logger.info("reset layout button not properly displayed");
            errors.push("reset layout button not properly displayed");
          });
        await page.waitForTimeout(2000);
        await page
          .waitForXPath(fs.msgDiv, { visible: true, timeout: 4000 })
          .then(async () => {
            const [msgDiv] = await page.$x(fs.msgDiv);
            await page.waitForTimeout(2000);
            const msg: string = await (
              await msgDiv.getProperty("textContent")
            ).jsonValue();
            await page.waitForTimeout(2000);

            if (
              msg ==
              "There are no favorites added. Please click on  to add charts to favorites"
            ) {
              logger.info("info message verify success");
              await page.waitForTimeout(2000);

              await page.click(fs.laborLink);
              await page.waitForTimeout(4000);
              logger.info("labor nav link clicked");
              await page.waitForSelector(fs.laborOverviewLink);
              await page.click(fs.laborOverviewLink);
              await navigationPromise;
              await page.waitForTimeout(8000);
              logger.info("labor overview link clicked");

              const num = await getRandomNumberBetween(1, 10);
              let addRemBtn = await page.$x(fs.addTofavBtn(num));
              await page.waitForTimeout(5000);

              const btnStatus: string = await (
                await addRemBtn[0].getProperty("title")
              ).jsonValue();
              await page.waitForTimeout(2000);
              if (btnStatus.includes("Add to Favorites")) {
                logger.info("add/remove button status verify success");
                addRemBtn = await page.$x(fs.addTofavBtn(num));
                await addRemBtn[0].click();
                await page.waitForTimeout(5000);
                logger.info("add/remove button clicked");
                await page.click(fs.favoriteLink);
                await navigationPromise;
                await page.waitForTimeout(10000);
                logger.info("favorite link clicked");
                await page
                  .waitForXPath(fs.msgDiv, {
                    visible: true,
                    timeout: 2000,
                  })
                  .then(() => {
                    logger.error("charts add to favorite fail");
                    errors.push("charts add to favorite fail");
                  })
                  .catch(() => {
                    logger.info("chart added to favorite success");
                  });
              } else {
                logger.info("charts already added to favorite");
              }
            } else {
              logger.error("info message in favorite not as per expected");
              errors.push("info message in favorite not as per expected");
            }
          })
          .catch(() => {
            logger.warn(
              "info message element not present,chart already added to favorite"
            );
          });
      } else {
        logger.error("My favorite page heading verify failed");
        errors.push("My favorite page heading verify failed");
      }
    } else {
      logger.error("labor overview page title verify failed");
      errors.push("labor overview page title verify failed");
    }
    ts.assert(
      errors.length == 0,
      `Error in Favorite Page: ${errors.join("\n")}`
    );
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsFavoriteTest();
