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
      name: `[AEC-FOCP-UI-FN-LD-0045] ${site.name} FixedOps Discount  Metrics Page By Service Advisor Chart Add Remove Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-UI-FN-LD-0045",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await advisorMetricsPageByServiceAdvisorChartAddRemTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Advisor Metrics Page By Service Advisor Chart Add Remove Test";
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

async function advisorMetricsPageByServiceAdvisorChartAddRemTest(
  baseURL: string
) {
  let browser = null;

  try {
    const oBrowser = await fixedopsCommonLogin(baseURL);
    const page = oBrowser.page;
    browser = oBrowser.browser;
    const navigationPromise = oBrowser.navigationPromise;
    await navigationPromise;
    await page.waitForTimeout(15000);

    await page.waitForSelector(ds.disMetricsLink);
    await page.click(ds.disMetricsLink);
    await navigationPromise;
    await page.waitForTimeout(12000);
    logger.info("discount link clicked!!!");

    const title = await page.title();

    if (title == "Discount") {
      logger.info("Discount metrics title verify success");

      const byServiceAdvisorTab = await page.$x(ds.byServiceAdvisorTab);
      await byServiceAdvisorTab[0].click();
      await page.waitForTimeout(15000);
      logger.info("By Service Advisor tab clicked");

      const canvas = [
        ds.canvas_serv_1,
        ds.canvas_serv_2,
        ds.canvas_serv_3,
        ds.canvas_serv_4,
      ];

      const num = await getRandomNumberBetween(0, 4);

      const chart_id = canvas[num];
      await page.waitForTimeout(5000);
      let addRemBtn = await page.$x(ds.chartByservAdvAddRemBtn(num + 1));
      await page.waitForTimeout(5000);

      const btnStatus: string = await (
        await addRemBtn[0].getProperty("title")
      ).jsonValue();
      const favLink = await page.$x(ds.favLink);
      if (btnStatus.includes("Add to Favorites")) {
        addRemBtn = await page.$x(ds.chartByservAdvAddRemBtn(num + 1));
        await addRemBtn[0].click();
        await page.waitForTimeout(5000);

        await favLink[0].click();
        await navigationPromise;
        await page.waitForTimeout(12000);

        await page
          .waitForSelector(chart_id, { visible: true, timeout: 4000 })
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

        const byServiceAdvisorTab4 = await page.$x(ds.byServiceAdvisorTab);
        await byServiceAdvisorTab4[0].click();
        await page.waitForTimeout(12000);
        logger.info("By Service Advisor tab clicked");

        addRemBtn = await page.$x(ds.chartByservAdvAddRemBtn(num + 1));
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

        const byServiceAdvisorTab3 = await page.$x(ds.byServiceAdvisorTab);
        await byServiceAdvisorTab3[0].click();
        await page.waitForTimeout(12000);
        logger.info("By Service Advisor tab clicked");
      } else if (btnStatus.includes("Remove from Favorites")) {
        await addRemBtn[0].click();
        await page.waitForTimeout(5000);

        await favLink[0].click();
        await navigationPromise;
        await page.waitForTimeout(12000);

        await page
          .waitForSelector(chart_id, { visible: true, timeout: 4000 })
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

        const byServiceAdvisorTab2 = await page.$x(ds.byServiceAdvisorTab);
        await byServiceAdvisorTab2[0].click();
        await page.waitForTimeout(12000);
        logger.info("By Service Advisor tab clicked");

        addRemBtn = await page.$x(ds.chartByservAdvAddRemBtn(num + 1));
        await addRemBtn[0].click();
        await page.waitForTimeout(5000);

        await favLink[0].click();
        await navigationPromise;
        await page.waitForTimeout(12000);

        await page
          .waitForSelector(chart_id, { visible: true, timeout: 4000 })
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

        const byServiceAdvisorTab = await page.$x(ds.byServiceAdvisorTab);
        await byServiceAdvisorTab[0].click();
        await page.waitForTimeout(12000);
        logger.info("By Service Advisor tab clicked");
      }
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
