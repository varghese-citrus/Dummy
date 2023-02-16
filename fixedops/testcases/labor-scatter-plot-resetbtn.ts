import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { ScatterPlotLaborSelectors as sp } from "../selectors/scatter-plot-labor.ts";
import { LaborSelectors as ls } from "../selectors/labor-overview.ts";
import { fixedopsCommonLogin } from "./common/fixedops-common-login.ts";
import { getRandomNumberBetween, startLogger } from "../utilities/utils.ts";

const logger = startLogger();
const errors: string[] = [];

function fixedOpsScatterPlotLaborTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[DEMO-TEST] ${site.name} FixedOps Labor Scatter Plot Page Reset Button Test`,
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
          await scatterPlotLaborPageResetBtnTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Labor Scatter Plot Page Reset Button Test";
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

async function scatterPlotLaborPageResetBtnTest(baseURL: string) {
  let browser = null;

  try {
    const oBrowser = await fixedopsCommonLogin(baseURL);
    const page = oBrowser.page;
    browser = oBrowser.browser;
    const navigationPromise = oBrowser.navigationPromise;

    await page.waitForSelector(ls.labor);
    await page.click(ls.labor);
    logger.info("labor expand collapse link clicked");
    await page.waitForTimeout(4000);
    await page.waitForSelector(sp.scatterPlotLaborLink);
    await page.click(sp.scatterPlotLaborLink);
    await navigationPromise;
    await page.waitForTimeout(15000);
    logger.info("scatter plot labor link clicked");
    const title = await page.title();

    if (title == "Scatter Plot - Labor Hours / Jobs / ELR") {
      logger.info(
        "Scatter Plot - Labor Hours / Jobs / ELR title verify success"
      );
      for (let i = 1; i <= 3; i++) {
        await page.click(sp.getTab(i));
        await navigationPromise;
        await page.waitForTimeout(8000);
        logger.info(`scatter plot tab ${i} clicked`);

        await page.waitForSelector(sp.resetBtn);
        await page.click(sp.resetBtn);
        await page.waitForTimeout(25000);
        logger.info("reset layout button clicked and row table refreshed");

        const tabname = await page.$eval(
          sp.getTab(i),
          (element) => element.textContent
        );

        const num = await getRandomNumberBetween(1, 50);
        await page.waitForTimeout(2000);

        const highChartPointXpath = await page.$x(sp.highChartPoint(num));
        await page.waitForTimeout(2000);

        await highChartPointXpath[0].click();
        await page.waitForTimeout(15000);
        logger.info("chart point clicked");

        await page
          .waitForXPath(sp.itemRow, {
            visible: true,
          })
          .then(() => {
            logger.info(
              `high chart point added to row table under ${tabname} tab`
            );
          })
          .catch(() => {
            logger.error(
              `high chart point not added to row table under ${tabname} tab`
            );
            errors.push(
              `high chart point not added to row table under ${tabname} tab`
            );
          });
        await page.waitForTimeout(5000);
        const resetBtnXpath = await page.$x(sp.resetBtnXpath);
        await page.evaluate((element) => {
          element.scrollIntoView(
            0,
            parseInt(element.getBoundingClientRect().y)
          );
        }, resetBtnXpath[0]);
        await page.waitForTimeout(4000);
        await page.waitForSelector(sp.resetButton);
        await page.click(sp.resetButton);
        await page.waitForTimeout(25000);
        logger.info("reset layout button clicked");

        await page
          .waitForXPath(sp.itemRow, {
            visible: true,
          })
          .then(() => {
            logger.error(
              `reset button functionality check failed under ${tabname} tab`
            );
            errors.push(
              `reset button functionality check failed under ${tabname} tab`
            );
          })
          .catch(() => {
            logger.info(
              `reset button functionality check success under ${tabname} tab`
            );
          });
      }
    } else {
      logger.error(
        "Scatter Plot - Labor Hours / Jobs / ELR title verify failed"
      );
      errors.push(
        "Scatter Plot - Labor Hours / Jobs / ELR title verify failed"
      );
    }
    ts.assert(
      errors.length == 0,
      `Error in  Scatter Plot Labor Page: ${errors.join("\n")}`
    );
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsScatterPlotLaborTest();
