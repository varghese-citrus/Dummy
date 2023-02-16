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
      name: `[AEC-FOCP-UI-FN-LD-0069] ${site.name} FixedOps Home Page Detail View Button Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-UI-FN-LD-0069",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await homePageDetailViewBtnTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in Home Page Detail View Button Test";
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

async function homePageDetailViewBtnTest(baseURL: string) {
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

      const expTitle = "Special Metrics";
      const btns = [hs.detailBtn_1, hs.detailBtn_2];

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

          for (let i = 0; i < btns.length; i++) {
            const btn = await page.$x(await btns[i]);
            await btn[0].click();

            await navigationPromise;
            await page.waitForTimeout(10000);
            const pageTitle: string = await page.title();

            pageTitle == expTitle
              ? logger.info(`detail view button ${i + 1} working properly`)
              : [
                  logger.error(
                    `detail view button ${i + 1} not working properly`
                  ),
                  errors.push(
                    `detail view button ${i + 1} not working properly`
                  ),
                ];
            await page.goBack();
            await page.waitForTimeout(8000);
            await page.reload();
            await navigationPromise;
            await page.waitForTimeout(15000);
          }
        })
        .catch(async () => {
          logger.info("default MTD having data");
          await page.waitForTimeout(2000);
          for (let i = 0; i < btns.length; i++) {
            const btn = await page.$x(btns[i]);
            await btn[0].click();

            await navigationPromise;
            await page.waitForTimeout(10000);
            const pageTitle: string = await page.title();

            pageTitle == expTitle
              ? logger.info(`detail view button ${i + 1} working properly`)
              : [
                  logger.error(
                    `detail view button ${i + 1} not working properly`
                  ),
                  errors.push(
                    `detail view button ${i + 1} not working properly`
                  ),
                ];
            await page.goBack();
            await page.waitForTimeout(8000);
            await page.reload();
            await navigationPromise;
            await page.waitForTimeout(15000);
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
