import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { SpecialMetricsSelectors as sm } from "../selectors/special-metrics.ts";
import { fixedopsCommonLogin } from "./common/fixedops-common-login.ts";
import { startLogger, getRandomNumberBetween } from "../utilities/utils.ts";
import { LaborWorkMiss as lw } from "../selectors/labor-work-mix.ts";

const logger = startLogger();
const errors: string[] = [];

function fixedOpsSpecialMetricsTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[AEC-FOCP-UI-FN-LD-0222] ${site.name} FixedOps Special Metrics Graphs Drill Down Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-UI-FN-LD-0222",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await specialMetricsGraphsDrillDownTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Special Metrics Graphs Drill Down Test";
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

async function specialMetricsGraphsDrillDownTest(baseURL: string) {
  let browser = null;

  try {
    const oBrowser = await fixedopsCommonLogin(baseURL);
    const page = oBrowser.page;
    browser = oBrowser.browser;
    const navigationPromise = oBrowser.navigationPromise;
    await page.waitForSelector(sm.specialMetricsLink);
    await page.click(sm.specialMetricsLink);
    await navigationPromise;
    await page.waitForTimeout(15000);
    logger.info("special metrics link clicked!!!");
    const title = await page.title();
    const toggleBtn = [
      lw.tglBtn_1,
      lw.tglBtn_2,
      lw.tglBtn_3,
      lw.tglBtn_4,
      lw.tglBtn_5,
    ];
    if (title == "Special Metrics") {
      logger.info("Special Metrics title verify success");
      await page.waitForTimeout(5000);
      //const num1 = await getRandomNumberBetween(1, 8);
      const num1 = 1;
      const chartIdXpath = await page.$x(sm.getChartId(num1));
      const chartNameXpath = await page.$x(sm.getChartName(num1));
      const chartId: string = await (
        await chartIdXpath[0].getProperty("textContent")
      ).jsonValue();
      const chartName: string = await (
        await chartNameXpath[0].getProperty("textContent")
      ).jsonValue();
      await page
        .waitForXPath(sm.noDataAlertMsg(chartId), {
          visible: true,
          timeout: 4000,
        })
        .then(() => {
          logger.warn(
            `there is no data in the graph ${chartName},skipping view detail drill down check`
          );
        })
        .catch(async () => {
          const graph = await page.waitForXPath(sm.charts(num1), {
            visible: true,
            timeout: 2000,
          });
          await page.waitForTimeout(2000);
          if (graph) {
            logger.info("graph visible properly");
            await page.waitForTimeout(2000);
            const xpath = await page.$x(sm.charts(num1 + 1));
            await page.waitForTimeout(2000);
            await page.evaluate((element) => {
              element.scrollIntoView(
                0,
                parseInt(element.getBoundingClientRect().y)
              );
            }, xpath[0]);
            await page.waitForTimeout(4000);
            const canvasNameSelector = await page.$x(
              sm.specialMetricsCanvasName(num1)
            );
            const canvasName = await (
              await canvasNameSelector[0].getProperty("textContent")
            ).jsonValue();
            const selector = await page.$x(sm.specialMetricsCanvas(num1));
            const rect = await page.evaluate((el) => {
              const { x, y } = el.getBoundingClientRect();
              return { x, y };
            }, selector[0]);
            await page.waitForTimeout(2000);
            const barsRange_1 = [
              { x: rect.x + 386, y: rect.y + 132 },
              { x: rect.x + 408, y: rect.y + 138 },
            ];
            const barsRange_2 = [
              { x: rect.x + 385, y: rect.y + 135 },
              { x: rect.x + 402, y: rect.y + 140 },
              { x: rect.x + 411, y: rect.y + 140 },
            ];
            switch (canvasName) {
              case "CP Return Rate": {
                const num2 = await getRandomNumberBetween(0, 1);
                await page.mouse
                  .click(barsRange_1[num2].x, barsRange_1[num2].y, {
                    button: "left",
                  })
                  .catch(() => {
                    logger.warn("there is no data for drill down in the graph");
                  });
                await navigationPromise;
                await page.waitForTimeout(20000);
                const pageTitle = await page.title();

                if (pageTitle != "Special Metrics") {
                  logger.info(
                    "title verification success in special metrics page after clicking bar chart"
                  );
                  await page.waitForTimeout(5000);

                  for (let i = 1; i <= 3; i++) {
                    await page
                      .waitForXPath(sm.drillTable(i), {
                        visible: true,
                        timeout: 5000,
                      })
                      .then(() => {
                        logger.info(`table ${i} display properly`);
                      })
                      .catch(() => {
                        logger.error(`table ${i} not display properly`);
                        errors.push(`table ${i} not display properly`);
                      });
                    await page.waitForTimeout(4000);
                  }
                  await page.waitForSelector(sm.drillExpandBtn);
                  await page.click(sm.drillExpandBtn);
                  await page.waitForTimeout(4000);
                  await page.waitForSelector(sm.drillVinLastMonthBtn);
                  await page.click(sm.drillVinLastMonthBtn);
                  await navigationPromise;
                  await page.waitForTimeout(20000);
                  let pageTitle = await page.title();
                  await page.waitForTimeout(5000);
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
                    await page.waitForTimeout(20000);
                    pageTitle = await page.title();
                    await page.waitForTimeout(5000);
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
                                      "special metrics graphs drill down cycle success"
                                    )
                                  : [
                                      logger.error(
                                        "special metrics graphs drill down cycle failed"
                                      ),
                                      errors.push(
                                        "special metrics graphs drill down cycle failed"
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
                    "title verification failed in special metrics page after clicking bar chart"
                  );
                  errors.push(
                    "title verification failed in special metrics page after clicking bar chart"
                  );
                }
                break;
              }
              case "CP Parts to Labor Ratio By Category": {
                //const num2 = await getRandomNumberBetween(0, 2);
                const num2 = 0;
                await page.mouse
                  .click(barsRange_2[num2].x, barsRange_2[num2].y, {
                    button: "left",
                  })
                  .catch(() => {
                    logger.warn("there is no data for drill down in the graph");
                  });
                await navigationPromise;
                await page.waitForTimeout(20000);
                const pageTitle = await page.title();

                const headingSelector = await page.$x(sm.drillHeading);
                const heading = await (
                  await headingSelector[0].getProperty("textContent")
                ).jsonValue();
                await page.waitForTimeout(5000);
                if (pageTitle == `Drill Down - ${heading}`) {
                  logger.info(`Drill Down - ${heading} title verify success`);
                  await page.waitForTimeout(5000);
                  const elements = [
                    sm.drillBackBtn,
                    sm.drillDataAsOf,
                    sm.drillResetBtn,
                    sm.drillDownloadIcon,
                  ];
                  const elementsName = [
                    "back button",
                    "data as of",
                    "reset button",
                    "download icon",
                  ];

                  for (let i = 0; i <= elements.length - 1; i++) {
                    await page
                      .waitForXPath(elements[i], {
                        visible: true,
                        timeout: 5000,
                      })
                      .then(() => {
                        logger.info(`${elementsName[i]} display properly`);
                      })
                      .catch(() => {
                        logger.error(`${elementsName[i]} not display properly`);
                        errors.push(`${elementsName[i]} not display properly`);
                      });
                    await page.waitForTimeout(4000);
                  }
                  const dataTable = await page.$eval(
                    sm.drillDataTable,
                    (elem) => {
                      return elem.style.display !== "none";
                    }
                  );
                  await page.waitForTimeout(4000);
                  if (dataTable) {
                    logger.info("data table visible properly");
                    await page.waitForTimeout(5000);
                    await page.mouse.click(288, 218, { button: "left" });
                    await navigationPromise;
                    await page.waitForTimeout(20000);
                    let pageTitle = await page.title();
                    await page.waitForTimeout(5000);
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
                      await page.waitForTimeout(20000);
                      pageTitle = await page.title();
                      await page.waitForTimeout(5000);
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
                                        "special metrics graphs drill down cycle success"
                                      )
                                    : [
                                        logger.error(
                                          "special metrics graphs drill down cycle failed"
                                        ),
                                        errors.push(
                                          "special metrics graphs drill down cycle failed"
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
                    logger.error("data table not visible properly");
                    errors.push("data table not visible properly");
                  }
                } else {
                  logger.error(`Drill Down - ${heading} title verify failed`);
                  errors.push(`Drill Down - ${heading} title verify failed`);
                }
                break;
              }
              case "CP 1-Line-RO Count" || "CP 1-Line-RO Count Percentage": {
                await page.mouse
                  .click(rect.x + 407, rect.y + 241, {
                    button: "left",
                  })
                  .catch(() => {
                    logger.warn("there is no data for drill down in the graph");
                  });
                await navigationPromise;
                await page.waitForTimeout(20000);
                const pageTitle = await page.title();
                if (pageTitle != "Special Metrics") {
                  logger.info(
                    "title verification success in special metrics page after clicking bar chart"
                  );
                  await page.waitForTimeout(4000);
                  const elements = [
                    sm.drillBackBtn,
                    sm.drillDataAsOf,
                    sm.drillResetBtn,
                    sm.drillDownloadIcon,
                  ];
                  const elementsName = [
                    "back button",
                    "data as of",
                    "reset button",
                    "download icon",
                  ];

                  for (let i = 0; i <= elements.length - 1; i++) {
                    await page
                      .waitForXPath(elements[i], {
                        visible: true,
                        timeout: 2000,
                      })
                      .then(() => {
                        logger.info(`${elementsName[i]} display properly`);
                      })
                      .catch(() => {
                        logger.error(`${elementsName[i]} not display properly`);
                        errors.push(`${elementsName[i]} not display properly`);
                      });
                    await page.waitForTimeout(2000);
                  }
                  const dataTable = await page.$eval(
                    sm.drillDataTable,
                    (elem) => {
                      return elem.style.display !== "none";
                    }
                  );
                  await page.waitForTimeout(2000);
                  if (dataTable) {
                    logger.info("data table visible properly");
                    await page.waitForTimeout(2000);
                    await page.mouse.click(288, 218, { button: "left" });
                    await navigationPromise;
                    await page.waitForTimeout(20000);
                    let pageTitle = await page.title();
                    await page.waitForTimeout(5000);
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
                      await page.waitForTimeout(20000);
                      pageTitle = await page.title();
                      await page.waitForTimeout(5000);
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
                                        "special metrics graphs drill down cycle success"
                                      )
                                    : [
                                        logger.error(
                                          "special metrics graphs drill down cycle failed"
                                        ),
                                        errors.push(
                                          "special metrics graphs drill down cycle failed"
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
                    logger.error("data table not visible properly");
                    errors.push("data table not visible properly");
                  }
                } else {
                  logger.error(
                    "title verification success in special metrics page after clicking bar chart"
                  );
                  errors.push(
                    "title verification success in special metrics page after clicking bar chart"
                  );
                }
                break;
              }
              case "CP Multi-Line-RO Count": {
                await page.mouse
                  .click(rect.x + 43, rect.y + 246, {
                    button: "left",
                  })
                  .catch(() => {
                    logger.warn("there is no data for drill down in the graph");
                  });
                await navigationPromise;
                await page.waitForTimeout(20000);
                const pageTitle = await page.title();
                if (pageTitle != "Special Metrics") {
                  logger.info(
                    "title verification success in special metrics page after clicking bar chart"
                  );
                  await page.waitForTimeout(4000);
                  const elements = [
                    sm.drillBackBtn,
                    sm.drillDataAsOf,
                    sm.drillResetBtn,
                    sm.drillDownloadIcon,
                  ];
                  const elementsName = [
                    "back button",
                    "data as of",
                    "reset button",
                    "download icon",
                  ];
                  for (let i = 0; i <= elements.length - 1; i++) {
                    await page
                      .waitForXPath(elements[i], {
                        visible: true,
                        timeout: 2000,
                      })
                      .then(() => {
                        logger.info(`${elementsName[i]} display properly`);
                      })
                      .catch(() => {
                        logger.error(`${elementsName[i]} not display properly`);
                        errors.push(`${elementsName[i]} not display properly`);
                      });
                    await page.waitForTimeout(2000);
                  }
                  const dataTable = await page.$eval(
                    sm.drillDataTable,
                    (elem) => {
                      return elem.style.display !== "none";
                    }
                  );
                  await page.waitForTimeout(2000);
                  if (dataTable) {
                    logger.info("data table visible properly");
                    await page.waitForTimeout(2000);
                    await page.mouse.click(288, 218, { button: "left" });
                    await navigationPromise;
                    await page.waitForTimeout(20000);
                    let pageTitle = await page.title();
                    await page.waitForTimeout(5000);
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
                      await page.waitForTimeout(20000);
                      pageTitle = await page.title();
                      await page.waitForTimeout(5000);
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
                                        "special metrics graphs drill down cycle success"
                                      )
                                    : [
                                        logger.error(
                                          "special metrics graphs drill down cycle failed"
                                        ),
                                        errors.push(
                                          "special metrics graphs drill down cycle failed"
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
                    logger.error("data table not visible properly");
                    errors.push("data table not visible properly");
                  }
                } else {
                  logger.error(
                    "title verification success in special metrics page after clicking bar chart"
                  );
                  errors.push(
                    "title verification success in special metrics page after clicking bar chart"
                  );
                }
                break;
              }
              default: {
                await page.mouse
                  .click(rect.x + 407, rect.y + 241, {
                    button: "left",
                  })
                  .catch(() => {
                    logger.warn("there is no data for drill down in the graph");
                  });
                await navigationPromise;
                await page.waitForTimeout(20000);
                const pageTitle = await page.title();

                if (pageTitle != "Special Metrics") {
                  logger.info(
                    "title verification success in special metrics page after clicking bar chart"
                  );
                  await page.waitForTimeout(4000);
                  const elements = [
                    sm.drillBackBtn,
                    sm.drillDataAsOf,
                    sm.drillResetBtn,
                    sm.drillDownloadIcon,
                  ];
                  const elementsName = [
                    "back button",
                    "data as of",
                    "reset button",
                    "download icon",
                  ];
                  for (let i = 0; i <= elements.length - 1; i++) {
                    await page
                      .waitForXPath(elements[i], {
                        visible: true,
                        timeout: 2000,
                      })
                      .then(() => {
                        logger.info(`${elementsName[i]} display properly`);
                      })
                      .catch(() => {
                        logger.error(`${elementsName[i]} not display properly`);
                        errors.push(`${elementsName[i]} not display properly`);
                      });
                    await page.waitForTimeout(2000);
                  }
                  const dataTable = await page.$eval(
                    sm.drillDataTable,
                    (elem) => {
                      return elem.style.display !== "none";
                    }
                  );
                  await page.waitForTimeout(2000);
                  if (dataTable) {
                    logger.info("data table visible properly");
                    await page.waitForTimeout(2000);
                    await page.mouse.click(288, 218, { button: "left" });
                    await navigationPromise;
                    await page.waitForTimeout(20000);
                    let pageTitle = await page.title();
                    await page.waitForTimeout(5000);
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
                      await page.waitForTimeout(20000);
                      pageTitle = await page.title();
                      await page.waitForTimeout(5000);
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
                                        "special metrics graphs drill down cycle success"
                                      )
                                    : [
                                        logger.error(
                                          "special metrics graphs drill down cycle failed"
                                        ),
                                        errors.push(
                                          "special metrics graphs drill down cycle failed"
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
                    logger.error("data table not visible properly");
                    errors.push("data table not visible properly");
                  }
                } else {
                  logger.error(
                    "title verification failed in special metrics page after clicking bar chart"
                  );
                  errors.push(
                    "title verification failed in special metrics page after clicking bar chart"
                  );
                }
                break;
              }
            }
          } else {
            logger.error("graph not visible properly");
            errors.push("graph not visible properly");
          }
        });
    } else {
      logger.info("Special Metrics title verify failed");
      errors.push("Special Metrics title verify failed");
    }
    ts.assert(
      errors.length == 0,
      `Error in Special Metrics Page: ${errors.join("\n")}`
    );
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsSpecialMetricsTest();
