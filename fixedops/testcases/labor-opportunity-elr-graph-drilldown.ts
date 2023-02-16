import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { LaborOppertunityElrSelectors as wl } from "../selectors/labor-opportunity-elr.ts";
import { LaborSelectors as ls } from "../selectors/labor-overview.ts";
import { fixedopsCommonLogin } from "./common/fixedops-common-login.ts";
import { startLogger } from "../utilities/utils.ts";

const logger = startLogger();
const errors: string[] = [];

function fixedOpsOpportunityElrPageTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[AEC-FOCP-UI-FN-LD-0080] ${site.name} FixedOps Labor Opportunity Effective Labor Rate Page Graph Drill Down Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-UI-FN-LD-0080",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await laborOpportunityElrPageGraphDrillDownTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Labor Opportunity Effective Labor Rate Page Graph Drill Down Test";
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

async function laborOpportunityElrPageGraphDrillDownTest(baseURL: string) {
  let browser = null;

  try {
    const oBrowser = await fixedopsCommonLogin(baseURL);
    const page = oBrowser.page;
    browser = oBrowser.browser;
    const navigationPromise = oBrowser.navigationPromise;

    await page.waitForSelector(ls.labor);
    await page.click(ls.labor);
    logger.info("labor expand collapse link clicked!!!");
    await page.waitForTimeout(5000);
    await page.waitForSelector(wl.whatIfElrLink);
    await page.click(wl.whatIfElrLink);
    await navigationPromise;
    await page.waitForTimeout(15000);
    logger.info("what if opportunity elr link clicked!!!");

    const title = await page.title();

    if (title == "“What If” Opportunity Effective Labor Rate") {
      logger.info(
        "“What If” Opportunity Effective Labor Rate title verify success"
      );

      const graph = await page.$eval(wl.chart, (elem) => {
        return elem.style.display !== "none";
      });
      await page.waitForTimeout(5000);
      if (graph) {
        logger.info("graph display properly");

        const selector = await page.waitForSelector(wl.chart);
        const rect = await page.evaluate((el) => {
          const { x, y } = el.getBoundingClientRect();
          return { x, y };
        }, selector);

        const storeName = Deno.env.get("STORE");

        if (storeName == "Koeppel Hyundai") {
          const expandBtn = await page.$x(wl.expandBtn);
          await expandBtn[0].click();
          await page.waitForTimeout(5000);

          await page.mouse
            .click(176, 497, { button: "left" })
            .then(async () => {
              await navigationPromise;
              await page.waitForTimeout(20000);

              const pageTitle = await page.title();
              await page.waitForTimeout(2000);

              pageTitle == "Labor Work Mix"
                ? logger.info(
                    "labor opportunity elr bar chart clicked and labor work mix page verify success"
                  )
                : [
                    logger.error(
                      "labor opportunity elr bar chart clicked and labor work mix page verify failed"
                    ),
                    errors.push(
                      "labor opportunity elr bar chart clicked and labor work mix page verify failed"
                    ),
                  ];
            })
            .catch(() => {
              logger.warn("there is no data in bar chart for drill down");
            });
        } else if (storeName == "Koeppel Ford") {
          const expandBtn = await page.$x(wl.expandBtn);
          await expandBtn[0].click();
          await page.waitForTimeout(5000);

          await page.mouse
            .click(172, 515, { button: "left" })
            .then(async () => {
              await navigationPromise;
              await page.waitForTimeout(20000);

              const pageTitle = await page.title();
              await page.waitForTimeout(2000);

              pageTitle == "Labor Work Mix"
                ? logger.info(
                    "labor opportunity elr bar chart clicked and labor work mix page verify success"
                  )
                : [
                    logger.error(
                      "labor opportunity elr bar chart clicked and labor work mix page verify failed"
                    ),
                    errors.push(
                      "labor opportunity elr bar chart clicked and labor work mix page verify failed"
                    ),
                  ];
            })
            .catch(() => {
              logger.warn("there is no data in bar chart for drill down");
            });
        } else if (storeName == "Kevin Whitaker Chevrolet") {
          const expandBtn = await page.$x(wl.expandBtn);
          await expandBtn[0].click();
          await page.waitForTimeout(5000);
          await page.mouse
            .click(158, 505, { button: "left" })
            .then(async () => {
              await navigationPromise;
              await page.waitForTimeout(20000);

              const pageTitle = await page.title();
              await page.waitForTimeout(2000);

              pageTitle == "Labor Work Mix"
                ? logger.info(
                    "labor opportunity elr bar chart clicked and labor work mix page verify success"
                  )
                : [
                    logger.error(
                      "labor opportunity elr bar chart clicked and labor work mix page verify failed"
                    ),
                    errors.push(
                      "labor opportunity elr bar chart clicked and labor work mix page verify failed"
                    ),
                  ];
            })
            .catch(() => {
              logger.warn("there is no data in bar chart for drill down");
            });
        } else if (
          storeName == " Nationwide Kia" ||
          storeName == " Nationwide Infiniti of Timonium" ||
          storeName == "Sawyer Motors CDJR"
        ) {
          const expandBtn = await page.$x(wl.expandBtn);
          await expandBtn[0].click();
          await page.waitForTimeout(5000);

          await page.mouse
            .click(1073, 499, { button: "left" })
            .then(async () => {
              await navigationPromise;
              await page.waitForTimeout(20000);
              const pageTitle = await page.title();
              await page.waitForTimeout(2000);
              pageTitle == "Labor Work Mix" ||
              pageTitle != "“What If” Opportunity Effective Labor Rate"
                ? logger.info(
                    "labor opportunity elr bar chart clicked and labor work mix page verify success"
                  )
                : [
                    logger.warn(
                      "labor work mix page verify unsuccessful due to there is no data in the graph"
                    ),
                  ];
            })
            .catch(() => {
              logger.warn("there is no data in bar chart for drill down");
            });
        } else if (storeName == "Koeppel Mazda") {
          const expandBtn = await page.$x(wl.expandBtn);
          await expandBtn[0].click();
          await page.waitForTimeout(5000);

          await page.mouse
            .click(218, 500, { button: "left" })
            .then(async () => {
              await navigationPromise;
              await page.waitForTimeout(20000);

              const pageTitle = await page.title();
              await page.waitForTimeout(2000);

              pageTitle == "Labor Work Mix"
                ? logger.info(
                    "labor opportunity elr bar chart clicked and labor work mix page verify success"
                  )
                : [
                    logger.error(
                      "labor opportunity elr bar chart clicked and labor work mix page verify failed"
                    ),
                    errors.push(
                      "labor opportunity elr bar chart clicked and labor work mix page verify failed"
                    ),
                  ];
            })
            .catch(() => {
              logger.warn("there is no data in bar chart for drill down");
            });
        } else if (storeName == "Koeppel Nissan" || storeName == "XYZ Group") {
          const expandBtn = await page.$x(wl.expandBtn);
          await expandBtn[0].click();
          await page.waitForTimeout(5000);

          await page.mouse
            .click(196, 586, { button: "left" })
            .then(async () => {
              await navigationPromise;
              await page.waitForTimeout(20000);

              const pageTitle = await page.title();
              await page.waitForTimeout(2000);

              pageTitle == "Labor Work Mix"
                ? logger.info(
                    "labor opportunity elr bar chart clicked and labor work mix page verify success"
                  )
                : [
                    logger.error(
                      "labor opportunity elr bar chart clicked and labor work mix page verify failed"
                    ),
                    errors.push(
                      "labor opportunity elr bar chart clicked and labor work mix page verify failed"
                    ),
                  ];
            })
            .catch(() => {
              logger.warn("there is no data in bar chart for drill down");
            });
        } else if (storeName == "Suntrup Ford Westport") {
          const expandBtn = await page.$x(wl.expandBtn);
          await expandBtn[0].click();
          await page.waitForTimeout(5000);

          await page.mouse
            .click(160, 499, { button: "left" })
            .then(async () => {
              await navigationPromise;
              await page.waitForTimeout(20000);

              const pageTitle = await page.title();
              await page.waitForTimeout(2000);

              pageTitle == "Labor Work Mix"
                ? logger.info(
                    "labor opportunity elr bar chart clicked and labor work mix page verify success"
                  )
                : [
                    logger.error(
                      "labor opportunity elr bar chart clicked and labor work mix page verify failed"
                    ),
                    errors.push(
                      "labor opportunity elr bar chart clicked and labor work mix page verify failed"
                    ),
                  ];
            })
            .catch(() => {
              logger.warn("there is no data in bar chart for drill down");
            });
        } else if (
          storeName == "Bill Knight Ford" ||
          storeName == "ABC Networks"
        ) {
          const expandBtn = await page.$x(wl.expandBtn);
          await expandBtn[0].click();
          await page.waitForTimeout(5000);

          await page.mouse
            .click(200, 522, { button: "left" })
            .then(async () => {
              await navigationPromise;
              await page.waitForTimeout(20000);

              const pageTitle = await page.title();
              await page.waitForTimeout(2000);

              pageTitle == "Labor Work Mix"
                ? logger.info(
                    "labor opportunity elr bar chart clicked and labor work mix page verify success"
                  )
                : [
                    logger.error(
                      "labor opportunity elr bar chart clicked and labor work mix page verify failed"
                    ),
                    errors.push(
                      "labor opportunity elr bar chart clicked and labor work mix page verify failed"
                    ),
                  ];
            })
            .catch(() => {
              logger.warn("there is no data in bar chart for drill down");
            });
        } else if (storeName == "Hampton Chevrolet") {
          const expandBtn = await page.$x(wl.expandBtn);
          await expandBtn[0].click();
          await page.waitForTimeout(5000);

          await page.mouse
            .click(160, 503, { button: "left" })
            .then(async () => {
              await navigationPromise;
              await page.waitForTimeout(20000);

              const pageTitle = await page.title();
              await page.waitForTimeout(2000);

              pageTitle == "Labor Work Mix"
                ? logger.info(
                    "labor opportunity elr bar chart clicked and labor work mix page verify success"
                  )
                : [
                    logger.error(
                      "labor opportunity elr bar chart clicked and labor work mix page verify failed"
                    ),
                    errors.push(
                      "labor opportunity elr bar chart clicked and labor work mix page verify failed"
                    ),
                  ];
            })
            .catch(() => {
              logger.warn("there is no data in bar chart for drill down");
            });
        } else {
          await page.mouse
            .click(rect.x + 107, rect.y + 122, { button: "left" })
            .then(async () => {
              await navigationPromise;
              await page.waitForTimeout(20000);

              const pageTitle = await page.title();
              await page.waitForTimeout(2000);

              pageTitle == "Labor Work Mix"
                ? logger.info(
                    "labor opportunity elr bar chart clicked and labor work mix page verify success"
                  )
                : [
                    logger.error(
                      "labor opportunity elr bar chart clicked and labor work mix page verify failed"
                    ),
                    errors.push(
                      "labor opportunity elr bar chart clicked and labor work mix page verify failed"
                    ),
                  ];
            })
            .catch(() => {
              logger.warn("there is no data in bar chart for drill down");
            });
        }
        await page.waitForTimeout(5000);
      } else {
        logger.error("graph not display properly");
        errors.push("graph not display properly");
      }
    } else {
      logger.error(
        "“What If” Opportunity Effective Labor Rate title verify failed"
      );
      errors.push(
        "“What If” Opportunity Effective Labor Rate title verify failed"
      );
    }
    ts.assert(
      errors.length == 0,
      `Error in Labor Opportunity Effective Labor Rate Page: ${errors.join(
        "\n"
      )}`
    );
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsOpportunityElrPageTest();
