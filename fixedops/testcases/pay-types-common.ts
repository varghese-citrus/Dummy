import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { PayTypesSelectors as pt } from "../selectors/pay-types.ts";
import { fixedopsCommonLogin } from "./common/fixedops-common-login.ts";
import { startLogger } from "../utilities/utils.ts";

const errors: string[] = [];
const logger = startLogger();

function fixedOpsPayTypesTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[AEC-FOCP-UI-FN-LD-0206] ${site.name} FixedOps Pay Types Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-UI-FN-LD-0206",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await payTypesPageTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Pay Types Test";
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

async function payTypesPageTest(baseURL: string) {
  let browser = null;

  try {
    const oBrowser = await fixedopsCommonLogin(baseURL);
    const page = oBrowser.page;
    browser = oBrowser.browser;
    const navigationPromise = oBrowser.navigationPromise;
    await navigationPromise;
    await page.waitForSelector(pt.referenceAndsetupsLink);
    await page.click(pt.referenceAndsetupsLink);
    logger.info("reference and setup link clicked");
    await page.waitForTimeout(5000);
    await page.waitForSelector(pt.payTypesLink);
    await page.click(pt.payTypesLink);
    logger.info("pay types link clicked");
    await navigationPromise;
    await page.waitForTimeout(12000);
    const title = await page.title();

    if (title == "Pay Types") {
      logger.info("pay types title verify success");
      await page.waitForTimeout(2000);
      const el = await page.$x(pt.userIcon);
      await el[0].click();
      const roleSpan = await page.$x(pt.roleSpan);
      const role: string = await (
        await roleSpan[0].getProperty("textContent")
      ).jsonValue();
      const roleStr = role.split(":")[1].trim();
      const elements = [
        pt.payTypesTab,
        pt.downloadIcon,
        pt.resetBtn,
        pt.saveChanges,
        pt.reprocessDataHistory,
      ];
      const elementNames = [
        "pay types tab",
        "download button",
        "reset button",
        "save changes button",
        "reprocess data history button",
      ];
      if (roleStr == "Armatus Admin" || roleStr == "Store Admin") {
        for (let k = 0; k < elements.length; k++) {
          await page
            .waitForXPath(elements[k], {
              visible: true,
              timeout: 4000,
            })
            .then(() => {
              logger.info(`${elementNames[k]} display properly`);
            })
            .catch(() => {
              logger.warn(`${elementNames[k]} not available for this tenant`);
            });
          await page.waitForTimeout(2000);
        }

        const dataTable = await page.$eval(pt.dataTable, (elem) => {
          return elem.style.display !== "none";
        });
        await page.waitForTimeout(5000);
        if (dataTable) {
          logger.info("data table visible properly");
          await page.waitForTimeout(5000);
          await page
            .waitForXPath(pt.editButton, { visible: true, timeout: 4000 })
            .then(() => {
              logger.info("edit button visible properly");
            })
            .catch(() => {
              logger.warn("edit button not available due to CDK stores");
            });
        } else {
          logger.error("data table not visible properly");
          errors.push("data table not visible properly");
        }
      } else {
        for (let k = 0; k < elements.length; k++) {
          if (k == 3 || k == 4) {
            continue;
          } else {
            await page
              .waitForXPath(elements[k], {
                visible: true,
                timeout: 4000,
              })
              .then(() => {
                logger.info(`${elementNames[k]} display properly`);
              })
              .catch(() => {
                logger.error(`${elementNames[k]} display properly`);
                errors.push(`${elementNames[k]} display properly`);
              });
            await page.waitForTimeout(2000);
          }
        }
        await page
          .$eval(pt.dataTable, (elem) => {
            return elem.style.display !== "none";
          })
          .then(() => {
            logger.info("data table display properly");
          })
          .catch(() => {
            logger.error("data table not display properly");
            errors.push("data table not display properly");
          });
        await page.waitForTimeout(5000);
      }
    } else {
      logger.error("pay types title verify failed");
      errors.push("pay types title verify failed");
    }
    ts.assert(
      errors.length == 0,
      `Error in Pay Types Page:${errors.join("\n")}`
    );
  } catch (error) {
    logger.error(error);
    errors.push(error);
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsPayTypesTest();
