import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { fixedopsCommonLogin } from "./common/fixedops-common-login.ts";
import { PartsWorkmixSelectors as pw } from "../selectors/parts-work-mix.ts";
import { getRandomNumberBetween } from "../utilities/utils.ts";
import { startLogger } from "../utilities/utils.ts";

const logger = startLogger();
const errors: string[] = [];

function fixedOpsPartsWorkmixTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[AEC-FOCP-UI-FN-LD-0186] ${site.name} FixedOps Parts Workmix Opcode Detail Page Check`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "[AEC-FOCP-UI-FN-LD-0186]",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await partsWorkmixOpcodeDetailPageCheck(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Parts Workmix Opcode Detail Page Check";
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

async function partsWorkmixOpcodeDetailPageCheck(baseURL: string) {
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
      await page.waitForSelector(pw.opCodeDetailViewTab);
      await page.click(pw.opCodeDetailViewTab);
      await page.waitForTimeout(25000);
      logger.info("Opcode detail view tab clicked!!!");

      await page
        .$eval(pw.opCodeDetailViewTable, (elem) => {
          return elem.style.display !== "none";
        })
        .then(() => {
          logger.info("Opcode detail summary table is present");
        })
        .catch(() => {
          logger.error("Opcode detail summary table is not present");
          errors.push("Opcode detail summary table is not present");
        });
      await page.waitForTimeout(2000);
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
      await page.waitForSelector(pw.opcodeMonthSelector);
      await page.click(pw.opcodeMonthSelector);
      await page.waitForTimeout(4000);
      logger.info("Month selector clicked");
      const num = await getRandomNumberBetween(1, 12);
      const month = await page.$x(pw.getMonth(num));
      await month[0].click();
      logger.info("Month selected from the dropdown");
      await page.waitForTimeout(4000);
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
      `Error in Parts Workmix: ${errors.join("\n")}`
    );
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsPartsWorkmixTest();
