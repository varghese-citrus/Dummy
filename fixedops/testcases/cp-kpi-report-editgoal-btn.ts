import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { CpKpiSelectors as cps } from "../selectors/cp-kpi-report.ts";
import { fixedopsCommonLogin } from "./common/fixedops-common-login.ts";
import { kpiscorecardSettingsSelectors as ks } from "../selectors/kpi-score-card.ts";
import { startLogger } from "../utilities/utils.ts";

const logger = startLogger();
const errors: string[] = [];

function fixedOpsCpKpiReportTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[DEMO-TEST] ${site.name} FixedOps CP KPI Report Edit Goal Button Test`,
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
          await cpOverviewPageEditGoalBtnTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps CP KPI Report Edit Goal Button Test";
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

async function cpOverviewPageEditGoalBtnTest(baseURL: string) {
  let browser = null;

  try {
    const oBrowser = await fixedopsCommonLogin(baseURL);
    const page = oBrowser.page;
    browser = oBrowser.browser;
    const navigationPromise = oBrowser.navigationPromise;
    await page.waitForSelector(cps.cpsummary);
    await page.click(cps.cpsummary);
    logger.info("CP expand collapse link clicked");
    await page.waitForTimeout(5000);

    await page.waitForSelector(cps.cpKpiReport);
    await page.click(cps.cpKpiReport);
    await navigationPromise;
    await page.waitForTimeout(15000);

    const title = await page.title();

    if (title == "KPI Report 1 - Individual Advisor") {
      logger.info("CP KPI Report title verify success");

      await page
        .waitForXPath(cps.editGoalBtn, {
          visible: true,
          timeout: 4000,
        })
        .then(async () => {
          logger.info("edit goals button visible properly");
          const editGoalBtn = await page.$x(cps.editGoalBtn);
          await editGoalBtn[0].click();
          await navigationPromise;
          await page.waitForTimeout(15000);
        })
        .catch(() => {
          logger.error("edit goals button not visible");
          errors.push("edit goals button not visible");
        });

      const pageTitle = await page.title();
      const elements = [
        ks.kpiSettingsHeading,
        ks.storeGoalsHeading,
        ks.advGoalsHeading,
      ];
      const elementNames = [
        "KPI Report#1 - Goal Settings",
        "Store Goals",
        "Advisor Goals",
      ];
      if (pageTitle == "ScoreCardGoal") {
        logger.info("edit goals button navigation success");
        const role = Deno.env.get("ROLE");
        if (role?.includes("admin") || role?.toString().includes("user")) {
          await page.waitForTimeout(2000);
          for (let i = 0; i < elements.length; i++) {
            const heading = await page.$x(elements[i]);
            const pageHeading = await (
              await heading[0].getProperty("textContent")
            ).jsonValue();
            await page.waitForTimeout(2000);
            pageHeading == elementNames[i]
              ? logger.info(`${elementNames[i]} Heading Verify Success`)
              : [
                  logger.error(`${elementNames[i]} Heading Verify Failed`),
                  errors.push(`${elementNames[i]} Heading Verify Failed`),
                ];
            await page.waitForTimeout(2000);
          }

          await page.waitForTimeout(20000);
          await page
            .$eval(ks.storeTable, (elem) => {
              return elem.style.display !== "none";
            })
            .then(() => {
              logger.info("KPI Store Goal Report Data display properly");
            })
            .catch(() => {
              logger.info("KPI Store Goal Report Data not properly displayed");
              errors.push("KPI Store Goal Report Data not properly displayed");
            });

          await page.waitForTimeout(4000);
          await page.waitForSelector(ks.editBtn);
          await page.click(ks.editBtn);
          logger.info("Edit button clicked");
          await page.waitForTimeout(5000);

          await page
            .waitForSelector(ks.editableInpField, {
              visible: true,
              timeout: 4000,
            })
            .then(() => {
              logger.info("Edit button working properly");
            })
            .catch(() => {
              logger.error("Edit button not working properly");
              errors.push("Edit button not working properly");
            });

          await page
            .waitForSelector(ks.saveGoalStoreBtn, {
              visible: true,
              timeout: 4000,
            })
            .then(() => {
              logger.info(
                "Save goal button display properly under Store goals"
              );
            })
            .catch(() => {
              logger.error(
                "Save goal button not properly displayed under Store goals"
              );
              errors.push(
                "Save goal button not properly displayed under Store goals"
              );
            });

          await page
            .waitForXPath(ks.reportEmailBtn, {
              visible: true,
              timeout: 2000,
            })
            .then(() => {
              logger.info("Email Report block display properly under store");
            })
            .catch(() => {
              logger.error("Email Report not properly displayed under store");
              errors.push("Email Report not properly displayed under store");
            });

          await page
            .$eval(ks.reportEmailBox, (elem) => {
              return elem.style.display !== "none";
            })
            .then(async () => {
              const emailBox = await page.waitForSelector(ks.reportEmailBox, {
                visible: true,
                timeout: 2000,
              });
              await page.waitForTimeout(5000);

              emailBox
                ? logger.info("Email Checkbox working properly")
                : [
                    logger.error(
                      "Email Checkbox not working properly under Store goals"
                    ),
                    errors.push(
                      "Email Checkbox not working properly under Store goals"
                    ),
                  ];
            })
            .catch(async () => {
              const reportEmailChk = await page.$x(ks.reportEmailChk);
              await reportEmailChk[0].click();
              await page.waitForTimeout(5000);
              logger.info("Report email checkbox clicked");
              const emailBox = await page.waitForSelector(ks.reportEmailBox, {
                visible: true,
                timeout: 2000,
              });
              await page.waitForTimeout(5000);

              emailBox
                ? logger.info("Email Checkbox working properly")
                : [
                    logger.error(
                      "Email Checkbox not working properly under Store goals"
                    ),
                    errors.push(
                      "Email Checkbox not working properly under Store goals"
                    ),
                  ];
            });

          // const ids = [ks.saveGoals, ks.emailReport];
          // const elName = ["Save goals", "Email Report"];

          // await page.waitForTimeout(2000);

          // for (let i = 0; i <= ids.length - 1; i++) {
          //   await page.waitForTimeout(2000);
          //   try {
          //     await page.$eval(ids[i], (elem) => {
          //       return elem.style.display !== "none";
          //     });
          //   } catch (error) {
          //     const errors: string[] = [];
          //     errors.push(error);
          //     const e = errors.find((x) => x === error);
          //     e
          //       ? logger.info(
          //           `${elName[i]} button not present, verification success`
          //         )
          //       : [
          //           logger.error(
          //             `${elName[i]} button  present, verification fail`
          //           ),
          //           errors.push(
          //             `${elName[i]} button  present, verification fail`
          //           ),
          //         ];
          //   }
          // }
          await page.waitForTimeout(4000);
          await page
            .waitForSelector(cps.backBtn, {
              visible: true,
              timeout: 4000,
            })
            .then(async () => {
              logger.info("back button visible properly");
              await page.click(cps.backBtn);
              await navigationPromise;
              await page.waitForTimeout(15000);
              logger.info("back button clicked");
              const pageTitle = await page.title();
              pageTitle == "KPI Report 1 - Individual Advisor"
                ? logger.info("back button working properly")
                : [
                    logger.error("back button not working properly"),
                    errors.push("back button not working properly"),
                  ];
            })
            .catch(() => {
              logger.error("back button not visible properly");
              errors.push("back button not visible properly");
            });
        } else {
          await page.waitForTimeout(2000);
          const heading = await page.$x(ks.kpiSettingsHeading);
          const pageHeading = await (
            await heading[0].getProperty("textContent")
          ).jsonValue();
          await page.waitForTimeout(2000);
          pageHeading == "KPI Report#1 - Goal Settings"
            ? logger.info("KPI Settings Heading verify success")
            : [
                logger.error("KPI Score Card  heading verify failed"),
                errors.push("KPI Score Card Settings heading verify failed"),
              ];

          const storeHeading = await page.$x(ks.storeGoalsHeading);
          const goalHeading = await (
            await storeHeading[0].getProperty("textContent")
          ).jsonValue();
          await page.waitForTimeout(2000);
          goalHeading == "Store Goals"
            ? logger.info("KPI Store goals Heading verify success")
            : [
                logger.error("KPI Store goals  heading verify failed"),
                errors.push("KPI Store goals Settings heading verify failed"),
              ];

          const advHeading = await page.$x(ks.advGoalsHeading);
          const goalAdvHeading = await (
            await advHeading[0].getProperty("textContent")
          ).jsonValue();
          await page.waitForTimeout(2000);
          goalAdvHeading == "Advisor Goals"
            ? logger.info("KPI Advisor goals Heading verify success")
            : [
                logger.error("KPI Advisor goals  heading verify failed"),
                errors.push("KPI Advisor goals Settings heading verify failed"),
              ];

          await page.waitForTimeout(10000);
          const storeDataTable = await page.$eval(ks.storeTable, (elem) => {
            return elem.style.display !== "none";
          });
          storeDataTable
            ? logger.info("KPI Store Goal Report Data display properly")
            : [
                logger.info(
                  "KPI Store Goal Report Data not properly displayed"
                ),
                errors.push(
                  "KPI Store Goal Report Data not properly displayed"
                ),
              ];
          await page.waitForTimeout(4000);
          await page
            .waitForSelector(cps.backBtn, {
              visible: true,
              timeout: 4000,
            })
            .then(async () => {
              logger.info("back button visible properly");
              await page.click(cps.backBtn);
              await navigationPromise;
              await page.waitForTimeout(15000);
              logger.info("back button clicked");
              const pageTitle = await page.title();
              pageTitle == "KPI Report 1 - Individual Advisor"
                ? logger.info("back button working properly")
                : [
                    logger.error("back button not working properly"),
                    errors.push("back button not working properly"),
                  ];
            })
            .catch(() => {
              logger.error("back button not visible properly");
              errors.push("back button not visible properly");
            });
        }
      } else {
        logger.error("edit goals button navigation failed");
        errors.push("edit goals button navigation failed");
      }
    } else {
      logger.error("CP KPI Report page title verify failed");
      errors.push("CP KPI Report  page title verify failed");
    }

    ts.assert(
      errors.length == 0,
      `Error in  CP KPI Report Page: ${errors.join("\n")}`
    );
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsCpKpiReportTest();
