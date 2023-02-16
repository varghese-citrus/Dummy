import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { DiscountMetricsSelector as ds } from "../selectors/discount-metrics.ts";
import { fixedopsCommonLogin } from "./common/fixedops-common-login.ts";
import { startLogger } from "../utilities/utils.ts";

const logger = startLogger();
const errors: string[] = [];

function fixedOpsDiscountMetricsTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[DEMO-TEST] ${site.name} FixedOps Discount Metrics Page Common Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "DEMO-TEST",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await discountMetricsPageCommonTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Discount Metrics Page Common Test";
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

async function discountMetricsPageCommonTest(baseURL: string) {
  let browser = null;

  try {
    const oBrowser = await fixedopsCommonLogin(baseURL);
    const page = oBrowser.page;
    browser = oBrowser.browser;
    const navigationPromise = oBrowser.navigationPromise;

    await page.waitForSelector(ds.disMetricsLink);
    await page.click(ds.disMetricsLink);
    await navigationPromise;
    await page.waitForTimeout(8000);

    const title = await page.title();

    if (title == "Discount") {
      logger.info("Discount metrics title verify success");

      const chartDetails = [
        {
          id: 1234,
          name: "CP Labor and Parts Disc.",
        },
        {
          id: 1113,
          name: "CP RO Count for Disc by Disc Level",
        },
        {
          id: 1123,
          name: "CP Discounted RO %",
        },
        {
          id: 1115,
          name: "CP % Disc of Total $ Sold",
        },
        {
          id: 1232,
          name: "CP % Disc Per Discounted CP ROs",
        },
        {
          id: 1236,
          name: "CP Total Discounts Per Total ROs",
        },
        {
          id: 1165,
          name: "CP Total Disc $ Avg of Disc ROs",
        },
      ];

      const monthTrendTab = await page.$x(ds.MonthTrendTab);
      await monthTrendTab[0].click();
      await page.waitForTimeout(10000);
      logger.info("13 month trend tab clicked");
      for (let i = 0; i <= chartDetails.length - 1; i++) {
        await page.waitForTimeout(10000);
        const chartNameXpath = await page.$x(ds.monthTrendChartName(i + 1));
        const chartNumXpath = await page.$x(ds.monthTrendChartNumber(i + 1));
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

        data.name.trim() && chartNum == data.id
          ? logger.info(
              `chart name ${chartName} and number ${chartNum} verify success`
            )
          : [
              logger.info(
                `chart name ${chartName} and number ${chartNum} verify failed`
              ),
              errors.push(
                `chart name ${chartName} and number ${chartNum} verify failed`
              ),
            ];
        await page
          .waitForSelector(ds.monthTrendChartInfoIcon(i + 1), {
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
          ds.monthTrendChartExpandCollapseBtn(i + 1),
          {
            visible: true,
            timeout: 2000,
          }
        );

        if (expandCollapseBtn != null) {
          logger.info(`expand button ${i + 1} display properly`);

          const expandBtn = await page.$x(
            ds.monthTrendChartExpandCollapseBtn(i + 1)
          );
          await page.waitForTimeout(2000);
          await expandBtn[0].click();
          await page.waitForTimeout(5000);

          await page
            .waitForSelector(ds.popup, {
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
          await page.waitForTimeout(6000);
          const collapseBtn = await page.waitForSelector(ds.collapseBtn, {
            visible: true,
            timeout: 4000,
          });

          if (collapseBtn != null) {
            logger.info(`collapse button ${i + 1} display properly`);
            await page.click(ds.collapseBtn);
            await page.waitForTimeout(5000);

            await page
              .waitForSelector(ds.popup, { visible: true, timeout: 4000 })
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
        const viewBtn = await page.$x(ds.monthTrendViewDetailBtn(data.id));
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
      logger.error("Discount metrics page title verify failed");
      errors.push("Discount metrics  page title verify failed");
    }
    ts.assert(
      errors.length == 0,
      `Error in  Discount metrics Page: ${errors.join("\n")}`
    );
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsDiscountMetricsTest();
