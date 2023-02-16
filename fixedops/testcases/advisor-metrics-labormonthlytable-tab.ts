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
      name: `[AEC-FOCP-UI-FN-LD-0004] ${site.name} FixedOps Advisor Metrics Page Labor Monthly Table Tab Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-UI-FN-LD-0004",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await advisorMetricsPageLaborMonthlyTableTabTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Advisor Metrics Page Labor Monthly Table Tab Test";
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

async function advisorMetricsPageLaborMonthlyTableTabTest(baseURL: string) {
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

      const tabs = [
        as.serviceAdvisorPerformanceTab,
        as.serviceAdvisorSummaryTab,
        as.serviceAdvisorDetailedViewTab,
      ];

      for (let i = 0; i <= tabs.length - 1; i++) {
        const tab = await page.$x(tabs[i]);
        await page.waitForTimeout(4000);
        const tabName = await (
          await tab[0].getProperty("textContent")
        ).jsonValue();

        await tab[0].click();
        await navigationPromise;
        await page.waitForTimeout(10000);
        logger.info(`${tabName} cliked`);

        const laborMonthlyTableHeading = await page.waitForSelector(
          as.laborMonthlyTableHeading,
          { visible: true, timeout: 4000 }
        );
        if (laborMonthlyTableHeading) {
          logger.info("labor monthly tables heading visible properly");
          const tables = [
            as.laborSale,
            as.soldHours,
            as.jobCount,
            as.profit,
            as.elr,
            as.roCount,
          ];

          for (let j = 0; j <= tables.length - 1; j++) {
            const text = await page.$eval(
              tables[j],
              (element) => element.textContent
            );
            await page.waitForTimeout(4000);

            await page
              .waitForSelector(tables[j], {
                visible: true,
                timeout: 4000,
              })
              .then(() => {
                logger.info(
                  `labor monthly tables button ${text} properly displayed under${tabName}`
                );
              })
              .catch(() => {
                logger.error(
                  `labor monthly tables button ${text} not properly displayed under${tabName}`
                );
                errors.push(
                  `labor monthly tables button ${text} not properly displayed under${tabName}`
                );
              });
          }
        } else {
          logger.error("labor monthly tables heading not visible properly");
          errors.push("labor monthly tables heading not visible properly");
        }
      }
    } else {
      logger.info("Service Advisor Performance title verify failed");
      errors.push("Service Advisor Performance title verify failed");
    }
    ts.assert(
      errors.length == 0,
      `Error in Advisor Metrics Page: ${errors.join("\n")}`
    );
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsAdvisorMetricsTest();
