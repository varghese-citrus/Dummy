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
      name: `[AEC-FOCP-UI-FN-LD-0088] ${site.name} FixedOps Labor Opportunity Hrs Ro Gp Page Overview Drill Down Test`,
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
          await laborOpportunityHrsRoGpPageOverviewDrillDownTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Labor Opportunity Hrs Ro Gp Page Overview Drill Down Test";
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

async function laborOpportunityHrsRoGpPageOverviewDrillDownTest(
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
    await page.waitForTimeout(5000);
    await page.waitForSelector(ws.whatIf);
    await page.click(ws.whatIf);
    await navigationPromise;
    await page.waitForTimeout(20000);
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
          if (title == "Overview") {
            logger.info("view detail button navigation success");
            await page.waitForTimeout(4000);
            const graph = await page.waitForSelector(ws.chart, {
              visible: true,
              timeout: 4000,
            });
            await page.waitForTimeout(2000);
            if (graph != null) {
              logger.info("canvas display properly");
              const canvas = await page.$(ws.chart);
              const position = await page.evaluate((canvas) => {
                const { x, y } = canvas.getBoundingClientRect();
                return { x, y };
              }, canvas);
              const x = position.x + 760;
              const y = position.y + 231;
              const store = Deno.env.get("STORE");
              if (store == "Koeppel Nissan" || store == "Koeppel Subaru") {
                await page.mouse
                  .click(370, 583, { button: "left" })
                  .then(async () => {
                    await navigationPromise;
                    await page.waitForTimeout(20000);
                    const pageTitle = await page.title();
                    await page.waitForTimeout(2000);

                    pageTitle == "Labor Work Mix"
                      ? logger.info(
                          "overview bar chart clicked and labor work mix page verify success"
                        )
                      : [
                          logger.error(
                            "overview bar chart clicked and labor work mix page verify failed"
                          ),
                          errors.push(
                            "overview bar chart clicked and labor work mix page verify failed"
                          ),
                        ];
                  })
                  .catch(() => {
                    logger.warn("there is no data for drill down");
                  });
              } else if (store == "Suntrup Ford Westport") {
                await page.mouse
                  .click(360, 618, { button: "left" })
                  .then(async () => {
                    await navigationPromise;
                    await page.waitForTimeout(20000);

                    const pageTitle = await page.title();
                    await page.waitForTimeout(2000);

                    pageTitle == "Labor Work Mix"
                      ? logger.info(
                          "overview bar chart clicked and labor work mix page verify success"
                        )
                      : [
                          logger.error(
                            "overview bar chart clicked and labor work mix page verify failed"
                          ),
                          errors.push(
                            "overview bar chart clicked and labor work mix page verify failed"
                          ),
                        ];
                  })
                  .catch(() => {
                    logger.warn("there is no data for drill down");
                  });
              } else if (store == "ABC Networks" || store == "XYZ Group") {
                await page.mouse
                  .click(377, 618, { button: "left" })
                  .then(async () => {
                    await navigationPromise;
                    await page.waitForTimeout(20000);

                    const pageTitle = await page.title();
                    await page.waitForTimeout(2000);

                    pageTitle == "Labor Work Mix"
                      ? logger.info(
                          "overview bar chart clicked and labor work mix page verify success"
                        )
                      : [
                          logger.error(
                            "overview bar chart clicked and labor work mix page verify failed"
                          ),
                          errors.push(
                            "overview bar chart clicked and labor work mix page verify failed"
                          ),
                        ];
                  })
                  .catch(() => {
                    logger.warn("there is no data for drill down");
                  });
              } else if (store == " Warrensburg CDJR-Fiat") {
                await page.mouse
                  .click(438, 519, { button: "left" })
                  .then(async () => {
                    await navigationPromise;
                    await page.waitForTimeout(20000);

                    const pageTitle = await page.title();
                    await page.waitForTimeout(2000);

                    pageTitle == "Labor Work Mix"
                      ? logger.info(
                          "overview bar chart clicked and labor work mix page verify success"
                        )
                      : [
                          logger.error(
                            "overview bar chart clicked and labor work mix page verify failed"
                          ),
                          errors.push(
                            "overview bar chart clicked and labor work mix page verify failed"
                          ),
                        ];
                  })
                  .catch(() => {
                    logger.warn("there is no data for drill down");
                  });
              } else {
                await page.mouse
                  .click(x, y, { button: "left" })
                  .then(async () => {
                    await navigationPromise;
                    await page.waitForTimeout(20000);
                    const pageTitle = await page.title();
                    await page.waitForTimeout(2000);

                    pageTitle == "Labor Work Mix"
                      ? logger.info(
                          "overview bar chart clicked and labor work mix page verify success"
                        )
                      : [
                          logger.error(
                            "overview bar chart clicked and labor work mix page verify failed"
                          ),
                          errors.push(
                            "overview bar chart clicked and labor work mix page verify failed"
                          ),
                        ];
                  })
                  .catch(() => {
                    logger.warn("there is no data for drill down");
                  });
              }
            } else {
              logger.error("canvas not display properly");
              errors.push("canvas not display properly");
            }
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
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsOpportunityHrsRoGpPageTest();
