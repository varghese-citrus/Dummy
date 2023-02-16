import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { PartsScatterPlotSelectors as ps } from "../selectors/parts-scatter-plot.ts";
import { fixedopsCommonLogin } from "./common/fixedops-common-login.ts";
import { getRandomNumberBetween } from "../utilities/utils.ts";
import { startLogger } from "../utilities/utils.ts";

const logger = startLogger();
const errors: string[] = [];

function fixedOpsPartsScatterPlotTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[DEMO-TEST] ${site.name} FixedOps Parts Scatter Plot Chart Points Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "[DEMO-TEST]",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await partsScatterPlotPageChartPointsCheck(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Parts Scatter Plot Chart Points Test";
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

async function partsScatterPlotPageChartPointsCheck(baseURL: string) {
  let browser = null;
  try {
    const oBrowser = await fixedopsCommonLogin(baseURL);
    const page = oBrowser.page;
    browser = oBrowser.browser;
    const navigationPromise = oBrowser.navigationPromise;
    await page.waitForSelector(ps.partsMenu);
    await page.click(ps.partsMenu);
    logger.info("Parts Menu clicked");
    await page.waitForTimeout(5000);
    await page.waitForSelector(ps.scatterPlotMenu);
    await page.click(ps.scatterPlotMenu);
    await navigationPromise;
    await page.waitForTimeout(15000);
    logger.info("Parts scatter plot clicked!!!");
    const title = await page.title();
    if (title == "Scatter Plot - Parts Cost / Jobs / Markup") {
      logger.info("Scatter plot title verified");

      for (let i = 1; i <= 3; i++) {
        const tab = await page.$x(ps.monthTab(i));
        await tab[0].click();
        await navigationPromise;
        await page.waitForTimeout(15000);
        const tabName = await (
          await tab[0].getProperty("textContent")
        ).jsonValue();
        logger.info(`${tabName} tab clicked properly`);
        const num = await getRandomNumberBetween(1, 50);
        await page.waitForTimeout(2000);
        const highChartPointXpath = await page.$x(ps.highChartPoint(num));
        await page.waitForTimeout(2000);
        await highChartPointXpath[0].click();
        await navigationPromise;
        await page.waitForTimeout(10000);

        await page
          .waitForXPath(ps.pointPivotTable, {
            visible: true,
          })
          .then(() => {
            logger.info(
              `high chart point added to row table under ${tabName} tab`
            );
          })
          .catch(() => {
            logger.error(
              `high chart point not added to row table under ${tabName} tab`
            );
            errors.push(
              `high chart point not added to row table under ${tabName} tab`
            );
          });
        await page.waitForTimeout(15000);
        await page.waitForXPath(ps.rowItem, { visible: true });
        const rowItemXpath = await page.$x(ps.rowItem);
        await rowItemXpath[0].click();
        await navigationPromise;
        await page.waitForTimeout(15000);
        logger.info("Clicked the point in pivot table!!!");
        await page
          .waitForSelector(ps.roPopup, {
            visible: true,
            timeout: 4000,
          })
          .then(() => {
            logger.info(
              `high chart point popup display properly under ${tabName} tab`
            );
          })
          .catch(() => {
            logger.error(
              `high chart point popup not display properly under ${tabName} tab`
            );
            errors.push(
              `high chart point popup not display properly under ${tabName} tab`
            );
          });
        await page.waitForTimeout(10000);
        const popupCloseBtn = await page.$x(ps.roPopupCloseBtn);
        await popupCloseBtn[0].click();
        await navigationPromise;
        await page.waitForTimeout(10000);

        await page
          .waitForSelector(ps.roPopup, {
            visible: true,
            timeout: 4000,
          })
          .then(() => {
            logger.error(
              `high chart point popup not display properly under ${tabName} tab`
            );
            errors.push(
              `high chart point popup not display properly under ${tabName} tab`
            );
          })
          .catch(() => {
            logger.info(
              `high chart point popup display properly under ${tabName} tab`
            );
          });
        await page.waitForTimeout(2000);
      }
    } else {
      logger.error("Title verified failed");
      errors.push("Title verified failed");
    }
    ts.assert(
      errors.length == 0,
      `Error in Parts Scatter Plot Page: ${errors.join("\n")}`
    );
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsPartsScatterPlotTest();
