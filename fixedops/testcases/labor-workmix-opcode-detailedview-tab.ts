import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { LaborWorkMiss as lw } from "../selectors/labor-work-mix.ts";
import { fixedopsCommonLogin } from "./common/fixedops-common-login.ts";
import { getRandomNumberBetween, startLogger } from "../utilities/utils.ts";

const logger = startLogger();
const errors: string[] = [];

function fixedOpsLaborWorkMixTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[AEC-FOCP-UI-FN-LD-0128] ${site.name} FixedOps Labor Work Mix Page Opcode Detailed View Tab Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-UI-FN-LD-0128",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await laborWorkMixPageOpcodeDetailedViewTabTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Labor Work Mix Page Opcode Detailed View Tab Test";
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

async function laborWorkMixPageOpcodeDetailedViewTabTest(baseURL: string) {
  let browser = null;

  try {
    const oBrowser = await fixedopsCommonLogin(baseURL);
    const page = oBrowser.page;
    browser = oBrowser.browser;
    const navigationPromise = oBrowser.navigationPromise;
    await page.reload();
    await navigationPromise;
    await page.waitForTimeout(10000);
    await page.waitForSelector(lw.labor);
    await page.click(lw.labor);
    logger.info("labor expand collapse link clicked!!!");
    await page.waitForTimeout(4000);
    const laborWrkMix = await page.$x(lw.laborWorkMixLink);
    await laborWrkMix[0].click();
    await navigationPromise;
    await page.waitForTimeout(15000);
    logger.info("labor work mix link clicked!!!");
    const title = await page.title();
    if (title == "Labor Work Mix") {
      logger.info("labor work miss title verify success");
      await page.waitForSelector(lw.opcodeSummeryTab);
      await page
        .waitForSelector(lw.opcodeDetailedViewTab, {
          visible: true,
          timeout: 4000,
        })
        .then(() => {
          logger.info("opcode detailed view tab display properly");
        })
        .catch(() => {
          logger.error("opcode detailed view tab not display properly");
          errors.push("opcode detailed view tab not display properly");
        });
      await page.click(lw.opcodeDetailedViewTab);
      await page.waitForTimeout(10000);
      logger.info("opcode detailed view tab clicked");
      const monthSelect = await page.$x(lw.opcodeDetailedViewMonthSelect);
      await monthSelect[0].click();
      await page.waitForTimeout(4000);
      const num = await getRandomNumberBetween(1, 12);
      const month = await page.$x(lw.getMonth(num));
      await month[0].click();
      await page.waitForTimeout(15000);
      logger.info("month selected");
      await page
        .$eval(lw.opcodeTable, (elem) => {
          return elem.style.display !== "none";
        })
        .then(() => {
          logger.info("opcode detailed view table display properly");
        })
        .catch(() => {
          logger.error("opcode detailed view table not display properly");
          errors.push("opcode detailed view table not display properly");
        });
      await page.waitForTimeout(4000);
      await page.waitForSelector(lw.opcodeColumnToggleBtn);
      await page.click(lw.opcodeColumnToggleBtn);
      await page.waitForTimeout(4000);
      await page
        .waitForXPath(lw.opcodeColumnSelBox, {
          visible: true,
          timeout: 4000,
        })
        .then(() => {
          logger.info("column select box display properly");
        })
        .catch(() => {
          logger.error("column select box not display properly");
          errors.push("column select box not display properly");
        });
      await page.waitForTimeout(4000);
      await page.waitForSelector(lw.opcodeFilterToggleBtn);
      await page.click(lw.opcodeFilterToggleBtn);
      await page.waitForTimeout(4000);
      const opcodeFilterSelect = await page.waitForXPath(
        lw.opcodeFilterSelBox,
        {
          visible: true,
          timeout: 4000,
        }
      );
      await page.waitForTimeout(4000);
      opcodeFilterSelect != null
        ? logger.info("filter select box display properly")
        : [
            logger.error("filter select box not display properly"),
            errors.push("filter select box not display properly"),
          ];
      ts.assert(
        errors.length == 0,
        `Error in Labor Workmix Page: ${errors.join("\n")}`
      );
    } else {
      logger.error("labor workmix title verify failed");
      errors.push("labor workmix title verify failed");
    }
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsLaborWorkMixTest();
