import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { DetailSummerySelectors as de } from "../selectors/detail-summary.ts";
import { HomeSelectors as hs } from "../selectors/home.ts";
import { getRandomNumberBetween, startLogger } from "../utilities/utils.ts";
import { fixedopsCommonLogin } from "./common/fixedops-common-login.ts";

const logger = startLogger();
const errors: string[] = [];

function fixedOpsDetailSummaryTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[AEC-FOCP-UI-FN-LD-0042] ${site.name} FixedOps Detail Summary Page Service Department Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-UI-FN-LD-0042",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await detailSummaryPageServiceDeptTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Detail Summary Page Service Department Test";
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

async function detailSummaryPageServiceDeptTest(baseURL: string) {
  let browser = null;

  try {
    const oBrowser = await fixedopsCommonLogin(baseURL);
    const page = oBrowser.page;
    browser = oBrowser.browser;
    const navigationPromise = oBrowser.navigationPromise;
    await page.reload();
    await navigationPromise;
    await page.waitForTimeout(15000);

    const role = Deno.env.get("ROLE");

    if (role == "admin") {
      const dataAsOfXpath = await page.$x(hs.dataAsOfXpath);
      const dataAsOf: string = await (
        await dataAsOfXpath[0].getProperty("textContent")
      ).jsonValue();

      const dataLoadMonth = dataAsOf.split(":")[1].split("/")[0].trim();

      await page.waitForSelector(de.armatusAdminLink);
      await page.click(de.armatusAdminLink);
      logger.info("armatus admin expand collapse link clicked");
      await page.waitForTimeout(4000);

      await page.waitForSelector(de.detailSummaryLink);
      await page.click(de.detailSummaryLink);
      await navigationPromise;
      await page.waitForTimeout(10000);
      logger.info("detail summery link clicked");

      const title = await page.title();

      if (title == "Detail Summary") {
        logger.info("detail summary title verify success");
        await page.waitForTimeout(2000);
        const heading = await page.$x(de.detailSummaryHeading);
        const pageHeading = await (
          await heading[0].getProperty("textContent")
        ).jsonValue();
        await page.waitForTimeout(2000);
        if (pageHeading == "Detail Summary") {
          logger.info("detail summary heading verify success");

          await page
            .waitForSelector(de.curMonth, {
              visible: true,
              timeout: 4000,
            })
            .then(() => {
              logger.info("current month display properly");
            })
            .catch(() => {
              logger.error("current month not display properly");
              errors.push("current month not display properly");
            });

          const curMonth = await page.$eval(
            de.curMonth,
            (element) => element.textContent
          );

          const actMonth = curMonth
            .toString()
            .split("-")[1]
            .split("-")[0]
            .trim();
          const monthNames = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ];

          monthNames[Number(dataLoadMonth) - 1] == actMonth
            ? logger.info("current month verify success")
            : [
                logger.error("current month verify failed"),
                errors.push("current month verify failed"),
              ];

          await page.waitForTimeout(2000);

          const dp = await page.$x(de.datePicker);
          await dp[0].click();
          await page.waitForTimeout(4000);

          const num1 = await getRandomNumberBetween(1, 3);
          const yr = await page.$x(de.getYear(num1));
          await yr[0].click();
          await page.waitForTimeout(4000);

          const mXpath = await page.$x(de.month);
          await mXpath[0].click();
          await page.waitForTimeout(4000);

          let i = 1;
          let num2;
          let flag = 0;

          do {
            num2 = await getRandomNumberBetween(1, 12);
            const mn = await page.$x(de.getMonth(num2));
            const mCls: string = await (
              await mn[0].getProperty("className")
            ).jsonValue();

            if (
              mCls ==
                "MuiTypography-root MuiPickersMonth-root MuiTypography-subtitle1" ||
              mCls ==
                "MuiTypography-root MuiPickersMonth-root MuiPickersMonth-monthSelected MuiTypography-h5 MuiTypography-colorPrimary"
            ) {
              await page.waitForTimeout(2000);
              flag = 1;
              await mn[0].click();
              await page.waitForTimeout(2000);
            } else {
              i++;
            }
            if (flag == 1) {
              break;
            }
          } while (i > 0);
          await page.waitForTimeout(5000);

          const serDept = await page.waitForXPath(de.serviceDepartment, {
            visible: true,
            timeout: 2000,
          });
          await page.waitForTimeout(2000);
          if (serDept != null) {
            logger.info("service department visible properly");

            const departments = [
              de.revenueByPayType,
              de.cusLaborRevenue,
              de.cusPartsRevenue,
              de.cusLaborRevenueCat,
              de.cusPartsRevenueCat,
              de.jobLevelBreakDown_1,
              de.jobLevelBreakDown_2,
            ];

            const revenueDetailLabel = [
              "Revenue Details - Labor & Parts",
              "Revenue Details - Labor",
              "Revenue Details - Parts",
            ];

            const toggleBtn = [
              de.tglBtn_1,
              de.tglBtn_2,
              de.tglBtn_3,
              de.tglBtn_4,
              de.tglBtn_5,
            ];
            await page.waitForTimeout(2000);
            //const i = await getRandomNumberBetween(1, 7);
            const i = 1;
            const dXpath = await page.$x(departments[i]);
            const departmentName = await (
              await dXpath[0].getProperty("textContent")
            ).jsonValue();
            await page.waitForTimeout(2000);
            await page
              .waitForXPath(departments[i], {
                visible: true,
                timeout: 2000,
              })
              .then(() => {
                logger.info(`${departmentName} visible properly`);
              })
              .catch(() => {
                logger.error(`${departmentName} not visible properly`);
                errors.push(`${departmentName} not visible properly`);
              });
            await page.waitForTimeout(4000);
            const drilDownBtnXpath = await page.$x(de.drilDownBtn(i + 1));
            await drilDownBtnXpath[0].click();
            await navigationPromise;
            await page.waitForTimeout(25000);

            const labelXpath = await page.$x(de.revenueDetailLabel);
            const label: string = await (
              await labelXpath[0].getProperty("textContent")
            ).jsonValue();
            await page.waitForTimeout(2000);
            if (i == 1 || i == 3 || i == 5 || i == 6) {
              label == revenueDetailLabel[1]
                ? logger.info(`${departmentName} drill down working properly`)
                : [
                    logger.error(
                      `${departmentName} drill down not working properly`
                    ),
                    errors.push(
                      `${departmentName} drill down not working properly`
                    ),
                  ];

              //ro check starts
              await page.waitForTimeout(2000);
              await page.mouse.click(266, 291, { button: "left" });
              await navigationPromise;
              await page.waitForTimeout(20000);

              let pageTitle = await page.title();
              if (pageTitle == "Search by Ro") {
                logger.info("Search by Ro titile verify success");

                await page
                  .$eval(de.repairOrderTable, (elem) => {
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
                  logger.info("toggle button navigation success");

                  logger.info("enters into opcode summery");
                  await page.waitForTimeout(5000);

                  await page
                    .$eval(de.dataTable, (elem) => {
                      return elem.style.display !== "none";
                    })
                    .then(() => {
                      logger.info(
                        "data table display properly under opcode summery tab"
                      );
                    })
                    .catch(() => {
                      logger.error(
                        "data table not display properly under opcode summery tab"
                      );
                      errors.push(
                        "data table not display properly under opcode summery tab"
                      );
                    });
                  await page.waitForTimeout(5000);

                  await page.mouse.click(348, 365, { button: "left" });
                  await navigationPromise;
                  logger.info("row data clicked");
                  await page.waitForTimeout(15000);

                  const attr = await page.$eval(
                    de.opcodeDetailedViewTab,
                    (element) => element.getAttribute("aria-selected")
                  );

                  if (attr.toString() == "true") {
                    logger.info("enters into opcode detail view");
                    await page.waitForTimeout(2000);

                    await page
                      .$eval(de.dataTable, (elem) => {
                        return elem.style.display !== "none";
                      })
                      .then(() => {
                        logger.info(
                          "data table display properly under opcode detail view tab"
                        );
                      })
                      .catch(() => {
                        logger.info(
                          "data table not display properly under opcode detail view tab"
                        );
                        errors.push(
                          "data table not display properly under opcode detail view tab"
                        );
                      });

                    await page.mouse
                      .click(896, 360, { button: "left" })
                      .catch(() => {
                        logger.warn("there is no row data for drill down");
                      });
                    await navigationPromise;
                    logger.info("row data clicked");
                    await page.waitForTimeout(15000);

                    pageTitle = await page.title();
                    await page.waitForTimeout(5000);

                    pageTitle == "Search by Ro"
                      ? logger.info(
                          "discount metrics detail summary page drill down success"
                        )
                      : [
                          logger.error(
                            "discount metrics detail summary page drill down failed"
                          ),
                          errors.push(
                            "discount metrics detail summary page drill down failed"
                          ),
                        ];
                  } else {
                    logger.warn("there is no row data for drill down!");
                  }
                } else {
                  logger.error("toggle button navigation failed");
                  errors.push("toggle button navigation failed");
                }
              } else {
                logger.warn("there is no row data for drill down!");
              }

              //ro ends

              await page.waitForTimeout(2000);
              await page.goBack();
              await navigationPromise;
              await page.waitForTimeout(8000);
            } else if (i == 0) {
              label == revenueDetailLabel[0]
                ? logger.info(`${departmentName} drill down working properly`)
                : [
                    logger.error(
                      `${departmentName} drill down not working properly`
                    ),
                    errors.push(
                      `${departmentName} drill down not working properly`
                    ),
                  ];

              //ro check starts
              await page.waitForTimeout(2000);
              await page.mouse.click(266, 291, { button: "left" });
              await navigationPromise;
              await page.waitForTimeout(20000);

              let pageTitle = await page.title();
              if (pageTitle == "Search by Ro") {
                logger.info("Search by Ro titile verify success");

                const repairOderTable = await page.$eval(
                  await de.repairOrderTable,
                  (elem) => {
                    return elem.style.display !== "none";
                  }
                );

                repairOderTable
                  ? logger.info("repair order table visible properly")
                  : [
                      logger.error("repair order table not visible properly"),
                      errors.push("repair order table not visible properly"),
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
                  logger.info("toggle button navigation success");

                  logger.info("enters into opcode summery");
                  await page.waitForTimeout(5000);

                  const dataTable = await page.$eval(
                    await de.dataTable,
                    (elem) => {
                      return elem.style.display !== "none";
                    }
                  );
                  await page.waitForTimeout(5000);
                  dataTable
                    ? logger.info(
                        "data table display properly under opcode summery tab"
                      )
                    : [
                        logger.error(
                          "data table not display properly under opcode summery tab"
                        ),
                        errors.push(
                          "data table not display properly under opcode summery tab"
                        ),
                      ];

                  await page.mouse.click(348, 365, { button: "left" });
                  await navigationPromise;
                  logger.info("row data clicked");
                  await page.waitForTimeout(15000);

                  const attr = await page.$eval(
                    de.opcodeDetailedViewTab,
                    (element) => element.getAttribute("aria-selected")
                  );

                  if (attr.toString() == "true") {
                    logger.info("enters into opcode detail view");
                    await page.waitForTimeout(2000);

                    const dataTable = await page.$eval(
                      await de.dataTable,
                      (elem) => {
                        return elem.style.display !== "none";
                      }
                    );

                    dataTable
                      ? logger.info(
                          "data table display properly under opcode detail view tab"
                        )
                      : [
                          logger.info(
                            "data table not display properly under opcode detail view tab"
                          ),
                          errors.push(
                            "data table not display properly under opcode detail view tab"
                          ),
                        ];

                    await page.mouse
                      .click(896, 360, { button: "left" })
                      .catch(() => {
                        logger.warn("there is no row data for drill down");
                      });
                    await navigationPromise;
                    logger.info("row data clicked");
                    await page.waitForTimeout(15000);

                    pageTitle = await page.title();
                    await page.waitForTimeout(5000);

                    pageTitle == "Search by Ro"
                      ? logger.info(
                          "discount metrics By service advisor page drill down success"
                        )
                      : [
                          logger.error(
                            "discount metrics By service advisor page drill down failed"
                          ),
                          errors.push(
                            "discount metrics By service advisor page drill down failed"
                          ),
                        ];
                  } else {
                    logger.warn("there is no row data for drill down!");
                  }
                } else {
                  logger.error("toggle button navigation failed");
                  errors.push("toggle button navigation failed");
                }
              } else {
                logger.warn("there is no row data for drill down!");
              }

              //ro ends

              await page.waitForTimeout(2000);
              await page.goBack();
              await navigationPromise;
              await page.waitForTimeout(8000);
            } else {
              label == revenueDetailLabel[2]
                ? logger.info(`${departmentName} drill down working properly`)
                : [
                    logger.error(
                      `${departmentName} drill down not working properly`
                    ),
                    errors.push(
                      `${departmentName} drill down not working properly`
                    ),
                  ];

              //ro check starts
              await page.waitForTimeout(2000);
              await page.mouse.click(266, 291, { button: "left" });
              await navigationPromise;
              await page.waitForTimeout(20000);

              let pageTitle = await page.title();
              if (pageTitle == "Search by Ro") {
                logger.info("Search by Ro titile verify success");

                const repairOderTable = await page.$eval(
                  await de.repairOrderTable,
                  (elem) => {
                    return elem.style.display !== "none";
                  }
                );

                repairOderTable
                  ? logger.info("repair order table visible properly")
                  : [
                      logger.error("repair order table not visible properly"),
                      errors.push("repair order table not visible properly"),
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
                  logger.info("toggle button navigation success");

                  logger.info("enters into opcode summery");
                  await page.waitForTimeout(5000);

                  const dataTable = await page.$eval(
                    await de.dataTable,
                    (elem) => {
                      return elem.style.display !== "none";
                    }
                  );
                  await page.waitForTimeout(5000);
                  dataTable
                    ? logger.info(
                        "data table display properly under opcode summery tab"
                      )
                    : [
                        logger.error(
                          "data table not display properly under opcode summery tab"
                        ),
                        errors.push(
                          "data table not display properly under opcode summery tab"
                        ),
                      ];

                  await page.mouse.click(348, 365, { button: "left" });
                  await navigationPromise;
                  logger.info("row data clicked");
                  await page.waitForTimeout(15000);

                  const attr = await page.$eval(
                    de.opcodeDetailedViewTab,
                    (element) => element.getAttribute("aria-selected")
                  );

                  if (attr.toString() == "true") {
                    logger.info("enters into opcode detail view");
                    await page.waitForTimeout(2000);

                    const dataTable = await page.$eval(
                      await de.dataTable,
                      (elem) => {
                        return elem.style.display !== "none";
                      }
                    );

                    dataTable
                      ? logger.info(
                          "data table display properly under opcode detail view tab"
                        )
                      : [
                          logger.info(
                            "data table not display properly under opcode detail view tab"
                          ),
                          errors.push(
                            "data table not display properly under opcode detail view tab"
                          ),
                        ];

                    await page.mouse
                      .click(896, 360, { button: "left" })
                      .catch(() => {
                        logger.warn("there is no row data for drill down");
                      });
                    await navigationPromise;
                    logger.info("row data clicked");
                    await page.waitForTimeout(15000);

                    pageTitle = await page.title();
                    await page.waitForTimeout(5000);

                    pageTitle == "Search by Ro"
                      ? logger.info(
                          "discount metrics By service advisor page drill down success"
                        )
                      : [
                          logger.error(
                            "discount metrics By service advisor page drill down failed"
                          ),
                          errors.push(
                            "discount metrics By service advisor page drill down failed"
                          ),
                        ];
                  } else {
                    logger.warn("there is no row data for drill down!");
                  }
                } else {
                  logger.error("toggle button navigation failed");
                  errors.push("toggle button navigation failed");
                }
              } else {
                logger.warn("there is no row data for drill down!");
              }

              //ro ends

              await page.waitForTimeout(2000);
              await page.goBack();
              await navigationPromise;
              await page.waitForTimeout(8000);
            }
            //}
          } else {
            logger.error("service department not visible properly");
            errors.push("service department not visible properly");
          }
          await page.waitForTimeout(2000);
        } else {
          logger.error("detail summary heading verify failed");
          errors.push("detail summary heading verify failed");
        }
      } else {
        logger.error("detail summary title verify failed");
        errors.push("detail summary title verify failed");
      }
    } else {
      logger.warn(
        "role is not admin!,please provide admin as role for further testing"
      );
    }

    ts.assert(
      errors.length == 0,
      `Error in Detail Summary Page: ${errors.join("\n")}`
    );
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsDetailSummaryTest();
