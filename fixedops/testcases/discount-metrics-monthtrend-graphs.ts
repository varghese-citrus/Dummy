import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { DiscountMetricsSelector as ds } from "../selectors/discount-metrics.ts";
import { fixedopsCommonLogin } from "./common/fixedops-common-login.ts";
import { startLogger } from "../utilities/utils.ts";

const logger = startLogger();
const errors: string[] = [];

function fixedOpsDiscountMetricsTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[AEC-FOCP-UI-FN-LD-0055] ${site.name} FixedOps Discount Metrics Page Month Trend Graphs Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-UI-FN-LD-0055",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await discountMetricsPageMonthTrendGraphsTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Discount Metrics Page Month Trend Graphs Test";
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

async function discountMetricsPageMonthTrendGraphsTest(baseURL: string) {
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

    const chartIds = ["1234", "1113", "1123", "1115", "1232", "1236", "1165"];

    if (title == "Discount") {
      logger.info("Discount metrics title verify success");
      await page.waitForTimeout(5000);
      const chartDiv = await page.$x(ds.monthTrendChartDiv);
      for (let i = 0; i <= chartDiv.length - 1; i++) {
        await page
          .waitForXPath(ds.noDataAlertMsg(chartIds[i]), {
            visible: true,
            timeout: 4000,
          })
          .then(() => {
            logger.warn(
              `there is no data in the graph ${
                i + 1
              },skipping visibility of graph ${i + 1} check`
            );
          })
          .catch(async () => {
            logger.info(`data present in the graph ${i + 1}`);

            const graph = await page.waitForXPath(
              ds.getMonthTrendChart(i + 1),
              {
                visible: true,
                timeout: 2000,
              }
            );
            await page.waitForTimeout(2000);
            graph != null
              ? logger.info(
                  `graph ${i + 1} properly visible under 13 month trend tab`
                )
              : [
                  logger.error(
                    `graph ${
                      i + 1
                    } not properly visible under 13 month trend tab`
                  ),
                  errors.push(
                    `graph ${
                      i + 1
                    } not properly visible under 13 month trend tab`
                  ),
                ];
            await page.waitForTimeout(4000);
          });
      }
    } else {
      logger.info("discount metrics title verify failed");
      errors.push("discount metrics title verify failed");
    }
    ts.assert(
      errors.length == 0,
      `Error in Discount Metrics Page: ${errors.join("\n")}`
    );
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsDiscountMetricsTest();
