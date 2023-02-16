import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { LaborWorkMiss as lw } from "../selectors/labor-work-mix.ts";
import { fixedopsCommonLogin } from "./common/fixedops-common-login.ts";
import { getRandomNumberBetween, startLogger } from "../utilities/utils.ts";

const logger = startLogger();
const errors: string[] = [];

function fixedOpsLaborWorkMixTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[AEC-FOCP-UI-FN-LD-0122] ${site.name} FixedOps Labor Work Mix Page Month Comparison Graphs Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-UI-FN-LD-0122",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await laborWorkMixPageMonthCompGraphsTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Labor Work Mix Page Month Comparison Graphs Test";
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

async function laborWorkMixPageMonthCompGraphsTest(baseURL: string) {
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
      const monthWrkMix = await page.$x(lw.monthWrkMixTab);
      await monthWrkMix[0].click();
      await page.waitForTimeout(5000);
      logger.info("month work mix comparison tab clicked");
      const monthSel1 = await page.$x(lw.month1Select);
      await monthSel1[0].click();
      await page.waitForTimeout(4000);
      const num1 = await getRandomNumberBetween(1, 12);
      const month1 = await page.$x(lw.getMonth(num1));
      await month1[0].click();
      await page.waitForTimeout(4000);
      logger.info("month 1 selected");
      const monthSel2 = await page.$x(lw.month2Select);
      await monthSel2[0].click();
      await page.waitForTimeout(4000);
      const num2 = await getRandomNumberBetween(1, 12);
      const month2 = await page.$x(lw.getMonth(num2));
      await month2[0].click();
      await page.waitForTimeout(4000);
      logger.info("month 2 selected");
      const monthWrkMixStatus = await page.evaluate(
        (el) => el.getAttribute("aria-selected"),
        monthWrkMix[0]
      );
      const charts = [
        lw.monthWrkMixChart_1,
        lw.monthWrkMixChart_2,
        lw.monthWrkMixChart_3,
        lw.monthWrkMixChart_4,
        lw.monthWrkMixChart_5,
      ];

      if (monthWrkMixStatus == true) {
        for (let i = 0; i <= charts.length - 1; i++) {
          await page
            .waitForSelector(charts[i], {
              visible: true,
              timeout: 4000,
            })
            .then(() => {
              logger.info(`cpCharts ${i + 1} display properly`);
            })
            .catch(() => {
              logger.error(`cpCharts ${i + 1} not display properly`);
              errors.push(`cpCharts ${i + 1} not display properly`);
            });
        }
      } else {
        await monthWrkMix[0].click();
        await page.waitForTimeout(10000);
        for (let i = 0; i <= charts.length - 1; i++) {
          await page
            .waitForSelector(charts[i], {
              visible: true,
              timeout: 4000,
            })
            .then(() => {
              logger.info(
                `2 month work miss comparison chart ${i + 1} display properly`
              );
            })
            .catch(() => {
              logger.info(
                `2 month work miss comparison chart ${
                  i + 1
                } not display properly`
              );
              errors.push(
                `2 month work miss comparison chart ${
                  i + 1
                } not display properly`
              );
            });
        }
      }
      ts.assert(
        errors.length == 0,
        `Error in Labor Workmix Page: ${errors.join("\n")}`
      );
    } else {
      logger.error("labor workmix title verify failed");
      errors.push("labor workmix title verify failed");
    }
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsLaborWorkMixTest();
