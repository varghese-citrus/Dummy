import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { DiscountMetricsSelector as ds } from "../selectors/discount-metrics.ts";
import { fixedopsCommonLogin } from "./common/fixedops-common-login.ts";
import { startLogger, getRandomNumberBetween } from "../utilities/utils.ts";

const logger = startLogger();
const errors: string[] = [];

function fixedOpsDiscountMetricsTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[AEC-FOCP-UI-FN-LD-0052] ${site.name} FixedOps Discount Metrics Page Month Trend Chart Add Remove Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-UI-FN-LD-0052",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await advisorMetricsPageMonthTrendChartAddRemTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Advisor Metrics Page Month Trend Chart Add Remove Test";
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

async function advisorMetricsPageMonthTrendChartAddRemTest(baseURL: string) {
  let browser = null;

  try {
    const oBrowser = await fixedopsCommonLogin(baseURL);
    const page = oBrowser.page;
    browser = oBrowser.browser;
    const navigationPromise = oBrowser.navigationPromise;

    await page.waitForSelector(ds.disMetricsLink);
    await page.click(ds.disMetricsLink);
    await navigationPromise;
    await page.waitForTimeout(15000);
    logger.info("discount link clicked!!!");

    const title = await page.title();

    if (title == "Discount") {
      logger.info("Discount metrics title verify success");

      const monthTrendTab = await page.$x(ds.MonthTrendTab);
      await monthTrendTab[0].click();
      await navigationPromise;
      await page.waitForTimeout(15000);
      logger.info("13 month trend tab clicked");

      const canvas = [
        ds.canvas_1,
        ds.canvas_2,
        ds.canvas_3,
        ds.canvas_4,
        ds.canvas_5,
        ds.canvas_6,
        ds.canvas_7,
      ];

      const num = await getRandomNumberBetween(0, 6);

      const chartIdXpath = await page.$x(ds.monthTrendChartNumber(num + 1));
      const chartId: string = await (
        await chartIdXpath[0].getProperty("textContent")
      ).jsonValue();
      await page
        .waitForXPath(ds.noDataAlertMsg(chartId), {
          visible: true,
          timeout: 4000,
        })
        .then(() => {
          logger.warn(
            `there is no data in the graph,skipping graph ${
              num + 1
            } add/remove to favorite check`
          );
        })
        .catch(async () => {
          const chart_id = canvas[num];
          await page.waitForTimeout(5000);
          let addRemBtn = await page.$x(ds.chartAddRemBtn(num + 1));
          await page.waitForTimeout(5000);

          const btnStatus: string = await (
            await addRemBtn[0].getProperty("title")
          ).jsonValue();
          const favLink = await page.$x(ds.favLink);
          if (btnStatus.includes("Add to Favorites")) {
            addRemBtn = await page.$x(ds.chartAddRemBtn(num + 1));
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
                logger.info(`chart ${num + 1} added to favorite success`);
              })
              .catch(() => {
                logger.error(`chart ${num + 1} added to favorite fail`);
                errors.push(`chart ${num + 1} added to favorite fail`);
              });

            await page.waitForSelector(ds.disMetricsLink);
            await page.click(ds.disMetricsLink);
            await navigationPromise;
            await page.waitForTimeout(12000);
            logger.info("discount link clicked!!!");

            const [mnthtrend] = await page.$x(ds.MonthTrendTab);
            await mnthtrend.click();
            await navigationPromise;
            await page.waitForTimeout(15000);
            logger.info("Month trend tab clicked");

            addRemBtn = await page.$x(ds.chartAddRemBtn(num + 1));
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
                logger.error(`chart ${num + 1} removed from favorite fail`);
                errors.push(`chart ${num + 1} removed from favorite fail`);
              })
              .catch(() => {
                logger.info(`chart ${num + 1} removed from favorite success`);
              });

            await page.waitForSelector(ds.disMetricsLink);
            await page.click(ds.disMetricsLink);
            await navigationPromise;
            await page.waitForTimeout(10000);
            logger.info("discount link clicked!!!");
            const [Mnthtrend] = await page.$x(ds.MonthTrendTab);
            await Mnthtrend.click();
            await navigationPromise;
            await page.waitForTimeout(15000);
            logger.info("Month trend tab clicked");
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
                logger.error(`chart ${num + 1} removed from favorite fail`);
                errors.push(`chart ${num + 1} removed from favorite fail`);
              })
              .catch(() => {
                logger.info(`chart ${num + 1} removed from favorite success`);
              });

            await page.waitForSelector(ds.disMetricsLink);
            await page.click(ds.disMetricsLink);
            await navigationPromise;
            await page.waitForTimeout(12000);
            logger.info("discount link clicked!!!");

            const [mnthtrend] = await page.$x(ds.MonthTrendTab);
            await mnthtrend.click();
            await navigationPromise;
            await page.waitForTimeout(15000);
            logger.info("Month trend tab clicked");

            addRemBtn = await page.$x(ds.chartAddRemBtn(num + 1));
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
                logger.info(`chart ${num + 1} added to favorite success`);
              })
              .catch(() => {
                logger.error(`chart ${num + 1} added to favorite fail`);
                errors.push(`chart ${num + 1} added to favorite fail`);
              });
            await page.waitForTimeout(5000);
            await page.waitForSelector(ds.disMetricsLink);
            await page.click(ds.disMetricsLink);
            await navigationPromise;
            await page.waitForTimeout(12000);
            logger.info("discount link clicked!!!");
            const [Mnthtrend] = await page.$x(ds.MonthTrendTab);
            await Mnthtrend.click();
            await navigationPromise;
            await page.waitForTimeout(15000);
            logger.info("Month trend tab clicked");
          }
        });
    } else {
      logger.error("Discount metrics title verify failed");
      errors.push("Discount Metrics title verify failed");
    }

    ts.assert(
      errors.length == 0,
      `Error in  Discount Metrics Page: ${errors.join("\n")}`
    );
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsDiscountMetricsTest();
