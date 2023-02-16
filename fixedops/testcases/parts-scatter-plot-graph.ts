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
      name: `[AEC-FOCP-UI-FN-LD-0175]${site.name} FixedOps Parts Scatter Plot Graph Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "[AEC-FOCP-UI-FN-LD-0175]",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await partsScatterPlotPageGraphCheck(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in Scatter Plot Chart Test";
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
async function partsScatterPlotPageGraphCheck(baseURL: string) {
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
          .waitForSelector(ps.chartId, {
            visible: true,
            timeout: 4000,
          })
          .then(() => {
            logger.info(`chart display properly under ${tabName} tab`);
          })
          .catch(() => {
            logger.error(`chart not display properly under ${tabName} tab`);
            errors.push(`chart not display properly under ${tabName} tab`);
          });
        await page.waitForTimeout(15000);
        await page
          .$eval(ps.pivotTable, (elem) => {
            return elem.style.display !== "none";
          })
          .then(() => {
            logger.info(`pivot table display properly under ${tabName} tab`);
          })
          .catch(() => {
            logger.error(
              `pivot table not display properly under ${tabName} tab`
            );
            errors.push(
              `pivot table not display properly under ${tabName} tab`
            );
          });
        await page.waitForTimeout(5000);
        const chartNameXpath = await page.$x(ps.chartName);
        const chartNumberXpath = await page.$x(ps.chartNumber);
        await page.waitForTimeout(2000);
        const chartName = await (
          await chartNameXpath[0].getProperty("textContent")
        ).jsonValue();
        const chartNumber = await (
          await chartNumberXpath[0].getProperty("textContent")
        ).jsonValue();
        await page.waitForTimeout(2000);
        chartName == "CP Parts Markup (vs) Parts Cost" && chartNumber == 1096
          ? logger.info(
              `chart name and chart number visible properly under ${tabName}`
            )
          : [
              logger.error(
                `chart name and chart number not visible properly under ${tabName}`
              ),
              errors.push(
                `chart name and chart number not visible properly under ${tabName}`
              ),
            ];
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
