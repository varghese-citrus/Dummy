import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { fixedopsCommonLogin } from "./common/fixedops-common-login.ts";
import { PartsWorkmixSelectors as pw } from "../selectors/parts-work-mix.ts";
import { startLogger } from "../utilities/utils.ts";

const logger = startLogger();
const errors: string[] = [];

function fixedOpsPartsWorkmixTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[AEC-FOCP-UI-FN-LD-0182] ${site.name} FixedOps Parts Workmix Chart Detail Check Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "[AEC-FOCP-UI-FN-LD-0182]",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await partsWorkmixChartDetailCheckTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Parts Workmix Chart Detail Check Test";
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

async function partsWorkmixChartDetailCheckTest(baseURL: string) {
  let browser = null;

  try {
    const oBrowser = await fixedopsCommonLogin(baseURL);
    const page = oBrowser.page;
    browser = oBrowser.browser;
    const navigationPromise = oBrowser.navigationPromise;
    await page.waitForSelector(pw.partsMenu);
    await page.click(pw.partsMenu);
    logger.info("Parts menu clicked");
    await page.waitForTimeout(5000);
    const wrkMixMenu = await page.$x(pw.partsWorkmixMenu);
    await wrkMixMenu[0].click();
    logger.info("Parts Workmix menu clicked");
    await navigationPromise;
    await page.waitForTimeout(15000);
    const chartDetails = [
      { id: 1253, name: "Parts Sale" },
      { id: 1258, name: "Gross Profit%" },
      { id: 1254, name: "Parts Cost" },
      { id: 1257, name: "Parts Markup" },
      { id: 1255, name: "Job Count" },
      { id: 1256, name: "Work Mix%" },
    ];

    const title = await page.title();
    console.log(title);

    for (let i = 0; i <= chartDetails.length - 1; i++) {
      const chartNameXpath = await page.$x(pw.pWrkMxChartName(i + 1));
      const chartIdXpath = await page.$x(pw.pWrkMxChartId(i + 1));
      await page.waitForTimeout(5000);
      const chartName: string = await (
        await chartNameXpath[0].getProperty("textContent")
      ).jsonValue();
      await page.waitForTimeout(5000);
      const chartId = await (
        await chartIdXpath[0].getProperty("textContent")
      ).jsonValue();
      await page.waitForTimeout(5000);
      const data = chartDetails[i];
      chartName.trim() == data.name.trim() && chartId == data.id
        ? logger.info(
            `ChartName ${chartName} and CharId ${chartId} are verified success`
          )
        : [
            logger.error(
              `ChartName ${chartName} and CharId ${chartId} are verify failed`
            ),
            errors.push(
              `ChartName ${chartName} and CharId ${chartId} are verify failed`
            ),
          ];
    }
    await page.waitForTimeout(4000);
    for (let i = 1; i <= 6; i++) {
      await page
        .waitForXPath(pw.infoIcon(i), {
          visible: true,
          timeout: 4000,
        })
        .then(() => {
          logger.info(`InfoIcon ${i} visible properly`);
        })
        .catch(() => {
          logger.error(`InfoIcon ${i} not visible`);
          errors.push(`InfoIcon ${i} not visible`);
        });
      await page.waitForTimeout(3000);
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
