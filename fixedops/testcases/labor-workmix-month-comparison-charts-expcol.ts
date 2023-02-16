import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { LaborWorkMiss as lw } from "../selectors/labor-work-mix.ts";
import { fixedopsCommonLogin } from "./common/fixedops-common-login.ts";
import { startLogger } from "../utilities/utils.ts";

const logger = startLogger();
const errors: string[] = [];

function fixedOpsLaborWorkMixPartOneTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[AEC-FOCP-UI-FN-LD-0119] ${site.name} FixedOps Labor Work Mix Page Month Comparison Charts Expand Collapse Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-UI-FN-LD-0119",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await laborWorkMixPagePartOneTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Labor Work Mix Page Month Comparison Charts Expand Collapse Test";
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

async function laborWorkMixPagePartOneTest(baseURL: string) {
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
      logger.info("labor work miss title verify success");

      const monthWrkMix = await page.$x(lw.monthWrkMixTab);
      await monthWrkMix[0].click();
      await page.waitForTimeout(5000);

      for (let i = 2; i <= 6; i++) {
        let expandEl = await page.$x(lw.monthWorkMixChartExpandBtn(i));

        const expandBtn = await page.waitForXPath(
          lw.monthWorkMixChartExpandBtn(i),
          {
            visible: true,
          }
        );

        if (expandBtn != null) {
          logger.info(`expand button ${i - 1} visible properly`);
          await page.waitForTimeout(4000);
          expandEl = await page.$x(lw.monthWorkMixChartExpandBtn(i));
          await expandEl[0].click();
          await navigationPromise;
          await page.waitForTimeout(5000);

          await page
            .waitForSelector(lw.monthWorkMixChartExpCls, {
              visible: true,
              timeout: 4000,
            })
            .then(() => {
              logger.info(`chart ${i - 1} expand properly`);
            })
            .catch(() => {
              logger.error(`chart ${i - 1} not expand properly`);
              errors.push(`chart ${i - 1} not expand properly`);
            });
          await page.waitForTimeout(5000);
          const collapseEl = await page.$x(lw.monthWorkMixChartCollapseBtn);
          const collapseBtn = await page.waitForXPath(
            lw.monthWorkMixChartCollapseBtn,
            {
              visible: true,
              timeout: 4000,
            }
          );
          if (collapseBtn != null) {
            logger.info(`collapse button ${i - 1} visible properly`);
            await page.waitForTimeout(5000);
            await collapseEl[0].click();
            await navigationPromise;
            await page.waitForTimeout(5000);
            const popup = await page.$x(lw.popup);
            popup.length == 0
              ? logger.info(`chart ${i - 1} collapse properly`)
              : [
                  logger.error(`chart ${i - 1} not collapse properly`),
                  errors.push(`chart ${i - 1} not collapse properly`),
                ];
          } else {
            logger.error(`collapse button ${i - 1} not visible properly`);
            errors.push(`collapse button ${i - 1} not visible properly`);
          }
        } else {
          logger.error(`expand button ${i - 1} not visible`);
          errors.push(`expand button ${i - 1} not visible`);
        }
      }
    } else {
      logger.error("labor work miss title verify failed");
      errors.push("labor work miss title verify failed");
    }
    ts.assert(
      errors.length == 0,
      `Error in  Labor Workmix Page: ${errors.join("\n")}`
    );
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsLaborWorkMixPartOneTest();
