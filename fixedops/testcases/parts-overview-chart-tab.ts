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
      name: `[AEC-FOCP-UI-FN-LD-0160] ${site.name} FixedOps Parts Overview Page Charts Tab Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-UI-FN-LD-0160",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await partsOverviewPageChartTabTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Parts Overview Page Charts Tab Test";
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

async function partsOverviewPageChartTabTest(baseURL: string) {
  let browser = null;

  try {
    const oBrowser = await fixedopsCommonLogin(baseURL);
    const page = oBrowser.page;
    browser = oBrowser.browser;
    const navigationPromise = oBrowser.navigationPromise;
    const pMenu = await page.$x(po.partsMenuBtn);
    await pMenu[0].click();
    await page.waitForTimeout(5000);
    logger.info("parts menu clicked!!");
    const pOverview = await page.$x(po.partsOverviewBtn);
    await pOverview[0].click();
    await navigationPromise;
    await page.waitForTimeout(12000);
    logger.info("parts overview");
    await page.reload();
    await navigationPromise;
    await page.waitForTimeout(15000);
    const title = await page.title();
    if (title == "CP Parts Overview") {
      logger.info("CP Parts Overview title verify success");
      const height = await page.evaluate("window.scrollY");

      const chartTabs = [
        po.chartTabBtn_1,
        po.chartTabBtn_2,
        po.chartTabBtn_3,
        po.chartTabBtn_4,
        po.chartTabBtn_5,
        po.chartTabBtn_6,
        po.chartTabBtn_7,
        po.chartTabBtn_8,
        po.chartTabBtn_9,
      ];

      const num = await getRandomNumberBetween(0, 8);
      const chartTab = await page.waitForSelector(chartTabs[num], {
        visible: true,
        timeout: 4000,
      });
      await page.waitForTimeout(5000);
      if (chartTab != null) {
        logger.info("chart tab visible properly");
        await page.click(chartTabs[num]);
        await page.waitForTimeout(5000);
        const chartDiv = await page.$x(po.chartsDiv(num + 1));
        const className: string = await (
          await chartDiv[0].getProperty("className")
        ).jsonValue();
        const expClsName =
          "react-grid-item diagram-section cssTransforms grid-selected";
        if (className == expClsName) {
          logger.info("chart highlighted properly");
          const expandBtn = await page.$x(po.expandBtn(num + 1));
          await expandBtn[0].click();
          await page.waitForTimeout(8000);
          await page
            .waitForSelector(po.dialogBox)
            .then(() => {
              logger.info("chart expanded properly");
            })
            .catch(() => {
              logger.error("chart not expanded properly");
              errors.push("chart not expanded properly");
            });
          const collapseBtn = await page.$x(po.collapseBtn);
          await collapseBtn[0].click();
          await page.waitForTimeout(8000);
          await page
            .waitForSelector(po.dialogBox)
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
          const backBtn = await page.$x(po.backButton(num + 1));
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
      logger.error("parts overview page title verify failed");
      errors.push("parts overview page title verify failed");
    }
    ts.assert(
      errors.length == 0,
      `Error in Parts Overview Page: ${errors.join("\n")}`
    );
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsPartsOverviewTest();
