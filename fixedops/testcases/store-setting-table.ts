import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { StoreSettingSelectors as ss } from "../selectors/store-setting.ts";
import { fixedopsCommonLogin } from "./common/fixedops-common-login.ts";
import { startLogger } from "../utilities/utils.ts";

const logger = startLogger();
const errors: string[] = [];

function fixedOpsStoreSettingTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[AEC-FOCP-UI-FN-LD-0003] ${site.name} FixedOps Store Setting Page Table Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "[AEC-FOCP-UI-FN-LD-0003]",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await storeSettingPageTableTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Store Setting Page Table Test";
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

async function storeSettingPageTableTest(baseURL: string) {
  let browser = null;

  try {
    const oBrowser = await fixedopsCommonLogin(baseURL);
    const page = oBrowser.page;
    browser = oBrowser.browser;
    const navigationPromise = oBrowser.navigationPromise;

    await navigationPromise;
    await page.waitForTimeout(10000);

    const role = Deno.env.get("ROLE");

    if (role?.includes("admin")) {
      await page.waitForSelector(ss.armatusAdminLink);
      await page.click(ss.armatusAdminLink);
      logger.info("armatus admin expand collapse link clicked!!!");
      await page.waitForTimeout(4000);

      await page.waitForSelector(ss.storeSettingLink);
      await page.click(ss.storeSettingLink);
      await navigationPromise;
      await page.waitForTimeout(12000);
      logger.info("store setting link clicked!!!");
      const title = await page.title();
      if (title == "Store Settings") {
        logger.info("Store Settings title verify success");
        await page.waitForTimeout(2000);

        await page
          .waitForXPath(ss.timezoneDiv, {
            visible: true,
            timeout: 2000,
          })
          .then(() => {
            logger.info("timezone select visible properly");
          })
          .catch(() => {
            logger.error("timezone select not visible properly");
            errors.push("timezone select not visible properly");
          });
        await page.waitForTimeout(4000);
        await page
          .waitForSelector(ss.storeTable, {
            visible: true,
            timeout: 4000,
          })
          .then(() => {
            logger.info("store settings table visible properly");
          })
          .catch(() => {
            logger.error("store settings table not visible properly");
            errors.push("store settings table not visible properly");
          });
      } else {
        logger.error("Store Settings title verify failed");
        errors.push("Store Settings title verify failed");
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
