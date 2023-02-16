import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { LaborWorkMiss as lw } from "../selectors/labor-work-mix.ts";
import { fixedopsCommonLogin } from "./common/fixedops-common-login.ts";
import { startLogger } from "../utilities/utils.ts";

const logger = startLogger();
const errors: string[] = [];

function fixedOpsLaborWorkmixTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[AEC-FOCP-UI-FN-LD-0136] ${site.name} FixedOps Labor Workmix Page View Detail Button Drill Down Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-UI-FN-LD-0136",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await laborWorkmixPageViewDetailBtnDrillDownTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Labor Workmix Page View Detail Button Drill Down Test";
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

async function laborWorkmixPageViewDetailBtnDrillDownTest(baseURL: string) {
  let browser = null;

  try {
    const oBrowser = await fixedopsCommonLogin(baseURL);
    const page = oBrowser.page;
    browser = oBrowser.browser;
    const navigationPromise = oBrowser.navigationPromise;
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
      logger.info("Labor Work Mix title verify success");

      const ids = [
        lw.wrkMixChartViewDetailBtn_1,
        lw.wrkMixChartViewDetailBtn_2,
        lw.wrkMixChartViewDetailBtn_3,
        lw.wrkMixChartViewDetailBtn_4,
        lw.wrkMixChartViewDetailBtn_5,
        lw.wrkMixChartViewDetailBtn_6,
      ];

      const elements = [lw.editBtn, lw.backBtn, lw.dataAsOf];
      const elementsName = ["edit button", "back button", "data as of"];

      for (let i = 0; i <= ids.length - 1; i++) {
        await page.waitForSelector(ids[i]);
        await page.click(ids[i]);
        await navigationPromise;
        await page.waitForTimeout(5000);

        const title = await page.title();

        if (title == "Overview") {
          logger.info(`view detail button ${i + 1} navigation success`);
          await page.waitForTimeout(5000);
          await page
            .waitForSelector(lw.overviewContainer, {
              visible: true,
              timeout: 4000,
            })
            .then(() => {
              logger.info("labor workmix overview container display properly");
            })
            .catch(() => {
              logger.error(
                "labor workmix overview container not display properly"
              );
              errors.push(
                "labor workmix overview container not display properly"
              );
            });
          await page.waitForTimeout(2000);

          await page
            .waitForXPath(lw.canvas, {
              visible: true,
              timeout: 2000,
            })
            .then(() => {
              logger.info(`graph  displayed properly`);
            })
            .catch(() => {
              logger.error(`graph not displayed properly`);
              errors.push(`graph not displayed properly`);
            });
          await page.waitForTimeout(2000);
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
                logger.error(`${elementsName[k]} not displayed properly`);
                errors.push(`${elementsName[k]} not displayed properly`);
              });
            await page.waitForTimeout(2000);
          }
          await page.goBack();
          await navigationPromise;
          await page.waitForTimeout(8000);
        } else {
          logger.error(`view detail button ${i + 1} navigation failed`);
          errors.push(`view detail button ${i + 1}  navigation failed`);
        }
      }
    } else {
      logger.error("labor overview page title verify failed");
      errors.push("labor overview page title verify failed");
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
fixedOpsLaborWorkmixTest();
