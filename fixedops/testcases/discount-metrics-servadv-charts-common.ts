import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { DiscountMetricsSelector as ds } from "../selectors/discount-metrics.ts";
import { fixedopsCommonLogin } from "./common/fixedops-common-login.ts";
import { startLogger, getRandomNumberBetween } from "../utilities/utils.ts";

const logger = startLogger();
const errors: string[] = [];

function fixedOpsByServiceAdvisorTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[AEC-FOCP-UI-FN-LD-0060] ${site.name} FixedOps Discount Metrics by Service Advisor Page Charts Common Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-UI-FN-LD-0060",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await cpDisMonthTrendPageChartCommonTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Discount Metrics by Service Advisor Test";
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

async function cpDisMonthTrendPageChartCommonTest(baseURL: string) {
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

    const byServiceAdvisorTab = await page.$x(ds.byServiceAdvisorTab);
    await byServiceAdvisorTab[0].click();
    await page.waitForTimeout(10000);
    logger.info("By Service Advisor tab clicked");

    const title = await page.title();

    if (title == "Discount") {
      logger.info("Discount metrics title verify success");

      await page.waitForXPath(ds.servDataAsOf);
      const x = await page.$x(ds.servDataAsOf);
      const str: string = await (
        await x[0].getProperty("textContent")
      ).jsonValue();

      str.split(":")[0].includes("Data as of")
        ? logger.info("data as of field properly displayed")
        : [
            logger.info("data as of field not properly displayed"),
            errors.push("data as of field not properly displayed"),
          ];

      const monthSel1 = await page.$x(ds.month1Select);
      await monthSel1[0].click();
      await page.waitForTimeout(4000);

      const num1 = await getRandomNumberBetween(1, 12);
      const month1 = await page.$x(ds.getMonth(num1));
      await month1[0].click();
      await page.waitForTimeout(4000);
      logger.info("month 1 selected");

      const m1 = await (await month1[0].getProperty("textContent")).jsonValue();

      const monthSel2 = await page.$x(ds.month2Select);
      await monthSel2[0].click();
      await page.waitForTimeout(4000);

      const num2 = await getRandomNumberBetween(1, 12);
      const month2 = await page.$x(ds.getMonth(num2));
      await month2[0].click();
      await page.waitForTimeout(4000);
      logger.info("month 2 selected");

      const m2 = await (await month2[0].getProperty("textContent")).jsonValue();

      const chartDetails = [
        {
          id: 1114,
          name: `Discounts By Service Advisor - ${m1} vs ${m2}`,
        },
        {
          id: 1125,
          name: `Discounted Job Count % by Opcategory by Service Advisor - ${m1} vs ${m2}`,
        },
        {
          id: 1124,
          name: "Discounted RO % by Service Advisor",
        },
        {
          id: 1126,
          name: "Discounted Job % by Service Advisor",
        },
      ];

      for (let i = 0; i <= chartDetails.length - 1; i++) {
        const data = chartDetails[i];
        await page
          .waitForSelector(ds.byServiceAdvChartInfoIcon(i + 1))
          .then(async () => {
            await page
              .$eval(ds.byServiceAdvChartInfoIcon(i + 1), (elem) => {
                return elem.style.display !== "none";
              })
              .then(() => {
                logger.info(`info icon ${i + 1} visible properly`);
              })
              .catch(() => {
                logger.info(`info icon ${i + 1} not visible properly`);
                errors.push(`info icon ${i + 1} not visible properly`);
              });
          })
          .catch(() => {
            logger.warn("Info icon not visible due to graph load failure");
          });

        await page.waitForTimeout(3000);

        const expandCollapseBtn = await page.waitForXPath(
          ds.byServiceAdvChartExpandCollapseBtn(i + 1),
          {
            visible: true,
            timeout: 2000,
          }
        );

        if (expandCollapseBtn != null) {
          logger.info(`expand button ${i + 1} display properly`);

          const expandBtn = await page.$x(
            ds.byServiceAdvChartExpandCollapseBtn(i + 1)
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
          const collapseBtn = await page.$eval(ds.collapseBtn, (elem) => {
            return elem.style.display !== "none";
          });

          if (collapseBtn) {
            logger.info(`collapse button ${i + 1} display properly`);

            await page.click(ds.collapseBtn);
            await page.waitForTimeout(5000);

            await page
              .waitForSelector(ds.popup, {
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
        const viewBtn = await page.$x(ds.byServiceAdvViewDetailBtn(data.id));
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

        const byServiceAdvisorTab = await page.$x(ds.byServiceAdvisorTab);
        await byServiceAdvisorTab[0].click();
        await page.waitForTimeout(15000);
        logger.info("By Service Advisor tab clicked");
      }
    } else {
      logger.error(
        "discount metrics by service advisor page title verify failed"
      );
      errors.push(
        "discount metrics by service advisor page title verify failed"
      );
    }
    ts.assert(
      errors.length == 0,
      `Error in Discount Metrics by Service Advisor Page: ${errors.join("\n")}`
    );
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsByServiceAdvisorTest();
