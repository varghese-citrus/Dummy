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
      name: `[AEC-FOCP-UI-FN-LD-0249] ${site.name} FixedOps Tech Metrics Page Month Trend Overview Drill Down Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-UI-FN-LD-0249",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await techMetricsPageMonthTrendOverviewDrillDownTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Tech Metrics Page Month Trend Overview Drill Down Test";
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

async function techMetricsPageMonthTrendOverviewDrillDownTest(baseURL: string) {
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

    if (title == "Technician Performance") {
      logger.info("Technician Performance title verify success");

      await page.waitForSelector(as.technicianProductivityTab);
      await page.click(as.technicianProductivityTab);
      await page.waitForTimeout(5000);

      const monthTrend = await page.$x(as.monthTrendTab);
      await monthTrend[0].click();
      await navigationPromise;
      await page.waitForTimeout(15000);

      const num1 = await getRandomNumberBetween(2, 5);

      await page
        .waitForSelector(as.alertMessage, {
          visible: true,
          timeout: 4000,
        })
        .then(() => {
          logger.warn(
            "there is no data in the graph,skipping overview drill down check"
          );
        })
        .catch(async () => {
          const graph = await page.waitForXPath(as.techMetricsGraphs(num1), {
            visible: true,
            timeout: 2000,
          });
          await page.waitForTimeout(2000);
          const toggleBtn = [
            lw.tglBtn_1,
            lw.tglBtn_2,
            lw.tglBtn_3,
            lw.tglBtn_4,
            lw.tglBtn_5,
          ];
          if (graph) {
            logger.info("graph visible properly");
            await page.waitForTimeout(4000);
            const viewBtn = await page.$x(
              as.technicianMonthTrendViewDetailBtn(num1)
            );
            await viewBtn[0].click();
            await navigationPromise;
            await page.waitForTimeout(15000);
            const title = await page.title();
            if (title == "Overview") {
              logger.info("view detail button navigation success");
              await page.waitForTimeout(4000);
              const canvas = await page.waitForXPath(as.techMetricsCanvas, {
                visible: true,
                timeout: 2000,
              });
              await page.waitForTimeout(4000);
              if (canvas) {
                logger.info("canvas displayed properly");
                await page.waitForTimeout(4000);

                const num2 = await getRandomNumberBetween(4, 10);
                await page
                  .waitForXPath(as.techMetricsCircle(num2))
                  .then(async () => {
                    const circle = await page.$x(as.techMetricsCircle(num2));
                    await circle[0].click();
                    await navigationPromise;
                    await page.waitForTimeout(15000);
                    logger.info("circle chart clicked");
                  })
                  .catch(async () => {
                    logger.warn(
                      "line chart not found!...looking for bar chart..."
                    );
                    await page
                      .waitForXPath(as.techMetricsBar(num2))
                      .then(async () => {
                        const bar = await page.$x(as.techMetricsBar(num2));
                        await bar[0].click();
                        await navigationPromise;
                        await page.waitForTimeout(15000);
                        logger.info("bar chart clicked");
                      })
                      .catch(() => {
                        logger.warn(
                          "there is no data in the graph for drill down"
                        );
                      });
                  });

                const pageTitle = await page.title();
                if (pageTitle == "Technician Performance") {
                  logger.info("Technician Performance title verify success");
                  await page.waitForTimeout(2000);
                  const elements = [
                    as.techPerDataAsOf,
                    as.techPerResetBtn,
                    as.techPerDownloadBtn,
                    as.techPerMonthlyTableSpan,
                    as.techPerMonthlyTableTab_1,
                    as.techPerMonthlyTableTab_2,
                    as.techPerTechNumSelect,
                  ];
                  const elementsNames = [
                    "data as of",
                    "reset button",
                    "download icon",
                    "monthly table span",
                    "monthly table tab 1",
                    "monthly table tab 2",
                    "tech number select",
                  ];

                  for (let i = 0; i < elements.length; i++) {
                    await page.waitForTimeout(2000);
                    const el = await page.waitForXPath(elements[i], {
                      visible: true,
                      timeout: 2000,
                    });
                    await page.waitForTimeout(2000);
                    el
                      ? logger.info(`${elementsNames[i]} display properly`)
                      : [
                          logger.info(
                            `${elementsNames[i]} not display properly`
                          ),
                          errors.push(
                            `${elementsNames[i]} not display properly`
                          ),
                        ];
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

                          const repairOderTable = await page.$eval(
                            lw.repairOrderTable,
                            (elem) => {
                              return elem.style.display !== "none";
                            }
                          );

                          repairOderTable
                            ? logger.info("repair order table visible properly")
                            : [
                                logger.error(
                                  "repair order table not visible properly"
                                ),
                                errors.push(
                                  "repair order table not visible properly"
                                ),
                              ];

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
                                    logger.warn(
                                      "there is no data in the table"
                                    );
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
                                      logger.warn(
                                        "there is no data in the table"
                                      );
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
                                            "Tech metrics month trend overview drill down cycle success"
                                          )
                                        : [
                                            logger.error(
                                              "Tech metrics month trend overview drill down cycle failed"
                                            ),
                                            errors.push(
                                              "Tech metrics month trend overview drill down cycle failed"
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
                  logger.error("Technician Performance title verify failed");
                  errors.push("Technician Performance title verify failed");
                }
              } else {
                logger.info("canvas not displayed properly");
                errors.push("canvas not displayed properly");
              }
              await page.waitForTimeout(2000);
            } else {
              logger.error("view detail button navigation failed");
              errors.push("view detail button navigation failed");
            }
          } else {
            logger.error("graph not visible properly");
            errors.push("graph not visible properly");
          }
        });
    } else {
      logger.info("Technician Performance title verify failed");
      errors.push("Technician Performance title verify failed");
    }

    ts.assert(
      errors.length == 0,
      `Error in  Tech Metrics Page: ${errors.join("\n")}`
    );
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsTechMetricsTest();
