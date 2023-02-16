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
      name: `[AEC-FOCP-UI-FN-LD-0123] ${site.name} FixedOps Labor Workmix Page Month Comparison Overview Drill Down Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-UI-FN-LD-0123",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await laborWorkmixPageMonthCmpOverviewDrillDownTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Labor Workmix Page Month Comparison Overview Drill Down Test";
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

async function laborWorkmixPageMonthCmpOverviewDrillDownTest(baseURL: string) {
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
    const monthWorkmixTab = await page.$x(lw.monthWrkMixTab);
    await monthWorkmixTab[0].click();
    await navigationPromise;
    await page.waitForTimeout(10000);
    logger.info("labor work mix 2 month comaparison tab clicked");

    const title = await page.title();

    if (title == "Labor Work Mix") {
      logger.info("Labor Work Mix title verify success");

      const toggleBtn = [
        lw.tglBtn_1,
        lw.tglBtn_2,
        lw.tglBtn_3,
        lw.tglBtn_4,
        lw.tglBtn_5,
      ];

      const num1 = await getRandomNumberBetween(2, 6);
      await page.waitForXPath(lw.getMonthCmpViewDetailBtn(num1));
      const viewDetailBtn = await page.$x(lw.getMonthCmpViewDetailBtn(num1));
      await viewDetailBtn[0].click();
      await navigationPromise;
      await page.waitForTimeout(15000);
      const title = await page.title();
      if (title == "Overview") {
        logger.info("view detail button navigation success");
        await page.waitForTimeout(10000);
        await page.waitForXPath(lw.overviewCanvas);
        const graphs = await page.waitForXPath(lw.overviewCanvas, {
          visible: true,
          timeout: 2000,
        });
        await page.waitForTimeout(2000);

        if (graphs != null) {
          logger.info("canvas visible properly");

          let i = 1;
          do {
            try {
              const num2 = await getRandomNumberBetween(1, 19);
              await page.waitForSelector(lw.barId(num2));
              await page.click(lw.barId(num2)).catch(() => {
                logger.warn("there is no data in the bar chart for drill down");
              });
              logger.info("bar chart clicked");
              await navigationPromise;
              await page.waitForTimeout(20000);
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
                      logger.error(
                        "view detail button drill down cycle failed"
                      ),
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
            await page.waitForTimeout(10000);

            const element = [
              lw.laborWorkmixOtherHeadingSpan,
              lw.laborWorkmixOtherDataAsOfDiv,
              lw.laborWorkmixOtherResetButton,
              lw.laborWorkmixOtherDIcon,
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
                .$eval(lw.dataTable, (elem) => {
                  return elem.style.display !== "none";
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
            await page.mouse.click(255, 355, { button: "left" });
            await navigationPromise;
            logger.info("labor workmix other row data clicked");
            await page.waitForTimeout(15000);
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
            logger.warn("there is no data displayed in the bar for drill down");
          }
        }
      } else {
        logger.error("view detail button navigation failed");
        errors.push("view detail button navigation failed");
      }
    } else {
      logger.error("Labor Work Mix page title verify failed");
      errors.push("Labor Work Mix page title verify failed");
    }
    ts.assert(
      errors.length == 0,
      `Error in Labor Workmix Page: ${errors.join("\n")}`
    );
  } catch (error) {
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsLaborWorkmixTest();
