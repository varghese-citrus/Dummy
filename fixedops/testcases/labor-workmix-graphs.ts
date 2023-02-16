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
      name: `[AEC-FOCP-UI-FN-LD-0117] ${site.name} FixedOps Labor Work Mix Page Graphs Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-UI-FN-LD-0117",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await laborWorkMixPageGraphsTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Labor Work Mix Page Graphs Test";
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

async function laborWorkMixPageGraphsTest(baseURL: string) {
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
    await page.waitForTimeout(10000);
    logger.info("labor work mix link clicked!!!");
    const title = await page.title();
    if (title == "Labor Work Mix") {
      logger.info("labor workmix title verify success");

      const wrkMix = await page.$x(lw.workMixTab);

      const wrkMixStatus = await page.evaluate(
        (el) => el.getAttribute("aria-selected"),
        wrkMix[0]
      );

      const wrkMixCharts = [
        lw.cpchart_1,
        lw.cpchart_2,
        lw.cpchart_3,
        lw.cpchart_4,
        lw.barChart_1,
        lw.barChart_2,
        lw.barChart_3,
        lw.barChart_4,
        lw.barChart_5,
        lw.barChart_6,
      ];

      await page.reload();
      await navigationPromise;
      await page.waitForTimeout(8000);

      if (wrkMixStatus) {
        for (let i = 0; i <= wrkMixCharts.length - 1; i++) {
          await page
            .waitForSelector(wrkMixCharts[i], {
              visible: true,
              timeout: 4000,
            })
            .then(() => {
              logger.info(`chart ${i + 1} display properly`);
            })
            .catch(() => {
              logger.error(`chart ${i + 1} not display properly`);
              errors.push(`chart ${i + 1} not display properly`);
            });
        }
      } else {
        await wrkMix[0].click();
        await page.waitForTimeout(5000);
        for (let i = 0; i <= wrkMixCharts.length - 1; i++) {
          await page
            .waitForSelector(wrkMixCharts[i], {
              visible: true,
              timeout: 4000,
            })
            .then(() => {
              logger.info(`chart ${i + 1} display properly`);
            })
            .catch(() => {
              logger.error(`chart ${i + 1} not display properly`);
              errors.push(`chart ${i + 1} not display properly`);
            });
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
fixedOpsLaborWorkMixTest();
