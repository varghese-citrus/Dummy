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
      name: `[AEC-FOCP-UI-FN-LD-0185] ${site.name} FixedOps Parts Workmix Detail Button Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "[AEC-FOCP-UI-FN-LD-0185]",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await partsWorkmixDetailBtnTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in  FixedOps Parts Workmix Detail Button Test";
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

async function partsWorkmixDetailBtnTest(baseURL: string) {
  let browser = null;

  try {
    const oBrowser = await fixedopsCommonLogin(baseURL);
    const page = oBrowser.page;
    browser = oBrowser.browser;
    const navigationPromise = oBrowser.navigationPromise;
    await page.waitForSelector(pw.partsMenu);
    await page.click(pw.partsMenu);
    logger.info("Parts Menu clicked");
    await page.waitForTimeout(5000);
    const partsWrkMixMenu = await page.$x(pw.partsWorkmixMenu);
    await partsWrkMixMenu[0].click();
    logger.info("Parts workMix menu clicked");
    await navigationPromise;
    await page.waitForTimeout(15000);

    const ids = [
      pw.detailBtn_1,
      pw.detailBtn_2,
      pw.detailBtn_3,
      pw.detailBtn_4,
      pw.detailBtn_5,
      pw.detailBtn_6,
    ];

    for (let i = 0; i <= ids.length - 1; i++) {
      await page.waitForSelector(ids[i]);
      await page.click(ids[i]);
      await navigationPromise;
      await page.waitForTimeout(12000);
      const title = await page.title();
      await page.goBack();
      await navigationPromise;
      await page.waitForTimeout(12000);
      title == "Overview"
        ? logger.info(`PartsWorkMix detail button ${i + 1} working success`)
        : [
            logger.error(`PartsWorkMix detail button ${i + 1} working failed`),
            errors.push(`PartsWorkMix detail button ${i + 1} working failed`),
          ];
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
