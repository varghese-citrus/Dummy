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
      name: `[AEC-FOCP-UI-FN-LD-0109] ${site.name} FixedOps Labor Scatter Plot Page View Detail Button Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-UI-FN-LD-0109",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await scatterPlotLaborPageTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Labor Scatter Plot Page View Detail Button Test";
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

async function scatterPlotLaborPageTest(baseURL: string) {
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
        await page.waitForSelector(sp.getTab(i));
        await page.click(sp.getTab(i));
        await page.waitForTimeout(8000);
        const tabname = await page.$eval(
          sp.getTab(i),
          (element) => element.textContent
        );
        await page.waitForSelector(sp.viewDetailBtn, {
          visible: true,
        });
        await page.waitForTimeout(2000);
        const viewDetailButton = await page.waitForSelector(sp.viewDetailBtn, {
          visible: true,
          timeout: 4000,
        });
        if (viewDetailButton != null) {
          await page.click(sp.viewDetailBtn);
          await navigationPromise;
          await page.waitForTimeout(8000);
          const title = await page.title();
          title == "Overview"
            ? logger.info(`view detail button working fine under ${tabname}`)
            : [
                logger.error(
                  `view detail button working fine under ${tabname}`
                ),
                errors.push(`view detail button working fine under ${tabname}`),
              ];
          await page.waitForSelector(sp.scatterPlotLaborLink);
          await page.click(sp.scatterPlotLaborLink);
          await navigationPromise;
          await page.waitForTimeout(10000);
        } else {
          logger.error("view detail button not display properly");
          errors.push("view detail button not display properly");
        }
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
