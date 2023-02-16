import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { partsoverviewSelectors as po } from "../selectors/parts-overview.ts";
import { fixedopsCommonLogin } from "./common/fixedops-common-login.ts";
import { startLogger, getRandomNumberBetween } from "../utilities/utils.ts";

const logger = startLogger();
const errors: string[] = [];

function fixedOpsPartsOverviewTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[AEC-FOCP-UI-FN-LD-0161] ${site.name} FixedOps Parts Overview Charts Add Remove to Favorite Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "[AEC-FOCP-UI-FN-LD-0161]",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await partsOverviewAddRemoveToFavTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in Parts Overview Charts Add Remove to Favorite Test";
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

async function partsOverviewAddRemoveToFavTest(baseURL: string) {
  let browser = null;
  try {
    const oBrowser = await fixedopsCommonLogin(baseURL);
    const page = oBrowser.page;
    browser = oBrowser.browser;
    const navigationPromise = oBrowser.navigationPromise;
    await page.reload();
    await navigationPromise;
    await page.waitForTimeout(10000);
    const pMenu = await page.$x(po.partsMenuBtn);
    await pMenu[0].click();
    await navigationPromise;
    await page.waitForTimeout(4000);
    logger.info("parts menu clicked!!");
    const pOverview = await page.$x(po.partsOverviewBtn);
    await pOverview[0].click();
    await navigationPromise;
    await page.waitForTimeout(12000);
    logger.info("parts overview!!!");
    const canvas = [
      po.canvas_1,
      po.canvas_2,
      po.canvas_3,
      po.canvas_4,
      po.canvas_5,
      po.canvas_6,
      po.canvas_7,
      po.canvas_8,
      po.canvas_9,
    ];
    const num = await getRandomNumberBetween(0, 8);
    const canvas_id = canvas[num];
    await page.waitForTimeout(3000);
    let addRemBtn = await page.$x(po.favButton(num + 1));
    await page.waitForTimeout(5000);
    const btnStatus: string = await (
      await addRemBtn[0].getProperty("title")
    ).jsonValue();
    const favLink = await page.$x(po.favBar);
    if (btnStatus.includes("Add to Favorites")) {
      let addRemBtn = await page.$x(po.favButton(num + 1));
      await page.waitForTimeout(2000);
      await page.evaluate((element) => {
        element.scrollIntoView(0, parseInt(element.getBoundingClientRect().y));
      }, addRemBtn[0]);
      await page.waitForTimeout(4000);
      await addRemBtn[0].click();
      await page.waitForTimeout(5000);
      await favLink[0].click();
      await navigationPromise;
      await page.waitForTimeout(10000);
      await page
        .waitForSelector(canvas_id, {
          visible: true,
          timeout: 4000,
        })
        .then(() => {
          logger.info(`chart ${num + 1} added to favorite success`);
        })
        .catch(() => {
          logger.error(`chart ${num + 1} added to favorite fail`);
          errors.push(`chart ${num + 1} added to favorite fail`);
        });
      await page.waitForTimeout(5000);
      const pOverview = await page.$x(po.partsOverviewBtn);
      await pOverview[0].click();
      logger.info("parts overview clicked!!!");
      await page.waitForTimeout(12000);
      addRemBtn = await page.$x(po.favButton(num + 1));
      await addRemBtn[0].click();
      await page.waitForTimeout(5000);
      await favLink[0].click();
      await navigationPromise;
      await page.waitForTimeout(12000);
      logger.info("Favorite menu clicked");
      await page
        .waitForSelector(canvas_id, { visible: true, timeout: 4000 })
        .then(() => {
          logger.error(`chart ${num + 1} removed from favorite fail`);
          errors.push(`chart ${num + 1} removed from favorite fail`);
        })
        .catch(() => {
          logger.info(`chart ${num + 1} removed from favorite success`);
        });
      await pOverview[0].click();
      await page.waitForTimeout(12000);
      logger.info("parts overview clicked");
    } else if (btnStatus.includes("Remove from Favorites")) {
      await page.waitForTimeout(2000);
      await page.evaluate((element) => {
        element.scrollIntoView(0, parseInt(element.getBoundingClientRect().y));
      }, addRemBtn[0]);
      await page.waitForTimeout(4000);
      await addRemBtn[0].click();
      await page.waitForTimeout(5000);
      await favLink[0].click();
      await navigationPromise;
      await page.waitForTimeout(12000);
      await page
        .waitForSelector(canvas_id, { visible: true, timeout: 4000 })
        .then(() => {
          logger.error(`chart ${num + 1} removed from favorite fail`);
          errors.push(`chart ${num + 1} removed from favorite fail`);
        })
        .catch(() => {
          logger.info(`chart ${num + 1} removed from favorite success`);
        });
      const pOverview = await page.$x(po.partsOverviewBtn);
      await pOverview[0].click();
      await navigationPromise;
      await page.waitForTimeout(5000);
      logger.info("parts overview clicked!!!");
      addRemBtn = await page.$x(po.favButton(num + 1));
      await addRemBtn[0].click();
      await page.waitForTimeout(5000);

      await favLink[0].click();
      await navigationPromise;
      await page.waitForTimeout(10000);

      await page
        .waitForSelector(canvas_id, {
          visible: true,
          timeout: 4000,
        })
        .then(() => {
          logger.info(`chart ${num + 1} added to favorite success`);
        })
        .catch(() => {
          logger.error(`chart ${num + 1} added to favorite fail`);
          errors.push(`chart ${num + 1} added to favorite fail`);
        });
      await pOverview[0].click();
      await page.waitForTimeout(5000);
      logger.info("parts overview clicked");
    }
    ts.assert(
      errors.length == 0,
      `Error in Parts Overview: ${errors.join("\n")}`
    );
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsPartsOverviewTest();
