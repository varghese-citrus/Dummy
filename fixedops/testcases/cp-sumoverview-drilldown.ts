import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { CpSelectors as cps } from "../selectors/cp-overview.ts";
import { fixedopsCommonLogin } from "./common/fixedops-common-login.ts";
import { startLogger, getRandomNumberBetween } from "../utilities/utils.ts";

const logger = startLogger();
const errors: string[] = [];

function fixedOpsCPOverviewDrilldownTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[AEC-FOCP-UI-FN-LD-0039] ${site.name} FixedOps Summary Overview Page Drill Down Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-UI-FN-LD-0039",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await cpOverviewPageViewDetailBtnDrilldownTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Summary Overview Page Drill Down Test";
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

async function cpOverviewPageViewDetailBtnDrilldownTest(baseURL: string) {
  let browser = null;

  try {
    const oBrowser = await fixedopsCommonLogin(baseURL);
    const page = oBrowser.page;
    browser = oBrowser.browser;
    const navigationPromise = oBrowser.navigationPromise;

    await page.waitForSelector(cps.cpsummary);
    await page.click(cps.cpsummary);
    logger.info("cp expand collapse link clicked!!!");
    await page.waitForTimeout(4000);

    await page.waitForSelector(cps.cpOverview);
    await page.click(cps.cpOverview);
    await navigationPromise;
    await page.waitForTimeout(12000);

    const title = await page.title();

    if (title == "CP Summary Overview") {
      logger.info("CP Summary Overview title verify success");

      const ids = [
        cps.viewDetailBtn1,
        cps.viewDetailBtn2,
        cps.viewDetailBtn3,
        cps.viewDetailBtn4,
        cps.viewDetailBtn5,
        cps.viewDetailBtn6,
      ];
      const cordinates = [
        { name: "graph 1", x: 1160, y: 320 },
        { name: "graph 2", x: 742, y: 718 },
        { name: "graph 3", x: 1291, y: 344 },
        { name: "graph 4", x: 711, y: 412 },
        { name: "graph 5", x: 1290, y: 340 },
        { name: "graph 6", x: 738, y: 1375 },
        { name: "graph 7", x: 1287, y: 367 },
      ];
      const toggleBtn = [
        cps.tglBtn_1,
        cps.tglBtn_2,
        cps.tglBtn_3,
        cps.tglBtn_4,
        cps.tglBtn_5,
      ];

      const num1 = await getRandomNumberBetween(2, 4);

      await page.waitForSelector(ids[num1]);
      await page.click(ids[num1]);
      await navigationPromise;
      await page.waitForTimeout(5000);

      const title = await page.title();

      if (title == "Overview") {
        logger.info("view detail button navigation success");
        await page.waitForTimeout(5000);

        const canvasDiv = await page.$x(cps.canvasDiv);

        if (canvasDiv.length == 3) {
          //const num3 = await getRandomNumberBetween(1, 3);
          const num3 = 1;
          await page.waitForXPath(cps.charts(num3 + 1));

          const graphs = await page.waitForXPath(cps.charts(num3 + 1), {
            visible: true,
            timeout: 2000,
          });

          if (graphs != null) {
            logger.info("canvas visible properly");

            const data = cordinates[num3 - 1];

            await page.mouse.click(data.x, data.y, { button: "left" });
            await page.waitForTimeout(12000);

            const title = await page.title();
            let heading;

            await page
              .waitForXPath(cps.pageHeading, {
                visible: true,
                timeout: 4000,
              })
              .then(async () => {
                const pageHeading = await page.$x(cps.pageHeading);
                heading = await (
                  await pageHeading[0].getProperty("textContent")
                ).jsonValue();
                await page.waitForTimeout(2000);
              })
              .catch(() => {
                logger.warn(
                  "there is no data display in the graph for drill down!"
                );
              });

            const expTitle = `Drill Down - ${heading}`;
            if (title == expTitle) {
              logger.info(`${title} title verify success`);

              await page
                .$eval(cps.dataTable, (elem) => {
                  return elem.style.display !== "none";
                })
                .then(() => {
                  logger.info(
                    `data table display properly under ${title} page`
                  );
                })
                .catch(() => {
                  logger.info(
                    `data table not display properly under ${title} page`
                  );
                  errors.push(
                    `data table not display properly under ${title} page`
                  );
                });

              await page.mouse.click(288, 252, { button: "left" });
              await navigationPromise;
              logger.info("row data clicked");
              await page.waitForTimeout(25000);

              let pageTitle = await page.title();
              if (pageTitle == "Search by Ro") {
                logger.info(`${pageTitle} title verify success`);
                await page.waitForTimeout(2000);

                await page
                  .$eval(cps.repairOrderTable, (elem) => {
                    return elem.style.display !== "none";
                  })
                  .then(() => {
                    logger.info("repair order table display properly");
                  })
                  .catch(() => {
                    logger.error("repair order table not display properly");
                    errors.push("repair order table not display properly");
                  });

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
                  logger.info(`${pageTitle} title verify success`);

                  await page
                    .$eval(cps.dataTable, (elem) => {
                      return elem.style.display !== "none";
                    })
                    .then(() => {
                      logger.info(
                        `data table display properly under ${pageTitle} page`
                      );
                    })
                    .catch(() => {
                      logger.info(
                        `data table not display properly under ${pageTitle} page`
                      );
                      errors.push(
                        `data table not display properly under ${pageTitle} page`
                      );
                    });

                  await page.mouse.click(351, 360, { button: "left" });
                  await navigationPromise;
                  logger.info("row data clicked");
                  await page.waitForTimeout(15000);

                  const attr = await page.$eval(
                    cps.opcodeDetailViewTab,
                    (element) => element.getAttribute("aria-selected")
                  );

                  if (attr) {
                    logger.info("enters into opcode detail view");
                    await page.waitForTimeout(2000);

                    await page
                      .$eval(cps.dataTable, (elem) => {
                        return elem.style.display !== "none";
                      })
                      .then(() => {
                        logger.info(
                          "data table display properly under opcode detail view tab under labor workmix page"
                        );
                      })
                      .catch(() => {
                        logger.error(
                          "data table not display properly under opcode detail view tab under labor workmix page"
                        );
                        errors.push(
                          "data table not display properly under opcode detail view tab under labor workmix page"
                        );
                      });

                    await page.mouse.click(900, 393, { button: "left" });
                    await navigationPromise;
                    logger.info("row data clicked");
                    await page.waitForTimeout(15000);

                    await page.waitForTimeout(5000);
                    pageTitle = await page.title();
                    await page.waitForTimeout(2000);
                    if (pageTitle == "Search by Ro") {
                      logger.info("Search by Ro title verify success");

                      const repairOderTable = await page.$eval(
                        cps.repairOrderTable,
                        (elem) => {
                          return elem.style.display !== "none";
                        }
                      );

                      repairOderTable
                        ? logger.info(
                            "view detail button drill down cycle success"
                          )
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
                  logger.error(`${pageTitle} title verify success`);
                  errors.push(`${pageTitle} title verify success`);
                }
              } else {
                logger.warn("there is no row data for drill down!");
              }
            } else {
              logger.warn(
                "title verify failed due to no data in the graph for drill down"
              );
            }
          } else {
            logger.error("canvas not visible properly");
            errors.push("canvas not visible properly");
          }
        } else {
          const num2 = await getRandomNumberBetween(1, 3);
          await page.waitForXPath(cps.charts(num2 + 1));
          const graphs = await page.waitForXPath(cps.charts(num2 + 1), {
            visible: true,
            timeout: 2000,
          });

          if (graphs != null) {
            logger.info("canvas visible properly");

            const data = cordinates[num2 - 1];
            //console.log(data);
            await page.mouse.click(data.x, data.y, { button: "left" });

            await page.waitForTimeout(15000);

            const title = await page.title();
            let heading;
            try {
              const pageHeading = await page.$x(cps.pageHeading);
              heading = await (
                await pageHeading[0].getProperty("textContent")
              ).jsonValue();
              await page.waitForTimeout(2000);
            } catch (error) {
              const errors: string[] = [];
              errors.push(error);
              const e = errors.find((x) => x === error);
              if (e) {
                logger.warn(
                  "there is no data display in the graph for drill down!"
                );
              }
            }
            const expTitle = `Drill Down - ${heading}`;
            if (title == expTitle) {
              logger.info(`${title} title verify success`);
              await page.waitForTimeout(5000);
              const dataTable = await page.$eval(
                await cps.dataTable,
                (elem) => {
                  return elem.style.display !== "none";
                }
              );
              await page.waitForTimeout(5000);
              dataTable
                ? logger.info(`data table display properly under ${title} page`)
                : [
                    logger.error(
                      `data table not display properly under ${title} page`
                    ),
                    errors.push(
                      `data table not display properly under ${title} page`
                    ),
                  ];

              await page.mouse.click(283, 215, { button: "left" });
              await navigationPromise;
              logger.info("row data clicked");
              await page.waitForTimeout(15000);

              let pageTitle = await page.title();
              if (pageTitle == "Search by Ro") {
                logger.info(`${pageTitle} title verify success`);
                await page.waitForTimeout(12000);

                const repairOderTable = await page.$eval(
                  await cps.repairOrderTable,
                  (elem) => {
                    return elem.style.display !== "none";
                  }
                );

                repairOderTable
                  ? logger.info("repair order table display properly")
                  : [
                      logger.error("repair order table not display properly"),
                      errors.push("repair order table not display properly"),
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
                  logger.info(`${pageTitle} title verify success`);

                  const dataTable = await page.$eval(
                    await cps.dataTable,
                    (elem) => {
                      return elem.style.display !== "none";
                    }
                  );

                  dataTable
                    ? logger.info(
                        `data table display properly under ${pageTitle} page`
                      )
                    : [
                        logger.error(
                          `data table not display properly under ${pageTitle} page`
                        ),
                        errors.push(
                          `data table not display properly under ${pageTitle} page`
                        ),
                      ];
                  await page.waitForTimeout(5000);

                  await page.mouse.click(351, 360, { button: "left" });
                  await navigationPromise;
                  logger.info("row data clicked");
                  await page.waitForTimeout(15000);

                  const attr = await page.$eval(
                    cps.opcodeDetailViewTab,
                    (element) => element.getAttribute("aria-selected")
                  );

                  if (attr) {
                    logger.info("enters into opcode detail view");
                    await page.waitForTimeout(2000);

                    const dataTable = await page.$eval(
                      await cps.dataTable,
                      (elem) => {
                        return elem.style.display !== "none";
                      }
                    );

                    dataTable
                      ? logger.info(
                          "data table display properly under opcode detail view tab under labor workmix page"
                        )
                      : [
                          logger.error(
                            "data table not display properly under opcode detail view tab under labor workmix page"
                          ),
                          errors.push(
                            "data table not display properly under opcode detail view tab under labor workmix page"
                          ),
                        ];

                    await page.mouse.click(280, 360, { button: "left" });
                    await navigationPromise;
                    logger.info("row data clicked");
                    await page.waitForTimeout(15000);

                    pageTitle = await page.title();
                    await page.waitForTimeout(5000);
                    if (pageTitle == "Search by Ro") {
                      logger.info("Search by Ro titile verify success");

                      const repairOderTable = await page.$eval(
                        await cps.repairOrderTable,
                        (elem) => {
                          return elem.style.display !== "none";
                        }
                      );

                      repairOderTable
                        ? logger.info(
                            "view detail button drill down cycle success"
                          )
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
                  logger.error(`${pageTitle} title verify success`);
                  errors.push(`${pageTitle} title verify success`);
                }
              } else {
                logger.warn("there is no row data for drill down!");
              }
            } else {
              logger.warn(
                "title verify failed due to no data in the graph for drill down"
              );
            }
          } else {
            logger.error("canvas not visible properly");
            errors.push("canvas not visible properly");
          }
        }
      } else {
        logger.error(`view detail button navigation failed`);
        errors.push(`view detail button  navigation failed`);
      }
    } else {
      logger.error("labor overview page title verify failed");
      errors.push("labor overview page title verify failed");
    }

    ts.assert(
      errors.length == 0,
      `Error in Summary Overview Page: ${errors.join("\n")}`
    );
  } catch (error) {
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsCPOverviewDrilldownTest();
