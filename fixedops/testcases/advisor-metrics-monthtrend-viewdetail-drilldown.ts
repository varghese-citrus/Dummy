import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { AdvisorTechMetricsSelector as as } from "../selectors/advisor-tech-metrics.ts";
import { fixedopsCommonLogin } from "./common/fixedops-common-login.ts";
import { startLogger, getRandomNumberBetween } from "../utilities/utils.ts";

const logger = startLogger();

const errors: string[] = [];

function fixedOpsAdvisorMetricsTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[AEC-FOCP-UI-FN-LD-0021] ${site.name} FixedOps Advisor Metrics Page Month Trend View Detail Drill Down Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-UI-FN-LD-0021",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await advisorMetricsPageMonthTrendViewDetailDrillDownTest(
            site.baseURL
          );
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Advisor Metrics Page Month Trend View Detail Drill Down Test";
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

async function advisorMetricsPageMonthTrendViewDetailDrillDownTest(
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

    await page.waitForSelector(as.advisorMetricsLink);
    await page.click(as.advisorMetricsLink);
    await navigationPromise;
    await page.waitForTimeout(15000);
    logger.info("advisor link clicked!!!");

    const title = await page.title();

    if (title == "Service Advisor Performance") {
      logger.info("Service Advisor Performance title verify success");

      await page.waitForTimeout(5000);
      const num = await getRandomNumberBetween(1, 12);

      await page
        .waitForSelector(as.alertMessage, {
          visible: true,
          timeout: 4000,
        })
        .then(() => {
          logger.warn(
            "there is no data present on the graphs,skipping view detail drill down check"
          );
        })
        .catch(async () => {
          const graph = await page.waitForXPath(as.getMonthTrendChart(num), {
            visible: true,
            timeout: 2000,
          });
          await page.waitForTimeout(2000);

          if (graph) {
            logger.info(`graph ${num} visible properly`);
            await page.waitForTimeout(2000);
            const viewBtn = await page.$x(as.monthTrendViewDetailBtn(num));
            await viewBtn[0].click();
            await navigationPromise;
            await page.waitForTimeout(15000);
            logger.info("view detail button clicked");

            const title = await page.title();
            if (title == "Overview") {
              logger.info("view detail button navigation success");

              const elements = [as.editBtn, as.backBtn, as.dataAsOf];
              const elementsName = ["edit button", "back button", "data as of"];

              await page
                .waitForSelector(as.overviewContainer, {
                  visible: true,
                  timeout: 4000,
                })
                .then(() => {
                  logger.info(
                    "advisor metrics month trend overview container display properly"
                  );
                })
                .catch(() => {
                  logger.error(
                    "advisor metrics month trend overview container not display properly"
                  );
                  errors.push(
                    "advisor metrics month trend container not display properly"
                  );
                });
              await page.waitForTimeout(2000);

              await page
                .waitForXPath(as.canvas, {
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
