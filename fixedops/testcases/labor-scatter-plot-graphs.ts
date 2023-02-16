import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { ScatterPlotLaborSelectors as sp } from "../selectors/scatter-plot-labor.ts";
import { LaborSelectors as ls } from "../selectors/labor-overview.ts";
import { fixedopsCommonLogin } from "./common/fixedops-common-login.ts";
import { startLogger } from "../utilities/utils.ts";

const logger = startLogger();
const errors: string[] = [];

function fixedOpsScatterPlotLaborTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[AEC-FOCP-UI-FN-LD-0106] ${site.name} FixedOps Labor Scatter Plot Page Graphs Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-UI-FN-LD-0106",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await scatterPlotLaborPageGraphsTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Labor Scatter Plot Page Graphs Test";
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

async function scatterPlotLaborPageGraphsTest(baseURL: string) {
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
        await page.waitForTimeout(5000);
        const tabname = await page.$eval(
          sp.getTab(i),
          (element) => element.textContent
        );
        await page
          .waitForSelector(sp.chart, {
            visible: true,
            timeout: 4000,
          })
          .then(() => {
            logger.info(`chart display properly under ${tabname} tab`);
          })
          .catch(() => {
            logger.error(`chart not display properly under ${tabname} tab`);
            errors.push(`chart not display properly under ${tabname} tab`);
          });
        await page.waitForTimeout(2000);
        await page
          .waitForSelector(sp.rowTable, {
            visible: true,
            timeout: 4000,
          })
          .then(() => {
            logger.info(`row table display properly under ${tabname} tab`);
          })
          .catch(() => {
            logger.error(`row table not display properly under ${tabname} tab`);
            errors.push(`row table not display properly under ${tabname} tab`);
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
