import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { OpcodeCategorizationSelectors as oc } from "../selectors/opcode-categorizations.ts";
import { LaborWorkMiss as lw } from "../selectors/labor-work-mix.ts";
import { PartsWorkmixSelectors as pw } from "../selectors/parts-work-mix.ts";
import { fixedopsCommonLogin } from "./common/fixedops-common-login.ts";
import { startLogger, getRandomNumberBetween } from "../utilities/utils.ts";

const logger = startLogger();
const errors: string[] = [];

function fixedOpsOpcodeCategorizationsTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[DEMO-TEST] ${site.name} FixedOps Opcode Categorizations Drill Down Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "DEMO-TEST",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await opcodeCategorizationPageDrillDown(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Opcode Categorizations Drill Down Test";
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

async function opcodeCategorizationPageDrillDown(baseURL: string) {
  let browser = null;

  try {
    const oBrowser = await fixedopsCommonLogin(baseURL);
    const page = oBrowser.page;
    browser = oBrowser.browser;
    const navigationPromise = oBrowser.navigationPromise;
    await navigationPromise;
    await page.waitForTimeout(10000);
    await page.waitForSelector(oc.referenceAndSetupLink);
    await page.click(oc.referenceAndSetupLink);
    logger.info("reference/setups expand collapse link clicked");
    await page.waitForTimeout(4000);
    await page.waitForSelector(oc.opcodeCategorizationLink);
    await page.click(oc.opcodeCategorizationLink);
    await navigationPromise;
    await page.waitForTimeout(15000);
    logger.info("labor grid link clicked");

    const toggleBtn = [
      lw.tglBtn_1,
      lw.tglBtn_2,
      lw.tglBtn_3,
      lw.tglBtn_4,
      lw.tglBtn_5,
    ];

    const title = await page.title();
    if (title == "Opcode Categorizations") {
      logger.info("opcode categorizations title verify success");
      await page.waitForTimeout(2000);
      const heading = await page.$x(oc.heading);
      const pageHeading = await (
        await heading[0].getProperty("textContent")
      ).jsonValue();
      await page.waitForTimeout(2000);
      if (pageHeading == "Opcode Categorizations") {
        logger.info("opcode categorizations heading verify success");

        const ids_arr2 = [oc.downloadBtn, oc.resetBtn];
        const btnName = ["download button", "reset button", "data table"];
        await page.waitForTimeout(2000);

        await page.waitForTimeout(2000);
        for (let i = 0; i < ids_arr2.length; i++) {
          await page
            .waitForSelector(ids_arr2[i], {
              visible: true,
              timeout: 4000,
            })
            .then(() => {
              logger.info(`${btnName[i]} display properly`);
            })
            .catch(() => {
              logger.error(`${btnName[i]} not display properly`);
              errors.push(`${btnName[i]} not display properly`);
            });
          await page.waitForTimeout(2000);
        }

        const dataTable = await page.$eval(oc.dataTable, (elem) => {
          return elem.style.display !== "none";
        });
        await page.waitForTimeout(4000);
        if (dataTable) {
          logger.info("data table display properly");
          const rowData = await page.$x(oc.rowData);
          const opcodeName = await (
            await rowData[0].getProperty("textContent")
          ).jsonValue();
          await rowData[0].click();
          await navigationPromise;
          await page.waitForTimeout(15000);
          const opcodeSelect = await page.$x(oc.opcodeSelect);
          await opcodeSelect[0].click();
          await page.waitForTimeout(5000);
          let areaSelect = await page.$eval(oc.opcodeSelectLi, (element) =>
            element.getAttribute("aria-selected")
          );
          let dataValue = await page.$eval(oc.opcodeSelectLi, (element) =>
            element.getAttribute("data-value")
          );
          await page.waitForTimeout(4000);
          areaSelect.toString() == "true" && dataValue.toString() == opcodeName
            ? logger.info("opcode verification success after opcode click")
            : [
                logger.error("opcode verification failed after opcode click"),
                errors.push("opcode verification failed after opcode click"),
              ];

          await page.click(oc.opcodeSelectLi);
          await page.waitForTimeout(5000);
          await page.click(oc.resetBtn);
          await page.waitForTimeout(15000);
          await opcodeSelect[0].click();
          await page.waitForTimeout(5000);
          areaSelect = await page.$eval(oc.opcodeAllSelectLi, (element) =>
            element.getAttribute("aria-selected")
          );
          dataValue = await page.$eval(oc.opcodeAllSelectLi, (element) =>
            element.getAttribute("data-value")
          );
          await page.waitForTimeout(4000);
          areaSelect.toString() == "true" && dataValue.toString() == "All"
            ? logger.info(
                "opcode verification success after reset button click"
              )
            : [
                logger.error(
                  "opcode verification failed after reset button click"
                ),
                errors.push(
                  "opcode verification failed after reset button click"
                ),
              ];
          await page.click(oc.opcodeAllSelectLi);
          await page.waitForTimeout(5000);
          const pageTitle = await page.title();

          if (pageTitle == "Labor Work Mix") {
            logger.info("labor workmix title verify success");
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
                      let pageTitle = await page.title();
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
                              "opcode categorization drill down cycle success"
                            )
                          : [
                              logger.error(
                                "opcode categorization drill down cycle failed"
                              ),
                              errors.push(
                                "opcode categorization drill down cycle failed"
                              ),
                            ];
                      } else {
                        logger.warn("there is no row data for drill down!");
                      }
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
            logger.warn("there is no data in the table for drill down");
          }
        } else {
          logger.error("data table not display properly");
          errors.push("data table not display properly");
        }
      } else {
        logger.error("opcode categorizations heading verify failed");
        errors.push("opcode categorizations heading verify failed");
      }
    } else {
      logger.error("opcode categorizations title verify failed");
      errors.push("opcode categorizations title verify failed");
    }
    ts.assert(
      errors.length == 0,
      `Error in Opcode Categorization Page: ${errors.join("\n")}`
    );
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsOpcodeCategorizationsTest();
