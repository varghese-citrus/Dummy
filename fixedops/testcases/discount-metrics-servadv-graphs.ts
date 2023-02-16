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
      name: `[AEC-FOCP-UI-FN-LD-0061] ${site.name} FixedOps Discount Metrics Page By Service Advisor Graphs Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-UI-FN-LD-0061",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await discountMetricsPageMonthTrendGraphsTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Discount Metrics Page By Service Advisor Graphs Test";
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

    const title = await page.title();

    if (title == "Discount") {
      logger.info("Discount metrics title verify success");

      const byServiceAdvisorTab = await page.$x(ds.byServiceAdvisorTab);
      await byServiceAdvisorTab[0].click();
      await page.waitForTimeout(15000);
      logger.info("By Service Advisor tab clicked");

      const chartDiv = await page.$x(ds.byServiceAdvisorChartDiv);

      for (let i = 0; i <= chartDiv.length - 1; i++) {
        await page
          .waitForXPath(ds.noDataSpan(i + 1), {
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
            await page
              .waitForXPath(ds.getByServiceAdvisorChart(i + 1), {
                visible: true,
                timeout: 2000,
              })
              .then(() => {
                logger.info(
                  `graph ${i + 1} properly visible under By Service Advisor tab`
                );
              })
              .catch(() => {
                logger.error(
                  `graph ${
                    i + 1
                  } not properly visible under By Service Advisor tab`
                );
                errors.push(
                  `graph ${
                    i + 1
                  } not properly visible under By Service Advisor tab`
                );
              });
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
