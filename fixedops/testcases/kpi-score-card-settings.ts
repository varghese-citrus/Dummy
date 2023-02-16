import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { kpiscorecardSettingsSelectors as kpis } from "../selectors/kpi-score-card.ts";
import { fixedopsCommonLogin } from "./common/fixedops-common-login.ts";
import { startLogger } from "../utilities/utils.ts";

const errors: string[] = [];
const logger = startLogger();

function fixedOpskpiscorecardTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[DEMO-TEST] ${site.name} KPI Score Card Settings Test`,
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
          await kpiscore_card_settings_Test(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps KPI Score Card Settings Test";
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

async function kpiscore_card_settings_Test(baseURL: string) {
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
          .$eval(kpis.storeTable, (elem) => {
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
        await page.waitForSelector(kpis.editBtn);
        await page.click(kpis.editBtn);
        logger.info("Edit button clicked");
        await page.waitForTimeout(5000);

        await page
          .waitForSelector(kpis.editableInpField, {
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
          .waitForSelector(kpis.saveGoalStoreBtn, {
            visible: true,
            timeout: 4000,
          })
          .then(() => {
            logger.info("Save goal button display properly under Store goals");
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
          .waitForXPath(kpis.reportEmailBtn, {
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
          .$eval(kpis.reportEmailBox, (elem) => {
            return elem.style.display !== "none";
          })
          .then(async () => {
            const emailBox = await page.waitForSelector(kpis.reportEmailBox, {
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
            const repEmaltbtnXpath = await page.$x(kpis.reportEmailChk);
            await repEmaltbtnXpath[0].click();
            await page.waitForTimeout(5000);
            logger.info("Report email checkbox clicked");
            const emailBox = await page.waitForSelector(kpis.reportEmailBox, {
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
      } else {
        await page.waitForTimeout(2000);
        const heading = await page.$x(kpis.kpiSettingsHeading);
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
        const storeheading = await page.$x(kpis.storeGoalsHeading);
        const goalHeading = await (
          await storeheading[0].getProperty("textContent")
        ).jsonValue();
        await page.waitForTimeout(2000);
        goalHeading == "Store Goals"
          ? logger.info("KPI Store goals Heading verify success")
          : [
              logger.error("KPI Store goals  heading verify failed"),
              errors.push("KPI Store goals Settings heading verify failed"),
            ];
        const advheading = await page.$x(kpis.advGoalsHeading);
        const goaladvheading = await (
          await advheading[0].getProperty("textContent")
        ).jsonValue();
        await page.waitForTimeout(2000);
        goaladvheading == "Advisor Goals"
          ? logger.info("KPI Advisor goals Heading verify success")
          : [
              logger.error("KPI Advisor goals  heading verify failed"),
              errors.push("KPI Advisor goals Settings heading verify failed"),
            ];
        await page.waitForTimeout(10000);
        const storekpiData = await page.$eval(kpis.storeTable, (elem) => {
          return elem.style.display !== "none";
        });
        storekpiData
          ? logger.info("KPI Store Goal Report Data display properly")
          : [
              logger.info("KPI Store Goal Report Data not properly displayed"),
              errors.push("KPI Store Goal Report Data not properly displayed"),
            ];
        await page.waitForTimeout(4000);
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
fixedOpskpiscorecardTest();
