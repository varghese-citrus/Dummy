import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { ScatterPlotLaborSelectors as sp } from "../selectors/scatter-plot-labor.ts";
import { LaborSelectors as ls } from "../selectors/labor-overview.ts";
import { LaborWorkmixOtherSelectors as lo } from "../selectors/labor-workmix-other.ts";
import { fixedopsCommonLogin } from "./common/fixedops-common-login.ts";
import { getRandomNumberBetween, startLogger } from "../utilities/utils.ts";

const logger = startLogger();
const errors: string[] = [];

function fixedOpsScatterPlotLaborTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[AEC-FOCP-UI-FN-LD-0107] ${site.name} FixedOps Labor Scatter Plot Page Overview Drill Down Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-UI-FN-LD-0107",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await scatterPlotLaborOverviewDrillDownTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Labor Scatter Plot Page Overview Drill Down Test";
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

async function scatterPlotLaborOverviewDrillDownTest(baseURL: string) {
  let browser = null;

  try {
    const oBrowser = await fixedopsCommonLogin(baseURL);
    const page = oBrowser.page;
    browser = oBrowser.browser;
    const navigationPromise = oBrowser.navigationPromise;
    await page.waitForSelector(ls.labor);
    await page.click(ls.labor);
    logger.info("labor expand collapse link clicked!!!");
    await page.waitForTimeout(4000);
    await page.waitForSelector(sp.scatterPlotLaborLink);
    await page.click(sp.scatterPlotLaborLink);
    await navigationPromise;
    await page.waitForTimeout(15000);
    logger.info("scatter plot labor link clicked!!!");

    const title = await page.title();

    const toggleBtn = [
      sp.tglBtn_1,
      sp.tglBtn_2,
      sp.tglBtn_3,
      sp.tglBtn_4,
      sp.tglBtn_5,
    ];

    if (title == "Scatter Plot - Labor Hours / Jobs / ELR") {
      logger.info(
        "Scatter Plot - Labor Hours / Jobs / ELR title verify success"
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
              sp.cpElrLaborSoliHoursbackBtn,
              sp.cpElrLaborSoliHoursDataAsOf,
              sp.cpElrLaborSoliHoursResetBtn,
              sp.cpElrLaborSoliHoursDownloadIcon,
            ];

            const elementNames = [
              "back button",
              "data as of",
              "reset button",
              "download icon",
            ];
            if (pageTitle == "Drill Down - CP ELR (vs) Labor Sold Hours") {
              logger.info("chart point navigation success");

              for (let k = 0; k <= elements.length - 1; k++) {
                await page
                  .waitForXPath(elements[k], {
                    visible: true,
                    timeout: 2000,
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
              const dataTable = await page.waitForSelector(sp.dataTable, {
                visible: true,
                timeout: 4000,
              });

              if (dataTable != null) {
                logger.info("data table visible properly");
                await page
                  .waitForXPath(sp.cpElrLaborSoliHoursRowData)
                  .then(async () => {
                    const xpath = await page.$x(sp.cpElrLaborSoliHoursRowData);
                    await xpath[0].click();
                    await navigationPromise;
                    await page.waitForTimeout(15000);

                    const pageTitle = await page.title();
                    if (pageTitle == "Search by Ro") {
                      logger.info("Search by Ro title verify failed");
                      logger.info("Search by Ro title verify success");

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
                      const pageTitle = await page.title();
                      if (pageTitle == "Labor Work Mix") {
                        logger.info("enters into opcode summery");
                        await page.waitForTimeout(2000);
                        await page
                          .$eval(lo.dataTable, (elem) => {
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
                          lo.opcodeDetailedViewTab,
                          (element) => element.getAttribute("aria-selected")
                        );

                        if (attr) {
                          logger.info("enters into opcode detail view");
                          await page.waitForTimeout(2000);
                          await page
                            .$eval(lo.dataTable, (elem) => {
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
                          await page.waitForTimeout(5000);
                          await page.mouse.click(896, 360, { button: "left" });
                          await navigationPromise;
                          logger.info("row data clicked");
                          await page.waitForTimeout(15000);
                          const pageTitle = await page.title();
                          await page.waitForTimeout(5000);
                          if (pageTitle == "Search by Ro") {
                            logger.info("Search by Ro title verify success");

                            await page
                              .$eval(lo.repairOrderTable, (elem) => {
                                return elem.style.display !== "none";
                              })
                              .then(() => {
                                logger.info(
                                  "scatter plot overview page chart point drill down success"
                                );
                              })
                              .catch(() => {
                                logger.error(
                                  "scatter plot overview page chart point drill down failed"
                                );
                                errors.push(
                                  "scatter plot overview page chart point drill down failed"
                                );
                              });
                            await page.waitForTimeout(5000);
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
                      logger.error("Search by Ro title verify failed");
                      errors.push("Search by Ro title verify failed");
                    }
                  })
                  .catch(() => {
                    logger.warn(
                      "there is no row data for drill down in CP ELR (vs) Labor Sold Hours"
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
        "Scatter Plot - Labor Hours / Jobs / ELR title verify failed"
      );
      errors.push(
        "Scatter Plot - Labor Hours / Jobs / ELR title verify failed"
      );
    }
    ts.assert(
      errors.length == 0,
      `Error in Scatter Plot Labor Page: ${errors.join("\n")}`
    );
  } catch (error) {
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsScatterPlotLaborTest();
