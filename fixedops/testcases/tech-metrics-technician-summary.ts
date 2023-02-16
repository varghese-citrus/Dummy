import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { fixedopsCommonLogin } from "./common/fixedops-common-login.ts";
import { AdvisorTechMetricsSelector as as } from "../selectors/advisor-tech-metrics.ts";
import { startLogger } from "../utilities/utils.ts";

const logger = startLogger();

const errors: string[] = [];

function fixedOpsTechMetricsPageTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[AEC-FOCP-UI-FN-LD-0254] ${site.name} FixedOps Tech Metrics Page Technician Summary Tab Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-UI-FN-LD-0254",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await techMetricsPageTechnicianSummaryTabTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Tech Metrics Page Technician Summary Tab Test";
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

async function techMetricsPageTechnicianSummaryTabTest(baseURL: string) {
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
    logger.info("Tech metrics link clicked");

    const title = await page.title();

    if (title == "Technician Performance") {
      logger.info("Technician Performance title verify success");
      const summeryTab = await page.waitForSelector(as.technicianSummeryTab, {
        visible: true,
        timeout: 3000,
      });

      if (summeryTab != null) {
        logger.info("Technician summary tab display properly");

        await page.waitForSelector(as.technicianSummeryTab);
        await page.click(as.technicianSummeryTab);
        await page.waitForTimeout(20000);
        logger.info("Technician summary tab clicked");

        await page
          .waitForSelector(as.technicianDataTable, {
            visible: true,
            timeout: 4000,
          })
          .then(() => {
            logger.info("Technician summary table display properly");
          })
          .catch(() => {
            logger.error("Technician summary table not display properly");
            errors.push("Technician summary table not display properly");
          });

        await page.waitForTimeout(5000);
        const columnToggleBtn = await page.$x(as.technicianSummeryColumnBtn);
        await columnToggleBtn[0].click();
        await page.waitForTimeout(4000);
        await columnToggleBtn[0].click();
        await page.waitForTimeout(4000);

        await page
          .waitForXPath(as.technicianSummeryColumnDataPanel, {
            visible: true,
            timeout: 2000,
          })
          .then(() => {
            logger.info("Column data panel is displayed properly");
          })
          .catch(() => {
            logger.error("Column data panel is not displayed properly");
            errors.push("Column data panel is not displayed properly");
          });

        await page
          .waitForSelector(as.dIcon, {
            visible: true,
            timeout: 4000,
          })
          .then(() => {
            logger.info("Download icon present under technician summary tab");
          })
          .catch(() => {
            logger.error(
              "Download icon not present under technician summary tab"
            );
            errors.push(
              "Download icon not present under technician summary tab"
            );
          });
      } else {
        logger.error("Technician summary tab not display properly");
        errors.push("Technician summary tab not display properly");
      }
    } else {
      logger.error("Technician Performance title verify failed");
      errors.push("Technician Performance title verify failed");
    }

    ts.assert(
      errors.length == 0,
      `Error in  Tech Metrics Page: ${errors.join("\n")}`
    );
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsTechMetricsPageTest();
