import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { LaborWorkMiss as lw } from "../selectors/labor-work-mix.ts";
import { fixedopsCommonLogin } from "./common/fixedops-common-login.ts";
import { startLogger } from "../utilities/utils.ts";

const logger = startLogger();
const errors: string[] = [];

function fixedOpsLaborWorkMixTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[AEC-FOCP-UI-FN-LD-0115] ${site.name} FixedOps Labor Work Mix Page Common Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-UI-FN-LD-0115",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await laborWorkMixPageCommonTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "FixedOps Labor Work Mix Page Common Test";
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

async function laborWorkMixPageCommonTest(baseURL: string) {
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
      logger.info("labor workmix title verify success");

      await page.waitForXPath(lw.lbrWrkMissDataAsOf);
      const x = await page.$x(lw.lbrWrkMissDataAsOf);
      const str: string = await (
        await x[0].getProperty("textContent")
      ).jsonValue();

      str.split(":")[0].includes("Data as of")
        ? logger.info("data as of field properly displayed")
        : [
            logger.info("data as of field not properly displayed"),
            errors.push("data as of field not properly displayed"),
          ];

      await page
        .waitForSelector(lw.resetBtn, { visible: true, timeout: 4000 })
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
      await page.waitForTimeout(10000);
      for (let i = 1; i <= 6; i++) {
        await page
          .waitForSelector(lw.wrkMixChartInfoIcon(i), {
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
      logger.error("labor work miss title verify failed");
      errors.push("labor work miss title verify failed");
    }
    ts.assert(
      errors.length == 0,
      `Error in Labor Workmix Page: ${errors.join("\n")}`
    );
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsLaborWorkMixTest();
