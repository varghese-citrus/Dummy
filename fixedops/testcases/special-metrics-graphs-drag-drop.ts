import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { SpecialMetricsSelectors as sm } from "../selectors/special-metrics.ts";
import { fixedopsCommonLogin } from "./common/fixedops-common-login.ts";
import { dragAndDrop, startLogger } from "../utilities/utils.ts";

const logger = startLogger();
const errors: string[] = [];

function fixedOpsSpecialMetricsTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[DEMO-TEST] ${site.name} FixedOps Special Metrics Graphs Drag Drop Test`,
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
          await specialMetricsPageGraphsDragDropTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Special Metrics Graphs Drag Drop Test";
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

async function specialMetricsPageGraphsDragDropTest(baseURL: string) {
  let browser = null;

  try {
    const oBrowser = await fixedopsCommonLogin(baseURL);
    const page = oBrowser.page;
    browser = oBrowser.browser;
    const navigationPromise = oBrowser.navigationPromise;
    await page.waitForSelector(sm.specialMetricsLink);
    await page.click(sm.specialMetricsLink);
    await navigationPromise;
    await page.waitForTimeout(15000);
    logger.info("special metrics link clicked!!!");
    const title = await page.title();
    if (title == "Special Metrics") {
      logger.info("Special Metrics title verify success");
      let selector = await page.waitForSelector(sm.getChart(1));
      const defaultPositionElement_1 = await page.evaluate((el) => {
        const { x, y } = el.getBoundingClientRect();
        return { x, y };
      }, selector);
      await page.waitForTimeout(5000);
      await dragAndDrop(page, sm.getChart(1), sm.getChart(2));
      await page.waitForTimeout(8000);
      selector = await page.waitForSelector(sm.getChart(1));
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
        await page.waitForSelector(sm.resetBtn);
        await page.click(sm.resetBtn);
        await page.waitForTimeout(8000);
        logger.info("reset button clicked");
        selector = await page.waitForSelector(sm.getChart(1));
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
