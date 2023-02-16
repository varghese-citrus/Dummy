import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { SiteReleaseLogSelectors as slrs } from "../selectors/site-release.ts";
import { fixedopsCommonLogin } from "./common/fixedops-common-login.ts";
import { startLogger } from "../utilities/utils.ts";

const errors: string[] = [];
const logger = startLogger();

function fixedOpsitereleaselogTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[AEC-FOCP-UI-FN-LD-0216] ${site.name} FixedOps Site Release Log Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-UI-FN-LD-0216",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await SiteReleaseLogTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Site Release Log Test";
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

async function SiteReleaseLogTest(baseURL: string) {
  let browser = null;

  try {
    const oBrowser = await fixedopsCommonLogin(baseURL);
    const page = oBrowser.page;
    browser = oBrowser.browser;
    const navigationPromise = oBrowser.navigationPromise;
    const date_text = await page.$x(slrs.date_text);
    const Date_text_displayed: string = await (
      await date_text[0].getProperty("textContent")
    ).jsonValue();
    logger.info("Date text: " + Date_text_displayed);
    Date_text_displayed != ""
      ? logger.info("Date text  is visible!!!")
      : [
          logger.error("Date text  is  not visible!!!"),
          errors.push("Date text  is  not visible!!!"),
        ];
    const link_present = await page.waitForSelector(slrs.See_whatsnew, {
      visible: true,
      timeout: 4000,
    });
    if (link_present != null) {
      logger.info("See whats new link is available!!!");
      await page.waitForSelector(slrs.See_whatsnew);
      await page.click(slrs.See_whatsnew);
      logger.info("See What's New link clicked");
      await navigationPromise;
      await page.waitForTimeout(12000);
      const actual_title = await page.title();
      logger.info(actual_title);
      if (actual_title == "Changelog") {
        logger.info("Site release log page is visible!!!");
        const H_text = await page.$x(slrs.heading_text);
        const Heading_text_displayed: string = await (
          await H_text[0].getProperty("textContent")
        ).jsonValue();
        logger.info("Heading text: " + Heading_text_displayed);
        Heading_text_displayed != ""
          ? logger.info("Site release log-heading text  is visible!!!")
          : [
              logger.error("Site release log-heading text  is  not visible!!!"),
              errors.push("Site release log-heading text  is  not visible!!!"),
            ];
        await page
          .waitForXPath(slrs.enh_dataTab, {
            visible: true,
            timeout: 2000,
          })
          .then(() => {
            logger.info("Enhancement Data visible properly");
          })
          .catch(() => {
            logger.error(`Enhancement Data not display properly`);
            errors.push(`Enhancement Data not display properly`);
          });
        await page.waitForTimeout(2000);

        await page
          .waitForXPath(slrs.feat_dataTab, {
            visible: true,
            timeout: 2000,
          })
          .then(() => {
            logger.info("Features Data visible properly");
          })
          .catch(() => {
            logger.error(`Features Data not display properly`);
            errors.push(`Features Data not display properly`);
          });
        await page.waitForTimeout(2000);
      } else {
        logger.error("Site release log is not available!!!");
        errors.push("Site release log page is not available!!!");
      }
    } else {
      logger.error("See whats new link is not available!!!");
      errors.push("See whats new link is not available!!!");
    }
    ts.assert(
      errors.length == 0,
      `Errors in Site release log Page:${errors.join("\n")}`
    );
  } catch (error) {
    console.log(error);
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsitereleaselogTest();
