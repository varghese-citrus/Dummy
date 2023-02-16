import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { LaborWorkMiss as lw } from "../selectors/labor-work-mix.ts";
import { fixedopsCommonLogin } from "./common/fixedops-common-login.ts";
import { getRandomNumberBetween, startLogger } from "../utilities/utils.ts";

const logger = startLogger();
const errors: string[] = [];

function fixedOpsLaborWorkMixTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[AEC-FOCP-UI-FN-LD-0120] ${site.name} FixedOps Labor Work Mix Page Month Comparison Charts Names Numbers Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-UI-FN-LD-0120",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await laborWorkMixPageMonthCmpChartsNamesNumbersTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Labor Work Mix Page Month Comparison Charts Names Numbers Test";
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

async function laborWorkMixPageMonthCmpChartsNamesNumbersTest(baseURL: string) {
  let browser = null;

  try {
    const oBrowser = await fixedopsCommonLogin(baseURL);
    const page = oBrowser.page;
    browser = oBrowser.browser;
    const navigationPromise = oBrowser.navigationPromise;
    await page.reload();
    await navigationPromise;
    await page.waitForTimeout(10000);
    await page.waitForSelector(lw.labor);
    await page.click(lw.labor);
    logger.info("labor expand collapse link clicked!!!");
    await page.waitForTimeout(4000);
    const laborWrkMix = await page.$x(lw.laborWorkMixLink);
    await laborWrkMix[0].click();
    await navigationPromise;
    await page.waitForTimeout(15000);
    logger.info("labor work mix link clicked!!!");

    const title = await page.title();

    if (title == "Labor Work Mix") {
      logger.info("labor work miss title verify success");
      const monthWrkMix = await page.$x(lw.monthWrkMixTab);
      await monthWrkMix[0].click();
      await page.waitForTimeout(5000);
      logger.info("month work mix comparison tab clicked");
      const monthSel1 = await page.$x(lw.month1Select);
      await monthSel1[0].click();
      await page.waitForTimeout(4000);
      const num1 = await getRandomNumberBetween(1, 12);
      const month1 = await page.$x(lw.getMonth(num1));
      await month1[0].click();
      await page.waitForTimeout(4000);
      logger.info("month 1 selected");
      const m1 = await (await month1[0].getProperty("textContent")).jsonValue();
      const monthSel2 = await page.$x(lw.month2Select);
      await monthSel2[0].click();
      await page.waitForTimeout(4000);
      const num2 = await getRandomNumberBetween(1, 12);
      const month2 = await page.$x(lw.getMonth(num2));
      await month2[0].click();
      await page.waitForTimeout(4000);
      logger.info("month 2 selected");
      const m2 = await (await month2[0].getProperty("textContent")).jsonValue();
      const chartDetails = [
        {
          id: 1260,
          name: `Labor Work Mix % - ${m1} vs ${m2}`,
        },
        {
          id: 1261,
          name: `Job Count - ${m1} vs ${m2}`,
        },
        {
          id: 1263,
          name: `Gross Profit% - ${m1} vs ${m2}`,
        },
        {
          id: 1262,
          name: `Effective Labor Rate - ${m1} vs ${m2}`,
        },
        {
          id: 1259,
          name: `Sold Hours - ${m1} vs ${m2}`,
        },
      ];

      for (let i = 0; i <= chartDetails.length - 1; i++) {
        await page.waitForTimeout(5000);
        const chartNameXpath = await page.$x(lw.getChartName(i + 2));
        const chartNumXpath = await page.$x(lw.getChartNumber(i + 2));
        const chartDateXpath = await page.$x(lw.getChartDate(i + 2));
        await page.waitForTimeout(5000);
        const chartName: string = await (
          await chartNameXpath[0].getProperty("textContent")
        ).jsonValue();
        await page.waitForTimeout(5000);
        const chartDate: string = await (
          await chartDateXpath[0].getProperty("textContent")
        ).jsonValue();
        const chartNum = await (
          await chartNumXpath[0].getProperty("textContent")
        ).jsonValue();
        await page.waitForTimeout(5000);
        const chartNameDate: string = chartName.concat(chartDate.trim());
        const data = chartDetails[i];
        chartNameDate.trim() == data.name.trim() && chartNum == data.id
          ? logger.info(
              `chart name ${chartNameDate} and number ${chartNum} verify success`
            )
          : [
              logger.error(
                `chart name ${chartNameDate} and number ${chartNum} verify failed`
              ),
              errors.push(
                `chart name ${chartNameDate} and number ${chartNum} verify failed`
              ),
            ];
        await page
          .waitForSelector(lw.monthChartInfoIcon(i + 2), {
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
      }
    } else {
      logger.error("labor work miss title verify failed");
      errors.push("labor work miss title verify failed");
    }
    ts.assert(
      errors.length == 0,
      `Error in Labor Workmix Page: ${errors.join("\n")}`
    );
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsLaborWorkMixTest();
