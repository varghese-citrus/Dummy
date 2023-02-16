import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { PartsWorkmixSelectors as pw } from "../selectors/parts-work-mix.ts";
import { fixedopsCommonLogin } from "./common/fixedops-common-login.ts";
import { startLogger, getRandomNumberBetween } from "../utilities/utils.ts";

const logger = startLogger();
const errors: string[] = [];

function fixedOpsPartsWorkmixTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[AEC-FOCP-UI-FN-LD-0198] ${site.name} FixedOps Labor Workmix Page Opcode Detail View Script Drill Down Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-UI-FN-LD-0198",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await partsWorkmixPageOpcodeDetailViewDrillDownTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Parts Workmix Page Opcode Detail View Script Drill Down Test";
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

async function partsWorkmixPageOpcodeDetailViewDrillDownTest(baseURL: string) {
  let browser = null;

  try {
    const oBrowser = await fixedopsCommonLogin(baseURL);
    const page = oBrowser.page;
    browser = oBrowser.browser;
    const navigationPromise = oBrowser.navigationPromise;
    await page.waitForSelector(pw.partsMenu);
    await page.click(pw.partsMenu);
    logger.info("Parts Menu clicked");
    await navigationPromise;
    await page.waitForTimeout(5000);
    const partsWorkmixdashboard = await page.$x(pw.partsWorkmixMenu);
    await partsWorkmixdashboard[0].click();
    logger.info("Parts Workmix dashboard clicked");
    await navigationPromise;
    await page.waitForTimeout(15000);
    const toggleBtn = [
      pw.tglBtn_1,
      pw.tglBtn_2,
      pw.tglBtn_3,
      pw.tglBtn_4,
      pw.tglBtn_5,
    ];
    const title = await page.title();
    if (title == "Parts Work Mix") {
      logger.info("Parts Work Mix title verify success");
      await page.click(pw.opcodeDetailedViewTab);
      await page.waitForTimeout(15000);
      logger.info("opcode summery tab clicked");
      const attr = await page.$eval(pw.opcodeDetailedViewTab, (element) =>
        element.getAttribute("aria-selected")
      );
      if (attr.toString() == "true") {
        logger.info("enters into opcode detail view tab");
        await page.waitForTimeout(5000);
        await page
          .$eval(pw.dataTable, (elem) => {
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
        await page.waitForTimeout(4000);
        const btn = await page.$x(pw.opcodeDetailViewRowData);
        await btn[0].click();
        await navigationPromise;
        logger.info("opcode detail view row data clicked");
        await page.waitForTimeout(25000);
        let pageTitle = await page.title();
        await page.waitForTimeout(5000);
        if (pageTitle == "Search by Ro") {
          logger.info("Search by Ro title verify success");
          await page
            .$eval(pw.repairOrderTable, (elem) => {
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
          await page.waitForTimeout(20000);
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
                      pageTitle = await page.title();
                      pageTitle == "Search by Ro"
                        ? logger.info(
                            "parts workmix opcode detailed view drill down cycle success"
                          )
                        : [
                            logger.error(
                              "parts workmix opcode detailed view drill down cycle failed"
                            ),
                            errors.push(
                              "parts workmix opcode detailed view drill down cycle failed"
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
      logger.error("Parts Work Mix page title verify failed");
      errors.push("Parts Work Mix page title verify failed");
    }
    ts.assert(
      errors.length == 0,
      `Error in Parts Workmix Page: ${errors.join("\n")}`
    );
  } catch (error) {
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsPartsWorkmixTest();
