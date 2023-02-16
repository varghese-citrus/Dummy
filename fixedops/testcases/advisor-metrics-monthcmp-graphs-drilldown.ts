import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { AdvisorTechMetricsSelector as as } from "../selectors/advisor-tech-metrics.ts";
import { LaborWorkMiss as lw } from "../selectors/labor-work-mix.ts";
import { fixedopsCommonLogin } from "./common/fixedops-common-login.ts";
import { getRandomNumberBetween, startLogger } from "../utilities/utils.ts";

const logger = startLogger();

const errors: string[] = [];

function fixedOpsAdvisorMetricsTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[AEC-FOCP-UI-FN-LD-0014] ${site.name} FixedOps Advisor Metrics Page Month Comparison Graph Drill Down Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-UI-FN-LD-0014",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await advisorMetricsPageMonthCmpGraphDrillDownTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Advisor Metrics Page Month Comparison Graph Drill Down Test";
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

async function advisorMetricsPageMonthCmpGraphDrillDownTest(baseURL: string) {
  let browser = null;

  try {
    const oBrowser = await fixedopsCommonLogin(baseURL);
    const page = oBrowser.page;
    browser = oBrowser.browser;
    const navigationPromise = oBrowser.navigationPromise;

    await navigationPromise;
    await page.waitForTimeout(15000);

    await page.waitForSelector(as.advisorMetricsLink);
    await page.click(as.advisorMetricsLink);
    await navigationPromise;
    await page.waitForTimeout(15000);
    logger.info("advisor link clicked!!!");

    const toggleBtn = [
      lw.tglBtn_1,
      lw.tglBtn_2,
      lw.tglBtn_3,
      lw.tglBtn_4,
      lw.tglBtn_5,
    ];

    const title = await page.title();

    if (title == "Service Advisor Performance") {
      logger.info("Service Advisor Performance title verify success");
      await page.waitForTimeout(2000);

      const monthCmpTab = await page.$x(as.comparisonByMonthTab);
      await monthCmpTab[0].click();
      await navigationPromise;
      await page.waitForTimeout(15000);

      const num3 = await getRandomNumberBetween(1, 3);
      await page
        .waitForSelector(as.alertMessage, {
          visible: true,
          timeout: 4000,
        })
        .then(() => {
          logger.warn(
            "there is no data present on the graphs,skipping graphs drill down check"
          );
        })
        .catch(async () => {
          await page.waitForTimeout(2000);
          const graph = await page.waitForXPath(as.getMonthCmpCavas(num3), {
            visible: true,
            timeout: 2000,
          });
          await page.waitForTimeout(2000);

          if (graph) {
            logger.info("graph visible properly");
            await page.waitForTimeout(2000);
            let i = 1;
            do {
              try {
                const idRanges = [
                  { range: await getRandomNumberBetween(2, 5) },
                  { range: await getRandomNumberBetween(14, 18) },
                  { range: await getRandomNumberBetween(26, 30) },
                  { range: await getRandomNumberBetween(38, 42) },
                  { range: await getRandomNumberBetween(50, 54) },
                  { range: await getRandomNumberBetween(62, 66) },
                  { range: await getRandomNumberBetween(74, 78) },
                  { range: await getRandomNumberBetween(86, 90) },
                  { range: await getRandomNumberBetween(98, 102) },
                  { range: await getRandomNumberBetween(110, 114) },
                  { range: await getRandomNumberBetween(122, 126) },
                  { range: await getRandomNumberBetween(134, 138) },
                ];
                const bar = await page.$x(as.bar(idRanges[num3 - 1].range));
                await bar[0].click();
                await navigationPromise;
                await page.waitForTimeout(20000);
                logger.info("bar graph clicked");
                break;
              } catch {
                i++;
              }
              if (i == 15) {
                break;
              }
            } while (i > 0);

            const pageTitle = await page.title();
            const elements = [
              as.serAdvPerDataAsOf,
              as.serAdvPerResetBtn,
              as.serAdvPerDownloadIcon,
            ];
            const elementNames = [
              "data as of",
              "reset button",
              "download button",
            ];
            if (pageTitle == "Service Advisor Performance") {
              logger.info(
                "Service Advisor Performance title verify success by clicking bar chart"
              );
              await page.waitForTimeout(4000);
              for (let i = 0; i < elements.length; i++) {
                await page
                  .waitForXPath(elements[i], {
                    visible: true,
                    timeout: 2000,
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
              const dataTable = await page.$eval(
                as.serAdvPerDataTable,
                (elem) => {
                  return elem.style.display !== "none";
                }
              );
              await page.waitForTimeout(4000);
              if (dataTable) {
                logger.info("data table visible properly");
                await page.click(as.summaryRowData).catch(() => {
                  logger.warn("there is no row data for drill down");
                });

                await navigationPromise;
                await page.waitForTimeout(20000);
                const attr = await page.$eval(
                  as.serAdvDetailViewTab,
                  (element) => element.getAttribute("aria-selected")
                );

                if (attr.toString() == "true") {
                  logger.info("enters into service advisor detail view tab");
                  await page.waitForTimeout(2000);
                  const dataTable = await page.$eval(
                    as.serAdvPerDataTable,
                    (elem) => {
                      return elem.style.display !== "none";
                    }
                  );
                  await page.waitForTimeout(2000);
                  if (dataTable) {
                    logger.info(
                      "data table visible properly in service advisor detailed view tab"
                    );

                    await page.waitForTimeout(5000);
                    const store = Deno.env.get("STORE");
                    switch (store) {
                      case "Bill Knight Ford": {
                        await page.mouse.click(368, 499, { button: "left" });
                        await navigationPromise;
                        await page.waitForTimeout(20000);
                        break;
                      }
                      case "Koeppel Ford": {
                        await page.mouse.click(370, 475, { button: "left" });
                        await navigationPromise;
                        await page.waitForTimeout(20000);
                        break;
                      }
                      default: {
                        await page.mouse.click(368, 468, { button: "left" });
                        await navigationPromise;
                        await page.waitForTimeout(20000);
                        break;
                      }
                    }

                    let pageTitle = await page.title();
                    await page.waitForTimeout(8000);
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
                      if (pageTitle == "Labor Work Mix") {
                        logger.info("toggle button navigation success");

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
                        await page.waitForTimeout(5000);
                        await page.mouse.click(348, 365, { button: "left" });
                        await navigationPromise;
                        logger.info("row data clicked");
                        await page.waitForTimeout(20000);

                        const attr = await page.$eval(
                          lw.opcodeDetailedViewTab,
                          (element) => element.getAttribute("aria-selected")
                        );

                        if (attr.toString() == "true") {
                          logger.info("enters into opcode detail view");
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
                          const xpath = await page.$x(lw.detailedViewRowData);
                          await xpath[0]
                            .click()
                            .then(async () => {
                              await navigationPromise;
                              await page.waitForTimeout(20000);
                              pageTitle = await page.title();
                              await page.waitForTimeout(5000);

                              pageTitle == "Search by Ro"
                                ? logger.info(
                                    "advisor metrics comparison by month graph drill down cycle success"
                                  )
                                : [
                                    logger.error(
                                      "advisor metrics comparison by month graph drill down cycle failed"
                                    ),
                                    errors.push(
                                      "advisor metrics comparison by month graph drill down cycle failed"
                                    ),
                                  ];
                            })
                            .catch(() => {
                              logger.warn(
                                "there is no data in the table for drill down"
                              );
                            });
                        } else {
                          logger.warn("there is no row data for drill down!");
                        }
                      } else {
                        logger.error("toggle button navigation failed");
                        errors.push("toggle button navigation failed");
                      }
                    } else {
                      logger.warn("there is no row data for drill down!");
                    }
                  } else {
                    logger.info(
                      "data table not visible properly in service advisor detailed view tab"
                    );
                    errors.push(
                      "data table not visible properly in service advisor detailed view tab"
                    );
                  }
                } else {
                  logger.warn("there is no row data for drill down");
                }
              } else {
                logger.error("data table not visible properly");
                errors.push("data table not visible properly");
              }
            } else {
              logger.warn(
                "Service Advisor Performance title verify unsuccessful due to no data in the graph for drill down"
              );
            }
          } else {
            logger.error("graph not visible properly");
            errors.push("graph not visible properly");
          }
        });
    } else {
      logger.info("advisor metrics title verify failed");
      errors.push("advisor metrics title verify failed");
    }

    ts.assert(
      errors.length == 0,
      `Error in  Advisor Metrics Page: ${errors.join("\n")}`
    );
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsAdvisorMetricsTest();
