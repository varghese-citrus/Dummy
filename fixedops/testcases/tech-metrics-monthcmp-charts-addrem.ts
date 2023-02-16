import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { AdvisorTechMetricsSelector as as } from "../selectors/advisor-tech-metrics.ts";
import { fixedopsCommonLogin } from "./common/fixedops-common-login.ts";
import { getRandomNumberBetween, startLogger } from "../utilities/utils.ts";

const logger = await startLogger();

const errors: string[] = [];

function fixedOpsTechMetricsTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[AEC-FOCP-UI-FN-LD-0003] ${site.name} FixedOps Tech Metrics Page Month Comparison Chart Add Remove Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-UI-FN-LD-0003",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await techMetricsPageMonthCmpChartAddRemTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Tech Metrics Page Month Comparison Chart Add Remove Test";
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

async function techMetricsPageMonthCmpChartAddRemTest(baseURL: string) {
  let browser = null;

  try {
    const oBrowser = await fixedopsCommonLogin(baseURL);
    const page = oBrowser.page;
    browser = oBrowser.browser;
    const navigationPromise = oBrowser.navigationPromise;

    await navigationPromise;
    await page.waitForTimeout(15000);

    await page.waitForTimeout(2000);
    await page.waitForSelector(as.techMetricsLink);
    await page.click(as.techMetricsLink);
    await navigationPromise;
    await page.waitForTimeout(15000);
    logger.info("tech metrics link clicked");

    const title = await page.title();

    if (title == "Technician Performance") {
      logger.info("Technician Performance title verify success");

      const charts = [
        as.technicianMonthCmpChart_1,
        as.technicianMonthCmpChart_2,
        as.technicianMonthCmpChart_3,
        as.technicianMonthCmpChart_4,
      ];

      await page.waitForSelector(as.technicianProductivityTab);
      await page.click(as.technicianProductivityTab);
      await page.waitForTimeout(5000);

      const monthCmp = await page.$x(as.monthCmpTab);
      await monthCmp[0].click();
      await navigationPromise;
      await page.waitForTimeout(10000);

      const monthSel1 = await page.$x(as.cmpMonthSelect_1);
      await monthSel1[0].click();
      await page.waitForTimeout(4000);

      const num1 = await getRandomNumberBetween(1, 12);

      const month1 = await page.$x(as.monthSelectLi(num1));
      await month1[0].click();
      await page.waitForTimeout(4000);
      logger.info("month 1 selected");

      const monthSel2 = await page.$x(as.cmpMonthSelect_2);
      await monthSel2[0].click();
      await page.waitForTimeout(4000);

      const num2 = await getRandomNumberBetween(1, 12);

      const month2 = await page.$x(as.monthSelectLi(num2));
      await month2[0].click();
      await page.waitForTimeout(4000);
      logger.info("month 2 selected");

      await page.waitForTimeout(20000);
      await navigationPromise;

      for (let i = 0; i <= charts.length - 1; i++) {
        const chart_id = charts[i];
        await page.waitForTimeout(5000);
        let addRemBtn = await page.$x(as.technicianMonthCmpAddRemBtn(i + 2));
        await page.waitForTimeout(5000);

        const btnStatus: string = await (
          await addRemBtn[0].getProperty("title")
        ).jsonValue();
        const favLink = await page.$x(as.favLink);
        if (btnStatus.includes("Add to Favorites")) {
          addRemBtn = await page.$x(as.technicianMonthCmpAddRemBtn(i + 2));
          await addRemBtn[0].click();
          await page.waitForTimeout(5000);

          await favLink[0].click();
          await navigationPromise;
          await page.waitForTimeout(15000);

          const chart = await page.$eval(chart_id, (elem) => {
            return elem.style.display !== "none";
          });
          await page.waitForTimeout(5000);
          chart
            ? logger.info(
                `comparison by month chart ${i + 1} added to favorite success`
              )
            : [
                logger.error(
                  `comparison by month chart ${i + 1} added to favorite fail`
                ),
                errors.push(
                  `comparison by month chart ${i + 1} added to favorite fail`
                ),
              ];

          await page.waitForTimeout(2000);
          await page.waitForSelector(as.techMetricsLink);
          await page.click(as.techMetricsLink);
          await navigationPromise;
          await page.waitForTimeout(10000);
          logger.info("tech metrics link clicked");

          let monthCmp = await page.$x(as.monthCmpTab);
          await monthCmp[0].click();
          await navigationPromise;
          await page.waitForTimeout(30000);

          addRemBtn = await page.$x(as.technicianMonthCmpAddRemBtn(i + 2));
          await addRemBtn[0].click();
          await page.waitForTimeout(5000);

          await favLink[0].click();
          await navigationPromise;
          await page.waitForTimeout(15000);

          try {
            const chart = await page.$eval(chart_id, (elem) => {
              return elem.style.display !== "none";
            });

            if (chart) {
              logger.error(
                `comparison by month chart ${i + 1} removed from favorite fail`
              );
              errors.push(
                `comparison by month chart ${i + 1} removed from favorite fail`
              );
            }
          } catch (error) {
            const errors: string[] = [];
            errors.push(error);
            const e = errors.find((x) => x === error);
            e
              ? logger.info(
                  `comparison by month chart ${
                    i + 1
                  } removed from favorite success`
                )
              : [
                  logger.error(
                    `comparison by month chart ${
                      i + 1
                    } removed from favorite fail`
                  ),
                  errors.push(
                    `comparison by month chart ${
                      i + 1
                    } removed from favorite fail`
                  ),
                ];
          }
          await page.waitForTimeout(2000);
          await page.waitForSelector(as.techMetricsLink);
          await page.click(as.techMetricsLink);
          await navigationPromise;
          await page.waitForTimeout(15000);

          monthCmp = await page.$x(as.monthCmpTab);
          await monthCmp[0].click();
          await navigationPromise;
          await page.waitForTimeout(30000);

          logger.info("tech metrics link clicked");
        } else if (btnStatus.includes("Remove from Favorites")) {
          await addRemBtn[0].click();
          await page.waitForTimeout(5000);

          await favLink[0].click();
          await navigationPromise;
          await page.waitForTimeout(15000);

          try {
            await page.$eval(chart_id, (elem) => {
              return elem.style.display !== "none";
            });
          } catch (error) {
            const errors: string[] = [];
            errors.push(error);
            const e = errors.find((x) => x === error);
            e
              ? logger.info(
                  `comparison by month chart ${
                    i + 1
                  } removed from favorite success`
                )
              : [
                  logger.error(
                    `comparison by month chart ${
                      i + 1
                    } removed from favorite fail`
                  ),
                  errors.push(
                    `comparison by month chart ${
                      i + 1
                    } removed from favorite fail`
                  ),
                ];

            await page.waitForTimeout(2000);
            await page.waitForSelector(as.techMetricsLink);
            await page.click(as.techMetricsLink);
            await navigationPromise;
            await page.waitForTimeout(15000);
            logger.info("tech metrics link clicked");

            let monthCmp = await page.$x(as.monthCmpTab);
            await monthCmp[0].click();
            await navigationPromise;
            await page.waitForTimeout(30000);

            addRemBtn = await page.$x(as.technicianMonthCmpAddRemBtn(i + 2));
            await addRemBtn[0].click();
            await page.waitForTimeout(5000);

            await page.waitForTimeout(2000);
            await favLink[0].click();
            await navigationPromise;
            await page.waitForTimeout(30000);

            const chart = await page.$eval(chart_id, (elem) => {
              return elem.style.display !== "none";
            });
            await page.waitForTimeout(5000);
            chart
              ? logger.info(
                  `comparison by month chart ${i + 1} added to favorite success`
                )
              : [
                  logger.error(
                    `comparison by month chart ${i + 1} added to favorite fail`
                  ),
                  errors.push(
                    `comparison by month chart ${i + 1} added to favorite fail`
                  ),
                ];
            await page.waitForTimeout(2000);
            await page.waitForSelector(as.techMetricsLink);
            await page.click(as.techMetricsLink);
            await navigationPromise;
            await page.waitForTimeout(15000);
            logger.info("tech metrics link clicked");
            monthCmp = await page.$x(as.monthCmpTab);
            await monthCmp[0].click();
            await navigationPromise;
            await page.waitForTimeout(30000);
          }
        }
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
