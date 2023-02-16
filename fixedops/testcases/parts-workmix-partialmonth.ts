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
      name: `[DEMO-TEST] ${site.name} FixedOps Parts Workmix Partial Month Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "[DEMO-TEST]",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await partsWorkmixPartialMonthData(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Parts Workmix Partial Month Test";
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
async function partsWorkmixPartialMonthData(baseURL: string) {
  let browser = null;
  try {
    const oBrowser = await fixedopsCommonLogin(baseURL);
    const page = oBrowser.page;
    browser = oBrowser.browser;
    const navigationPromise = oBrowser.navigationPromise;
    await page.reload();
    await navigationPromise;
    await page.waitForTimeout(10000);

    await page.waitForSelector(pw.partsMenu);
    await page.click(pw.partsMenu);
    logger.info("Parts Menu clicked!!!");
    await page.waitForTimeout(5000);

    const partsWorkmixMenu = await page.$x(pw.partsWorkmixMenu);
    await partsWorkmixMenu[0].click();
    logger.info("Parts Workmix clicked!!!");
    await navigationPromise;
    await page.waitForTimeout(15000);

    const title = await page.title();
    if (title == "Parts Work Mix") {
      logger.info("Parts Workmix title verified!!!");
      await page.waitForXPath(pw.pwxDataAsOf);
      const dataAsOf = await page.$x(pw.pwxDataAsOf);
      const str: string = await await (
        await dataAsOf[0].getProperty("textContent")
      ).jsonValue();
      const dd = new Date(str.replace("Data as of:", "").trim());
      const currDate = dd.getDate();
      const igDate = [25, 26, 27, 28, 29, 30, 31];

      if (igDate.includes(currDate)) {
        await page
          .waitForSelector(pw.toggleBtn, {
            visible: true,
            timeout: 4000,
          })
          .then(() => {
            logger.info("toggle btn present,verification failed");
            errors.push("toggle btn present,verification failed");
          })
          .catch(() => {
            logger.info("toggle btn not present,verification success");
          });
      } else {
        logger.info("checking visibility of toggle btn");
        await page
          .waitForSelector(pw.toggleBtn, {
            visible: true,
            timeout: 4000,
          })
          .then(async () => {
            logger.info("toggle button visible properly");
            await page.waitForTimeout(5000);

            const el = await page.$x(pw.toggleSpan);
            let txt: string = await (
              await el[0].getProperty("textContent")
            ).jsonValue();
            txt.includes("Show Partial Month Data")
              ? logger.info("show partial month data verify success")
              : [
                  logger.error("show partial month data verify fail"),
                  errors.push("show partial month data verify fail"),
                ];
            await page.waitForTimeout(5000);
            await page.click(pw.toggleBtn);
            await page.waitForTimeout(5000);

            txt = await (await el[0].getProperty("textContent")).jsonValue();
            txt.includes("Hide Partial Month Data")
              ? logger.info("hide partial month data verify success")
              : [
                  logger.error("hide partial month data verify fail"),
                  errors.push("hide partial month data verify fail"),
                ];
          })
          .catch(() => {
            logger.info("toggle button not visible properly");
            errors.push("toggle button not visible properly");
          });
      }
    } else {
      logger.info("labor work miss title verify failed");
      errors.push("labor work miss title verify failed");
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
