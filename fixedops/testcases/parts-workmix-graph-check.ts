import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { fixedopsCommonLogin } from "./common/fixedops-common-login.ts";
import { PartsWorkmixSelectors as pw } from "../selectors/parts-work-mix.ts";
import { startLogger } from "../utilities/utils.ts";
const logger = await startLogger();
const errors: string[] = [];

function fixedOpsPartsWorkmixTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[AEC-FOCP-UI-FN-LD-0187] ${site.name} FixedOps Parts Workmix Graph Load Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "[AEC-FOCP-UI-FN-LD-0187]",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await partsWorkmixGraphLoadTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Parts Workmix Graph Load Test";
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
async function partsWorkmixGraphLoadTest(baseURL: string) {
  let browser = null;

  try {
    const oBrowser = await fixedopsCommonLogin(baseURL);
    const page = oBrowser.page;
    browser = oBrowser.browser;
    const navigationPromise = oBrowser.navigationPromise;
    await page.waitForSelector(pw.partsMenu);
    await page.click(pw.partsMenu);
    logger.info("Parts menu clicked");
    await page.waitForTimeout(5000);
    const partsWorkmixdashboard = await page.$x(pw.partsWorkmixMenu);
    await partsWorkmixdashboard[0].click();
    logger.info("Parts Workmix dashboard clicked");
    await page.waitForTimeout(15000);
    await navigationPromise;
    const workMixTab = await page.$x(pw.workMixTab);
    const workMixTabStatus = await page.evaluate(
      (el) => el.getAttribute("aria-selected"),
      workMixTab[0]
    );
    const workMixCharts = [
      pw.cPchart_1,
      pw.cPchart_2,
      pw.cPchart_3,
      pw.cPchart_4,
      pw.workMixChart_1,
      pw.workMixChart_2,
      pw.workMixChart_3,
      pw.workMixChart_4,
      pw.workMixChart_5,
      pw.workMixChart_6,
    ];

    if (workMixTabStatus) {
      for (let i = 0; i <= workMixCharts.length - 1; i++) {
        await page
          .waitForSelector(workMixCharts[i], {
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
      await workMixTab[0].click();
      await page.waitForTimeout(5000);
      for (let i = 0; i <= workMixCharts.length - 1; i++) {
        await page
          .waitForSelector(workMixCharts[i], {
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
    ts.assert(
      errors.length == 0,
      `Error in Parts Workmix: ${errors.join("\n")}`
    );
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsPartsWorkmixTest();
