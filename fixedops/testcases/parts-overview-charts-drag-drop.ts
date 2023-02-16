import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { partsoverviewSelectors as po } from "../selectors/parts-overview.ts";
import { fixedopsCommonLogin } from "./common/fixedops-common-login.ts";
import { dragAndDrop, startLogger } from "../utilities/utils.ts";

const logger = startLogger();
const errors: string[] = [];

function fixedOpsPartsOverviewTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[DEMO-TEST] ${site.name} FixedOps Parts Overview Chart Drag and Drop Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "[DEMO-TEST]",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await partsOverviewDragDropTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Parts Overview Chart Drag and Drop Test";
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

async function partsOverviewDragDropTest(baseURL: string) {
  let browser = null;
  try {
    const oBrowser = await fixedopsCommonLogin(baseURL);
    const page = oBrowser.page;
    browser = oBrowser.browser;
    const navigationPromise = oBrowser.navigationPromise;
    await page.reload();
    await navigationPromise;
    await page.waitForTimeout(10000);
    const pMenu = await page.$x(po.partsMenuBtn);
    await pMenu[0].click();
    await navigationPromise;
    await page.waitForTimeout(4000);
    logger.info("parts menu clicked");
    const pOverview = await page.$x(po.partsOverviewBtn);
    await pOverview[0].click();
    logger.info("parts overview");
    await navigationPromise;
    await page.waitForTimeout(12000);
    const title = await page.title();
    if (title == "CP Parts Overview") {
      logger.info("Parts Overview page title verified success");
      let selector = await page.waitForSelector(po.getChart(1));
      const defaultPositionElement_1 = await page.evaluate((el) => {
        const { x, y } = el.getBoundingClientRect();
        return { x, y };
      }, selector);
      await page.waitForTimeout(5000);
      await dragAndDrop(page, po.getChart(1), po.getChart(2));
      await page.waitForTimeout(8000);
      selector = await page.waitForSelector(po.getChart(1));
      const currentPosition = await page.evaluate((el) => {
        const { x, y } = el.getBoundingClientRect();
        return { x, y };
      }, selector);
      await page.waitForTimeout(5000);
      if (
        (currentPosition.x != defaultPositionElement_1.x &&
          currentPosition.y != defaultPositionElement_1.y) ||
        (currentPosition.x == defaultPositionElement_1.x &&
          currentPosition.y != defaultPositionElement_1.y) ||
        (currentPosition.x != defaultPositionElement_1.x &&
          currentPosition.y == defaultPositionElement_1.y)
      ) {
        logger.info("graph dropped success");
        const resetBtn = await page.$x(po.resetLayout);
        await resetBtn[0].click();
        await page.waitForTimeout(8000);
        logger.info("reset button clicked");
        selector = await page.waitForSelector(po.getChart(1));
        const position = await page.evaluate((el) => {
          const { x, y } = el.getBoundingClientRect();
          return { x, y };
        }, selector);
        await page.waitForTimeout(5000);
        position.x == defaultPositionElement_1.x &&
        position.y == defaultPositionElement_1.y
          ? logger.info(
              "graphs drag and drop and reset button functionality working success"
            )
          : [
              logger.error(
                "graphs drag and and reset button functionality drop working fail"
              ),
              errors.push(
                "graphs drag and drop and reset button functionality working fail"
              ),
            ];
        await page.waitForTimeout(5000);
      } else {
        logger.error("graph dropped fail");
        errors.push("graph dropped fail");
      }
    } else {
      logger.error("Parts overview page title verify failed");
      errors.push("Parts overview page title verify failed");
    }
    ts.assert(
      errors.length == 0,
      `Error in Parts Overview: ${errors.join("\n")}`
    );
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsPartsOverviewTest();
