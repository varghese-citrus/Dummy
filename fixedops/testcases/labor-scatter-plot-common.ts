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
      name: `[AEC-FOCP-UI-FN-LD-0104] ${site.name} FixedOps Labor Scatter Plot Page Common Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-UI-FN-LD-0104",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await scatterPlotLaborPageCommonTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Labor Scatter Plot Page Common Test";
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

async function scatterPlotLaborPageCommonTest(baseURL: string) {
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
      const [ovrHeading] = await page.$x(sp.scatterPlotLaborHeading);
      const heading: string = await (
        await ovrHeading.getProperty("textContent")
      ).jsonValue();
      heading == "Scatter Plot - Labor - Jobs / Hours / ELR"
        ? logger.info("labor overview page heading verify success")
        : [
            logger.info("labor overview page heading verify failed"),
            errors.push("labor overview page heading verify failed"),
          ];

      await page
        .waitForSelector(sp.resetBtn, {
          visible: true,
          timeout: 4000,
        })
        .then(() => {
          logger.info("reset layout button display properly");
        })
        .catch(() => {
          logger.error("reset layout button not properly displayed");
          errors.push("reset layout button not properly displayed");
        });
      await page.waitForXPath(sp.scatterPlotDataAsOf);
      const x = await page.$x(sp.scatterPlotDataAsOf);
      const str: string = await (
        await x[0].getProperty("textContent")
      ).jsonValue();

      str.split(":")[0].includes("Data as of")
        ? logger.info("data as of field properly displayed")
        : [
            logger.info("data as of field not properly displayed"),
            errors.push("data as of field not properly displayed"),
          ];
      for (let i = 1; i <= 3; i++) {
        const tabname = await page.$eval(
          sp.getTab(i),
          (element) => element.textContent
        );
        await page
          .waitForSelector(sp.getTab(i), {
            visible: true,
            timeout: 4000,
          })
          .then(() => {
            logger.info(`${tabname} tab display properly`);
          })
          .catch(() => {
            logger.info(`${tabname} tab not properly displayed`);
            errors.push(`${tabname} tab properly displayed`);
          });
        await page.waitForTimeout(5000);
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
