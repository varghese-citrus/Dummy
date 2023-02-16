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
      name: `[AEC-FOCP-UI-FN-LD-0244] ${site.name} FixedOps Tech Metrics Page Monthly Table Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-UI-FN-LD-0244",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await techMetricsPageMonthlyTableTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Tech Metrics Page Monthly Table Test";
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

async function techMetricsPageMonthlyTableTest(baseURL: string) {
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

      const tabs = [as.techSolidHoursAll, as.techSolidHoursGp];

      for (let i = 0; i <= tabs.length - 1; i++) {
        await page.waitForSelector(tabs[i]);
        await page.click(tabs[i]);
        await navigationPromise;
        await page.waitForTimeout(15000);

        const tabName = await page.$eval(
          tabs[i],
          (element) => element.textContent
        );

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
          .waitForXPath(as.techRaningPerRow, {
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
          .waitForSelector(as.dIcon, {
            visible: true,
            timeout: 4000,
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
      logger.error("Technician Performance title verify failed");
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
