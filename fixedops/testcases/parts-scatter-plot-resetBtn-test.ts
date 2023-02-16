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
      name: `[DEMO-TEST] ${site.name} FixedOps Parts Scatter Plot Reset Button Test`,
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
          await partsScatterPlotChartResetButtonCheck(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Parts Scatter Plot Reset Button Test";
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
async function partsScatterPlotChartResetButtonCheck(baseURL: string) {
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
    logger.info("Parts scatter plot clicked");
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
        await page.waitForSelector(ps.resetBtn);
        await page.click(ps.resetBtn);
        await page.waitForTimeout(25000);
        logger.info("reset layout button clicked and row table refreshed");
        const num = await getRandomNumberBetween(1, 50);
        await page.waitForTimeout(2000);
        const highChartPointXpath = await page.$x(ps.highChartPoint(num));
        await page.waitForTimeout(2000);
        await highChartPointXpath[0].click();
        await page.waitForTimeout(25000);
        logger.info("chart point clicked");
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
        const resetBtnXpath = await page.$x(ps.resetButton);
        await page.waitForTimeout(5000);
        await page.evaluate((element) => {
          element.scrollIntoView(
            0,
            parseInt(element.getBoundingClientRect().y)
          );
        }, resetBtnXpath[0]);
        await page.waitForTimeout(5000);
        await page.waitForSelector(ps.resetBtn);
        await page.click(ps.resetBtn);
        await page.waitForTimeout(25000);
        logger.info("reset layout button clicked");
        await page
          .waitForXPath(ps.pointPivotTable, {
            visible: true,
          })
          .then(() => {
            logger.error(
              `reset button functionality check failed under ${tabName} tab`
            );
            errors.push(
              `reset button functionality check failed under ${tabName} tab`
            );
          })
          .catch(() => {
            logger.info(
              `reset button functionality check success under ${tabName} tab`
            );
          });
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
