import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { AdvisorTechMetricsSelector as as } from "../selectors/advisor-tech-metrics.ts";
import { fixedopsCommonLogin } from "./common/fixedops-common-login.ts";
import { getRandomNumberBetween, startLogger } from "../utilities/utils.ts";

const logger = startLogger();

const errors: string[] = [];

function fixedOpsTechMetricsTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[AEC-FOCP-UI-FN-LD-0245] ${site.name} FixedOps Tech Metrics Page Month Trend Chart Add Remove Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-UI-FN-LD-0245",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await techMetricsPageMonthTrendChartAddRemTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Tech Metrics Page Month Trend Chart Add Remove Test";
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

async function techMetricsPageMonthTrendChartAddRemTest(baseURL: string) {
  let browser = null;

  try {
    const oBrowser = await fixedopsCommonLogin(baseURL);
    const page = oBrowser.page;
    browser = oBrowser.browser;
    const navigationPromise = oBrowser.navigationPromise;

    await navigationPromise;
    await page.waitForTimeout(15000);

    await page.waitForSelector(as.techMetricsLink);
    await page.click(as.techMetricsLink);
    await navigationPromise;
    await page.waitForTimeout(15000);
    logger.info("tech metrics link clicked");

    const title = await page.title();

    if (title == "Technician Performance") {
      logger.info("Technician Performance title verify success");

      const charts = [
        as.technicianMonthTrendChart_1,
        as.technicianMonthTrendChart_2,
        as.technicianMonthTrendChart_3,
        as.technicianMonthTrendChart_4,
      ];

      await page.waitForSelector(as.technicianProductivityTab);
      await page.click(as.technicianProductivityTab);
      await page.waitForTimeout(5000);
      logger.info("technician productivity tab clicked");

      const monthTrend = await page.$x(as.monthTrendTab);
      await monthTrend[0].click();
      await navigationPromise;
      await page.waitForTimeout(10000);

      const t = await page.$x(as.technicianSelect);
      await t[0].click();
      await page.waitForTimeout(4000);

      let num;
      let technician;
      let technicianSelectLiStatus;
      let flag = 0;

      let i = 1;
      do {
        num = await getRandomNumberBetween(1, 20);
        technician = await page.$x(as.technicianSelectLi(num));
        await page.waitForTimeout(2000);
        technicianSelectLiStatus = await page.evaluate(
          (el) => el.getAttribute("data-active"),
          technician[0]
        );
        await page.waitForTimeout(2000);

        if (technicianSelectLiStatus == "true") {
          flag = 1;
        } else {
          i++;
        }
        if (flag == 1) {
          break;
        }
      } while (i > 0);

      await technician[0].click();
      await page.waitForTimeout(15000);

      const index = await getRandomNumberBetween(0, 3);
      const chart_id = charts[index];
      await page.waitForTimeout(5000);
      let addRemBtn = await page.$x(
        as.technicianMonthTrendAddRemBtn(index + 1)
      );
      await page.waitForTimeout(5000);

      const btnStatus: string = await (
        await addRemBtn[0].getProperty("id")
      ).jsonValue();
      const favLink = await page.$x(as.favLink);
      if (btnStatus.includes("Add-to-Favorites")) {
        addRemBtn = await page.$x(as.technicianMonthTrendAddRemBtn(index + 1));
        await addRemBtn[0].click();
        await page.waitForTimeout(5000);

        await favLink[0].click();
        await navigationPromise;
        await page.waitForTimeout(15000);

        await page
          .waitForSelector(chart_id, { visible: true, timeout: 4000 })
          .then(() => {
            logger.info(
              `13 month trend chart ${index + 1} added to favorite success`
            );
          })
          .catch(() => {
            logger.error(
              `13 month trend chart ${index + 1} added to favorite fail`
            );
            errors.push(
              `13 month trend chart ${index + 1} added to favorite fail`
            );
          });
        await page.waitForTimeout(2000);
        await page.waitForSelector(as.techMetricsLink);
        await page.click(as.techMetricsLink);
        await navigationPromise;
        await page.waitForTimeout(20000);
        logger.info("tech metrics link clicked");

        addRemBtn = await page.$x(as.technicianMonthTrendAddRemBtn(index + 1));
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
            logger.error(
              `13 month trend chart ${index + 1} removed from favorite fail`
            );
            errors.push(
              `13 month trend chart ${index + 1} removed from favorite fail`
            );
          })
          .catch(() => {
            logger.info(
              `13 month trend chart ${index + 1} removed from favorite success`
            );
          });

        await page.waitForTimeout(2000);
        await page.waitForSelector(as.techMetricsLink);
        await page.click(as.techMetricsLink);
        await navigationPromise;
        await page.waitForTimeout(15000);
        logger.info("tech metrics link clicked");
      } else if (btnStatus.includes("Remove-from-Favorites")) {
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
            logger.error(
              `13 month trend chart ${i + 1} removed from favorite fail`
            );
            errors.push(
              `13 month trend chart ${i + 1} removed from favorite fail`
            );
          })
          .catch(() => {
            logger.info(
              `13 month trend chart ${i + 1} removed from favorite success`
            );
          });
        await page.waitForTimeout(2000);
        await page.waitForSelector(as.techMetricsLink);
        await page.click(as.techMetricsLink);
        await navigationPromise;
        await page.waitForTimeout(15000);
        logger.info("tech metrics link clicked");

        addRemBtn = await page.$x(as.technicianMonthTrendAddRemBtn(i + 1));
        await addRemBtn[0].click();
        await page.waitForTimeout(5000);

        await favLink[0].click();
        await navigationPromise;
        await page.waitForTimeout(30000);

        await page
          .waitForSelector(chart_id, {
            visible: true,
            timeout: 4000,
          })
          .then(() => {
            logger.info(
              `13 month trend chart ${i + 1} added to favorite success`
            );
          })
          .catch(() => {
            logger.error(
              `13 month trend chart ${i + 1} added to favorite fail`
            );
            errors.push(`13 month trend chart ${i + 1} added to favorite fail`);
          });

        await page.waitForTimeout(5000);
        await page.waitForSelector(as.techMetricsLink);
        await page.click(as.techMetricsLink);
        await navigationPromise;
        await page.waitForTimeout(15000);
        logger.info("tech metrics link clicked");
      }
    } else {
      logger.info("Technician Performance title verify failed");
      errors.push("Technician Performance title verify failed");
    }

    ts.assert(
      errors.length == 0,
      `Error in Tech Metrics Page: ${errors.join("\n")}`
    );
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsTechMetricsTest();
