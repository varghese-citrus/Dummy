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
      name: `[AEC-FOCP-UI-FN-LD-0192] ${site.name} FixedOps Parts Workmix 2 Month Comparison Chart Expand Collapse Button Check`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "[AEC-FOCP-UI-FN-LD-0192]",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await partsWorkmixMonthComparisonChartExpandCollapseCheck(
            site.baseURL
          );
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Parts Workmix 2 Month Comparison Chart Expand Collapse Button Check";
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

async function partsWorkmixMonthComparisonChartExpandCollapseCheck(
  baseURL: string
) {
  let browser = null;
  try {
    const oBrowser = await fixedopsCommonLogin(baseURL);
    const page = oBrowser.page;
    browser = oBrowser.browser;
    const navigationPromise = oBrowser.navigationPromise;
    await page.waitForSelector(pw.partsMenu);
    await page.click(pw.partsMenu);
    logger.info("Parts Menu clicked");
    await navigationPromise;
    await page.waitForTimeout(5000);
    const partsWorkmixMenu = await page.$x(pw.partsWorkmixMenu);
    await partsWorkmixMenu[0].click();
    logger.info("Parts Workmix menu clicked");
    await navigationPromise;
    await page.waitForTimeout(15000);
    const title = await page.title();
    if (title == "Parts Work Mix") {
      logger.info("Parts workmix title verified");
      await page.waitForSelector(pw.monthComparison);
      await page.click(pw.monthComparison);
      await navigationPromise;
      await page.waitForTimeout(5000);
      for (let i = 2; i <= 6; i++) {
        let expandE_1 = await page.$x(pw.monthWrkMixChartExpBtn(i));
        const ExpandBtn = await page.waitForXPath(
          pw.monthWrkMixChartExpBtn(i),
          { visible: true, timeout: 4000 }
        );
        if (ExpandBtn !== null) {
          logger.info(`Expand button ${i - 1} visible properly`);
          await page.waitForTimeout(10000);
          expandE_1 = await page.$x(pw.monthWrkMixChartExpBtn(i));
          expandE_1[0].click();
          await navigationPromise;
          await page.waitForTimeout(5000);
          const popUp = await page.waitForSelector(
            pw.monthComparisonExpColPopup,
            { visible: true, timeout: 4000 }
          );
          popUp != null
            ? logger.info(`Chart ${i + 1} expand properly`)
            : [
                logger.error(`Chart ${i + 1} not expand properly`),
                errors.push(`Chart ${i + 1} not expand properly`),
              ];
          await page.waitForTimeout(4000);
          const collapseBtn = await page.waitForXPath(
            pw.monthComparisonCollapseBtn,
            { visible: true, timeout: 2000 }
          );
          if (collapseBtn !== null) {
            logger.info(`Collapse button ${i + 1} display properly`);
            const collapseBtn = await page.$x(pw.monthComparisonCollapseBtn);
            await collapseBtn[0].click();
            await page.waitForTimeout(4000);
            await page
              .waitForSelector(pw.monthComparisonExpColPopup, {
                visible: true,
                timeout: 4000,
              })
              .then(() => {
                logger.error(`chart ${i + 1} not collapse properly`);
                errors.push(`chart ${i + 1} not collapse properly`);
              })
              .catch(() => {
                logger.info(`chart ${i + 1} collapse properly`);
              });
          } else {
            logger.error(`Collapse button ${i + 1} not display properly`);
            errors.push(`Collapse button ${i + 1} not display properly`);
          }
        }
      }
    } else {
      logger.error("Parts workmix title verified fail");
      errors.push("Parts workmix title verified fail");
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
