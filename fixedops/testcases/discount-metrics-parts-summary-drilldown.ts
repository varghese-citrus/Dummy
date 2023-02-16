import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { DiscountMetricsSelector as ds } from "../selectors/discount-metrics.ts";
import { PartsWorkmixSelectors as pw } from "../selectors/parts-work-mix.ts";
import { fixedopsCommonLogin } from "./common/fixedops-common-login.ts";
import { getRandomNumberBetween, startLogger } from "../utilities/utils.ts";

const logger = startLogger();
const errors: string[] = [];

function fixedOpsDiscountSummaryTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[AEC-FOCP-UI-FN-LD-0058] ${site.name} FixedOps Discount Summary Parts Page Common Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-UI-FN-LD-0058",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await disSummaryPageCommonTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Discount Summary Parts Page Common Test";
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

async function disSummaryPageCommonTest(baseURL: string) {
  let browser = null;

  try {
    const oBrowser = await fixedopsCommonLogin(baseURL);
    const page = oBrowser.page;
    browser = oBrowser.browser;
    const navigationPromise = oBrowser.navigationPromise;

    await page.waitForSelector(ds.disMetricsLink);
    await page.click(ds.disMetricsLink);
    await navigationPromise;
    await page.waitForTimeout(15000);
    logger.info("discount link clicked!!!");

    // const discountSummaryTab = await page.$x(ds.discountSummaryTab);
    // await discountSummaryTab[0].click();
    // await page.waitForTimeout(10000);
    // logger.info("Discount summary tab clicked");

    const title = await page.title();
    const toggleBtn = [
      pw.tglBtn_1,
      pw.tglBtn_2,
      pw.tglBtn_3,
      pw.tglBtn_4,
      pw.tglBtn_5,
    ];

    if (title == "Discount") {
      logger.info("Discount metrics title verify success");

      const partsTab = await page.$x(ds.partsTab);
      await partsTab[0].click();
      await page.waitForTimeout(10000);
      logger.info("Parts Tab selected");

      const sumData = await page.$eval(ds.dataTab, (elem) => {
        return elem.style.display !== "none";
      });
      if (sumData) {
        logger.info("data table visible properly in discount Summary tab");
        await page.waitForTimeout(8000);
        await page.mouse.click(435, 429, { button: "left" });
        await navigationPromise;
        await page.waitForTimeout(15000);

        let pageTitle = await page.title();
        await page.waitForTimeout(8000);
        if (pageTitle == "Drill Down - Discount Summary") {
          logger.info(`${pageTitle} title verify success`);
          await page.waitForTimeout(12000);

          await page.mouse.click(283, 220, { button: "left" });
          await navigationPromise;
          logger.info("row data clicked");
          await page.waitForTimeout(20000);
          pageTitle = await page.title();

          if (pageTitle == "Search by Ro") {
            logger.info(`${pageTitle} title verify success`);
            await page.waitForTimeout(12000);
            await page.screenshot({ path: "./example.png" });
            await page.waitForTimeout(3000);
            await page
              .$eval(pw.repairOrderTable, (elem) => {
                return elem.style.display !== "none";
              })
              .then(() => {
                logger.info("repair order table display properly");
              })
              .catch(() => {
                logger.error("repair order table not display properly");
                errors.push("repair order table not display properly");
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
                    "data table display properly under opcode summary tab"
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
                    "data table not display properly under opcode summary tab"
                  );
                  errors.push(
                    "data table not display properly under opcode summary tab"
                  );
                });

              const attr = await page.$eval(
                pw.opcodeDetailedViewTab,
                (element) => element.getAttribute("aria-selected")
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
                              "discount metrics parts summary drill down cycle success"
                            )
                          : [
                              logger.error(
                                "discount metrics parts summary drill down cycle failed"
                              ),
                              errors.push(
                                "discount metrics parts summary drill down cycle failed"
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
          logger.warn("there is no row data for drill down!");
        }
      } else {
        logger.error("data table not visible properly");
        errors.push("data table not visible properly");
      }
    } else {
      logger.error("Discount Summary Parts  page title verify failed");
      errors.push("Discount Summary Parts  page title verify failed");
    }
    ts.assert(
      errors.length == 0,
      `Error in  Discount Summary Parts Page: ${errors.join("\n")}`
    );
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsDiscountSummaryTest();
