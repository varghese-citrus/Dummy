import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { fixedopsCommonLogin } from "../testcases/common/fixedops-common-login.ts";
import { getStore } from "./stores/first-team-stores.ts";
import { partsoverviewSelectors as po } from "../selectors/parts-overview.ts";
import { startLogger, getData } from "../utilities/utils.ts";

const logger = startLogger();
const errors: string[] = [];
const valData = await getData("Overview").then((e) => {
  return e;
});

function fixedOpsPartsOverviewValidationTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[AEC-FOCP-UI-FN-LD-0001] ${site.name} FixedOps Parts Overview Data Validation Test`,
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
          await partsOverviewValidationTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Parts Overview Data Validation Test";
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

async function partsOverviewValidationTest(baseURL: string) {
  let browser = null;

  try {
    const oBrowser = await fixedopsCommonLogin(baseURL);
    const page = oBrowser.page;
    browser = oBrowser.browser;
    const navigationPromise = oBrowser.navigationPromise;
    await navigationPromise;
    const pMenu = await page.$x(po.partsMenuBtn);
    await pMenu[0].click();
    await page.waitForTimeout(4000);
    logger.info("parts menu clicked!!");
    const pOverview = await page.$x(po.partsOverviewBtn);
    await pOverview[0].click();
    logger.info("parts overview!!!");
    await navigationPromise;
    await page.waitForTimeout(12000);
    const title = await page.title();
    const storeId = valData[0].storeid;
    const store = Deno.env.get("STORE");
    const storeDetail = getStore(storeId);
    const ids = [
      po.viewDetailBtn1,
      po.viewDetailBtn2,
      po.viewDetailBtn3,
      po.viewDetailBtn4,
      po.viewDetailBtn5,
      po.viewDetailBtn6,
      po.viewDetailBtn7,
      po.viewDetailBtn8,
      po.viewDetailBtn9,
    ];
    if (
      storeDetail[0].name.toString() == store?.toString() &&
      title == "CP Parts Overview"
    ) {
      logger.info("store and title of the page verification success");

      if (valData[0].advisor == "(All)" || valData[0].advisor == "All") {
        for (let j = 0; j <= ids.length - 1; j++) {
          const chartNameXpath = await page.$x(po.canvasName(j + 1));
          const chartName = await (
            await chartNameXpath[0].getProperty("textContent")
          ).jsonValue();

          if (
            chartName == "CP Parts Gross Profit Percentage" ||
            chartName == "CP Parts Markup - Repair and Competitive"
          ) {
            logger.warn(`${chartName} is a line chart,ignoring validation!`);
          } else {
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
                    { x: 410, y: 147 },
                    { x: 410, y: 147 },
                  ];

                  for (const dt of valData) {
                    const values = [
                      dt.partssale,
                      dt.partsGP,
                      dt.partsgppercentage,
                      dt.partsrevenueperro,
                      dt.partsmarkup,
                      dt.rocount,
                      dt.hpropartsonly,
                      dt.ropartsonly,
                    ];

                    const paytype = dt.paytype;
                    if (paytype == "All") {
                      const canvasSpan = await page.$x(po.getCanvasName(1));
                      const canvasName: string = await (
                        await canvasSpan[0].getProperty("textContent")
                      ).jsonValue();
                      await page.waitForTimeout(2000);
                      const chartIdXpath = await page.$x(po.canvasId(1));
                      const chartId = await (
                        await chartIdXpath[0].getProperty("textContent")
                      ).jsonValue();
                      const canvasElement = await page.$x(po.getCanvas(1));
                      await page.waitForTimeout(2000);
                      await page.evaluate((element) => {
                        element.scrollIntoView(
                          0,
                          parseInt(element.getBoundingClientRect().y)
                        );
                      }, canvasElement[0]);
                      const selector = await page.waitForXPath(po.getCanvas(1));
                      const position = await page.evaluate((el) => {
                        const { x, y } = el.getBoundingClientRect();
                        return { x, y };
                      }, selector);

                      await page
                        .waitForXPath(po.getCanvas(1), {
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
                          await page.waitForTimeout(40000);
                          pageTitle = await page.title();
                          if (pageTitle != "Overview") {
                            switch (Number(chartId)) {
                              case 1028: {
                                await page
                                  .waitForXPath(po.garndTotalElement(3), {
                                    visible: true,
                                    timeout: 4000,
                                  })
                                  .then(async () => {
                                    logger.info(
                                      "grand total element display properly"
                                    );
                                    const el = await page.$x(
                                      po.garndTotalElement(3)
                                    );
                                    const actValue: string = await (
                                      await el[0].getProperty("textContent")
                                    ).jsonValue();

                                    Number(
                                      actValue.replace(/[^0-9\.]+/g, "")
                                    ) == values[j]
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
                              case 1218: {
                                await page
                                  .waitForXPath(po.garndTotalElement(3), {
                                    visible: true,
                                    timeout: 4000,
                                  })
                                  .then(async () => {
                                    logger.info(
                                      "grand total element display properly"
                                    );
                                    const el = await page.$x(
                                      po.garndTotalElement(3)
                                    );
                                    const actValue: string = await (
                                      await el[0].getProperty("textContent")
                                    ).jsonValue();

                                    Number(
                                      actValue.replace(/[^0-9\.]+/g, "")
                                    ) == values[j]
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
                              case 1225: {
                                await page
                                  .waitForXPath(po.garndTotalElement(3), {
                                    visible: true,
                                    timeout: 4000,
                                  })
                                  .then(async () => {
                                    logger.info(
                                      "grand total element display properly"
                                    );
                                    const el = await page.$x(
                                      po.garndTotalElement(3)
                                    );
                                    const actValue: string = await (
                                      await el[0].getProperty("textContent")
                                    ).jsonValue();

                                    Number(
                                      actValue.replace(/[^0-9\.]+/g, "")
                                    ) == values[j]
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
                              case 1319: {
                                await page
                                  .waitForXPath(po.garndTotalElement(3), {
                                    visible: true,
                                    timeout: 4000,
                                  })
                                  .then(async () => {
                                    logger.info(
                                      "grand total element display properly"
                                    );
                                    const el = await page.$x(
                                      po.garndTotalElement(3)
                                    );
                                    const actValue: string = await (
                                      await el[0].getProperty("textContent")
                                    ).jsonValue();

                                    Number(
                                      actValue.replace(/[^0-9\.]+/g, "")
                                    ) == values[j]
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
                                  .waitForXPath(po.garndTotalElement(1), {
                                    visible: true,
                                    timeout: 4000,
                                  })
                                  .then(async () => {
                                    logger.info(
                                      "grand total element display properly"
                                    );
                                    const el = await page.$x(
                                      po.garndTotalElement(1)
                                    );
                                    const actValue: string = await (
                                      await el[0].getProperty("textContent")
                                    ).jsonValue();

                                    Number(
                                      actValue.replace(/[^0-9\.]+/g, "")
                                    ) == values[j]
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
                            await page.waitForTimeout(25000);
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
                          errors.push(
                            `${canvasName} graph not visible properly`
                          );
                        });
                    } else if (paytype == "C") {
                      const canvasSpan = await page.$x(po.getCanvasName(2));
                      const canvasName: string = await (
                        await canvasSpan[0].getProperty("textContent")
                      ).jsonValue();
                      await page.waitForTimeout(2000);
                      const chartIdXpath = await page.$x(po.canvasId(2));
                      const chartId = await (
                        await chartIdXpath[0].getProperty("textContent")
                      ).jsonValue();
                      const canvasElement = await page.$x(po.getCanvas(2));
                      await page.waitForTimeout(2000);

                      await page.evaluate((element) => {
                        element.scrollIntoView(
                          0,
                          parseInt(element.getBoundingClientRect().y)
                        );
                      }, canvasElement[0]);

                      const selector = await page.waitForXPath(po.getCanvas(2));
                      const position = await page.evaluate((el) => {
                        const { x, y } = el.getBoundingClientRect();
                        return { x, y };
                      }, selector);

                      await page
                        .waitForXPath(po.getCanvas(2), {
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
                          await page.waitForTimeout(40000);
                          pageTitle = await page.title();
                          if (pageTitle != "Overview") {
                            switch (Number(chartId)) {
                              case 1002: {
                                await page
                                  .waitForXPath(po.garndTotalElement(2), {
                                    visible: true,
                                    timeout: 4000,
                                  })
                                  .then(async () => {
                                    logger.info(
                                      "grand total element display properly"
                                    );
                                    const el = await page.$x(
                                      po.garndTotalElement(2)
                                    );
                                    const actValue: string = await (
                                      await el[0].getProperty("textContent")
                                    ).jsonValue();

                                    Number(
                                      actValue.replace(/[^0-9\.]+/g, "")
                                    ) == values[j]
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
                              case 1219: {
                                await page
                                  .waitForXPath(po.garndTotalElement(4), {
                                    visible: true,
                                    timeout: 4000,
                                  })
                                  .then(async () => {
                                    logger.info(
                                      "grand total element display properly"
                                    );
                                    const el = await page.$x(
                                      po.garndTotalElement(4)
                                    );
                                    const actValue: string = await (
                                      await el[0].getProperty("textContent")
                                    ).jsonValue();

                                    Number(
                                      actValue.replace(/[^0-9\.]+/g, "")
                                    ) == values[j]
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
                              case 1226: {
                                await page
                                  .waitForXPath(po.garndTotalElement(4), {
                                    visible: true,
                                    timeout: 4000,
                                  })
                                  .then(async () => {
                                    logger.info(
                                      "grand total element display properly"
                                    );
                                    const el = await page.$x(
                                      po.garndTotalElement(4)
                                    );
                                    const actValue: string = await (
                                      await el[0].getProperty("textContent")
                                    ).jsonValue();

                                    Number(
                                      actValue.replace(/[^0-9\.]+/g, "")
                                    ) == values[j]
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
                              case 1145: {
                                await page
                                  .waitForXPath(po.garndTotalElement(1), {
                                    visible: true,
                                    timeout: 4000,
                                  })
                                  .then(async () => {
                                    logger.info(
                                      "grand total element display properly"
                                    );
                                    const el = await page.$x(
                                      po.garndTotalElement(1)
                                    );
                                    const actValue: string = await (
                                      await el[0].getProperty("textContent")
                                    ).jsonValue();

                                    Number(
                                      actValue.replace(/[^0-9\.]+/g, "")
                                    ) == values[j]
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
                              case 1328: {
                                await page
                                  .waitForXPath(po.garndTotalElement(1), {
                                    visible: true,
                                    timeout: 4000,
                                  })
                                  .then(async () => {
                                    logger.info(
                                      "grand total element display properly"
                                    );
                                    const el = await page.$x(
                                      po.garndTotalElement(1)
                                    );
                                    const actValue: string = await (
                                      await el[0].getProperty("textContent")
                                    ).jsonValue();

                                    Number(
                                      actValue.replace(/[^0-9\.]+/g, "")
                                    ) == values[j]
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
                                  .waitForXPath(po.garndTotalElement(3), {
                                    visible: true,
                                    timeout: 4000,
                                  })
                                  .then(async () => {
                                    logger.info(
                                      "grand total element display properly"
                                    );
                                    const el = await page.$x(
                                      po.garndTotalElement(3)
                                    );
                                    const actValue: string = await (
                                      await el[0].getProperty("textContent")
                                    ).jsonValue();

                                    Number(
                                      actValue.replace(/[^0-9\.]+/g, "")
                                    ) == values[j]
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
                            await page.waitForTimeout(25000);
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
                          errors.push(
                            `${canvasName} graph not visible properly`
                          );
                        });
                    } else if (paytype == "W") {
                      const canvasSpan = await page.$x(po.getCanvasName(3));
                      const canvasName: string = await (
                        await canvasSpan[0].getProperty("textContent")
                      ).jsonValue();
                      await page.waitForTimeout(2000);
                      const chartIdXpath = await page.$x(po.canvasId(3));
                      const chartId = await (
                        await chartIdXpath[0].getProperty("textContent")
                      ).jsonValue();
                      const canvasElement = await page.$x(po.getCanvas(3));
                      await page.waitForTimeout(2000);

                      await page.evaluate((element) => {
                        element.scrollIntoView(
                          0,
                          parseInt(element.getBoundingClientRect().y)
                        );
                      }, canvasElement[0]);

                      const selector = await page.waitForXPath(po.getCanvas(3));
                      const position = await page.evaluate((el) => {
                        const { x, y } = el.getBoundingClientRect();
                        return { x, y };
                      }, selector);

                      await page
                        .waitForXPath(po.getCanvas(3), {
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
                          await page.waitForTimeout(40000);
                          pageTitle = await page.title();

                          if (pageTitle != "Overview") {
                            switch (Number(chartId)) {
                              case 457: {
                                await page
                                  .waitForXPath(po.garndTotalElement(1), {
                                    visible: true,
                                    timeout: 4000,
                                  })
                                  .then(async () => {
                                    logger.info(
                                      "grand total element display properly"
                                    );
                                    const el = await page.$x(
                                      po.garndTotalElement(1)
                                    );
                                    const actValue: string = await (
                                      await el[0].getProperty("textContent")
                                    ).jsonValue();

                                    Number(
                                      actValue.replace(/[^0-9\.]+/g, "")
                                    ) == values[j]
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
                              case 1146: {
                                await page
                                  .waitForXPath(po.garndTotalElement(1), {
                                    visible: true,
                                    timeout: 4000,
                                  })
                                  .then(async () => {
                                    logger.info(
                                      "grand total element display properly"
                                    );
                                    const el = await page.$x(
                                      po.garndTotalElement(1)
                                    );
                                    const actValue: string = await (
                                      await el[0].getProperty("textContent")
                                    ).jsonValue();

                                    Number(
                                      actValue.replace(/[^0-9\.]+/g, "")
                                    ) == values[j]
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
                              case 1329: {
                                await page
                                  .waitForXPath(po.garndTotalElement(1), {
                                    visible: true,
                                    timeout: 4000,
                                  })
                                  .then(async () => {
                                    logger.info(
                                      "grand total element display properly"
                                    );
                                    const el = await page.$x(
                                      po.garndTotalElement(1)
                                    );
                                    const actValue: string = await (
                                      await el[0].getProperty("textContent")
                                    ).jsonValue();

                                    Number(
                                      actValue.replace(/[^0-9\.]+/g, "")
                                    ) == values[j]
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
                                  .waitForXPath(po.garndTotalElement(3), {
                                    visible: true,
                                    timeout: 4000,
                                  })
                                  .then(async () => {
                                    logger.info(
                                      "grand total element display properly"
                                    );
                                    const el = await page.$x(
                                      po.garndTotalElement(3)
                                    );
                                    const actValue: string = await (
                                      await el[0].getProperty("textContent")
                                    ).jsonValue();

                                    Number(
                                      actValue.replace(/[^0-9\.]+/g, "")
                                    ) == values[j]
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
                            await page.waitForTimeout(25000);
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
                          errors.push(
                            `${canvasName} graph not visible properly`
                          );
                        });
                    } else if (paytype == "I") {
                      const canvasSpan = await page.$x(po.getCanvasName(4));
                      const canvasName: string = await (
                        await canvasSpan[0].getProperty("textContent")
                      ).jsonValue();
                      await page.waitForTimeout(2000);
                      const chartIdXpath = await page.$x(po.canvasId(4));
                      const chartId = await (
                        await chartIdXpath[0].getProperty("textContent")
                      ).jsonValue();
                      const canvasElement = await page.$x(po.getCanvas(4));
                      await page.waitForTimeout(2000);

                      await page.evaluate((element) => {
                        element.scrollIntoView(
                          0,
                          parseInt(element.getBoundingClientRect().y)
                        );
                      }, canvasElement[0]);

                      const selector = await page.waitForXPath(po.getCanvas(4));
                      const position = await page.evaluate((el) => {
                        const { x, y } = el.getBoundingClientRect();
                        return { x, y };
                      }, selector);

                      await page
                        .waitForXPath(po.getCanvas(4), {
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
                          await page.waitForTimeout(40000);
                          pageTitle = await page.title();
                          if (pageTitle != "Overview") {
                            switch (Number(chartId)) {
                              case 456: {
                                await page
                                  .waitForXPath(po.garndTotalElement(1), {
                                    visible: true,
                                    timeout: 4000,
                                  })
                                  .then(async () => {
                                    logger.info(
                                      "grand total element display properly"
                                    );
                                    const el = await page.$x(
                                      po.garndTotalElement(1)
                                    );
                                    const actValue: string = await (
                                      await el[0].getProperty("textContent")
                                    ).jsonValue();

                                    Number(
                                      actValue.replace(/[^0-9\.]+/g, "")
                                    ) == values[j]
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
                              case 1147: {
                                await page
                                  .waitForXPath(po.garndTotalElement(1), {
                                    visible: true,
                                    timeout: 4000,
                                  })
                                  .then(async () => {
                                    logger.info(
                                      "grand total element display properly"
                                    );
                                    const el = await page.$x(
                                      po.garndTotalElement(1)
                                    );
                                    const actValue: string = await (
                                      await el[0].getProperty("textContent")
                                    ).jsonValue();

                                    Number(
                                      actValue.replace(/[^0-9\.]+/g, "")
                                    ) == values[j]
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
                              case 1330: {
                                await page
                                  .waitForXPath(po.garndTotalElement(1), {
                                    visible: true,
                                    timeout: 4000,
                                  })
                                  .then(async () => {
                                    logger.info(
                                      "grand total element display properly"
                                    );
                                    const el = await page.$x(
                                      po.garndTotalElement(1)
                                    );
                                    const actValue: string = await (
                                      await el[0].getProperty("textContent")
                                    ).jsonValue();

                                    Number(
                                      actValue.replace(/[^0-9\.]+/g, "")
                                    ) == values[j]
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
                                  .waitForXPath(po.garndTotalElement(3), {
                                    visible: true,
                                    timeout: 4000,
                                  })
                                  .then(async () => {
                                    logger.info(
                                      "grand total element display properly"
                                    );
                                    const el = await page.$x(
                                      po.garndTotalElement(3)
                                    );
                                    const actValue: string = await (
                                      await el[0].getProperty("textContent")
                                    ).jsonValue();

                                    Number(
                                      actValue.replace(/[^0-9\.]+/g, "")
                                    ) == values[j]
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
                            await page.waitForTimeout(25000);
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
                          errors.push(
                            `${canvasName} graph not visible properly`
                          );
                        });
                    } else if (paytype == "M") {
                      const canvasSpan = await page.$x(po.getCanvasName(5));
                      const canvasName: string = await (
                        await canvasSpan[0].getProperty("textContent")
                      ).jsonValue();
                      await page.waitForTimeout(2000);
                      //const chartIdXpath = await page.$x(ls.canvasId(5));
                      // const chartId = await (
                      //   await chartIdXpath[0].getProperty("textContent")
                      // ).jsonValue();
                      const canvasElement = await page.$x(po.getCanvas(5));
                      await page.waitForTimeout(2000);

                      await page.evaluate((element) => {
                        element.scrollIntoView(
                          0,
                          parseInt(element.getBoundingClientRect().y)
                        );
                      }, canvasElement[0]);

                      const selector = await page.waitForXPath(po.getCanvas(5));
                      const position = await page.evaluate((el) => {
                        const { x, y } = el.getBoundingClientRect();
                        return { x, y };
                      }, selector);

                      await page
                        .waitForXPath(po.getCanvas(5), {
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
                          await page.waitForTimeout(40000);
                          pageTitle = await page.title();
                          if (pageTitle != "Overview") {
                            await page
                              .waitForXPath(po.garndTotalElement(3), {
                                visible: true,
                                timeout: 4000,
                              })
                              .then(async () => {
                                logger.info(
                                  "grand total element display properly"
                                );
                                const el = await page.$x(
                                  po.garndTotalElement(3)
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
                            await page.waitForTimeout(25000);
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
                          errors.push(
                            `${canvasName} graph not visible properly`
                          );
                        });
                    } else if (paytype == "E") {
                      const canvasSpan = await page.$x(po.getCanvasName(6));
                      const canvasName: string = await (
                        await canvasSpan[0].getProperty("textContent")
                      ).jsonValue();
                      await page.waitForTimeout(2000);
                      // const chartIdXpath = await page.$x(ls.canvasId(6));
                      // const chartId = await (
                      //   await chartIdXpath[0].getProperty("textContent")
                      // ).jsonValue();
                      const canvasElement = await page.$x(po.getCanvas(6));
                      await page.waitForTimeout(2000);
                      await page.evaluate((element) => {
                        element.scrollIntoView(
                          0,
                          parseInt(element.getBoundingClientRect().y)
                        );
                      }, canvasElement[0]);
                      const selector = await page.waitForXPath(po.getCanvas(6));
                      const position = await page.evaluate((el) => {
                        const { x, y } = el.getBoundingClientRect();
                        return { x, y };
                      }, selector);
                      await page
                        .waitForXPath(po.getCanvas(6), {
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
                          await page.waitForTimeout(40000);
                          pageTitle = await page.title();

                          if (pageTitle != "Overview") {
                            await page
                              .waitForXPath(po.garndTotalElement(3), {
                                visible: true,
                                timeout: 4000,
                              })
                              .then(async () => {
                                logger.info(
                                  "grand total element display properly"
                                );
                                const el = await page.$x(
                                  po.garndTotalElement(3)
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
                            await page.waitForTimeout(25000);
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
                          errors.push(
                            `${canvasName} graph not visible properly`
                          );
                        });
                    } else if (paytype == "F") {
                      const canvasSpan = await page.$x(po.getCanvasName(7));
                      const canvasName: string = await (
                        await canvasSpan[0].getProperty("textContent")
                      ).jsonValue();
                      await page.waitForTimeout(2000);
                      //const chartIdXpath = await page.$x(ls.canvasId(7));
                      // const chartId = await (
                      //   await chartIdXpath[0].getProperty("textContent")
                      // ).jsonValue();
                      const canvasElement = await page.$x(po.getCanvas(7));
                      await page.waitForTimeout(2000);

                      await page.evaluate((element) => {
                        element.scrollIntoView(
                          0,
                          parseInt(element.getBoundingClientRect().y)
                        );
                      }, canvasElement[0]);

                      const selector = await page.waitForXPath(po.getCanvas(7));
                      const position = await page.evaluate((el) => {
                        const { x, y } = el.getBoundingClientRect();
                        return { x, y };
                      }, selector);

                      await page
                        .waitForXPath(po.getCanvas(7), {
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
                          await page.waitForTimeout(40000);
                          pageTitle = await page.title();

                          if (pageTitle != "Overview") {
                            await page
                              .waitForXPath(po.garndTotalElement(3), {
                                visible: true,
                                timeout: 4000,
                              })
                              .then(async () => {
                                logger.info(
                                  "grand total element display properly"
                                );
                                const el = await page.$x(
                                  po.garndTotalElement(3)
                                );
                                const actValue: string = await (
                                  await el[0].getProperty("textContent")
                                ).jsonValue();

                                Number(actValue.replace(/\,/g, "")) ==
                                valData[0].lsoldhours
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
                            await page.waitForTimeout(25000);
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
                          errors.push(
                            `${canvasName} graph not visible properly`
                          );
                        });
                    } else {
                      logger.warn(
                        "please pass relevant pay type for validation"
                      );
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
        const advisor = await page.$x(po.advisor);
        await advisor[0].click();
        await page.waitForTimeout(5000);
        const linkTexts = await page.$$eval(po.advisorSpan, (elements) =>
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
        const checkBox = await page.$x(po.checkBox(Number(adv) + 1));
        await checkBox[0].click();
        await page.waitForTimeout(4000);
        const filterBtn = await page.$x(po.filterBtn);
        await filterBtn[0].click();
        await page.waitForTimeout(10000);

        for (let j = 0; j <= ids.length - 1; j++) {
          const chartNameXpath = await page.$x(po.canvasName(j + 1));
          const chartName = await (
            await chartNameXpath[0].getProperty("textContent")
          ).jsonValue();

          if (
            chartName == "CP Parts Gross Profit Percentage" ||
            chartName == "CP Parts Markup - Repair and Competitive"
          ) {
            logger.warn(`${chartName} is a line chart,ignoring validation!`);
          } else {
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
                    { x: 410, y: 147 },
                    { x: 410, y: 147 },
                  ];

                  for (const dt of valData) {
                    const values = [
                      dt.partssale,
                      dt.partsGP,
                      dt.partsgppercentage,
                      dt.partsrevenueperro,
                      dt.partsmarkup,
                      dt.rocount,
                      dt.hpropartsonly,
                      dt.ropartsonly,
                    ];

                    const paytype = dt.paytype;
                    if (paytype == "All") {
                      const canvasSpan = await page.$x(po.getCanvasName(1));
                      const canvasName: string = await (
                        await canvasSpan[0].getProperty("textContent")
                      ).jsonValue();
                      await page.waitForTimeout(2000);
                      const chartIdXpath = await page.$x(po.canvasId(1));
                      const chartId = await (
                        await chartIdXpath[0].getProperty("textContent")
                      ).jsonValue();
                      const canvasElement = await page.$x(po.getCanvas(1));
                      await page.waitForTimeout(2000);
                      await page.evaluate((element) => {
                        element.scrollIntoView(
                          0,
                          parseInt(element.getBoundingClientRect().y)
                        );
                      }, canvasElement[0]);
                      const selector = await page.waitForXPath(po.getCanvas(1));
                      const position = await page.evaluate((el) => {
                        const { x, y } = el.getBoundingClientRect();
                        return { x, y };
                      }, selector);

                      await page
                        .waitForXPath(po.getCanvas(1), {
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
                          await page.waitForTimeout(40000);
                          pageTitle = await page.title();
                          if (pageTitle != "Overview") {
                            switch (Number(chartId)) {
                              case 1028: {
                                await page
                                  .waitForXPath(po.garndTotalElement(3), {
                                    visible: true,
                                    timeout: 4000,
                                  })
                                  .then(async () => {
                                    logger.info(
                                      "grand total element display properly"
                                    );
                                    const el = await page.$x(
                                      po.garndTotalElement(3)
                                    );
                                    const actValue: string = await (
                                      await el[0].getProperty("textContent")
                                    ).jsonValue();

                                    Number(
                                      actValue.replace(/[^0-9\.]+/g, "")
                                    ) == values[j]
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
                              case 1218: {
                                await page
                                  .waitForXPath(po.garndTotalElement(3), {
                                    visible: true,
                                    timeout: 4000,
                                  })
                                  .then(async () => {
                                    logger.info(
                                      "grand total element display properly"
                                    );
                                    const el = await page.$x(
                                      po.garndTotalElement(3)
                                    );
                                    const actValue: string = await (
                                      await el[0].getProperty("textContent")
                                    ).jsonValue();

                                    Number(
                                      actValue.replace(/[^0-9\.]+/g, "")
                                    ) == values[j]
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
                              case 1225: {
                                await page
                                  .waitForXPath(po.garndTotalElement(3), {
                                    visible: true,
                                    timeout: 4000,
                                  })
                                  .then(async () => {
                                    logger.info(
                                      "grand total element display properly"
                                    );
                                    const el = await page.$x(
                                      po.garndTotalElement(3)
                                    );
                                    const actValue: string = await (
                                      await el[0].getProperty("textContent")
                                    ).jsonValue();

                                    Number(
                                      actValue.replace(/[^0-9\.]+/g, "")
                                    ) == values[j]
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
                              case 1319: {
                                await page
                                  .waitForXPath(po.garndTotalElement(3), {
                                    visible: true,
                                    timeout: 4000,
                                  })
                                  .then(async () => {
                                    logger.info(
                                      "grand total element display properly"
                                    );
                                    const el = await page.$x(
                                      po.garndTotalElement(3)
                                    );
                                    const actValue: string = await (
                                      await el[0].getProperty("textContent")
                                    ).jsonValue();

                                    Number(
                                      actValue.replace(/[^0-9\.]+/g, "")
                                    ) == values[j]
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
                                  .waitForXPath(po.garndTotalElement(1), {
                                    visible: true,
                                    timeout: 4000,
                                  })
                                  .then(async () => {
                                    logger.info(
                                      "grand total element display properly"
                                    );
                                    const el = await page.$x(
                                      po.garndTotalElement(1)
                                    );
                                    const actValue: string = await (
                                      await el[0].getProperty("textContent")
                                    ).jsonValue();

                                    Number(
                                      actValue.replace(/[^0-9\.]+/g, "")
                                    ) == values[j]
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
                            await page.waitForTimeout(25000);
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
                          errors.push(
                            `${canvasName} graph not visible properly`
                          );
                        });
                    } else if (paytype == "C") {
                      const canvasSpan = await page.$x(po.getCanvasName(2));
                      const canvasName: string = await (
                        await canvasSpan[0].getProperty("textContent")
                      ).jsonValue();
                      await page.waitForTimeout(2000);
                      const chartIdXpath = await page.$x(po.canvasId(2));
                      const chartId = await (
                        await chartIdXpath[0].getProperty("textContent")
                      ).jsonValue();
                      const canvasElement = await page.$x(po.getCanvas(2));
                      await page.waitForTimeout(2000);

                      await page.evaluate((element) => {
                        element.scrollIntoView(
                          0,
                          parseInt(element.getBoundingClientRect().y)
                        );
                      }, canvasElement[0]);

                      const selector = await page.waitForXPath(po.getCanvas(2));
                      const position = await page.evaluate((el) => {
                        const { x, y } = el.getBoundingClientRect();
                        return { x, y };
                      }, selector);

                      await page
                        .waitForXPath(po.getCanvas(2), {
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
                          await page.waitForTimeout(40000);
                          pageTitle = await page.title();
                          if (pageTitle != "Overview") {
                            switch (Number(chartId)) {
                              case 1002: {
                                await page
                                  .waitForXPath(po.garndTotalElement(2), {
                                    visible: true,
                                    timeout: 4000,
                                  })
                                  .then(async () => {
                                    logger.info(
                                      "grand total element display properly"
                                    );
                                    const el = await page.$x(
                                      po.garndTotalElement(2)
                                    );
                                    const actValue: string = await (
                                      await el[0].getProperty("textContent")
                                    ).jsonValue();

                                    Number(
                                      actValue.replace(/[^0-9\.]+/g, "")
                                    ) == values[j]
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
                              case 1219: {
                                await page
                                  .waitForXPath(po.garndTotalElement(4), {
                                    visible: true,
                                    timeout: 4000,
                                  })
                                  .then(async () => {
                                    logger.info(
                                      "grand total element display properly"
                                    );
                                    const el = await page.$x(
                                      po.garndTotalElement(4)
                                    );
                                    const actValue: string = await (
                                      await el[0].getProperty("textContent")
                                    ).jsonValue();

                                    Number(
                                      actValue.replace(/[^0-9\.]+/g, "")
                                    ) == values[j]
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
                              case 1226: {
                                await page
                                  .waitForXPath(po.garndTotalElement(4), {
                                    visible: true,
                                    timeout: 4000,
                                  })
                                  .then(async () => {
                                    logger.info(
                                      "grand total element display properly"
                                    );
                                    const el = await page.$x(
                                      po.garndTotalElement(4)
                                    );
                                    const actValue: string = await (
                                      await el[0].getProperty("textContent")
                                    ).jsonValue();

                                    Number(
                                      actValue.replace(/[^0-9\.]+/g, "")
                                    ) == values[j]
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
                              case 1145: {
                                await page
                                  .waitForXPath(po.garndTotalElement(1), {
                                    visible: true,
                                    timeout: 4000,
                                  })
                                  .then(async () => {
                                    logger.info(
                                      "grand total element display properly"
                                    );
                                    const el = await page.$x(
                                      po.garndTotalElement(1)
                                    );
                                    const actValue: string = await (
                                      await el[0].getProperty("textContent")
                                    ).jsonValue();

                                    Number(
                                      actValue.replace(/[^0-9\.]+/g, "")
                                    ) == values[j]
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
                              case 1328: {
                                await page
                                  .waitForXPath(po.garndTotalElement(1), {
                                    visible: true,
                                    timeout: 4000,
                                  })
                                  .then(async () => {
                                    logger.info(
                                      "grand total element display properly"
                                    );
                                    const el = await page.$x(
                                      po.garndTotalElement(1)
                                    );
                                    const actValue: string = await (
                                      await el[0].getProperty("textContent")
                                    ).jsonValue();

                                    Number(
                                      actValue.replace(/[^0-9\.]+/g, "")
                                    ) == values[j]
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
                                  .waitForXPath(po.garndTotalElement(3), {
                                    visible: true,
                                    timeout: 4000,
                                  })
                                  .then(async () => {
                                    logger.info(
                                      "grand total element display properly"
                                    );
                                    const el = await page.$x(
                                      po.garndTotalElement(3)
                                    );
                                    const actValue: string = await (
                                      await el[0].getProperty("textContent")
                                    ).jsonValue();

                                    Number(
                                      actValue.replace(/[^0-9\.]+/g, "")
                                    ) == values[j]
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
                            await page.waitForTimeout(25000);
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
                          errors.push(
                            `${canvasName} graph not visible properly`
                          );
                        });
                    } else if (paytype == "W") {
                      const canvasSpan = await page.$x(po.getCanvasName(3));
                      const canvasName: string = await (
                        await canvasSpan[0].getProperty("textContent")
                      ).jsonValue();
                      await page.waitForTimeout(2000);
                      const chartIdXpath = await page.$x(po.canvasId(3));
                      const chartId = await (
                        await chartIdXpath[0].getProperty("textContent")
                      ).jsonValue();
                      const canvasElement = await page.$x(po.getCanvas(3));
                      await page.waitForTimeout(2000);

                      await page.evaluate((element) => {
                        element.scrollIntoView(
                          0,
                          parseInt(element.getBoundingClientRect().y)
                        );
                      }, canvasElement[0]);

                      const selector = await page.waitForXPath(po.getCanvas(3));
                      const position = await page.evaluate((el) => {
                        const { x, y } = el.getBoundingClientRect();
                        return { x, y };
                      }, selector);

                      await page
                        .waitForXPath(po.getCanvas(3), {
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
                          await page.waitForTimeout(40000);
                          pageTitle = await page.title();

                          if (pageTitle != "Overview") {
                            switch (Number(chartId)) {
                              case 457: {
                                await page
                                  .waitForXPath(po.garndTotalElement(1), {
                                    visible: true,
                                    timeout: 4000,
                                  })
                                  .then(async () => {
                                    logger.info(
                                      "grand total element display properly"
                                    );
                                    const el = await page.$x(
                                      po.garndTotalElement(1)
                                    );
                                    const actValue: string = await (
                                      await el[0].getProperty("textContent")
                                    ).jsonValue();

                                    Number(
                                      actValue.replace(/[^0-9\.]+/g, "")
                                    ) == values[j]
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
                              case 1146: {
                                await page
                                  .waitForXPath(po.garndTotalElement(1), {
                                    visible: true,
                                    timeout: 4000,
                                  })
                                  .then(async () => {
                                    logger.info(
                                      "grand total element display properly"
                                    );
                                    const el = await page.$x(
                                      po.garndTotalElement(1)
                                    );
                                    const actValue: string = await (
                                      await el[0].getProperty("textContent")
                                    ).jsonValue();

                                    Number(
                                      actValue.replace(/[^0-9\.]+/g, "")
                                    ) == values[j]
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
                              case 1329: {
                                await page
                                  .waitForXPath(po.garndTotalElement(1), {
                                    visible: true,
                                    timeout: 4000,
                                  })
                                  .then(async () => {
                                    logger.info(
                                      "grand total element display properly"
                                    );
                                    const el = await page.$x(
                                      po.garndTotalElement(1)
                                    );
                                    const actValue: string = await (
                                      await el[0].getProperty("textContent")
                                    ).jsonValue();

                                    Number(
                                      actValue.replace(/[^0-9\.]+/g, "")
                                    ) == values[j]
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
                                  .waitForXPath(po.garndTotalElement(3), {
                                    visible: true,
                                    timeout: 4000,
                                  })
                                  .then(async () => {
                                    logger.info(
                                      "grand total element display properly"
                                    );
                                    const el = await page.$x(
                                      po.garndTotalElement(3)
                                    );
                                    const actValue: string = await (
                                      await el[0].getProperty("textContent")
                                    ).jsonValue();

                                    Number(
                                      actValue.replace(/[^0-9\.]+/g, "")
                                    ) == values[j]
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
                            await page.waitForTimeout(25000);
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
                          errors.push(
                            `${canvasName} graph not visible properly`
                          );
                        });
                    } else if (paytype == "I") {
                      const canvasSpan = await page.$x(po.getCanvasName(4));
                      const canvasName: string = await (
                        await canvasSpan[0].getProperty("textContent")
                      ).jsonValue();
                      await page.waitForTimeout(2000);
                      const chartIdXpath = await page.$x(po.canvasId(4));
                      const chartId = await (
                        await chartIdXpath[0].getProperty("textContent")
                      ).jsonValue();
                      const canvasElement = await page.$x(po.getCanvas(4));
                      await page.waitForTimeout(2000);

                      await page.evaluate((element) => {
                        element.scrollIntoView(
                          0,
                          parseInt(element.getBoundingClientRect().y)
                        );
                      }, canvasElement[0]);

                      const selector = await page.waitForXPath(po.getCanvas(4));
                      const position = await page.evaluate((el) => {
                        const { x, y } = el.getBoundingClientRect();
                        return { x, y };
                      }, selector);

                      await page
                        .waitForXPath(po.getCanvas(4), {
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
                          await page.waitForTimeout(40000);
                          pageTitle = await page.title();
                          if (pageTitle != "Overview") {
                            switch (Number(chartId)) {
                              case 456: {
                                await page
                                  .waitForXPath(po.garndTotalElement(1), {
                                    visible: true,
                                    timeout: 4000,
                                  })
                                  .then(async () => {
                                    logger.info(
                                      "grand total element display properly"
                                    );
                                    const el = await page.$x(
                                      po.garndTotalElement(1)
                                    );
                                    const actValue: string = await (
                                      await el[0].getProperty("textContent")
                                    ).jsonValue();

                                    Number(
                                      actValue.replace(/[^0-9\.]+/g, "")
                                    ) == values[j]
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
                              case 1147: {
                                await page
                                  .waitForXPath(po.garndTotalElement(1), {
                                    visible: true,
                                    timeout: 4000,
                                  })
                                  .then(async () => {
                                    logger.info(
                                      "grand total element display properly"
                                    );
                                    const el = await page.$x(
                                      po.garndTotalElement(1)
                                    );
                                    const actValue: string = await (
                                      await el[0].getProperty("textContent")
                                    ).jsonValue();

                                    Number(
                                      actValue.replace(/[^0-9\.]+/g, "")
                                    ) == values[j]
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
                              case 1330: {
                                await page
                                  .waitForXPath(po.garndTotalElement(1), {
                                    visible: true,
                                    timeout: 4000,
                                  })
                                  .then(async () => {
                                    logger.info(
                                      "grand total element display properly"
                                    );
                                    const el = await page.$x(
                                      po.garndTotalElement(1)
                                    );
                                    const actValue: string = await (
                                      await el[0].getProperty("textContent")
                                    ).jsonValue();

                                    Number(
                                      actValue.replace(/[^0-9\.]+/g, "")
                                    ) == values[j]
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
                                  .waitForXPath(po.garndTotalElement(3), {
                                    visible: true,
                                    timeout: 4000,
                                  })
                                  .then(async () => {
                                    logger.info(
                                      "grand total element display properly"
                                    );
                                    const el = await page.$x(
                                      po.garndTotalElement(3)
                                    );
                                    const actValue: string = await (
                                      await el[0].getProperty("textContent")
                                    ).jsonValue();

                                    Number(
                                      actValue.replace(/[^0-9\.]+/g, "")
                                    ) == values[j]
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
                            await page.waitForTimeout(25000);
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
                          errors.push(
                            `${canvasName} graph not visible properly`
                          );
                        });
                    } else if (paytype == "M") {
                      const canvasSpan = await page.$x(po.getCanvasName(5));
                      const canvasName: string = await (
                        await canvasSpan[0].getProperty("textContent")
                      ).jsonValue();
                      await page.waitForTimeout(2000);
                      //const chartIdXpath = await page.$x(ls.canvasId(5));
                      // const chartId = await (
                      //   await chartIdXpath[0].getProperty("textContent")
                      // ).jsonValue();
                      const canvasElement = await page.$x(po.getCanvas(5));
                      await page.waitForTimeout(2000);

                      await page.evaluate((element) => {
                        element.scrollIntoView(
                          0,
                          parseInt(element.getBoundingClientRect().y)
                        );
                      }, canvasElement[0]);

                      const selector = await page.waitForXPath(po.getCanvas(5));
                      const position = await page.evaluate((el) => {
                        const { x, y } = el.getBoundingClientRect();
                        return { x, y };
                      }, selector);

                      await page
                        .waitForXPath(po.getCanvas(5), {
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
                          await page.waitForTimeout(40000);
                          pageTitle = await page.title();
                          if (pageTitle != "Overview") {
                            await page
                              .waitForXPath(po.garndTotalElement(3), {
                                visible: true,
                                timeout: 4000,
                              })
                              .then(async () => {
                                logger.info(
                                  "grand total element display properly"
                                );
                                const el = await page.$x(
                                  po.garndTotalElement(3)
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
                            await page.waitForTimeout(25000);
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
                          errors.push(
                            `${canvasName} graph not visible properly`
                          );
                        });
                    } else if (paytype == "E") {
                      const canvasSpan = await page.$x(po.getCanvasName(6));
                      const canvasName: string = await (
                        await canvasSpan[0].getProperty("textContent")
                      ).jsonValue();
                      await page.waitForTimeout(2000);
                      // const chartIdXpath = await page.$x(ls.canvasId(6));
                      // const chartId = await (
                      //   await chartIdXpath[0].getProperty("textContent")
                      // ).jsonValue();
                      const canvasElement = await page.$x(po.getCanvas(6));
                      await page.waitForTimeout(2000);
                      await page.evaluate((element) => {
                        element.scrollIntoView(
                          0,
                          parseInt(element.getBoundingClientRect().y)
                        );
                      }, canvasElement[0]);
                      const selector = await page.waitForXPath(po.getCanvas(6));
                      const position = await page.evaluate((el) => {
                        const { x, y } = el.getBoundingClientRect();
                        return { x, y };
                      }, selector);
                      await page
                        .waitForXPath(po.getCanvas(6), {
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
                          await page.waitForTimeout(40000);
                          pageTitle = await page.title();

                          if (pageTitle != "Overview") {
                            await page
                              .waitForXPath(po.garndTotalElement(3), {
                                visible: true,
                                timeout: 4000,
                              })
                              .then(async () => {
                                logger.info(
                                  "grand total element display properly"
                                );
                                const el = await page.$x(
                                  po.garndTotalElement(3)
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
                            await page.waitForTimeout(25000);
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
                          errors.push(
                            `${canvasName} graph not visible properly`
                          );
                        });
                    } else if (paytype == "F") {
                      const canvasSpan = await page.$x(po.getCanvasName(7));
                      const canvasName: string = await (
                        await canvasSpan[0].getProperty("textContent")
                      ).jsonValue();
                      await page.waitForTimeout(2000);
                      //const chartIdXpath = await page.$x(ls.canvasId(7));
                      // const chartId = await (
                      //   await chartIdXpath[0].getProperty("textContent")
                      // ).jsonValue();
                      const canvasElement = await page.$x(po.getCanvas(7));
                      await page.waitForTimeout(2000);

                      await page.evaluate((element) => {
                        element.scrollIntoView(
                          0,
                          parseInt(element.getBoundingClientRect().y)
                        );
                      }, canvasElement[0]);

                      const selector = await page.waitForXPath(po.getCanvas(7));
                      const position = await page.evaluate((el) => {
                        const { x, y } = el.getBoundingClientRect();
                        return { x, y };
                      }, selector);

                      await page
                        .waitForXPath(po.getCanvas(7), {
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
                          await page.waitForTimeout(40000);
                          pageTitle = await page.title();

                          if (pageTitle != "Overview") {
                            await page
                              .waitForXPath(po.garndTotalElement(3), {
                                visible: true,
                                timeout: 4000,
                              })
                              .then(async () => {
                                logger.info(
                                  "grand total element display properly"
                                );
                                const el = await page.$x(
                                  po.garndTotalElement(3)
                                );
                                const actValue: string = await (
                                  await el[0].getProperty("textContent")
                                ).jsonValue();

                                Number(actValue.replace(/\,/g, "")) ==
                                valData[0].lsoldhours
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
                            await page.waitForTimeout(25000);
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
                          errors.push(
                            `${canvasName} graph not visible properly`
                          );
                        });
                    } else {
                      logger.warn(
                        "please pass relevant pay type for validation"
                      );
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
fixedOpsPartsOverviewValidationTest();
