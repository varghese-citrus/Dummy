import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { OpcodeCategorizationSelectors as oc } from "../selectors/opcode-categorizations.ts";
import { fixedopsCommonLogin } from "./common/fixedops-common-login.ts";
import { startLogger } from "../utilities/utils.ts";

const logger = startLogger();
const errors: string[] = [];

function fixedOpsOpcodeCategorizationsTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[AEC-FOCP-UI-FN-LD-0146] ${site.name} FixedOps Opcode Categorizations Page Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-UI-FN-LD-0146",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await opcodeCategorizationPageTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Opcode Categorizations Page Test";
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

async function opcodeCategorizationPageTest(baseURL: string) {
  let browser = null;

  try {
    const oBrowser = await fixedopsCommonLogin(baseURL);
    const page = oBrowser.page;
    browser = oBrowser.browser;
    const navigationPromise = oBrowser.navigationPromise;
    await navigationPromise;
    await page.waitForTimeout(10000);
    await page.waitForSelector(oc.referenceAndSetupLink);
    await page.click(oc.referenceAndSetupLink);
    logger.info("reference/setups expand collapse link clicked");
    await page.waitForTimeout(4000);
    await page.waitForSelector(oc.opcodeCategorizationLink);
    await page.click(oc.opcodeCategorizationLink);
    await navigationPromise;
    await page.waitForTimeout(12000);
    logger.info("labor grid link clicked");
    const title = await page.title();
    if (title == "Opcode Categorizations") {
      logger.info("opcode categorizations title verify success");
      await page.waitForTimeout(2000);
      const heading = await page.$x(oc.heading);
      const pageHeading = await (
        await heading[0].getProperty("textContent")
      ).jsonValue();
      await page.waitForTimeout(2000);
      if (pageHeading == "Opcode Categorizations") {
        logger.info("opcode categorizations heading verify success");
        const ids_arr2 = [
          oc.downloadBtn,
          oc.resetBtn,
          oc.dataTable,
          oc.editBtn,
        ];
        const btnName = [
          "download button",
          "reset button",
          "data table",
          "edit button",
        ];
        await page.waitForTimeout(2000);

        for (let i = 0; i < ids_arr2.length; i++) {
          if (i == 3) {
            await page
              .waitForXPath(oc.editBtn, {
                visible: true,
                timeout: 4000,
              })
              .then(() => {
                logger.info(`${btnName[i]} visible properly`);
              })
              .catch(() => {
                logger.warn(
                  `${btnName[i]} not available due to access privilege`
                );
              });
          } else {
            await page
              .waitForSelector(ids_arr2[i], {
                visible: true,
                timeout: 4000,
              })
              .then(() => {
                logger.info(`${btnName[i]} display properly`);
              })
              .catch(() => {
                logger.error(`${btnName[i]} not display properly`);
                errors.push(`${btnName[i]} not display properly`);
              });
            await page.waitForTimeout(2000);
          }
        }
      } else {
        logger.error("opcode categorizations heading verify failed");
        errors.push("opcode categorizations heading verify failed");
      }
    } else {
      logger.error("opcode categorizations title verify failed");
      errors.push("opcode categorizations title verify failed");
    }
    ts.assert(
      errors.length == 0,
      `Error in Opcode Categorization Page: ${errors.join("\n")}`
    );
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsOpcodeCategorizationsTest();
