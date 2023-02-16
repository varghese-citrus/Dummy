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
      name: `[AEC-FOCP-UI-FN-LD-0022] ${site.name} FixedOps Advisor Metrics Page Parts Monthly Table Tab Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-UI-FN-LD-0022",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await advisorMetricsPagePartsMonthlyTableTabTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Advisor Metrics Page Parts Monthly Table Tab Test";
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

async function advisorMetricsPagePartsMonthlyTableTabTest(baseURL: string) {
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

        const partsMonthlyTableHeading = await page.waitForSelector(
          as.partsMonthlyTableHeading,
          { visible: true, timeout: 4000 }
        );

        if (partsMonthlyTableHeading != null) {
          logger.info("parts monthly tables heading visible properly");

          const tables = [
            as.partsSale,
            as.partsCost,
            as.partsProfit,
            as.markup,
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
                  `parts monthly tables button ${text} properly displayed under${tabName}`
                );
              })
              .catch(() => {
                logger.error(
                  `parts monthly tables button ${text} not properly displayed under${tabName}`
                );
                errors.push(
                  `parts monthly tables button ${text} not properly displayed under${tabName}`
                );
              });
            await page.waitForTimeout(4000);
          }
        } else {
          logger.error("parts monthly tables heading not visible properly");
          errors.push("parts monthly tables heading not visible properly");
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
