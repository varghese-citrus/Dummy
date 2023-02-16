import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { LaborWorkMiss as lw } from "../selectors/labor-work-mix.ts";
import { PartsWorkmixSelectors as pw } from "../selectors/parts-work-mix.ts";
import { fixedopsCommonLogin } from "./common/fixedops-common-login.ts";
import { startLogger, getRandomNumberBetween } from "../utilities/utils.ts";

const logger = startLogger();
const errors: string[] = [];

function fixedOpsLaborWorkmixTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[DEMO-TEST] ${site.name} FixedOps Labor Workmix Page Opcode Summary Drill Down Test`,
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
          await laborWorkmixPageOpcodeSummaryDrillDownTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Labor Workmix Page Opcode Summary Drill Down Test";
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

async function laborWorkmixPageOpcodeSummaryDrillDownTest(baseURL: string) {
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
    const toggleBtn = [
      lw.tglBtn_1,
      lw.tglBtn_2,
      lw.tglBtn_3,
      lw.tglBtn_4,
      lw.tglBtn_5,
    ];
    const title = await page.title();
    if (title == "Labor Work Mix") {
      logger.info("Labor Work Mix title verify success");
      await page.click(lw.opcodeSummeryTab);
      await page.waitForTimeout(15000);
      logger.info("opcode summery tab clicked");
      await page
        .$eval(lw.opcodeTable, (elem) => {
          return elem.style.display !== "none";
        })
        .then(() => {
          logger.info("opcode summery table display properly");
        })
        .catch(() => {
          logger.error("opcode summery table not display properly");
          errors.push("opcode summery table not display properly");
        });
      const mnth = await page.$x(lw.durationExpand);
      await mnth[0].click();
      await navigationPromise;
      logger.info("Month selection expanded");
      await page.waitForTimeout(25000);

      await page.waitForSelector(lw.summaryRowData);
      await page.click(lw.summaryRowData).catch(() => {
        logger.warn("there is no data in the table for drill down");
      });
      await navigationPromise;
      await page.waitForTimeout(15000);
      const attr = await page.$eval(lw.opcodeDetailedViewTab, (element) =>
        element.getAttribute("aria-selected")
      );
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
        const btn = await page.$x(lw.opcodeDetailViewRowData);
        await btn[0].click();
        await navigationPromise;
        logger.info("opcode detail view row data clicked");
        await page.waitForTimeout(25000);
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
                    const mnth = await page.$x(lw.durationExpand);
                    await mnth[0].click();
                    await navigationPromise;
                    logger.info("Month selection expanded");
                    await page.waitForTimeout(25000);
                    await page.waitForSelector(lw.summaryRowData);
                    await page.click(lw.summaryRowData);
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
                        ? logger.info(
                            "labor  workmix opcode summary drill down cycle success"
                          )
                        : [
                            logger.error(
                              "labor workmix opcode summary drill down cycle failed"
                            ),
                            errors.push(
                              "labor  workmix opcode summary drill down cycle failed"
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
        logger.error("opcode detail view verification failed");
        errors.push("opcode detail view verification failed");
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
