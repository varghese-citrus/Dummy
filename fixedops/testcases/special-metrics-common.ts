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
      name: `[AEC-FOCP-UI-FN-LD-0220] ${site.name} FixedOps Special Metrics Page Common Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-UI-FN-LD-0220",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await specialMetricsPageChartCommonTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Special Metrics Page Common Test";
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

async function specialMetricsPageChartCommonTest(baseURL: string) {
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
    logger.info("special metrics link clicked");
    const title = await page.title();
    if (title == "Special Metrics") {
      logger.info("Special Metrics title verify success");
      const heading = await page.$x(sm.pageHeading);
      const pageHeading = await (
        await heading[0].getProperty("textContent")
      ).jsonValue();
      if (pageHeading == "Special Metrics") {
        logger.info("Special Metrics heading verify success");
        await page
          .waitForSelector(sm.resetBtn, {
            visible: true,
            timeout: 4000,
          })
          .then(() => {
            logger.info("reset button visible properly");
          })
          .catch(() => {
            logger.error("reset button not visible properly");
            errors.push("reset button not visible properly");
          });
        await page.waitForTimeout(4000);
      } else {
        logger.error("Special Metrics heading verify failed");
        errors.push("Special Metrics heading verify failed");
      }
    } else {
      logger.error("Special Metrics title verify failed");
      errors.push("Special Metrics title verify failed");
    }
    ts.assert(
      errors.length == 0,
      `Error in Special Metrics Page: ${errors.join("\n")}`
    );
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsSpecialMetricsTest();
