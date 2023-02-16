import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { PartsScatterPlotSelectors as ps } from "../selectors/parts-scatter-plot.ts";
import { fixedopsCommonLogin } from "./common/fixedops-common-login.ts";
import { startLogger } from "../utilities/utils.ts";

const logger = startLogger();
const errors: string[] = [];

function fixedOpsPartsScatterPlotTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[AEC-FOCP-UI-FN-LD-0173] ${site.name} FixedOps Parts Scatter Plot Detail Button Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "[AEC-FOCP-UI-FN-LD-0173]",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await partsScatterPlotChartDetailButtonCheck(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Parts Scatter Plot Detail Button Test";
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
async function partsScatterPlotChartDetailButtonCheck(baseURL: string) {
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
      logger.info("Scatter plot title verified!!!");
      for (let i = 1; i <= 3; i++) {
        const tab = await page.$x(ps.monthTab(i));
        await tab[0].click();
        await navigationPromise;
        await page.waitForTimeout(15000);
        const tabName = await (
          await tab[0].getProperty("textContent")
        ).jsonValue();
        logger.info(`${tabName} tab clicked properly`);
        await page
          .waitForXPath(ps.infoIcon, {
            visible: true,
            timeout: 4000,
          })
          .then(() => {
            logger.info(`Info icon under ${tabName} visible properly`);
          })
          .catch(() => {
            logger.error(`Info icon under ${tabName} not visible properly`);
            errors.push(`Info icon under ${tabName} not visible properly`);
          });
        await page.waitForSelector(ps.viewDetailBtn);
        await page.click(ps.viewDetailBtn);
        logger.info(`Scatter plot under ${tabName} view detail button clicked`);
        await navigationPromise;
        await page.waitForTimeout(5000);
        const title = await page.title();
        title == "Overview"
          ? logger.info("Detail page title verified!!!")
          : [
              logger.error("Detail page title verify failed"),
              errors.push("Detail page title verify failed"),
            ];
        await page.waitForXPath(ps.dataAsOfDetailPage);
        const x = await page.$x(ps.dataAsOfDetailPage);
        const str: string = await (
          await x[0].getProperty("textContent")
        ).jsonValue();
        str.toString().split(":")[0].includes("Data as of")
          ? logger.info("Data as of properly visible")
          : [
              logger.error("Data as of not properly visible"),
              errors.push("Data as of not properly visible"),
            ];
        const backButton = await page.$x(ps.backBtn);
        await backButton[0].click();
        logger.info("Detail page back button clicked successfully");
        await navigationPromise;
        await page.waitForTimeout(12000);
      }
    } else {
      logger.error("Title verified failed");
      errors.push("Title verified failed");
    }
    ts.assert(
      errors.length == 0,
      `Error in Parts Scatter Plot Detail Button test: ${errors.join("\n")}`
    );
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsPartsScatterPlotTest();
