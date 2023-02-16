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
      name: `[AEC-FOCP-UI-FN-LD-0158] ${site.name} FixedOps Parts Overview Chart Info Icon Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "[AEC-FOCP-UI-FN-LD-0158]",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await partsOverviewChartInfoIconTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Parts Overview Chart Info Icon Test";
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

async function partsOverviewChartInfoIconTest(baseURL: string) {
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
    await navigationPromise;
    await page.waitForTimeout(4000);
    logger.info("parts menu clicked!!");
    const pOverview = await page.$x(po.partsOverviewBtn);
    await pOverview[0].click();
    logger.info("parts overview!!!");
    await navigationPromise;
    await page.waitForTimeout(12000);

    const title = await page.title();

    if (title == "CP Parts Overview") {
      logger.info("title verify success");
      for (let p = 1; p <= 9; p++) {
        await page
          .waitForXPath(po.infoButtonIcon(p), {
            visible: true,
            timeout: 4000,
          })
          .then(() => {
            logger.info(`info icon ${p} visible properly`);
          })
          .catch(() => {
            logger.error(`info icon ${p} not visible properly`);
            errors.push(`info icon ${p} not visible properly`);
          });
        await page.waitForTimeout(4000);
      }
    } else {
      logger.error("title verify failed");
      errors.push("title verify failed");
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
