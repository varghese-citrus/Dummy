import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { partsoverviewSelectors as po } from "../selectors/parts-overview.ts";
import { fixedopsCommonLogin } from "./common/fixedops-common-login.ts";
import { startLogger } from "../utilities/utils.ts";

const logger = startLogger();
const errors: string[] = [];

function fixedOpsPartsOverviewTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[AEC-FOCP-UI-FN-LD-0169] ${site.name} FixedOps Parts Overview Detail Button Click Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "[AEC-FOCP-UI-FN-LD-0169]",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await partsOverviewDetailButtonTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Parts Overview Detail Button Click Test";
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

async function partsOverviewDetailButtonTest(baseURL: string) {
  let browser = null;
  try {
    const oBrowser = await fixedopsCommonLogin(baseURL);
    const page = oBrowser.page;
    browser = oBrowser.browser;
    const navigationPromise = oBrowser.navigationPromise;
    await page.reload();
    await navigationPromise;
    await page.waitForTimeout(10000);
    const pMenu = await page.$x(po.partsMenuBtn);
    await pMenu[0].click();
    await page.waitForTimeout(4000);
    logger.info("parts menu clicked");
    const pOverview = await page.$x(po.partsOverviewBtn);
    await pOverview[0].click();
    logger.info("parts overview");
    await navigationPromise;
    await page.waitForTimeout(12000);
    const ids = [
      po.detailButton_1,
      po.detailButton_2,
      po.detailButton_3,
      po.detailButton_4,
      po.detailButton_5,
      po.detailButton_6,
      po.detailButton_7,
      po.detailButton_8,
      po.detailButton_9,
    ];
    const title = await page.title();
    if (title == "CP Parts Overview") {
      logger.info("CP Parts Overview title verify success");
      for (let j = 0; j <= ids.length - 1; j++) {
        const dBtn = await page.$x(ids[j]);
        await dBtn[0].click();
        await page.waitForTimeout(5000);
        const title = await page.title();
        await page.goBack();
        await navigationPromise;
        await page.waitForTimeout(8000);
        title == "Overview"
          ? logger.info(`view detail button success ${j + 1}`)
          : [
              logger.error(`view detail button failed ${j + 1}`),
              errors.push(`view detail button failed ${j + 1}`),
            ];
      }
    } else {
      logger.error("CP Parts Overview title verify failed");
      errors.push("CP Parts Overview title verify failed");
    }
    ts.assert(
      errors.length == 0,
      `Error in  Parts Overview: ${errors.join("\n")}`
    );
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsPartsOverviewTest();
