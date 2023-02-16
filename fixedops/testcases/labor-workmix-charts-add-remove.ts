import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { LaborWorkMiss as lw } from "../selectors/labor-work-mix.ts";
import { fixedopsCommonLogin } from "./common/fixedops-common-login.ts";
import { startLogger, getRandomNumberBetween } from "../utilities/utils.ts";

const logger = startLogger();
const errors: string[] = [];

function fixedOpsLaborWorkMixTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[AEC-FOCP-UI-FN-LD-0112] ${site.name} FixedOps Labor Work Mix Page Charts Add Remove Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-UI-FN-LD-0112",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await laborWorkMixChartsAddRemoveTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Labor Work Mix Page Charts Add Remove Test";
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

async function laborWorkMixChartsAddRemoveTest(baseURL: string) {
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
    await page.waitForTimeout(4000);
    logger.info("labor expand collapse link clicked!!!");

    const laborWrkMix = await page.$x(lw.laborWorkMixLink);
    await laborWrkMix[0].click();
    await navigationPromise;
    await page.waitForTimeout(15000);
    logger.info("labor work mix link clicked!!!");
    const title = await page.title();

    if (title == "Labor Work Mix") {
      logger.info("labor work miss title verify success");

      const barChart = [
        lw.barChart_1,
        lw.barChart_2,
        lw.barChart_3,
        lw.barChart_4,
        lw.barChart_5,
        lw.barChart_6,
      ];
      const num = await getRandomNumberBetween(0, 5);
      const barchart_id = barChart[num];
      await page.waitForTimeout(5000);
      let addRemBtn = await page.$x(lw.wrkMixChartAddRemToFavBtn(num + 1));
      await page.waitForTimeout(5000);

      const btnStatus: string = await (
        await addRemBtn[0].getProperty("title")
      ).jsonValue();
      const favLink = await page.$x(lw.favNavLink);
      if (btnStatus.includes("Add to Favorites")) {
        let addRemBtn = await page.$x(lw.wrkMixChartAddRemToFavBtn(num + 1));
        await addRemBtn[0].click();
        await page.waitForTimeout(5000);

        await favLink[0].click();
        await navigationPromise;
        await page.waitForTimeout(12000);

        await page
          .waitForSelector(barchart_id, {
            visible: true,
            timeout: 4000,
          })
          .then(() => {
            logger.info(`chart ${num + 1} added to favorite success`);
          })
          .catch(() => {
            logger.error(`chart ${num + 1} added to favorite fail`);
            errors.push(`chart ${num + 1} added to favorite fail`);
          });
        await page.waitForTimeout(5000);
        const laborWrkMix = await page.$x(lw.laborWorkMixLink);
        await laborWrkMix[0].click();
        await navigationPromise;
        await page.waitForTimeout(10000);

        addRemBtn = await page.$x(lw.wrkMixChartAddRemToFavBtn(num + 1));
        await addRemBtn[0].click();
        await page.waitForTimeout(5000);

        await favLink[0].click();
        await navigationPromise;
        await page.waitForTimeout(12000);

        await page
          .waitForSelector(barchart_id, {
            visible: true,
            timeout: 4000,
          })
          .then(() => {
            logger.error(`chart ${num + 1} removed from favorite fail`);
            errors.push(`chart ${num + 1} removed from favorite fail`);
          })
          .catch(() => {
            logger.info(`chart ${num + 1} removed from favorite success`);
          });
        await laborWrkMix[0].click();
        await navigationPromise;
        await page.waitForTimeout(5000);
      } else if (btnStatus.includes("Remove from Favorites")) {
        await addRemBtn[0].click();
        await page.waitForTimeout(5000);
        await favLink[0].click();
        await navigationPromise;
        await page.waitForTimeout(12000);

        await page
          .waitForSelector(barchart_id, {
            visible: true,
            timeout: 4000,
          })
          .then(() => {
            logger.info(`chart ${num + 1} removed from favorite fail`);
            errors.push(`chart ${num + 1} removed from favorite fail`);
          })
          .catch(() => {
            logger.info(`chart ${num + 1} removed from favorite success`);
          });
        const laborWrkMix = await page.$x(lw.laborWorkMixLink);
        await laborWrkMix[0].click();
        await navigationPromise;
        await page.waitForTimeout(10000);
        addRemBtn = await page.$x(lw.wrkMixChartAddRemToFavBtn(num + 1));
        await addRemBtn[0].click();
        await page.waitForTimeout(5000);
        await favLink[0].click();
        await navigationPromise;
        await page.waitForTimeout(12000);

        await page
          .waitForSelector(barchart_id, {
            visible: true,
            timeout: 4000,
          })
          .then(() => {
            logger.info(`chart ${num + 1} added to favorite success`);
          })
          .catch(() => {
            logger.info(`chart ${num + 1} added to favorite fail`);
            errors.push(`chart ${num + 1} added to favorite fail`);
          });
        await page.waitForTimeout(5000);
        await laborWrkMix[0].click();
        await navigationPromise;
        await page.waitForTimeout(10000);
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
