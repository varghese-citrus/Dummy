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
      name: `[AEC-FOCP-UI-FN-LD-0193] ${site.name} FixedOps Parts Workmix Page Month Comparison Graphs Drill Down Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-UI-FN-LD-0193",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await partsWorkmixPageMonthCmpGraphsDrillDownTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Parts Workmix Page Month Comparison Graphs Drill Down Test";
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

async function partsWorkmixPageMonthCmpGraphsDrillDownTest(baseURL: string) {
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
    const title = await page.title();
    const toggleBtn = [
      pw.tglBtn_1,
      pw.tglBtn_2,
      pw.tglBtn_3,
      pw.tglBtn_4,
      pw.tglBtn_5,
    ];
    if (title == "Parts Work Mix") {
      logger.info("Parts Work Mix title verify success");
      const monthWorkmixTab = await page.$x(pw.monthWrkMixTab);
      await monthWorkmixTab[0].click();
      await navigationPromise;
      await page.waitForTimeout(15000);
      logger.info("parts work mix 2 month comparison tab clicked");
      let num1 = await getRandomNumberBetween(2, 6);
      await page.waitForTimeout(5000);
      const graphs = await page.waitForXPath(pw.monthCmpGraphs(num1), {
        visible: true,
        timeout: 2000,
      });
      await page.waitForTimeout(2000);
      if (graphs != null) {
        logger.info("bar chart visible properly");
        let i = 1;
        do {
          try {
            const idRange1 = await getRandomNumberBetween(1, 19);
            const idRange2 = await getRandomNumberBetween(20, 38);
            const idRange3 = await getRandomNumberBetween(39, 57);
            const idRange4 = await getRandomNumberBetween(58, 76);
            const idRange5 = await getRandomNumberBetween(77, 95);
            const idRangesArr = [
              idRange1,
              idRange2,
              idRange3,
              idRange4,
              idRange5,
            ];
            num1 = await getRandomNumberBetween(2, 6);
            const id = idRangesArr[num1 - 2];
            await page.waitForXPath(pw.bar(id));
            const xpath = await page.$x(pw.bar(id));
            await xpath[0].click();
            logger.info("bar chart clicked");
            await navigationPromise;
            await page.waitForTimeout(20000);
            break;
          } catch {
            logger.info(
              "node is not clickable,checking for another clickable bar chart id"
            );
            i++;
          }
          if (i == 25) {
            break;
          }
        } while (i > 0);

        const title = await page.title();
        if (title == "Parts Work Mix") {
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
          await page.waitForTimeout(4000);
          const btn = await page.$x(pw.opcodeSummeryRowData);
          await btn[0].click();
          await navigationPromise;
          logger.info("opcode summery row data clicked");
          await page.waitForTimeout(25000);
          const attr = await page.$eval(pw.opcodeDetailedViewTab, (element) =>
            element.getAttribute("aria-selected")
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
            await page.waitForTimeout(4000);
            await page.waitForXPath(pw.opcodeDetailViewRowData);
            const opcodeDetailViewRowData = await page.$x(
              pw.opcodeDetailViewRowData
            );
            await opcodeDetailViewRowData[0].click();
            await navigationPromise;
            logger.info("opcode detail view row data clicked");
            await page.waitForTimeout(15000);
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
              pageTitle == "Labor Work Mix"
                ? logger.info(
                    "parts workmix month comparison graphs drill down cycle success"
                  )
                : [
                    logger.error(
                      "parts workmix month comparison graphs drill down cycle failed"
                    ),
                    errors.push(
                      "parts workmix month comparison graphs drill down cycle failed"
                    ),
                  ];
            } else {
              logger.warn("there is no row data for drill down!");
            }
          } else {
            logger.warn(
              "there is no row data in opcode summery page table for drill down"
            );
          }
        } else if (title == "Parts Work Mix Other") {
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
                  `Parts workmix other ${elementNames[i]} display properly`
                );
              })
              .catch(() => {
                logger.error(
                  `Parts workmix other ${elementNames[i]} not display properly`
                );
                errors.push(
                  `Parts workmix other ${elementNames[i]} not display properly`
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
          await page.waitForTimeout(8000);
          const partsWorkmixOtherRowData = await page.$x(
            pw.partsWorkmixOtherRowData
          );
          await partsWorkmixOtherRowData[0].click();
          await navigationPromise;
          logger.info("parts workmix other row data clicked");
          await page.waitForTimeout(20000);
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
            const attr = await page.$eval(pw.opcodeDetailedViewTab, (element) =>
              element.getAttribute("aria-selected")
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
                                  "parts workmix month comparison graphs drill down cycle success"
                                )
                              : [
                                  logger.error(
                                    "parts workmix month comparison graphs drill down cycle failed"
                                  ),
                                  errors.push(
                                    "parts workmix month comparison graphs drill down cycle failed"
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
              logger.warn("there is no row data for drill down!");
            }
          } else {
            logger.warn("there is no row data for drill down!");
          }
        } else {
          logger.warn("there is no data displayed in the bar for drill down");
        }
      } else {
        logger.error("month comparison graph not visible properly");
        errors.push("month comparison graph not visible properly");
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
    console.error(error);
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsPartsWorkmixTest();
