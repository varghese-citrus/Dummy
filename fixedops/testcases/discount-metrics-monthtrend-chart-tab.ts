import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { DiscountMetricsSelector as ds } from "../selectors/discount-metrics.ts";
import { fixedopsCommonLogin } from "./common/fixedops-common-login.ts";
import { startLogger, getRandomNumberBetween } from "../utilities/utils.ts";

const logger = startLogger();
const errors: string[] = [];

function fixedOpsDiscountMetricsChartTabTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[AEC-FOCP-UI-FN-LD-0051] ${site.name} FixedOps Discount Metrics Page Month Trend Chart Tab Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-UI-FN-LD-0051",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await discountMetricsPageMonthTrendChartTabTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Discount Metrics Page Month Trend Chart Tab Test";
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

async function discountMetricsPageMonthTrendChartTabTest(baseURL: string) {
  let browser = null;

  try {
    const oBrowser = await fixedopsCommonLogin(baseURL);
    const page = oBrowser.page;
    browser = oBrowser.browser;
    const navigationPromise = oBrowser.navigationPromise;
    await navigationPromise;
    await page.waitForTimeout(15000);

    await page.click(ds.disMetricsLink);
    await navigationPromise;
    await page.waitForTimeout(15000);
    logger.info("discount link clicked!!!");

    const [mnthtrend] = await page.$x(ds.MonthTrendTab);
    await mnthtrend.click();
    await navigationPromise;
    await page.waitForTimeout(15000);
    logger.info("Month trend tab clicked");

    await page.waitForTimeout(3000);
    await page.screenshot({ path: "./example.png" });
    await page.waitForTimeout(3000);

    const title = await page.title();

    if (title == "Discount") {
      logger.info("Discount metrics title verify success");
      const height = await page.evaluate("window.scrollY");

      const chartTabs = [
        ds.chartTabBtn_1,
        ds.chartTabBtn_2,
        ds.chartTabBtn_3,
        ds.chartTabBtn_4,
        ds.chartTabBtn_5,
        ds.chartTabBtn_6,
        ds.chartTabBtn_7,
      ];

      const num = await getRandomNumberBetween(0, 6);
      const chartTab = await page.$eval(chartTabs[num], (elem) => {
        return elem.style.display !== "none";
      });
      await page.waitForTimeout(5000);
      if (chartTab) {
        logger.info("chart tab visible properly");
        await page.click(chartTabs[num]);
        await page.waitForTimeout(5000);
        const chartDiv = await page.$x(ds.chartsDiv(num + 1));

        const className: string = await (
          await chartDiv[0].getProperty("className")
        ).jsonValue();

        const expClsName =
          "react-grid-item diagram-section cssTransforms grid-selected";

        if (className == expClsName) {
          logger.info("chart highlighted properly");

          const expandBtn = await page.$x(ds.expandBtn(num + 1));
          await expandBtn[0].click();
          await page.waitForTimeout(8000);

          await page
            .waitForSelector(ds.dialogBox)
            .then(() => {
              logger.info("chart expanded properly");
            })
            .catch(() => {
              logger.error("chart not expanded properly");
              errors.push("chart not expanded properly");
            });
          await page.waitForSelector(ds.collapseBtn);
          await page.click(ds.collapseBtn);
          await page.waitForTimeout(8000);
          await page
            .waitForSelector(ds.dialogBox)
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
          const backBtn = await page.$x(ds.backButton(num + 1));

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
      logger.info("discount metrics title verify failed");
      errors.push("discount metrics title verify failed");
    }
    ts.assert(
      errors.length == 0,
      `Error in  Discount Metrics Page: ${errors.join("\n")}`
    );
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsDiscountMetricsChartTabTest();
