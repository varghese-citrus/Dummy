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
      name: `[AEC-FOCP-UI-FN-LD-0190] ${site.name} FixedOps Parts Workmix 2 Month Comparison Chart Detail Button Check`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "[AEC-FOCP-UI-FN-LD-0190]",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await partsWorkmixMonthComparisonChartDetailCheck(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Parts Workmix 2 Month Comparison Chart Detail Button Check";
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

async function partsWorkmixMonthComparisonChartDetailCheck(baseURL: string) {
  let browser = null;
  try {
    const oBrowser = await fixedopsCommonLogin(baseURL);
    const page = oBrowser.page;
    browser = oBrowser.browser;
    const navigationPromise = oBrowser.navigationPromise;
    await page.waitForSelector(pw.partsMenu);
    await page.click(pw.partsMenu);
    logger.info("Parts menu clicked");
    await navigationPromise;
    await page.waitForTimeout(5000);
    const partsWorkmixMenu = await page.$x(pw.partsWorkmixMenu);
    await partsWorkmixMenu[0].click();
    logger.info("Parts workmix menu clicked");
    await navigationPromise;
    await page.waitForTimeout(15000);
    const title = await page.title();
    if (title == "Parts Work Mix") {
      logger.info("Workmix title verified success");
      await page.waitForTimeout(5000);
      await page.waitForSelector(pw.monthComparison);
      await page.click(pw.monthComparison);
      logger.info("Two month comparison clicked");
      await page.waitForTimeout(10000);
      const ids = [
        pw.viewDetailBtn2MntCom_1,
        pw.viewDetailBtn2MntCom_2,
        pw.viewDetailBtn2MntCom_3,
        pw.viewDetailBtn2MntCom_4,
        pw.viewDetailBtn2MntCom_5,
      ];
      for (let i = 0; i <= ids.length - 1; i++) {
        await page.waitForSelector(ids[i]);
        await page.click(ids[i]);
        await navigationPromise;
        await page.waitForTimeout(5000);
        const title = await page.title();
        await page.goBack();
        await navigationPromise;
        await page.waitForTimeout(5000);
        await page.waitForSelector(pw.monthComparison);
        await page.click(pw.monthComparison);
        logger.info("Two month comparison clicked");
        title == "Overview"
          ? logger.info(
              `work mix chart view detail button ${i + 1} working properly`
            )
          : [
              logger.info(
                `work mix chart view detail button ${i + 1} working properly`
              ),
              errors.push(
                `work mix chart view detail button ${i + 1} working properly`
              ),
            ];
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
