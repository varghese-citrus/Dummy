import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { OpcodesmappingSelectors as ocms } from "../selectors/opcode-mapping.ts";
import { fixedopsCommonLogin } from "./common/fixedops-common-login.ts";
import { startLogger } from "../utilities/utils.ts";

const errors: string[] = [];
const logger = startLogger();

function fixedOpsOpcodeMappingTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[AEC-FOCP-UI-FN-LD-0147] ${site.name} FixedOps Opcode Mapping Statistics Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-UI-FN-LD-0147",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await OpCodeMappingTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Opcode Mapping Statistics Test";
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

async function OpCodeMappingTest(baseURL: string) {
  let browser = null;

  try {
    const oBrowser = await fixedopsCommonLogin(baseURL);
    const page = oBrowser.page;
    browser = oBrowser.browser;
    const navigationPromise = oBrowser.navigationPromise;
    await navigationPromise;
    await page.waitForTimeout(8000);
    await page.waitForSelector(ocms.Reference_setups);
    await page.click(ocms.Reference_setups);
    logger.info("Reference/setup Menu clicked");
    await page.waitForTimeout(5000);
    await page.waitForSelector(ocms.op_code_mapping);
    await page.click(ocms.op_code_mapping);
    logger.info("Op code mapping Menu clicked");
    await navigationPromise;
    await page.waitForTimeout(15000);
    const actual_title = await page.title();
    logger.info(actual_title);

    if (actual_title == "Opcode Mapping with Statistics") {
      logger.info("Op code Mapping page is visible!!!");
      const H_text = await page.$x(ocms.heading_text);
      const Heading_text_displayed: string = await (
        await H_text[0].getProperty("textContent")
      ).jsonValue();
      logger.info("Heading text: " + Heading_text_displayed);
      Heading_text_displayed == "Opcode Mapping with Statistics"
        ? logger.info("Op code Mapping-heading text  is visible!!!")
        : [
            logger.error("Op code Mapping-heading text  is  not visible!!!"),
            errors.push("Op code Mapping-heading text  is  not visible!!!"),
          ];
      await page
        .waitForSelector(ocms.resetBtn, {
          visible: true,
          timeout: 4000,
        })
        .then(() => {
          logger.info("reset layout button display properly");
        })
        .catch(() => {
          logger.info("reset layout button not properly displayed");
          errors.push("reset layout button not properly displayed");
        });
      await page
        .waitForXPath(ocms.opexportPdf, {
          visible: true,
          timeout: 2000,
        })
        .then(() => {
          logger.info("Export Button properly displayed");
        })
        .catch(() => {
          logger.error("Export Button not properly displayed");
          errors.push("Export Button not properly displayed");
        });
      await page
        .$eval(ocms.dataTab, (elem) => {
          return elem.style.display !== "none";
        })
        .then(() => {
          logger.info("Opcode Mapping Data display properly");
        })
        .catch(() => {
          logger.info("Opcode Mapping Data not properly displayed");
          errors.push("Opcode Mapping Data not properly displayed");
        });
    } else {
      logger.error("Op code Mapping page is not available!!!");
      errors.push("Op code Mapping page is not available!!!");
    }
    ts.assert(
      errors.length == 0,
      `Errors in op code Mapping Page:${errors.join("\n")}`
    );
  } catch (error) {
    logger.error(error);
    errors.push(error);
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsOpcodeMappingTest();
