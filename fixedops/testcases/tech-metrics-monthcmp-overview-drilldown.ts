import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { AdvisorTechMetricsSelector as as } from "../selectors/advisor-tech-metrics.ts";
import { fixedopsCommonLogin } from "./common/fixedops-common-login.ts";
import { LaborWorkMiss as lw } from "../selectors/labor-work-mix.ts";
import { getRandomNumberBetween, startLogger } from "../utilities/utils.ts";

const logger = startLogger();

const errors: string[] = [];

function fixedOpsTechMetricsTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[AEC-FOCP-UI-FN-LD-0241] ${site.name} FixedOps Tech Metrics Page Month Comparison Overview Drill Down Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-UI-FN-LD-0241",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await techMetricsPageMonthCmpOverviewDrillDownTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Tech Metrics Page Month Comparison Overview Drill Down Test";
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

async function techMetricsPageMonthCmpOverviewDrillDownTest(baseURL: string) {
  let browser = null;

  try {
    const oBrowser = await fixedopsCommonLogin(baseURL);
    const page = oBrowser.page;
    browser = oBrowser.browser;
    const navigationPromise = oBrowser.navigationPromise;

    await navigationPromise;
    await page.waitForTimeout(15000);

    await page.waitForSelector(as.techMetricsLink);
    await page.click(as.techMetricsLink);
    await navigationPromise;
    await page.waitForTimeout(15000);
    logger.info("tech metrics link clicked");

    const title = await page.title();
    const toggleBtn = [
      lw.tglBtn_1,
      lw.tglBtn_2,
      lw.tglBtn_3,
      lw.tglBtn_4,
      lw.tglBtn_5,
    ];

    if (title == "Technician Performance") {
      logger.info("Technician Performance title verify success");

      await page.waitForSelector(as.technicianProductivityTab);
      await page.click(as.technicianProductivityTab);
      await page.waitForTimeout(5000);

      const monthCmp = await page.$x(as.monthCmpTab);
      await monthCmp[0].click();
      await navigationPromise;
      await page.waitForTimeout(15000);

      const num = await getRandomNumberBetween(2, 5);
      const graph = await page.waitForXPath(as.techMetricsGraphs(num), {
        visible: true,
        timeout: 2000,
      });
      await page.waitForTimeout(5000);

      if (graph) {
        logger.info("graph visible properly");
        await page.waitForTimeout(5000);
        const viewBtn = await page.$x(as.techMetricsCmpViewDetailBtn(num));
        await viewBtn[0].click();
        await navigationPromise;
        await page.waitForTimeout(15000);
        const title = await page.title();
        if (title == "Overview") {
          logger.info("view detail button navigation success");
          await page.waitForTimeout(5000);

          const canvas = await page.waitForXPath(as.techMetricsCmpCanvas, {
            visible: true,
            timeout: 2000,
          });
          await page.waitForTimeout(4000);
          if (canvas) {
            logger.info("canvas displayed properly");
            await page.waitForTimeout(4000);

            let i = 1;
            let num2 = 0;
            let circle;
            do {
              try {
                num2 = await getRandomNumberBetween(3, 29);
                circle = await page.$x(as.techMetricsBar(num2));
                await circle[0].click();
                await navigationPromise;
                await page.waitForTimeout(15000);
                logger.info("circle or bar chart clicked");
                break;
              } catch {
                logger.warn(
                  "there is no data in the graph for drill down, checking for another chart index"
                );
                i++;
              }
              if (i == 25) {
                break;
              }
            } while (i > 0);

            const pageTitle = await page.title();
            if (
              pageTitle == "Technician Performance" ||
              pageTitle != "Overview"
            ) {
              logger.info("Technician Performance title verify success");
              await page.waitForTimeout(2000);
              const elements = [
                as.techPerDataAsOf,
                as.techPerResetBtn,
                as.techPerMonthlyTableSpan,
                as.techPerMonthlyTableTab_1,
                as.techPerMonthlyTableTab_2,
                as.techPerTechNumSelect,
              ];
              const elementsNames = [
                "data as of",
                "reset button",
                "monthly table span",
                "monthly table tab 1",
                "monthly table tab 2",
                "tech number select",
              ];

              for (let i = 0; i <= elements.length - 1; i++) {
                await page.waitForTimeout(2000);
                await page
                  .waitForXPath(elements[i], {
                    visible: true,
                    timeout: 2000,
                  })
                  .then(() => {
                    logger.info(`${elementsNames[i]} display properly`);
                  })
                  .catch(() => {
                    logger.error(`${elementsNames[i]} not display properly`);
                    errors.push(`${elementsNames[i]} not display properly`);
                  });
              }
              await page.waitForTimeout(4000);
              const dataTable = await page.$eval(
                as.techPerDataTable,
                (elem) => {
                  return elem.style.display !== "none";
                }
              );
              if (dataTable) {
                logger.info(
                  "data table visible properly under technician summary tab"
                );
                await page.waitForTimeout(2000);
                const xpath = await page.$x(as.techPerSummaryRowData);
                await xpath[0].click().catch(() => {
                  logger.warn(
                    "there is no row data for drill down in technician summary table"
                  );
                });
                await navigationPromise;
                await page.waitForTimeout(15000);

                const attr = await page.$eval(
                  as.technicianDetailedViewTab,
                  (element) => element.getAttribute("aria-selected")
                );
                if (attr.toString() == "true") {
                  logger.info("enters into technician detailed view tab");
                  await page.waitForTimeout(2000);
                  const dataTable = await page.$eval(
                    as.techPerDetailedViewDataTable,
                    (elem) => {
                      return elem.style.display !== "none";
                    }
                  );
                  await page.waitForTimeout(2000);
                  if (dataTable) {
                    logger.info(
                      "data table visible under technician detailed view tab"
                    );
                    await page.waitForTimeout(2000);
                    await page
                      .waitForSelector(as.techPerDetailedViewRowData)
                      .then(async () => {
                        await page.click(as.techPerDetailedViewRowData);
                      })
                      .catch(() => {
                        logger.warn(
                          "there is no data for drill down in technician summary detailed view table"
                        );
                      });
                    await navigationPromise;
                    await page.waitForTimeout(15000);
                    let pageTitle = await page.title();
                    await page.waitForTimeout(5000);
                    if (pageTitle == "Search by Ro") {
                      logger.info("Search by Ro title verify success");

                      await page
                        .waitForSelector(lw.repairOrderTable, {
                          visible: true,
                          timeout: 4000,
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
                                        "Tech metrics month comparison overview drill down cycle success"
                                      )
                                    : [
                                        logger.error(
                                          "Tech metrics month comparison overview drill down cycle failed"
                                        ),
                                        errors.push(
                                          "Tech metrics month comparison overview drill down cycle failed"
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
                    logger.error(
                      "data table not visible under technician detailed view tab"
                    );
                    errors.push(
                      "data table not visible under technician detailed view tab"
                    );
                  }
                } else {
                  logger.warn(
                    "there is no row data for drill down in technician summary table"
                  );
                }
              } else {
                logger.error(
                  "data table not visible properly under technician summary tab"
                );
                errors.push(
                  "data table not visible properly under technician summary tab"
                );
              }
            } else {
              logger.warn(
                "Technician Performance title verify failed as there is no data in the chart"
              );
            }
          } else {
            logger.info("canvas not displayed properly");
            errors.push("canvas not displayed properly");
          }
        } else {
          logger.error("view detail button navigation failed");
          errors.push("view detail button navigation failed");
        }
      } else {
        logger.error("graph not visible properly");
        errors.push("graph not visible properly");
      }
    } else {
      logger.info("Technician Performance title verify failed");
      errors.push("Technician Performance title verify failed");
    }
    ts.assert(
      errors.length == 0,
      `Error in Tech Metrics Page: ${errors.join("\n")}`
    );
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsTechMetricsTest();
