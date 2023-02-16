import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { SpecialMetricsSelectors as sm } from "../selectors/special-metrics.ts";
import { fixedopsCommonLogin } from "./common/fixedops-common-login.ts";
import { startLogger, getRandomNumberBetween } from "../utilities/utils.ts";

const logger = await startLogger();

const errors: string[] = [];

function fixedOpsSpecialMetricsTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[AEC-FOCP-UI-FN-LD-0003] ${site.name} FixedOps Special Metrics View Detail Drill Down Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-UI-FN-LD-0003",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await specialMetricsViewDetailDrillDownTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Special Metrics View Detail Drill Down Test";
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

async function specialMetricsViewDetailDrillDownTest(baseURL: string) {
  let browser = null;

  try {
    const oBrowser = await fixedopsCommonLogin(baseURL);
    const page = oBrowser.page;
    browser = oBrowser.browser;
    const navigationPromise = oBrowser.navigationPromise;

    await navigationPromise;
    await page.waitForTimeout(15000);

    await page.waitForSelector(sm.specialMetricsLink);
    await page.click(sm.specialMetricsLink);
    await navigationPromise;
    await page.waitForTimeout(15000);
    logger.info("special metrics link clicked!!!");
    const chartIds = [
      "948",
      "923",
      "1354",
      "1355",
      "938",
      "930",
      "935",
      "936",
      "1239",
      "1316",
      "1317",
    ];
    const title = await page.title();
    if (title == "Special Metrics") {
      logger.info("Special Metrics title verify success");
      await page.waitForTimeout(5000);

      const num = await getRandomNumberBetween(0, 10);
      await page.waitForTimeout(2000);
      await page
        .waitForXPath(sm.noDataAlertMsg(chartIds[num]), {
          visible: true,
          timeout: 4000,
        })
        .then(() => {
          logger.warn(
            `there is no data in the graph ${
              num + 1
            },skipping view detail drill down check`
          );
        })
        .catch(async () => {
          const graph = await page.waitForXPath(sm.charts(num + 1), {
            visible: true,
            timeout: 2000,
          });
          await page.waitForTimeout(2000);
          if (graph) {
            logger.info("graph visible properly");
            await page.waitForTimeout(2000);
            const viewBtn = await page.$x(sm.chartViewDetailBtn(num));
            await viewBtn[0].click();
            await navigationPromise;
            await page.waitForTimeout(12000);

            const pageTitle = await page.title();
            if (pageTitle == "Overview") {
              logger.info("view detail button navigation success");
              await page.waitForTimeout(15000);

              const elements = [sm.editBtn, sm.backBtn, sm.dataAsOf];
              const elementsName = ["edit button", "back button", "data as of"];

              const overviewContainer = await page.$eval(
                sm.specialMetricsOverviewContainer,
                (elem) => {
                  return elem.style.display !== "none";
                }
              );
              await page.waitForTimeout(2000);
              overviewContainer
                ? logger.info(
                    "spacial metrics overview container display properly"
                  )
                : [
                    logger.error(
                      "special metrics overview container not display properly"
                    ),
                    errors.push(
                      "special metrics overview container not display properly"
                    ),
                  ];
              await page.waitForTimeout(2000);

              const graphs = await page.waitForXPath(
                sm.specialMetricsOverviewCanvas,
                {
                  visible: true,
                  timeout: 2000,
                }
              );

              await page.waitForTimeout(2000);
              graphs
                ? logger.info(`canvas displayed properly`)
                : [
                    logger.info(`canvas not displayed properly`),
                    errors.push(`canvas not displayed properly`),
                  ];
              await page.waitForTimeout(2000);
              for (let k = 0; k <= elements.length - 1; k++) {
                const elems = await page.waitForXPath(elements[k], {
                  visible: true,
                  timeout: 2000,
                });

                await page.waitForTimeout(2000);
                elems
                  ? logger.info(`${elementsName[k]} displayed properly`)
                  : [
                      logger.info(`${elementsName[k]} not displayed properly`),
                      errors.push(`${elementsName[k]} not displayed properly`),
                    ];
                await page.waitForTimeout(2000);
              }
            } else {
              logger.error("view detail button navigation failed");
              errors.push("view detail button navigation failed");
            }
          } else {
            logger.error("graph not visible properly");
            errors.push("graph not visible properly");
          }
        });
    } else {
      logger.info("Special Metrics title verify failed");
      errors.push("Special Metrics title verify failed");
    }
    ts.assert(
      errors.length == 0,
      `Error in  Special Metrics Page: ${errors.join("\n")}`
    );
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsSpecialMetricsTest();
