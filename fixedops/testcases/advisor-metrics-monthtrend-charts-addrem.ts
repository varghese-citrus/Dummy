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
      name: `[AEC-FOCP-UI-FN-LD-0016] ${site.name} FixedOps Advisor Metrics Page Month Trend Chart Add Remove Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-UI-FN-LD-0016",
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
      const num = await getRandomNumberBetween(1, 12);
      const chartDetail = [
        {
          id: 1276,
          chart: as.monthTrendChart_1,
          addRemBtn: as.monthTrendAddRemBtn(num),
        },
        {
          id: 1277,
          chart: as.monthTrendChart_2,
          addRemBtn: as.monthTrendAddRemBtn(num),
        },
        {
          id: 1278,
          chart: as.monthTrendChart_3,
          addRemBtn: as.monthTrendAddRemBtn(num),
        },
        {
          id: 1279,
          chart: as.monthTrendChart_4,
          addRemBtn: as.monthTrendAddRemBtn(num),
        },
        {
          id: 1280,
          chart: as.monthTrendChart_5,
          addRemBtn: as.monthTrendAddRemBtn(num),
        },
        {
          id: 1281,
          chart: as.monthTrendChart_6,
          addRemBtn: as.monthTrendAddRemBtn(num),
        },
        {
          id: 1282,
          chart: as.monthTrendChart_7,
          addRemBtn: as.monthTrendAddRemBtn(num),
        },
        {
          id: 1283,
          chart: as.monthTrendChart_8,
          addRemBtn: as.monthTrendAddRemBtn(num),
        },
        {
          id: 1284,
          chart: as.monthTrendChart_9,
          addRemBtn: as.monthTrendAddRemBtn(num),
        },
        {
          id: 1285,
          chart: as.monthTrendChart_10,
          addRemBtn: as.monthTrendAddRemBtn(num),
        },
        {
          id: 1286,
          chart: as.monthTrendChart_11,
          addRemBtn: as.monthTrendAddRemBtn(num),
        },
        {
          id: 1315,
          chart: as.monthTrendChart_12,
          addRemBtn: as.monthTrendAddRemBtn(num),
        },
      ];

      const chartNumXpath = await page.$x(as.monthTrendChartNumber(num));
      await page.waitForTimeout(5000);

      const chartNum = await (
        await chartNumXpath[0].getProperty("textContent")
      ).jsonValue();
      await page.waitForTimeout(5000);

      const chartObject = chartDetail.filter((e) => {
        return e.id === Number(chartNum);
      });

      const chart_id = chartObject[0].chart;

      await page.waitForTimeout(5000);
      let addRemBtn = await page.$x(chartObject[0].addRemBtn);
      await page.waitForTimeout(2000);

      const btnStatus: string = await (
        await addRemBtn[0].getProperty("title")
      ).jsonValue();
      const favLink = await page.$x(as.favLink);
      if (btnStatus.includes("Add to Favorites")) {
        addRemBtn = await page.$x(chartObject[0].addRemBtn);

        await page.evaluate((element) => {
          element.scrollIntoView(
            0,
            parseInt(element.getBoundingClientRect().y)
          );
        }, addRemBtn[0]);
        await page.waitForTimeout(4000);
        await addRemBtn[0].click();
        await page.waitForTimeout(5000);

        await favLink[0].click();
        await navigationPromise;
        await page.waitForTimeout(25000);

        await page
          .waitForSelector(chart_id, { visible: true, timeout: 4000 })
          .then(() => {
            logger.info(
              `13 month trend chart ${chartObject[0].id} added to favorite success`
            );
          })
          .catch(() => {
            logger.error(
              `13 month trend chart ${chartObject[0].id} added to favorite fail`
            );
            errors.push(
              `13 month trend chart ${chartObject[0].id} added to favorite fail`
            );
          });

        await page.waitForSelector(as.advisorMetricsLink);
        await page.click(as.advisorMetricsLink);
        await navigationPromise;
        await page.waitForTimeout(20000);
        logger.info("advisor link clicked");

        addRemBtn = await page.$x(chartObject[0].addRemBtn);
        await page.evaluate((element) => {
          element.scrollIntoView(
            0,
            parseInt(element.getBoundingClientRect().y)
          );
        }, addRemBtn[0]);
        await page.waitForTimeout(4000);
        await addRemBtn[0].click();
        await page.waitForTimeout(5000);

        await favLink[0].click();
        await navigationPromise;
        await page.waitForTimeout(15000);

        await page
          .waitForSelector(chart_id, { visible: true, timeout: 4000 })
          .then(() => {
            logger.error(
              `13 month trend chart ${chartObject[0].id} removed from favorite fail`
            );
            errors.push(
              `13 month trend chart ${chartObject[0].id} removed from favorite fail`
            );
          })
          .catch(() => {
            logger.info(
              `13 month trend chart ${chartObject[0].id} removed from favorite success`
            );
          });

        await page.waitForSelector(as.advisorMetricsLink);
        await page.click(as.advisorMetricsLink);
        await navigationPromise;
        await page.waitForTimeout(20000);
        logger.info("advisor link clicked");
      } else if (btnStatus.includes("Remove from Favorites")) {
        addRemBtn = await page.$x(chartObject[0].addRemBtn);
        await page.evaluate((element) => {
          element.scrollIntoView(
            0,
            parseInt(element.getBoundingClientRect().y)
          );
        }, addRemBtn[0]);
        await page.waitForTimeout(4000);
        await addRemBtn[0].click();
        await page.waitForTimeout(5000);

        await favLink[0].click();
        await navigationPromise;
        await page.waitForTimeout(15000);

        await page
          .waitForSelector(chart_id, { visible: true, timeout: 4000 })
          .then(() => {
            logger.error(
              `13 month trend chart ${chartObject[0].id} removed from favorite fail`
            );
            errors.push(
              `13 month trend chart ${chartObject[0].id} removed from favorite fail`
            );
          })
          .catch(() => {
            logger.info(
              `13 month trend chart ${chartObject[0].id} removed from favorite success`
            );
          });
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
