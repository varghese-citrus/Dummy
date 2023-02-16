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
      name: `[DEMO-TEST] ${site.name} FixedOps Labor Overview Page Chart Tab Test`,
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
          await laborOverviewPageChartTabTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Labor Overview Page Chart Tab Test";
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

async function laborOverviewPageChartTabTest(baseURL: string) {
  let browser = null;
  try {
    const oBrowser = await fixedopsCommonLogin(baseURL);
    const page = oBrowser.page;
    browser = oBrowser.browser;
    const navigationPromise = oBrowser.navigationPromise;
    await page.waitForSelector(ls.labor);
    await page.click(ls.labor);
    await page.waitForTimeout(4000);
    logger.info("labor expand collapse link clicked");

    await page.waitForSelector(ls.laborOverview);
    await page.click(ls.laborOverview);
    await navigationPromise;
    await page.waitForTimeout(10000);
    logger.info("labor overview link clicked");
    await page.reload();
    await navigationPromise;
    await page.waitForTimeout(18000);
    const title = await page.title();
    if (title == "CP Labor Overview") {
      logger.info("CP Labor Overview title verify success");
      const height = await page.evaluate("window.scrollY");

      const chartTabs = [
        ls.chartTabBtn_1,
        ls.chartTabBtn_2,
        ls.chartTabBtn_3,
        ls.chartTabBtn_4,
        ls.chartTabBtn_5,
        ls.chartTabBtn_6,
        ls.chartTabBtn_7,
        ls.chartTabBtn_8,
        ls.chartTabBtn_9,
        ls.chartTabBtn_10,
        ls.chartTabBtn_11,
      ];

      const num = await getRandomNumberBetween(0, 10);
      const chartTab = await page.$eval(chartTabs[num], (elem) => {
        return elem.style.display !== "none";
      });
      await page.waitForTimeout(5000);
      if (chartTab) {
        logger.info("chart tab visible properly");
        await page.click(chartTabs[num]);
        await page.waitForTimeout(5000);
        const chartDiv = await page.$x(ls.chartsDiv(num + 1));

        const className: string = await (
          await chartDiv[0].getProperty("className")
        ).jsonValue();

        const expClsName =
          "react-grid-item diagram-section cssTransforms grid-selected";

        if (className == expClsName) {
          logger.info("chart highlighted properly");

          const expandBtn = await page.$x(ls.expandBtn(num + 1));
          await expandBtn[0].click();
          await page.waitForTimeout(8000);

          await page
            .waitForSelector(ls.dialogBox)
            .then(() => {
              logger.info("chart expanded properly");
            })
            .catch(() => {
              logger.error("chart not expanded properly");
              errors.push("chart not expanded properly");
            });

          const collapseBtn = await page.$x(ls.collapseX);
          await collapseBtn[0].click();
          await page.waitForTimeout(8000);

          await page
            .waitForSelector(ls.dialogBox)
            .then(() => {
              logger.error("chart not collapse properly");
              errors.push("chart not collapse properly");
            })
            .catch(async () => {
              logger.info("chart collapse properly");
              const className: string = await (
                await chartDiv[0].getProperty("className")
              ).jsonValue();
              await page.waitForTimeout(5000);
              className.includes(expClsName)
                ? logger.info(
                    "chart retained its highlighted position after collapse button clicked,verification success"
                  )
                : [
                    logger.error(
                      "chart not retained its highlighted position after collapse button clicked,verification failed"
                    ),
                    errors.push(
                      "chart not retained its highlighted position after collapse button clicked,verification failed"
                    ),
                  ];
            });

          const backBtn = await page.$x(ls.backButton(num + 1));
          await page.waitForTimeout(2000);
          await page.evaluate((element) => {
            element.scrollIntoView(
              0,
              parseInt(element.getBoundingClientRect().y)
            );
          }, backBtn[0]);
          await page.waitForTimeout(2000);
          await backBtn[0].click();
          await page.waitForTimeout(5000);

          const scrollHeightAfterClick = await page.evaluate("window.scrollY");
          height == scrollHeightAfterClick
            ? logger.info(`back to top button working properly`)
            : [
                logger.error(`return to top button not working properly`),
                errors.push(`return to top button not working properly`),
              ];
        } else {
          logger.error("chart not highlighted properly");
          errors.push("chart not highlighted properly");
        }
      } else {
        logger.error("chart tab not visible properly");
        errors.push("chart tab not visible properly");
      }
    } else {
      logger.error("labor overview page title verify failed");
      errors.push("labor overview page title verify failed");
    }
    ts.assert(
      errors.length == 0,
      `Error in Labor Overview Page: ${errors.join("\n")}`
    );
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsLaborOverviewTest();
