import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { LaborSelectors as ls } from "../selectors/labor-overview.ts";
import { fixedopsCommonLogin } from "./common/fixedops-common-login.ts";
import { startLogger, getRandomNumberBetween } from "../utilities/utils.ts";

const logger = startLogger();
const errors: string[] = [];

function fixedOpsLaborOverviewTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[AEC-FOCP-UI-FN-LD-0100] ${site.name} FixedOps Labor Overview Page View Detail Button Drill Down Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-UI-FN-LD-0100",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await laborOverviewPageViewDetailBtnDrillDownTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Labor Overview Page View Detail Button Drill Down Test";
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

async function laborOverviewPageViewDetailBtnDrillDownTest(baseURL: string) {
  let browser = null;

  try {
    const oBrowser = await fixedopsCommonLogin(baseURL);
    const page = oBrowser.page;
    browser = oBrowser.browser;
    const navigationPromise = oBrowser.navigationPromise;

    await page.waitForSelector(ls.labor);
    await page.click(ls.labor);
    await page.waitForTimeout(5000);
    logger.info("labor expand collapse link clicked!!!");

    await page.waitForSelector(ls.laborOverview);
    await page.click(ls.laborOverview);
    await navigationPromise;
    await page.waitForTimeout(10000);

    const title = await page.title();

    if (title == "CP Labor Overview") {
      logger.info("CP Labor Overview title verify success");

      const ids = [
        ls.viewDetailBtn1,
        ls.viewDetailBtn2,
        ls.viewDetailBtn3,
        ls.viewDetailBtn4,
        ls.viewDetailBtn5,
        ls.viewDetailBtn6,
        ls.viewDetailBtn7,
        ls.viewDetailBtn8,
        ls.viewDetailBtn9,
        ls.viewDetailBtn10,
      ];

      const elements = [ls.editBtn, ls.backBtn, ls.dataAsOf];
      const elementsName = ["edit button", "back button", "data as of"];

      const num = await getRandomNumberBetween(0, 10);

      await page.waitForSelector(ids[num]);
      await page.click(ids[num]);
      await navigationPromise;
      await page.waitForTimeout(12000);

      const title = await page.title();

      if (title == "Overview") {
        logger.info(`view detail button navigation success`);
        await page.waitForTimeout(10000);

        await page
          .waitForSelector(ls.overviewContainer, {
            visible: true,
            timeout: 4000,
          })
          .then(() => {
            logger.info("labor overview container display properly");
          })
          .catch(() => {
            logger.error("labor overview container not display properly");
            errors.push("labor overview container not display properly");
          });
        await page.waitForTimeout(2000);
        const chartDiv = await page.$x(ls.chartDiv);
        for (let j = 1; j <= chartDiv.length; j++) {
          await page.waitForXPath(ls.charts(j + 1));

          await page
            .waitForXPath(ls.charts(j + 1), {
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
        await page.goBack();
        await navigationPromise;
        await page.waitForTimeout(12000);
      } else {
        logger.error(`view detail button  navigation failed`);
        errors.push(`view detail button navigation failed`);
      }
    } else {
      logger.error("labor overview page title verify failed");
      errors.push("labor overview page title verify failed");
    }
    ts.assert(
      errors.length == 0,
      `Error in  Labor Overview Page: ${errors.join("\n")}`
    );
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsLaborOverviewTest();
