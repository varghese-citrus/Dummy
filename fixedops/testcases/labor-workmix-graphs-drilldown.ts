import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { LaborWorkMiss as lw } from "../selectors/labor-work-mix.ts";
import { fixedopsCommonLogin } from "./common/fixedops-common-login.ts";
import { startLogger, getRandomNumberBetween } from "../utilities/utils.ts";

const logger = startLogger();
const errors: string[] = [];

function fixedOpsLaborWorkmixTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[AEC-FOCP-UI-FN-LD-0116] ${site.name} FixedOps Labor Workmix Page Graphs Drill Down Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-UI-FN-LD-0116",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await laborWorkmixPageGraphsDrillDownTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Labor Workmix Page Graphs Drill Down Test";
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

async function laborWorkmixPageGraphsDrillDownTest(baseURL: string) {
  let browser = null;

  try {
    const oBrowser = await fixedopsCommonLogin(baseURL);
    const page = oBrowser.page;
    browser = oBrowser.browser;
    const navigationPromise = oBrowser.navigationPromise;
    await page.waitForSelector(lw.labor);
    await page.click(lw.labor);
    logger.info("labor expand collapse link clicked!!!");
    await page.waitForTimeout(4000);
    const laborWrkMix = await page.$x(lw.laborWorkMixLink);
    await laborWrkMix[0].click();
    await navigationPromise;
    await page.waitForTimeout(15000);
    logger.info("labor work mix link clicked!!!");

    const toggleBtn = [
      lw.tglBtn_1,
      lw.tglBtn_2,
      lw.tglBtn_3,
      lw.tglBtn_4,
      lw.tglBtn_5,
    ];

    const btns = [lw.competetive, lw.maintenance, lw.repair];
    const title = await page.title();

    if (title == "Labor Work Mix") {
      logger.info("Labor Work Mix title verify success");
      await page.waitForTimeout(10000);
      const num1 = await getRandomNumberBetween(1, 6);
      await page.waitForSelector(lw.workmixCanvas(num1));

      const graph = await page.waitForSelector(lw.workmixCanvas(num1), {
        visible: true,
        timeout: 4000,
      });
      await page.waitForTimeout(2000);
      if (graph != null) {
        logger.info(`graph ${num1} display properly`);
        const xpath = await page.$x(lw.workmixCanvasDiv(num1));
        await page.waitForTimeout(2000);
        await page.evaluate((element) => {
          element.scrollIntoView(
            0,
            parseInt(element.getBoundingClientRect().y)
          );
        }, xpath[0]);
        await page.waitForTimeout(4000);
        const canvasNameXpath = await page.$x(lw.workmixCanvasName(num1));
        const canvasName = await (
          await canvasNameXpath[0].getProperty("textContent")
        ).jsonValue();
        await page.waitForTimeout(2000);
        let i = 1;
        let barChartRanges;
        do {
          const barChartRange1 = await getRandomNumberBetween(1, 39);
          const barChartRange2 = await getRandomNumberBetween(40, 78);
          const barChartRange3 = await getRandomNumberBetween(79, 117);
          const barChartRange4 = await getRandomNumberBetween(118, 156);
          const barChartRange5 = await getRandomNumberBetween(157, 195);
          const barChartRange6 = await getRandomNumberBetween(196, 234);

          barChartRanges = [
            barChartRange1,
            barChartRange2,
            barChartRange3,
            barChartRange4,
            barChartRange5,
            barChartRange6,
          ];
          try {
            const barChartXpath = await page.$x(
              lw.barCharts(barChartRanges[num1 - 1])
            );

            await barChartXpath[0].click();
            logger.info(`${canvasName} graph clicked`);
            await navigationPromise;
            await page.waitForTimeout(30000);
            break;
          } catch {
            i++;
            logger.info(
              "there is no data in the graph, checking for another bar index"
            );
          }
          if (i == 20) {
            break;
          }
        } while (i > 0);
        const monthlyTable = await page.$eval(lw.monthlyTable, (elem) => {
          return elem.style.display !== "none";
        });
        if (monthlyTable) {
          logger.info("enters into monthly table in labor workmix");
          await page.waitForTimeout(2000);

          await page.waitForSelector(lw.dt);
          await page
            .$eval(lw.dt, (elem) => {
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
          await page.waitForTimeout(4000);
          const num3 = await getRandomNumberBetween(0, 2);
          const btn = await page.$x(btns[num3]);
          await btn[0].click();
          await page.waitForTimeout(5000);
          await page.waitForSelector(lw.rowDataId);
          await page.click(lw.rowDataId);
          await navigationPromise;
          logger.info("row data clicked");
          await page.waitForTimeout(18000);

          let pageTitle = await page.title();

          await page.waitForTimeout(5000);
          if (pageTitle == "Labor Work Mix") {
            logger.info("enters into opcode summery");
            await page.waitForTimeout(5000);

            await page
              .$eval(lw.dataTable, (elem) => {
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
            await page.waitForTimeout(2000);
            await page.mouse.click(348, 365, { button: "left" });
            await navigationPromise;
            logger.info("row data clicked");
            await page.waitForTimeout(15000);
            const attr = await page.$eval(lw.opcodeDetailedViewTab, (element) =>
              element.getAttribute("aria-selected")
            );
            if (attr) {
              logger.info("enters into opcode detail view");
              await page.waitForTimeout(2000);
              await page
                .$eval(lw.dataTable, (elem) => {
                  return elem.style.display !== "none";
                })
                .then(() => {
                  logger.info(
                    "data table display properly under opcode detail view tab"
                  );
                })
                .catch(() => {
                  logger.info(
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
                await page.waitForTimeout(15000);
                pageTitle = await page.title();
                pageTitle == "Labor Work Mix"
                  ? logger.info("view detail button drill down cycle success")
                  : [
                      logger.error(
                        "view detail button drill down cycle failed"
                      ),
                      errors.push("view detail button drill down cycle failed"),
                    ];
              } else {
                logger.warn("there is no row data for drill down!");
              }
            } else {
              logger.warn("there is no row data for drill down!");
            }
          } else {
            await page.waitForTimeout(4000);

            pageTitle = await page.title();

            if (pageTitle == "Labor Work Mix Other") {
              logger.info("Labor Work Mix Other page title verify success");
              await page.waitForTimeout(4000);

              const element = [
                lw.laborWorkmixOtherHeading,
                lw.laborWorkmixOtherDataAsOf,
                lw.laborWorkmixOtherResetBtn,
                lw.laborWorkmixOtherDownloadIcon,
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
                .$eval(lw.dataTable, (elem) => {
                  return elem.style.display !== "none";
                })
                .then(() => {
                  logger.info(
                    "data table display properly under labor workmix other page"
                  );
                })
                .catch(() => {
                  logger.info(
                    "data table not display properly under labor workmix other page"
                  );
                  errors.push(
                    "data table not display properly under labor workmix other page"
                  );
                });
              await page.waitForTimeout(4000);
              await page.mouse.click(263, 297, { button: "left" });
              await navigationPromise;
              logger.info("row data clicked");
              await page.waitForTimeout(15000);
              pageTitle = await page.title();
              if (pageTitle == "Labor Work Mix") {
                logger.info("enters into opcode summery");
                await page.waitForTimeout(2000);

                await page
                  .$eval(lw.dataTable, (elem) => {
                    return elem.style.display !== "none";
                  })
                  .then(() => {
                    logger.info(
                      "data table display properly under opcode summery tab"
                    );
                  })
                  .catch(() => {
                    logger.info(
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
                  lw.opcodeDetailedViewTab,
                  (element) => element.getAttribute("aria-selected")
                );
                if (attr) {
                  logger.info("enters into opcode detail view");
                  await page.waitForTimeout(2000);

                  await page
                    .$eval(lw.dataTable, (elem) => {
                      return elem.style.display !== "none";
                    })
                    .then(() => {
                      logger.info(
                        "data table display properly under opcode detail view tab"
                      );
                    })
                    .catch(() => {
                      logger.info(
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
                    logger.warn("there is no row data for drill down!");
                  }
                } else {
                  logger.warn("there is no row data for drill down!");
                }
              } else {
                logger.warn("there is no row data for drill down!");
              }
            } else {
              logger.error("Labor Work Mix Other page title verify fail");
              errors.push("Labor Work Mix Other page title verify fail");
            }
          }
        } else {
          logger.warn("there is no data in the graph for drill down");
        }
      } else {
        logger.error(`graph ${num1} not display properly`);
        errors.push(`graph ${num1} not display properly`);
      }
    } else {
      logger.error("Labor Work Mix page title verify failed");
      errors.push("Labor Work Mix page title verify failed");
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
fixedOpsLaborWorkmixTest();
