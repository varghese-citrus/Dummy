import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { SpecialMetricsSelectors as sm } from "../selectors/special-metrics.ts";
import { fixedopsCommonLogin } from "./common/fixedops-common-login.ts";
import { startLogger } from "../utilities/utils.ts";

const logger = startLogger();
const errors: string[] = [];

function fixedOpsSpecialMetricsTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[AEC-FOCP-UI-FN-LD-0219] ${site.name} FixedOps Special Metrics Charts Common Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-UI-FN-LD-0219",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await specialMetricsPageChartsCommonTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Special Metrics Charts Common Test";
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

async function specialMetricsPageChartsCommonTest(baseURL: string) {
  let browser = null;

  try {
    const oBrowser = await fixedopsCommonLogin(baseURL);
    const page = oBrowser.page;
    browser = oBrowser.browser;
    const navigationPromise = oBrowser.navigationPromise;
    await page.waitForSelector(sm.specialMetricsLink);
    await page.click(sm.specialMetricsLink);
    await navigationPromise;
    await page.waitForTimeout(15000);
    logger.info("special metrics link clicked!!!");
    const title = await page.title();
    if (title == "Special Metrics") {
      logger.info("Special Metrics title verify success");
      const chartDetails = [
        {
          id: 948,
          name: "CP 1-Line-RO Count",
        },
        {
          id: 923,
          name: "CP 1-Line-RO Count Percentage",
        },
        {
          id: 1354,
          name: "CP Multi-Line-RO Count",
        },
        {
          id: 1355,
          name: "CP Multi-Line-RO Count Percentage",
        },
        {
          id: 938,
          name: "CP Return Rate",
        },
        {
          id: 930,
          name: "CP Parts to Labor Ratio",
        },
        {
          id: 935,
          name: "Labor Sold Hours Percentage By Paytype",
        },
        {
          id: 936,
          name: "CP Parts to Labor Ratio By Category",
        },
        {
          id: 1239,
          name: "CP Revenue - Shop Supplies",
        },
        {
          id: 1316,
          name: "MPI Penetration Percentage",
        },
        {
          id: 1317,
          name: "Menu Penetration Percentage",
        },
      ];
      await page.waitForSelector(sm.resetBtn);
      await page.click(sm.resetBtn);
      logger.info("reset button clicked");
      await page.waitForTimeout(8000);
      for (let i = 0; i <= chartDetails.length - 1; i++) {
        await page.waitForTimeout(5000);
        const chartNameXpath = await page.$x(sm.chartName(i + 1));
        const chartNumXpath = await page.$x(sm.chartNumber(i + 1));
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
              logger.error(
                `chart name ${chartName} and number ${chartNum} verify failed`
              ),
              errors.push(
                `chart name ${chartName} and number ${chartNum} verify failed`
              ),
            ];
        await page
          .waitForXPath(sm.chartInfoIcon(i + 1), {
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
          sm.chartExpandCollapseBtn(i + 1),
          {
            visible: true,
            timeout: 2000,
          }
        );
        if (expandCollapseBtn != null) {
          logger.info(`expand button ${i + 1} display properly`);
          const expandBtn = await page.$x(sm.chartExpandCollapseBtn(i + 1));
          await page.waitForTimeout(2000);
          await expandBtn[0].click();
          await page.waitForTimeout(5000);
          await page
            .waitForSelector(sm.popup, {
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
          await page.waitForTimeout(10000);
          const collapseBtn = await page.waitForSelector(sm.collapseBtn, {
            visible: true,
            timeout: 4000,
          });
          if (collapseBtn != null) {
            logger.info(`collapse button ${i + 1} display properly`);
            await page.click(sm.collapseBtn);
            await page.waitForTimeout(10000);

            await page
              .waitForSelector(sm.popup, {
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
        const viewBtn = await page.$x(sm.chartViewDetailBtn(i + 1));
        await viewBtn[0].click();
        await navigationPromise;
        await page.waitForTimeout(8000);
        const title = await page.title();
        title == "Overview"
          ? logger.info(`view detail button ${i + 1} working properly`)
          : [
              logger.error(`view detail button ${i + 1} working properly`),
              errors.push(`view detail button ${i + 1} working properly`),
            ];
        await page.goBack();
        await navigationPromise;
        await page.waitForTimeout(12000);
      }
    } else {
      logger.info("Special Metrics title verify failed");
      errors.push("Special Metrics title verify failed");
    }
    ts.assert(
      errors.length == 0,
      `Error in Special Metrics Page: ${errors.join("\n")}`
    );
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsSpecialMetricsTest();
