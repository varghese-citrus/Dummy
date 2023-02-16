import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { PartsOppertunityHrsRoGpSelectors as ws } from "../selectors/parts-opportunity-hrsro-gp.ts";
import { partsoverviewSelectors as ps } from "../selectors/parts-overview.ts";
import { fixedopsCommonLogin } from "./common/fixedops-common-login.ts";
import { startLogger } from "../utilities/utils.ts";

const logger = startLogger();
const errors: string[] = [];

function fixedOpsOpportunityHrsRoGpPageTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[AEC-FOCP-UI-FN-LD-0154] ${site.name} FixedOps Parts Opportunity Hrs Ro Gp Page Graph Drill Down Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-UI-FN-LD-0154",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await partsOpportunityHrsRoGpPageGraphDrillDownTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Labor Opportunity Hrs Ro Gp Page Graph Drill Down Test";
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

async function partsOpportunityHrsRoGpPageGraphDrillDownTest(baseURL: string) {
  let browser = null;

  try {
    const oBrowser = await fixedopsCommonLogin(baseURL);
    const page = oBrowser.page;
    browser = oBrowser.browser;
    const navigationPromise = oBrowser.navigationPromise;
    await page.waitForSelector(ps.partsMenuLink);
    await page.click(ps.partsMenuLink);
    logger.info("parts expand collapse link clicked!!!");
    await page.waitForTimeout(4000);
    await page.waitForSelector(ws.whatIf);
    await page.click(ws.whatIf);
    await navigationPromise;
    await page.waitForTimeout(15000);
    logger.info("what if opportunity link clicked!!!");
    const title = await page.title();
    if (title == "“What If” Opportunity Hrs Per RO & Parts GP%") {
      logger.info(
        "“What If” Opportunity - Hrs Per RO & Parts GP% title verify success"
      );
      await page.waitForTimeout(5000);
      const graph = await page.waitForSelector(ws.chart, {
        visible: true,
        timeout: 4000,
      });
      await page.waitForTimeout(5000);
      if (graph != null) {
        logger.info("graph display properly");
        await page.waitForTimeout(4000);
        const canvas = await page.$(ws.chart);
        const position = await page.evaluate((canvas) => {
          const { x, y } = canvas.getBoundingClientRect();
          return { x, y };
        }, canvas);
        const x = position.x + 665;
        const y = position.y + 118;
        const store = Deno.env.get("STORE");
        if (store == "Suntrup Ford Westport") {
          await page.mouse
            .click(462, 555, { button: "left" })
            .then(async () => {
              await navigationPromise;
              await page.waitForTimeout(20000);

              const pageTitle = await page.title();
              await page.waitForTimeout(2000);

              pageTitle == "Parts Work Mix"
                ? logger.info(
                    "overview bar chart clicked and parts work mix page verify success"
                  )
                : [
                    logger.error(
                      "overview bar chart clicked and parts work mix page verify failed"
                    ),
                    errors.push(
                      "overview bar chart clicked and parts work mix page verify failed"
                    ),
                  ];
            })
            .catch(() => {
              logger.warn("there is no data in bar chart for drill down");
            });
        } else if (
          store == "Bill Knight Ford" ||
          store == "Bill Knight Ford of Stillwater" ||
          store == "Bill Knight Lincoln-Volvo"
        ) {
          await page.mouse
            .click(876, 310, { button: "left" })
            .then(async () => {
              await navigationPromise;
              await page.waitForTimeout(20000);

              const pageTitle = await page.title();
              await page.waitForTimeout(2000);

              pageTitle == "Parts Work Mix"
                ? logger.info(
                    "overview bar chart clicked and parts work mix page verify success"
                  )
                : [
                    logger.error(
                      "overview bar chart clicked and parts work mix page verify failed"
                    ),
                    errors.push(
                      "overview bar chart clicked and parts work mix page verify failed"
                    ),
                  ];
            })
            .catch(() => {
              logger.warn("there is no data in bar chart for drill down");
            });
        } else if (store == "Sawyer Motors CDJR") {
          await page.mouse
            .click(178, 449, { button: "left" })
            .then(async () => {
              await navigationPromise;
              await page.waitForTimeout(20000);

              const pageTitle = await page.title();
              await page.waitForTimeout(2000);

              pageTitle == "Parts Work Mix"
                ? logger.info(
                    "overview bar chart clicked and parts work mix page verify success"
                  )
                : [
                    logger.error(
                      "overview bar chart clicked and parts work mix page verify failed"
                    ),
                    errors.push(
                      "overview bar chart clicked and parts work mix page verify failed"
                    ),
                  ];
            })
            .catch(() => {
              logger.warn("there is no data in bar chart for drill down");
            });
        } else if (store == "Kevin Whitaker Chevrolet") {
          const xpath = await page.$x(ws.expBtn);
          await xpath[0].click();
          await page.waitForTimeout(4000);
          await page.mouse
            .click(186, 375, { button: "left" })
            .then(async () => {
              await navigationPromise;
              await page.waitForTimeout(20000);

              const pageTitle = await page.title();
              await page.waitForTimeout(2000);

              pageTitle == "Parts Work Mix"
                ? logger.info(
                    "overview bar chart clicked and parts work mix page verify success"
                  )
                : [
                    logger.error(
                      "overview bar chart clicked and parts work mix page verify failed"
                    ),
                    errors.push(
                      "overview bar chart clicked and parts work mix page verify failed"
                    ),
                  ];
            })
            .catch(() => {
              logger.warn("there is no data in bar chart for drill down");
            });
        } else if (
          store == "First Team Hampton Chevrolet" ||
          store == "ABC Networks" ||
          store == "XYZ Group"
        ) {
          const xpath = await page.$x(ws.expBtn);
          await xpath[0].click();
          await page.waitForTimeout(4000);

          await page.mouse
            .click(184, 454, { button: "left" })
            .then(async () => {
              await navigationPromise;
              await page.waitForTimeout(20000);

              const pageTitle = await page.title();
              await page.waitForTimeout(2000);

              pageTitle == "Parts Work Mix"
                ? logger.info(
                    "overview bar chart clicked and parts work mix page verify success"
                  )
                : [
                    logger.error(
                      "overview bar chart clicked and parts work mix page verify failed"
                    ),
                    errors.push(
                      "overview bar chart clicked and parts work mix page verify failed"
                    ),
                  ];
            })
            .catch(() => {
              logger.warn("there is no data in bar chart for drill down");
            });
        } else {
          await page.mouse
            .click(x, y, { button: "left" })
            .then(async () => {
              await navigationPromise;
              await page.waitForTimeout(20000);

              const pageTitle = await page.title();
              await page.waitForTimeout(2000);

              pageTitle == "Parts Work Mix"
                ? logger.info(
                    "overview bar chart clicked and parts work mix page verify success"
                  )
                : [
                    logger.error(
                      "overview bar chart clicked and parts work mix page verify failed"
                    ),
                    errors.push(
                      "overview bar chart clicked and parts work mix page verify failed"
                    ),
                  ];
            })
            .catch(() => {
              logger.warn("there is no data in bar chart for drill down");
            });
        }
      } else {
        logger.error("graph not display properly");
        errors.push("graph not display properly");
      }
    } else {
      logger.error(
        "“What If” Opportunity Hrs Per RO & Parts GP% title verify failed"
      );
      errors.push(
        "“What If” Opportunity Hrs Per RO & Parts GP% title verify failed"
      );
    }
    ts.assert(
      errors.length == 0,
      `Error in Parts Opportunity Hrs Ro Gp Page: ${errors.join("\n")}`
    );
  } catch (error) {
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsOpportunityHrsRoGpPageTest();
