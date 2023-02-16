import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { PartsWorkmixSelectors as pw } from "../selectors/parts-work-mix.ts";
import { fixedopsCommonLogin } from "./common/fixedops-common-login.ts";
import { startLogger, getRandomNumberBetween } from "../utilities/utils.ts";

const logger = startLogger();
const errors: string[] = [];

function fixedOpsPartsWorkmixTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[AEC-FOCP-UI-FN-LD-0194] ${site.name} FixedOps Parts Workmix Page Month Comparison Overview Drill Down Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-UI-FN-LD-0194",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await partsWorkmixPageMonthCmpOverviewDrillDownTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Parts Workmix Page Month Comparison Overview Drill Down Test";
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

async function partsWorkmixPageMonthCmpOverviewDrillDownTest(baseURL: string) {
  let browser = null;

  try {
    const oBrowser = await fixedopsCommonLogin(baseURL);
    const page = oBrowser.page;
    browser = oBrowser.browser;
    const navigationPromise = oBrowser.navigationPromise;
    await page.waitForSelector(pw.partsMenu);
    await page.click(pw.partsMenu);
    logger.info("Parts Menu clicked");
    await page.waitForTimeout(5000);
    const partsWorkmixdashboard = await page.$x(pw.partsWorkmixMenu);
    await partsWorkmixdashboard[0].click();
    logger.info("Parts Workmix dashboard clicked");
    await navigationPromise;
    await page.waitForTimeout(15000);
    const monthWorkmixTab = await page.$x(pw.monthWrkMixTab);
    await monthWorkmixTab[0].click();
    await navigationPromise;
    await page.waitForTimeout(10000);
    logger.info("parts work mix 2 month comparison tab clicked");
    const title = await page.title();
    if (title == "Parts Work Mix") {
      logger.info("Parts Work Mix title verify success");
      const toggleBtn = [
        pw.tglBtn_1,
        pw.tglBtn_2,
        pw.tglBtn_3,
        pw.tglBtn_4,
        pw.tglBtn_5,
      ];
      const num1 = await getRandomNumberBetween(2, 6);
      await page.waitForXPath(pw.getMonthCmpViewDetailBtn(num1));
      const viewDetailBtn = await page.$x(pw.getMonthCmpViewDetailBtn(num1));
      await viewDetailBtn[0].click();
      await navigationPromise;
      await page.waitForTimeout(15000);
      const title = await page.title();
      if (title == "Overview") {
        logger.info("view detail button navigation success");
        await page.waitForTimeout(10000);
        await page.waitForXPath(pw.overviewCanvas);
        const graphs = await page.waitForXPath(pw.overviewCanvas, {
          visible: true,
          timeout: 2000,
        });
        await page.waitForTimeout(2000);
        if (graphs != null) {
          logger.info("canvas visible properly");
          let i = 1;
          do {
            try {
              const num2 = await getRandomNumberBetween(1, 12);
              await page.waitForSelector(pw.chartBarId(num2));
              await page.click(pw.chartBarId(num2));
              logger.info("bar chart clicked");
              await navigationPromise;
              await page.waitForTimeout(20000);
            } catch {
              i++;
              if (i == 20) {
                break;
              }
              logger.info(
                "there is no data in the graphs,checking for another bar index"
              );
            }
          } while (i > 0);
          const title = await page.title();
          switch (title) {
            case "Parts Work Mix": {
              logger.info(`${title} title verify success`);
              await page.waitForTimeout(5000);
              await page
                .$eval(pw.dataTable, (elem) => {
                  return elem.style.display !== "none";
                })
                .then(() => {
                  logger.info(
                    "data table display properly under opcode summary tab"
                  );
                })
                .catch(() => {
                  logger.error(
                    "data table not display properly under opcode summary tab"
                  );
                  errors.push(
                    "data table not display properly under opcode summary tab"
                  );
                });
              await page.waitForTimeout(5000);
              const btn = await page.$x(pw.opcodeSummeryRowData);
              await btn[0].click();
              await navigationPromise;
              logger.info("opcode summery row data clicked");
              await page.waitForTimeout(25000);
              const attr = await page.$eval(
                pw.opcodeDetailedViewTab,
                (element) => element.getAttribute("aria-selected")
              );
              await page.waitForTimeout(5000);
              if (attr.toString() == "true") {
                logger.info("enters into opcode detail view tab");
                await page.waitForTimeout(5000);
                await page
                  .$eval(pw.dataTable, (elem) => {
                    return elem.style.display !== "none";
                  })
                  .then(() => {
                    logger.info(
                      "data table display properly under opcode detail view tab"
                    );
                  })
                  .catch(() => {
                    logger.error(
                      "data table not display properly under opcode detail view tab"
                    );
                    errors.push(
                      "data table not display properly under opcode detail view tab"
                    );
                  });
                await page.waitForTimeout(5000);
                await page.waitForXPath(pw.opcodeDetailViewRowData);
                const opcodeDetailViewRowData = await page.$x(
                  pw.opcodeDetailViewRowData
                );
                await opcodeDetailViewRowData[0].click();
                await navigationPromise;
                logger.info("opcode detail view row data clicked");
                await page.waitForTimeout(15000);
                let pageTitle = await page.title();
                await page.waitForTimeout(5000);
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
                                    "parts workmix month comparison overview drill down cycle success"
                                  )
                                : [
                                    logger.error(
                                      "parts workmix month comparison overview drill down cycle failed"
                                    ),
                                    errors.push(
                                      "parts workmix month comparison overview drill down cycle failed"
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
                logger.warn(
                  "there is no row data in opcode summery page table for drill down"
                );
              }
              break;
            }
            case "Parts Work Mix Other": {
              logger.info("parts workmix other title verify success");
              await page.waitForTimeout(4000);
              const element = [
                pw.partsWorkmixOtherHeading,
                pw.partsWorkmixOtherDataAsOf,
                pw.partsWorkmixOtherResetBtn,
                pw.partsWorkmixOtherDownloadIcon,
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
                      `parts workmix other ${elementNames[i]} display properly`
                    );
                  })
                  .catch(() => {
                    logger.error(
                      `parts workmix other ${elementNames[i]} not display properly`
                    );
                    errors.push(
                      `parts workmix other ${elementNames[i]} not display properly`
                    );
                  });
                await page.waitForTimeout(2000);
              }
              await page
                .$eval(pw.dataTable, (elem) => {
                  return elem.style.display !== "none";
                })
                .then(() => {
                  logger.info(
                    "data table display properly under labor workmix other page"
                  );
                })
                .catch(() => {
                  logger.error(
                    "data table not display properly under labor workmix other page"
                  );
                  errors.push(
                    "data table not display properly under labor workmix other page"
                  );
                });
              await page.waitForTimeout(4000);
              const partsWorkmixOtherRowData = await page.$x(
                pw.partsWorkmixOtherRowData
              );
              await partsWorkmixOtherRowData[0].click();
              await navigationPromise;
              logger.info("parts workmix other row data clicked");
              await page.waitForTimeout(15000);
              const pageTitle = await page.title();
              if (pageTitle == "Labor Work Mix") {
                logger.info("enters into opcode summery");
                await page.waitForTimeout(2000);
                await page
                  .$eval(pw.dataTable, (elem) => {
                    return elem.style.display !== "none";
                  })
                  .then(() => {
                    logger.info(
                      "data table display properly under opcode summery tab"
                    );
                  })
                  .catch(() => {
                    logger.error(
                      "data table not display properly under opcode summery tab"
                    );
                    errors.push(
                      "data table not display properly under opcode summery tab"
                    );
                  });
                const btn = await page.$x(pw.opcodeSummeryRowData);
                await btn[0].click();
                await navigationPromise;
                logger.info("opcode summery row data clicked");
                await page.waitForTimeout(25000);
                const attr = await page.$eval(
                  pw.opcodeDetailedViewTab,
                  (element) => element.getAttribute("aria-selected")
                );

                if (attr.toString() == "true") {
                  logger.info("enters into opcode detail view");
                  await page.waitForTimeout(2000);
                  await page
                    .$eval(pw.dataTable, (elem) => {
                      return elem.style.display !== "none";
                    })
                    .then(() => {
                      logger.info(
                        "data table display properly under opcode detail view tab"
                      );
                    })
                    .catch(() => {
                      logger.error(
                        "data table not display properly under opcode detail view tab"
                      );
                      errors.push(
                        "data table not display properly under opcode detail view tab"
                      );
                    });
                  const opcodeDetailViewRowData = await page.$x(
                    pw.opcodeDetailViewRowData
                  );
                  await opcodeDetailViewRowData[0].click();
                  await navigationPromise;
                  await page.waitForTimeout(15000);
                  let pageTitle = await page.title();
                  await page.waitForTimeout(5000);
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
                    pageTitle == "Labor Work Mix"
                      ? logger.info(
                          "parts workmix month comparison overview drill down cycle success"
                        )
                      : [
                          logger.error(
                            "parts workmix month comparison overview drill down cycle failed"
                          ),
                          errors.push(
                            "parts workmix month comparison overview drill down cycle failed"
                          ),
                        ];
                  } else {
                    logger.warn("there is no row data for drill down!");
                  }
                } else {
                  logger.warn("there is no row data for drill down!");
                }
              } else {
                logger.warn("there is no row data for drill down!");
              }
              break;
            }
            case "Overview": {
              logger.warn(
                "page title verification unsuccessful due to there is no data displayed in the bar for drill down"
              );
              break;
            }
            default: {
              null;
              break;
            }
          }
        }
      } else {
        logger.error("view detail button navigation failed");
        errors.push("view detail button navigation failed");
      }
    } else {
      logger.error("Parts Work Mix page title verify failed");
      errors.push("Parts Work Mix page title verify failed");
    }

    ts.assert(
      errors.length == 0,
      `Error in  Parts Workmix Page: ${errors.join("\n")}`
    );
  } catch (error) {
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsPartsWorkmixTest();
