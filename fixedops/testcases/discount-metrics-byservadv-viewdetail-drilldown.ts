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
      name: `[AEC-FOCP-UI-FN-LD-0048] ${site.name} FixedOps Discount  Metrics Page By Service Advisor View Detail Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-UI-FN-LD-0048",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await advisorMetricsPageByServiceAdvisorViewDetTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Advisor Metrics Page By Service Advisor View Detail Test";
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

async function advisorMetricsPageByServiceAdvisorViewDetTest(baseURL: string) {
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
      await page.waitForTimeout(10000);
      logger.info("By Service Advisor tab clicked");
      const num = await getRandomNumberBetween(1, 4);

      await page
        .waitForXPath(ds.noDataSpan(num), {
          visible: true,
          timeout: 4000,
        })
        .then(() => {
          logger.warn("there is no data in the graphs for drill down");
        })
        .catch(async () => {
          const graph = await page.waitForXPath(ds.getServAdvChart(num), {
            visible: true,
            timeout: 2000,
          });
          await page.waitForTimeout(2000);

          if (graph) {
            logger.info(`graph ${num} visible properly`);
            await page.waitForTimeout(2000);
            const viewBtn = await page.$x(ds.discByservAdvViewDetailBtn(num));
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
                .waitForSelector(ds.overviewServiceContainer, {
                  visible: true,
                  timeout: 4000,
                })
                .then(() => {
                  logger.info(
                    "discount metrics by service advisor  display properly"
                  );
                })
                .catch(() => {
                  logger.error(
                    "discount metrics by service advisor  not display properly"
                  );
                  errors.push(
                    "discount metrics by service advisor  not display properly"
                  );
                });
              await page.waitForTimeout(2000);
              await page.waitForXPath(ds.servAdvCanvas);

              await page
                .waitForXPath(ds.servAdvCanvas, {
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
      logger.error("Discount metrics title verify failed");
      errors.push("Discount Metrics title verify failed");
    }

    ts.assert(
      errors.length == 0,
      `Error in  Discount Metrics By Service Advisor Page: ${errors.join("\n")}`
    );
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsDiscountMetricsTest();
