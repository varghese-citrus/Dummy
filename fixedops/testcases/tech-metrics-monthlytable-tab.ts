import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { AdvisorTechMetricsSelector as as } from "../selectors/advisor-tech-metrics.ts";
import { fixedopsCommonLogin } from "./common/fixedops-common-login.ts";
import { startLogger } from "../utilities/utils.ts";

const logger = startLogger();

const errors: string[] = [];

function fixedOpsTechMetricsTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[AEC-FOCP-UI-FN-LD-0243] ${site.name} FixedOps Tech Metrics Page Monthly Table Tab Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-UI-FN-LD-0243",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await techMetricsPageMonthlyTableTabTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in Tech Metrics Page Monthly Table Tab Test";
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

async function techMetricsPageMonthlyTableTabTest(baseURL: string) {
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
      const tabs = [
        as.technicianProductivityTab,
        as.technicianSummeryTab,
        as.technicianDetailedViewTab,
      ];

      for (let i = 0; i <= tabs.length - 1; i++) {
        const tabname = await page.$eval(
          tabs[i],
          (element) => element.textContent
        );
        await page.waitForTimeout(2000);
        await page.click(tabs[i]);
        await navigationPromise;
        await page.waitForTimeout(10000);
        logger.info(`${tabname} cliked`);

        const monthlyTableHeading = await page.waitForXPath(
          as.techMetricsMonthlyTableHeading,
          {
            visible: true,
            timeout: 2000,
          }
        );

        if (monthlyTableHeading != null) {
          logger.info("monthly tables heading visible properly");

          const tables = [as.techSolidHoursAll, as.techSolidHoursGp];

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
                  `monthly tables button ${text} properly displayed under ${tabname}`
                );
              })
              .catch(() => {
                logger.error(
                  `monthly tables button ${text} not properly displayed under ${tabname}`
                );
                errors.push(
                  `monthly tables button ${text} not properly displayed under ${tabname}`
                );
              });
          }
        } else {
          logger.error("monthly tables heading not visible properly");
          errors.push("monthly tables heading not visible properly");
        }
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
