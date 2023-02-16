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
      name: `[AEC-FOCP-UI-FN-LD-0246] ${site.name} FixedOps Tech Metrics Page Month Trend Chart Common Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-UI-FN-LD-0246",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await techMetricsPageMonthTrendChartCommonTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Tech Metrics Page Month Trend Chart Common Test";
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

async function techMetricsPageMonthTrendChartCommonTest(baseURL: string) {
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

      const chartDetails = [
        {
          id: 1352,
          name: "Tech Productivity - All Sold Hours",
        },
        {
          id: 1345,
          name: "Tech Productivity – CP Sold Hours",
        },
        {
          id: 1348,
          name: "Job Count",
        },
        {
          id: 1347,
          name: "Job Count %",
        },
      ];

      await page.waitForSelector(as.technicianProductivityTab);
      await page.click(as.technicianProductivityTab);
      await page.waitForTimeout(5000);

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
      await page.waitForTimeout(10000);

      for (let i = 0; i <= chartDetails.length - 1; i++) {
        await page.waitForTimeout(5000);
        const chartNameXpath = await page.$x(
          as.technicianMonthTrendChartNames(i + 1)
        );
        const chartNumXpath = await page.$x(
          as.technicianMonthTrendChartNumber(i + 1)
        );

        await page.waitForTimeout(5000);

        const chartName: string = await (
          await chartNameXpath[0].getProperty("textContent")
        ).jsonValue();
        await page.waitForTimeout(5000);

        const chartNum = await (
          await chartNumXpath[0].getProperty("textContent")
        ).jsonValue();
        await page.waitForTimeout(5000);

        const data = chartDetails[i];

        if (data.name.trim() && chartNum == data.id) {
          logger.info(
            `chart name ${chartName} and number ${chartNum} verify success`
          );
        } else {
          logger.info(
            `chart name ${chartName} and number ${chartNum} verify failed`
          );
          errors.push(
            `chart name ${chartName} and number ${chartNum} verify failed`
          );
        }

        await page
          .waitForXPath(as.technicianMonthTrendInfoIcon(i + 2), {
            visible: true,
            timeout: 2000,
          })
          .then(() => {
            logger.info(`info icon ${i + 1} visible properly`);
          })
          .catch(() => {
            logger.error(`info icon ${i + 1} not visible properly`);
            errors.push(`info icon ${i + 1} not visible properly`);
          });
        await page.waitForTimeout(3000);

        const expandCollapseBtn = await page.waitForXPath(
          as.technicianMonthTrendChartExpColBtn(i + 2),
          {
            visible: true,
            timeout: 2000,
          }
        );

        if (expandCollapseBtn != null) {
          logger.info(`expand button ${i + 1} display properly`);

          const expandBtn = await page.$x(
            as.technicianMonthTrendChartExpColBtn(i + 2)
          );
          await page.waitForTimeout(2000);

          await expandBtn[0].click();
          await page.waitForTimeout(5000);

          await page
            .waitForSelector(as.popup, {
              visible: true,
              timeout: 4000,
            })
            .then(() => {
              logger.info(`chart ${i + 1} expand properly`);
            })
            .catch(() => {
              logger.error(`chart ${i + 1} not expand properly`);
              errors.push(`chart ${i + 1} not expand properly`);
            });

          await page.waitForTimeout(4000);

          const collapseBtn = await page.$eval(
            as.technicianMonthTrendCollapseBtn,
            (elem) => {
              return elem.style.display !== "none";
            }
          );

          if (collapseBtn) {
            logger.info(`collapse button ${i + 1} display properly`);

            await page.click(as.technicianMonthTrendCollapseBtn);
            await page.waitForTimeout(5000);

            try {
              const popup = await page.$eval(as.popup, (elem) => {
                return elem.style.display !== "none";
              });

              if (popup) {
                logger.error(`chart ${i + 1} not collapse properly`);
                errors.push(`chart ${i + 1} not collapse properly`);
              }
            } catch (error) {
              const btnErr = [];
              btnErr.push(error);
              const e = btnErr.find((x) => x === error);
              e
                ? logger.info(`chart ${i + 1} collapse properly`)
                : [
                    logger.error(`chart ${i + 1} not collapse properly`),
                    errors.push(`chart ${i + 1} not collapse properly`),
                  ];
            }
          } else {
            logger.error(`collapse button ${i + 1} not display properly`);
            errors.push(`collapse button ${i + 1} not display properly`);
          }
        } else {
          logger.error(`expand button ${i + 1} not display properly`);
          errors.push(`expand button ${i + 1} not display properly`);
        }

        const viewBtn = await page.$x(
          as.technicianMonthTrendViewDetailBtn(i + 2)
        );
        await viewBtn[0].click();
        await navigationPromise;
        await page.waitForTimeout(8000);

        const title = await page.title();

        title == "Overview"
          ? logger.info(`view detail button ${i + 1} working properly`)
          : [
              logger.info(`view detail button ${i + 1} working properly`),
              errors.push(`view detail button ${i + 1} working properly`),
            ];

        await page.goBack();
        await navigationPromise;
        await page.waitForTimeout(10000);

        const monthTrend = await page.$x(as.monthTrendTab);
        await monthTrend[0].click();
        await navigationPromise;
        await page.waitForTimeout(10000);
      }
    } else {
      logger.info("Technician Performance title verify failed");
      errors.push("Technician Performance title verify failed");
    }

    ts.assert(
      errors.length == 0,
      `Error in  Tech Metrics Page: ${errors.join("\n")}`
    );
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsTechMetricsTest();
