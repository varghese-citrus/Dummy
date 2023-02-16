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
      name: `[AEC-FOCP-UI-FN-LD-0121] ${site.name} FixedOps Labor Workmix Page Month Comparison Graphs Drill Down Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-UI-FN-LD-0121",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await laborWorkmixPageMonthCmpGraphsDrillDownTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Labor Workmix Page Month Comparison Graphs Drill Down Test";
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

async function laborWorkmixPageMonthCmpGraphsDrillDownTest(baseURL: string) {
  let browser = null;

  try {
    const oBrowser = await fixedopsCommonLogin(baseURL);
    const page = oBrowser.page;
    browser = oBrowser.browser;
    const navigationPromise = oBrowser.navigationPromise;
    await page.waitForSelector(lw.labor);
    await page.click(lw.labor);
    logger.info("labor expand collapse link clicked");
    await page.waitForTimeout(4000);
    const laborWrkMix = await page.$x(lw.laborWorkMixLink);
    await laborWrkMix[0].click();
    await navigationPromise;
    await page.waitForTimeout(15000);
    logger.info("labor work mix link clicked");

    const title = await page.title();
    const toggleBtn = [
      lw.tglBtn_1,
      lw.tglBtn_2,
      lw.tglBtn_3,
      lw.tglBtn_4,
      lw.tglBtn_5,
    ];

    if (title == "Labor Work Mix") {
      logger.info("Labor Work Mix title verify success");

      const monthWorkmixTab = await page.$x(lw.monthWrkMixTab);
      await monthWorkmixTab[0].click();
      await navigationPromise;
      await page.waitForTimeout(15000);
      logger.info("labor work mix 2 month comparison tab clicked");

      const num1 = await getRandomNumberBetween(2, 6);
      await page.waitForTimeout(5000);
      const graphs = await page.waitForXPath(lw.monthCmpGraphs(num1), {
        visible: true,
        timeout: 2000,
      });

      await page.waitForTimeout(2000);

      if (graphs != null) {
        logger.info("bar chart visible properly");
        const store = Deno.env.get("STORE");
        let i = 1;
        let xpath;
        let id;
        let idRangesArr;
        do {
          if (store == " Warrensburg CDJR-Fiat") {
            const idRange1 = await getRandomNumberBetween(5, 11);
            const idRange2 = await getRandomNumberBetween(16, 22);
            const idRange3 = await getRandomNumberBetween(27, 33);
            const idRange4 = await getRandomNumberBetween(38, 44);
            const idRange5 = await getRandomNumberBetween(49, 55);
            idRangesArr = [idRange1, idRange2, idRange3, idRange4, idRange5];
          } else {
            const idRange1 = await getRandomNumberBetween(1, 19);
            const idRange2 = await getRandomNumberBetween(20, 38);
            const idRange3 = await getRandomNumberBetween(39, 57);
            const idRange4 = await getRandomNumberBetween(58, 76);
            const idRange5 = await getRandomNumberBetween(77, 95);
            idRangesArr = [idRange1, idRange2, idRange3, idRange4, idRange5];
          }

          id = idRangesArr[num1 - 2];
          try {
            await page.waitForXPath(lw.bar(id));
            xpath = await page.$x(lw.bar(id));
            await page.waitForTimeout(2000);
            await xpath[0].click();
            await navigationPromise;
            await page.waitForTimeout(20000);
            logger.info("bar chart clicked");
            break;
          } catch {
            i++;
          }
          if (i == 25) {
            break;
          }
        } while (i > 0);

        const title = await page.title();
        if (title == "Labor Work Mix") {
          logger.info(`${title} title verify success`);
          await page.waitForTimeout(5000);
          await page
            .$eval(lw.dataTable, (elem) => {
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
          await page.waitForTimeout(5000);
          const btn = await page.$x(lw.opcodeSummeryRowData);
          await btn[0].click();
          await navigationPromise;
          logger.info("opcode summery row data clicked");
          await page.waitForTimeout(25000);
          const attr = await page.$eval(lw.opcodeDetailedViewTab, (element) =>
            element.getAttribute("aria-selected")
          );
          await page.waitForTimeout(5000);
          if (attr.toString() == "true") {
            logger.info("enters into opcode detail view tab");
            await page.waitForTimeout(5000);
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
                logger.error(
                  "data table not display properly under opcode detail view tab"
                );
                errors.push(
                  "data table not display properly under opcode detail view tab"
                );
              });
            await page.waitForTimeout(5000);
            await page.waitForXPath(lw.opcodeDetailViewRowData);
            const opcodeDetailViewRowData = await page.$x(
              lw.opcodeDetailViewRowData
            );
            await opcodeDetailViewRowData[0].click();
            await navigationPromise;
            logger.info("opcode detail view row data clicked");
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
                    logger.error("view detail button drill down cycle failed"),
                    errors.push("view detail button drill down cycle failed"),
                  ];
            } else {
              logger.warn("there is no row data for drill down!");
            }
          } else {
            logger.warn(
              "there is no row data in opcode summery page table for drill down"
            );
          }
        } else if (title == "Labor Work Mix Other") {
          logger.info("labor workmix other title verify success");
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
              logger.error(
                "data table not display properly under labor workmix other page"
              );
              errors.push(
                "data table not display properly under labor workmix other page"
              );
            });
          await page.waitForTimeout(4000);
          const laborWorkmixOtherRowData = await page.$x(
            lw.laborWorkmixOtherRowData
          );
          await laborWorkmixOtherRowData[0].click();
          await navigationPromise;
          logger.info("labor workmix other row data clicked");
          await page.waitForTimeout(20000);
          const pageTitle = await page.title();
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
                logger.error(
                  "data table not display properly under opcode summery tab"
                );
                errors.push(
                  "data table not display properly under opcode summery tab"
                );
              });
            const btn = await page.$x(lw.opcodeSummeryRowData);
            await btn[0].click();
            await navigationPromise;
            logger.info("opcode summery row data clicked");
            await page.waitForTimeout(25000);
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
                  logger.error(
                    "data table not display properly under opcode detail view tab"
                  );
                  errors.push(
                    "data table not display properly under opcode detail view tab"
                  );
                });
              const opcodeDetailViewRowData = await page.$x(
                lw.opcodeDetailViewRowData
              );
              await opcodeDetailViewRowData[0].click();
              await navigationPromise;
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
