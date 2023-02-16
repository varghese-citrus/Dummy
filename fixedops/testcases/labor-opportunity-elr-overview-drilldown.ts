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
      name: `[DEMO-TEST] ${site.name} FixedOps Labor Opportunity Effective Labor Rate Page Overview Drill Down Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "DEMO-TEST",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await laborOpportunityElrPageOverviewDrillDownTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Labor Opportunity Effective Labor Rate Page Overview Drill Down Test";
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

async function laborOpportunityElrPageOverviewDrillDownTest(baseURL: string) {
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

      const graph = await page.$eval(await wl.chart, (elem) => {
        return elem.style.display !== "none";
      });
      await page.waitForTimeout(5000);
      if (graph) {
        logger.info("graph display properly");

        const viewDetainBtn = await page.$eval(wl.viewDetailBtn, (elem) => {
          return elem.style.display !== "none";
        });
        await page.waitForTimeout(5000);
        if (viewDetainBtn) {
          logger.info("view detail button visible properly");
          await page.click(wl.viewDetailBtn);
          await navigationPromise;
          await page.waitForTimeout(5000);

          const title = await page.title();

          if (title == "Overview") {
            logger.info("view detail button navigation success");

            await page.waitForTimeout(4000);

            const canvas = await page.$eval(wl.chart, (elem) => {
              return elem.style.display !== "none";
            });
            await page.waitForTimeout(2000);
            if (canvas) {
              logger.info("canvas display properly");
              await page.waitForTimeout(4000);

              const selector = await page.$x(wl.logo);
              await page.waitForTimeout(2000);
              await page.evaluate((element) => {
                element.scrollIntoView(
                  0,
                  parseInt(element.getBoundingClientRect().y)
                );
              }, selector[0]);
              logger.info("scroll to element");
              await page.waitForTimeout(4000);
              const canvas = await page.waitForSelector(wl.chart);
              const rect = await page.evaluate((el) => {
                const { x, y } = el.getBoundingClientRect();
                return { x, y };
              }, canvas);

              const storeName = Deno.env.get("STORE");

              switch (storeName) {
                case "Koeppel Ford": {
                  await page.mouse
                    .click(rect.x + 85, rect.y + 221, { button: "left" })
                    .then(async () => {
                      await navigationPromise;
                      await page.waitForTimeout(15000);

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
                      logger.warn(
                        "there is no data in bar chart for drill down"
                      );
                    });
                  break;
                }
                case "Koeppel Hyundai": {
                  await page.mouse
                    .click(rect.x + 90, rect.y + 216, { button: "left" })
                    .then(async () => {
                      await navigationPromise;
                      await page.waitForTimeout(15000);

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
                      logger.warn(
                        "there is no data in bar chart for drill down"
                      );
                    });
                  break;
                }
                case "Koeppel Mazda": {
                  await page.mouse
                    .click(rect.x + 126, rect.y + 220, { button: "left" })
                    .then(async () => {
                      await navigationPromise;
                      await page.waitForTimeout(15000);

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
                      logger.warn(
                        "there is no data in bar chart for drill down"
                      );
                    });
                  break;
                }
                case "Koeppel Nissan": {
                  await page.mouse
                    .click(rect.x + 180, rect.y + 232, { button: "left" })
                    .then(async () => {
                      await navigationPromise;
                      await page.waitForTimeout(15000);

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
                      logger.warn(
                        "there is no data in bar chart for drill down"
                      );
                    });
                  break;
                }
                case "Koeppel Subaru": {
                  await page.mouse
                    .click(rect.x + 121, rect.y + 204, { button: "left" })
                    .then(async () => {
                      await navigationPromise;
                      await page.waitForTimeout(15000);

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
                      logger.warn(
                        "there is no data in bar chart for drill down"
                      );
                    });
                  break;
                }
                default: {
                  await page.mouse
                    .click(rect.x + 121, rect.y + 204, { button: "left" })
                    .then(async () => {
                      await navigationPromise;
                      await page.waitForTimeout(15000);

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
                      logger.warn(
                        "there is no data in bar chart for drill down"
                      );
                    });
                  break;
                }
              }
            } else {
              logger.error("canvas not display properly");
              errors.push("canvas not display properly");
            }
          } else {
            logger.error("view detail button navigation fail");
            errors.push("view detail button navigation fail");
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
        "“What If” Opportunity Effective Labor Rate title verify failed"
      );
      errors.push(
        "“What If” Opportunity Effective Labor Rate title verify failed"
      );
    }

    ts.assert(
      errors.length == 0,
      `Error in Labor Opportunity Effective Labor Rate Page: ${errors.join(
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
