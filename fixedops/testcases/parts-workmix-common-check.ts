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
      name: `[AEC-FOCP-UI-FN-LD-0184] ${site.name} FixedOps Parts Workmix Common Check Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "[AEC-FOCP-UI-FN-LD-0184]",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await partsWorkmixCommonCheckTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Parts Workmix Common Check Test";
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

async function partsWorkmixCommonCheckTest(baseURL: string) {
  let browser = null;

  try {
    const oBrowser = await fixedopsCommonLogin(baseURL);
    const page = oBrowser.page;
    browser = oBrowser.browser;
    const navigationPromise = oBrowser.navigationPromise;
    await page.waitForSelector(pw.partsMenu);
    await page.click(pw.partsMenu);
    logger.info("Parts menu button clicked");
    const partsWorkmixMenu = await page.$x(pw.partsWorkmixMenu);
    await partsWorkmixMenu[0].click();
    await navigationPromise;
    await page.waitForTimeout(15000);
    logger.info("Parts Workmix menu clicked");
    const title = await page.title();
    if (title == "Parts Work Mix") {
      logger.info("Parts WorkMix page title verified success");
      await page.waitForTimeout(5000);
      await page.waitForXPath(pw.pwxDataAsOf);
      const x = await page.$x(pw.pwxDataAsOf);
      const str: string = await (
        await x[0].getProperty("textContent")
      ).jsonValue();

      str.toString().split(":")[0].includes("Data as of")
        ? logger.info("Data as of properly visible")
        : [
            logger.error("Data as of not properly visible"),
            errors.push("Data as of not properly visible"),
          ];

      await page
        .waitForSelector(pw.resetBtn, { visible: true, timeout: 4000 })
        .then(() => {
          logger.error(
            "reset layout button present under work mix tab,verification failed"
          );
          errors.push(
            "reset layout button present under work mix tab,verification failed"
          );
        })
        .catch(() => {
          logger.info(
            "reset layout button not present under work mix tab,verification success"
          );
        });
      await page.waitForTimeout(5000);
      for (let i = 1; i <= 6; i++) {
        await page
          .waitForSelector(pw.wrkMixChartInfoIcon(i), {
            visible: true,
            timeout: 4000,
          })
          .then(() => {
            logger.info(`info icon ${i} visible properly`);
          })
          .catch(() => {
            logger.error(`info icon ${i} not visible properly`);
            errors.push(`info icon ${i} not visible properly`);
          });
        await page.waitForTimeout(3000);
      }
    } else {
      logger.error("Parts workmix title verify failed");
      errors.push("Parts workmix title verify failed");
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
