import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { CpSelectors as cps } from "../selectors/cp-overview.ts";
import { fixedopsCommonLogin } from "./common/fixedops-common-login.ts";
import { startLogger } from "../utilities/utils.ts";

const logger = startLogger();

const errors: string[] = [];

function fixedOpsCPOverviewDrilldownTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[AEC-FOCP-UI-FN-LD-0037] ${site.name} FixedOps Labor Overview View Detail Button Drill down Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-UI-FN-LD-0037",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await cpOverviewPageViewDetailBtnDrilldownTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Labor Overview View Detail Button Drill down Test";
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

async function cpOverviewPageViewDetailBtnDrilldownTest(baseURL: string) {
  let browser = null;

  try {
    const oBrowser = await fixedopsCommonLogin(baseURL);
    const page = oBrowser.page;
    browser = oBrowser.browser;
    const navigationPromise = oBrowser.navigationPromise;

    await page.waitForSelector(cps.cpsummary);
    await page.click(cps.cpsummary);
    logger.info("cp expand collapse link clicked!!!");
    await page.waitForTimeout(4000);

    await page.waitForSelector(cps.cpOverview);
    await page.click(cps.cpOverview);
    await navigationPromise;
    await page.waitForTimeout(12000);

    const title = await page.title();

    if (title == "CP Summary Overview") {
      logger.info("CP Summary Overview title verify success");

      const ids = [
        cps.viewDetailBtn1,
        cps.viewDetailBtn2,
        cps.viewDetailBtn3,
        cps.viewDetailBtn4,
        cps.viewDetailBtn5,
        cps.viewDetailBtn6,
      ];

      const elements = [cps.editBtn, cps.backBtn, cps.dataAsOf];
      const elementsName = ["edit button", "back button", "data as of"];

      for (let i = 0; i <= ids.length - 1; i++) {
        await page.waitForSelector(ids[i]);
        await page.click(ids[i]);
        await navigationPromise;
        await page.waitForTimeout(5000);

        const title = await page.title();

        if (title == "Overview") {
          logger.info(`view detail button ${i + 1} working properly`);
          await page
            .waitForXPath(cps.cpRevenueCalculation, {
              visible: true,
            })
            .then(() => {
              logger.info(`calculation table visible properly`);
            })
            .catch(() => {
              logger.error(`calculation table not visible properly`);
              errors.push(`calculation table not visible properly`);
            });

          await page.waitForXPath(cps.cpRevenueGraphLen);
          const x = await page.$x(cps.cpRevenueGraphLen);

          for (let j = 1; j <= x.length; j++) {
            await page
              .waitForXPath(cps.getRevenueGraphs(j + 1), {
                visible: true,
                timeout: 4000,
              })
              .then(() => {
                logger.info(`Graph ${j} visible properly`);
              })
              .catch(() => {
                logger.error(`Graph ${j} not visible properly`);
                errors.push(`Graph ${j} not visible properly`);
              });
          }
          await page.waitForTimeout(5000);
          for (let k = 0; k <= elements.length - 1; k++) {
            await page
              .waitForXPath(elements[k], {
                visible: true,
                timeout: 2000,
              })
              .then(() => {
                logger.info(`${elementsName[k]} displayed properly`);
              })
              .catch(() => {
                logger.info(`${elementsName[k]} not displayed properly`);
                errors.push(`${elementsName[k]} not displayed properly`);
              });

            await page.waitForTimeout(2000);
          }
        } else {
          logger.error(`view detail button ${i + 1} navigation failed`);
          errors.push(`view detail button ${i + 1} navigation failed`);
        }
        await page.goBack();
        await navigationPromise;
        await page.waitForTimeout(5000);
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
fixedOpsCPOverviewDrilldownTest();
