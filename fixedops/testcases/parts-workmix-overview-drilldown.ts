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
      name: `[AEC-FOCP-UI-FN-LD-0202] ${site.name} FixedOps Parts Workmix Page Overview Drill Down Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-UI-FN-LD-0202",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await partsWorkmixOverviewPageDrillDownTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Parts Workmix Page Overview Drill Down Test";
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

async function partsWorkmixOverviewPageDrillDownTest(baseURL: string) {
  let browser = null;

  try {
    const oBrowser = await fixedopsCommonLogin(baseURL);
    const page = oBrowser.page;
    browser = oBrowser.browser;
    const navigationPromise = oBrowser.navigationPromise;
    await page.waitForSelector(pw.partsMenu);
    await page.click(pw.partsMenu);
    logger.info("Parts Menu clicked");
    await navigationPromise;
    await page.waitForTimeout(5000);
    const partsWorkmixdashboard = await page.$x(pw.partsWorkmixMenu);
    await partsWorkmixdashboard[0].click();
    logger.info("Parts Workmix dashboard clicked");
    await navigationPromise;
    await page.waitForTimeout(15000);
    const title = await page.title();
    if (title == "Parts Work Mix") {
      logger.info("Parts Work Mix title verify success");
      const ids = [
        pw.detailBtn_1,
        pw.detailBtn_2,
        pw.detailBtn_3,
        pw.detailBtn_4,
        pw.detailBtn_5,
        pw.detailBtn_6,
      ];
      const toggleBtn = [
        pw.tglBtn_1,
        pw.tglBtn_2,
        pw.tglBtn_3,
        pw.tglBtn_4,
        pw.tglBtn_5,
      ];
      const btns = [pw.competetive, pw.maintenance, pw.repair];
      const num1 = await getRandomNumberBetween(0, 5);
      await page.waitForSelector(ids[num1]);
      await page.click(ids[num1]);
      await navigationPromise;
      await page.waitForTimeout(5000);
      const title = await page.title();
      if (title == "Overview") {
        logger.info("view detail button navigation success");
        await page.waitForTimeout(10000);
        await page.waitForXPath(pw.canvas);
        const graphs = await page.waitForXPath(pw.canvas, {
          visible: true,
          timeout: 2000,
        });
        await page.waitForTimeout(2000);
        const selector = await page.waitForSelector(pw.cv);
        const position = await page.evaluate((el) => {
          const { x, y } = el.getBoundingClientRect();
          return { x, y };
        }, selector);
        const x1 = position.x + 390;
        const y1 = position.y + 120;
        const x2 = position.x + 381;
        const y2 = position.y + 99;
        const x3 = position.x + 409;
        const y3 = position.y + 105;
        if (graphs != null) {
          logger.info("canvas visible properly");
          const num2 = await getRandomNumberBetween(0, 2);
          const coordinates = [
            { name: "bar 1", x: x1, y: y1 },
            { name: "bar 2", x: x2, y: y2 },
            { name: "bar 1", x: x3, y: y3 },
          ];
          const data = coordinates[num2];
          await page.mouse.click(data.x, data.y, { button: "left" });
          await page.waitForTimeout(25000);
          const title = await page.title();
          if (title == "Parts Work Mix") {
            logger.info(`${title} title verify success`);
            await page.waitForTimeout(5000);

            await page
              .$eval(pw.dataTab, (elem) => {
                return elem.style.display !== "none";
              })
              .then(() => {
                logger.info(`data table display properly under ${title} page`);
              })
              .catch(() => {
                logger.error(
                  `data table not display properly under ${title} page`
                );
                errors.push(
                  `data table not display properly under ${title} page`
                );
              });
            await page.waitForTimeout(5000);
            const num3 = await getRandomNumberBetween(0, 2);
            const btn = await page.$x(btns[num3]);
            await btn[0].click();
            await page.waitForTimeout(5000);
            await page.waitForSelector(pw.rowDataId);
            await page.click(pw.rowDataId);
            await navigationPromise;
            logger.info("row data clicked");
            await page.waitForTimeout(25000);
            const pageTitle = await page.title();
            await page.waitForTimeout(10000);
            if (pageTitle == "Parts Work Mix") {
              logger.info("enters into opcode summery");
              await page.waitForTimeout(5000);

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
              await page.waitForTimeout(5000);
              await page.mouse.click(348, 365, { button: "left" });
              await navigationPromise;
              logger.info("row data clicked");
              await page.waitForTimeout(15000);
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
                await page.mouse.click(896, 360, { button: "left" });
                await navigationPromise;
                logger.info("row data clicked");
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
                  logger.info("toggle button clicked");
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
                                    "parts workmix overview drill down cycle success"
                                  )
                                : [
                                    logger.error(
                                      "parts workmix overview drill down cycle failed"
                                    ),
                                    errors.push(
                                      "parts workmix overview drill down cycle failed"
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
                logger.warn("there is no row data for drill down!");
              }
            } else {
              await page.waitForTimeout(4000);
              const title = await page.title();

              if (title == "Parts Work Mix Other") {
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
                        `labor workmix other ${elementNames[i]} display properly`
                      );
                    })
                    .catch(() => {
                      logger.error(
                        `labor workmix other ${elementNames[i]} not display properly`
                      );
                      errors.push(
                        `labor workmix other ${elementNames[i]} not display properly`
                      );
                    });
                  await page.waitForTimeout(4000);
                }
                await page
                  .$eval(pw.dataTable, (elem) => {
                    return elem.style.display !== "none";
                  })
                  .then(() => {
                    logger.info(
                      "data table display properly under parts workmix other page"
                    );
                  })
                  .catch(() => {
                    logger.error(
                      "data table not display properly under parts workmix other page"
                    );
                    errors.push(
                      "data table not display properly under parts workmix other page"
                    );
                  });
                await page.waitForTimeout(4000);
                await page.mouse.click(263, 297, { button: "left" });
                await navigationPromise;
                logger.info("row data clicked");
                await page.waitForTimeout(15000);
                const pageTitle = await page.title();
                if (pageTitle == "Parts Work Mix") {
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

                  await page.mouse.click(348, 365, { button: "left" });
                  await navigationPromise;
                  logger.info("row data clicked");
                  await page.waitForTimeout(15000);

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

                    await page.mouse.click(896, 360, { button: "left" });
                    await navigationPromise;
                    logger.info("row data clicked");
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
                      logger.info("toggle button clicked");
                      await page.waitForTimeout(15000);

                      const attr = await page.$eval(
                        pw.opcodeSummary,
                        (element) => element.getAttribute("aria-selected")
                      );
                      await page.waitForTimeout(5000);
                      pageTitle = await page.title();
                      if (
                        pageTitle == "Labor Work Mix" &&
                        attr.toString() == "true"
                      ) {
                        await page
                          .$eval(pw.opcodeTable, (elem) => {
                            return elem.style.display !== "none";
                          })
                          .then(() => {
                            logger.info(
                              "opcode summery table display properly"
                            );
                          })
                          .catch(() => {
                            logger.error(
                              "opcode summery table not display properly"
                            );
                            errors.push(
                              "opcode summery table not display properly"
                            );
                          });
                        await page.waitForTimeout(5000);
                        await page.click(pw.summaryRowData).catch(() => {
                          logger.warn(
                            "there is no data in the table for drill down"
                          );
                        });
                        await navigationPromise;
                        await page.waitForTimeout(15000);
                        const attr = await page.$eval(
                          pw.opcodeDetailedViewTab,
                          (element) => element.getAttribute("aria-selected")
                        );
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
                          const btn = await page.$x(pw.opcodeDetailViewRowData);
                          await btn[0].click();
                          await navigationPromise;
                          logger.info("opcode detail view row data clicked");
                          await page.waitForTimeout(25000);
                          let pageTitle = await page.title();
                          await page.waitForTimeout(5000);
                          if (pageTitle == "Search by Ro") {
                            logger.info("Search by Ro title verify success");

                            await page
                              .$eval(pw.repairOrderTable, (elem) => {
                                return elem.style.display !== "none";
                              })
                              .then(() => {
                                logger.info(
                                  "repair order table visible properly"
                                );
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
                            pageTitle == "Labor Work Mix"
                              ? logger.info(
                                  "view detail button drill down cycle success"
                                )
                              : [
                                  logger.error(
                                    "view detail button drill down cycle failed"
                                  ),
                                  errors.push(
                                    "view detail button drill down cycle failed"
                                  ),
                                ];
                          } else {
                            logger.error("toggle button navigation failed");
                            errors.push("toggle button navigation failed");
                          }
                        } else {
                          logger.warn("there is no row data for drill down!");
                        }
                      } else {
                        logger.warn("there is no row data for drill down!");
                      }
                    } else {
                      logger.warn("there is no row data for drill down!");
                    }
                  } else {
                    logger.error("Parts Work Mix Other page title verify fail");
                    errors.push("Parts Work Mix Other page title verify fail");
                  }
                }
              } else {
                logger.warn(
                  "there is no data displayed in the graphs for drill down"
                );
              }
            }
          }
        } else {
          logger.error("Parts Work Mix page title verify failed");
          errors.push("Parts Work Mix page title verify failed");
        }
      }
    }
    ts.assert(
      errors.length == 0,
      `Error in  Labor Workmix Page: ${errors.join("\n")}`
    );
  } catch (error) {
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsPartsWorkmixTest();
