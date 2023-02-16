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
      name: `[AEC-FOCP-UI-FN-LD-0012] ${site.name} FixedOps Advisor Metrics Page Month Comparison Chart Add Remove Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-UI-FN-LD-0012",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await advisorMetricsPageMonthCmpChartAddRemTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Advisor Metrics Page Month Comparison Chart Add Remove Test";
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

async function advisorMetricsPageMonthCmpChartAddRemTest(baseURL: string) {
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

      let monthCmpTab = await page.$x(as.comparisonByMonthTab);

      await monthCmpTab[0].click();
      await navigationPromise;
      await page.waitForTimeout(10000);

      const monthSel1 = await page.$x(as.monthComparisonSel_1);
      await monthSel1[0].click();
      await page.waitForTimeout(4000);

      const num1 = await getRandomNumberBetween(1, 12);
      const month1 = await page.$x(as.monthSelectLi(num1));
      await month1[0].click();
      await page.waitForTimeout(4000);
      logger.info("month 1 selected");

      const monthSel2 = await page.$x(as.monthComparisonSel_2);
      await monthSel2[0].click();
      await page.waitForTimeout(4000);

      const num2 = await getRandomNumberBetween(1, 12);
      const month2 = await page.$x(as.monthSelectLi(num2));
      await month2[0].click();
      await page.waitForTimeout(4000);
      logger.info("month 2 selected");

      await navigationPromise;
      await page.waitForTimeout(8000);

      const charts = [
        as.monthCmpChart_1,
        as.monthCmpChart_2,
        as.monthCmpChart_3,
        as.monthCmpChart_4,
        as.monthCmpChart_5,
        as.monthCmpChart_6,
        as.monthCmpChart_7,
        as.monthCmpChart_8,
        as.monthCmpChart_9,
        as.monthCmpChart_10,
        as.monthCmpChart_11,
        as.monthCmpChart_12,
      ];

      const num = await getRandomNumberBetween(0, 11);

      const chart_id = charts[num];
      await page.waitForTimeout(5000);
      let addRemBtn = await page.$x(as.monthCmpAddRemBtn(num + 1));
      await page.waitForTimeout(5000);

      const btnStatus: string = await (
        await addRemBtn[0].getProperty("title")
      ).jsonValue();
      const favLink = await page.$x(as.favLink);
      if (btnStatus.includes("Add to Favorites")) {
        addRemBtn = await page.$x(as.monthCmpAddRemBtn(num + 1));
        await addRemBtn[0].click();
        await page.waitForTimeout(5000);

        await favLink[0].click();
        await navigationPromise;
        await page.waitForTimeout(12000);

        await page
          .waitForSelector(chart_id, { visible: true, timeout: 4000 })
          .then(() => {
            logger.info(`comparison by month chart added to favorite success`);
          })
          .catch(() => {
            logger.error(`comparison by month chart added to favorite fail`);
            errors.push(`comparison by month chart added to favorite fail`);
          });
        await page.waitForTimeout(5000);
        await page.waitForSelector(as.advisorMetricsLink);
        await page.click(as.advisorMetricsLink);
        await navigationPromise;
        await page.waitForTimeout(15000);
        logger.info("advisor link clicked");

        monthCmpTab = await page.$x(as.comparisonByMonthTab);
        await monthCmpTab[0].click();
        await navigationPromise;
        await page.waitForTimeout(12000);

        addRemBtn = await page.$x(as.monthCmpAddRemBtn(num + 1));
        await addRemBtn[0].click();
        await page.waitForTimeout(5000);

        await favLink[0].click();
        await navigationPromise;
        await page.waitForTimeout(12000);

        await page
          .waitForSelector(chart_id, { visible: true, timeout: 4000 })
          .then(() => {
            logger.error(
              `comparison by month chart removed from favorite fail`
            );
            errors.push(`comparison by month chart removed from favorite fail`);
          })
          .catch(() => {
            logger.info(
              `comparison by month chart removed from favorite success`
            );
          });

        // try {
        //   const chart = await page.$eval(chart_id, (elem) => {
        //     return elem.style.display !== "none";
        //   });

        //   if (chart) {
        //     logger.error(
        //       `comparison by month chart removed from favorite fail`
        //     );
        //     errors.push(`comparison by month chart removed from favorite fail`);
        //   }
        // } catch (error) {
        //   const errors: string[] = [];
        //   errors.push(error);
        //   const e = errors.find((x) => x === error);
        //   e
        //     ? logger.info(
        //         `comparison by month chart removed from favorite success`
        //       )
        //     : [
        //         logger.error(
        //           `comparison by month chart removed from favorite fail`
        //         ),
        //         errors.push(
        //           `comparison by month chart removed from favorite fail`
        //         ),
        //       ];
        // }
        await page.waitForSelector(as.advisorMetricsLink);
        await page.click(as.advisorMetricsLink);
        await navigationPromise;
        await page.waitForTimeout(15000);
        logger.info("advisor link clicked");

        monthCmpTab = await page.$x(as.comparisonByMonthTab);
        await monthCmpTab[0].click();
        await navigationPromise;
        await page.waitForTimeout(12000);
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
              `comparison by month chart removed from favorite fail`
            );
            errors.push(`comparison by month chart removed from favorite fail`);
          })
          .catch(() => {
            logger.info(
              `comparison by month chart removed from favorite success`
            );
          });
        // try {
        //   await page.$eval(chart_id, (elem) => {
        //     return elem.style.display !== "none";
        //   });
        // } catch (error) {
        //   const errors: string[] = [];
        //   errors.push(error);
        //   const e = errors.find((x) => x === error);
        //   e
        //     ? logger.info(
        //         `comparison by month chart removed from favorite success`
        //       )
        //     : [
        //         logger.error(
        //           `comparison by month chart removed from favorite fail`
        //         ),
        //         errors.push(
        //           `comparison by month chart removed from favorite fail`
        //         ),
        //       ];

        //   await page.waitForSelector(as.advisorMetricsLink);
        //   await page.click(as.advisorMetricsLink);
        //   await navigationPromise;
        //   await page.waitForTimeout(15000);
        //   logger.info("advisor link clicked");

        //   monthCmpTab = await page.$x(as.comparisonByMonthTab);
        //   await monthCmpTab[0].click();
        //   await navigationPromise;
        //   await page.waitForTimeout(12000);

        //   addRemBtn = await page.$x(as.monthCmpAddRemBtn(num + 1));
        //   await addRemBtn[0].click();
        //   await page.waitForTimeout(5000);

        //   await page.waitForTimeout(2000);
        //   await favLink[0].click();
        //   await navigationPromise;
        //   await page.waitForTimeout(12000);

        //   const chart = await page.$eval(chart_id, (elem) => {
        //     return elem.style.display !== "none";
        //   });
        //   await page.waitForTimeout(5000);
        //   chart
        //     ? logger.info(`comparison by month chart added to favorite success`)
        //     : [
        //         logger.error(
        //           `comparison by month chart added to favorite fail`
        //         ),
        //         errors.push(`comparison by month chart added to favorite fail`),
        //       ];
        //   await page.waitForSelector(as.advisorMetricsLink);
        //   await page.click(as.advisorMetricsLink);
        //   await navigationPromise;
        //   await page.waitForTimeout(15000);
        //   logger.info("advisor link clicked");

        //   monthCmpTab = await page.$x(as.comparisonByMonthTab);

        //   await monthCmpTab[0].click();
        //   await navigationPromise;
        //   await page.waitForTimeout(12000);
        // }
      }
    } else {
      logger.info("advisor metrics title verify failed");
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
