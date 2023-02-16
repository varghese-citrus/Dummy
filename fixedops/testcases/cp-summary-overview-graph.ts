import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { CpSelectors as cps } from "../selectors/cp-overview.ts";
import { fixedopsCommonLogin } from "./common/fixedops-common-login.ts";
import { startLogger } from "../utilities/utils.ts";

const logger = startLogger();

const errors: string[] = [];

function fixedOpsCpOverviewTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[AEC-FOCP-UI-FN-LD-0036] ${site.name} FixedOps CP Summary Overview Page Graphs Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-UI-FN-LD-0036",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await laborOverviewPageGraphsTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps CP Summary Overview Page Graphs Test";
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

async function laborOverviewPageGraphsTest(baseURL: string) {
  let browser = null;

  try {
    const oBrowser = await fixedopsCommonLogin(baseURL);
    const page = oBrowser.page;
    browser = oBrowser.browser;
    const navigationPromise = oBrowser.navigationPromise;

    await page.waitForSelector(cps.cpsummary);
    await page.click(cps.cpsummary);
    logger.info("labor expand collapse link clicked!!!");
    await page.waitForTimeout(4000);

    await page.waitForSelector(cps.cpOverview);
    await page.click(cps.cpOverview);
    await navigationPromise;
    await page.waitForTimeout(12000);

    const title = await page.title();

    if (title == "CP Summary Overview") {
      logger.info("CP Summary Overview title verify success");

      const ids = [
        cps.canvas_1,
        cps.canvas_2,
        cps.canvas_3,
        cps.canvas_4,
        cps.canvas_5,
        cps.canvas_6,
      ];

      for (let i = 0; i <= ids.length - 1; i++) {
        await page
          .waitForSelector(ids[i], {
            visible: true,
            timeout: 4000,
          })
          .then(() => {
            logger.info(`graph ${i + 1} displayed properly`);
          })
          .catch(() => {
            logger.info(`graph ${i + 1} not displayed properly`);
            errors.push(`graph ${i + 1} not displayed properly`);
          });
        await page.waitForTimeout(2000);
      }
    } else {
      logger.error("cp overview page title verify failed");
      errors.push("cp overview page title verify failed");
    }

    ts.assert(
      errors.length == 0,
      `Error in CP Overview Page: ${errors.join("\n")}`
    );
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsCpOverviewTest();
