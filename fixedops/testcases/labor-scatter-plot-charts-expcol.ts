import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { ScatterPlotLaborSelectors as sp } from "../selectors/scatter-plot-labor.ts";
import { LaborSelectors as ls } from "../selectors/labor-overview.ts";
import { fixedopsCommonLogin } from "./common/fixedops-common-login.ts";
import { startLogger } from "../utilities/utils.ts";

const logger = startLogger();
const errors: string[] = [];

function fixedOpsScatterPlotLaborTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[AEC-FOCP-UI-FN-LD-0103] ${site.name} FixedOps Labor Scatter Plot Page Charts Expand Collapse Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-UI-FN-LD-0103",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await scatterPlotLaborPageTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Labor Scatter Plot Page Charts Expand Collapse Test";
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

async function scatterPlotLaborPageTest(baseURL: string) {
  let browser = null;

  try {
    const oBrowser = await fixedopsCommonLogin(baseURL);
    const page = oBrowser.page;
    browser = oBrowser.browser;
    const navigationPromise = oBrowser.navigationPromise;
    await page.waitForSelector(ls.labor);
    await page.click(ls.labor);
    logger.info("labor expand collapse link clicked!!!");
    await page.waitForTimeout(4000);
    await page.waitForSelector(sp.scatterPlotLaborLink);
    await page.click(sp.scatterPlotLaborLink);
    await navigationPromise;
    await page.waitForTimeout(15000);
    logger.info("scatter plot labor link clicked!!!");

    const title = await page.title();

    if (title == "Scatter Plot - Labor Hours / Jobs / ELR") {
      logger.info(
        "Scatter Plot - Labor Hours / Jobs / ELR title verify success"
      );

      for (let i = 1; i <= 3; i++) {
        await page.click(sp.getTab(i));
        await navigationPromise;
        await page.waitForTimeout(5000);

        const tabname = await page.$eval(
          sp.getTab(i),
          (element) => element.textContent
        );

        const expand = await page.$x(sp.chartExpandBtn);
        const expandBtn = await page.waitForXPath(sp.chartExpandBtn, {
          visible: true,
        });

        if (expandBtn != null) {
          logger.info(`expand button display properly under ${tabname} tab`);
          await page.waitForTimeout(4000);

          await expand[0].click();
          await navigationPromise;
          await page.waitForTimeout(8000);

          await page
            .waitForSelector(sp.popup, {
              visible: true,
              timeout: 4000,
            })
            .then(() => {
              logger.info(`chart expand properly under ${tabname} tab`);
            })
            .catch(() => {
              logger.info(`chart not expand properly under ${tabname} tab`);
              errors.push(`chart not expand properly under ${tabname} tab`);
            });
          await page.waitForTimeout(2000);
          const collapseBtn = await page.waitForXPath(sp.chartCollapseBtn, {
            visible: true,
          });
          if (collapseBtn != null) {
            logger.info(
              `collapse button display properly under ${tabname} tab`
            );
            await page.waitForTimeout(4000);
            const collapse = await page.$x(sp.chartCollapseBtn);
            await collapse[0].click();
            await navigationPromise;
            await page.waitForTimeout(12000);
            await page
              .waitForSelector(sp.popup, {
                visible: true,
                timeout: 4000,
              })
              .then(() => {
                logger.error(
                  `chart not collapse properly under ${tabname} tab`
                );
                logger.error(
                  `chart not collapse properly under ${tabname} tab`
                );
              })
              .catch(() => {
                logger.info(`chart collapse properly under ${tabname} tab`);
              });
          } else {
            logger.error(
              `collapse button not display properly under ${tabname} tab`
            );
            errors.push(
              `collapse button not display properly under ${tabname} tab`
            );
          }
        } else {
          logger.error(
            `expand button not display properly under ${tabname} tab`
          );
          errors.push(
            `expand button not display properly under ${tabname} tab`
          );
        }
      }
    } else {
      console.error(
        "Scatter Plot - Labor Hours / Jobs / ELR title verify failed"
      );
      errors.push(
        "Scatter Plot - Labor Hours / Jobs / ELR title verify failed"
      );
    }
    ts.assert(
      errors.length == 0,
      `Error in Scatter Plot Labor Page: ${errors.join("\n")}`
    );
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsScatterPlotLaborTest();
