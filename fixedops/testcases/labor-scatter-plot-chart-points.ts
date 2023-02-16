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
      name: `[DEMO-TEST] ${site.name} FixedOps Labor Scatter Plot Page High Chart Points Test`,
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
          await scatterPlotLaborPageChartPointsTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Labor Scatter Plot Page High Chart Points Test";
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

async function scatterPlotLaborPageChartPointsTest(baseURL: string) {
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
    await page.waitForSelector(sp.scatterPlotLaborLink);
    await page.click(sp.scatterPlotLaborLink);
    await navigationPromise;
    await page.waitForTimeout(15000);
    logger.info("scatter plot labor link clicked!!!");

    const title = await page.title();

    if (title == "Scatter Plot - Labor Hours / Jobs / ELR") {
      logger.info(
        "Scatter Plot - Labor Hours / Jobs / ELR title verify success"
      );
      for (let i = 1; i <= 3; i++) {
        await page.click(sp.getTab(i));
        await navigationPromise;
        await page.waitForTimeout(12000);
        logger.info(`scatter plot tab ${i} clicked`);
        const tabName = await page.$eval(
          sp.getTab(i),
          (element) => element.textContent
        );
        const num = await getRandomNumberBetween(1, 50);
        await page.waitForTimeout(2000);
        const highChartPointXpath = await page.$x(sp.highChartPoint(num));
        await page.waitForTimeout(2000);
        await highChartPointXpath[0].click();
        await navigationPromise;
        await page.waitForTimeout(15000);

        await page
          .waitForXPath(sp.itemRow, {
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
        await page.waitForTimeout(4000);
        const rowItemXpath = await page.$x(sp.rowItem);
        await rowItemXpath[0].click();
        await navigationPromise;
        await page.waitForTimeout(10000);
        await page
          .waitForSelector(sp.popup, {
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
        await page.waitForTimeout(2000);
        const popupCloseBtn = await page.$x(sp.popupCloseBtn);
        await popupCloseBtn[0].click();
        await navigationPromise;
        await page.waitForTimeout(10000);

        await page
          .waitForSelector(sp.popup, { visible: true, timeout: 4000 })
          .then(() => {
            logger.error(
              `high chart point popup not collapse properly under ${tabName} tab`
            );
            errors.push(
              `high chart point popup not collapse properly under ${tabName} tab`
            );
          })
          .catch(() => {
            logger.info(
              `high chart point popup collapse properly under ${tabName} tab`
            );
          });
        await page.waitForTimeout(2000);
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
      `Error in Scatter Plot Labor Page: ${errors.join("\n")}`
    );
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsScatterPlotLaborTest();
