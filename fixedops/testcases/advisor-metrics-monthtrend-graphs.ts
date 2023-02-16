import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { AdvisorTechMetricsSelector as as } from "../selectors/advisor-tech-metrics.ts";
import { fixedopsCommonLogin } from "./common/fixedops-common-login.ts";
import { startLogger } from "../utilities/utils.ts";

const logger = startLogger();

const errors: string[] = [];

function fixedOpsAdvisorMetricsTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[AEC-FOCP-UI-FN-LD-0019] ${site.name} FixedOps Advisor Metrics Page Month Trend Graphs Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-UI-FN-LD-0019",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await advisorMetricsPageMonthTrendGraphsTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Advisor Metrics Page Month Trend Graphs Test";
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

async function advisorMetricsPageMonthTrendGraphsTest(baseURL: string) {
  let browser = null;

  try {
    const oBrowser = await fixedopsCommonLogin(baseURL);
    const page = oBrowser.page;
    browser = oBrowser.browser;
    const navigationPromise = oBrowser.navigationPromise;

    await navigationPromise;
    await page.waitForTimeout(15000);

    await page.waitForSelector(as.advisorMetricsLink);
    await page.click(as.advisorMetricsLink);
    await navigationPromise;
    await page.waitForTimeout(15000);
    logger.info("advisor link clicked!!!");

    const title = await page.title();

    if (title == "Service Advisor Performance") {
      logger.info("Service Advisor Performance title verify success");
      await page.waitForTimeout(5000);
      await page
        .waitForSelector(as.alertMessage, {
          visible: true,
          timeout: 4000,
        })
        .then(() => {
          logger.warn(
            "there is no data in the graphs,skipping visibility of graph check"
          );
        })
        .catch(async () => {
          logger.info("data is present in the graphs");
          const serviceAdvisorPerformanceTab = await page.$x(
            as.serviceAdvisorPerformanceTab
          );
          const serviceAdvisorPerformanceTabStatus = await page.evaluate(
            (el) => el.getAttribute("aria-selected"),
            serviceAdvisorPerformanceTab[0]
          );

          const chartDiv = await page.$x(as.monthTrendChartDiv);

          if (serviceAdvisorPerformanceTabStatus) {
            for (let i = 0; i <= chartDiv.length - 1; i++) {
              await page
                .waitForXPath(as.getMonthTrendChart(i + 1), {
                  visible: true,
                  timeout: 2000,
                })
                .then(() => {
                  logger.info(
                    `graph ${i + 1} properly visible under 13 month trend tab`
                  );
                })
                .catch(() => {
                  logger.error(
                    `graph ${
                      i + 1
                    } not properly visible under 13 month trend tab`
                  );
                  errors.push(
                    `graph ${
                      i + 1
                    } not properly visible under 13 month trend tab`
                  );
                });
            }
          } else {
            await page.click(as.serviceAdvisorPerformanceTab);
            await page.waitForTimeout(5000);
            for (let i = 0; i <= chartDiv.length - 1; i++) {
              await page
                .waitForXPath(as.getMonthTrendChart(i + 1), {
                  visible: true,
                  timeout: 2000,
                })
                .then(() => {
                  logger.info(
                    `graph ${i + 1} properly visible under 13 month trend tab`
                  );
                })
                .catch(() => {
                  logger.error(
                    `graph ${
                      i + 1
                    } not properly visible under 13 month trend tab`
                  );
                  errors.push(
                    `graph ${
                      i + 1
                    } not properly visible under 13 month trend tab`
                  );
                });
            }
          }
        });
    } else {
      logger.info("advisor metrics title verify failed");
      errors.push("advisor metrics title verify failed");
    }

    ts.assert(
      errors.length == 0,
      `Error in  Advisor Metrics Page: ${errors.join("\n")}`
    );
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsAdvisorMetricsTest();
