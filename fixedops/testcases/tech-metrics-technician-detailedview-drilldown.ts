import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { fixedopsCommonLogin } from "./common/fixedops-common-login.ts";
import { AdvisorTechMetricsSelector as as } from "../selectors/advisor-tech-metrics.ts";
import { LaborWorkMiss as lw } from "../selectors/labor-work-mix.ts";
import { getRandomNumberBetween, startLogger } from "../utilities/utils.ts";

const logger = startLogger();

const errors: string[] = [];

function fixedOpsTechMetricsPageTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[AEC-FOCP-UI-FN-LD-0251] ${site.name} FixedOps Tech Metrics Page Technician Detailed View Drill Down Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-UI-FN-LD-0251",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await techMetricsTechnicianDetailedViewDrillDownTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Tech Metrics Page Technician Detailed View Drill Down Test";
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

async function techMetricsTechnicianDetailedViewDrillDownTest(baseURL: string) {
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
    logger.info("tech metrics link clicked");

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

      const detailedViewTab = await page.waitForSelector(
        as.technicianDetailedViewTab,
        {
          visible: true,
          timeout: 4000,
        }
      );

      if (detailedViewTab != null) {
        logger.info("technician detailed view tab display properly");

        await page.waitForSelector(as.technicianDetailedViewTab);
        await page.click(as.technicianDetailedViewTab);
        await page.waitForTimeout(10000);

        logger.info("technician detailed view tab clicked");

        await page.waitForSelector(as.detailedViewMonthSel);
        await page.click(as.detailedViewMonthSel);
        await page.waitForTimeout(4000);

        const num1 = await getRandomNumberBetween(1, 12);

        const month1 = await page.$x(as.detailedViewMonthSelectLi(num1));
        await month1[0].click();
        await page.waitForTimeout(4000);
        logger.info("month selected");
        await navigationPromise;
        await page.waitForTimeout(20000);

        const dataTable = await page.$eval(as.dataTab, (elem) => {
          return elem.style.display !== "none";
        });
        await page.waitForTimeout(5000);

        if (dataTable) {
          logger.info("data table visible under technician detailed view tab");
          await page.waitForTimeout(2000);
          await page.mouse.click(530, 427, { button: "left" }).catch(() => {
            logger.warn(
              "there is no data for drill down in technician summary detailed view table"
            );
          });
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
                logger.error("repair order table not visible properly"),
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
                          ? logger.info(
                              "Tech metrics technician detailedview drill down cycle success"
                            )
                          : [
                              logger.error(
                                "Tech metrics technician detailedview drill down cycle failed"
                              ),
                              errors.push(
                                "Tech metrics technician detailedview drill down cycle failed"
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
            "data table not visible under technician detailed view tab"
          );
          errors.push(
            "data table not visible under technician detailed view tab"
          );
        }
      } else {
        logger.error("technician detailed view tab not display properly");
        errors.push("technician detailed view tab not display properly");
      }
    } else {
      logger.error("Technician Performance title verify failed");
      errors.push("Technician Performance title verify failed");
    }
    ts.assert(
      errors.length == 0,
      `Error in Tech Metrics Page: ${errors.join("\n")}`
    );
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsTechMetricsPageTest();
