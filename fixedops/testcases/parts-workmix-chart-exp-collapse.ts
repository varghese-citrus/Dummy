import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { fixedopsCommonLogin } from "./common/fixedops-common-login.ts";
import { PartsWorkmixSelectors as pw } from "../selectors/parts-work-mix.ts";
import { startLogger } from "../utilities/utils.ts";

const errors: string[] = [];
const logger = startLogger();

function fixedOpsPartsWorkmixTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[AEC-FOCP-UI-FN-LD-0183] ${site.name} FixedOps Parts Workmix Chart Expand Collapse Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "[AEC-FOCP-UI-FN-LD-0183]",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await partsWorkmixChartExpCollapseTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Parts Workmix Chart Expand Collapse Test";
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

async function partsWorkmixChartExpCollapseTest(baseURL: string) {
  let browser = null;

  try {
    const oBrowser = await fixedopsCommonLogin(baseURL);
    const page = oBrowser.page;
    browser = oBrowser.browser;
    const navigationPromise = oBrowser.navigationPromise;
    await page.waitForSelector(pw.partsMenu);
    await page.click(pw.partsMenu);
    await page.waitForTimeout(5000);
    logger.info("Parts Menu clicked");
    const partsWrkMixMenu = await page.$x(pw.partsWorkmixMenu);
    await partsWrkMixMenu[0].click();
    logger.info("Parts workMix menu clicked");
    navigationPromise;
    await page.waitForTimeout(15000);

    for (let i = 1; i <= 6; i++) {
      const expandE = await page.$x(pw.partsExpandBtn(i));
      const expandBtn = await page.waitForXPath(pw.partsExpandBtn(i), {
        visible: true,
      });
      await page.waitForTimeout(8000);
      if (expandBtn != null) {
        logger.info(`Expand Button ${i} visible properly`);
        await expandE[0].click();
        await page.waitForTimeout(5000);

        await page
          .waitForSelector(pw.dialogBox, {
            visible: true,
            timeout: 4000,
          })
          .then(() => {
            logger.info(`Chart ${i} expanded properly`);
          })
          .catch(() => {
            logger.error(`Chart ${i} not expanded`);
            errors.push(`Charts ${i} not expanded`);
          });
        await page.waitForTimeout(4000);
        const collapseBtn = await page.waitForSelector(pw.partsColBtn, {
          visible: true,
          timeout: 4000,
        });
        if (collapseBtn != null) {
          logger.info(`Collapse button ${i} visible properly`);
          await page.waitForTimeout(5000);
          await page.click(pw.partsColBtn);
          await page.waitForTimeout(5000);
          const popUp = await page.$x(pw.popUp);
          popUp.length == 0
            ? logger.info(`chart ${i} collapse properly`)
            : [
                logger.error(`chart ${i} not collapse properly`),
                errors.push(`chart ${i} not collapse properly`),
              ];
        } else {
          logger.error(`collapse button ${i} not visible properly`);
          errors.push(`collapse button ${i} not visible properly`);
        }
      } else {
        logger.error(`expand button ${i} not visible`);
        errors.push(`expand button ${i} not visible`);
      }
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
