import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { SpecialMetricsSelectors as sm } from "../selectors/special-metrics.ts";
import { fixedopsCommonLogin } from "./common/fixedops-common-login.ts";
import { startLogger, getRandomNumberBetween } from "../utilities/utils.ts";

const logger = startLogger();
const errors: string[] = [];

function fixedOpsSpecialMetricsTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[AEC-FOCP-UI-FN-LD-0217] ${site.name} FixedOps Special Metrics Chart Tab Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-UI-FN-LD-0217",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await specialMetricsPageChartTabTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Special Metrics Chart Tab Test";
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

async function specialMetricsPageChartTabTest(baseURL: string) {
  let browser = null;

  try {
    const oBrowser = await fixedopsCommonLogin(baseURL);
    const page = oBrowser.page;
    browser = oBrowser.browser;
    const navigationPromise = oBrowser.navigationPromise;
    await navigationPromise;
    await page.waitForSelector(sm.specialMetricsLink);
    await page.click(sm.specialMetricsLink);
    await navigationPromise;
    await page.waitForTimeout(15000);
    logger.info("special metrics link clicked!!!");

    const title = await page.title();
    if (title == "Special Metrics") {
      logger.info("Special Metrics title verify success");
      const height = await page.evaluate("window.scrollY");
      const chartTabs = [
        sm.chartTabBtn_1,
        sm.chartTabBtn_2,
        sm.chartTabBtn_3,
        sm.chartTabBtn_4,
        sm.chartTabBtn_5,
        sm.chartTabBtn_6,
        sm.chartTabBtn_7,
        sm.chartTabBtn_8,
        sm.chartTabBtn_9,
        sm.chartTabBtn_10,
        sm.chartTabBtn_11,
      ];
      const num = await getRandomNumberBetween(0, 10);
      const chartTab = await page.waitForSelector(chartTabs[num], {
        visible: true,
        timeout: 4000,
      });
      await page.waitForTimeout(5000);
      if (chartTab != null) {
        logger.info("chart tab visible properly");
        await page.click(chartTabs[num]);
        await page.waitForTimeout(5000);
        const chartDiv = await page.$x(sm.chartsDiv(num + 1));

        const className: string = await (
          await chartDiv[0].getProperty("className")
        ).jsonValue();

        const expClsName =
          "react-grid-item diagram-section cssTransforms grid-selected";

        if (className == expClsName) {
          logger.info("chart highlighted properly");
          await page.waitForTimeout(5000);
          const expandBtn = await page.$x(sm.expandBtn(num + 1));
          await expandBtn[0].click();
          await page.waitForTimeout(8000);
          await page
            .waitForSelector(sm.dialogBox)
            .then(() => {
              logger.info("chart expanded properly");
            })
            .catch(() => {
              logger.error("chart not expanded properly");
              errors.push("chart not expanded properly");
            });
          await page.waitForSelector(sm.collapseBtn);
          await page.click(sm.collapseBtn);
          await page.waitForTimeout(8000);
          await page
            .waitForSelector(sm.dialogBox)
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

          const backBtn = await page.$x(sm.backButton(num + 1));
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
      logger.info("Special Metrics title verify failed");
      errors.push("Special Metrics title verify failed");
    }
    ts.assert(
      errors.length == 0,
      `Error in Special Metrics Page: ${errors.join("\n")}`
    );
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsSpecialMetricsTest();
