import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { PartsOpportunitySelectors as po } from "../selectors/parts-opportunity.ts";
import { fixedopsCommonLogin } from "./common/fixedops-common-login.ts";
import { startLogger } from "../utilities/utils.ts";

const logger = startLogger();
const errors: string[] = [];

function fixedOpsPartsOpportunityTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[AEC-FOCP-UI-FN-LD-0153] ${site.name} FixedOps Parts Opportunity Graph Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "[AEC-FOCP-UI-FN-LD-0153]",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await partsOpportunityGraphTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in Parts Opportunity Graph Test";
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
async function partsOpportunityGraphTest(baseURL: string) {
  let browser = null;
  try {
    const oBrowser = await fixedopsCommonLogin(baseURL);
    const page = oBrowser.page;
    browser = oBrowser.browser;
    const navigationPromise = oBrowser.navigationPromise;
    await page.waitForSelector(po.partsMenu);
    await page.click(po.partsMenu);
    logger.info("Parts Menu clicked");
    await page.waitForTimeout(5000);
    await page.waitForSelector(po.partsOpportunity);
    await page.click(po.partsOpportunity);
    logger.info("Parts Opportunity clicked");
    await navigationPromise;
    await page.waitForTimeout(15000);
    const title = await page.title();
    if (title == "“What If” Opportunity Hrs Per RO & Parts GP%") {
      logger.info("Opportunity title verified success");

      const graph = await page.waitForSelector(po.chart, {
        visible: true,
        timeout: 4000,
      });
      await page.waitForTimeout(5000);
      if (graph != null) {
        logger.info("graph display properly");
        const chartName = await page.$eval(
          po.chartName,
          (element) => element.textContent
        );
        const chartNumber = await page.$eval(
          po.chartId,
          (element) => element.textContent
        );
        if (
          chartName.toString() == "CP Total Parts Opportunity" &&
          chartNumber.toString() == "926"
        ) {
          logger.info("chart name and number verify success");
          await page
            .waitForSelector(po.infoIcon, {
              visible: true,
              timeout: 4000,
            })
            .then(() => {
              logger.info("info icon display properly");
            })
            .catch(() => {
              logger.error("info icon not display properly");
              errors.push("info icon not display properly");
            });
          await page.waitForTimeout(5000);
          const expandBtn = await page.waitForSelector(po.expColBtn, {
            visible: true,
            timeout: 4000,
          });
          if (expandBtn != null) {
            logger.info("expand button visible properly");
            await page.waitForTimeout(4000);
            await page.click(po.expColBtn);
            await navigationPromise;
            await page.waitForTimeout(5000);
            await page
              .waitForSelector(po.popUp, {
                visible: true,
                timeout: 4000,
              })
              .then(() => {
                logger.info("chart expand properly");
              })
              .catch(() => {
                logger.error("chart not expand properly");
                errors.push("chart not expand properly");
              });
            await page.waitForTimeout(5000);
            const collapseBtn = await page.waitForSelector(po.collapseBtn, {
              visible: true,
              timeout: 4000,
            });
            if (collapseBtn != null) {
              logger.info("collapse button visible properly");
              await page.waitForTimeout(5000);
              await page.click(po.collapseBtn);
              await navigationPromise;
              await page.waitForTimeout(5000);

              await page
                .waitForSelector(po.popUp, {
                  visible: true,
                  timeout: 4000,
                })
                .then(() => {
                  logger.error("chart not collapse properly");
                  errors.push("chart not collapse properly");
                })
                .catch(() => {
                  logger.info("chart collapse properly");
                });
            } else {
              logger.error("collapse button not visible properly");
              errors.push("collapse button not visible properly");
            }
          } else {
            logger.error("expand button not visible");
            errors.push("expand button not visible");
          }
        } else {
          logger.error("chart name and number verify failed");
          errors.push("chart name and number verify failed");
        }
        await page.reload();
        await navigationPromise;
        await page.waitForTimeout(10000);
        const viewDetainBtn = await page.waitForSelector(po.viewDetailBtn, {
          visible: true,
          timeout: 4000,
        });
        await page.waitForTimeout(5000);
        if (viewDetainBtn != null) {
          logger.info("view detail button visible properly");
          await page.click(po.viewDetailBtn);
          await navigationPromise;
          await page.waitForTimeout(5000);
          const title = await page.title();
          await page.goBack();
          await navigationPromise;
          await page.waitForTimeout(5000);
          title == "Overview"
            ? logger.info("view detail button working properly")
            : [
                logger.error("view detail button not working properly"),
                errors.push("view detail button not working properly"),
              ];
        } else {
          logger.error("view detail button not visible properly");
          errors.push("view detail button not visible properly");
        }
      } else {
        logger.error("graph not display properly");
        errors.push("graph not display properly");
      }
    } else {
      console.error("what if opportunity page title verify failed");
      errors.push("what if opportunity page title verify failed");
    }
    ts.assert(
      errors.length == 0,
      `Error in Parts Opportunity Page: ${errors.join("\n")}`
    );
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsPartsOpportunityTest();
