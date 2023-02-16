import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { fixedopsCommonLogin } from "./common/fixedops-common-login.ts";
import { PartsWorkmixSelectors as pw } from "../selectors/parts-work-mix.ts";
import { startLogger, getRandomNumberBetween } from "../utilities/utils.ts";

const logger = startLogger();
const errors: string[] = [];

function fixedOpsPartsWorkmixTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[AEC-FOCP-UI-FN-LD-0189] ${site.name} FixedOps Parts Workmix 2 Month Comparison Chart Add And Remove From Favorite Check`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "[AEC-FOCP-UI-FN-LD-0189]",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await partsWorkmixMonthComparisonChartAddRemoveFavoriteCheck(
            site.baseURL
          );
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Parts Workmix 2 Month Comparison Chart Add And Remove From Favorite Check";
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
async function partsWorkmixMonthComparisonChartAddRemoveFavoriteCheck(
  baseURL: string
) {
  let browser = null;

  try {
    const oBrowser = await fixedopsCommonLogin(baseURL);
    const page = oBrowser.page;
    browser = oBrowser.browser;
    const navigationPromise = oBrowser.navigationPromise;
    await page.waitForSelector(pw.partsMenu);
    await page.click(pw.partsMenu);
    logger.info("Parts Menu clicked");
    await page.waitForTimeout(5000);
    const partsWorkmixMenu = await page.$x(pw.partsWorkmixMenu);
    await partsWorkmixMenu[0].click();
    logger.info("Parts Workmix menu clicked");
    await navigationPromise;
    await page.waitForTimeout(20000);
    const title = await page.title();
    if (title == "Parts Work Mix") {
      logger.info("Parts workmix title verified");
      await page.waitForSelector(pw.monthComparison);
      await page.click(pw.monthComparison);
      await page.waitForTimeout(5000);
      const monthComparisonChart = [
        pw.monthWorkMixChart_1,
        pw.monthWorkMixChart_2,
        pw.monthWorkMixChart_3,
        pw.monthWorkMixChart_4,
        pw.monthWorkMixChart_5,
      ];
      const num = await getRandomNumberBetween(0, 4);
      const chart_id = monthComparisonChart[num];
      await page.waitForTimeout(5000);
      let addRemBtn = await page.$x(
        pw.monthWorkMixChartAddRemFavorite(num + 2)
      );
      await page.waitForTimeout(5000);
      const btnStatus: string = await (
        await addRemBtn[0].getProperty("title")
      ).jsonValue();
      const favMenu = await page.$x(pw.favMenu);
      if (btnStatus.includes("Add to Favorites")) {
        addRemBtn = await page.$x(pw.monthWorkMixChartAddRemFavorite(num + 2));
        await addRemBtn[0].click();
        await page.waitForTimeout(5000);
        await favMenu[0].click();
        await navigationPromise;
        await page.waitForTimeout(20000);
        await page
          .waitForSelector(chart_id, {
            visible: true,
            timeout: 4000,
          })
          .then(() => {
            logger.info(
              `month work mix comparison chart ${
                num + 1
              } added to favorite success`
            );
          })
          .catch(() => {
            logger.error(
              `month work mix comparison chart ${
                num + 1
              } added to favorite fail`
            );
            errors.push(
              `month work mix comparison chart ${
                num + 1
              } added to favorite fail`
            );
          });
        await page.waitForTimeout(5000);
        const partsWorkmixMenu = await page.$x(pw.partsWorkmixMenu);
        await partsWorkmixMenu[0].click();
        logger.info("Parts Workmix menu clicked");
        await page.waitForTimeout(5000);
        await page.waitForSelector(pw.monthComparison);
        await page.click(pw.monthComparison);
        await navigationPromise;
        await page.waitForTimeout(15000);
        addRemBtn = await page.$x(pw.monthWorkMixChartAddRemFavorite(num + 2));
        await addRemBtn[0].click();
        await page.waitForTimeout(5000);
        await favMenu[0].click();
        await navigationPromise;
        await page.waitForTimeout(12000);
        await page
          .waitForSelector(chart_id, { visible: true, timeout: 4000 })
          .then(() => {
            logger.error(
              `month work mix comparison chart ${
                num + 1
              } removed from favorite fail`
            );
            errors.push(
              `month work mix comparison chart ${
                num + 1
              } removed from favorite fail`
            );
          })
          .catch(() => {
            logger.info(
              `month work mix comparison chart ${
                num + 1
              } removed from favorite success`
            );
          });
      } else if (btnStatus.includes("Remove from Favorites")) {
        await addRemBtn[0].click();
        await page.waitForTimeout(5000);
        await favMenu[0].click();
        await navigationPromise;
        await page.waitForTimeout(10000);
        await page
          .waitForSelector(chart_id, { visible: true, timeout: 4000 })
          .then(() => {
            logger.error(
              `month work mix comparison chart ${
                num + 1
              } removed from favorite fail`
            );
            errors.push(
              `month work mix comparison chart ${
                num + 1
              } removed from favorite fail`
            );
          })
          .catch(() => {
            logger.info(
              `month work mix comparison chart ${
                num + 1
              } removed from favorite success`
            );
          });
        const partsWorkmix = await page.$x(pw.partsWorkmixMenu);
        await partsWorkmix[0].click();
        await navigationPromise;
        await page.waitForTimeout(10000);
        await page.waitForSelector(pw.monthComparison);
        await page.click(pw.monthComparison);
        await navigationPromise;
        await page.waitForTimeout(10000);
        addRemBtn = await page.$x(pw.monthWorkMixChartAddRemFavorite(num + 2));
        await addRemBtn[0].click();
        await page.waitForTimeout(5000);
        await favMenu[0].click();
        await navigationPromise;
        await page.waitForTimeout(12000);
        await page
          .waitForSelector(chart_id, { visible: true, timeout: 4000 })
          .then(() => {
            logger.info(
              `month work mix comparison chart ${
                num + 1
              } added to favorite success`
            );
          })
          .catch(() => {
            logger.error(
              `month work mix comparison chart ${
                num + 1
              } added to favorite fail`
            );
            errors.push(
              `month work mix comparison chart ${
                num + 1
              } added to favorite fail`
            );
          });
        await partsWorkmix[0].click();
        await page.waitForTimeout(5000);
        await page.waitForSelector(pw.monthComparison);
        await page.click(pw.monthComparison);
        await page.waitForTimeout(5000);
      }
    } else {
      logger.error("Parts workmix title verified fail");
      errors.push("Parts workmix title verified fail");
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
