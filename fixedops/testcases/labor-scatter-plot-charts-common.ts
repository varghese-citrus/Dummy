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
      name: `[AEC-FOCP-UI-FN-LD-0102] ${site.name} FixedOps Labor Scatter Plot Page Charts Common Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-UI-FN-LD-0102",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await scatterPlotLaborPageChartsCommonTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Labor Scatter Plot Page Charts Common Test";
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

async function scatterPlotLaborPageChartsCommonTest(baseURL: string) {
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
        await navigationPromise;
        await page.waitForTimeout(8000);
        const tabname = await page.$eval(
          sp.getTab(i),
          (element) => element.textContent
        );
        await page
          .waitForXPath(sp.infoIcon, {
            visible: true,
          })
          .then(() => {
            logger.info(`info icon display properly under ${tabname}`);
          })
          .catch(() => {
            logger.error(`info icon not display properly under ${tabname}`);
            errors.push(`info icon not display properly under ${tabname}`);
          });
        await page.waitForTimeout(4000);

        const chartNameXpath = await page.$x(sp.chartName);
        const chartNumberXpath = await page.$x(sp.chartNumber);
        await page.waitForTimeout(2000);
        const chartName = await (
          await chartNameXpath[0].getProperty("textContent")
        ).jsonValue();
        const chartNumber = await (
          await chartNumberXpath[0].getProperty("textContent")
        ).jsonValue();
        await page.waitForTimeout(2000);

        chartName == "CP ELR (vs) Labor Sold Hours" && chartNumber == 1090
          ? logger.info(
              `chart name and chart number visible properly under ${tabname}`
            )
          : [
              logger.error(
                `chart name and chart number not visible properly under ${tabname}`
              ),
              errors.push(
                `chart name and chart number not visible properly under ${tabname}`
              ),
            ];
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
