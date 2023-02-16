import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { fixedopsCommonLogin } from "../testcases/common/fixedops-common-login.ts";
import { getStore } from "./stores/first-team-stores.ts";
import { CpSelectors as cps } from "../selectors/cp-overview.ts";
import { startLogger, getData } from "../utilities/utils.ts";

const logger = startLogger();
const errors: string[] = [];
const valData = await getData("Overview").then((e) => {
  return e;
});
function fixedOpsSummaryOverviewValidationTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[AEC-FOCP-UI-FN-LD-0001] ${site.name} FixedOps Cp Summary Overview Single Charts Data Validation Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-UI-FN-LD-0001",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await summaryOverviewSingleChartsValidationTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Cp Summary Overview Single Charts Data Validation Test";
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

async function summaryOverviewSingleChartsValidationTest(baseURL: string) {
  let browser = null;

  try {
    const oBrowser = await fixedopsCommonLogin(baseURL);
    const page = oBrowser.page;
    browser = oBrowser.browser;
    const navigationPromise = oBrowser.navigationPromise;
    await navigationPromise;
    await page.waitForSelector(cps.cpsummary);
    await page.click(cps.cpsummary);
    logger.info("cp expand collapse link clicked!!!");
    await page.waitForTimeout(5000);
    await page.waitForSelector(cps.cpOverview);
    await page.click(cps.cpOverview);
    await navigationPromise;
    await page.waitForTimeout(12000);
    const title = await page.title();
    const storeId = valData[0].storeid;
    const store = Deno.env.get("STORE");
    const storeDetail = getStore(storeId);
    const ids = [cps.viewDetailBtn4, cps.viewDetailBtn5, cps.viewDetailBtn6];
    if (
      storeDetail[0].name.toString() == store?.toString() &&
      title == "CP Summary Overview"
    ) {
      logger.info("store and title of the page verification success");

      if (valData[0].advisor == "(All)" || valData[0].advisor == "All") {
        for (let j = 0; j <= ids.length - 1; j++) {
          await page
            .waitForSelector(ids[j], {
              visible: true,
              timeout: 4000,
            })
            .then(async () => {
              logger.info("view detail button visible properly");
              await page.click(ids[j]);
              await navigationPromise;
              await page.waitForTimeout(15000);
              let pageTitle = await page.title();
              if (pageTitle == "Overview") {
                logger.info(`view detail button navigation success`);
                const coordinates = [
                  { x: 404, y: 144 },
                  { x: 410, y: 147 },
                  { x: 410, y: 147 },
                  { x: 410, y: 147 },
                  { x: 410, y: 147 },
                  { x: 410, y: 147 },
                  { x: 410, y: 147 },
                ];
                for (const dt of valData) {
                  const values = [dt.soldhours, dt.elr, dt.partsmarkup];
                  const paytype = dt.paytype;
                  if (paytype == "All") {
                    const canvasSpan = await page.$x(cps.getCanvasName(1));
                    const canvasName: string = await (
                      await canvasSpan[0].getProperty("textContent")
                    ).jsonValue();
                    await page.waitForTimeout(2000);

                    const canvasElement = await page.$x(cps.getCanvas(1));
                    await page.waitForTimeout(2000);

                    await page.evaluate((element) => {
                      element.scrollIntoView(
                        0,
                        parseInt(element.getBoundingClientRect().y)
                      );
                    }, canvasElement[0]);

                    const selector = await page.waitForXPath(cps.getCanvas(1));
                    const position = await page.evaluate((el) => {
                      const { x, y } = el.getBoundingClientRect();
                      return { x, y };
                    }, selector);

                    await page
                      .waitForXPath(cps.getCanvas(1), {
                        visible: true,
                        timeout: 4000,
                      })
                      .then(async () => {
                        logger.info(`${canvasName} graph visible properly`);
                        const cor = coordinates[0];
                        await page.mouse.click(
                          position.x + cor.x,
                          position.y + cor.y,
                          {
                            button: "left",
                          }
                        );
                        await navigationPromise;
                        await page.waitForTimeout(120000);
                        pageTitle = await page.title();

                        if (pageTitle != "Overview") {
                          switch (canvasName) {
                            case "Effective Labor Rate - Combined": {
                              await page
                                .waitForXPath(cps.garndTotalElement(3), {
                                  visible: true,
                                  timeout: 4000,
                                })
                                .then(async () => {
                                  logger.info(
                                    "grand total element display properly"
                                  );
                                  const el = await page.$x(
                                    cps.garndTotalElement(3)
                                  );
                                  const actValue: string = await (
                                    await el[0].getProperty("textContent")
                                  ).jsonValue();

                                  Number(actValue.replace(/[^0-9\.]+/g, "")) ==
                                  values[j]
                                    ? logger.info(
                                        `${canvasName} data validation success by database value ${
                                          values[j]
                                        } is matching with ui displayed value ${Number(
                                          actValue.replace(/[^0-9\.]+/g, "")
                                        )}`
                                      )
                                    : [
                                        logger.error(
                                          `${canvasName} data validation failed by database value ${
                                            values[j]
                                          } is not matching with ui displayed value ${Number(
                                            actValue.replace(/[^0-9\.]+/g, "")
                                          )}`
                                        ),
                                        errors.push(
                                          `${canvasName} data validation failed by database value ${
                                            values[j]
                                          } is not matching with ui displayed value ${Number(
                                            actValue.replace(/[^0-9\.]+/g, "")
                                          )}`
                                        ),
                                      ];
                                })
                                .catch(() => {
                                  logger.error(
                                    "grand total element not display properly"
                                  );
                                  errors.push(
                                    "grand total element not display properly"
                                  );
                                });
                              break;
                            }
                            case "Parts Markup - Combined": {
                              await page
                                .waitForXPath(cps.garndTotalElement(3), {
                                  visible: true,
                                  timeout: 4000,
                                })
                                .then(async () => {
                                  logger.info(
                                    "grand total element display properly"
                                  );
                                  const el = await page.$x(
                                    cps.garndTotalElement(3)
                                  );
                                  const actValue: string = await (
                                    await el[0].getProperty("textContent")
                                  ).jsonValue();

                                  Number(actValue.replace(/[^0-9\.]+/g, "")) ==
                                  values[j]
                                    ? logger.info(
                                        `${canvasName} data validation success by database value ${
                                          values[j]
                                        } is matching with ui displayed value ${Number(
                                          actValue.replace(/[^0-9\.]+/g, "")
                                        )}`
                                      )
                                    : [
                                        logger.error(
                                          `${canvasName} data validation failed by database value ${
                                            values[j]
                                          } is not matching with ui displayed value ${Number(
                                            actValue.replace(/[^0-9\.]+/g, "")
                                          )}`
                                        ),
                                        errors.push(
                                          `${canvasName} data validation failed by database value ${
                                            values[j]
                                          } is not matching with ui displayed value ${Number(
                                            actValue.replace(/[^0-9\.]+/g, "")
                                          )}`
                                        ),
                                      ];
                                })
                                .catch(() => {
                                  logger.error(
                                    "grand total element not display properly"
                                  );
                                  errors.push(
                                    "grand total element not display properly"
                                  );
                                });
                              break;
                            }
                            default: {
                              await page
                                .waitForXPath(cps.garndTotalElement(1), {
                                  visible: true,
                                  timeout: 4000,
                                })
                                .then(async () => {
                                  logger.info(
                                    "grand total element display properly"
                                  );
                                  const el = await page.$x(
                                    cps.garndTotalElement(1)
                                  );
                                  const actValue: string = await (
                                    await el[0].getProperty("textContent")
                                  ).jsonValue();

                                  Number(actValue.replace(/[^0-9\.]+/g, "")) ==
                                  values[j]
                                    ? logger.info(
                                        `${canvasName} data validation success by database value ${
                                          values[j]
                                        } is matching with ui displayed value ${Number(
                                          actValue.replace(/[^0-9\.]+/g, "")
                                        )}`
                                      )
                                    : [
                                        logger.error(
                                          `${canvasName} data validation failed by database value ${
                                            values[j]
                                          } is not matching with ui displayed value ${Number(
                                            actValue.replace(/[^0-9\.]+/g, "")
                                          )}`
                                        ),
                                        errors.push(
                                          `${canvasName} data validation failed by database value ${
                                            values[j]
                                          } is not matching with ui displayed value ${Number(
                                            actValue.replace(/[^0-9\.]+/g, "")
                                          )}`
                                        ),
                                      ];
                                })
                                .catch(() => {
                                  logger.error(
                                    "grand total element not display properly"
                                  );
                                  errors.push(
                                    "grand total element not display properly"
                                  );
                                });
                              break;
                            }
                          }

                          await page.goBack();
                          await navigationPromise;
                          await page.waitForTimeout(15000);
                        } else {
                          logger.warn(
                            "there is no data in the graph for drill down"
                          );
                        }
                      })
                      .catch(() => {
                        logger.error(
                          `${canvasName} graph not visible properly`
                        );
                        errors.push(`${canvasName} graph not visible properly`);
                      });
                  } else if (paytype == "C") {
                    const canvasSpan = await page.$x(cps.getCanvasName(2));
                    const canvasName: string = await (
                      await canvasSpan[0].getProperty("textContent")
                    ).jsonValue();
                    await page.waitForTimeout(2000);

                    const canvasId = await page.$x(cps.getCanvasId(2));
                    const canvasNumber: string = await (
                      await canvasId[0].getProperty("textContent")
                    ).jsonValue();
                    await page.waitForTimeout(2000);

                    const canvasElement = await page.$x(cps.getCanvas(2));
                    await page.waitForTimeout(2000);

                    await page.evaluate((element) => {
                      element.scrollIntoView(
                        0,
                        parseInt(element.getBoundingClientRect().y)
                      );
                    }, canvasElement[0]);

                    const selector = await page.waitForXPath(cps.getCanvas(2));
                    const position = await page.evaluate((el) => {
                      const { x, y } = el.getBoundingClientRect();
                      return { x, y };
                    }, selector);

                    await page
                      .waitForXPath(cps.getCanvas(2), {
                        visible: true,
                        timeout: 4000,
                      })
                      .then(async () => {
                        logger.info(`${canvasName} graph visible properly`);
                        const cor = coordinates[1];
                        await page.mouse.click(
                          position.x + cor.x,
                          position.y + cor.y,
                          {
                            button: "left",
                          }
                        );
                        await navigationPromise;
                        await page.waitForTimeout(120000);
                        pageTitle = await page.title();

                        if (pageTitle != "Overview") {
                          switch (Number(canvasNumber)) {
                            case 1226: {
                              await page
                                .waitForXPath(cps.garndTotalElement(4), {
                                  visible: true,
                                  timeout: 4000,
                                })
                                .then(async () => {
                                  logger.info(
                                    "grand total element display properly"
                                  );
                                  const el = await page.$x(
                                    cps.garndTotalElement(4)
                                  );
                                  const actValue: string = await (
                                    await el[0].getProperty("textContent")
                                  ).jsonValue();

                                  Number(actValue.replace(/[^0-9\.]+/g, "")) ==
                                  values[j]
                                    ? logger.info(
                                        `${canvasName} data validation success by database value ${
                                          values[j]
                                        } is matching with ui displayed value ${Number(
                                          actValue.replace(/[^0-9\.]+/g, "")
                                        )}`
                                      )
                                    : [
                                        logger.error(
                                          `${canvasName} data validation failed by database value ${
                                            values[j]
                                          } is not matching with ui displayed value ${Number(
                                            actValue.replace(/[^0-9\.]+/g, "")
                                          )}`
                                        ),
                                        errors.push(
                                          `${canvasName} data validation failed by database value ${
                                            values[j]
                                          } is not matching with ui displayed value ${Number(
                                            actValue.replace(/[^0-9\.]+/g, "")
                                          )}`
                                        ),
                                      ];
                                })
                                .catch(() => {
                                  logger.error(
                                    "grand total element not display properly"
                                  );
                                  errors.push(
                                    "grand total element not display properly"
                                  );
                                });
                              break;
                            }
                            default: {
                              await page
                                .waitForXPath(cps.garndTotalElement(3), {
                                  visible: true,
                                  timeout: 4000,
                                })
                                .then(async () => {
                                  logger.info(
                                    "grand total element display properly"
                                  );
                                  const el = await page.$x(
                                    cps.garndTotalElement(3)
                                  );
                                  const actValue: string = await (
                                    await el[0].getProperty("textContent")
                                  ).jsonValue();

                                  Number(actValue.replace(/[^0-9\.]+/g, "")) ==
                                  values[j]
                                    ? logger.info(
                                        `${canvasName} data validation success by database value ${
                                          values[j]
                                        } is matching with ui displayed value ${Number(
                                          actValue.replace(/[^0-9\.]+/g, "")
                                        )}`
                                      )
                                    : [
                                        logger.error(
                                          `${canvasName} data validation failed by database value ${
                                            values[j]
                                          } is not matching with ui displayed value ${Number(
                                            actValue.replace(/[^0-9\.]+/g, "")
                                          )}`
                                        ),
                                        errors.push(
                                          `${canvasName} data validation failed by database value ${
                                            values[j]
                                          } is not matching with ui displayed value ${Number(
                                            actValue.replace(/[^0-9\.]+/g, "")
                                          )}`
                                        ),
                                      ];
                                })
                                .catch(() => {
                                  logger.error(
                                    "grand total element not display properly"
                                  );
                                  errors.push(
                                    "grand total element not display properly"
                                  );
                                });

                              break;
                            }
                          }

                          await page.goBack();
                          await navigationPromise;
                          await page.waitForTimeout(15000);
                        } else {
                          logger.warn(
                            "there is no data in the graph for drill down"
                          );
                        }
                      })
                      .catch(() => {
                        logger.error(
                          `${canvasName} graph not visible properly`
                        );
                        errors.push(`${canvasName} graph not visible properly`);
                      });
                  } else if (paytype == "W") {
                    const canvasSpan = await page.$x(cps.getCanvasName(3));
                    const canvasName: string = await (
                      await canvasSpan[0].getProperty("textContent")
                    ).jsonValue();
                    await page.waitForTimeout(2000);

                    const canvasElement = await page.$x(cps.getCanvas(3));
                    await page.waitForTimeout(2000);

                    await page.evaluate((element) => {
                      element.scrollIntoView(
                        0,
                        parseInt(element.getBoundingClientRect().y)
                      );
                    }, canvasElement[0]);

                    const selector = await page.waitForXPath(cps.getCanvas(3));
                    const position = await page.evaluate((el) => {
                      const { x, y } = el.getBoundingClientRect();
                      return { x, y };
                    }, selector);

                    await page
                      .waitForXPath(cps.getCanvas(3), {
                        visible: true,
                        timeout: 4000,
                      })
                      .then(async () => {
                        logger.info(`${canvasName} graph visible properly`);
                        const cor = coordinates[2];
                        await page.mouse.click(
                          position.x + cor.x,
                          position.y + cor.y,
                          {
                            button: "left",
                          }
                        );
                        await navigationPromise;
                        await page.waitForTimeout(120000);
                        pageTitle = await page.title();

                        if (pageTitle != "Overview") {
                          await page
                            .waitForXPath(cps.garndTotalElement(3), {
                              visible: true,
                              timeout: 4000,
                            })
                            .then(async () => {
                              logger.info(
                                "grand total element display properly"
                              );
                              const el = await page.$x(
                                cps.garndTotalElement(3)
                              );
                              const actValue: string = await (
                                await el[0].getProperty("textContent")
                              ).jsonValue();

                              Number(actValue.replace(/[^0-9\.]+/g, "")) ==
                              values[j]
                                ? logger.info(
                                    `${canvasName} data validation success by database value ${
                                      values[j]
                                    } is matching with ui displayed value ${Number(
                                      actValue.replace(/[^0-9\.]+/g, "")
                                    )}`
                                  )
                                : [
                                    logger.error(
                                      `${canvasName} data validation failed by database value ${
                                        values[j]
                                      } is not matching with ui displayed value ${Number(
                                        actValue.replace(/[^0-9\.]+/g, "")
                                      )}`
                                    ),
                                    errors.push(
                                      `${canvasName} data validation failed by database value ${
                                        values[j]
                                      } is not matching with ui displayed value ${Number(
                                        actValue.replace(/[^0-9\.]+/g, "")
                                      )}`
                                    ),
                                  ];
                            })
                            .catch(() => {
                              logger.error(
                                "grand total element not display properly"
                              );
                              errors.push(
                                "grand total element not display properly"
                              );
                            });

                          await page.goBack();
                          await navigationPromise;
                          await page.waitForTimeout(15000);
                        } else {
                          logger.warn(
                            "there is no data in the graph for drill down"
                          );
                        }
                      })
                      .catch(() => {
                        logger.error(
                          `${canvasName} graph not visible properly`
                        );
                        errors.push(`${canvasName} graph not visible properly`);
                      });
                  } else if (paytype == "I") {
                    const canvasSpan = await page.$x(cps.getCanvasName(4));
                    const canvasName: string = await (
                      await canvasSpan[0].getProperty("textContent")
                    ).jsonValue();
                    await page.waitForTimeout(2000);

                    const canvasElement = await page.$x(cps.getCanvas(4));
                    await page.waitForTimeout(2000);

                    await page.evaluate((element) => {
                      element.scrollIntoView(
                        0,
                        parseInt(element.getBoundingClientRect().y)
                      );
                    }, canvasElement[0]);

                    const selector = await page.waitForXPath(cps.getCanvas(4));
                    const position = await page.evaluate((el) => {
                      const { x, y } = el.getBoundingClientRect();
                      return { x, y };
                    }, selector);

                    await page
                      .waitForXPath(cps.getCanvas(4), {
                        visible: true,
                        timeout: 4000,
                      })
                      .then(async () => {
                        logger.info(`${canvasName} graph visible properly`);
                        const cor = coordinates[3];
                        await page.mouse.click(
                          position.x + cor.x,
                          position.y + cor.y,
                          {
                            button: "left",
                          }
                        );
                        await navigationPromise;
                        await page.waitForTimeout(120000);
                        pageTitle = await page.title();

                        if (pageTitle != "Overview") {
                          switch (canvasName) {
                            case "Effective Labor Rate - Internal": {
                              await page
                                .waitForXPath(cps.garndTotalElement(2), {
                                  visible: true,
                                  timeout: 4000,
                                })
                                .then(async () => {
                                  logger.info(
                                    "grand total element display properly"
                                  );
                                  const el = await page.$x(
                                    cps.garndTotalElement(2)
                                  );
                                  const actValue: string = await (
                                    await el[0].getProperty("textContent")
                                  ).jsonValue();

                                  Number(actValue.replace(/[^0-9\.]+/g, "")) ==
                                  values[j]
                                    ? logger.info(
                                        `${canvasName} data validation success by database value ${
                                          values[j]
                                        } is matching with ui displayed value ${Number(
                                          actValue.replace(/[^0-9\.]+/g, "")
                                        )}`
                                      )
                                    : [
                                        logger.error(
                                          `${canvasName} data validation failed by database value ${
                                            values[j]
                                          } is not matching with ui displayed value ${Number(
                                            actValue.replace(/[^0-9\.]+/g, "")
                                          )}`
                                        ),
                                        errors.push(
                                          `${canvasName} data validation failed by database value ${
                                            values[j]
                                          } is not matching with ui displayed value ${Number(
                                            actValue.replace(/[^0-9\.]+/g, "")
                                          )}`
                                        ),
                                      ];
                                })
                                .catch(() => {
                                  logger.error(
                                    "grand total element not display properly"
                                  );
                                  errors.push(
                                    "grand total element not display properly"
                                  );
                                });
                              break;
                            }
                            default: {
                              await page
                                .waitForXPath(cps.garndTotalElement(3), {
                                  visible: true,
                                  timeout: 4000,
                                })
                                .then(async () => {
                                  logger.info(
                                    "grand total element display properly"
                                  );
                                  const el = await page.$x(
                                    cps.garndTotalElement(3)
                                  );
                                  const actValue: string = await (
                                    await el[0].getProperty("textContent")
                                  ).jsonValue();

                                  Number(actValue.replace(/[^0-9\.]+/g, "")) ==
                                  values[j]
                                    ? logger.info(
                                        `${canvasName} data validation success by database value ${
                                          values[j]
                                        } is matching with ui displayed value ${Number(
                                          actValue.replace(/[^0-9\.]+/g, "")
                                        )}`
                                      )
                                    : [
                                        logger.error(
                                          `${canvasName} data validation failed by database value ${
                                            values[j]
                                          } is not matching with ui displayed value ${Number(
                                            actValue.replace(/[^0-9\.]+/g, "")
                                          )}`
                                        ),
                                        errors.push(
                                          `${canvasName} data validation failed by database value ${
                                            values[j]
                                          } is not matching with ui displayed value ${Number(
                                            actValue.replace(/[^0-9\.]+/g, "")
                                          )}`
                                        ),
                                      ];
                                })
                                .catch(() => {
                                  logger.error(
                                    "grand total element not display properly"
                                  );
                                  errors.push(
                                    "grand total element not display properly"
                                  );
                                });

                              break;
                            }
                          }

                          await page.goBack();
                          await navigationPromise;
                          await page.waitForTimeout(15000);
                        } else {
                          logger.warn(
                            "there is no data in the graph for drill down"
                          );
                        }
                      })
                      .catch(() => {
                        logger.error(
                          `${canvasName} graph not visible properly`
                        );
                        errors.push(`${canvasName} graph not visible properly`);
                      });
                  } else if (paytype == "M") {
                    const canvasSpan = await page.$x(cps.getCanvasName(5));
                    const canvasName: string = await (
                      await canvasSpan[0].getProperty("textContent")
                    ).jsonValue();
                    await page.waitForTimeout(2000);

                    const canvasElement = await page.$x(cps.getCanvas(5));
                    await page.waitForTimeout(2000);

                    await page.evaluate((element) => {
                      element.scrollIntoView(
                        0,
                        parseInt(element.getBoundingClientRect().y)
                      );
                    }, canvasElement[0]);

                    const selector = await page.waitForXPath(cps.getCanvas(5));
                    const position = await page.evaluate((el) => {
                      const { x, y } = el.getBoundingClientRect();
                      return { x, y };
                    }, selector);

                    await page
                      .waitForXPath(cps.getCanvas(5), {
                        visible: true,
                        timeout: 4000,
                      })
                      .then(async () => {
                        logger.info(`${canvasName} graph visible properly`);
                        const cor = coordinates[4];
                        await page.mouse.click(
                          position.x + cor.x,
                          position.y + cor.y,
                          {
                            button: "left",
                          }
                        );
                        await navigationPromise;
                        await page.waitForTimeout(120000);
                        pageTitle = await page.title();

                        if (pageTitle != "Overview") {
                          await page
                            .waitForXPath(cps.garndTotalElement(3), {
                              visible: true,
                              timeout: 4000,
                            })
                            .then(async () => {
                              logger.info(
                                "grand total element display properly"
                              );
                              const el = await page.$x(
                                cps.garndTotalElement(3)
                              );
                              const actValue: string = await (
                                await el[0].getProperty("textContent")
                              ).jsonValue();

                              Number(actValue.replace(/[^0-9\.]+/g, "")) ==
                              values[j]
                                ? logger.info(
                                    `${canvasName} data validation success by database value ${
                                      values[j]
                                    } is matching with ui displayed value ${Number(
                                      actValue.replace(/[^0-9\.]+/g, "")
                                    )}`
                                  )
                                : [
                                    logger.error(
                                      `${canvasName} data validation failed by database value ${
                                        values[j]
                                      } is not matching with ui displayed value ${Number(
                                        actValue.replace(/[^0-9\.]+/g, "")
                                      )}`
                                    ),
                                    errors.push(
                                      `${canvasName} data validation failed by database value ${
                                        values[j]
                                      } is not matching with ui displayed value ${Number(
                                        actValue.replace(/[^0-9\.]+/g, "")
                                      )}`
                                    ),
                                  ];
                            })
                            .catch(() => {
                              logger.error(
                                "grand total element not display properly"
                              );
                              errors.push(
                                "grand total element not display properly"
                              );
                            });
                          await page.goBack();
                          await navigationPromise;
                          await page.waitForTimeout(15000);
                        } else {
                          logger.warn(
                            "there is no data in the graph for drill down"
                          );
                        }
                      })
                      .catch(() => {
                        logger.error(
                          `${canvasName} graph not visible properly`
                        );
                        errors.push(`${canvasName} graph not visible properly`);
                      });
                  } else if (paytype == "E") {
                    const canvasSpan = await page.$x(cps.getCanvasName(6));
                    const canvasName: string = await (
                      await canvasSpan[0].getProperty("textContent")
                    ).jsonValue();
                    await page.waitForTimeout(2000);

                    const canvasElement = await page.$x(cps.getCanvas(6));
                    await page.waitForTimeout(2000);

                    await page.evaluate((element) => {
                      element.scrollIntoView(
                        0,
                        parseInt(element.getBoundingClientRect().y)
                      );
                    }, canvasElement[0]);

                    const selector = await page.waitForXPath(cps.getCanvas(6));
                    const position = await page.evaluate((el) => {
                      const { x, y } = el.getBoundingClientRect();
                      return { x, y };
                    }, selector);

                    await page
                      .waitForXPath(cps.getCanvas(6), {
                        visible: true,
                        timeout: 4000,
                      })
                      .then(async () => {
                        logger.info(`${canvasName} graph visible properly`);
                        const cor = coordinates[5];
                        await page.mouse.click(
                          position.x + cor.x,
                          position.y + cor.y,
                          {
                            button: "left",
                          }
                        );
                        await navigationPromise;
                        await page.waitForTimeout(120000);
                        pageTitle = await page.title();

                        if (pageTitle != "Overview") {
                          await page
                            .waitForXPath(cps.garndTotalElement(3), {
                              visible: true,
                              timeout: 4000,
                            })
                            .then(async () => {
                              logger.info(
                                "grand total element display properly"
                              );
                              const el = await page.$x(
                                cps.garndTotalElement(3)
                              );
                              const actValue: string = await (
                                await el[0].getProperty("textContent")
                              ).jsonValue();

                              Number(actValue.replace(/[^0-9\.]+/g, "")) ==
                              values[j]
                                ? logger.info(
                                    `${canvasName} data validation success by database value ${
                                      values[j]
                                    } is matching with ui displayed value ${Number(
                                      actValue.replace(/[^0-9\.]+/g, "")
                                    )}`
                                  )
                                : [
                                    logger.error(
                                      `${canvasName} data validation failed by database value ${
                                        values[j]
                                      } is not matching with ui displayed value ${Number(
                                        actValue.replace(/[^0-9\.]+/g, "")
                                      )}`
                                    ),
                                    errors.push(
                                      `${canvasName} data validation failed by database value ${
                                        values[j]
                                      } is not matching with ui displayed value ${Number(
                                        actValue.replace(/[^0-9\.]+/g, "")
                                      )}`
                                    ),
                                  ];
                            })
                            .catch(() => {
                              logger.error(
                                "grand total element not display properly"
                              );
                              errors.push(
                                "grand total element not display properly"
                              );
                            });
                          await page.goBack();
                          await navigationPromise;
                          await page.waitForTimeout(15000);
                        } else {
                          logger.warn(
                            "there is no data in the graph for drill down"
                          );
                        }
                      })
                      .catch(() => {
                        logger.error(
                          `${canvasName} graph not visible properly`
                        );
                        errors.push(`${canvasName} graph not visible properly`);
                      });
                  } else if (paytype == "F") {
                    const canvasSpan = await page.$x(cps.getCanvasName(7));
                    const canvasName: string = await (
                      await canvasSpan[0].getProperty("textContent")
                    ).jsonValue();
                    await page.waitForTimeout(2000);

                    const canvasElement = await page.$x(cps.getCanvas(7));
                    await page.waitForTimeout(2000);

                    await page.evaluate((element) => {
                      element.scrollIntoView(
                        0,
                        parseInt(element.getBoundingClientRect().y)
                      );
                    }, canvasElement[0]);

                    const selector = await page.waitForXPath(cps.getCanvas(7));
                    const position = await page.evaluate((el) => {
                      const { x, y } = el.getBoundingClientRect();
                      return { x, y };
                    }, selector);

                    await page
                      .waitForXPath(cps.getCanvas(7), {
                        visible: true,
                        timeout: 4000,
                      })
                      .then(async () => {
                        logger.info(`${canvasName} graph visible properly`);
                        const cor = coordinates[6];
                        await page.mouse.click(
                          position.x + cor.x,
                          position.y + cor.y,
                          {
                            button: "left",
                          }
                        );
                        await navigationPromise;
                        await page.waitForTimeout(120000);
                        pageTitle = await page.title();

                        if (pageTitle != "Overview") {
                          await page
                            .waitForXPath(cps.garndTotalElement(3), {
                              visible: true,
                              timeout: 4000,
                            })
                            .then(async () => {
                              logger.info(
                                "grand total element display properly"
                              );
                              const el = await page.$x(
                                cps.garndTotalElement(3)
                              );
                              const actValue: string = await (
                                await el[0].getProperty("textContent")
                              ).jsonValue();

                              Number(actValue.replace(/\,/g, "")) ==
                              valData[0].cpsoldhours
                                ? logger.info(
                                    `${canvasName} data validation success by database value ${
                                      values[j]
                                    } is matching with ui displayed value ${Number(
                                      actValue.replace(/\,/g, "")
                                    )}`
                                  )
                                : [
                                    logger.error(
                                      `${canvasName} data validation failed by database value ${
                                        values[j]
                                      } is not matching with ui displayed value ${Number(
                                        actValue.replace(/\,/g, "")
                                      )}`
                                    ),
                                    errors.push(
                                      `${canvasName} data validation failed by database value ${
                                        values[j]
                                      } is not matching with ui displayed value ${Number(
                                        actValue.replace(/\,/g, "")
                                      )}`
                                    ),
                                  ];
                            })
                            .catch(() => {
                              logger.error(
                                "grand total element not display properly"
                              );
                              errors.push(
                                "grand total element not display properly"
                              );
                            });
                          await page.goBack();
                          await navigationPromise;
                          await page.waitForTimeout(15000);
                        } else {
                          logger.warn(
                            "there is no data in the graph for drill down"
                          );
                        }
                      })
                      .catch(() => {
                        logger.error(
                          `${canvasName} graph not visible properly`
                        );
                        errors.push(`${canvasName} graph not visible properly`);
                      });
                  } else {
                    logger.warn("please pass relevant pay type for validation");
                  }
                }
              } else {
                logger.error(`view detail button navigation failed`);
                errors.push(`view detail button navigation failed`);
              }
            })
            .catch(() => {
              logger.error("view detail button not visible properly");
              errors.push("view detail button not visible properly");
            });
          await page.goBack();
          await navigationPromise;
          await page.waitForTimeout(25000);
        }
      } else {
        const advisor = await page.$x(cps.advisor);
        await advisor[0].click();
        await page.waitForTimeout(5000);
        const linkTexts = await page.$$eval(cps.advisorSpan, (elements) =>
          elements.map((item) => item.textContent)
        );
        const arr = Array(linkTexts);
        const arr1 = arr.toString().split(",");
        const arr2 = arr1.map((el) => {
          return Number(el.replace(/^\D+/g, "").replace("]", ""));
        });
        const adv = arr2.findIndex((el) => {
          return el === valData[0].advisor;
        });
        const checkBox = await page.$x(cps.checkBox(Number(adv) + 1));
        await checkBox[0].click();
        await page.waitForTimeout(4000);
        const filterBtn = await page.$x(cps.filterBtn);
        await filterBtn[0].click();
        await page.waitForTimeout(10000);

        for (let j = 0; j <= ids.length - 1; j++) {
          await page
            .waitForSelector(ids[j], {
              visible: true,
              timeout: 4000,
            })
            .then(async () => {
              logger.info("view detail button visible properly");
              await page.click(ids[j]);
              await navigationPromise;
              await page.waitForTimeout(15000);
              let pageTitle = await page.title();
              if (pageTitle == "Overview") {
                logger.info(`view detail button navigation success`);
                const coordinates = [
                  { x: 404, y: 144 },
                  { x: 410, y: 147 },
                  { x: 410, y: 147 },
                  { x: 410, y: 147 },
                  { x: 410, y: 147 },
                  { x: 410, y: 147 },
                  { x: 410, y: 147 },
                ];
                for (const dt of valData) {
                  const values = [dt.soldhours, dt.elr, dt.partsmarkup];
                  const paytype = dt.paytype;
                  if (paytype == "All") {
                    const canvasSpan = await page.$x(cps.getCanvasName(1));
                    const canvasName: string = await (
                      await canvasSpan[0].getProperty("textContent")
                    ).jsonValue();
                    await page.waitForTimeout(2000);

                    const canvasElement = await page.$x(cps.getCanvas(1));
                    await page.waitForTimeout(2000);

                    await page.evaluate((element) => {
                      element.scrollIntoView(
                        0,
                        parseInt(element.getBoundingClientRect().y)
                      );
                    }, canvasElement[0]);

                    const selector = await page.waitForXPath(cps.getCanvas(1));
                    const position = await page.evaluate((el) => {
                      const { x, y } = el.getBoundingClientRect();
                      return { x, y };
                    }, selector);

                    await page
                      .waitForXPath(cps.getCanvas(1), {
                        visible: true,
                        timeout: 4000,
                      })
                      .then(async () => {
                        logger.info(`${canvasName} graph visible properly`);
                        const cor = coordinates[0];
                        await page.mouse.click(
                          position.x + cor.x,
                          position.y + cor.y,
                          {
                            button: "left",
                          }
                        );
                        await navigationPromise;
                        await page.waitForTimeout(120000);
                        pageTitle = await page.title();

                        if (pageTitle != "Overview") {
                          await page
                            .waitForXPath(cps.garndTotalElement(1), {
                              visible: true,
                              timeout: 4000,
                            })
                            .then(async () => {
                              logger.info(
                                "grand total element display properly"
                              );
                              const el = await page.$x(
                                cps.garndTotalElement(1)
                              );
                              const actValue: string = await (
                                await el[0].getProperty("textContent")
                              ).jsonValue();

                              console.log(values[j]);
                              Number(actValue.replace(/[^0-9\.]+/g, "")) ==
                              values[j]
                                ? logger.info(
                                    `${canvasName} data validation success by database value ${
                                      valData[j]
                                    } is matching with ui displayed value ${Number(
                                      actValue.replace(/[^0-9\.]+/g, "")
                                    )}`
                                  )
                                : [
                                    logger.error(
                                      `${canvasName} data validation failed by database value ${
                                        values[j]
                                      } is not matching with ui displayed value ${Number(
                                        actValue.replace(/[^0-9\.]+/g, "")
                                      )}`
                                    ),
                                    errors.push(
                                      `${canvasName} data validation failed by database value ${
                                        values[j]
                                      } is not matching with ui displayed value ${Number(
                                        actValue.replace(/[^0-9\.]+/g, "")
                                      )}`
                                    ),
                                  ];
                            })
                            .catch(() => {
                              logger.error(
                                "grand total element not display properly"
                              );
                              errors.push(
                                "grand total element not display properly"
                              );
                            });
                          await page.goBack();
                          await navigationPromise;
                          await page.waitForTimeout(15000);
                        } else {
                          logger.warn(
                            "there is no data in the graph for drill down"
                          );
                        }
                      })
                      .catch(() => {
                        logger.error(
                          `${canvasName} graph not visible properly`
                        );
                        errors.push(`${canvasName} graph not visible properly`);
                      });
                  } else if (paytype == "C") {
                    const canvasSpan = await page.$x(cps.getCanvasName(2));
                    const canvasName: string = await (
                      await canvasSpan[0].getProperty("textContent")
                    ).jsonValue();
                    await page.waitForTimeout(2000);

                    const canvasElement = await page.$x(cps.getCanvas(2));
                    await page.waitForTimeout(2000);

                    await page.evaluate((element) => {
                      element.scrollIntoView(
                        0,
                        parseInt(element.getBoundingClientRect().y)
                      );
                    }, canvasElement[0]);

                    const selector = await page.waitForXPath(cps.getCanvas(2));
                    const position = await page.evaluate((el) => {
                      const { x, y } = el.getBoundingClientRect();
                      return { x, y };
                    }, selector);

                    await page
                      .waitForXPath(cps.getCanvas(2), {
                        visible: true,
                        timeout: 4000,
                      })
                      .then(async () => {
                        logger.info(`${canvasName} graph visible properly`);
                        const cor = coordinates[1];
                        await page.mouse.click(
                          position.x + cor.x,
                          position.y + cor.y,
                          {
                            button: "left",
                          }
                        );
                        await navigationPromise;
                        await page.waitForTimeout(120000);
                        pageTitle = await page.title();

                        if (pageTitle != "Overview") {
                          await page
                            .waitForXPath(cps.garndTotalElement(3), {
                              visible: true,
                              timeout: 4000,
                            })
                            .then(async () => {
                              logger.info(
                                "grand total element display properly"
                              );
                              const el = await page.$x(
                                cps.garndTotalElement(3)
                              );
                              const actValue: string = await (
                                await el[0].getProperty("textContent")
                              ).jsonValue();

                              Number(actValue.replace(/[^0-9\.]+/g, "")) ==
                              values[j]
                                ? logger.info(
                                    `${canvasName} data validation success by database value ${
                                      values[j]
                                    } is matching with ui displayed value ${Number(
                                      actValue.replace(/[^0-9\.]+/g, "")
                                    )}`
                                  )
                                : [
                                    logger.error(
                                      `${canvasName} data validation failed by database value ${
                                        values[j]
                                      } is not matching with ui displayed value ${Number(
                                        actValue.replace(/[^0-9\.]+/g, "")
                                      )}`
                                    ),
                                    errors.push(
                                      `${canvasName} data validation failed by database value ${
                                        values[j]
                                      } is not matching with ui displayed value ${Number(
                                        actValue.replace(/[^0-9\.]+/g, "")
                                      )}`
                                    ),
                                  ];
                            })
                            .catch(() => {
                              logger.error(
                                "grand total element not display properly"
                              );
                              errors.push(
                                "grand total element not display properly"
                              );
                            });

                          await page.goBack();
                          await navigationPromise;
                          await page.waitForTimeout(15000);
                        } else {
                          logger.warn(
                            "there is no data in the graph for drill down"
                          );
                        }
                      })
                      .catch(() => {
                        logger.error(
                          `${canvasName} graph not visible properly`
                        );
                        errors.push(`${canvasName} graph not visible properly`);
                      });
                  } else if (paytype == "W") {
                    const canvasSpan = await page.$x(cps.getCanvasName(3));
                    const canvasName: string = await (
                      await canvasSpan[0].getProperty("textContent")
                    ).jsonValue();
                    await page.waitForTimeout(2000);

                    const canvasElement = await page.$x(cps.getCanvas(3));
                    await page.waitForTimeout(2000);

                    await page.evaluate((element) => {
                      element.scrollIntoView(
                        0,
                        parseInt(element.getBoundingClientRect().y)
                      );
                    }, canvasElement[0]);

                    const selector = await page.waitForXPath(cps.getCanvas(3));
                    const position = await page.evaluate((el) => {
                      const { x, y } = el.getBoundingClientRect();
                      return { x, y };
                    }, selector);

                    await page
                      .waitForXPath(cps.getCanvas(3), {
                        visible: true,
                        timeout: 4000,
                      })
                      .then(async () => {
                        logger.info(`${canvasName} graph visible properly`);
                        const cor = coordinates[2];
                        await page.mouse.click(
                          position.x + cor.x,
                          position.y + cor.y,
                          {
                            button: "left",
                          }
                        );
                        await navigationPromise;
                        await page.waitForTimeout(120000);
                        pageTitle = await page.title();

                        if (pageTitle != "Overview") {
                          await page
                            .waitForXPath(cps.garndTotalElement(3), {
                              visible: true,
                              timeout: 4000,
                            })
                            .then(async () => {
                              logger.info(
                                "grand total element display properly"
                              );
                              const el = await page.$x(
                                cps.garndTotalElement(3)
                              );
                              const actValue: string = await (
                                await el[0].getProperty("textContent")
                              ).jsonValue();

                              Number(actValue.replace(/[^0-9\.]+/g, "")) ==
                              values[j]
                                ? logger.info(
                                    `${canvasName} data validation success by database value ${
                                      values[j]
                                    } is matching with ui displayed value ${Number(
                                      actValue.replace(/[^0-9\.]+/g, "")
                                    )}`
                                  )
                                : [
                                    logger.error(
                                      `${canvasName} data validation failed by database value ${
                                        values[j]
                                      } is not matching with ui displayed value ${Number(
                                        actValue.replace(/[^0-9\.]+/g, "")
                                      )}`
                                    ),
                                    errors.push(
                                      `${canvasName} data validation failed by database value ${
                                        values[j]
                                      } is not matching with ui displayed value ${Number(
                                        actValue.replace(/[^0-9\.]+/g, "")
                                      )}`
                                    ),
                                  ];
                            })
                            .catch(() => {
                              logger.error(
                                "grand total element not display properly"
                              );
                              errors.push(
                                "grand total element not display properly"
                              );
                            });

                          await page.goBack();
                          await navigationPromise;
                          await page.waitForTimeout(15000);
                        } else {
                          logger.warn(
                            "there is no data in the graph for drill down"
                          );
                        }
                      })
                      .catch(() => {
                        logger.error(
                          `${canvasName} graph not visible properly`
                        );
                        errors.push(`${canvasName} graph not visible properly`);
                      });
                  } else if (paytype == "I") {
                    const canvasSpan = await page.$x(cps.getCanvasName(4));
                    const canvasName: string = await (
                      await canvasSpan[0].getProperty("textContent")
                    ).jsonValue();
                    await page.waitForTimeout(2000);

                    const canvasElement = await page.$x(cps.getCanvas(4));
                    await page.waitForTimeout(2000);

                    await page.evaluate((element) => {
                      element.scrollIntoView(
                        0,
                        parseInt(element.getBoundingClientRect().y)
                      );
                    }, canvasElement[0]);

                    const selector = await page.waitForXPath(cps.getCanvas(4));
                    const position = await page.evaluate((el) => {
                      const { x, y } = el.getBoundingClientRect();
                      return { x, y };
                    }, selector);

                    await page
                      .waitForXPath(cps.getCanvas(4), {
                        visible: true,
                        timeout: 4000,
                      })
                      .then(async () => {
                        logger.info(`${canvasName} graph visible properly`);
                        const cor = coordinates[3];
                        await page.mouse.click(
                          position.x + cor.x,
                          position.y + cor.y,
                          {
                            button: "left",
                          }
                        );
                        await navigationPromise;
                        await page.waitForTimeout(120000);
                        pageTitle = await page.title();

                        if (pageTitle != "Overview") {
                          await page
                            .waitForXPath(cps.garndTotalElement(3), {
                              visible: true,
                              timeout: 4000,
                            })
                            .then(async () => {
                              logger.info(
                                "grand total element display properly"
                              );
                              const el = await page.$x(
                                cps.garndTotalElement(3)
                              );
                              const actValue: string = await (
                                await el[0].getProperty("textContent")
                              ).jsonValue();

                              Number(actValue.replace(/[^0-9\.]+/g, "")) ==
                              values[j]
                                ? logger.info(
                                    `${canvasName} data validation success by database value ${
                                      values[j]
                                    } is matching with ui displayed value ${Number(
                                      actValue.replace(/[^0-9\.]+/g, "")
                                    )}`
                                  )
                                : [
                                    logger.error(
                                      `${canvasName} data validation failed by database value ${
                                        values[j]
                                      } is not matching with ui displayed value ${Number(
                                        actValue.replace(/[^0-9\.]+/g, "")
                                      )}`
                                    ),
                                    errors.push(
                                      `${canvasName} data validation failed by database value ${
                                        values[j]
                                      } is not matching with ui displayed value ${Number(
                                        actValue.replace(/[^0-9\.]+/g, "")
                                      )}`
                                    ),
                                  ];
                            })
                            .catch(() => {
                              logger.error(
                                "grand total element not display properly"
                              );
                              errors.push(
                                "grand total element not display properly"
                              );
                            });

                          await page.goBack();
                          await navigationPromise;
                          await page.waitForTimeout(15000);
                        } else {
                          logger.warn(
                            "there is no data in the graph for drill down"
                          );
                        }
                      })
                      .catch(() => {
                        logger.error(
                          `${canvasName} graph not visible properly`
                        );
                        errors.push(`${canvasName} graph not visible properly`);
                      });
                  } else if (paytype == "M") {
                    const canvasSpan = await page.$x(cps.getCanvasName(5));
                    const canvasName: string = await (
                      await canvasSpan[0].getProperty("textContent")
                    ).jsonValue();
                    await page.waitForTimeout(2000);

                    const canvasElement = await page.$x(cps.getCanvas(5));
                    await page.waitForTimeout(2000);

                    await page.evaluate((element) => {
                      element.scrollIntoView(
                        0,
                        parseInt(element.getBoundingClientRect().y)
                      );
                    }, canvasElement[0]);

                    const selector = await page.waitForXPath(cps.getCanvas(5));
                    const position = await page.evaluate((el) => {
                      const { x, y } = el.getBoundingClientRect();
                      return { x, y };
                    }, selector);

                    await page
                      .waitForXPath(cps.getCanvas(5), {
                        visible: true,
                        timeout: 4000,
                      })
                      .then(async () => {
                        logger.info(`${canvasName} graph visible properly`);
                        const cor = coordinates[4];
                        await page.mouse.click(
                          position.x + cor.x,
                          position.y + cor.y,
                          {
                            button: "left",
                          }
                        );
                        await navigationPromise;
                        await page.waitForTimeout(120000);
                        pageTitle = await page.title();

                        if (pageTitle != "Overview") {
                          await page
                            .waitForXPath(cps.garndTotalElement(3), {
                              visible: true,
                              timeout: 4000,
                            })
                            .then(async () => {
                              logger.info(
                                "grand total element display properly"
                              );
                              const el = await page.$x(
                                cps.garndTotalElement(3)
                              );
                              const actValue: string = await (
                                await el[0].getProperty("textContent")
                              ).jsonValue();

                              Number(actValue.replace(/[^0-9\.]+/g, "")) ==
                              values[j]
                                ? logger.info(
                                    `${canvasName} data validation success by database value ${
                                      values[j]
                                    } is matching with ui displayed value ${Number(
                                      actValue.replace(/[^0-9\.]+/g, "")
                                    )}`
                                  )
                                : [
                                    logger.error(
                                      `${canvasName} data validation failed by database value ${
                                        values[j]
                                      } is not matching with ui displayed value ${Number(
                                        actValue.replace(/[^0-9\.]+/g, "")
                                      )}`
                                    ),
                                    errors.push(
                                      `${canvasName} data validation failed by database value ${
                                        values[j]
                                      } is not matching with ui displayed value ${Number(
                                        actValue.replace(/[^0-9\.]+/g, "")
                                      )}`
                                    ),
                                  ];
                            })
                            .catch(() => {
                              logger.error(
                                "grand total element not display properly"
                              );
                              errors.push(
                                "grand total element not display properly"
                              );
                            });
                          await page.goBack();
                          await navigationPromise;
                          await page.waitForTimeout(15000);
                        } else {
                          logger.warn(
                            "there is no data in the graph for drill down"
                          );
                        }
                      })
                      .catch(() => {
                        logger.error(
                          `${canvasName} graph not visible properly`
                        );
                        errors.push(`${canvasName} graph not visible properly`);
                      });
                  } else if (paytype == "E") {
                    const canvasSpan = await page.$x(cps.getCanvasName(6));
                    const canvasName: string = await (
                      await canvasSpan[0].getProperty("textContent")
                    ).jsonValue();
                    await page.waitForTimeout(2000);

                    const canvasElement = await page.$x(cps.getCanvas(6));
                    await page.waitForTimeout(2000);

                    await page.evaluate((element) => {
                      element.scrollIntoView(
                        0,
                        parseInt(element.getBoundingClientRect().y)
                      );
                    }, canvasElement[0]);

                    const selector = await page.waitForXPath(cps.getCanvas(6));
                    const position = await page.evaluate((el) => {
                      const { x, y } = el.getBoundingClientRect();
                      return { x, y };
                    }, selector);

                    await page
                      .waitForXPath(cps.getCanvas(6), {
                        visible: true,
                        timeout: 4000,
                      })
                      .then(async () => {
                        logger.info(`${canvasName} graph visible properly`);
                        const cor = coordinates[5];
                        await page.mouse.click(
                          position.x + cor.x,
                          position.y + cor.y,
                          {
                            button: "left",
                          }
                        );
                        await navigationPromise;
                        await page.waitForTimeout(120000);
                        pageTitle = await page.title();

                        if (pageTitle != "Overview") {
                          await page
                            .waitForXPath(cps.garndTotalElement(3), {
                              visible: true,
                              timeout: 4000,
                            })
                            .then(async () => {
                              logger.info(
                                "grand total element display properly"
                              );
                              const el = await page.$x(
                                cps.garndTotalElement(3)
                              );
                              const actValue: string = await (
                                await el[0].getProperty("textContent")
                              ).jsonValue();

                              Number(actValue.replace(/[^0-9\.]+/g, "")) ==
                              values[j]
                                ? logger.info(
                                    `${canvasName} data validation success by database value ${
                                      values[j]
                                    } is matching with ui displayed value ${Number(
                                      actValue.replace(/[^0-9\.]+/g, "")
                                    )}`
                                  )
                                : [
                                    logger.error(
                                      `${canvasName} data validation failed by database value ${
                                        values[j]
                                      } is not matching with ui displayed value ${Number(
                                        actValue.replace(/[^0-9\.]+/g, "")
                                      )}`
                                    ),
                                    errors.push(
                                      `${canvasName} data validation failed by database value ${
                                        values[j]
                                      } is not matching with ui displayed value ${Number(
                                        actValue.replace(/[^0-9\.]+/g, "")
                                      )}`
                                    ),
                                  ];
                            })
                            .catch(() => {
                              logger.error(
                                "grand total element not display properly"
                              );
                              errors.push(
                                "grand total element not display properly"
                              );
                            });
                          await page.goBack();
                          await navigationPromise;
                          await page.waitForTimeout(15000);
                        } else {
                          logger.warn(
                            "there is no data in the graph for drill down"
                          );
                        }
                      })
                      .catch(() => {
                        logger.error(
                          `${canvasName} graph not visible properly`
                        );
                        errors.push(`${canvasName} graph not visible properly`);
                      });
                  } else if (paytype == "F") {
                    const canvasSpan = await page.$x(cps.getCanvasName(7));
                    const canvasName: string = await (
                      await canvasSpan[0].getProperty("textContent")
                    ).jsonValue();
                    await page.waitForTimeout(2000);

                    const canvasElement = await page.$x(cps.getCanvas(7));
                    await page.waitForTimeout(2000);

                    await page.evaluate((element) => {
                      element.scrollIntoView(
                        0,
                        parseInt(element.getBoundingClientRect().y)
                      );
                    }, canvasElement[0]);

                    const selector = await page.waitForXPath(cps.getCanvas(7));
                    const position = await page.evaluate((el) => {
                      const { x, y } = el.getBoundingClientRect();
                      return { x, y };
                    }, selector);

                    await page
                      .waitForXPath(cps.getCanvas(7), {
                        visible: true,
                        timeout: 4000,
                      })
                      .then(async () => {
                        logger.info(`${canvasName} graph visible properly`);
                        const cor = coordinates[6];
                        await page.mouse.click(
                          position.x + cor.x,
                          position.y + cor.y,
                          {
                            button: "left",
                          }
                        );
                        await navigationPromise;
                        await page.waitForTimeout(120000);
                        pageTitle = await page.title();

                        if (pageTitle != "Overview") {
                          await page
                            .waitForXPath(cps.garndTotalElement(3), {
                              visible: true,
                              timeout: 4000,
                            })
                            .then(async () => {
                              logger.info(
                                "grand total element display properly"
                              );
                              const el = await page.$x(
                                cps.garndTotalElement(3)
                              );
                              const actValue: string = await (
                                await el[0].getProperty("textContent")
                              ).jsonValue();

                              Number(actValue.replace(/\,/g, "")) ==
                              valData[0].cpsoldhours
                                ? logger.info(
                                    `${canvasName} data validation success by database value ${
                                      values[j]
                                    } is matching with ui displayed value ${Number(
                                      actValue.replace(/\,/g, "")
                                    )}`
                                  )
                                : [
                                    logger.error(
                                      `${canvasName} data validation failed by database value ${
                                        values[j]
                                      } is not matching with ui displayed value ${Number(
                                        actValue.replace(/\,/g, "")
                                      )}`
                                    ),
                                    errors.push(
                                      `${canvasName} data validation failed by database value ${
                                        values[j]
                                      } is not matching with ui displayed value ${Number(
                                        actValue.replace(/\,/g, "")
                                      )}`
                                    ),
                                  ];
                            })
                            .catch(() => {
                              logger.error(
                                "grand total element not display properly"
                              );
                              errors.push(
                                "grand total element not display properly"
                              );
                            });
                          await page.goBack();
                          await navigationPromise;
                          await page.waitForTimeout(15000);
                        } else {
                          logger.warn(
                            "there is no data in the graph for drill down"
                          );
                        }
                      })
                      .catch(() => {
                        logger.error(
                          `${canvasName} graph not visible properly`
                        );
                        errors.push(`${canvasName} graph not visible properly`);
                      });
                  } else {
                    logger.warn("please pass relevant pay type for validation");
                  }
                }
              } else {
                logger.error(`view detail button navigation failed`);
                errors.push(`view detail button navigation failed`);
              }
            })
            .catch(() => {
              logger.error("view detail button not visible properly");
              errors.push("view detail button not visible properly");
            });
          await page.goBack();
          await navigationPromise;
          await page.waitForTimeout(25000);
        }
      }
    } else {
      logger.error("store and title of the page verification failed");
      errors.push("store and title of the page verification failed");
    }
    ts.assert(
      errors.length == 0,
      `Error in CP Summary Page Validation: ${errors.join("\n")}`
    );
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsSummaryOverviewValidationTest();
