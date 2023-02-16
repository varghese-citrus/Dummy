import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { HomeSelectors as hs } from "../selectors/home.ts";
import { fixedopsCommonLogin } from "./common/fixedops-common-login.ts";
import { startLogger } from "../utilities/utils.ts";

const logger = startLogger();
const errors: string[] = [];

function fixedOpsHomeTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[AEC-FOCP-UI-FN-LD-0071] ${site.name} FixedOps Home Page Graphs Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-UI-FN-LD-0071",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await homePageGraphsTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Home Page Graphs Test";
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

async function homePageGraphsTest(baseURL: string) {
  let browser = null;
  try {
    const oBrowser = await fixedopsCommonLogin(baseURL);
    const page = oBrowser.page;
    browser = oBrowser.browser;
    const navigationPromise = oBrowser.navigationPromise;

    const title = await page.title();

    if (title == "Home") {
      logger.info(`${title} page title verify success!!!`);

      await page.reload();
      await navigationPromise;
      await page.waitForTimeout(15000);

      const ids = [
        hs.scoreCard,
        hs.chartContainer_1,
        hs.chartContainer_2,
        hs.chartContainer_3,
        hs.chartContainer_4,
        hs.chartContainer_11,
        hs.chartContainer_5,
        hs.chartContainer_6,
        hs.chartContainer_7,
        hs.chartContainer_8,
        hs.chartContainer_9,
        hs.chartContainer_10,
        hs.chartContainer_12,
        hs.chartContainer_13,
      ];

      await page
        .waitForXPath(hs.noData, { visible: true, timeout: 2000 })
        .then(async () => {
          logger.warn("there is no data in MTD");
          await page.click(hs.toggleBtn);
          await page.waitForTimeout(4000);
          const lastThreeMonthLi = await page.$x(hs.lastThreeMonthLi);
          await lastThreeMonthLi[0].click();
          await page.waitForTimeout(10000);
          logger.info("last three month toggle selected");

          for (let i = 0; i <= ids.length - 1; i++) {
            await page
              .waitForSelector(ids[i], {
                visible: true,
                timeout: 4000,
              })
              .then(() => {
                logger.info(`graph ${i + 1} displayed properly`);
              })
              .catch(() => {
                logger.error(`graph ${i + 1} not displayed properly`);
                errors.push(`graph ${i + 1} not displayed properly`);
              });
            await page.waitForTimeout(2000);
          }
        })
        .catch(async () => {
          logger.info("default MTD having data");
          for (let i = 0; i <= ids.length - 1; i++) {
            await page
              .waitForSelector(ids[i], {
                visible: true,
                timeout: 4000,
              })
              .then(() => {
                logger.info(`graph ${i + 1} displayed properly`);
              })
              .catch(() => {
                logger.error(`graph ${i + 1} not displayed properly`);
                errors.push(`graph ${i + 1} not displayed properly`);
              });
            await page.waitForTimeout(2000);
          }
        });
    } else {
      logger.error("home page title verify failed");
      errors.push("home page title verify failed");
    }
    ts.assert(errors.length == 0, `Error in Home page: ${errors.join("\n")}`);
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsHomeTest();
