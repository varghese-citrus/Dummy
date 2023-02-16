import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { PartsWorkmixSelectors as pw } from "../selectors/parts-work-mix.ts";
import { fixedopsCommonLogin } from "./common/fixedops-common-login.ts";
import { getRandomNumberBetween, startLogger } from "../utilities/utils.ts";

const logger = startLogger();
const errors: string[] = [];

function fixedOpsPartsWorkmixTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[AEC-FOCP-UI-FN-LD-0195] ${site.name} FixedOps Parts Workmix Page Month Comparison View Detail Button Drill Down Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-UI-FN-LD-0195",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await partsWorkmixPageMonthCmpViewDetailBtnDrillDownTest(
            site.baseURL
          );
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Labor Workmix Page Month Comparison View Detail Button Drill Down Test";
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

async function partsWorkmixPageMonthCmpViewDetailBtnDrillDownTest(
  baseURL: string
) {
  let browser = null;

  try {
    const oBrowser = await fixedopsCommonLogin(baseURL);
    const page = oBrowser.page;
    browser = oBrowser.browser;
    const navigationPromise = oBrowser.navigationPromise;
    await page.waitForSelector(pw.partsMenu);
    await page.click(pw.partsMenu);
    logger.info("Parts Menu clicked!!!");
    await navigationPromise;
    await page.waitForTimeout(5000);
    const partsWorkmixdashboard = await page.$x(pw.partsWorkmixMenu);
    await partsWorkmixdashboard[0].click();
    logger.info("Parts Workmix dashboard clicked");
    await navigationPromise;
    await page.waitForTimeout(15000);
    const monthWorkmixTab = await page.$x(pw.monthWrkMixTab);
    await monthWorkmixTab[0].click();
    await navigationPromise;
    await page.waitForTimeout(10000);
    logger.info("parts work mix 2 month comparison tab clicked");
    const title = await page.title();
    if (title == "Parts Work Mix") {
      logger.info("Parts Work Mix title verify success");
      const elements = [pw.editBtn, pw.backBtn, pw.dataAsOf];
      const elementsName = ["edit button", "back button", "data as of"];
      const num1 = await getRandomNumberBetween(2, 6);
      await page.waitForXPath(pw.getMonthCmpViewDetailBtn(num1));
      const viewDetailBtn = await page.$x(pw.getMonthCmpViewDetailBtn(num1));
      await viewDetailBtn[0].click();
      await navigationPromise;
      await page.waitForTimeout(5000);
      const title = await page.title();
      if (title == "Overview") {
        logger.info("view detail button navigation success");
        await page.waitForTimeout(10000);
        await page
          .waitForSelector(pw.overviewContainer, {
            visible: true,
            timeout: 4000,
          })
          .then(() => {
            logger.info("parts workmix overview container display properly");
          })
          .catch(() => {
            logger.error(
              "parts workmix overview container not display properly"
            );
            errors.push(
              "parts workmix overview container not display properly"
            );
          });
        await page.waitForTimeout(2000);
        await page.waitForXPath(pw.overviewCanvas);
        await page
          .waitForXPath(pw.overviewCanvas, {
            visible: true,
            timeout: 2000,
          })
          .then(() => {
            logger.info("graph displayed properly in overview page");
          })
          .catch(() => {
            logger.error("graph not displayed properly in overview page");
            errors.push("graph not displayed properly in overview page");
          });
        await page.waitForTimeout(2000);
        for (let k = 0; k <= elements.length - 1; k++) {
          await page
            .waitForXPath(elements[k], {
              visible: true,
              timeout: 2000,
            })
            .then(() => {
              logger.info(`${elementsName[k]} displayed properly`);
            })
            .catch(() => {
              logger.error(`${elementsName[k]} not displayed properly`);
              errors.push(`${elementsName[k]} not displayed properly`);
            });
          await page.waitForTimeout(2000);
        }
        await page.goBack();
        await navigationPromise;
        await page.waitForTimeout(8000);
      } else {
        logger.error("view detail button navigation failed");
        errors.push("view detail button navigation failed");
      }
    } else {
      logger.error("labor overview page title verify failed");
      errors.push("labor overview page title verify failed");
    }
    ts.assert(
      errors.length == 0,
      `Error in  Parts Workmix Page: ${errors.join("\n")}`
    );
  } catch (error) {
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsPartsWorkmixTest();
