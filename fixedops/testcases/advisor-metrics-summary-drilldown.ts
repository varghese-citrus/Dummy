import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { fixedopsCommonLogin } from "./common/fixedops-common-login.ts";
import { AdvisorTechMetricsSelector as as } from "../selectors/advisor-tech-metrics.ts";
import { startLogger, getRandomNumberBetween } from "../utilities/utils.ts";
import { LaborWorkMiss as lw } from "../selectors/labor-work-mix.ts";

const logger = startLogger();
const errors: string[] = [];

function fixedOpsAdvisorMetricsPageTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[AEC-FOCP-UI-FN-LD-0024] ${site.name} FixedOps Advisor Metrics Page Summary Drill Down Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "[AEC-FOCP-UI-FN-LD-0024]",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await advisorMetricsPageSummaryDrillDownTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Advisor Metrics Page Summary Drill Down Test";
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

async function advisorMetricsPageSummaryDrillDownTest(baseURL: string) {
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

      const summeryTab = await page.waitForXPath(as.serviceAdvisorSummaryTab, {
        visible: true,
        timeout: 2000,
      });

      if (summeryTab != null) {
        logger.info("service advisor summery tab display properly");

        const summary = await page.$x(as.serviceAdvisorSummaryTab);

        await summary[0].click();
        await page.waitForTimeout(20000);
        logger.info("service advisor summery tab clicked");
        const elements = [
          as.serAdvPerDataAsOf,
          as.serAdvPerResetBtn,
          as.serAdvPerDownloadIcon,
        ];
        const elementNames = ["data as of", "reset button", "download button"];
        logger.info("Service Advisor Performance title verify success");
        await page.waitForTimeout(2000);
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
          await page.waitForTimeout(2000);
        }

        const dataTable = await page.$eval(as.serAdvPerDataTable, (elem) => {
          return elem.style.display !== "none";
        });
        await page.waitForTimeout(2000);
        if (dataTable) {
          logger.info("data table visible properly");
          await page.click(as.summaryRowData);
          await navigationPromise;
          await page.waitForTimeout(20000);
          const attr = await page.$eval(as.serAdvDetailViewTab, (element) =>
            element.getAttribute("aria-selected")
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
              await page.waitForTimeout(2000);
              await page.mouse.click(368, 466, { button: "left" });
              await navigationPromise;
              await page.waitForTimeout(20000);

              let pageTitle = await page.title();
              await page.waitForTimeout(8000);
              if (pageTitle == "Search by Ro") {
                logger.info("Search by Ro titile verify success");

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
                            const rowData = await page.$x(
                              lw.detailedViewRowData
                            );
                            await rowData[0].click();
                            await navigationPromise;
                            logger.info("row data clicked");
                            await page.waitForTimeout(20000);
                            pageTitle = await page.title();
                            pageTitle == "Search by Ro"
                              ? logger.info(
                                  "advisor metrics summary drill down cycle success"
                                )
                              : [
                                  logger.error(
                                    "advisor metrics summary drill down cycle failed"
                                  ),
                                  errors.push(
                                    "advisor metrics summary drill down cycle failed"
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
        logger.error("service advisor summery tab not display properly");
        errors.push("service advisor summery tab not display properly");
      }
    } else {
      logger.error("Service Advisor Performance title verify failed");
      errors.push("Service Advisor Performance title verify failed");
    }
    ts.assert(
      errors.length == 0,
      `Error in Advisor Metrics Page: ${errors.join("\n")}`
    );
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsAdvisorMetricsPageTest();
