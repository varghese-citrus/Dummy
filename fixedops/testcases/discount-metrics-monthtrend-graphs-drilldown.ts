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
      name: `[AEC-FOCP-UI-FN-LD-0054] ${site.name} FixedOps Discount Metrics Page Month Trend Graphs Drill Down Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-UI-FN-LD-0054",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await advisorMetricsPageMonthTrendGraphsDrillDownTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Advisor Metrics Page Month Trend Graphs Drill Down Test";
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

async function advisorMetricsPageMonthTrendGraphsDrillDownTest(
  baseURL: string
) {
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

    const [Mnthtrend] = await page.$x(ds.MonthTrendTab);
    await Mnthtrend.click();
    await navigationPromise;
    await page.waitForTimeout(15000);
    logger.info("Month trend tab clicked");

    const title = await page.title();
    const toggleBtn = [
      pw.tglBtn_1,
      pw.tglBtn_2,
      pw.tglBtn_3,
      pw.tglBtn_4,
      pw.tglBtn_5,
    ];

    if (title == "Discount") {
      logger.info("Discount metrics title verify success");

      await page.waitForTimeout(10000);
      const num1 = await getRandomNumberBetween(1, 6);

      const chartIdXpath = await page.$x(ds.monthTrendChartNumber(num1 + 1));
      const chartId: string = await (
        await chartIdXpath[0].getProperty("textContent")
      ).jsonValue();
      await page
        .waitForXPath(ds.noDataAlertMsg(chartId), {
          visible: true,
          timeout: 4000,
        })
        .then(() => {
          logger.warn(
            `there is no data in the graph,skipping graph ${
              num1 + 1
            } drill down check`
          );
        })
        .catch(async () => {
          if (num1 == 3 || num1 == 4 || num1 == 5 || num1 == 6) {
            const xpath = await page.$x(ds.discanvas(num1 + 1));

            await page.waitForTimeout(2000);
            await page.evaluate((element) => {
              element.scrollIntoView(
                0,
                parseInt(element.getBoundingClientRect().y)
              );
            }, xpath[0]);
          }
          await page.waitForTimeout(4000);
          const selector = await page.$x(ds.discanvas(num1));
          const position = await page.evaluate((el) => {
            const { x, y } = el.getBoundingClientRect();
            return { x, y };
          }, selector[0]);
          await page.waitForTimeout(5000);
          const canvasXpath = await page.$x(ds.canvasName(num1));
          const canvasName: string = await (
            await canvasXpath[0].getProperty("textContent")
          ).jsonValue();
          if (canvasName == "CP RO Count For Discounts By Discount Level") {
            const num2 = await getRandomNumberBetween(0, 1);
            const coordinates = [
              { x: 292, y: 124 },
              { x: 300, y: 122 },
            ];
            await page.mouse.click(
              position.x + coordinates[num2].x,
              position.y + coordinates[num2].y,
              {
                button: "left",
              }
            );
            await navigationPromise;
            await page.waitForTimeout(15000);
            logger.info(`${canvasName} canvas clicked`);
            const pagetitle = await page.title();
            if (
              pagetitle ==
              "Drill Down - CP RO Count For Discounts By Discount Level"
            ) {
              logger.info(`${pagetitle} title verify success`);
              await page.waitForTimeout(5000);
              const element = [
                ds.heading,
                ds.backBtn,
                ds.resetLayout,
                ds.downloadBtn,
              ];

              const elementNames = [
                "heading",
                "data as of",
                "reset button",
                "download icon",
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
                await page.waitForTimeout(4000);
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
                await page.mouse.click(293, 218, { button: "left" });
                await navigationPromise;
                await page.waitForTimeout(20000);

                let pageTitle = await page.title();

                if (pageTitle == "Search by Ro") {
                  logger.info("Search by Ro title verify success");

                  await page
                    .waitForSelector(pw.repairOrderTable, {
                      visible: true,
                      timeout: 4000,
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
                    logger.info(
                      "repair order toggle button navigation success"
                    );
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
                              const rowData = await page.$x(
                                pw.detailedViewRowData
                              );
                              await rowData[0].click();
                              await navigationPromise;
                              logger.info("row data clicked");
                              await page.waitForTimeout(20000);
                              pageTitle = await page.title();
                              pageTitle == "Search by Ro"
                                ? logger.info(
                                    "discount metrics month trend graphs drill down cycle success"
                                  )
                                : [
                                    logger.error(
                                      "discount metrics month trend graphs drill down cycle failed"
                                    ),
                                    errors.push(
                                      "discount metrics month trend graphs drill down cycle failed"
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
                "there is no data displayed in the bar for drill down"
              );
            }
          } else {
            await page.mouse.click(position.x + 334, position.y + 126, {
              button: "left",
            });
            await navigationPromise;
            await page.waitForTimeout(15000);
            logger.info(`${canvasName} canvas clicked`);
            await page.waitForTimeout(12000);

            const title = await page.title();
            let heading;

            await page
              .waitForXPath(ds.pageHeading)
              .then(async () => {
                const pageHeading = await page.$x(ds.pageHeading);
                heading = await (
                  await pageHeading[0].getProperty("textContent")
                ).jsonValue();
                await page.waitForTimeout(2000);
              })
              .catch(() => {
                logger.warn(
                  "there is no data display in the graph for drill down!"
                );
              });
            // try {
            //   const pageHeading = await page.$x(ds.pageHeading);
            //   heading = await (
            //     await pageHeading[0].getProperty("textContent")
            //   ).jsonValue();
            //   await page.waitForTimeout(2000);
            // } catch (error) {
            //   const errors: string[] = [];
            //   errors.push(error);
            //   const e = errors.find((x) => x === error);
            //   if (e) {
            //     logger.warn(
            //       "there is no data display in the graph for drill down!"
            //     );
            //   }
            // }
            const expTitle = `Drill Down - ${heading}`;
            if (title == expTitle) {
              logger.info(`${title} title verify success`);
              const element = [
                ds.heading,
                ds.backBtn,
                ds.resetLayout,
                ds.downloadBtn,
              ];
              const elementNames = [
                "heading",
                "data as of",
                "reset button",
                "download icon",
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
                await page.waitForTimeout(4000);
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
                await page.mouse.click(288, 220, { button: "left" });
                await navigationPromise;
                logger.info("row data clicked");
                await page.waitForTimeout(20000);
                let pageTitle = await page.title();

                if (pageTitle == "Search by Ro") {
                  logger.info(`${pageTitle} title verify success`);
                  await page.waitForTimeout(12000);

                  await page
                    .$eval(pw.repairOrderTable, (elem) => {
                      return elem.style.display !== "none";
                    })
                    .then(() => {
                      logger.info("repair order table display properly");
                    })
                    .catch(() => {
                      logger.error("repair order table not display properly");
                      errors.push("repair order table not display properly");
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
                    logger.info(
                      "repair order toggle button navigation success"
                    );
                    await page.waitForTimeout(5000);

                    await page
                      .$eval(pw.dataTable, (elem) => {
                        return elem.style.display !== "none";
                      })
                      .then(async () => {
                        logger.info(
                          "data table display properly under opcode summary tab"
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
                          "data table not display properly under opcode summary tab"
                        );
                        errors.push(
                          "data table not display properly under opcode summary tab"
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
                              const rowData = await page.$x(
                                pw.detailedViewRowData
                              );
                              await rowData[0].click();
                              await navigationPromise;
                              logger.info("row data clicked");
                              await page.waitForTimeout(20000);
                              pageTitle = await page.title();
                              pageTitle == "Search by Ro"
                                ? logger.info(
                                    "discount metrics month trend graphs drill down cycle success"
                                  )
                                : [
                                    logger.error(
                                      "discount metrics month trend graphs drill down cycle failed"
                                    ),
                                    errors.push(
                                      "discount metrics month trend graphs drill down cycle failed"
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
                "title verify failed due to no data in the graph for drill down"
              );
            }
          }
        });
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
