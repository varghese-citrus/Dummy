import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { AdvisorTechMetricsSelector as as } from "../selectors/advisor-tech-metrics.ts";
import { fixedopsCommonLogin } from "./common/fixedops-common-login.ts";
import { getRandomNumberBetween, startLogger } from "../utilities/utils.ts";

const logger = startLogger();

const errors: string[] = [];

function fixedOpsTechMetricsTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[AEC-FOCP-UI-FN-LD-0242] ${site.name} FixedOps Tech Metrics Page Month Comparison View Detail Drill Down Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-UI-FN-LD-0242",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await techMetricsPageMonthCmpViewDetailDrillDownTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Tech Metrics Page Month Comparison View Detail Drill Down Test";
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

async function techMetricsPageMonthCmpViewDetailDrillDownTest(baseURL: string) {
  let browser = null;

  try {
    const oBrowser = await fixedopsCommonLogin(baseURL);
    const page = oBrowser.page;
    browser = oBrowser.browser;
    const navigationPromise = oBrowser.navigationPromise;

    await navigationPromise;
    await page.waitForTimeout(15000);

    await page.waitForSelector(as.techMetricsLink);
    await page.click(as.techMetricsLink);
    await navigationPromise;
    await page.waitForTimeout(15000);
    logger.info("tech metrics link clicked");

    const title = await page.title();

    if (title == "Technician Performance") {
      logger.info("Technician Performance title verify success");

      await page.waitForSelector(as.technicianProductivityTab);
      await page.click(as.technicianProductivityTab);
      await page.waitForTimeout(5000);

      const monthCmp = await page.$x(as.monthCmpTab);
      await monthCmp[0].click();
      await navigationPromise;
      await page.waitForTimeout(15000);

      const num = await getRandomNumberBetween(2, 5);
      const graph = await page.waitForXPath(as.techMetricsGraphs(num), {
        visible: true,
        timeout: 2000,
      });
      await page.waitForTimeout(5000);

      if (graph) {
        logger.info("graph visible properly");
        await page.waitForTimeout(5000);
        const viewBtn = await page.$x(as.techMetricsCmpViewDetailBtn(num));
        await viewBtn[0].click();
        await navigationPromise;
        await page.waitForTimeout(15000);
        const title = await page.title();
        if (title == "Overview") {
          logger.info("view detail button navigation success");
          await page.waitForTimeout(5000);
          const elements = [as.editBtn, as.backBtn, as.dataAsOf];
          const elementsName = ["edit button", "back button", "data as of"];

          await page
            .waitForSelector(as.techMetricsCmpOverviewContainer, {
              visible: true,
              timeout: 4000,
            })
            .then(() => {
              logger.info(
                "tech metrics month comparison overview container display properly"
              );
            })
            .catch(() => {
              logger.error(
                "tech metrics month comparison overview container not display properly"
              );
              errors.push(
                "tech metrics month comparison container not display properly"
              );
            });

          await page.waitForTimeout(2000);

          await page
            .waitForXPath(as.techMetricsCmpCanvas, {
              visible: true,
              timeout: 2000,
            })
            .then(() => {
              logger.info("canvas displayed properly");
            })
            .catch(() => {
              logger.error("canvas not displayed properly");
              errors.push("canvas not displayed properly");
            });

          await page.waitForTimeout(2000);
          for (let k = 0; k <= elements.length - 1; k++) {
            page
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
        logger.error("graph not visible properly");
        errors.push("graph not visible properly");
      }
    } else {
      logger.info("Technician Performance title verify failed");
      errors.push("Technician Performance title verify failed");
    }
    ts.assert(
      errors.length == 0,
      `Error in Tech Metrics Page: ${errors.join("\n")}`
    );
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsTechMetricsTest();
