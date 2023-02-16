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
      name: `[AEC-FOCP-UI-FN-LD-0005] ${site.name} FixedOps Advisor Metrics Page Labor Monthly Table Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-UI-FN-LD-0005",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await advisorMetricsPageLaborMonthlyTableTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Advisor Metrics Page Labor Monthly Table Test";
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

async function advisorMetricsPageLaborMonthlyTableTest(baseURL: string) {
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
        as.laborSale,
        as.soldHours,
        as.jobCount,
        as.profit,
        as.elr,
        as.roCount,
      ];

      for (let i = 0; i <= tabs.length - 1; i++) {
        await page.waitForSelector(tabs[i]);
        await page.click(tabs[i]);
        await navigationPromise;
        await page.waitForTimeout(25000);

        const tabName = await page.$eval(
          tabs[i],
          (element) => element.textContent
        );
        await page.waitForTimeout(10000);
        await page
          .waitForSelector(as.dataTabReports, {
            visible: true,
            timeout: 4000,
          })
          .then(() => {
            logger.info(`data table present under ${tabName} tab`);
          })
          .catch(() => {
            logger.error(`data table not present under ${tabName} tab`);
            errors.push(`data table not present under ${tabName} tab`);
          });
        await page
          .waitForXPath(as.rankingPerRow, {
            visible: true,
            timeout: 2000,
          })
          .then(() => {
            logger.info(`ranking per row display under ${tabName} tab`);
          })
          .catch(() => {
            logger.error(`ranking per row not display under ${tabName} tab`);
            errors.push(`ranking per row not display under ${tabName} tab`);
          });

        await page
          .waitForXPath(as.downloadIcon, {
            visible: true,
            timeout: 2000,
          })
          .then(() => {
            logger.info(`download icon display under ${tabName} tab`);
          })
          .catch(() => {
            logger.error(`download icon not display under ${tabName} tab`);
            errors.push(`download icon not display under ${tabName} tab`);
          });
      }
    } else {
      logger.error("Service Advisor Performance title verify failed");
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
