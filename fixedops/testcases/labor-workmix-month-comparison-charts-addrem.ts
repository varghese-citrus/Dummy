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
      name: `[AEC-FOCP-UI-FN-LD-0118] ${site.name} FixedOps Labor Work Mix Page Month Comparison Charts Add Remove Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-UI-FN-LD-0118",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await laborWorkMixPageMonthCmpAddRemoveTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Labor Work Mix Page Month Comparison Charts Add Remove Test";
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

async function laborWorkMixPageMonthCmpAddRemoveTest(baseURL: string) {
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

      const monthComCharts = [
        lw.monthWrkMixChart_1,
        lw.monthWrkMixChart_2,
        lw.monthWrkMixChart_3,
        lw.monthWrkMixChart_4,
        lw.monthWrkMixChart_5,
      ];

      await page.waitForXPath(lw.monthWrkMixTab, { visible: true });
      const monthWrkMix = await page.$x(lw.monthWrkMixTab);
      await monthWrkMix[0].click();
      await page.waitForTimeout(8000);

      logger.info("month work mix comparison tab clicked");

      for (let i = 4; i <= monthComCharts.length - 1; i++) {
        const chart_id = monthComCharts[i];
        await page.waitForTimeout(5000);
        let addRemBtn = await page.$x(
          lw.monthWorkMixChartAddRemFavorite(i + 2)
        );
        await page.waitForTimeout(5000);
        const btnStatus: string = await (
          await addRemBtn[0].getProperty("title")
        ).jsonValue();
        const favLink = await page.$x(lw.favNavLink);
        if (btnStatus.includes("Add to Favorites")) {
          addRemBtn = await page.$x(lw.monthWorkMixChartAddRemFavorite(i + 2));
          await addRemBtn[0].click();
          await page.waitForTimeout(5000);

          await favLink[0].click();
          await navigationPromise;
          await page.waitForTimeout(8000);

          await page
            .waitForSelector(chart_id, {
              visible: true,
              timeout: 4000,
            })
            .then(() => {
              logger.info(
                `month work mix comparison chart ${
                  i + 1
                } added to favorite success`
              );
            })
            .catch(() => {
              logger.error(
                `month work mix comparison chart ${
                  i + 1
                } added to favorite fail`
              );
              errors.push(
                `month work mix comparison chart ${
                  i + 1
                } added to favorite fail`
              );
            });
          await page.waitForTimeout(5000);
          const laborWrkMix = await page.$x(lw.laborWorkMixLink);
          await laborWrkMix[0].click();
          await navigationPromise;
          await page.waitForTimeout(10000);

          let monthWrkMix = await page.$x(lw.monthWrkMixTab);
          await monthWrkMix[0].click();
          await navigationPromise;
          await page.waitForTimeout(10000);

          addRemBtn = await page.$x(lw.monthWorkMixChartAddRemFavorite(i + 2));
          await addRemBtn[0].click();
          await page.waitForTimeout(5000);
          await favLink[0].click();
          await navigationPromise;
          await page.waitForTimeout(12000);

          await page
            .waitForSelector(chart_id, {
              visible: true,
              timeout: 4000,
            })
            .then(() => {
              logger.info(
                `month work mix comparison chart ${
                  i + 1
                } removed from favorite fail`
              );
              errors.push(
                `month work mix comparison chart ${
                  i + 1
                } removed from favorite fail`
              );
            })
            .catch(() => {
              logger.info(
                `month work mix comparison chart ${
                  i + 1
                } removed from favorite success`
              );
            });
          await laborWrkMix[0].click();
          await navigationPromise;
          await page.waitForTimeout(10000);

          monthWrkMix = await page.$x(lw.monthWrkMixTab);
          await monthWrkMix[0].click();
          await navigationPromise;
          await page.waitForTimeout(10000);
        } else if (btnStatus.includes("Remove from Favorites")) {
          await addRemBtn[0].click();
          await page.waitForTimeout(5000);
          await favLink[0].click();
          await navigationPromise;
          await page.waitForTimeout(12000);

          await page
            .waitForSelector(chart_id, {
              visible: true,
              timeout: 4000,
            })
            .then(() => {
              logger.info(
                `month work mix comparison chart ${
                  i + 1
                } removed from favorite fail`
              );
              errors.push(
                `month work mix comparison chart ${
                  i + 1
                } removed from favorite fail`
              );
            })
            .catch(() => {
              logger.info(
                `month work mix comparison chart ${
                  i + 1
                } removed from favorite success`
              );
            });

          const laborWrkMix = await page.$x(lw.laborWorkMixLink);
          await laborWrkMix[0].click();
          await navigationPromise;
          await page.waitForTimeout(10000);
          let monthWrkMix = await page.$x(lw.monthWrkMixTab);
          await monthWrkMix[0].click();
          await navigationPromise;
          await page.waitForTimeout(10000);
          addRemBtn = await page.$x(lw.monthWorkMixChartAddRemFavorite(i + 2));
          await addRemBtn[0].click();
          await page.waitForTimeout(5000);
          await favLink[0].click();
          await navigationPromise;
          await page.waitForTimeout(15000);

          await page
            .waitForSelector(chart_id, {
              visible: true,
              timeout: 4000,
            })
            .then(() => {
              logger.info(
                `month work mix comparison chart ${
                  i + 1
                } added to favorite success`
              );
            })
            .catch(() => {
              logger.info(
                `month work mix comparison chart ${
                  i + 1
                } added to favorite fail`
              );
              errors.push(
                `month work mix comparison chart ${
                  i + 1
                } added to favorite fail`
              );
            });
          await page.waitForTimeout(5000);
          await laborWrkMix[0].click();
          await navigationPromise;
          await page.waitForTimeout(5000);
          monthWrkMix = await page.$x(lw.monthWrkMixTab);
          await monthWrkMix[0].click();
          await page.waitForTimeout(5000);
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
