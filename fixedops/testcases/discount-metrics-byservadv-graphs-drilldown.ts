import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { DiscountMetricsSelector as ds } from "../selectors/discount-metrics.ts";
import { PartsWorkmixSelectors as pw } from "../selectors/parts-work-mix.ts";
import { fixedopsCommonLogin } from "./common/fixedops-common-login.ts";
import { startLogger, getRandomNumberBetween } from "../utilities/utils.ts";

const logger = startLogger();
const errors: string[] = [];

function fixedOpsDiscountMetricsTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[AEC-FOCP-UI-FN-LD-0046] ${site.name} FixedOps Discount Metrics Page By Service advisor Graphs Drill Down Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-UI-FN-LD-0046",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await advisorMetricsPagebyServAdvGraphsDrillDownTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Advisor Metrics Page By service advisor Graphs Drill Down Test";
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

async function advisorMetricsPagebyServAdvGraphsDrillDownTest(baseURL: string) {
  let browser = null;

  try {
    const oBrowser = await fixedopsCommonLogin(baseURL);
    const page = oBrowser.page;
    browser = oBrowser.browser;
    const navigationPromise = oBrowser.navigationPromise;
    await navigationPromise;
    await page.waitForTimeout(15000);

    await page.waitForSelector(ds.disMetricsLink);
    await page.click(ds.disMetricsLink);
    await navigationPromise;
    await page.waitForTimeout(15000);
    logger.info("discount link clicked!!!");

    const title = await page.title();
    const toggleBtn = [
      pw.tglBtn_1,
      pw.tglBtn_2,
      pw.tglBtn_3,
      pw.tglBtn_4,
      pw.tglBtn_5,
    ];

    const idRanges = [
      { range: await getRandomNumberBetween(1, 2) },
      { range: 8 },
      { range: 2 },
      { range: 4 },
    ];

    if (title == "Discount") {
      logger.info("Discount metrics title verify success");

      const byServiceAdvisorTab = await page.$x(ds.byServiceAdvisorTab);
      await byServiceAdvisorTab[0].click();
      await page.waitForTimeout(10000);
      logger.info("By Service Advisor tab clicked");

      await page.waitForTimeout(10000);

      const num3 = await getRandomNumberBetween(1, 4);

      await page.waitForTimeout(2000);
      const graph = await page.waitForXPath(ds.getServiceAdvCanvas(num3), {
        visible: true,
        timeout: 2000,
      });
      await page.waitForTimeout(2000);

      if (graph) {
        logger.info("graph visible properly");
        await page.waitForTimeout(2000);
        switch (num3) {
          case 1: {
            const bar = await page.$x(ds.bar(idRanges[num3 - 1].range));
            await bar[0]
              .click()
              .then(async () => {
                await navigationPromise;
                logger.info("bar graph clicked");
                await page.waitForTimeout(20000);
              })
              .then(() => {
                logger.warn("there is no data for drill down");
              });
            break;
            // try {
            //   const bar = await page.$x(ds.bar(idRanges[num3 - 1].range));
            //   await bar[0].click();
            //   await navigationPromise;
            //   logger.info("bar graph clicked");
            //   await page.waitForTimeout(20000);
            // } catch {
            //   logger.warn("there is no data for drill down");
            // }
            // break;
          }
          case 2: {
            const bar = await page.$x(ds.bar(idRanges[num3 - 1].range));
            await bar[0]
              .click()
              .then(async () => {
                await navigationPromise;
                logger.info("bar graph clicked");
                await page.waitForTimeout(20000);
              })
              .catch(() => {
                logger.warn("there is no data for drill down");
              });
            break;
            // try {
            //   const bar = await page.$x(ds.bar(idRanges[num3 - 1].range));
            //   await bar[0].click();
            //   await navigationPromise;
            //   logger.info("bar graph clicked");
            //   await page.waitForTimeout(20000);
            // } catch {
            //   logger.warn("there is no data for drill down");
            // }
            // break;
          }
          case 3: {
            const bar = await page.$x(ds.bar_2(idRanges[num3 - 1].range));
            await bar[0]
              .click()
              .then(async () => {
                await bar[0].click();
                await navigationPromise;
                logger.info("bar graph clicked");
                await page.waitForTimeout(20000);
              })
              .catch(() => {
                logger.warn("there is no data for drill down");
              });
            break;
            // try {
            //   const bar = await page.$x(ds.bar_2(idRanges[num3 - 1].range));
            //   await bar[0].click();
            //   await navigationPromise;
            //   logger.info("bar graph clicked");
            //   await page.waitForTimeout(20000);
            // } catch {
            //   logger.warn("there is no data for drill down");
            // }
            // break;
          }
          case 4: {
            const bar = await page.$x(ds.bar_2(idRanges[num3 - 1].range));
            await bar[0]
              .click()
              .then(async () => {
                await navigationPromise;
                logger.info("bar graph clicked");
                await page.waitForTimeout(20000);
              })
              .catch(() => {
                logger.warn("there is no data for drill down");
              });
            break;
            // try {
            //   const bar = await page.$x(ds.bar_2(idRanges[num3 - 1].range));
            //   await bar[0].click();
            //   await navigationPromise;
            //   logger.info("bar graph clicked");
            //   await page.waitForTimeout(20000);
            // } catch {
            //   logger.warn("there is no data for drill down");
            // }
            // break;
          }
        }
        const pageTitle = await page.title();
        if (pageTitle != "Discount") {
          const element = [ds.backBtn, ds.resetLayout, ds.downloadBtn];
          const elementNames = [
            "data as of",
            "reset button",
            "download button",
          ];

          for (let i = 0; i <= element.length - 1; i++) {
            await page.waitForTimeout(2000);
            await page
              .waitForXPath(element[i], {
                visible: true,
                timeout: 2000,
              })
              .then(() => {
                logger.info(
                  `discount metrics ${elementNames[i]} display properly`
                );
              })
              .catch(() => {
                logger.error(
                  `discount metrics ${elementNames[i]} not display properly`
                );
                errors.push(
                  `discount metrics ${elementNames[i]} not display properly`
                );
              });
            await page.waitForTimeout(2000);
          }

          const dataTable = await page.$eval(ds.dataTable, (elem) => {
            return elem.style.display !== "none";
          });
          await page.waitForTimeout(2000);
          if (dataTable) {
            logger.info(
              "data table visible properly in discount metrics drill down"
            );
            await page.waitForTimeout(2000);
            await page.mouse.click(285, 221, { button: "left" });
            await navigationPromise;
            await page.waitForTimeout(20000);

            let pageTitle = await page.title();

            if (pageTitle == "Search by Ro") {
              logger.info("Search by Ro title verify success");

              await page
                .$eval(pw.repairOrderTable, (elem) => {
                  return elem.style.display !== "none";
                })
                .then(() => {
                  logger.info("repair order table visible properly");
                })
                .catch(() => {
                  logger.error("repair order table not visible properly");
                  errors.push("repair order table not visible properly");
                });
              await page.waitForTimeout(5000);
              let i = 1;
              let tglNum!: number;
              do {
                try {
                  tglNum = await getRandomNumberBetween(0, 4);
                  await page.waitForTimeout(2000);
                  const btn = await page.waitForXPath(toggleBtn[tglNum], {
                    visible: true,
                    timeout: 2000,
                  });

                  if (btn) {
                    break;
                  }
                } catch (error) {
                  const errors: string[] = [];
                  errors.push(error);
                  const e = errors.find((x) => x === error);
                  if (e) {
                    i++;
                  }
                }
              } while (i > 0);
              await page.waitForTimeout(2000);
              const tglBtn = await page.$x(toggleBtn[tglNum]);
              await tglBtn[0].click();
              await navigationPromise;
              await page.waitForTimeout(15000);

              pageTitle = await page.title();

              if (pageTitle == "Labor Work Mix") {
                logger.info("repair order toggle button navigation success");
                await page.waitForTimeout(5000);

                await page
                  .$eval(pw.dataTable, (elem) => {
                    return elem.style.display !== "none";
                  })
                  .then(async () => {
                    logger.info(
                      "data table display properly under opcode summery tab"
                    );
                    await page
                      .waitForXPath(pw.noTableRowDataMsg)
                      .then(() => {
                        logger.warn("there is no data in the table");
                      })
                      .catch(async () => {
                        await page.mouse.click(348, 365, {
                          button: "left",
                        });
                        await navigationPromise;
                        logger.info("row data clicked");
                        await page.waitForTimeout(20000);
                      });
                  })
                  .catch(() => {
                    logger.error(
                      "data table not display properly under opcode summery tab"
                    );
                    errors.push(
                      "data table not display properly under opcode summery tab"
                    );
                  });

                const attr = await page.$eval(
                  pw.opcodeDetailedViewTab,
                  (element) => element.getAttribute("aria-selected")
                );
                await page.waitForTimeout(5000);
                if (attr.toString() == "true") {
                  logger.info("enters into opcode detail view");
                  await page.waitForTimeout(4000);

                  await page
                    .$eval(pw.dataTable, (elem) => {
                      return elem.style.display !== "none";
                    })
                    .then(async () => {
                      logger.info(
                        "data table display properly under opcode detail view tab"
                      );
                      await page
                        .waitForXPath(pw.noTableRowDataMsg)
                        .then(() => {
                          logger.warn("there is no data in the table");
                        })
                        .catch(async () => {
                          const rowData = await page.$x(pw.detailedViewRowData);
                          await rowData[0].click();
                          await navigationPromise;
                          logger.info("row data clicked");
                          await page.waitForTimeout(20000);
                          pageTitle = await page.title();
                          pageTitle == "Search by Ro"
                            ? logger.info(
                                "discount metrics by service advisor graphs drill down cycle success"
                              )
                            : [
                                logger.error(
                                  "discount metrics by service advisor graphs drill down cycle failed"
                                ),
                                errors.push(
                                  "discount metrics by service advisor graphs drill down cycle failed"
                                ),
                              ];
                          await page.waitForTimeout(5000);
                        });
                    })
                    .catch(() => {
                      logger.info(
                        "data table not display properly under opcode detail view tab"
                      );
                      errors.push(
                        "data table not display properly under opcode detail view tab"
                      );
                    });
                } else {
                  logger.warn(
                    "opcode detailed view tab verification unsuccessful due to there is no data in summary table for drill down"
                  );
                }
              } else {
                logger.error("repair order toggle button navigation failed");
                errors.push("repair order toggle button navigation failed");
              }
            } else {
              logger.warn("there is no row data for drill down!");
            }
          } else {
            logger.info(
              "data table not visible properly in discount metrics drill down"
            );
            errors.push(
              "data table not visible properly in discount metrics drill down"
            );
          }
        } else {
          logger.warn(
            "drill down navigation unsuccessful because there is no data in the graphs"
          );
        }
      } else {
        logger.error("graph not visible properly");
        errors.push("graph not visible properly");
      }
    } else {
      logger.info("discount  metrics title verify failed");
      errors.push("discount  metrics title verify failed");
    }

    ts.assert(
      errors.length == 0,
      `Error in  Discount Metrics Page: ${errors.join("\n")}`
    );
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsDiscountMetricsTest();
