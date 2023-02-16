import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { StoreSettingSelectors as ss } from "../selectors/store-setting.ts";
import { fixedopsCommonLogin } from "./common/fixedops-common-login.ts";
import { startLogger } from "../utilities/utils.ts";

const logger = await startLogger();

const errors: string[] = [];

function fixedOpsStoreSettingTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[AEC-FOCP-UI-FN-LD-0003] ${site.name} FixedOps Store Setting Page Common Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-UI-FN-LD-0003",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await storeSettingPageCommonTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Store Setting Page Common Test";
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

async function storeSettingPageCommonTest(baseURL: string) {
  let browser = null;

  try {
    const oBrowser = await fixedopsCommonLogin(baseURL);
    const page = oBrowser.page;
    browser = oBrowser.browser;
    const navigationPromise = oBrowser.navigationPromise;

    await navigationPromise;
    await page.waitForTimeout(10000);

    const role = Deno.env.get("ROLE");

    if (role == "admin") {
      await page.waitForSelector(ss.armatusAdminLink);
      await page.click(ss.armatusAdminLink);
      logger.info("armatus admin expand collapse link clicked!!!");
      await page.waitForTimeout(4000);

      await page.waitForSelector(ss.storeSettingLink);
      await page.click(ss.storeSettingLink);
      await navigationPromise;
      await page.waitForTimeout(10000);
      logger.info("store setting link clicked!!!");

      const title = await page.title();

      if (title == "Store Settings") {
        logger.info("Store Setting title verify success");
        await page.waitForTimeout(2000);
        const heading = await page.$x(ss.storeHeading);
        const pageHeading = await (
          await heading[0].getProperty("textContent")
        ).jsonValue();
        await page.waitForTimeout(2000);
        if (pageHeading == "Store Settings") {
          logger.info("Store Setting heading verify success");
          const storeTable = await page.$eval(ss.storeTable, (elem) => {
            return elem.style.display !== "none";
          });
          await page.waitForTimeout(4000);
          storeTable
            ? logger.info("store table visible properly")
            : [
                logger.error("store table not visible properly"),
                errors.push("store table not visible properly"),
              ];

          const timezone = await page.waitForXPath(ss.timezoneDiv, {
            visible: true,
            timeout: 2000,
          });
          await page.waitForTimeout(4000);
          timezone != null
            ? logger.info("timezone select visible properly")
            : [
                logger.error("timezone select not visible properly"),
                errors.push("timezone select not visible properly"),
              ];

          const saveAllBtn = await page.$eval(ss.saveAllBtn, (elem) => {
            return elem.style.display !== "none";
          });
          await page.waitForTimeout(4000);
          saveAllBtn
            ? logger.info("save button visible properly")
            : [
                logger.error("save button not visible properly"),
                errors.push("save button not visible properly"),
              ];
        } else {
          logger.error("Store Setting heading verify failed");
          errors.push("Store Setting heading verify failed");
        }
      } else {
        logger.error("Store Setting title verify failed");
        errors.push("Store Setting title verify failed");
      }
    } else {
      logger.warn(
        "role is not admin!,please provide admin as role for further testing"
      );
    }

    ts.assert(
      errors.length == 0,
      `Error in Special Metrics Page: ${errors.join("\n")}`
    );
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsStoreSettingTest();
