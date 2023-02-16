import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { PartsWorkmixSelectors as pw } from "../selectors/parts-work-mix.ts";
import { fixedopsCommonLogin } from "./common/fixedops-common-login.ts";
import { startLogger } from "../utilities/utils.ts";

const logger = startLogger();
const errors: string[] = [];

function fixedOpsPartsWorkMixTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[AEC-FOCP-UI-FN-LD-0204] ${site.name} FixedOps Parts Work Mix Page View Detail Button Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-UI-FN-LD-0204",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await partsWorkMixPageViewDetailBtnTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Labor Work Mix Page View Detail Button Test";
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

async function partsWorkMixPageViewDetailBtnTest(baseURL: string) {
  let browser = null;

  try {
    const oBrowser = await fixedopsCommonLogin(baseURL);
    const page = oBrowser.page;
    browser = oBrowser.browser;
    const navigationPromise = oBrowser.navigationPromise;
    await page.waitForSelector(pw.partsMenu);
    await page.click(pw.partsMenu);
    logger.info("Parts Menu clicked!!!");
    await navigationPromise;
    await page.waitForTimeout(5000);
    const partsWorkmixdashboard = await page.$x(pw.partsWorkmixMenu);
    await partsWorkmixdashboard[0].click();
    logger.info("Parts Workmix dashboard clicked");
    await navigationPromise;
    await page.waitForTimeout(15000);

    const title = await page.title();

    if (title == "Parts Work Mix") {
      logger.info("parts work miss title verify success");

      const ids = [
        pw.wrkMixChartViewDetailBtn_1,
        pw.wrkMixChartViewDetailBtn_2,
        pw.wrkMixChartViewDetailBtn_3,
        pw.wrkMixChartViewDetailBtn_4,
        pw.wrkMixChartViewDetailBtn_5,
        pw.wrkMixChartViewDetailBtn_6,
      ];

      for (let i = 0; i <= ids.length - 1; i++) {
        await page.waitForSelector(ids[i]);
        await page.click(ids[i]);
        await navigationPromise;
        await page.waitForTimeout(12000);
        const title = await page.title();
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
        await page.goBack();
        await navigationPromise;
        await page.waitForTimeout(5000);
      }
    } else {
      logger.info("parts work miss title verify failed");
      errors.push("parts work miss title verify failed");
    }
    ts.assert(
      errors.length == 0,
      `Error in Parts Workmix Page: ${errors.join("\n")}`
    );
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsPartsWorkMixTest();
