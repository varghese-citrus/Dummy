import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { RepairpartstargetmissesSelectors as rpts } from "../selectors/repair_parts_target_misses.ts";
import { PartsWorkmixSelectors as pw } from "../selectors/parts-work-mix.ts";
import { PartsMatrixSelectors as ps } from "../selectors/parts-matrix.ts";
import { fixedopsCommonLogin } from "./common/fixedops-common-login.ts";
import { startLogger, getRandomNumberBetween } from "../utilities/utils.ts";

const errors: string[] = [];
const logger = startLogger();
function fixedOpsRepairPartsTargetMissesTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[AEC-FOCP-UI-FN-LD-0211] ${site.name} Repair Parts Target Misses Page Drill Down Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-UI-FN-LD-0211",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await repairPartsTargetMissesDrillDownTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in Repair Parts Target Misses Page Drill Down Test";
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

async function repairPartsTargetMissesDrillDownTest(baseURL: string) {
  let browser = null;

  try {
    const oBrowser = await fixedopsCommonLogin(baseURL);
    const page = oBrowser.page;
    browser = oBrowser.browser;
    const navigationPromise = oBrowser.navigationPromise;
    await page.waitForSelector(rpts.Parts);
    await page.click(rpts.Parts);
    logger.info("Parts Menu clicked");
    await page.waitForTimeout(5000);
    await page.waitForXPath(rpts.repair_parts_target_misses);
    const xpath = await page.$x(rpts.repair_parts_target_misses);
    await xpath[0].click();
    logger.info("Repair parts target misses Menu clicked");
    await navigationPromise;
    await page.waitForTimeout(15000);
    const actual_title = await page.title();
    const elements = [
      rpts.heading,
      rpts.dataAsOf,
      rpts.downloadIcon,
      rpts.resetBtn,
      rpts.durationSelect,
    ];
    const elementNames = [
      "heading filed",
      "data as of",
      "download icon",
      "reset button",
      "duration select",
    ];
    const toggleBtn = [
      rpts.tglBtn_1,
      rpts.tglBtn_2,
      rpts.tglBtn_3,
      rpts.tglBtn_4,
      rpts.tglBtn_5,
    ];
    if (actual_title == "Customer Pay Repair - Parts Target Misses") {
      logger.info("Repair parts target misses title verify success");
      await page.waitForTimeout(4000);
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
      const dataTable = await page.$eval(rpts.dataTable, (elem) => {
        return elem.style.display !== "none";
      });
      await page.waitForTimeout(2000);
      const el = [rpts.rowData, rpts.matrixInstallDate];
      //const num = await getRandomNumberBetween(0, 1);
      const num = 0;
      if (dataTable) {
        logger.info("data table displayed properly in parts target misses");
        await page.waitForTimeout(4000);
        await page
          .waitForXPath(el[num])
          .then(async () => {
            const xpath = await page.$x(el[num]);
            await xpath[0].click();
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
            .$eval(rpts.repairOrderTable, (elem) => {
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

            const attr = await page.$eval(pw.opcodeDetailedViewTab, (element) =>
              element.getAttribute("aria-selected")
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
                      const rowData = await page.$x(pw.detailedViewRowData);
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
                            errors.push("repair order drill down cycle failed"),
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
        } else if (pageTitle == "Parts Matrix(s)") {
          logger.info("parts matrix title verify success");
          await page.waitForTimeout(2000);
          const heading = await page.$x(ps.partsMatrixHeading);
          const pageHeading = await (
            await heading[0].getProperty("textContent")
          ).jsonValue();
          await page.waitForTimeout(2000);
          if (pageHeading == "Parts Matrix(s)") {
            logger.info("parts matrix heading verify success");
            await page
              .waitForXPath(ps.matrixInstallDate, {
                visible: true,
                timeout: 2000,
              })
              .then(() => {
                logger.info("matrix install date field visible properly");
              })
              .catch(() => {
                logger.warn(
                  "matrix install date field not visible as there is no data in the table"
                );
              });
            await page.waitForTimeout(2000);
            await page
              .waitForSelector(ps.resetBtn, {
                visible: true,
                timeout: 4000,
              })
              .then(() => {
                logger.info("reset button display properly");
              })
              .catch(() => {
                logger.error("reset button not display properly");
                errors.push("reset button not display properly");
              });
            await page.waitForTimeout(2000);
            const matrixPeriodSelect = await page.waitForXPath(
              ps.matrixPeriodSelect,
              {
                visible: true,
                timeout: 2000,
              }
            );
            if (matrixPeriodSelect != null) {
              logger.info("matrix period select display properly");
              const matrixPeriodSel = await page.$x(ps.matrixPeriodSelect);
              await matrixPeriodSel[0].click();
              await page.waitForTimeout(4000);
              const matrixPeriodSelectLi = await page.$x(
                ps.matrixPeriodSelectLi
              );
              await matrixPeriodSelectLi[0].click();
              await page.waitForTimeout(4000);
              const alertMsg =
                "No data found for the selected Matrix Period , Matrix Type and Parts Source combination";
              await page
                .waitForXPath(ps.noData)
                .then(async () => {
                  const xpath = await page.$x(ps.noData);
                  const noData: string = await (
                    await xpath[0].getProperty("textContent")
                  ).jsonValue();

                  if (noData.includes(alertMsg) == true) {
                    logger.warn("data not present in the table");
                  }
                })
                .catch(async () => {
                  logger.info("data is already present in the table");
                  const matrixSelect = await page.waitForXPath(
                    ps.matrixSelect,
                    {
                      visible: true,
                      timeout: 2000,
                    }
                  );
                  await page.waitForTimeout(2000);

                  if (matrixSelect != null) {
                    logger.info("matrix select display properly");
                    const matrixSelect = await page.$x(ps.matrixSelect);
                    await matrixSelect[0].click();
                    await page.waitForTimeout(4000);
                    const matrixSelectLi = await page.$x(ps.matrixSelectLi);
                    await matrixSelectLi[0].click();
                    await page.waitForTimeout(4000);
                    const sourceSelect = await page.waitForXPath(
                      ps.sourceSelect,
                      {
                        visible: true,
                        timeout: 2000,
                      }
                    );
                    await page.waitForTimeout(2000);
                    if (sourceSelect != null) {
                      logger.info("source select display properly");
                      const sourceSel = await page.$x(ps.sourceSelect);
                      await sourceSel[0].click();
                      await page.waitForTimeout(4000);
                      const li = await page.$x(ps.sourceSelectLiCount);
                      const num = await getRandomNumberBetween(1, li.length);
                      const selectLi = await page.$x(ps.sourceSelectLi(num));
                      await selectLi[0].click();
                      await page.waitForTimeout(8000);
                      await page
                        .$eval(ps.dataTable, (elem) => {
                          return elem.style.display !== "none";
                        })
                        .then(() => {
                          logger.info("data table display properly");
                        })
                        .catch(() => {
                          logger.error("data table not display properly");
                          errors.push("data table not display properly");
                        });
                      await page.waitForTimeout(2000);
                    } else {
                      logger.error("source select not display properly");
                      errors.push("source select not display properly");
                    }
                  } else {
                    logger.error("matrix select not display properly");
                    errors.push("matrix select not display properly");
                  }
                });
            } else {
              logger.error("matrix period select not visible");
              errors.push("matrix period select not visible");
            }
          } else {
            logger.error("parts matrix heading verify failed");
            errors.push("parts matrix heading verify failed");
          }
        } else {
          logger.warn(
            "Search by Ro title verification unsuccessful,due to there is no row data for drill down"
          );
        }
      } else {
        logger.error(
          "data table not displayed properly in parts target misses"
        );
        errors.push("data table not displayed properly in parts target misses");
      }
    } else {
      logger.error("Repair parts target misses title verify failed");
      errors.push("Repair parts target misses title verify failed");
    }
    ts.assert(
      errors.length == 0,
      `Error in Repair parts target misses Page:${errors.join("\n")}`
    );
  } catch (error) {
    console.log(error);
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsRepairPartsTargetMissesTest();
