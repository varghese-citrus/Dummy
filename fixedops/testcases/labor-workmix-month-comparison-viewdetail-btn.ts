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
      name: `[AEC-FOCP-UI-FN-LD-0124] ${site.name} FixedOps Labor Work Mix Page Month Comparison View Detail Button Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-UI-FN-LD-0124",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await laborWorkMixPageMonthCmpViewDetailBtnTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Labor Work Mix Page Month Comparison View Detail Button Test";
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

async function laborWorkMixPageMonthCmpViewDetailBtnTest(baseURL: string) {
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
      logger.info("labor work miss title verify success");
      const monthWrkMix = await page.$x(lw.monthWrkMixTab);
      await monthWrkMix[0].click();
      await page.waitForTimeout(5000);
      const ids = [
        lw.monthWorkMixChartViewDetailBtn_1,
        lw.monthWorkMixChartViewDetailBtn_2,
        lw.monthWorkMixChartViewDetailBtn_3,
        lw.monthWorkMixChartViewDetailBtn_4,
        lw.monthWorkMixChartViewDetailBtn_5,
      ];

      for (let i = 0; i <= ids.length - 1; i++) {
        await page.waitForSelector(ids[i]);
        await page.click(ids[i]);
        await navigationPromise;
        await page.waitForTimeout(5000);
        const title = await page.title();
        await page.goBack();
        await navigationPromise;
        await page.waitForTimeout(5000);
        const monthWrkMix = await page.$x(lw.monthWrkMixTab);
        await monthWrkMix[0].click();
        await page.waitForTimeout(5000);
        title == "Overview"
          ? logger.info(
              `month work mix comparison chart view detail button ${
                i + 1
              } working properly`
            )
          : [
              logger.error(
                `month work mix comparison chart view detail button ${
                  i + 1
                } working properly`
              ),
              errors.push(
                `month work mix comparison chart view detail button ${
                  i + 1
                } working properly`
              ),
            ];
      }
    } else {
      logger.info("labor work miss title verify failed");
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
