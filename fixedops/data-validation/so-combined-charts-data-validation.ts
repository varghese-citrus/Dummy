import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { fixedopsCommonLogin } from "../testcases/common/fixedops-common-login.ts";
import { getStore } from "./stores/first-team-stores.ts";
import { CpSelectors as cps } from "../selectors/cp-overview.ts";
import { startLogger, getData } from "../utilities/utils.ts";

const logger = startLogger();
const errors: string[] = [];

const valData = await getData("SummaryOverview").then((e) => {
  return e;
});

function fixedOpsSummaryOverviewValidationTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[AEC-FOCP-DV-FN-LD-0001] ${site.name} FixedOps Cp Summary Overview Combined Charts Data Validation Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-DV-FN-LD-0001",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await summaryOverviewCombinedChartsValidationTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Cp Summary Overview Combined Charts Data Validation Test";
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

async function summaryOverviewCombinedChartsValidationTest(baseURL: string) {
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
    await page.waitForTimeout(15000);
    const title = await page.title();
    const storeId = valData[0].storeid;
    const store = Deno.env.get("STORE");
    const storeDetail = getStore(storeId);

    const ids = [cps.viewDetailBtn1, cps.viewDetailBtn2, cps.viewDetailBtn3];

    if (
      storeDetail[0].name.toString() == store?.toString() &&
      title == "CP Summary Overview"
    ) {
      logger.info("store and title of the page verification success");
      for (const dt of valData) {
        if (dt.advisor == "(All)" || dt.advisor == "All") {
          logger.info("default advisor selected is All");
          const payType = dt.paytype;
          if (payType == "C") {
            logger.info("pay type verification success");
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
                    ];
                    for (let i = 0; i <= coordinates.length - 1; i++) {
                      const canvasSpan = await page.$x(
                        cps.getCanvasName(i + 1)
                      );
                      const canvasName: string = await (
                        await canvasSpan[0].getProperty("textContent")
                      ).jsonValue();
                      await page.waitForTimeout(2000);

                      const canvasElement = await page.$x(cps.getCanvas(i + 1));
                      await page.waitForTimeout(2000);

                      await page.evaluate((element) => {
                        element.scrollIntoView(
                          0,
                          parseInt(element.getBoundingClientRect().y)
                        );
                      }, canvasElement[0]);
                      await page.waitForTimeout(5000);
                      const selector = await page.waitForXPath(
                        cps.getCanvas(i + 1)
                      );
                      const position = await page.evaluate((el) => {
                        const { x, y } = el.getBoundingClientRect();
                        return { x, y };
                      }, selector);
                      await page
                        .waitForXPath(cps.getCanvas(i + 1), {
                          visible: true,
                          timeout: 4000,
                        })
                        .then(async () => {
                          logger.info(`${canvasName} graph visible properly`);
                          const cor = coordinates[i];
                          await page.mouse.click(
                            position.x + cor.x,
                            position.y + cor.y,
                            {
                              button: "left",
                            }
                          );
                          await navigationPromise;
                          await page.waitForTimeout(80000);
                          pageTitle = await page.title();

                          if (pageTitle != "Overview") {
                            switch (canvasName) {
                              case "CP Revenue Combined": {
                                await page
                                  .waitForXPath(cps.garndTotalElement(6), {
                                    visible: true,
                                    timeout: 4000,
                                  })
                                  .then(async () => {
                                    logger.info(
                                      "grand total element display properly"
                                    );
                                    const el = await page.$x(
                                      cps.garndTotalElement(6)
                                    );
                                    const actValue: string = await (
                                      await el[0].getProperty("textContent")
                                    ).jsonValue();

                                    Number(
                                      actValue.split("$")[1].replace(/\,/g, "")
                                    ) == dt.combinedsale
                                      ? logger.info(
                                          `${canvasName} data validation success by database value ${
                                            dt.combinedsale
                                          } is matching with ui displayed value ${Number(
                                            actValue
                                              .split("$")[1]
                                              .replace(/\,/g, "")
                                          )}`
                                        )
                                      : [
                                          logger.error(
                                            `${canvasName} data validation failed by database value ${
                                              dt.combinedsale
                                            } is not matching with ui displayed value ${Number(
                                              actValue
                                                .split("$")[1]
                                                .replace(/\,/g, "")
                                            )}`
                                          ),
                                          errors.push(
                                            `${canvasName} data validation failed by database value ${
                                              dt.combinedsale
                                            } is not matching with ui displayed value ${Number(
                                              actValue
                                                .split("$")[1]
                                                .replace(/\,/g, "")
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
                              case "CP Labor Revenue": {
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

                                    Number(
                                      actValue.split("$")[1].replace(/\,/g, "")
                                    ) == dt.laborsale
                                      ? logger.info(
                                          `${canvasName} data validation success by database value ${
                                            dt.laborsale
                                          } is matching with ui displayed value ${Number(
                                            actValue
                                              .split("$")[1]
                                              .replace(/\,/g, "")
                                          )}`
                                        )
                                      : [
                                          logger.error(
                                            `${canvasName} data validation failed by database value ${
                                              dt.laborsale
                                            } is not matching with ui displayed value ${Number(
                                              actValue
                                                .split("$")[1]
                                                .replace(/\,/g, "")
                                            )}`
                                          ),
                                          errors.push(
                                            `${canvasName} data validation failed by database value ${
                                              dt.laborsale
                                            } is not matching with ui displayed value ${Number(
                                              actValue
                                                .split("$")[1]
                                                .replace(/\,/g, "")
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
                              case "CP Parts Revenue": {
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
                                    Number(
                                      actValue.split("$")[1].replace(/\,/g, "")
                                    ) == dt.partssale
                                      ? logger.info(
                                          `${canvasName} data validation success by database value ${
                                            dt.partssale
                                          } is matching with ui displayed value ${Number(
                                            actValue
                                              .split("$")[1]
                                              .replace(/\,/g, "")
                                          )}`
                                        )
                                      : [
                                          logger.error(
                                            `${canvasName} data validation failed by database value ${
                                              dt.partssale
                                            } is not matching with ui displayed value ${Number(
                                              actValue
                                                .split("$")[1]
                                                .replace(/\,/g, "")
                                            )}`
                                          ),
                                          errors.push(
                                            `${canvasName} data validation failed by database value ${
                                              dt.partssale
                                            } is not matching with ui displayed value ${Number(
                                              actValue
                                                .split("$")[1]
                                                .replace(/\,/g, "")
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
                              case "CP Combined Gross Profit": {
                                await page
                                  .waitForXPath(cps.garndTotalElement(8), {
                                    visible: true,
                                    timeout: 4000,
                                  })
                                  .then(async () => {
                                    logger.info(
                                      "grand total element display properly"
                                    );
                                    const el = await page.$x(
                                      cps.garndTotalElement(8)
                                    );
                                    const actValue: string = await (
                                      await el[0].getProperty("textContent")
                                    ).jsonValue();

                                    Number(
                                      actValue.split("$")[1].replace(/\,/g, "")
                                    ) == dt.cmbinedGP
                                      ? logger.info(
                                          `${canvasName} data validation success by database value ${
                                            dt.cmbinedGP
                                          } is matching with ui displayed value ${Number(
                                            actValue
                                              .split("$")[1]
                                              .replace(/\,/g, "")
                                          )}`
                                        )
                                      : [
                                          logger.error(
                                            `${canvasName} data validation failed by database value ${
                                              dt.cmbinedGP
                                            } is not matching with ui displayed value ${Number(
                                              actValue
                                                .split("$")[1]
                                                .replace(/\,/g, "")
                                            )}`
                                          ),
                                          errors.push(
                                            `${canvasName} data validation failed by database value ${
                                              dt.cmbinedGP
                                            } is not matching with ui displayed value ${Number(
                                              actValue
                                                .split("$")[1]
                                                .replace(/\,/g, "")
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
                              case "CP Labor Gross Profit": {
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

                                    Number(
                                      actValue.split("$")[1].replace(/\,/g, "")
                                    ) == dt.laborGP
                                      ? logger.info(
                                          `${canvasName} data validation success by database value ${
                                            dt.laborGP
                                          } is matching with ui displayed value ${Number(
                                            actValue
                                              .split("$")[1]
                                              .replace(/\,/g, "")
                                          )}`
                                        )
                                      : [
                                          logger.error(
                                            `${canvasName} data validation failed by database value ${
                                              dt.laborGP
                                            } is not matching with ui displayed value ${Number(
                                              actValue
                                                .split("$")[1]
                                                .replace(/\,/g, "")
                                            )}`
                                          ),
                                          errors.push(
                                            `${canvasName} data validation failed by database value ${
                                              dt.laborGP
                                            } is not matching with ui displayed value ${Number(
                                              actValue
                                                .split("$")[1]
                                                .replace(/\,/g, "")
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
                              case "CP Parts Gross Profit": {
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

                                    Number(
                                      actValue.split("$")[1].replace(/\,/g, "")
                                    ) == dt.partsGP
                                      ? logger.info(
                                          `${canvasName} data validation success by database value ${
                                            dt.partsGP
                                          } is matching with ui displayed value ${Number(
                                            actValue
                                              .split("$")[1]
                                              .replace(/\,/g, "")
                                          )}`
                                        )
                                      : [
                                          logger.error(
                                            `${canvasName} data validation failed by database value ${
                                              dt.partsGP
                                            } is not matching with ui displayed value ${Number(
                                              actValue
                                                .split("$")[1]
                                                .replace(/\,/g, "")
                                            )}`
                                          ),
                                          errors.push(
                                            `${canvasName} data validation failed by database value ${
                                              dt.partsGP
                                            } is not matching with ui displayed value ${Number(
                                              actValue
                                                .split("$")[1]
                                                .replace(/\,/g, "")
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
                              case "CP Combined Gross Profit Percentage": {
                                await page
                                  .waitForXPath(cps.garndTotalElement(8), {
                                    visible: true,
                                    timeout: 4000,
                                  })
                                  .then(async () => {
                                    logger.info(
                                      "grand total element display properly"
                                    );
                                    const el = await page.$x(
                                      cps.garndTotalElement(8)
                                    );
                                    const actValue: string = await (
                                      await el[0].getProperty("textContent")
                                    ).jsonValue();

                                    Number(actValue.replace("%", "")) ==
                                    dt.combinedgppercentage
                                      ? logger.info(
                                          `${canvasName} data validation success by database value ${
                                            dt.combinedgppercentage
                                          } is matching with ui displayed value ${Number(
                                            actValue.replace("%", "")
                                          )}`
                                        )
                                      : [
                                          logger.error(
                                            `${canvasName} data validation failed by database value ${
                                              dt.combinedgppercentage
                                            } is not matching with ui displayed value ${Number(
                                              actValue.replace("%", "")
                                            )}`
                                          ),
                                          errors.push(
                                            `${canvasName} data validation failed by database value ${
                                              dt.combinedgppercentage
                                            } is not matching with ui displayed value ${Number(
                                              actValue.replace("%", "")
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
                              case "CP Labor Gross Profit Percentage": {
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

                                    Number(actValue.replace("%", "")) ==
                                    dt.laborgppercentage
                                      ? logger.info(
                                          `${canvasName} data validation success by database value ${
                                            dt.laborgppercentage
                                          } is matching with ui displayed value ${Number(
                                            actValue.replace("%", "")
                                          )}`
                                        )
                                      : [
                                          logger.error(
                                            `${canvasName} data validation failed by database value ${
                                              dt.laborgppercentage
                                            } is not matching with ui displayed value ${Number(
                                              actValue.replace("%", "")
                                            )}`
                                          ),
                                          errors.push(
                                            `${canvasName} data validation failed by database value ${
                                              dt.laborgppercentage
                                            } is not matching with ui displayed value ${Number(
                                              actValue.replace("%", "")
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
                              case "CP Parts Gross Profit Percentage": {
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

                                    Number(actValue.replace("%", "")) ==
                                    dt.partsgppercentage
                                      ? logger.info(
                                          `${canvasName} data validation success by database value ${
                                            dt.partsgppercentage
                                          } is matching with ui displayed value ${Number(
                                            actValue.replace("%", "")
                                          )}`
                                        )
                                      : [
                                          logger.error(
                                            `${canvasName} data validation failed by database value ${
                                              dt.partsgppercentage
                                            } is not matching with ui displayed value ${Number(
                                              actValue.replace("%", "")
                                            )}`
                                          ),
                                          errors.push(
                                            `${canvasName} data validation failed by database value ${
                                              dt.partsgppercentage
                                            } is not matching with ui displayed value ${Number(
                                              actValue.replace("%", "")
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
                                null;
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
                          errors.push(
                            `${canvasName} graph not visible properly`
                          );
                        });
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
            logger.warn(
              `${dt.paytype} paytype is not applicable for combined chart data validation`
            );
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
            return el === dt.advisor;
          });
          const checkBox = await page.$x(cps.checkBox(Number(adv) + 1));
          await checkBox[0].click();
          await page.waitForTimeout(4000);
          const filterBtn = await page.$x(cps.filterBtn);
          await filterBtn[0].click();
          await page.waitForTimeout(10000);
          const payType = dt.paytype;
          if (payType == "C") {
            logger.info("pay type verification success");
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
                      { x: 405, y: 61 },
                    ];

                    for (let i = 0; i <= coordinates.length - 1; i++) {
                      const canvasSpan = await page.$x(
                        cps.getCanvasName(i + 1)
                      );
                      const canvasName: string = await (
                        await canvasSpan[0].getProperty("textContent")
                      ).jsonValue();
                      await page.waitForTimeout(2000);

                      const canvasElement = await page.$x(cps.getCanvas(i + 1));
                      await page.waitForTimeout(2000);

                      await page.evaluate((element) => {
                        element.scrollIntoView(
                          0,
                          parseInt(element.getBoundingClientRect().y)
                        );
                      }, canvasElement[0]);

                      const selector = await page.waitForXPath(
                        cps.getCanvas(i + 1)
                      );
                      const position = await page.evaluate((el) => {
                        const { x, y } = el.getBoundingClientRect();
                        return { x, y };
                      }, selector);

                      await page
                        .waitForXPath(cps.getCanvas(i + 1), {
                          visible: true,
                          timeout: 4000,
                        })
                        .then(async () => {
                          logger.info(`${canvasName} graph visible properly`);
                          const cor = coordinates[i];
                          await page.mouse.click(
                            position.x + cor.x,
                            position.y + cor.y,
                            {
                              button: "left",
                            }
                          );
                          // await page.mouse.click(1160, 635, {
                          //   button: "left",
                          // });
                          await navigationPromise;
                          await page.waitForTimeout(120000);
                          pageTitle = await page.title();

                          if (pageTitle != "Overview") {
                            switch (canvasName) {
                              case "CP Revenue Combined": {
                                await page
                                  .waitForXPath(cps.garndTotalElement(6), {
                                    visible: true,
                                    timeout: 4000,
                                  })
                                  .then(async () => {
                                    logger.info(
                                      "grand total element display properly"
                                    );
                                    const el = await page.$x(
                                      cps.garndTotalElement(6)
                                    );
                                    const actValue: string = await (
                                      await el[0].getProperty("textContent")
                                    ).jsonValue();

                                    Number(
                                      actValue.split("$")[1].replace(/\,/g, "")
                                    ) == dt.combinedsale
                                      ? logger.info(
                                          `${canvasName} data validation success by database value ${
                                            dt.combinedsale
                                          } is matching with ui displayed value ${Number(
                                            actValue
                                              .split("$")[1]
                                              .replace(/\,/g, "")
                                          )}`
                                        )
                                      : [
                                          logger.error(
                                            `${canvasName} data validation failed by database value ${
                                              dt.combinedsale
                                            } is not matching with ui displayed value ${Number(
                                              actValue
                                                .split("$")[1]
                                                .replace(/\,/g, "")
                                            )}`
                                          ),
                                          errors.push(
                                            `${canvasName} data validation failed by database value ${
                                              dt.combinedsale
                                            } is not matching with ui displayed value ${Number(
                                              actValue
                                                .split("$")[1]
                                                .replace(/\,/g, "")
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
                              case "CP Labor Revenue": {
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

                                    Number(
                                      actValue.split("$")[1].replace(/\,/g, "")
                                    ) == dt.laborsale
                                      ? logger.info(
                                          `${canvasName} data validation success by database value ${
                                            dt.laborsale
                                          } is matching with ui displayed value ${Number(
                                            actValue
                                              .split("$")[1]
                                              .replace(/\,/g, "")
                                          )}`
                                        )
                                      : [
                                          logger.error(
                                            `${canvasName} data validation failed by database value ${
                                              dt.laborsale
                                            } is not matching with ui displayed value ${Number(
                                              actValue
                                                .split("$")[1]
                                                .replace(/\,/g, "")
                                            )}`
                                          ),
                                          errors.push(
                                            `${canvasName} data validation failed by database value ${
                                              dt.laborsale
                                            } is not matching with ui displayed value ${Number(
                                              actValue
                                                .split("$")[1]
                                                .replace(/\,/g, "")
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
                              case "CP Parts Revenue": {
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

                                    Number(
                                      actValue.split("$")[1].replace(/\,/g, "")
                                    ) == dt.partssale
                                      ? logger.info(
                                          `${canvasName} data validation success by database value ${
                                            dt.partssale
                                          } is matching with ui displayed value ${Number(
                                            actValue
                                              .split("$")[1]
                                              .replace(/\,/g, "")
                                          )}`
                                        )
                                      : [
                                          logger.error(
                                            `${canvasName} data validation failed by database value ${
                                              dt.partssale
                                            } is not matching with ui displayed value ${Number(
                                              actValue
                                                .split("$")[1]
                                                .replace(/\,/g, "")
                                            )}`
                                          ),
                                          errors.push(
                                            `${canvasName} data validation failed by database value ${
                                              dt.partssale
                                            } is not matching with ui displayed value ${Number(
                                              actValue
                                                .split("$")[1]
                                                .replace(/\,/g, "")
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
                              case "CP Combined Gross Profit": {
                                await page
                                  .waitForXPath(cps.garndTotalElement(8), {
                                    visible: true,
                                    timeout: 4000,
                                  })
                                  .then(async () => {
                                    logger.info(
                                      "grand total element display properly"
                                    );
                                    const el = await page.$x(
                                      cps.garndTotalElement(8)
                                    );
                                    const actValue: string = await (
                                      await el[0].getProperty("textContent")
                                    ).jsonValue();

                                    Number(
                                      actValue.split("$")[1].replace(/\,/g, "")
                                    ) == dt.cmbinedGP
                                      ? logger.info(
                                          `${canvasName} data validation success by database value ${
                                            dt.cmbinedGP
                                          } is matching with ui displayed value ${Number(
                                            actValue
                                              .split("$")[1]
                                              .replace(/\,/g, "")
                                          )}`
                                        )
                                      : [
                                          logger.error(
                                            `${canvasName} data validation failed by database value ${
                                              dt.cmbinedGP
                                            } is not matching with ui displayed value ${Number(
                                              actValue
                                                .split("$")[1]
                                                .replace(/\,/g, "")
                                            )}`
                                          ),
                                          errors.push(
                                            `${canvasName} data validation failed by database value ${
                                              dt.cmbinedGP
                                            } is not matching with ui displayed value ${Number(
                                              actValue
                                                .split("$")[1]
                                                .replace(/\,/g, "")
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
                              case "CP Labor Gross Profit": {
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

                                    Number(
                                      actValue.split("$")[1].replace(/\,/g, "")
                                    ) == dt.laborGP
                                      ? logger.info(
                                          `${canvasName} data validation success by database value ${
                                            dt.laborGP
                                          } is matching with ui displayed value ${Number(
                                            actValue
                                              .split("$")[1]
                                              .replace(/\,/g, "")
                                          )}`
                                        )
                                      : [
                                          logger.error(
                                            `${canvasName} data validation failed by database value ${
                                              dt.laborGP
                                            } is not matching with ui displayed value ${Number(
                                              actValue
                                                .split("$")[1]
                                                .replace(/\,/g, "")
                                            )}`
                                          ),
                                          errors.push(
                                            `${canvasName} data validation failed by database value ${
                                              dt.laborGP
                                            } is not matching with ui displayed value ${Number(
                                              actValue
                                                .split("$")[1]
                                                .replace(/\,/g, "")
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
                              case "CP Parts Gross Profit": {
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

                                    Number(
                                      actValue.split("$")[1].replace(/\,/g, "")
                                    ) == dt.partsGP
                                      ? logger.info(
                                          `${canvasName} data validation success by database value ${
                                            dt.partsGP
                                          } is matching with ui displayed value ${Number(
                                            actValue
                                              .split("$")[1]
                                              .replace(/\,/g, "")
                                          )}`
                                        )
                                      : [
                                          logger.error(
                                            `${canvasName} data validation failed by database value ${
                                              dt.partsGP
                                            } is not matching with ui displayed value ${Number(
                                              actValue
                                                .split("$")[1]
                                                .replace(/\,/g, "")
                                            )}`
                                          ),
                                          errors.push(
                                            `${canvasName} data validation failed by database value ${
                                              dt.partsGP
                                            } is not matching with ui displayed value ${Number(
                                              actValue
                                                .split("$")[1]
                                                .replace(/\,/g, "")
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
                              case "CP Combined Gross Profit Percentage": {
                                await page
                                  .waitForXPath(cps.garndTotalElement(8), {
                                    visible: true,
                                    timeout: 4000,
                                  })
                                  .then(async () => {
                                    logger.info(
                                      "grand total element display properly"
                                    );
                                    const el = await page.$x(
                                      cps.garndTotalElement(8)
                                    );
                                    const actValue: string = await (
                                      await el[0].getProperty("textContent")
                                    ).jsonValue();

                                    Number(
                                      actValue.split("$")[1].replace(/\,/g, "")
                                    ) == dt.combinedgppercentage
                                      ? logger.info(
                                          `${canvasName} data validation success by database value ${
                                            dt.combinedgppercentage
                                          } is matching with ui displayed value ${Number(
                                            actValue
                                              .split("$")[1]
                                              .replace(/\,/g, "")
                                          )}`
                                        )
                                      : [
                                          logger.error(
                                            `${canvasName} data validation failed by database value ${
                                              dt.combinedgppercentage
                                            } is not matching with ui displayed value ${Number(
                                              actValue
                                                .split("$")[1]
                                                .replace(/\,/g, "")
                                            )}`
                                          ),
                                          errors.push(
                                            `${canvasName} data validation failed by database value ${
                                              dt.combinedgppercentage
                                            } is not matching with ui displayed value ${Number(
                                              actValue
                                                .split("$")[1]
                                                .replace(/\,/g, "")
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
                              case "CP Labor Gross Profit Percentage": {
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

                                    Number(
                                      actValue.split("$")[1].replace(/\,/g, "")
                                    ) == dt.laborgppercentage
                                      ? logger.info(
                                          `${canvasName} data validation success by database value ${
                                            dt.laborgppercentage
                                          } is matching with ui displayed value ${Number(
                                            actValue
                                              .split("$")[1]
                                              .replace(/\,/g, "")
                                          )}`
                                        )
                                      : [
                                          logger.error(
                                            `${canvasName} data validation failed by database value ${
                                              dt.laborgppercentage
                                            } is not matching with ui displayed value ${Number(
                                              actValue
                                                .split("$")[1]
                                                .replace(/\,/g, "")
                                            )}`
                                          ),
                                          errors.push(
                                            `${canvasName} data validation failed by database value ${
                                              dt.laborgppercentage
                                            } is not matching with ui displayed value ${Number(
                                              actValue
                                                .split("$")[1]
                                                .replace(/\,/g, "")
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
                              case "CP Parts Gross Profit Percentage": {
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

                                    Number(
                                      actValue.split("$")[1].replace(/\,/g, "")
                                    ) == dt.partsgppercentage
                                      ? logger.info(
                                          `${canvasName} data validation success by database value ${
                                            dt.partsgppercentage
                                          } is matching with ui displayed value ${Number(
                                            actValue
                                              .split("$")[1]
                                              .replace(/\,/g, "")
                                          )}`
                                        )
                                      : [
                                          logger.error(
                                            `${canvasName} data validation failed by database value ${
                                              dt.partsgppercentage
                                            } is not matching with ui displayed value ${Number(
                                              actValue
                                                .split("$")[1]
                                                .replace(/\,/g, "")
                                            )}`
                                          ),
                                          errors.push(
                                            `${canvasName} data validation failed by database value ${
                                              dt.partsgppercentage
                                            } is not matching with ui displayed value ${Number(
                                              actValue
                                                .split("$")[1]
                                                .replace(/\,/g, "")
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
                                null;
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
                          errors.push(
                            `${canvasName} graph not visible properly`
                          );
                        });
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
            logger.warn(
              `${dt.paytype} paytype is not applicable for combined chart data validation`
            );
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
fixedOpsSummaryOverviewValidationTest();
