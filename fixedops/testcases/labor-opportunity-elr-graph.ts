import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { LaborOppertunityElrSelectors as wl } from "../selectors/labor-opportunity-elr.ts";
import { LaborSelectors as ls } from "../selectors/labor-overview.ts";
import { fixedopsCommonLogin } from "./common/fixedops-common-login.ts";
import { startLogger } from "../utilities/utils.ts";

const logger = startLogger();
const errors: string[] = [];

function fixedOpsOpportunityElrPageTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[AEC-FOCP-UI-FN-LD-0081] ${site.name} FixedOps Labor Opportunity Effective Labor Rate Page Graph Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-UI-FN-LD-0081",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await laborOpportunityElrPageGraphTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Labor Opportunity Effective Labor Rate Page Graph Test";
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

async function laborOpportunityElrPageGraphTest(baseURL: string) {
  let browser = null;

  try {
    const oBrowser = await fixedopsCommonLogin(baseURL);
    const page = oBrowser.page;
    browser = oBrowser.browser;
    const navigationPromise = oBrowser.navigationPromise;

    await page.waitForSelector(ls.labor);
    await page.click(ls.labor);
    logger.info("labor expand collapse link clicked!!!");
    await page.waitForTimeout(5000);

    await page.waitForSelector(wl.whatIfElrLink);
    await page.click(wl.whatIfElrLink);
    await navigationPromise;
    await page.waitForTimeout(15000);
    logger.info("what if opportunity elr link clicked!!!");

    const title = await page.title();

    if (title == "“What If” Opportunity Effective Labor Rate") {
      logger.info(
        "“What If” Opportunity Effective Labor Rate title verify success"
      );

      const graph = await page.waitForSelector(wl.chart, {
        visible: true,
        timeout: 4000,
      });
      await page.waitForTimeout(5000);
      if (graph != null) {
        logger.info("graph display properly");
        const chartName = await page.$eval(
          wl.chartName,
          (element) => element.textContent
        );
        const chartNumber = await page.$eval(
          wl.chartNumber,
          (element) => element.textContent
        );
        if (
          chartName.toString() == "CP Pricing Opportunity By Category" &&
          chartNumber.toString() == "921"
        ) {
          logger.info("chart name and number verify success");

          await page
            .waitForSelector(wl.infoIcon, {
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
          const expandBtn = await page.waitForSelector(wl.expColBtn, {
            visible: true,
            timeout: 4000,
          });

          if (expandBtn != null) {
            logger.info("expand button visible properly");
            await page.waitForTimeout(4000);
            await page.click(wl.expColBtn);
            await navigationPromise;
            await page.waitForTimeout(5000);

            await page
              .waitForSelector(wl.popup, {
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
            const collapseBtn = await page.waitForSelector(wl.collapseBtn, {
              visible: true,
              timeout: 4000,
            });

            if (collapseBtn != null) {
              logger.info("collapse button visible properly");
              await page.waitForTimeout(5000);

              await page.click(wl.collapseBtn);
              await navigationPromise;
              await page.waitForTimeout(5000);

              await page
                .waitForSelector(wl.popup, {
                  visible: true,
                  timeout: 4000,
                })
                .then(() => {
                  logger.error("chart not collapse properly");
                  errors.push("chart not collapse properly");
                })
                .catch(() => {
                  logger.error("collapse button not working properly");
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
          logger.error("chart name || number verify failed");
          errors.push("chart name || number verify failed");
        }
        await page.reload();
        await navigationPromise;
        await page.waitForTimeout(10000);
        const viewDetainBtn = await page.waitForSelector(wl.viewDetailBtn, {
          visible: true,
          timeout: 4000,
        });
        await page.waitForTimeout(5000);
        if (viewDetainBtn != null) {
          logger.info("view detail button visible properly");
          await page.click(wl.viewDetailBtn);
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
      logger.error(
        "“What If” Opportunity Effective Labor Rate title verify failed"
      );
      errors.push(
        "“What If” Opportunity Effective Labor Rate title verify failed"
      );
    }
    ts.assert(
      errors.length == 0,
      `Error in  Labor Opportunity Effective Labor Rate Page: ${errors.join(
        "\n"
      )}`
    );
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsOpportunityElrPageTest();
