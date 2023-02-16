import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { PartsScatterPlotSelectors as sp } from "../selectors/parts-scatter-plot.ts";
import { partsoverviewSelectors as ps } from "../selectors/parts-overview.ts";
import { PartsWorkmixSelectors as pw } from "../selectors/parts-work-mix.ts";
import { fixedopsCommonLogin } from "./common/fixedops-common-login.ts";
import { getRandomNumberBetween, startLogger } from "../utilities/utils.ts";

const logger = startLogger();
const errors: string[] = [];

function fixedOpsScatterPlotPartsTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[AEC-FOCP-UI-FN-LD-0177] ${site.name} FixedOps Parts Scatter Plot Page Overview Drill Down Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-UI-FN-LD-0177",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await scatterPlotPartsOverviewDrillDownTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Parts Scatter Plot Page Overview Drill Down Test";
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

async function scatterPlotPartsOverviewDrillDownTest(baseURL: string) {
  let browser = null;

  try {
    const oBrowser = await fixedopsCommonLogin(baseURL);
    const page = oBrowser.page;
    browser = oBrowser.browser;
    const navigationPromise = oBrowser.navigationPromise;
    await page.waitForSelector(ps.partsMenuLink);
    await page.click(ps.partsMenuLink);
    logger.info("parts expand collapse link clicked");
    await page.waitForTimeout(4000);
    await page.waitForSelector(sp.scatterPlotMenu);
    await page.click(sp.scatterPlotMenu);
    await navigationPromise;
    await page.waitForTimeout(15000);
    logger.info("scatter plot parts link clicked!!!");
    const title = await page.title();
    const toggleBtn = [
      sp.tglBtn_1,
      sp.tglBtn_2,
      sp.tglBtn_3,
      sp.tglBtn_4,
      sp.tglBtn_5,
    ];
    if (title == "Scatter Plot - Parts Cost / Jobs / Markup") {
      logger.info(
        "Scatter Plot - Parts Cost / Jobs / Markup title verify success"
      );
      const num = await getRandomNumberBetween(1, 3);
      await page.waitForSelector(sp.getTab(num));
      await page.click(sp.getTab(num));
      await page.waitForTimeout(12000);
      const tabname = await page.$eval(
        sp.getTab(num),
        (element) => element.textContent
      );
      await page.waitForSelector(sp.viewDetailBtn, {
        visible: true,
      });
      await page.waitForTimeout(2000);
      const viewDetailButton = await page.waitForSelector(sp.viewDetailBtn, {
        visible: true,
        timeout: 4000,
      });
      if (viewDetailButton != null) {
        await page.click(sp.viewDetailBtn);
        await navigationPromise;
        await page.waitForTimeout(12000);
        logger.info(
          `enters into ${tabname} tab and click on view detail button`
        );
        await page.waitForTimeout(8000);
        const title = await page.title();
        if (title == "Overview") {
          await page.waitForTimeout(2000);
          await page.waitForXPath(sp.canvas);
          const graph = await page.waitForXPath(sp.canvas, {
            visible: true,
            timeout: 2000,
          });
          await page.waitForTimeout(2000);
          if (graph != null) {
            logger.info("canvas display properly");
            const num = await getRandomNumberBetween(1, 50);
            await page.waitForTimeout(2000);
            const highChartPointXpath = await page.$x(sp.highChartPoint(num));
            await page.waitForTimeout(2000);
            await highChartPointXpath[0].click();
            await navigationPromise;
            await page.waitForTimeout(15000);
            const pageTitle = await page.title();
            const elements = [
              sp.cpPartsMarkupPartsCostbackBtn,
              sp.cpPartsMarkupPartsCostDataAsOf,
              sp.cpPartsMarkupPartsCostResetBtn,
              sp.cpPartsMarkupPartsCostDownloadIcon,
            ];
            const elementNames = [
              "back button",
              "data as of",
              "reset button",
              "download icon",
            ];
            if (pageTitle == "Drill Down - CP Parts Markup (vs) Parts Cost") {
              logger.info("chart point navigation success");

              for (let k = 0; k <= elements.length - 1; k++) {
                await page
                  .waitForXPath(elements[k], {
                    visible: true,
                    timeout: 4000,
                  })
                  .then(() => {
                    logger.info(`${elementNames[k]} displayed properly`);
                  })
                  .catch(() => {
                    logger.error(`${elementNames[k]} not displayed properly`);
                    errors.push(`${elementNames[k]} not displayed properly`);
                  });

                await page.waitForTimeout(2000);
              }
              const dataTable = await page.$eval(sp.dataTable, (elem) => {
                return elem.style.display !== "none";
              });

              if (dataTable != null) {
                logger.info("data table visible properly");
                await page
                  .waitForXPath(sp.cpPartsMarkupPartsCostRowData)
                  .then(async () => {
                    const xpath = await page.$x(
                      sp.cpPartsMarkupPartsCostRowData
                    );
                    await xpath[0].click();
                    await navigationPromise;
                    await page.waitForTimeout(15000);
                    const pageTitle = await page.title();
                    if (pageTitle == "Search by Ro") {
                      logger.info("Search by Ro title verify failed");

                      await page
                        .$eval(sp.repairOrderTable, (elem) => {
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
                      await page.waitForTimeout(15000);
                      let pageTitle = await page.title();
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
                                        "parts scatter plot overview drill down cycle success"
                                      )
                                    : [
                                        logger.error(
                                          "parts scatter plot overview drill down cycle failed"
                                        ),
                                        errors.push(
                                          "parts scatter plot overview drill down cycle failed"
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
                      logger.error("Search by Ro title verify failed");
                      errors.push("Search by Ro title verify failed");
                    }
                  })
                  .catch(() => {
                    logger.warn(
                      "there is no row data for drill down in CP Parts Markup (vs) Parts Cost"
                    );
                  });
              } else {
                logger.error("data table not visible properly");
                errors.push("data table not visible properly");
              }
            } else {
              logger.error("chart point navigation failed");
              errors.push("chart point navigation failed");
            }
          } else {
            logger.info(`canvas not displayed properly`);
            errors.push(`canvas not displayed properly`);
          }
          await page.waitForTimeout(2000);
        } else {
          logger.error("view detail button navigation failed");
          errors.push("view detail button navigation failed");
        }
      } else {
        logger.error("view detail button not display properly");
        errors.push("view detail button not display properly");
      }
    } else {
      logger.error(
        "Scatter Plot - Parts Cost / Jobs / Markup title verify failed"
      );
      errors.push(
        "Scatter Plot - Parts Cost / Jobs / Markup title verify failed"
      );
    }
    ts.assert(
      errors.length == 0,
      `Error in  Scatter Plot Parts Page: ${errors.join("\n")}`
    );
  } catch (error) {
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsScatterPlotPartsTest();
