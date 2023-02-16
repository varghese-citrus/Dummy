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
      name: `[DEMO-TEST] ${site.name} FixedOps Labor Work Mix Page Partial Month Data Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "DEMO-TEST",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await laborWorkMixPagePartialMonthDataTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Labor Work Mix Page Partial Month Data Test";
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

async function laborWorkMixPagePartialMonthDataTest(baseURL: string) {
  let browser = null;

  try {
    const oBrowser = await fixedopsCommonLogin(baseURL);
    const page = oBrowser.page;
    browser = oBrowser.browser;
    const navigationPromise = oBrowser.navigationPromise;
    await page.reload();
    await navigationPromise;
    await page.waitForTimeout(15000);
    await page.waitForSelector(lw.labor);
    await page.click(lw.labor);
    logger.info("labor expand collapse link clicked!!!");
    await page.waitForTimeout(5000);
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

      const dd = new Date(str.replace("Data as of:", "").trim());

      const currDate = dd.getDate();
      const igDate = [25, 26, 27, 28, 29, 30, 31];

      if (igDate.includes(currDate)) {
        await page
          .waitForSelector(lw.toggleBtn, {
            visible: true,
            timeout: 4000,
          })
          .then(() => {
            logger.error("toggle btn present,verification failed");
            errors.push("toggle btn present,verification failed");
          })
          .catch(() => {
            logger.info("toggle btn not present,verification success");
          });
      } else {
        logger.info("checking visibility of toggle btn");
        await page.waitForTimeout(5000);

        await page
          .waitForSelector(lw.toggleBtn, {
            visible: true,
            timeout: 4000,
          })
          .then(async () => {
            logger.info("toggle button visible properly");
            await page.waitForTimeout(5000);

            const el = await page.$x(lw.toggleSpan);
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
            await page.click(lw.toggleBtn);
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
            logger.error("toggle button not visible properly");
            errors.push("toggle button not visible properly");
          });

        const toggle = await page.waitForXPath(lw.toggleBtn, {
          visible: true,
        });
        toggle != null
          ? logger.info("toggle button visible properly")
          : [
              logger.info("toggle button not visible properly"),
              errors.push("toggle button not visible properly"),
            ];
        const span = await page.waitForXPath(lw.partialMonSpan, {
          visible: true,
        });

        span
          ? logger.info("partial month span visible properly")
          : [
              logger.info("partial month span not visible properly"),
              errors.push("partial month span not visible properly"),
            ];

        const xpath_1 = await page.$x(lw.toggleBtn);
        await xpath_1[0].click();
        await page.mouse.move(0, 200);
        await page.waitForTimeout(5000);

        const el = await page.$x(lw.showHideDiv);
        const title_1: string = await page.evaluate((e) => e.title, el[0]);

        title_1.includes("Hide Partial Month Data")
          ? logger.info("show partial month data success")
          : [
              logger.info("show partial month data fail"),
              errors.push("show partial month data fail"),
            ];

        const xpath_2 = await page.$x(lw.toggleBtn);
        await xpath_2[0].click();

        await page.mouse.move(0, 300);
        await page.waitForTimeout(5000);

        const ele = await page.$x(lw.showHideDiv);
        const title_2: string = await page.evaluate((e) => e.title, ele[0]);

        title_2.includes("Show Partial Month Data")
          ? logger.info("hide partial month data success")
          : [
              logger.info("hide partial month data fail"),
              errors.push("hide partial month data fail"),
            ];
      }
    } else {
      logger.info("labor work miss title verify failed");
      errors.push("labor work miss title verify failed");
    }

    ts.assert(
      errors.length == 0,
      `Error in  Labor Workmix Page: ${errors.join("\n")}`
    );
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsLaborWorkMixTest();
