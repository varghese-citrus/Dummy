import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { partsoverviewSelectors as po } from "../selectors/parts-overview.ts";
import { fixedopsCommonLogin } from "./common/fixedops-common-login.ts";
import { startLogger, getRandomNumberBetween } from "../utilities/utils.ts";

const logger = startLogger();
const errors: string[] = [];

function fixedOpsPartsOverviewTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[AEC-FOCP-UI-FN-LD-0170] ${site.name} FixedOps Parts Overview Page View Detail Button Drill Down Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-UI-FN-LD-0170",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await partOverviewPageViewDetailBtnDrillDownTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Parts Overview Page View Detail Button Drill Down Test";
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

async function partOverviewPageViewDetailBtnDrillDownTest(baseURL: string) {
  let browser = null;

  try {
    const oBrowser = await fixedopsCommonLogin(baseURL);
    const page = oBrowser.page;
    browser = oBrowser.browser;
    const navigationPromise = oBrowser.navigationPromise;
    const pMenu = await page.$x(po.partsMenuBtn);
    await pMenu[0].click();
    await page.waitForTimeout(4000);
    logger.info("parts expand collapse link clicked");
    const pOverview = await page.$x(po.partsOverviewBtn);
    await pOverview[0].click();
    await navigationPromise;
    await page.waitForTimeout(12000);

    const title = await page.title();

    if (title == "CP Parts Overview") {
      logger.info("CP Parts Overview title verify success");
      const ids = [
        po.viewDetailBtn1,
        po.viewDetailBtn2,
        po.viewDetailBtn3,
        po.viewDetailBtn4,
        po.viewDetailBtn5,
        po.viewDetailBtn6,
        po.viewDetailBtn7,
        po.viewDetailBtn8,
        po.viewDetailBtn9,
      ];
      const elements = [po.editBtn, po.backBtn, po.dataAsOf];
      const elementsName = ["edit button", "back button", "data as of"];
      const num = await getRandomNumberBetween(0, 8);
      await page.waitForSelector(ids[num]);
      await page.click(ids[num]);
      await navigationPromise;
      await page.waitForTimeout(5000);
      const title = await page.title();
      if (title == "Overview") {
        logger.info(`view detail button navigation success`);
        await page.waitForTimeout(5000);
        await page
          .waitForSelector(po.overviewContainer, {
            visible: true,
            timeout: 4000,
          })
          .then(() => {
            logger.info("parts overview container display properly");
          })
          .catch(() => {
            logger.error("parts overview container not display properly");
            errors.push("parts overview container not display properly");
          });
        await page.waitForTimeout(2000);
        const chartDiv = await page.$x(po.chartDiv);
        for (let j = 1; j <= chartDiv.length; j++) {
          await page
            .waitForXPath(po.charts(j + 1), {
              visible: true,
              timeout: 2000,
            })
            .then(() => {
              logger.info(`graph ${j} displayed properly`);
            })
            .catch(() => {
              logger.info(`graph ${j} not displayed properly`);
              errors.push(`graph ${j} not displayed properly`);
            });
          await page.waitForTimeout(2000);
        }
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
              logger.info(`${elementsName[k]} not displayed properly`);
              errors.push(`${elementsName[k]} not displayed properly`);
            });
          await page.waitForTimeout(2000);
        }
      } else {
        logger.error(`view detail button navigation failed`);
        errors.push(`view detail button navigation failed`);
      }
    } else {
      logger.error("parts overview page title verify failed");
      errors.push("parts overview page title verify failed");
    }
    ts.assert(
      errors.length == 0,
      `Error in  Parts Overview Page: ${errors.join("\n")}`
    );
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsPartsOverviewTest();
