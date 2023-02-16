import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { LaborOppertunityHrsRoGpSelectors as ws } from "../selectors/labor-opportunity-hrsro-gp.ts";
import { LaborSelectors as ls } from "../selectors/labor-overview.ts";
import { fixedopsCommonLogin } from "./common/fixedops-common-login.ts";
import { startLogger } from "../utilities/utils.ts";

const logger = startLogger();
const errors: string[] = [];

function fixedOpsOpportunityHrsRoGpPageTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[AEC-FOCP-UI-FN-LD-0088] ${site.name} FixedOps Labor Opportunity Hrs Ro Gp Page View Detail Drill Down Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-UI-FN-LD-0088",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await laborOpportunityHrsRoGpPageViewDetailDrillDownTest(
            site.baseURL
          );
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Labor Opportunity Hrs Ro Gp Page View Detail Drill Down Test";
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

async function laborOpportunityHrsRoGpPageViewDetailDrillDownTest(
  baseURL: string
) {
  let browser = null;
  try {
    const oBrowser = await fixedopsCommonLogin(baseURL);
    const page = oBrowser.page;
    browser = oBrowser.browser;
    const navigationPromise = oBrowser.navigationPromise;

    await page.waitForSelector(ls.labor);
    await page.click(ls.labor);
    logger.info("labor expand collapse link clicked!!!");
    await page.waitForTimeout(4000);
    await page.waitForSelector(ws.whatIf);
    await page.click(ws.whatIf);
    await navigationPromise;
    await page.waitForTimeout(15000);
    logger.info("what if opportunity link clicked!!!");

    const title = await page.title();

    if (title == "“What If” Opportunity Hrs Per RO & Labor GP%") {
      logger.info(
        "“What If” Opportunity Hrs Per RO & Labor GP% title verify success"
      );

      await page.waitForTimeout(5000);
      const graph = await page.waitForSelector(ws.chart, {
        visible: true,
        timeout: 4000,
      });
      await page.waitForTimeout(5000);
      if (graph != null) {
        logger.info("graph display properly");
        const viewDetainBtn = await page.waitForSelector(ws.viewDetailBtn, {
          visible: true,
          timeout: 4000,
        });
        await page.waitForTimeout(5000);
        if (viewDetainBtn != null) {
          logger.info("view detail button visible properly");
          await page.click(ws.viewDetailBtn);
          await navigationPromise;
          await page.waitForTimeout(5000);
          const title = await page.title();
          const elements = [ws.editBtn, ws.backBtn, ws.dataAsOf];
          const elementsName = ["edit button", "back button", "data as of"];
          if (title == "Overview") {
            logger.info("view detail button navigation success");
            await page.waitForTimeout(4000);
            await page
              .waitForSelector(ws.laborOpportunityContainer, {
                visible: true,
                timeout: 4000,
              })
              .then(() => {
                logger.info("labor overview container display properly");
              })
              .catch(() => {
                logger.error("labor overview container not display properly");
                errors.push("labor overview container not display properly");
              });
            await page.waitForTimeout(4000);
            for (let k = 0; k <= elements.length - 1; k++) {
              await page
                .waitForXPath(elements[k], {
                  visible: true,
                  timeout: 2000,
                })
                .then(() => {
                  logger.info(`${elementsName[k]} displayed properly`);
                })
                .catch(() => {
                  logger.info(`${elementsName[k]} not displayed properly`);
                  errors.push(`${elementsName[k]} not displayed properly`);
                });
              await page.waitForTimeout(2000);
            }
            await page.waitForTimeout(4000);
            await page
              .waitForSelector(ws.chart, {
                visible: true,
                timeout: 4000,
              })
              .then(() => {
                logger.info("canvas display properly");
              })
              .catch(() => {
                logger.error("canvas not display properly");
                errors.push("canvas not display properly");
              });
          } else {
            logger.error("view detail button navigation failed");
            errors.push("view detail button navigation failed");
          }
        } else {
          logger.error("view detail button not visible properly");
          errors.push("view detail button not visible properly");
        }
      } else {
        logger.error("graph not display properly");
        errors.push("graph not display properly");
      }
    } else {
      logger.error(
        "“What If” Opportunity Hrs Per RO & Labor GP% title verify failed"
      );
      errors.push(
        "“What If” Opportunity Hrs Per RO & Labor GP% title verify failed"
      );
    }
    ts.assert(
      errors.length == 0,
      `Error in  Labor Opportunity Hrs Ro Gp Page: ${errors.join("\n")}`
    );
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsOpportunityHrsRoGpPageTest();
