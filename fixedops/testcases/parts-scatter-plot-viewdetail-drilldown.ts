import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { PartsScatterPlotSelectors as sp } from "../selectors/parts-scatter-plot.ts";
import { partsoverviewSelectors as ps } from "../selectors/parts-overview.ts";
import { fixedopsCommonLogin } from "./common/fixedops-common-login.ts";
import { getRandomNumberBetween, startLogger } from "../utilities/utils.ts";

const logger = startLogger();
const errors: string[] = [];

function fixedOpsScatterPlotPartsTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[AEC-FOCP-UI-FN-LD-0179] ${site.name} FixedOps Parts Scatter Plot Page View Detail Button Drill Down Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-UI-FN-LD-0179",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await scatterPlotPartsViewDetailDrillDownTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Parts Scatter Plot Page View Detail Button Drill Down Test";
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

async function scatterPlotPartsViewDetailDrillDownTest(baseURL: string) {
  let browser = null;

  try {
    const oBrowser = await fixedopsCommonLogin(baseURL);
    const page = oBrowser.page;
    browser = oBrowser.browser;
    const navigationPromise = oBrowser.navigationPromise;
    await page.waitForSelector(ps.partsMenuLink);
    await page.click(ps.partsMenuLink);
    logger.info("parts expand collapse link clicked");
    await page.waitForTimeout(5000);
    await page.waitForSelector(sp.scatterPlotMenu);
    await page.click(sp.scatterPlotMenu);
    await navigationPromise;
    await page.waitForTimeout(15000);
    logger.info("scatter plot parts link clicked");
    const title = await page.title();
    if (title == "Scatter Plot - Parts Cost / Jobs / Markup") {
      logger.info(
        "Scatter Plot - Parts Cost / Jobs / Markup title verify success"
      );
      await page.waitForTimeout(8000);
      const num = await getRandomNumberBetween(1, 3);
      await page.waitForSelector(sp.getTab(num));
      await page.click(sp.getTab(num));
      await page.waitForTimeout(15000);
      const tabname = await page.$eval(
        sp.getTab(num),
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
        await page.waitForTimeout(12000);
        logger.info(
          `enters into ${tabname} tab and click on view detail button`
        );
        const title = await page.title();
        const elements = [ps.editBtn, ps.backBtn, ps.dataAsOf];
        const elementsName = ["edit button", "back button", "data as of"];
        if (title == "Overview") {
          await page
            .$eval(sp.overviewContainer, (elem) => {
              return elem.style.display !== "none";
            })
            .then(() => {
              logger.info("scatter plot overview container display properly");
            })
            .catch(() => {
              logger.error(
                "scatter plot overview container not display properly"
              );
              errors.push("scatter plot container not display properly");
            });
          await page.waitForTimeout(2000);
          await page.waitForXPath(sp.canvas);
          await page
            .waitForXPath(sp.canvas, {
              visible: true,
              timeout: 2000,
            })
            .then(() => {
              logger.info(`canvas displayed properly`);
            })
            .catch(() => {
              logger.error(`canvas not displayed properly`);
              errors.push(`canvas not displayed properly`);
            });
          await page.waitForTimeout(2000);
          for (let k = 0; k <= elements.length - 1; k++) {
            await page
              .waitForXPath(elements[k], {
                visible: true,
                timeout: 2000,
              })
              .then(() => {
                logger.info(`${elementsName[k]} displayed properly`);
              })
              .catch(() => {
                logger.info(`${elementsName[k]} not displayed properly`);
                errors.push(`${elementsName[k]} not displayed properly`);
              });
            await page.waitForTimeout(2000);
          }
        } else {
          logger.error("view detail button navigation failed");
          errors.push("view detail button navigation failed");
        }
      } else {
        logger.error("view detail button not display properly");
        errors.push("view detail button not display properly");
      }
    } else {
      logger.error(
        "Scatter Plot - Parts Cost / Jobs / Markup title verify failed"
      );
      errors.push(
        "Scatter Plot - Parts Cost / Jobs / Markup title verify failed"
      );
    }
    ts.assert(
      errors.length == 0,
      `Error in Scatter Plot Parts Page: ${errors.join("\n")}`
    );
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsScatterPlotPartsTest();
