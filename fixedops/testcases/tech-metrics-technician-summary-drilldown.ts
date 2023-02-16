import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { fixedopsCommonLogin } from "./common/fixedops-common-login.ts";
import { AdvisorTechMetricsSelector as as } from "../selectors/advisor-tech-metrics.ts";
import { LaborWorkMiss as lw } from "../selectors/labor-work-mix.ts";
import { startLogger, getRandomNumberBetween } from "../utilities/utils.ts";

const logger = startLogger();

const errors: string[] = [];

function fixedOpsTechMetricsPageTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[AEC-FOCP-UI-FN-LD-0253] ${site.name} FixedOps Tech Metrics Page Technician Summary Drill Down Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-UI-FN-LD-0253",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await techMetricsPageTechnicianSummaryDrillDownTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Tech Metrics Page Technician Summary Drill Down Test";
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

async function techMetricsPageTechnicianSummaryDrillDownTest(baseURL: string) {
  let browser = null;

  try {
    const oBrowser = await fixedopsCommonLogin(baseURL);
    const page = oBrowser.page;
    browser = oBrowser.browser;
    const navigationPromise = oBrowser.navigationPromise;

    await navigationPromise;
    await page.waitForTimeout(15000);

    await page.waitForSelector(as.techMetricsLink);
    await page.click(as.techMetricsLink);
    await navigationPromise;
    await page.waitForTimeout(15000);
    logger.info("Tech metrics link clicked");

    const title = await page.title();

    const toggleBtn = [
      lw.tglBtn_1,
      lw.tglBtn_2,
      lw.tglBtn_3,
      lw.tglBtn_4,
      lw.tglBtn_5,
    ];
    if (title == "Technician Performance") {
      logger.info("Technician Performance title verify success");
      const summeryTab = await page.$eval(as.technicianSummeryTab, (elem) => {
        return elem.style.display !== "none";
      });
      if (summeryTab) {
        logger.info("Technician summery tab display properly");
        await page.waitForTimeout(2000);
        await page.waitForSelector(as.technicianSummeryTab);
        await page.click(as.technicianSummeryTab);
        await page.waitForTimeout(20000);
        logger.info("Technician summery tab clicked");

        const dataTable = await page.$eval(as.technicianDataTable, (elem) => {
          return elem.style.display !== "none";
        });
        await page.waitForTimeout(5000);
        if (dataTable) {
          logger.info(
            "Data table visible properly under technician summary tab"
          );
          await page.waitForTimeout(2000);
          await page.mouse.click(272, 307, { button: "left" }).catch(() => {
            logger.warn(
              "There is no row data for drill down in technician summary table"
            );
          });
          await navigationPromise;
          await page.waitForTimeout(15000);

          const attr = await page.$eval(
            as.technicianDetailedViewTab,
            (element) => element.getAttribute("aria-selected")
          );
          if (attr.toString() == "true") {
            logger.info("Enters into technician detailed view tab");
            await page.waitForTimeout(2000);
            const dataTable = await page.$eval(
              as.techPerDetailedViewDataTable,
              (elem) => {
                return elem.style.display !== "none";
              }
            );
            await page.waitForTimeout(2000);
            if (dataTable) {
              logger.info(
                "Data table visible under technician detailed view tab"
              );
              await page.waitForTimeout(2000);
              await page
                .waitForSelector(as.techPerDetailedViewRowData)
                .then(async () => {
                  await page.click(as.techPerDetailedViewRowData);
                })
                .catch(() => {
                  logger.warn(
                    "There is no data for drill down in technician summary detailed view table"
                  );
                });
              await navigationPromise;
              await page.waitForTimeout(15000);
              let pageTitle = await page.title();
              await page.waitForTimeout(5000);
              if (pageTitle == "Search by Ro") {
                logger.info("Search by Ro title verify success");

                const repairOderTable = await page.$eval(
                  lw.repairOrderTable,
                  (elem) => {
                    return elem.style.display !== "none";
                  }
                );

                repairOderTable
                  ? logger.info("Repair order table visible properly")
                  : [
                      logger.error("Repair order table not visible properly"),
                      errors.push("Repair order table not visible properly"),
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
                  logger.info("Repair order toggle button navigation success");
                  await page.waitForTimeout(5000);

                  await page
                    .$eval(lw.dataTable, (elem) => {
                      return elem.style.display !== "none";
                    })
                    .then(async () => {
                      logger.info(
                        "Data table display properly under opcode summery tab"
                      );
                      await page
                        .waitForXPath(lw.noTableRowDataMsg)
                        .then(() => {
                          logger.warn("There is no data in the table");
                        })
                        .catch(async () => {
                          await page.mouse.click(348, 365, { button: "left" });
                          await navigationPromise;
                          logger.info("Row data clicked");
                          await page.waitForTimeout(20000);
                        });
                    })
                    .catch(() => {
                      logger.error(
                        "Data table not display properly under opcode summary tab"
                      );
                      errors.push(
                        "Data table not display properly under opcode summary tab"
                      );
                    });

                  const attr = await page.$eval(
                    lw.opcodeDetailedViewTab,
                    (element) => element.getAttribute("aria-selected")
                  );
                  await page.waitForTimeout(5000);
                  if (attr.toString() == "true") {
                    logger.info("Enters into opcode detail view");
                    await page.waitForTimeout(4000);

                    await page
                      .$eval(lw.dataTable, (elem) => {
                        return elem.style.display !== "none";
                      })
                      .then(async () => {
                        logger.info(
                          "Data table display properly under opcode detail view tab"
                        );
                        await page
                          .waitForXPath(lw.noTableRowDataMsg)
                          .then(() => {
                            logger.warn("There is no data in the table");
                          })
                          .catch(async () => {
                            const rowData = await page.$x(
                              lw.detailedViewRowData
                            );
                            await rowData[0].click();
                            await navigationPromise;
                            logger.info("Row data clicked");
                            await page.waitForTimeout(20000);
                            pageTitle = await page.title();
                            pageTitle == "Search by Ro"
                              ? logger.info(
                                  "Tech metrics technician summary drill down cycle success"
                                )
                              : [
                                  logger.error(
                                    "Tech metrics technician summary drill down cycle failed"
                                  ),
                                  errors.push(
                                    "Tech metrics technician summary drill down cycle failed"
                                  ),
                                ];
                            await page.waitForTimeout(5000);
                          });
                      })
                      .catch(() => {
                        logger.info(
                          "Data table not display properly under opcode detail view tab"
                        );
                        errors.push(
                          "Data table not display properly under opcode detail view tab"
                        );
                      });
                  } else {
                    logger.warn(
                      "Opcode detailed view tab verification unsuccessful due to there is no data in summary table for drill down"
                    );
                  }
                } else {
                  logger.error("Repair order toggle button navigation failed");
                  errors.push("Repair order toggle button navigation failed");
                }
              } else {
                logger.warn("There is no row data for drill down!");
              }
            } else {
              logger.error(
                "Data table not visible under technician detailed view tab"
              );
              errors.push(
                "Data table not visible under technician detailed view tab"
              );
            }
          } else {
            logger.warn(
              "There is no row data for drill down in technician summary table"
            );
          }
        } else {
          logger.error(
            "Data table not visible properly under technician summary tab"
          );
          errors.push(
            "Data table not visible properly under technician summary tab"
          );
        }
        await page.waitForTimeout(5000);
      } else {
        logger.error("Technician summary tab not display properly");
        errors.push("Technician summary tab not display properly");
      }
    } else {
      logger.error("Technician Performance title verify failed");
      errors.push("Technician Performance title verify failed");
    }

    ts.assert(
      errors.length == 0,
      `Error in  Tech Metrics Page: ${errors.join("\n")}`
    );
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsTechMetricsPageTest();
