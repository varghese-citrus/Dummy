import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { AdvisorTechMetricsSelector as as } from "../selectors/advisor-tech-metrics.ts";
import { fixedopsCommonLogin } from "./common/fixedops-common-login.ts";
import { startLogger } from "../utilities/utils.ts";

const logger = startLogger();

const errors: string[] = [];

function fixedOpsAdvisorMetricsTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[AEC-FOCP-UI-FN-LD-0017] ${site.name} FixedOps Advisor Metrics Page Month Trend Common Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-UI-FN-LD-0017",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await advisorMetricsPageMonthTrendChartCommonTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Advisor Metrics Page Month Trend Common Test";
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

async function advisorMetricsPageMonthTrendChartCommonTest(baseURL: string) {
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

      const chartDetails = [
        {
          id: 1276,
          name: "Total Revenue",
        },
        {
          id: 1277,
          name: "Labor Revenue",
        },
        {
          id: 1278,
          name: "Parts Revenue",
        },
        {
          id: 1279,
          name: "Labor Sold Hours",
        },
        {
          id: 1280,
          name: "RO Count",
        },
        {
          id: 1281,
          name: "Job Count",
        },
        {
          id: 1282,
          name: "Labor Gross Profit",
        },
        {
          id: 1283,
          name: "Labor Gross Profit %",
        },
        {
          id: 1284,
          name: "Parts Gross Profit",
        },
        {
          id: 1285,
          name: "Parts Gross Profit %",
        },
        {
          id: 1286,
          name: "Effective Labor Rate",
        },
        {
          id: 1315,
          name: "Parts Markup",
        },
      ];

      const serviceAdvisorPerformanceTab = await page.$x(
        as.serviceAdvisorPerformanceTab
      );

      await serviceAdvisorPerformanceTab[0].click();
      await page.waitForTimeout(5000);

      const monthTrendTab = await page.$x(as.MonthTrendTab);

      await monthTrendTab[0].click();
      await page.waitForTimeout(10000);

      for (let i = 5; i <= chartDetails.length - 1; i++) {
        await page.waitForTimeout(5000);
        const chartNameXpath = await page.$x(as.monthTrendChartName(i + 1));
        const chartNumXpath = await page.$x(as.monthTrendChartNumber(i + 1));
        await page.waitForTimeout(5000);

        const chartName: string = await (
          await chartNameXpath[0].getProperty("textContent")
        ).jsonValue();
        await page.waitForTimeout(5000);
        const chartNum = await (
          await chartNumXpath[0].getProperty("textContent")
        ).jsonValue();
        await page.waitForTimeout(5000);

        const chartObject = chartDetails.filter((e) => {
          return e.id === Number(chartNum);
        });

        chartObject[0].name.trim() == chartName.trim() ||
        chartObject[0].id == Number(chartNum)
          ? logger.info(
              `chart name ${chartName} and number ${chartNum} verify success`
            )
          : [
              logger.error(
                `chart name ${chartName} and number ${chartNum} verify failed`
              ),
              errors.push(
                `chart name ${chartName} and number ${chartNum} verify failed`
              ),
            ];

        await page
          .waitForSelector(as.monthTrendChartInfoIcon(i + 1), {
            visible: true,
            timeout: 4000,
          })
          .then(() => {
            logger.info(`info icon ${i + 1} visible properly`);
          })
          .catch(() => {
            logger.info(`info icon ${i + 1} not visible properly`);
            errors.push(`info icon ${i + 1} not visible properly`);
          });
        await page.waitForTimeout(3000);
        const expandCollapseBtn = await page.waitForXPath(
          as.monthTrendChartExpandCollapseBtn(i + 1),
          {
            visible: true,
            timeout: 2000,
          }
        );

        if (expandCollapseBtn != null) {
          logger.info(`expand button ${i + 1} display properly`);

          const expandBtn = await page.$x(
            as.monthTrendChartExpandCollapseBtn(i + 1)
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
          const collapseBtn = await page.waitForSelector(as.collapseBtn, {
            visible: true,
            timeout: 4000,
          });

          if (collapseBtn != null) {
            logger.info(`collapse button ${i + 1} display properly`);

            await page.click(as.collapseBtn);
            await page.waitForTimeout(5000);

            await page
              .waitForSelector(as.popup, {
                visible: true,
                timeout: 4000,
              })
              .then(() => {
                logger.error(`chart ${i + 1} not collapse properly`);
                errors.push(`chart ${i + 1} not collapse properly`);
              })
              .catch(() => {
                logger.info(`chart ${i + 1} collapse properly`);
              });
          } else {
            logger.error(`collapse button ${i + 1} not display properly`);
            errors.push(`collapse button ${i + 1} not display properly`);
          }
        } else {
          logger.error(`expand button ${i + 1} not display properly`);
          errors.push(`expand button ${i + 1} not display properly`);
        }

        const viewBtn = await page.$x(as.monthTrendViewDetailBtn(i + 1));
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
