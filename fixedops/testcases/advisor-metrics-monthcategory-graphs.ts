import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { AdvisorTechMetricsSelector as as } from "../selectors/advisor-tech-metrics.ts";
import { fixedopsCommonLogin } from "./common/fixedops-common-login.ts";
import { getRandomNumberBetween, startLogger } from "../utilities/utils.ts";

const logger = startLogger();

const errors: string[] = [];

function fixedOpsAdvisorMetricsTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[AEC-FOCP-UI-FN-LD-0011] ${site.name} FixedOps Advisor Metrics Page Month Category Graphs Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-UI-FN-LD-0011",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await advisorMetricsPageMonthCategoryGraphsTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Advisor Metrics Page Month Category Graphs Test";
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

async function advisorMetricsPageMonthCategoryGraphsTest(baseURL: string) {
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
        .waitForSelector(as.alertMessage, { visible: true, timeout: 4000 })
        .then(() => {
          logger.warn(
            "there is no data in the graphs,skipping visibility of graph check"
          );
        })
        .catch(async () => {
          logger.info("data present in the graphs");
          const serviceAdvisorPerformanceTab = await page.$x(
            as.serviceAdvisorPerformanceTab
          );
          const serviceAdvisorPerformanceTabStatus = await page.evaluate(
            (el) => el.getAttribute("aria-selected"),
            serviceAdvisorPerformanceTab[0]
          );

          if (serviceAdvisorPerformanceTabStatus) {
            await page.waitForXPath(as.categoryByMonthTab);
            const categoryMonthTab = await page.$x(as.categoryByMonthTab);

            await categoryMonthTab[0].click();
            await navigationPromise;
            await page.waitForTimeout(10000);

            const monthSel1 = await page.$x(as.monthCategorySel);
            await monthSel1[0].click();
            await page.waitForTimeout(4000);

            const num1 = await getRandomNumberBetween(1, 12);

            const month1 = await page.$x(as.monthSelectLi(num1));
            await month1[0].click();
            await page.waitForTimeout(15000);
            logger.info("month selected");

            for (let i = 0; i <= 9; i++) {
              await page
                .waitForXPath(as.getMonthCategoryChart(i + 1), {
                  visible: true,
                  timeout: 2000,
                })
                .then(() => {
                  logger.info(
                    `graph ${
                      i + 1
                    } properly visible under category by month tab`
                  );
                })
                .catch(() => {
                  logger.error(
                    `graph ${
                      i + 1
                    } not properly visible under category by month tab`
                  );
                  errors.push(
                    `graph ${
                      i + 1
                    } not properly visible under category by month tab`
                  );
                });
            }
          } else {
            await page.click(as.serviceAdvisorPerformanceTab);
            await page.waitForTimeout(5000);
            await page.waitForXPath(as.categoryByMonthTab);
            const cmpMonthTab = await page.$x(as.categoryByMonthTab);

            await cmpMonthTab[0].click();
            await navigationPromise;
            await page.waitForTimeout(10000);

            const monthSel1 = await page.$x(as.monthCategorySel);
            await monthSel1[0].click();
            await page.waitForTimeout(4000);

            const num1 = await getRandomNumberBetween(1, 12);

            const month1 = await page.$x(as.monthSelectLi(num1));
            await month1[0].click();
            await page.waitForTimeout(4000);
            logger.info("month selected");

            for (let i = 0; i <= 9; i++) {
              await page
                .waitForXPath(as.getMonthCategoryChart(i + 1), {
                  visible: true,
                  timeout: 2000,
                })
                .then(() => {
                  logger.info(
                    `graph ${
                      i + 1
                    } properly visible under category by month tab`
                  );
                })
                .catch(() => {
                  logger.error(
                    `graph ${
                      i + 1
                    } not properly visible under category by month tab`
                  );
                  errors.push(
                    `graph ${
                      i + 1
                    } not properly visible under category by month tab`
                  );
                });
            }
          }
        });
    } else {
      logger.error("Service Advisor Performance title verify failed");
      errors.push("Service Advisor Performance title verify failed");
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
