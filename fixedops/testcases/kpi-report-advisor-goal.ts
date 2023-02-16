import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { kpiscorecardSettingsSelectors as kpis } from "../selectors/kpi-score-card.ts";
import { fixedopsCommonLogin } from "./common/fixedops-common-login.ts";
import { startLogger, getRandomNumberBetween } from "../utilities/utils.ts";

const errors: string[] = [];
const logger = startLogger();

function fixedOpsKpiReportAdvGoalTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[DEMO-TEST] ${site.name} KPI Report Advisor Goal Test`,
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
          await kpiReportAdvGoalTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps KPI Report Advisor Goal Test";
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

async function kpiReportAdvGoalTest(baseURL: string) {
  let browser = null;
  try {
    const oBrowser = await fixedopsCommonLogin(baseURL);
    const page = oBrowser.page;
    browser = oBrowser.browser;
    const navigationPromise = oBrowser.navigationPromise;
    await navigationPromise;
    await page.waitForTimeout(4000);
    await page.waitForSelector(kpis.referenceAndSetupLink);
    await page.click(kpis.referenceAndSetupLink);
    logger.info("Reference/setup Menu clicked");
    await page.waitForTimeout(5000);
    await page.waitForSelector(kpis.kpiSettingsLink);
    await page.click(kpis.kpiSettingsLink);
    logger.info("KPI Score Card Settings Link clicked");
    await navigationPromise;
    await page.waitForTimeout(15000);
    const actual_title = await page.title();
    const elements = [
      kpis.kpiSettingsHeading,
      kpis.storeGoalsHeading,
      kpis.advGoalsHeading,
    ];
    const elementNames = [
      "KPI Report#1 - Goal Settings",
      "Store Goals",
      "Advisor Goals",
    ];
    if (actual_title == "ScoreCardGoal") {
      logger.info("KPI Score Card Settings page is visible!!!");
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
      await page
        .waitForXPath(kpis.advSelect, { visible: true, timeout: 4000 })
        .then(async () => {
          logger.info("advisor select display properly");
          const advSelectXpath = await page.$x(kpis.advSelect);
          await advSelectXpath[0].click();
          const advCount = await page.$x(kpis.advSelectCount);
          const num1 = await getRandomNumberBetween(1, advCount.length);
          const advSelect = await page.$x(kpis.advSelectLi(num1));
          await advSelect[0].click();
          await page.waitForTimeout(12000);
        })
        .catch(() => {
          logger.error("advisor select not display properly");
          errors.push("advisor select not display properly");
        });
      await page
        .$eval(kpis.advTable, (elem) => {
          return elem.style.display !== "none";
        })
        .then(async () => {
          logger.info("advisor table display properly");
          await page.waitForTimeout(4000);
          await page
            .waitForXPath(kpis.saveGoalsBtn1, {
              visible: true,
              timeout: 4000,
            })
            .then(() => {
              logger.info("save goal button 1 display properly");
            })
            .catch(() => {
              logger.error("save goal button 1 not display properly");
              errors.push("save goal button 1 not display properly");
            });
        })
        .catch(() => {
          logger.info("advisor table not properly displayed");
          errors.push("advisor table not properly displayed");
        });
      const checkBoxStatus = await page.$eval(kpis.emailBoxElement1, (elem) => {
        return elem.style.display == "none";
      });
      if (checkBoxStatus) {
        logger.info("check box unchecked");
        await page.waitForTimeout(4000);
        const checkbox = await page.$x(kpis.checkboxOne);
        await checkbox[0].click();
        await page.waitForTimeout(4000);
        const checkStatus = await page.$eval(kpis.emailBoxElement1, (elem) => {
          return elem.style.display !== "none";
        });
        checkStatus
          ? logger.info("checkbox checked successful")
          : [
              logger.error("checkbox checked unsuccess"),
              errors.push("checkbox checked unsuccess"),
            ];
        await page
          .waitForXPath(kpis.addRecipientBtn1, {
            visible: true,
            timeout: 4000,
          })
          .then(async () => {
            logger.info("add recipient button visible properly");
            const btn = await page.$x(kpis.addRecipientBtn1);
            await btn[0].click();
            await page.waitForTimeout(5000);
            await page
              .waitForSelector(kpis.popup, { visible: true, timeout: 4000 })
              .then(async () => {
                logger.info("schedule for mail trigger popup display properly");
                const elements = [
                  kpis.emailInput,
                  kpis.scheduleSelect,
                  kpis.cancelBtn,
                  kpis.saveChangesBtn,
                ];
                const elementNames = [
                  "email input",
                  "schedule select",
                  "cancel button",
                  "save changes button",
                ];
                for (let i = 0; i <= elements.length - 1; i++) {
                  await page
                    .waitForXPath(elements[i], {
                      visible: true,
                      timeout: 4000,
                    })
                    .then(async () => {
                      logger.info(`${elementNames[i]} visible properly`);
                      await page.waitForTimeout(4000);
                      if (i == 1) {
                        const elXpath = await page.$x(kpis.scheduleSelect);
                        await elXpath[0].click();
                        await page.waitForTimeout(4000);
                        logger.info("schedule select clicked");
                        const num = await getRandomNumberBetween(2, 4);
                        const LiXpath = await page.$x(kpis.scheduleLi(num));
                        await LiXpath[0].click();
                        await page.waitForTimeout(4000);
                        await page
                          .$eval(kpis.scheduleOn(num), (elem) => {
                            return elem.style.display !== "none";
                          })
                          .then(() => {
                            logger.info("schedule on display properly");
                          })
                          .catch(() => {
                            logger.error("schedule on not display properly");
                            errors.push("schedule on not display properly");
                          });
                      }
                    })
                    .catch(() => {
                      logger.error(`${elementNames[i]} not visible properly`);
                      errors.push(`${elementNames[i]} not visible properly`);
                    });
                }
                await page
                  .waitForXPath(kpis.cancelBtn, {
                    visible: true,
                    timeout: 4000,
                  })
                  .then(async () => {
                    logger.info("cancel button is available");
                    const cancelBtn = await page.$x(kpis.cancelBtn);
                    await cancelBtn[0].click();
                    await page.waitForTimeout(5000);
                    await page
                      .waitForSelector(kpis.popup, {
                        visible: true,
                        timeout: 4000,
                      })
                      .then(() => {
                        logger.error("cancel button not working properly");
                        errors.push("cancel button not working properly");
                      })
                      .catch(() => {
                        logger.info("cancel button  working properly");
                      });
                  })
                  .catch(() => {
                    logger.error("cancel button is not available");
                    errors.push("cancel button is not available");
                  });
              })
              .catch(() => {
                logger.error(
                  "schedule for mail trigger popup not display properly"
                );
                errors.push(
                  "schedule for mail trigger popup not display properly"
                );
              });
          })
          .catch(() => {
            logger.error("add recipient button not visible properly");
            errors.push("add recipient button not visible properly");
          });
      } else {
        logger.info("check box already checked");
        await page
          .waitForXPath(kpis.addRecipientBtn1, {
            visible: true,
            timeout: 4000,
          })
          .then(async () => {
            logger.info("add recipient button visible properly");
            const btn = await page.$x(kpis.addRecipientBtn1);
            await btn[0].click();
            await page.waitForTimeout(5000);
            await page
              .waitForSelector(kpis.popup, { visible: true, timeout: 4000 })
              .then(async () => {
                logger.info("schedule for mail trigger popup display properly");
                const elements = [
                  kpis.emailInput,
                  kpis.scheduleSelect,
                  kpis.cancelBtn,
                  kpis.saveChangesBtn,
                ];
                const elementNames = [
                  "email input",
                  "schedule select",
                  "cancel button",
                  "save changes button",
                ];
                for (let i = 0; i <= elements.length - 1; i++) {
                  await page
                    .waitForXPath(elements[i], {
                      visible: true,
                      timeout: 4000,
                    })
                    .then(async () => {
                      logger.info(`${elementNames[i]} visible properly`);
                      await page.waitForTimeout(4000);
                      if (i == 1) {
                        const elXpath = await page.$x(kpis.scheduleSelect);
                        await elXpath[0].click();
                        await page.waitForTimeout(4000);
                        logger.info("schedule select clicked");
                        const num = await getRandomNumberBetween(2, 4);
                        const LiXpath = await page.$x(kpis.scheduleLi(num));
                        await LiXpath[0].click();
                        await page.waitForTimeout(4000);
                        await page
                          .$eval(kpis.scheduleOn(num), (elem) => {
                            return elem.style.display !== "none";
                          })
                          .then(() => {
                            logger.info("schedule on display properly");
                          })
                          .catch(() => {
                            logger.error("schedule on not display properly");
                            errors.push("schedule on not display properly");
                          });
                      }
                    })
                    .catch(() => {
                      logger.error(`${elementNames[i]} not visible properly`);
                      errors.push(`${elementNames[i]} not visible properly`);
                    });
                }
                await page
                  .waitForXPath(kpis.cancelBtn, {
                    visible: true,
                    timeout: 4000,
                  })
                  .then(async () => {
                    logger.info("cancel button is available");
                    const cancelBtn = await page.$x(kpis.cancelBtn);
                    await cancelBtn[0].click();
                    await page.waitForTimeout(5000);
                    await page
                      .waitForSelector(kpis.popup, {
                        visible: true,
                        timeout: 4000,
                      })
                      .then(() => {
                        logger.error("cancel button not working properly");
                        errors.push("cancel button not working properly");
                      })
                      .catch(() => {
                        logger.info("cancel button  working properly");
                      });
                  })
                  .catch(() => {
                    logger.error("cancel button is not available");
                    errors.push("cancel button is not available");
                  });
              })
              .catch(() => {
                logger.error(
                  "schedule for mail trigger popup not display properly"
                );
                errors.push(
                  "schedule for mail trigger popup not display properly"
                );
              });
          })
          .catch(() => {
            logger.error("add recipient button not visible properly");
            errors.push("add recipient button not visible properly");
          })
          .catch(() => {
            logger.error(
              "inactivate email recipients popup not display properly"
            );
            errors.push(
              "inactivate email recipients popup not display properly"
            );
          });
      }
    } else {
      logger.error("KPI Score Card Settings page is not available!!!");
      errors.push("KPI Score Card Settings page is not available!!!");
    }
    ts.assert(
      errors.length == 0,
      `Errors in KPI Score Card Settings Page:${errors.join("\n")}`
    );
  } catch (error) {
    logger.error(error);
    errors.push(error);
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsKpiReportAdvGoalTest();
