import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { fixedopsCommonLogin } from "./common/fixedops-common-login.ts";
import { PartsWorkmixSelectors as pw } from "../selectors/parts-work-mix.ts";
import { getRandomNumberBetween } from "../utilities/utils.ts";
import { startLogger } from "../utilities/utils.ts";

const logger = startLogger();
const errors: string[] = [];

function fixedOpsPartsWorkmixTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[AEC-FOCP-UI-FN-LD-0191] ${site.name} FixedOps Parts Workmix 2 Month Comparison Chart Name Check`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "[AEC-FOCP-UI-FN-LD-0191]",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await partsWorkmixMonthComparisonChartNameCheck(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Parts Workmix 2 Month Comparison Chart Name Check";
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

async function partsWorkmixMonthComparisonChartNameCheck(baseURL: string) {
  let browser = null;
  try {
    const oBrowser = await fixedopsCommonLogin(baseURL);
    const page = oBrowser.page;
    browser = oBrowser.browser;
    const navigationPromise = oBrowser.navigationPromise;
    await page.waitForSelector(pw.partsMenu);
    await page.click(pw.partsMenu);
    logger.info("Parts menu clicked");
    await page.waitForTimeout(4000);
    const partsWorkmixMenu = await page.$x(pw.partsWorkmixMenu);
    await partsWorkmixMenu[0].click();
    logger.info("Parts Workmix menu clicked");
    await navigationPromise;
    await page.waitForTimeout(12000);

    const title = await page.title();
    if (title == "Parts Work Mix") {
      logger.info("Parts workmix title verified");
      await page.waitForTimeout(5000);
      await page.waitForSelector(pw.monthComparison);
      await page.click(pw.monthComparison);
      logger.info("Two month comparison clicked!!!");
      const month_1Select = await page.$x(pw.month_1Select);
      await month_1Select[0].click();
      await page.waitForTimeout(4000);
      const num_1 = await getRandomNumberBetween(1, 12);
      const month_1 = await page.$x(pw.getMonth(num_1));
      await month_1[0].click();
      await page.waitForTimeout(4000);
      logger.info("Month 1 selected!!!");
      const m1 = await (
        await month_1[0].getProperty("textContent")
      ).jsonValue();
      const month_2Select = await page.$x(pw.month_2Select);
      await month_2Select[0].click();
      await page.waitForTimeout(4000);
      const num_2 = await getRandomNumberBetween(1, 12);
      const month_2 = await page.$x(pw.getMonth(num_2));
      await month_2[0].click();
      await page.waitForTimeout(4000);
      logger.info("Month 2 selected!!!");
      const m2 = await (
        await month_2[0].getProperty("textContent")
      ).jsonValue();
      const chartDetails = [
        { id: 1309, name: `Parts Cost - ${m1} vs ${m2}` },
        { id: 1310, name: `Parts Work Mix % - ${m1} vs ${m2}` },
        { id: 1312, name: `Parts Markup - ${m1} vs ${m2}` },
        { id: 1311, name: `Job Count - ${m1} vs ${m2}` },
        { id: 1313, name: `Gross Profit % - ${m1} vs ${m2}` },
      ];

      for (let i = 0; i <= chartDetails.length - 1; i++) {
        await page.waitForTimeout(4000);
        const chartNameXpath = await page.$x(pw.getChartName(i + 2));
        const chartNumXpath = await page.$x(pw.getChartId(i + 2));
        const chartDateXpath = await page.$x(pw.getChartDate(i + 2));
        await page.waitForTimeout(4000);
        const chartName: string = await (
          await chartNameXpath[0].getProperty("textContent")
        ).jsonValue();
        await page.waitForTimeout(4000);
        const chartid = await (
          await chartNumXpath[0].getProperty("textContent")
        ).jsonValue();
        await page.waitForTimeout(4000);
        const chartDate: string = await (
          await chartDateXpath[0].getProperty("textContent")
        ).jsonValue();
        await page.waitForTimeout(4000);
        const chartNameDate: string = chartName.concat(chartDate.trim());
        const data = chartDetails[i];
        chartNameDate.trim() == data.name.trim() && chartid == data.id
          ? logger.info(
              `chart name ${chartNameDate} and number ${chartid} verify success`
            )
          : [
              logger.error(
                `chart name ${chartNameDate} and number ${chartid} verify failed`
              ),
              errors.push(
                `chart name ${chartNameDate} and number ${chartid} verify failed`
              ),
            ];
        await page
          .waitForXPath(pw.monthChartInfoIcon(i + 2), {
            visible: true,
            timeout: 4000,
          })
          .then(() => {
            logger.info(`info icon ${i + 1} visible properly`);
          })
          .catch(() => {
            logger.error(`info icon ${i + 1} not visible properly`);
            errors.push(`info icon ${i + 1} not visible properly`);
          });
      }
    } else {
      logger.info("Parts workmix title verify failed");
      errors.push("Parts workmix title verify failed");
    }
    ts.assert(
      errors.length == 0,
      `Error in  Parts Workmix: ${errors.join("\n")}`
    );
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsPartsWorkmixTest();
