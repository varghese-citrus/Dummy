import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { LaborWorkMiss as lw } from "../selectors/labor-work-mix.ts";
import { fixedopsCommonLogin } from "./common/fixedops-common-login.ts";
import { startLogger } from "../utilities/utils.ts";

const logger = startLogger();
const errors: string[] = [];

function fixedOpsLaborWorkMixTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[AEC-FOCP-UI-FN-LD-0113] ${site.name} FixedOps Labor Work Mix Page Charts Expand Collapse Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-UI-FN-LD-0113",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await laborWorkMixPageChartsExpandCollapseTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Labor Work Mix Page Charts Expand Collapse Test";
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

async function laborWorkMixPageChartsExpandCollapseTest(baseURL: string) {
  let browser = null;

  try {
    const oBrowser = await fixedopsCommonLogin(baseURL);
    const page = oBrowser.page;
    browser = oBrowser.browser;
    const navigationPromise = oBrowser.navigationPromise;
    await page.reload();
    await navigationPromise;
    await page.waitForTimeout(10000);
    await page.waitForSelector(lw.labor);
    await page.click(lw.labor);
    logger.info("labor expand collapse link clicked!!!");
    await page.waitForTimeout(4000);
    const laborWrkMix = await page.$x(lw.laborWorkMixLink);
    await laborWrkMix[0].click();
    await navigationPromise;
    await page.waitForTimeout(15000);
    logger.info("labor work mix link clicked!!!");

    const title = await page.title();

    if (title == "Labor Work Mix") {
      logger.info("labor workmix title verify success");
      for (let i = 1; i <= 6; i++) {
        const expandEl = await page.$x(lw.wrkMixChartExpandBtn(i));
        const expandBtn = await page.waitForXPath(lw.wrkMixChartExpandBtn(i), {
          visible: true,
        });
        if (expandBtn != null) {
          logger.info(`expand button ${i} visible properly`);
          await page.waitForTimeout(4000);
          await expandEl[0].click();
          await navigationPromise;
          await page.waitForTimeout(5000);
          await page
            .waitForSelector(lw.wrkMixChartExpandCls, {
              visible: true,
              timeout: 4000,
            })
            .then(() => {
              logger.info(`chart ${i} expand properly`);
            })
            .catch(() => {
              logger.error(`chart ${i} not expand properly`);
              errors.push(`chart ${i} not expand properly`);
            });
          await page.waitForTimeout(5000);
          const collapseEl = await page.$x(lw.collapseBtn);
          const collapseBtn = await page.waitForXPath(lw.collapseBtn, {
            visible: true,
          });
          if (collapseBtn != null) {
            logger.info(`collapse button ${i} visible properly`);
            await page.waitForTimeout(5000);
            await collapseEl[0].click();
            await navigationPromise;
            await page.waitForTimeout(5000);
            const popup = await page.$x(lw.popup);
            popup.length == 0
              ? logger.info(`chart ${i} collapse properly`)
              : [
                  logger.error(`chart ${i} not collapse properly`),
                  errors.push(`chart ${i} not collapse properly`),
                ];
          } else {
            logger.error(`collapse button ${i} not visible properly`);
            errors.push(`collapse button ${i} not visible properly`);
          }
        } else {
          logger.error(`expand button ${i} not visible`);
          errors.push(`expand button ${i} not visible`);
        }
      }
    } else {
      logger.error("labor work miss title verify failed");
      errors.push("labor work miss title verify failed");
    }
    ts.assert(
      errors.length == 0,
      `Error in Labor Workmix Page: ${errors.join("\n")}`
    );
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsLaborWorkMixTest();
