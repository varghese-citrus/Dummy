import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { DiscountMetricsSelector as ds } from "../selectors/discount-metrics.ts";
import { fixedopsCommonLogin } from "./common/fixedops-common-login.ts";
import { startLogger, getRandomNumberBetween } from "../utilities/utils.ts";

const logger = startLogger();
const errors: string[] = [];

function fixedOpsDiscountMetricsTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[AEC-FOCP-UI-FN-LD-0057] ${site.name} FixedOps Discount Metrics Page By Service Advisor View Detail Drill Down Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-UI-FN-LD-0057",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await discountMetricsPageMonthTrendViewDetailDrillDownTest(
            site.baseURL
          );
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Discount Metrics Page Month Trend View Detail Drill Down Test";
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

async function discountMetricsPageMonthTrendViewDetailDrillDownTest(
  baseURL: string
) {
  let browser = null;

  try {
    const oBrowser = await fixedopsCommonLogin(baseURL);
    const page = oBrowser.page;
    browser = oBrowser.browser;
    const navigationPromise = oBrowser.navigationPromise;
    await navigationPromise;
    await page.waitForTimeout(15000);

    await page.waitForSelector(ds.disMetricsLink);
    await page.click(ds.disMetricsLink);
    await navigationPromise;
    await page.waitForTimeout(15000);
    logger.info("discount link clicked!!!");

    const [Mnthtrend] = await page.$x(ds.MonthTrendTab);
    await Mnthtrend.click();
    await navigationPromise;
    await page.waitForTimeout(15000);
    logger.info("Month trend tab clicked");

    const title = await page.title();

    if (title == "Discount") {
      logger.info("Discount metrics title verify success");

      await page.waitForTimeout(5000);
      const num = await getRandomNumberBetween(1, 7);

      const chartIdXpath = await page.$x(ds.monthTrendChartNumber(num + 1));
      const chartId: string = await (
        await chartIdXpath[0].getProperty("textContent")
      ).jsonValue();
      await page
        .waitForXPath(ds.noDataAlertMsg(chartId), {
          visible: true,
          timeout: 4000,
        })
        .then(() => {
          logger.warn(
            `there is no data in the graph,skipping graph ${
              num + 1
            } drill down check`
          );
        })
        .catch(async () => {
          const graph = await page.waitForXPath(ds.getMonthTrendChart(num), {
            visible: true,
            timeout: 2000,
          });
          await page.waitForTimeout(2000);

          if (graph) {
            logger.info(`graph ${num} visible properly`);
            await page.waitForTimeout(2000);
            const viewBtn = await page.$x(ds.discmonthTrendViewDetailBtn(num));
            await viewBtn[0].click();
            await navigationPromise;
            await page.waitForTimeout(15000);
            logger.info("view detail button clicked");

            const title = await page.title();
            if (title == "Overview") {
              logger.info("view detail button navigation success");

              const elements = [ds.editBtn, ds.backBtn, ds.dataAsOf];
              const elementsName = ["edit button", "back button", "data as of"];

              await page
                .waitForSelector(ds.overviewContainer, {
                  visible: true,
                  timeout: 4000,
                })
                .then(() => {
                  logger.info(
                    "discount metrics month trend overview container display properly"
                  );
                })
                .catch(() => {
                  logger.error(
                    "discount metrics month trend overview container not display properly"
                  );
                  errors.push(
                    "discount metrics month trend container not display properly"
                  );
                });
              await page.waitForTimeout(2000);
              await page.waitForXPath(ds.canvas);

              await page
                .waitForXPath(ds.canvas, {
                  visible: true,
                  timeout: 2000,
                })
                .then(() => {
                  logger.info(`canvas displayed properly`);
                })
                .catch(() => {
                  logger.info(`canvas not displayed properly`);
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
            logger.error(`graph ${num} not visible properly`);
            errors.push(`graph ${num} not visible properly`);
          }
        });
    } else {
      logger.info("discount metrics title verify failed");
      errors.push("discount metrics title verify failed");
    }
    ts.assert(
      errors.length == 0,
      `Error in  Discount Metrics Page: ${errors.join("\n")}`
    );
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsDiscountMetricsTest();
