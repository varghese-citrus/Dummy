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
      name: `[AEC-FOCP-UI-FN-LD-0172] ${site.name} FixedOps Parts Scatter Plot Common Check`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "[AEC-FOCP-UI-FN-LD-0172]",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await partsScatterPlotPageCommonCheck(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Parts Scatter Plot Common Check";
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
async function partsScatterPlotPageCommonCheck(baseURL: string) {
  let browser = null;
  try {
    const oBrowser = await fixedopsCommonLogin(baseURL);
    const page = oBrowser.page;
    browser = oBrowser.browser;
    const navigationPromise = oBrowser.navigationPromise;
    await page.waitForSelector(ps.partsMenu);
    await page.click(ps.partsMenu);
    logger.info("Parts Menu clicked!!!");
    await navigationPromise;
    await page.waitForTimeout(5000);
    await page.waitForSelector(ps.scatterPlotMenu);
    await page.click(ps.scatterPlotMenu);
    await navigationPromise;
    await page.waitForTimeout(15000);
    logger.info("Parts scatter plot clicked");
    const title = await page.title();
    if (title == "Scatter Plot - Parts Cost / Jobs / Markup") {
      logger.info("Scatter plot title verified!!!");
      const [pageHeading] = await page.$x(ps.scatterPlotHeading);
      const Heading: string = await (
        await pageHeading.getProperty("textContent")
      ).jsonValue();
      Heading == "Scatter Plot - Parts - Cost / Jobs / Markup"
        ? logger.info("Page heading verified success")
        : [
            logger.error("Page heading verified failed"),
            errors.push("Page heading verified failed"),
          ];
      await page
        .waitForSelector(ps.resetLayout, {
          visible: true,
          timeout: 4000,
        })
        .then(() => {
          logger.info("Reset Layout button visible properly");
        })
        .catch(() => {
          logger.error("Reset Layout button is not visible properly");
          errors.push("Reset Layout button is not visible properly");
        });
      const DataAsOf = await page.$x(ps.dataAsOf);
      const str: string = await (
        await DataAsOf[0].getProperty("textContent")
      ).jsonValue();
      await page.waitForTimeout(5000);
      str.split(":")[0].includes("Data as of")
        ? logger.info("data as of field properly displayed")
        : [
            logger.info("data as of field not properly displayed"),
            errors.push("data as of field not properly displayed"),
          ];
      for (let i = 1; i <= 3; i++) {
        const el = await page.$x(ps.monthTab(i));
        const tabname = await (
          await el[0].getProperty("textContent")
        ).jsonValue();
        await page
          .waitForXPath(ps.monthTab(i), {
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
