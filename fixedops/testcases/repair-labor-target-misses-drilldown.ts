import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { RepairlabortargetmissesSelectors as rlts } from "../selectors/repair_labor_target_misses.ts";
import { LaborWorkMiss as lw } from "../selectors/labor-work-mix.ts";
import { fixedopsCommonLogin } from "./common/fixedops-common-login.ts";
import { startLogger, getRandomNumberBetween } from "../utilities/utils.ts";

const errors: string[] = [];
const logger = startLogger();
function fixedOpsRepairLaborTargetMissesTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[AEC-FOCP-UI-FN-LD-0209] ${site.name} Repair Labor Target Misses Page Drill Down Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-UI-FN-LD-0209",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await repairLaborTargetMissesDrillDownTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in Repair Labor Target Misses Page Drill Down Test";
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

async function repairLaborTargetMissesDrillDownTest(baseURL: string) {
  let browser = null;

  try {
    const oBrowser = await fixedopsCommonLogin(baseURL);
    const page = oBrowser.page;
    browser = oBrowser.browser;
    const navigationPromise = oBrowser.navigationPromise;
    await page.waitForSelector(rlts.Labor);
    await page.click(rlts.Labor);
    logger.info("Labour Menu clicked");
    await page.waitForTimeout(5000);
    await page.waitForXPath(rlts.repair_labor_target_misses);
    const xpath = await page.$x(rlts.repair_labor_target_misses);
    await xpath[0].click();
    logger.info("Repair labor target misses Menu clicked");
    await navigationPromise;
    await page.waitForTimeout(15000);
    const actual_title: string = await page.title();
    const elements = [
      rlts.heading,
      rlts.dataAsOf,
      rlts.downloadIcon,
      rlts.resetBtn,
      rlts.durationSelect,
    ];
    const elementNames = [
      "heading filed",
      "data as of",
      "download icon",
      "reset button",
      "duration select",
    ];
    const toggleBtn = [
      rlts.tglBtn_1,
      rlts.tglBtn_2,
      rlts.tglBtn_3,
      rlts.tglBtn_4,
      rlts.tglBtn_5,
    ];
    const titleArr = [
      "Customer Pay Repair - Labor Target Misses - Medium Duty",
      "Customer Pay Repair - Labor Target Misses",
      "Customer Pay Repair - Labor Target Misses - Light Duty",
      "Customer Pay Repair - Labor Target Misses - Standard",
    ];
    const res = titleArr.filter((str) => {
      return str === actual_title;
    });

    if (actual_title.includes(res[0])) {
      logger.info("Repair labor target misses title verify success");
      await page.waitForTimeout(4000);
      //const num = await getRandomNumberBetween(0, 1);
      const num = 1;
      const drillDown = ["labor grid", "repair order"];
      const res = drillDown[num];
      if (res == "repair order") {
        for (let i = 0; i < elements.length; i++) {
          await page
            .waitForXPath(elements[i], {
              visible: true,
              timeout: 3000,
            })
            .then(() => {
              logger.info(`${elementNames[i]} visible properly`);
            })
            .catch(() => {
              logger.error(`${elementNames[i]} not visible properly`);
              errors.push(`${elementNames[i]} not visible properly`);
            });
          await page.waitForTimeout(4000);
        }
        const dataTable = await page.$eval(rlts.dataTable, (elem) => {
          return elem.style.display !== "none";
        });
        await page.waitForTimeout(2000);
        if (dataTable) {
          logger.info("data table displayed properly in labor target misses");
          await page.waitForTimeout(4000);
          await page
            .waitForSelector(rlts.rowData1)
            .then(async () => {
              await page.click(rlts.rowData1);
              await navigationPromise;
              await page.waitForTimeout(20000);
              logger.info("repair order row data clicked");
            })
            .catch(() => {
              logger.warn("there is no data in the table for drill down");
            });
          let pageTitle = await page.title();
          await page.waitForTimeout(5000);
          if (pageTitle == "Search by Ro") {
            logger.info("Search by Ro title verify success");
            await page.waitForTimeout(2000);
            await page
              .$eval(rlts.repairOrderTable, (elem) => {
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
            logger.info("repair order toggle button clicked");
            pageTitle = await page.title();
            if (pageTitle == "Labor Work Mix") {
              logger.info("repair order toggle button navigation success");
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
                      await page.mouse.click(348, 365, { button: "left" });
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
                        const rowData = await page.$x(lw.detailedViewRowData);
                        await rowData[0].click();
                        await navigationPromise;
                        logger.info("row data clicked");
                        await page.waitForTimeout(20000);
                        pageTitle = await page.title();
                        pageTitle == "Search by Ro"
                          ? logger.info("repair order drill down cycle success")
                          : [
                              logger.error(
                                "repair order drill down cycle failed"
                              ),
                              errors.push(
                                "repair order drill down cycle failed"
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
          logger.error(
            "data table not displayed properly in labor target misses"
          );
          errors.push(
            "data table not displayed properly in labor target misses"
          );
        }
      } else {
        const element = [
          rlts.laborGridHeading,
          rlts.resetBtn,
          rlts.laborGridBackBtn,
          rlts.laborGridSelect_1,
          rlts.laborGridSelect_2,
          rlts.laborGridDoorInstallDate,
          rlts.laborGridDoorRate,
        ];
        const elementName = [
          "heading",
          "reset button",
          "back button",
          "select 1",
          "select 2",
          "door install date",
          "door rate",
        ];
        await page.mouse.click(412, 359, { button: "left" }).catch(() => {
          logger.warn("there is no data for drill down");
        });
        await navigationPromise;
        await page.waitForTimeout(15000);
        const pageTitle = await page.title();
        if (pageTitle == "Labor Grid(s)") {
          logger.info("Labor Grid(s) title verify success");
          await page.waitForTimeout(2000);
          for (let i = 0; i <= element.length - 1; i++) {
            await page.waitForTimeout(2000);
            await page
              .waitForXPath(element[i], {
                visible: true,
                timeout: 2000,
              })
              .then(() => {
                logger.info(`labor grid ${elementName[i]} display properly`);
              })
              .catch(() => {
                logger.error(
                  `labor grid ${elementName[i]} not display properly`
                );
                errors.push(
                  `labor grid ${elementName[i]} not display properly`
                );
              });
            await page.waitForTimeout(2000);
          }
          await page.waitForTimeout(4000);
          await page
            .$eval(rlts.laborGridTable, (elem) => {
              return elem.style.display !== "none";
            })
            .then(() => {
              logger.info("repair labor target misses drill down success");
            })
            .catch(() => {
              logger.error("repair labor target misses drill down failed");
              errors.push("labor grid table not display properly");
            });
          await page.waitForTimeout(4000);
        } else {
          logger.warn(
            "Labor Grid(s) title verify failed due to no data for drill down"
          );
        }
      }
    } else {
      logger.error("repair labor target misses title verify failed");
      errors.push("repair labor target misses title verify failed");
    }
    ts.assert(
      errors.length == 0,
      `Error in Repair labor target misses Page:${errors.join("\n")}`
    );
  } catch (error) {
    console.log(error);
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsRepairLaborTargetMissesTest();
