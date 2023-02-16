import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { partsoverviewSelectors as po } from "../selectors/parts-overview.ts";
import { PartsWorkmixSelectors as pw } from "../selectors/parts-work-mix.ts";
import { fixedopsCommonLogin } from "./common/fixedops-common-login.ts";
import { startLogger, getRandomNumberBetween } from "../utilities/utils.ts";

const logger = startLogger();
const errors: string[] = [];

function fixedOpsPartsOverviewTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[AEC-FOCP-UI-FN-LD-0165] ${site.name} FixedOps Parts Overview Page Drill Down Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-UI-FN-LD-0165",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await partsOverviewPageDrillDownTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Parts Overview Page Drill Down Test";
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

async function partsOverviewPageDrillDownTest(baseURL: string) {
  let browser = null;

  try {
    const oBrowser = await fixedopsCommonLogin(baseURL);
    const page = oBrowser.page;
    browser = oBrowser.browser;
    const navigationPromise = oBrowser.navigationPromise;
    const pMenu = await page.$x(po.partsMenuBtn);
    await pMenu[0].click();
    await page.waitForTimeout(4000);
    logger.info("parts expand collapse link clicked");
    const pOverview = await page.$x(po.partsOverviewBtn);
    await pOverview[0].click();
    await navigationPromise;
    await page.waitForTimeout(12000);
    const title = await page.title();
    if (title == "CP Parts Overview") {
      logger.info("CP Parts Overview title verify success");
      const ids = [
        po.viewDetailBtn1,
        po.viewDetailBtn2,
        po.viewDetailBtn3,
        po.viewDetailBtn4,
        po.viewDetailBtn5,
        po.viewDetailBtn6,
        po.viewDetailBtn7,
        po.viewDetailBtn8,
        po.viewDetailBtn9,
      ];
      const toggleBtn = [
        po.tglBtn_1,
        po.tglBtn_2,
        po.tglBtn_3,
        po.tglBtn_4,
        po.tglBtn_5,
      ];
      //const num1 = await getRandomNumberBetween(0, 8);
      const num1 = 1;
      await page.waitForSelector(ids[num1]);
      await page.click(ids[num1]);
      await navigationPromise;
      await page.waitForTimeout(5000);
      const title = await page.title();
      if (title == "Overview") {
        logger.info("view detail button navigation success");
        await page.waitForTimeout(5000);
        const canvasDiv = await page.$x(po.canvasDiv);
        if (canvasDiv.length == 1) {
          await page.waitForSelector(po.canvas(2));
          const graphs = await page.waitForSelector(po.canvas(2), {
            visible: true,
            timeout: 4000,
          });

          if (graphs != null) {
            logger.info("canvas visible properly");
            const selector = await page.waitForSelector(po.canvas(2));
            const position = await page.evaluate((el) => {
              const { x, y } = el.getBoundingClientRect();
              return { x, y };
            }, selector);
            const chartNameElement = await page.$x(po.overviewChartName(2));
            const chartName = await (
              await chartNameElement[0].getProperty("textContent")
            ).jsonValue();
            await page.waitForTimeout(2000);
            await page.mouse.click(position.x + 413, position.y + 144, {
              button: "left",
            });
            logger.info(`${chartName} canvas clicked`);
            await page.waitForTimeout(12000);
            const title = await page.title();
            let heading;

            await page
              .waitForXPath(po.pageHeading, {
                visible: true,
                timeout: 4000,
              })
              .then(async () => {
                const pageHeading = await page.$x(po.pageHeading);
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

            const expTitle = `Drill Down - ${heading}`;
            if (title == expTitle) {
              logger.info(`${title} title verify success`);
              await page
                .waitForSelector(po.dataTable, {
                  visible: true,
                  timeout: 4000,
                })
                .then(() => {
                  logger.info(
                    `data table display properly under ${title} page`
                  );
                })
                .catch(() => {
                  logger.error(
                    `data table not display properly under ${title} page`
                  );
                  errors.push(
                    `data table not display properly under ${title} page`
                  );
                });
              await page.mouse.click(283, 215, { button: "left" });
              await navigationPromise;
              logger.info("row data clicked");
              await page.waitForTimeout(15000);
              let pageTitle = await page.title();
              if (pageTitle == "Search by Ro") {
                logger.info(`${pageTitle} title verify success`);
                await page.waitForTimeout(2000);
                await page
                  .$eval(po.repairOrderTable, (elem) => {
                    return elem.style.display !== "none";
                  })
                  .then(() => {
                    logger.info("repair order table display properly");
                  })
                  .catch(() => {
                    logger.error("repair order table not display properly");
                    errors.push("repair order table not display properly");
                  });
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
                                  "parts overview drill down cycle success"
                                )
                              : [
                                  logger.error(
                                    "parts overview drill down cycle failed"
                                  ),
                                  errors.push(
                                    "parts overview drill down cycle failed"
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
              logger.warn(
                "title verify failed due to no data in the graph for drill down"
              );
            }
          } else {
            logger.error("canvas not visible properly");
            errors.push("canvas not visible properly");
          }
        } else {
          const num2 = await getRandomNumberBetween(1, 7);
          await page.waitForSelector(po.canvas(num2 + 1));
          const graphs = await page.waitForSelector(po.canvas(num2 + 1), {
            visible: true,
            timeout: 4000,
          });
          const xpath = await page.$x(po.charts(num2 + 1));
          await page.waitForTimeout(2000);
          await page.evaluate((element) => {
            element.scrollIntoView(
              0,
              parseInt(element.getBoundingClientRect().y)
            );
          }, xpath[0]);
          await page.waitForTimeout(2000);
          const selector = await page.waitForSelector(po.canvas(num2 + 1));
          const position = await page.evaluate((el) => {
            const { x, y } = el.getBoundingClientRect();
            return { x, y };
          }, selector);
          if (graphs != null) {
            logger.info("canvas visible properly");
            await page.waitForTimeout(2000);
            const chartNameElement = await page.$x(
              po.overviewChartName(num2 + 1)
            );
            const chartName = await (
              await chartNameElement[0].getProperty("textContent")
            ).jsonValue();
            await page.mouse.click(position.x + 413, position.y + 144, {
              button: "left",
            });
            await page.waitForTimeout(2000);
            logger.info(`${chartName} canvas clicked`);
            await page.waitForTimeout(15000);
            const title = await page.title();
            let heading;

            await page
              .waitForXPath(po.pageHeading, {
                visible: true,
                timeout: 4000,
              })
              .then(async () => {
                const pageHeading = await page.$x(po.pageHeading);
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
            const expTitle = `Drill Down - ${heading}`;
            if (title == expTitle) {
              logger.info(`${title} title verify success`);
              await page.waitForTimeout(5000);
              await page
                .$eval(po.dataTable, (elem) => {
                  return elem.style.display !== "none";
                })
                .then(() => {
                  logger.info(
                    `data table display properly under ${title} page`
                  );
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
              await page.mouse.click(283, 215, { button: "left" });
              await navigationPromise;
              logger.info("row data clicked");
              await page.waitForTimeout(15000);
              let pageTitle = await page.title();
              if (pageTitle == "Search by Ro") {
                logger.info(`${pageTitle} title verify success`);
                await page.waitForTimeout(12000);
                await page
                  .$eval(po.repairOrderTable, (elem) => {
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
                                  "parts overview drill down cycle success"
                                )
                              : [
                                  logger.error(
                                    "parts overview drill down cycle failed"
                                  ),
                                  errors.push(
                                    "parts overview drill down cycle failed"
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
              logger.warn(
                "title verify failed due to no data in the graph for drill down"
              );
            }
          } else {
            logger.error("canvas not visible properly");
            errors.push("canvas not visible properly");
          }
        }
      } else {
        logger.error(`view detail button navigation failed`);
        errors.push(`view detail button  navigation failed`);
      }
    } else {
      logger.error("parts overview page title verify failed");
      errors.push("parts overview page title verify failed");
    }
    ts.assert(
      errors.length == 0,
      `Error in  Parts Overview Page: ${errors.join("\n")}`
    );
  } catch (error) {
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsPartsOverviewTest();
