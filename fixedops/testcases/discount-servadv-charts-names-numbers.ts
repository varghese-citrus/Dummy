import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { DiscountMetricsSelector as ds } from "../selectors/discount-metrics.ts";
import { fixedopsCommonLogin } from "./common/fixedops-common-login.ts";
import { getRandomNumberBetween, startLogger } from "../utilities/utils.ts";

const logger = startLogger();
const errors: string[] = [];

function fixedOpsByServiceAdvisorTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[AEC-FOCP-UI-FN-LD-0062] ${site.name} FixedOps Discount Metrics by Service Advisor Page Charts Names Numbers Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-UI-FN-LD-0062",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await cpDisMonthTrendPageChartsNamesNumbersTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Discount Metrics by Service Advisor Page Charts Names Numbers Test";
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

async function cpDisMonthTrendPageChartsNamesNumbersTest(baseURL: string) {
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
      await page.waitForTimeout(8000);
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
        const z = i + 1;
        const data = chartDetails[i];

        switch (z) {
          case 1 || 2: {
            const chartNameXpath1 = await page.$x(ds.getChartName1(z));
            const chartDateXpath1 = await page.$x(ds.getChartDate1(z));
            const chartNumXpath1 = await page.$x(ds.getChartNum1(z));
            await page.waitForTimeout(5000);
            const chartName1: string = await (
              await chartNameXpath1[0].getProperty("textContent")
            ).jsonValue();
            await page.waitForTimeout(5000);

            const chartDate1: string = await (
              await chartDateXpath1[0].getProperty("textContent")
            ).jsonValue();

            const chartNum1 = await (
              await chartNumXpath1[0].getProperty("textContent")
            ).jsonValue();
            await page.waitForTimeout(5000);
            const chartNameDate1: string = chartName1.concat(chartDate1.trim());

            chartNameDate1.trim() == data.name.trim() && chartNum1 == data.id
              ? logger.info(
                  `chart name ${chartNameDate1} and number ${chartNum1} verify success`
                )
              : [
                  logger.info(
                    `chart name ${chartNameDate1} and number ${chartNum1} verify failed`
                  ),
                  errors.push(
                    `chart name ${chartNameDate1} and number ${chartNum1} verify failed`
                  ),
                ];
            break;
          }
          case 3 || 4: {
            const chartNameXpath1 = await page.$x(await ds.getChartName2(z));
            const chartNumXpath1 = await page.$x(await ds.getChartNum2(z));
            await page.waitForTimeout(5000);

            const chartName1: string = await (
              await chartNameXpath1[0].getProperty("textContent")
            ).jsonValue();
            await page.waitForTimeout(5000);

            const chartNum1 = await (
              await chartNumXpath1[0].getProperty("textContent")
            ).jsonValue();
            await page.waitForTimeout(5000);

            chartName1.trim() == data.name.trim() && chartNum1 == data.id
              ? logger.info(
                  `chart name ${chartName1} and number ${chartNum1} verify success`
                )
              : [
                  logger.error(
                    `chart name ${chartName1} and number ${chartNum1} verify failed`
                  ),
                  errors.push(
                    `chart name ${chartName1} and number ${chartNum1} verify failed`
                  ),
                ];
            break;
          }
          default: {
            null;
            break;
          }
        }

        // if (z == 1 || z == 2) {
        //   const chartNameXpath1 = await page.$x(ds.getChartName1(z));
        //   const chartDateXpath1 = await page.$x(ds.getChartDate1(z));
        //   const chartNumXpath1 = await page.$x(ds.getChartNum1(z));
        //   await page.waitForTimeout(5000);
        //   const chartName1: string = await (
        //     await chartNameXpath1[0].getProperty("textContent")
        //   ).jsonValue();
        //   await page.waitForTimeout(5000);

        //   const chartDate1: string = await (
        //     await chartDateXpath1[0].getProperty("textContent")
        //   ).jsonValue();

        //   const chartNum1 = await (
        //     await chartNumXpath1[0].getProperty("textContent")
        //   ).jsonValue();
        //   await page.waitForTimeout(5000);
        //   const chartNameDate1: string = chartName1.concat(chartDate1.trim());

        //   chartNameDate1.trim() == data.name.trim() && chartNum1 == data.id
        //     ? logger.info(
        //         `chart name ${chartNameDate1} and number ${chartNum1} verify success`
        //       )
        //     : [
        //         logger.info(
        //           `chart name ${chartNameDate1} and number ${chartNum1} verify failed`
        //         ),
        //         errors.push(
        //           `chart name ${chartNameDate1} and number ${chartNum1} verify failed`
        //         ),
        //       ];
        // }
        // if (z == 3 || z == 4) {
        //   const chartNameXpath1 = await page.$x(await ds.getChartName2(z));
        //   const chartNumXpath1 = await page.$x(await ds.getChartNum2(z));
        //   await page.waitForTimeout(5000);

        //   const chartName1: string = await (
        //     await chartNameXpath1[0].getProperty("textContent")
        //   ).jsonValue();
        //   await page.waitForTimeout(5000);

        //   const chartNum1 = await (
        //     await chartNumXpath1[0].getProperty("textContent")
        //   ).jsonValue();
        //   await page.waitForTimeout(5000);

        //   chartName1.trim() == data.name.trim() && chartNum1 == data.id
        //     ? logger.info(
        //         `chart name ${chartName1} and number ${chartNum1} verify success`
        //       )
        //     : [
        //         logger.error(
        //           `chart name ${chartName1} and number ${chartNum1} verify failed`
        //         ),
        //         errors.push(
        //           `chart name ${chartName1} and number ${chartNum1} verify failed`
        //         ),
        //       ];
        // }
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
