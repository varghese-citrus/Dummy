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
      name: `[AEC-FOCP-UI-FN-LD-0074] ${site.name} FixedOps Home Page Visualization Button Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-UI-FN-LD-0074",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await homePageVisualizationBtnTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Home Page Visualization Button Test";
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

async function homePageVisualizationBtnTest(baseURL: string) {
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

      const visBtn = [
        hs.visualization_btn_1,
        hs.visualization_btn_2,
        // hs.visualization_btn_3,
        hs.visualization_btn_4,
        hs.visualization_btn_5,
        hs.visualization_btn_6,
        hs.visualization_btn_7,
        hs.visualization_btn_8,
        hs.visualization_btn_9,
        hs.visualization_btn_10,
        hs.visualization_btn_11,
        hs.visualization_btn_12,
      ];

      const chartContainer = [
        hs.chartContainer_1,
        hs.chartContainer_2,
        // hs.chartContainer_3,
        hs.chartContainer_5,
        hs.chartContainer_7,
        hs.chartContainer_12,
        hs.chartContainer_13,
        hs.chartContainer_8,
        hs.chartContainer_6,
        hs.chartContainer_4,
        hs.chartContainer_10,
        hs.chartContainer_11,
      ];

      await page
        .waitForXPath(hs.noData, { visible: true, timeout: 2000 })
        .then(async () => {
          logger.warn("there is no data in MTD");
          await page.click(hs.toggleBtn);
          await page.waitForTimeout(4000);
          const lastThreeMonthLi = await page.$x(hs.lastThreeMonthLi);
          await lastThreeMonthLi[0].click();
          await page.waitForTimeout(15000);
          logger.info("last three month toggle selected");
          for (let i = 0; i <= visBtn.length - 1; i++) {
            const btn = await page.$x(visBtn[i]);
            await page.waitForTimeout(5000);

            await btn[0].click();
            await page.waitForTimeout(5000);

            (await page.$$eval(chartContainer[i], (txts) =>
              txts
                .map((txt) => txt.getAttribute("class"))
                .toString()
                .includes(
                  "react-grid-item react-draggable cssTransforms react-resizable selected"
                )
            ))
              ? logger.info(`visualization button ${i + 1} working properly`)
              : [
                  logger.error(
                    `visualization button ${i + 1} not working properly`
                  ),
                  errors.push(
                    `visualization button ${i + 1} not working properly`
                  ),
                ];
          }
        })
        .catch(async () => {
          logger.info("default MTD having data");
          for (let i = 0; i <= visBtn.length - 1; i++) {
            const btn = await page.$x(visBtn[i]);
            await page.waitForTimeout(5000);
            await btn[0].click();
            await page.waitForTimeout(5000);

            (await page.$$eval(chartContainer[i], (txts) =>
              txts
                .map((txt) => txt.getAttribute("class"))
                .toString()
                .includes(
                  "react-grid-item react-draggable cssTransforms react-resizable selected"
                )
            ))
              ? logger.info(`visualization button ${i + 1} working properly`)
              : [
                  logger.error(
                    `visualization button ${i + 1} not working properly`
                  ),
                  errors.push(
                    `visualization button ${i + 1} not working properly`
                  ),
                ];
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
