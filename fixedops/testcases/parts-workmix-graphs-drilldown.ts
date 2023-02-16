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
      name: `[AEC-FOCP-UI-FN-LD-0188] ${site.name} FixedOps Parts Workmix Page Graphs Drill Down Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-UI-FN-LD-0188",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await partsWorkmixPageGraphsDrillDownTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Parts Workmix Page Graphs Drill Down Test";
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

async function partsWorkmixPageGraphsDrillDownTest(baseURL: string) {
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
    await page.waitForTimeout(15000);
    await navigationPromise;

    const toggleBtn = [
      pw.tglBtn_1,
      pw.tglBtn_2,
      pw.tglBtn_3,
      pw.tglBtn_4,
      pw.tglBtn_5,
    ];

    const btns = [pw.competetive, pw.maintenance, pw.repair];
    const title = await page.title();

    if (title == "Parts Work Mix") {
      logger.info("Parts Work Mix title verify success");
      await page.waitForTimeout(4000);
      const num1 = await getRandomNumberBetween(1, 6);
      await page.waitForSelector(pw.workmixCanvas(num1));

      const graph = await page.waitForSelector(pw.workmixCanvas(num1), {
        visible: true,
        timeout: 4000,
      });
      await page.waitForTimeout(2000);
      if (graph != null) {
        logger.info(`graph ${num1} display properly`);
        const xpath = await page.$x(pw.workmixCanvasDiv(num1));
        await page.waitForTimeout(2000);
        await page.evaluate((element) => {
          element.scrollIntoView(
            0,
            parseInt(element.getBoundingClientRect().y)
          );
        }, xpath[0]);
        await page.waitForTimeout(4000);
        const canvasNameXpath = await page.$x(pw.workmixCanvasName(num1));
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
              pw.barCharts(barChartRanges[num1 - 1])
            );
            await barChartXpath[0].click();
            logger.info(`${canvasName} graph clicked`);
            await page.waitForTimeout(30000);
            break;
          } catch {
            i++;
            logger.info(
              "there is no data in the graphs,checking for another bar index"
            );
          }
          if (i == 20) {
            break;
          }
        } while (i > 0);

        const monthlyTable = await page.waitForSelector(pw.monthlyTable, {
          visible: true,
          timeout: 4000,
        });

        if (monthlyTable != null) {
          logger.info("enters into monthly table in labor workmix");
          await page.waitForTimeout(2000);

          await page.waitForSelector(pw.dt);
          const dataTable = await page.$eval(await pw.dt, (elem) => {
            return elem.style.display !== "none";
          });
          await page.waitForTimeout(2000);
          dataTable
            ? logger.info(`data table display properly under ${title} page`)
            : [
                logger.error(
                  `data table not display properly under ${title} page`
                ),
                errors.push(
                  `data table not display properly under ${title} page`
                ),
              ];

          await page.waitForTimeout(4000);
          const num3 = await getRandomNumberBetween(0, 2);
          const btn = await page.$x(btns[num3]);
          await btn[0].click();
          await page.waitForTimeout(5000);

          await page.waitForSelector(pw.rowDataId);
          await page.click(pw.rowDataId);
          await navigationPromise;
          logger.info("row data clicked");
          await page.waitForTimeout(20000);

          let pageTitle = await page.title();

          await page.waitForTimeout(5000);
          if (pageTitle == "Parts Work Mix") {
            logger.info("enters into opcode summery");
            await page.waitForTimeout(5000);

            const dataTable = await page.$eval(await pw.dataTable, (elem) => {
              return elem.style.display !== "none";
            });
            await page.waitForTimeout(2000);
            dataTable
              ? logger.info(
                  "data table display properly under opcode summery tab"
                )
              : [
                  logger.error(
                    "data table not display properly under opcode summery tab"
                  ),
                  errors.push(
                    "data table not display properly under opcode summery tab"
                  ),
                ];

            await page.mouse.click(348, 365, { button: "left" });
            await navigationPromise;
            logger.info("row data clicked");
            await page.waitForTimeout(20000);

            const attr = await page.$eval(pw.opcodeDetailedViewTab, (element) =>
              element.getAttribute("aria-selected")
            );

            if (attr) {
              logger.info("enters into opcode detail view");
              await page.waitForTimeout(5000);

              const dataTable = await page.$eval(pw.dataTable, (elem) => {
                return elem.style.display !== "none";
              });

              dataTable
                ? logger.info(
                    "data table display properly under opcode detail view tab"
                  )
                : [
                    logger.error(
                      "data table not display properly under opcode detail view tab"
                    ),
                    errors.push(
                      "data table not display properly under opcode detail view tab"
                    ),
                  ];

              await page.mouse.click(897, 361, { button: "left" });
              await navigationPromise;
              logger.info("row data clicked");
              await page.waitForTimeout(15000);

              let pageTitle = await page.title();
              await page.waitForTimeout(5000);
              if (pageTitle == "Search by Ro") {
                logger.info("Search by Ro titile verify success");

                const repairOderTable = await page.$eval(
                  pw.repairOrderTable,
                  (elem) => {
                    return elem.style.display !== "none";
                  }
                );

                repairOderTable
                  ? logger.info("repair order table visible properly")
                  : [
                      logger.error("repair order table not visible properly"),
                      errors.push("repair order table not visible properly"),
                    ];

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
                    await page.waitForTimeout(5000);

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
                                  "parts workmix graphs drill down cycle success"
                                )
                              : [
                                  logger.error(
                                    "parts workmix graphs drill down cycle failed"
                                  ),
                                  errors.push(
                                    "parts workmix graphs drill down cycle failed"
                                  ),
                                ];
                            await page.waitForTimeout(5000);
                          });
                      })
                      .catch(() => {
                        logger.error(
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
          } else if (pageTitle == "Parts Work Mix Other") {
            await page.waitForTimeout(4000);

            logger.info("Parts Work Mix Other page title verify success");
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
            await page.waitForTimeout(5000);
            for (let i = 0; i <= element.length - 1; i++) {
              await page.waitForTimeout(2000);
              const el = await page.waitForXPath(element[i], {
                visible: true,
                timeout: 2000,
              });
              await page.waitForTimeout(2000);

              el != null
                ? logger.info(
                    `parts workmix other ${elementNames[i]} display properly`
                  )
                : [
                    logger.error(
                      `parts workmix other ${elementNames[i]} not display properly`
                    ),
                    errors.push(
                      `parts workmix other ${elementNames[i]} not display properly`
                    ),
                  ];
              await page.waitForTimeout(4000);
            }

            const dataTable = await page.$eval(await pw.dataTable, (elem) => {
              return elem.style.display !== "none";
            });
            await page.waitForTimeout(4000);
            dataTable
              ? logger.info(
                  "data table display properly under parts workmix other page"
                )
              : [
                  logger.info(
                    "data table not display properly under parts workmix other page"
                  ),
                  errors.push(
                    "data table not display properly under parts workmix other page"
                  ),
                ];

            await page.waitForTimeout(4000);
            await page.mouse.click(259, 290, { button: "left" });
            await navigationPromise;
            logger.info("row data clicked");
            await page.waitForTimeout(15000);

            pageTitle = await page.title();
            if (pageTitle == "Parts Work Mix") {
              logger.info("enters into opcode summery");
              await page.waitForTimeout(2000);

              const dataTable = await page.$eval(await pw.dataTable, (elem) => {
                return elem.style.display !== "none";
              });

              dataTable
                ? logger.info(
                    "data table display properly under opcode summery tab"
                  )
                : [
                    logger.info(
                      "data table not display properly under opcode summery tab"
                    ),
                    errors.push(
                      "data table not display properly under opcode summery tab"
                    ),
                  ];

              await page.mouse.click(348, 365, { button: "left" });
              await navigationPromise;
              logger.info("row data clicked");
              await page.waitForTimeout(15000);

              const attr = await page.$eval(
                pw.opcodeDetailedViewTab,
                (element) => element.getAttribute("aria-selected")
              );

              if (attr) {
                logger.info("enters into opcode detail view");
                await page.waitForTimeout(2000);

                const dataTable = await page.$eval(
                  await pw.dataTable,
                  (elem) => {
                    return elem.style.display !== "none";
                  }
                );

                dataTable
                  ? logger.info(
                      "data table display properly under opcode detail view tab"
                    )
                  : [
                      logger.info(
                        "data table not display properly under opcode detail view tab"
                      ),
                      errors.push(
                        "data table not display properly under opcode detail view tab"
                      ),
                    ];

                await page.mouse.click(896, 360, { button: "left" });
                await navigationPromise;
                logger.info("row data clicked");
                await page.waitForTimeout(15000);

                let pageTitle = await page.title();
                await page.waitForTimeout(5000);
                if (pageTitle == "Search by Ro") {
                  logger.info("Search by Ro titile verify success");

                  const repairOderTable = await page.$eval(
                    await pw.repairOrderTable,
                    (elem) => {
                      return elem.style.display !== "none";
                    }
                  );

                  repairOderTable
                    ? logger.info("repair order table visible properly")
                    : [
                        logger.error("repair order table not visible properly"),
                        errors.push("repair order table not visible properly"),
                      ];

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

                  pageTitle == "Labor Work Mix"
                    ? logger.info("view detail button drill down cycle success")
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
            logger.error(
              "there is no data in the competitive || maintenance || repair"
            );
            errors.push(
              "there is no data in the competitive || maintenance || repair"
            );
          }
        } else {
          logger.warn("there is no data in the graph for drill down");
        }
      } else {
        logger.error(`graph ${num1} not display properly`);
        errors.push(`graph ${num1} not display properly`);
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
