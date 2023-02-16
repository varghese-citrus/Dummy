import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { SpecialMetricsSelectors as sm } from "../selectors/special-metrics.ts";
import { fixedopsCommonLogin } from "./common/fixedops-common-login.ts";
import { startLogger } from "../utilities/utils.ts";

const logger = startLogger();
const errors: string[] = [];

function fixedOpsSpecialMetricsTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[AEC-FOCP-UI-FN-LD-0223] ${site.name} FixedOps Special Metrics Graphs Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-UI-FN-LD-0223",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await specialMetricsPageGraphsTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Special Metrics Graphs Test";
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

async function specialMetricsPageGraphsTest(baseURL: string) {
  let browser = null;

  try {
    const oBrowser = await fixedopsCommonLogin(baseURL);
    const page = oBrowser.page;
    browser = oBrowser.browser;
    const navigationPromise = oBrowser.navigationPromise;
    await page.waitForSelector(sm.specialMetricsLink);
    await page.click(sm.specialMetricsLink);
    await navigationPromise;
    await page.waitForTimeout(15000);
    logger.info("special metrics link clicked!!!");
    const title = await page.title();
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
    if (title == "Special Metrics") {
      logger.info("Special Metrics title verify success");
      const chartDiv = await page.$x(sm.chartDiv);
      await page.waitForTimeout(2000);
      let count = 0;
      for (let i = 0; i <= chartDiv.length - 1; i++) {
        await page
          .waitForXPath(sm.noDataAlertMsg(chartIds[i]), {
            visible: true,
            timeout: 4000,
          })
          .then(() => {
            logger.warn(
              `there is no data in the graph ${
                i + 1
              },skipping visibility of graph ${i + 1} check`
            );
            count++;
          })
          .catch(async () => {
            logger.info(`data present in the graph ${i + 1}`);
            if (count > 0) {
              const graph = await page.waitForXPath(sm.charts(i + 1 - count), {
                visible: true,
                timeout: 2000,
              });
              graph != null
                ? logger.info(
                    `graph ${i + 1} properly visible in special metrics page`
                  )
                : [
                    logger.error(
                      `graph ${
                        i + 1
                      } not properly visible in special metrics page`
                    ),
                    errors.push(
                      `graph ${
                        i + 1
                      } not properly visible in special metrics page`
                    ),
                  ];
              await page.waitForTimeout(4000);
            } else {
              const graph = await page.waitForXPath(sm.charts(i + 1), {
                visible: true,
                timeout: 2000,
              });
              graph != null
                ? logger.info(
                    `graph ${i + 1} properly visible in special metrics page`
                  )
                : [
                    logger.error(
                      `graph ${
                        i + 1
                      } not properly visible in special metrics page`
                    ),
                    errors.push(
                      `graph ${
                        i + 1
                      } not properly visible in special metrics page`
                    ),
                  ];
              await page.waitForTimeout(4000);
            }
          });
      }
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
