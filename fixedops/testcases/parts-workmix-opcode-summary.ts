import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { fixedopsCommonLogin } from "./common/fixedops-common-login.ts";
import { PartsWorkmixSelectors as pw } from "../selectors/parts-work-mix.ts";
import { startLogger } from "../utilities/utils.ts";

const logger = startLogger();
const errors: string[] = [];

function fixedOpsPartsWorkmixTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[AEC-FOCP-UI-FN-LD-0200] ${site.name} FixedOps Parts Workmix Opcode Summary Page Check`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "[AEC-FOCP-UI-FN-LD-0200]",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await partsWorkmixOpcodeSummaryPageCheck(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Parts Workmix Opcode Summary Page Check";
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

async function partsWorkmixOpcodeSummaryPageCheck(baseURL: string) {
  let browser = null;
  try {
    const oBrowser = await fixedopsCommonLogin(baseURL);
    const page = oBrowser.page;
    browser = oBrowser.browser;
    const navigationPromise = oBrowser.navigationPromise;
    await page.waitForSelector(pw.partsMenu);
    await page.click(pw.partsMenu);
    logger.info("Parts Menu clicked");
    await page.waitForTimeout(5000);
    const partsWorkmixMenu = await page.$x(pw.partsWorkmixMenu);
    await partsWorkmixMenu[0].click();
    logger.info("Parts Workmix menu clicked");
    await navigationPromise;
    await page.waitForTimeout(15000);
    const title = await page.title();
    if (title == "Parts Work Mix") {
      logger.info("Parts workmix title verified");
      const opcodeSummary = await page.$x(pw.opcodeSummaryTab);
      await opcodeSummary[0].click();
      logger.info("Opcode Summary Tab clicked");
      await page.waitForTimeout(10000);
      await page
        .$eval(pw.opcodeSummaryTable, (elem) => {
          return elem.style.display !== "none";
        })
        .then(() => {
          logger.info("Opcode summary table is displayed properly");
        })
        .catch(() => {
          logger.error("Opcode summary table is not displayed properly");
          errors.push("Opcode summary table is not displayed properly");
        });
      await page.waitForTimeout(10000);
      await page
        .waitForSelector(pw.resetLayoutBtn, {
          visible: true,
          timeout: 4000,
        })
        .then(() => {
          logger.info("Reset Button visible properly");
        })
        .catch(() => {
          logger.error("Reset Button not visible properly");
          errors.push("Reset Button not visible properly");
        });
      await page.waitForTimeout(2000);
      await page
        .waitForSelector(pw.downloadBtn, {
          visible: true,
          timeout: 4000,
        })
        .then(() => {
          logger.info("Download button visible properly");
        })
        .catch(() => {
          logger.error("Download button not visible properly");
          errors.push("Download button not visible properly");
        });
      await page.waitForXPath(pw.monthDataAsOf);
      const x = await page.$x(pw.monthDataAsOf);
      const str: string = await (
        await x[0].getProperty("textContent")
      ).jsonValue();
      str.toString().split(":")[0].includes("Data as of")
        ? logger.info("Data as of properly visible")
        : [
            logger.error("Data as of not properly visible"),
            errors.push("Data as of not properly visible"),
          ];
    } else {
      logger.error("Parts workmix title verified fail");
      errors.push("Parts workmix title verified fail");
    }
    ts.assert(
      errors.length == 0,
      `Error in  Parts Workmix: ${errors.join("\n")}`
    );
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsPartsWorkmixTest();
