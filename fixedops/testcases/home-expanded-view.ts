import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { HomeSelectors as hs } from "../selectors/home.ts";
import { fixedopsCommonLogin } from "./common/fixedops-common-login.ts";
import { startLogger } from "../utilities/utils.ts";

const logger = startLogger();
const errors: string[] = [];

function fixedOpsHomeTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[AEC-FOCP-UI-FN-LD-0070] ${site.name} FixedOps Home Page Expanded View Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-UI-FN-LD-0070",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await homePageExpandedViewTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Home Page Expanded View Test";
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

async function homePageExpandedViewTest(baseURL: string) {
  let browser = null;
  try {
    const oBrowser = await fixedopsCommonLogin(baseURL);
    const page = oBrowser.page;
    browser = oBrowser.browser;
    const navigationPromise = oBrowser.navigationPromise;

    const title = await page.title();

    const contaninerCharts = [
      hs.expandedChartContanier_1,
      hs.expandedChartContanier_2,
      hs.expandedChartContanier_3,
      hs.expandedChartContanier_4,
      hs.expandedChartContanier_5,
      hs.expandedChartContanier_6,
      hs.expandedChartContanier_7,
      hs.expandedChartContanier_8,
      hs.expandedChartContanier_9,
      hs.expandedChartContanier_10,
      hs.expandedChartContanier_11,
      hs.expandedChartContanier_12,
      hs.expandedChartContanier_13,
    ];

    if (title == "Home") {
      logger.info(`${title} page title verify success!!!`);
      await page.reload();
      await navigationPromise;
      await page.waitForTimeout(15000);
      await page
        .waitForXPath(hs.noDataDisplayDiv, {
          visible: true,
          timeout: 2000,
        })
        .then(() => {
          logger.warn("there is no data available for selected range");
        })
        .catch(async () => {
          await page.waitForTimeout(5000);
          await page
            .waitForXPath(hs.expandedViewBtn, { visible: true, timeout: 4000 })
            .then(async () => {
              const expandedViewBtn = await page.$x(hs.expandedViewBtn);
              await expandedViewBtn[0].click();
              await page.waitForTimeout(15000);
              logger.info("expanded view button clicked");
              await page.mouse.move(120, 45);

              for (let i = 0; i <= contaninerCharts.length - 1; i++) {
                await page
                  .waitForSelector(contaninerCharts[i], {
                    visible: true,
                    timeout: 4000,
                  })
                  .then(() => {
                    logger.info(
                      `charts container ${i + 1} display and expanded properly`
                    );
                  })
                  .catch(() => {
                    logger.error(
                      `charts container ${
                        i + 1
                      } not display and expanded properly`
                    );
                    errors.push(
                      `charts container ${
                        i + 1
                      } not display and expanded properly`
                    );
                  });
                await page.waitForTimeout(2000);
              }

              const standardViewBtn = await page.$x(hs.standardViewBtn);
              await standardViewBtn[0].click();
              await page.waitForTimeout(15000);
              logger.info("standard view button clicked");
              await page.mouse.move(120, 45);

              const ids = [
                hs.scoreCard,
                hs.chartContainer_1,
                hs.chartContainer_2,
                hs.chartContainer_3,
                hs.chartContainer_4,
                hs.chartContainer_11,
                hs.chartContainer_5,
                hs.chartContainer_6,
                hs.chartContainer_7,
                hs.chartContainer_8,
                hs.chartContainer_9,
                hs.chartContainer_10,
                hs.chartContainer_12,
                hs.chartContainer_13,
              ];

              for (let i = 0; i <= ids.length - 1; i++) {
                await page
                  .waitForSelector(ids[i], {
                    visible: true,
                    timeout: 4000,
                  })
                  .then(() => {
                    logger.info(
                      `graph ${
                        i + 1
                      } display and return into standard view properly`
                    );
                  })
                  .catch(() => {
                    logger.error(
                      `graph ${
                        i + 1
                      } display and return into standard view properly`
                    );
                    errors.push(
                      `graph ${
                        i + 1
                      } display and return into standard view properly`
                    );
                  });
                await page.waitForTimeout(2000);
              }
            })
            .catch(() => {
              logger.warn("expanded view is not available for this tenant");
            });
        });
    } else {
      logger.error("home page title verify failed");
      errors.push("home page title verify failed");
    }
    ts.assert(errors.length == 0, `Error in Home page: ${errors.join("\n")}`);
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsHomeTest();
