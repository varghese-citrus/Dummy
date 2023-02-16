import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { fixedopsCommonLogin } from "./common/fixedops-common-login.ts";
import { PartsWorkmixSelectors as pw } from "../selectors/parts-work-mix.ts";
import { getRandomNumberBetween } from "../utilities/utils.ts";
import { startLogger } from "../utilities/utils.ts";

const errors: string[] = [];
const logger = startLogger();

function fixedOpsPartsWorkmixTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[AEC-FOCP-UI-FN-LD-0196] ${site.name} FixedOps Parts Workmix Two Month Comparison Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "[AEC-FOCP-UI-FN-LD-0196]",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await partsWorkmixMonthComparisonTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Parts Workmix Two Month Comparison Test";
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
async function partsWorkmixMonthComparisonTest(baseURL: string) {
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
    const partsWrkMixMenu = await page.$x(pw.partsWorkmixMenu);
    await partsWrkMixMenu[0].click();
    logger.info("Parts workmix menu clicked");
    await navigationPromise;
    await page.waitForTimeout(15000);
    const title = await page.title();
    if (title == "Parts Work Mix") {
      logger.info("Parts workmix title verified success");
      await page.waitForTimeout(5000);
      const monthWrkMix = await page.$x(pw.monthComparisonTab);
      await monthWrkMix[0].click();
      logger.info("Two month comparison tab clicked!!!");
      await navigationPromise;
      await page.waitForTimeout(5000);
      const month_1Selector = await page.$x(pw.month_1Select);
      await month_1Selector[0].click();
      await page.waitForTimeout(5000);
      logger.info("Month 1 clicked!!!");
      const num_1 = await getRandomNumberBetween(1, 12);
      const month_1 = await page.$x(pw.getMonth(num_1));
      await month_1[0].click();
      await page.waitForTimeout(5000);
      logger.info("Selected month 1");
      const month_2Selector = await page.$x(pw.month_2Select);
      await month_2Selector[0].click();
      await page.waitForTimeout(5000);
      logger.info("Month 2 clicked!!!");
      const num_2 = await getRandomNumberBetween(1, 12);
      const month_2 = await page.$x(pw.getMonth(num_2));
      await month_2[0].click();
      await page.waitForTimeout(5000);
      logger.info("Selected month 2 ");
      const monthWrkMixStatus = await page.evaluate(
        (el) => el.getAttribute("aria-selected"),
        monthWrkMix[0]
      );
      const charts = [
        pw.monthWorkMixChart_1,
        pw.monthWorkMixChart_2,
        pw.monthWorkMixChart_3,
        pw.monthWorkMixChart_4,
        pw.monthWorkMixChart_5,
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
                `2 month work mix comparison chart ${i + 1} display properly`
              );
            })
            .catch(() => {
              logger.error(
                `2 month work mix comparison chart ${
                  i + 1
                } not display properly`
              );
              errors.push(
                `2 month work mix comparison chart ${
                  i + 1
                } not display properly`
              );
            });
        }
      }
      await page.waitForXPath(pw.monthDataAsOf);
      const x = await page.$x(pw.monthDataAsOf);
      const str: string = await (
        await x[0].getProperty("textContent")
      ).jsonValue();
      str.toString().split(":")[0].includes("Data as of")
        ? logger.info("Data as of properly visible")
        : [
            logger.error("Data as of not properly visible"),
            errors.push("Data as of not properly visible"),
          ];
    } else {
      logger.error("Parts Workmix page title verified failed"),
        errors.push("Parts Workmix page title verified failed");
    }
    ts.assert(
      errors.length == 0,
      `Error in  Parts Workmix: ${errors.join("\n")}`
    );
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsPartsWorkmixTest();
