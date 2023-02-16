import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { SpecialMetricsSelectors as sm } from "../selectors/special-metrics.ts";
import { fixedopsCommonLogin } from "./common/fixedops-common-login.ts";
import { startLogger, getRandomNumberBetween } from "../utilities/utils.ts";

const logger = startLogger();
const errors: string[] = [];

function fixedOpsSpecialMetricsTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[AEC-FOCP-UI-FN-LD-0218] ${site.name} FixedOps Special Metrics Page Chart Add Remove Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-UI-FN-LD-0218",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await specialMetricsPageChartAddRemTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Special Metrics Page Chart Add Remove Test";
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

async function specialMetricsPageChartAddRemTest(baseURL: string) {
  let browser = null;

  try {
    const oBrowser = await fixedopsCommonLogin(baseURL);
    const page = oBrowser.page;
    browser = oBrowser.browser;
    const navigationPromise = oBrowser.navigationPromise;
    await page.waitForSelector(sm.specialMetricsLink);
    await page.click(sm.specialMetricsLink);
    await navigationPromise;
    await page.waitForTimeout(15000);
    logger.info("special metrics link clicked!!!");
    const title = await page.title();
    if (title == "Special Metrics") {
      logger.info("Special Metrics title verify success");
      const canvas = [
        sm.canvas_1,
        sm.canvas_2,
        sm.canvas_3,
        sm.canvas_4,
        sm.canvas_5,
        sm.canvas_6,
        sm.canvas_7,
        sm.canvas_8,
        sm.canvas_9,
        sm.canvas_10,
        sm.canvas_11,
      ];
      await page.waitForSelector(sm.resetBtn);
      await page.click(sm.resetBtn);
      logger.info("reset button clicked");
      await page.waitForTimeout(15000);
      const num = await getRandomNumberBetween(0, 10);
      const chartIdXpath = await page.$x(sm.chartNumber(num + 1));
      const chartId: string = await (
        await chartIdXpath[0].getProperty("textContent")
      ).jsonValue();
      await page
        .waitForXPath(sm.noDataAlertMsg(chartId), {
          visible: true,
          timeout: 4000,
        })
        .then(() => {
          logger.warn(
            `there is no data in the graph ${num + 1},skipping graph ${
              num + 1
            } add/remove to favorite check`
          );
        })
        .catch(async () => {
          const chart_id = canvas[num];
          await page.waitForTimeout(5000);
          let addRemBtn = await page.$x(sm.chartAddRemBtn(num + 1));

          const btnStatus: string = await (
            await addRemBtn[0].getProperty("id")
          ).jsonValue();
          const favLink = await page.$x(sm.favLink);
          if (btnStatus.includes("Add-to-Favorites")) {
            addRemBtn = await page.$x(sm.chartAddRemBtn(num + 1));
            await addRemBtn[0].click();
            await page.waitForTimeout(5000);

            await favLink[0].click();
            await navigationPromise;
            await page.waitForTimeout(20000);
            await page
              .waitForSelector(chart_id, {
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
            await page.waitForSelector(sm.specialMetricsLink);
            await page.click(sm.specialMetricsLink);
            await navigationPromise;
            await page.waitForTimeout(15000);
            logger.info("special metrics link clicked!!!");
            addRemBtn = await page.$x(sm.chartAddRemBtn(num + 1));
            await addRemBtn[0].click();
            await page.waitForTimeout(5000);
            await favLink[0].click();
            await navigationPromise;
            await page.waitForTimeout(20000);

            await page
              .waitForSelector(chart_id, {
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
            await page.waitForSelector(sm.specialMetricsLink);
            await page.click(sm.specialMetricsLink);
            await navigationPromise;
            await page.waitForTimeout(15000);
            logger.info("special metrics link clicked!!!");
          } else if (btnStatus.includes("Remove-from-Favorites")) {
            await addRemBtn[0].click();
            await page.waitForTimeout(5000);
            await favLink[0].click();
            await navigationPromise;
            await page.waitForTimeout(20000);
            await page
              .waitForSelector(chart_id, {
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
            await page.waitForSelector(sm.specialMetricsLink);
            await page.click(sm.specialMetricsLink);
            await navigationPromise;
            await page.waitForTimeout(15000);
            logger.info("special metrics link clicked!!!");
            addRemBtn = await page.$x(sm.chartAddRemBtn(num + 1));
            await addRemBtn[0].click();
            await page.waitForTimeout(5000);
            await favLink[0].click();
            await navigationPromise;
            await page.waitForTimeout(20000);
            await page
              .waitForSelector(chart_id, {
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
            await page.waitForSelector(sm.specialMetricsLink);
            await page.click(sm.specialMetricsLink);
            await navigationPromise;
            await page.waitForTimeout(15000);
            logger.info("special metrics link clicked");
          }
        });
    } else {
      logger.error("Special Metrics title verify failed");
      errors.push("Special Metrics title verify failed");
    }
    ts.assert(
      errors.length == 0,
      `Error in Special Metrics Page: ${errors.join("\n")}`
    );
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsSpecialMetricsTest();
