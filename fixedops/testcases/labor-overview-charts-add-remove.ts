import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { LaborSelectors as ls } from "../selectors/labor-overview.ts";
import { fixedopsCommonLogin } from "./common/fixedops-common-login.ts";
import { startLogger, getRandomNumberBetween } from "../utilities/utils.ts";

const logger = startLogger();
const errors: string[] = [];

function fixedOpsLaborOverviewTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[DEMO-TEST] ${site.name} FixedOps Labor Overview Page Charts Add Remove Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "DEMO-TEST",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await laborOverviewPageChartsAddRemoveTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Labor Overview Page Charts Add Remove Test";
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

async function laborOverviewPageChartsAddRemoveTest(baseURL: string) {
  let browser = null;

  try {
    const oBrowser = await fixedopsCommonLogin(baseURL);
    const page = oBrowser.page;
    browser = oBrowser.browser;
    const navigationPromise = oBrowser.navigationPromise;

    await page.waitForSelector(ls.labor);
    await page.click(ls.labor);
    logger.info("labor expand collapse link clicked!!!");
    await page.waitForTimeout(4000);

    await page.waitForSelector(ls.laborOverview);
    await page.click(ls.laborOverview);
    await navigationPromise;
    await page.waitForTimeout(12000);

    const title = await page.title();

    if (title == "CP Labor Overview") {
      logger.info("CP Labor Overview title verify success");

      const canvas = [
        ls.canvas_1,
        ls.canvas_2,
        ls.canvas_3,
        ls.canvas_4,
        ls.canvas_5,
        ls.canvas_6,
        ls.canvas_7,
        ls.canvas_8,
        ls.canvas_9,
        ls.canvas_10,
        ls.canvas_11,
      ];

      const num = await getRandomNumberBetween(0, 10);
      const canvas_id = canvas[num];
      await page.waitForTimeout(5000);
      let addRemBtn = await page.$x(ls.addTofavBtn(num + 1));
      await page.waitForTimeout(5000);

      const btnStatus: string = await (
        await addRemBtn[0].getProperty("title")
      ).jsonValue();
      const favLink = await page.$x(ls.favNavLink);
      if (btnStatus.includes("Add to Favorites")) {
        let addRemBtn = await page.$x(ls.addTofavBtn(num + 1));
        await addRemBtn[0].click();
        await page.waitForTimeout(5000);

        await favLink[0].click();
        await navigationPromise;
        await page.waitForTimeout(15000);

        await page
          .waitForSelector(canvas_id, { visible: true, timeout: 4000 })
          .then(() => {
            logger.info(`chart ${num + 1} added to favorite success`);
          })
          .catch(() => {
            logger.error(`chart ${num + 1} added to favorite fail`);
            errors.push(`chart ${num + 1} added to favorite fail`);
          });

        await page.waitForSelector(ls.laborOverview);
        await page.click(ls.laborOverview);
        await navigationPromise;
        await page.waitForTimeout(8000);

        addRemBtn = await page.$x(ls.addTofavBtn(num + 1));
        await addRemBtn[0].click();
        await page.waitForTimeout(5000);

        await favLink[0].click();
        await navigationPromise;
        await page.waitForTimeout(15000);

        await page
          .waitForSelector(canvas_id, { visible: true, timeout: 4000 })
          .then(() => {
            logger.error(`chart ${num + 1} removed from favorite fail`);
            errors.push(`chart ${num + 1} removed from favorite fail`);
          })
          .catch(() => {
            logger.info(`chart ${num + 1} removed from favorite success`);
          });

        await page.waitForSelector(ls.laborOverview);
        await page.click(ls.laborOverview);
        await navigationPromise;
        await page.waitForTimeout(8000);
      } else if (btnStatus.includes("Remove from Favorites")) {
        await addRemBtn[0].click();
        await page.waitForTimeout(5000);

        await page.waitForTimeout(2000);
        await favLink[0].click();
        await navigationPromise;
        await page.waitForTimeout(15000);

        await page
          .waitForSelector(canvas_id, { visible: true, timeout: 4000 })
          .then(() => {
            logger.error(`chart ${num + 1} removed from favorite fail`);
            errors.push(`chart ${num + 1} removed from favorite fail`);
          })
          .catch(() => {
            logger.info(`chart ${num + 1} removed from favorite success`);
          });

        await page.waitForSelector(ls.laborOverview);
        await page.click(ls.laborOverview);
        await navigationPromise;
        await page.waitForTimeout(8000);

        addRemBtn = await page.$x(ls.addTofavBtn(num + 1));
        await addRemBtn[0].click();
        await page.waitForTimeout(5000);

        await page.waitForTimeout(2000);
        await favLink[0].click();
        await navigationPromise;
        await page.waitForTimeout(15000);

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
        await page.waitForSelector(ls.laborOverview);
        await page.click(ls.laborOverview);
        await navigationPromise;
        await page.waitForTimeout(8000);
      }
    } else {
      logger.error("labor overview page title verify failed");
      errors.push("labor overview page title verify failed");
    }

    ts.assert(
      errors.length == 0,
      `Error in Labor Overview Page: ${errors.join("\n")}`
    );
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsLaborOverviewTest();
