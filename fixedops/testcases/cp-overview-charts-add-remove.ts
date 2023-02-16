import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { CpSelectors as cps } from "../selectors/cp-overview.ts";
import { fixedopsCommonLogin } from "./common/fixedops-common-login.ts";
import { startLogger, getRandomNumberBetween } from "../utilities/utils.ts";

const logger = startLogger();
const errors: string[] = [];

function fixedOpsCpOverviewTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[AEC-FOCP-UI-FN-LD-0030] ${site.name} FixedOps CP Overview Page Charts Add Remove Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-UI-FN-LD-0030",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await cpOverviewPageChartsAddRemoveTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps CP Overview Page Charts Add Remove Test";
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

async function cpOverviewPageChartsAddRemoveTest(baseURL: string) {
  let browser = null;

  try {
    const oBrowser = await fixedopsCommonLogin(baseURL);
    const page = oBrowser.page;
    browser = oBrowser.browser;
    const navigationPromise = oBrowser.navigationPromise;

    await page.waitForSelector(cps.cpsummary);
    await page.click(cps.cpsummary);
    logger.info("cp expand collapse link clicked!!!");
    await page.waitForTimeout(5000);

    await page.waitForSelector(cps.cpOverview);
    await page.click(cps.cpOverview);
    await navigationPromise;
    await page.waitForTimeout(12000);

    const title = await page.title();
    if (title == "CP Summary Overview") {
      logger.info("CP Summary Overview title verify success");

      const canvas = [
        cps.canvas_1,
        cps.canvas_2,
        cps.canvas_3,
        cps.canvas_4,
        cps.canvas_5,
        cps.canvas_6,
      ];

      const num = await getRandomNumberBetween(0, 5);
      const canvas_id = canvas[num];
      await page.waitForTimeout(5000);
      const addRemBtn = await page.$x(cps.addTofavBtn(num + 1));
      await page.waitForTimeout(8000);

      const btnStatus: string = await (
        await addRemBtn[0].getProperty("title")
      ).jsonValue();

      const favLink = await page.$x(cps.favNavLink);
      if (btnStatus.includes("Add to Favorites")) {
        let addRemBtn = await page.$x(cps.addTofavBtn(num + 1));
        await addRemBtn[0].click();
        await page.waitForTimeout(5000);

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

        await page.waitForSelector(cps.cpOverview);
        await page.click(cps.cpOverview);
        await navigationPromise;
        await page.waitForTimeout(5000);

        addRemBtn = await page.$x(cps.addTofavBtn(num + 1));
        await addRemBtn[0].click();
        await page.waitForTimeout(5000);

        await favLink[0].click();
        await navigationPromise;
        await page.waitForTimeout(15000);

        await page
          .$eval(canvas_id, (elem) => {
            return elem.style.display !== "none";
          })
          .then(() => {
            logger.info(`chart ${num + 1} removed from favorite fail`);
            errors.push(`chart ${num + 1} removed from favorite fail`);
          })
          .catch(() => {
            logger.info(`chart ${num + 1} removed from favorite success`);
          });

        await page.waitForSelector(cps.cpOverview);
        await page.click(cps.cpOverview);
        await navigationPromise;
        await page.waitForTimeout(5000);
      } else if (btnStatus.includes("Remove from Favorites")) {
        await addRemBtn[0].click();
        await page.waitForTimeout(5000);

        await page.waitForTimeout(2000);
        await favLink[0].click();
        await navigationPromise;
        await page.waitForTimeout(15000);

        await page
          .$eval(canvas_id, (elem) => {
            return elem.style.display !== "none";
          })
          .then(() => {
            logger.info(`chart ${num + 1} removed from favorite fail`);
            errors.push(`chart ${num + 1} removed from favorite fail`);
          })
          .catch(() => {
            logger.info(`chart ${num + 1} removed from favorite success`);
          });
      }
    } else {
      logger.error("cp overview page title verify failed");
      errors.push("cp overview page title verify failed");
    }
    ts.assert(
      errors.length == 0,
      `Error in  CP Overview Page: ${errors.join("\n")}`
    );
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsCpOverviewTest();
