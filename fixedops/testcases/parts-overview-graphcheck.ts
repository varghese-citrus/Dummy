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
      name: `[AEC-FOCP-UI-FN-LD-0166] ${site.name} FixedOps Parts Overview Page Graphs Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "[AEC-FOCP-UI-FN-LD-0166]",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await partsOverviewGraphCheckTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOp Parts Overview Page Graphs Test";
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
async function partsOverviewGraphCheckTest(baseURL: string) {
  let browser = null;

  try {
    const oBrowser = await fixedopsCommonLogin(baseURL);
    const page = oBrowser.page;
    browser = oBrowser.browser;
    const navigationPromise = oBrowser.navigationPromise;
    const pMenu = await page.$x(po.partsMenuBtn);
    await pMenu[0].click();
    await page.waitForTimeout(4000);
    logger.info("parts menu clicked!!");
    const pOverview = await page.$x(po.partsOverviewBtn);
    await pOverview[0].click();
    logger.info("parts overview!!!");
    await navigationPromise;
    await page.waitForTimeout(12000);
    const ids = [
      po.canvas_1,
      po.canvas_2,
      po.canvas_3,
      po.canvas_4,
      po.canvas_5,
      po.canvas_6,
      po.canvas_7,
      po.canvas_8,
      po.canvas_9,
    ];
    const title = await page.title();
    if (title == "CP Parts Overview") {
      logger.info("CP Parts Overview title verify success");
      for (let i = 0; i <= ids.length - 1; i++) {
        await page
          .waitForSelector(ids[i], {
            visible: true,
            timeout: 4000,
          })
          .then(() => {
            logger.info(`graph ${i + 1} displayed properly`);
          })
          .catch(() => {
            logger.error(`graph ${i + 1} not displayed properly`);
            errors.push(`graph ${i + 1} not displayed properly`);
          });
        await page.waitForTimeout(2000);
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
