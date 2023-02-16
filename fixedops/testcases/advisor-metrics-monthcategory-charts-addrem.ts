import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { AdvisorTechMetricsSelector as as } from "../selectors/advisor-tech-metrics.ts";
import { fixedopsCommonLogin } from "./common/fixedops-common-login.ts";
import { getRandomNumberBetween, startLogger } from "../utilities/utils.ts";

const logger = startLogger();

const errors: string[] = [];

function fixedOpsAdvisorMetricsTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[AEC-FOCP-UI-FN-LD-0009] ${site.name} FixedOps Advisor Metrics Page Month Category Chart Add Remove Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-UI-FN-LD-0009",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await advisorMetricsPageMonthCatChartAddRemTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Advisor Metrics Page Month Category Chart Add Remove Test";
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

async function advisorMetricsPageMonthCatChartAddRemTest(baseURL: string) {
  let browser = null;

  try {
    const oBrowser = await fixedopsCommonLogin(baseURL);
    const page = oBrowser.page;
    browser = oBrowser.browser;
    const navigationPromise = oBrowser.navigationPromise;

    await navigationPromise;
    await page.waitForTimeout(15000);

    await page.waitForSelector(as.advisorMetricsLink);
    await page.click(as.advisorMetricsLink);
    await navigationPromise;
    await page.waitForTimeout(15000);
    logger.info("advisor link clicked!!!");

    const title = await page.title();

    if (title == "Service Advisor Performance") {
      logger.info("Service Advisor Performance title verify success");

      const serviceAdvisorPerformanceTab = await page.$x(
        as.serviceAdvisorPerformanceTab
      );
      await serviceAdvisorPerformanceTab[0].click();
      await page.waitForTimeout(10000);

      logger.info("service advisor performance tab clicked");
      let monthCatTab = await page.$x(as.categoryByMonthTab);
      await monthCatTab[0].click();
      await navigationPromise;
      await page.waitForTimeout(10000);

      const monthSel1 = await page.$x(as.monthCategorySel);
      await monthSel1[0].click();
      await page.waitForTimeout(4000);

      const num1 = await getRandomNumberBetween(1, 12);

      const month1 = await page.$x(as.monthSelectLi(num1));
      await month1[0].click();
      await page.waitForTimeout(4000);
      logger.info("month selected");

      await navigationPromise;
      await page.waitForTimeout(20000);

      const charts = [
        as.monthCatChart_1,
        as.monthCatChart_2,
        as.monthCatChart_3,
        as.monthCatChart_4,
        as.monthCatChart_5,
        as.monthCatChart_6,
        as.monthCatChart_7,
        as.monthCatChart_8,
        as.monthCatChart_9,
        as.monthCatChart_10,
      ];

      const num = await getRandomNumberBetween(0, 9);

      const chart_id = charts[num];
      await page.waitForTimeout(5000);
      let addRemBtn = await page.$x(as.monthCategoryAddRemBtn(num + 1));
      await page.waitForTimeout(5000);

      const btnStatus: string = await (
        await addRemBtn[0].getProperty("title")
      ).jsonValue();
      const favLink = await page.$x(as.favLink);
      if (btnStatus.includes("Add to Favorites")) {
        addRemBtn = await page.$x(as.monthCategoryAddRemBtn(num + 1));
        await addRemBtn[0].click();
        await page.waitForTimeout(5000);

        await favLink[0].click();
        await navigationPromise;
        await page.waitForTimeout(12000);

        await page
          .waitForSelector(chart_id, { visible: true, timeout: 4000 })
          .then(() => {
            logger.info(
              `category by month chart ${num + 1} added to favorite success`
            );
          })
          .catch(() => {
            logger.error(
              `category by month chart ${num + 1} added to favorite fail`
            );
            errors.push(
              `category by month chart ${num + 1} added to favorite fail`
            );
          });

        await page.waitForSelector(as.advisorMetricsLink);
        await page.click(as.advisorMetricsLink);
        await navigationPromise;
        await page.waitForTimeout(15000);
        logger.info("advisor link clicked");

        monthCatTab = await page.$x(as.categoryByMonthTab);

        await monthCatTab[0].click();
        await navigationPromise;
        await page.waitForTimeout(20000);

        addRemBtn = await page.$x(as.monthCategoryAddRemBtn(num + 1));
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
            logger.error(
              `category by month chart ${num + 1} removed from favorite fail`
            );
            errors.push(
              `category by month chart ${num + 1} removed from favorite fail`
            );
          })
          .catch(() => {
            logger.info(
              `category by month chart ${num + 1} removed from favorite success`
            );
          });

        await page.waitForSelector(as.advisorMetricsLink);
        await page.click(as.advisorMetricsLink);
        await navigationPromise;
        await page.waitForTimeout(15000);
        logger.info("advisor link clicked");

        monthCatTab = await page.$x(as.categoryByMonthTab);

        await monthCatTab[0].click();
        await navigationPromise;
        await page.waitForTimeout(20000);
      } else if (btnStatus.includes("Remove from Favorites")) {
        await addRemBtn[0].click();
        await page.waitForTimeout(5000);

        await favLink[0].click();
        await navigationPromise;
        await page.waitForTimeout(12000);

        await page
          .waitForSelector(chart_id, { visible: true, timeout: 4000 })
          .then(() => {
            logger.error(
              `category by month chart ${num + 1} removed from favorite fail`
            );
            errors.push(
              `category by month chart ${num + 1} removed from favorite fail`
            );
          })
          .catch(() => {
            logger.info(
              `category by month chart ${num + 1} removed from favorite success`
            );
          });
      }
    } else {
      logger.error("advisor metrics title verify failed");
      errors.push("advisor metrics title verify failed");
    }

    ts.assert(
      errors.length == 0,
      `Error in  Advisor Metrics Page: ${errors.join("\n")}`
    );
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsAdvisorMetricsTest();
