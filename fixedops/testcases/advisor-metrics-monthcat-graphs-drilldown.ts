import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { AdvisorTechMetricsSelector as as } from "../selectors/advisor-tech-metrics.ts";
import { fixedopsCommonLogin } from "./common/fixedops-common-login.ts";
import { getRandomNumberBetween, startLogger } from "../utilities/utils.ts";
import { LaborWorkMiss as lw } from "../selectors/labor-work-mix.ts";

const logger = startLogger();

const errors: string[] = [];

function fixedOpsAdvisorMetricsTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[AEC-FOCP-UI-FN-LD-0006] ${site.name} FixedOps Advisor Metrics Month Category Graphs Drill Down Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-UI-FN-LD-0006",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await advisorMetricsPageMonthCatGraphsDrillDownTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Advisor Metrics Month Category Graphs Drill Down Test";
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

async function advisorMetricsPageMonthCatGraphsDrillDownTest(baseURL: string) {
  let browser = null;

  try {
    const oBrowser = await fixedopsCommonLogin(baseURL);
    const page = oBrowser.page;
    browser = oBrowser.browser;
    const navigationPromise = oBrowser.navigationPromise;

    await navigationPromise;
    await page.waitForTimeout(15000);

    await page.waitForSelector(as.advisorMetricsLink);
    await page.click(as.advisorMetricsLink);
    await navigationPromise;
    await page.waitForTimeout(15000);
    logger.info("advisor link clicked!!!");

    const title = await page.title();

    const toggleBtn = [
      lw.tglBtn_1,
      lw.tglBtn_2,
      lw.tglBtn_3,
      lw.tglBtn_4,
      lw.tglBtn_5,
    ];

    if (title == "Service Advisor Performance") {
      logger.info("Service Advisor Performance title verify success");

      const monthCategoryTab = await page.$x(as.categoryByMonthTab);
      await monthCategoryTab[0].click();
      await navigationPromise;
      await page.waitForTimeout(15000);

      const num1 = await getRandomNumberBetween(1, 10);

      await page
        .waitForSelector(as.alertMessage, {
          visible: true,
          timeout: 4000,
        })
        .then(() => {
          logger.warn(
            "there is no data present on the graphs,skipping graphs drill down check"
          );
        })
        .catch(async () => {
          await page.waitForTimeout(2000);
          const graph = await page.waitForXPath(as.getMonthCatCanvas(num1), {
            visible: true,
            timeout: 2000,
          });
          await page.waitForTimeout(2000);

          if (graph) {
            logger.info("graph visible properly");
            await page.waitForTimeout(2000);
            let i = 1;
            do {
              const idRanges = [
                { range: await getRandomNumberBetween(14, 18) },
                { range: await getRandomNumberBetween(32, 36) },
                { range: await getRandomNumberBetween(50, 54) },
                { range: await getRandomNumberBetween(68, 72) },
                { range: await getRandomNumberBetween(86, 90) },
                { range: await getRandomNumberBetween(104, 108) },
                { range: await getRandomNumberBetween(122, 126) },
                { range: await getRandomNumberBetween(140, 144) },
                { range: await getRandomNumberBetween(158, 162) },
                { range: await getRandomNumberBetween(163, 177) },
              ];
              try {
                const bar = await page.$x(as.bar(idRanges[num1 - 1].range));
                await page.waitForTimeout(2000);
                await bar[0].click();
                await navigationPromise;
                await page.waitForTimeout(20000);
                break;
              } catch {
                i++;
                if (i == 25) {
                  break;
                }
              }
            } while (i > 0);

            let attr;
            await page
              .waitForSelector(as.summaryTab, { visible: true, timeout: 4000 })
              .then(async () => {
                logger.info("summary tab visible properly");
                attr = await page.$eval(as.summaryTab, (element) =>
                  element.getAttribute("aria-selected")
                );
              })
              .catch(() => {
                logger.error("summary tab not visible properly");
                errors.push("summary tab not visible properly");
              });
            const elements = [
              as.serAdvPerDataAsOf,
              as.serAdvPerResetBtn,
              as.serAdvPerDownloadIcon,
            ];
            const elementNames = [
              "data as of",
              "reset button",
              "download button",
            ];
            if (attr == "true") {
              logger.info(
                "navigated to service advisor summary tab in service advisor performance"
              );
              await page.waitForTimeout(2000);
              for (let i = 0; i < elements.length; i++) {
                await page
                  .waitForXPath(elements[i], {
                    visible: true,
                    timeout: 2000,
                  })
                  .then(() => {
                    logger.info(`${elementNames[i]} visible properly`);
                  })
                  .catch(() => {
                    logger.error(`${elementNames[i]} not visible properly`);
                    errors.push(`${elementNames[i]} not visible properly`);
                  });

                const el = await page
                  .waitForXPath(elements[i], {
                    visible: true,
                    timeout: 2000,
                  })
                  .catch(() => {
                    logger.warn("there is no data for drill in the graph");
                  });
                await page.waitForTimeout(2000);
                el
                  ? logger.info(`${elementNames[i]} visible properly`)
                  : [
                      logger.error(`${elementNames[i]} not visible properly`),
                      errors.push(`${elementNames[i]} not visible properly`),
                    ];
                await page.waitForTimeout(2000);
              }
              const dataTable = await page.$eval(
                as.serAdvPerDataTable,
                (elem) => {
                  return elem.style.display !== "none";
                }
              );
              await page.waitForTimeout(2000);
              if (dataTable) {
                logger.info("data table visible properly");
                await page.click(as.summaryRowData);
                await navigationPromise;
                await page.waitForTimeout(20000);
                const attr = await page.$eval(
                  as.serAdvDetailViewTab,
                  (element) => element.getAttribute("aria-selected")
                );
                if (attr.toString() == "true") {
                  logger.info("enters into service advisor detail view tab");
                  await page.waitForTimeout(2000);
                  const dataTable = await page.$eval(
                    as.serAdvPerDataTable,
                    (elem) => {
                      return elem.style.display !== "none";
                    }
                  );
                  await page.waitForTimeout(2000);
                  if (dataTable) {
                    logger.info(
                      "data table visible properly in service advisor detailed view tab"
                    );
                    await page.waitForTimeout(2000);
                    await page.mouse.click(368, 466, { button: "left" });
                    await navigationPromise;
                    await page.waitForTimeout(20000);

                    let pageTitle = await page.title();
                    await page.waitForTimeout(8000);
                    if (pageTitle == "Search by Ro") {
                      logger.info("Search by Ro title verify success");
                      await page
                        .$eval(lw.repairOrderTable, (elem) => {
                          return elem.style.display !== "none";
                        })
                        .then(() => {
                          logger.info("repair order table visible properly");
                        })
                        .catch(() => {
                          logger.error(
                            "repair order table not visible properly"
                          );
                          errors.push(
                            "repair order table not visible properly"
                          );
                        });
                      await page.waitForTimeout(5000);
                      let i = 1;
                      let tglNum!: number;
                      do {
                        try {
                          tglNum = await getRandomNumberBetween(0, 4);
                          await page.waitForTimeout(2000);
                          const btn = await page.waitForXPath(
                            toggleBtn[tglNum],
                            {
                              visible: true,
                              timeout: 2000,
                            }
                          );

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
                        logger.info(
                          "repair order toggle button navigation success"
                        );
                        await page.waitForTimeout(5000);

                        await page
                          .$eval(lw.dataTable, (elem) => {
                            return elem.style.display !== "none";
                          })
                          .then(async () => {
                            logger.info(
                              "data table display properly under opcode summery tab"
                            );
                            await page
                              .waitForXPath(lw.noTableRowDataMsg)
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
                          lw.opcodeDetailedViewTab,
                          (element) => element.getAttribute("aria-selected")
                        );
                        await page.waitForTimeout(5000);
                        if (attr.toString() == "true") {
                          logger.info("enters into opcode detail view");
                          await page.waitForTimeout(4000);

                          await page
                            .$eval(lw.dataTable, (elem) => {
                              return elem.style.display !== "none";
                            })
                            .then(async () => {
                              logger.info(
                                "data table display properly under opcode detail view tab"
                              );
                              await page
                                .waitForXPath(lw.noTableRowDataMsg)
                                .then(() => {
                                  logger.warn("there is no data in the table");
                                })
                                .catch(async () => {
                                  const rowData = await page.$x(
                                    lw.detailedViewRowData
                                  );
                                  await rowData[0].click();
                                  await navigationPromise;
                                  logger.info("row data clicked");
                                  await page.waitForTimeout(20000);
                                  pageTitle = await page.title();
                                  pageTitle == "Search by Ro"
                                    ? logger.info(
                                        "advisor metrics month category graphs drill down cycle success"
                                      )
                                    : [
                                        logger.error(
                                          "advisor metrics month category graphs drill down cycle failed"
                                        ),
                                        errors.push(
                                          "advisor metrics month category graphs drill down cycle failed"
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
                        logger.error(
                          "repair order toggle button navigation failed"
                        );
                        errors.push(
                          "repair order toggle button navigation failed"
                        );
                      }
                    } else {
                      logger.warn("there is no row data for drill down!");
                    }
                  } else {
                    logger.info(
                      "data table not visible properly in service advisor detailed view tab"
                    );
                    errors.push(
                      "data table not visible properly in service advisor detailed view tab"
                    );
                  }
                } else {
                  logger.warn("there is no row data for drill down");
                }
              } else {
                logger.error("data table not visible properly");
                errors.push("data table not visible properly");
              }
            } else {
              logger.warn(
                "navigation unsuccessful to service advisor summary tab in service advisor performance due to no data in the graphs for drill down"
              );
            }
          } else {
            logger.error("graph not visible properly");
            errors.push("graph not visible properly");
          }
        });
    } else {
      logger.info("advisor metrics title verify failed");
      errors.push("advisor metrics title verify failed");
    }
    ts.assert(
      errors.length == 0,
      `Error in  Advisor Metrics Page: ${errors.join("\n")}`
    );
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsAdvisorMetricsTest();
