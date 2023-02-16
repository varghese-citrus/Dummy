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
      name: `[AEC-FOCP-UI-FN-LD-0031] ${site.name} FixedOps CP Overview Page Charts Expand Collapse Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-UI-FN-LD-0031",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await cpOverviewPageChartsExpandCollapseTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Labor Overview Page Charts Expand Collapse Test";
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

async function cpOverviewPageChartsExpandCollapseTest(baseURL: string) {
  let browser = null;
  try {
    const oBrowser = await fixedopsCommonLogin(baseURL);
    const page = oBrowser.page;
    browser = oBrowser.browser;
    const navigationPromise = oBrowser.navigationPromise;

    await page.waitForSelector(cps.cpsummary);
    await page.click(cps.cpsummary);
    logger.info("cp expand collapse link clicked!!!");
    await page.waitForTimeout(5000);

    await page.waitForSelector(cps.cpOverview);
    await page.click(cps.cpOverview);
    await navigationPromise;
    await page.waitForTimeout(15000);

    const title = await page.title();
    if (title == "CP Summary Overview") {
      logger.info("CP Summary Overview title verify success");

      for (let i = 1; i <= 6; i++) {
        const expandEl = await page.$x(cps.expandX(i));
        const expandBtn = await page.waitForXPath(cps.expandX(i), {
          visible: true,
        });
        await page.waitForTimeout(4000);
        if (expandBtn != null) {
          logger.info(`expand button ${i} visible properly`);
          await page.waitForTimeout(4000);
          await expandEl[0].click();
          await navigationPromise;
          await page.waitForTimeout(5000);
          await page
            .waitForSelector(cps.expandCls, {
              visible: true,
              timeout: 4000,
            })
            .then(() => {
              logger.info(`container chart ${i} expand properly`);
            })
            .catch(() => {
              logger.info(`container chart ${i} not expand properly`);
              errors.push(`container chart ${i} not expand properly`);
            });

          await page.waitForTimeout(5000);
          const collapseEl = await page.$x(cps.collapseX);
          const collapseBtn = await page.waitForXPath(cps.collapseX, {
            visible: true,
          });
          if (collapseBtn != null) {
            logger.info(`collapse button ${i} visible properly`);
            await page.waitForTimeout(4000);
            await collapseEl[0].click();
            await navigationPromise;
            await page.waitForTimeout(5000);
            const popup = await page.$x(cps.popup);
            popup.length == 0
              ? logger.info(`container chart ${i} collapse properly`)
              : [
                  logger.info(`container chart ${i} not collapse properly`),
                  errors.push(`container chart ${i} not collapse properly`),
                ];
          } else {
            logger.error(`collapse button ${i} not visible properly`);
            errors.push(`collapse button ${i} not visible properly`);
          }
        } else {
          logger.error(`expand button not visible properly`);
          errors.push(`expand button not visible properly`);
        }
      }
    } else {
      logger.error("cp overview page title verify failed");
      errors.push("cp overview page title verify failed");
    }

    ts.assert(
      errors.length == 0,
      `Error in  CP Overview Page: ${errors.join("\n")}`
    );
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsCpOverviewTest();
