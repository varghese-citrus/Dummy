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
      name: `[AEC-FOCP-UI-FN-LD-0163] ${site.name} FixedOps Parts Overview Page Expand Collapse Link Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "[AEC-FOCP-UI-FN-LD-0163]",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await partsOverviewExpColLinkTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Parts Overview Page Expand Collapse Link Test";
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
async function partsOverviewExpColLinkTest(baseURL: string) {
  let browser = null;

  try {
    const oBrowser = await fixedopsCommonLogin(baseURL);
    const page = oBrowser.page;
    browser = oBrowser.browser;
    const navigationPromise = oBrowser.navigationPromise;
    await page.reload();
    await navigationPromise;
    await page.waitForTimeout(15000);
    const pMenu = await page.$x(po.partsMenuBtn);
    await pMenu[0].click();
    await page.waitForTimeout(5000);
    logger.info("parts menu clicked!!");
    const pOverview = await page.$x(po.partsOverviewBtn);
    await pOverview[0].click();
    await navigationPromise;
    logger.info("parts overview!!!");
    await page.waitForTimeout(15000);

    const title = await page.title();
    if (title == "CP Parts Overview") {
      logger.info("Parts Overview page title verified success");
    } else {
      logger.error("Parts overview page title verify failed");
      errors.push("Parts overview page title verify failed");
    }
    for (let i = 1; i <= 9; i++) {
      const expandEl = await page.$x(po.expandX(i));
      const expandBtn = await page.waitForXPath(po.expandX(i), {
        visible: true,
      });
      if (expandBtn != null) {
        logger.info(`expand button ${i} visible properly`);
        await page.waitForTimeout(4000);
        await expandEl[0].click();
        await navigationPromise;
        await page.waitForTimeout(5000);
        await page
          .waitForSelector(po.expandCls, {
            visible: true,
            timeout: 4000,
          })
          .then(() => {
            logger.info(`container chart ${i} expand properly`);
          })
          .catch(() => {
            logger.info(`container chart ${i} not expand properly`);
            errors.push(`container chart ${i} not expand properly`);
          });
        await page.waitForTimeout(5000);
        const collapseEl = await page.$x(po.collapseX);
        const collapseBtn = await page.waitForXPath(po.collapseX, {
          visible: true,
        });
        if (collapseBtn != null) {
          logger.info(`collapse button ${i} visible properly`);
          await page.waitForTimeout(4000);
          await collapseEl[0].click();
          await navigationPromise;
          await page.waitForTimeout(5000);
          const popup = await page.$x(po.popup);
          popup.length == 0
            ? logger.info(`container chart ${i} collapse properly`)
            : [
                logger.info(`container chart ${i} not collapse properly`),
                errors.push(`container chart ${i} not collapse properly`),
              ];
        } else {
          logger.error(`collapse button ${i} not visible properly`);
          errors.push(`collapse button ${i} not visible properly`);
        }
      } else {
        logger.error(`expand button not visible properly`);
        errors.push(`expand button not visible properly`);
      }
    }
    ts.assert(
      errors.length == 0,
      `Error in Parts Overview: ${errors.join("\n")}`
    );
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsPartsOverviewTest();
