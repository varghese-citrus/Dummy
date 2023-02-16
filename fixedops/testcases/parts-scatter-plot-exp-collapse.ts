import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { PartsScatterPlotSelectors as ps } from "../selectors/parts-scatter-plot.ts";
import { fixedopsCommonLogin } from "./common/fixedops-common-login.ts";
import { startLogger } from "../utilities/utils.ts";

const logger = startLogger();
const errors: string[] = [];

function fixedOpsPartsScatterPlotTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[AEC-FOCP-UI-FN-LD-0174] ${site.name} FixedOps Parts Scatter Plot Expand Collapse Check`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "[AEC-FOCP-UI-FN-LD-0174]",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await partsScatterPlotChartExpandCollapseCheck(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Parts Scatter Plot Expand Collapse Check";
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
async function partsScatterPlotChartExpandCollapseCheck(baseURL: string) {
  let browser = null;
  try {
    const oBrowser = await fixedopsCommonLogin(baseURL);
    const page = oBrowser.page;
    browser = oBrowser.browser;
    const navigationPromise = oBrowser.navigationPromise;
    await page.waitForSelector(ps.partsMenu);
    await page.click(ps.partsMenu);
    logger.info("Parts Menu clicked");
    await page.waitForTimeout(5000);
    await page.waitForSelector(ps.scatterPlotMenu);
    await page.click(ps.scatterPlotMenu);
    await navigationPromise;
    await page.waitForTimeout(15000);
    logger.info("Parts scatter plot clicked!!!");
    const title = await page.title();
    if (title == "Scatter Plot - Parts Cost / Jobs / Markup") {
      logger.info("Scatter plot title verified!!!");
      for (let i = 1; i <= 3; i++) {
        const tab = await page.$x(ps.monthTab(i));
        await tab[0].click();
        const tabName = await (
          await tab[0].getProperty("textContent")
        ).jsonValue();
        await navigationPromise;
        await page.waitForTimeout(15000);
        const expand = await page.$x(ps.expandBtn);
        const expandBtn = await page.waitForXPath(ps.expandBtn, {
          visible: true,
        });
        if (expandBtn != null) {
          logger.info(`expand button display properly under ${tabName} tab`);
          await page.waitForTimeout(4000);
          await expand[0].click();
          await navigationPromise;
          await page.waitForTimeout(8000);
          await page
            .waitForSelector(ps.popUp, {
              visible: true,
              timeout: 4000,
            })
            .then(() => {
              logger.info(`chart expand properly under ${tabName} tab`);
            })
            .catch(() => {
              logger.error(`chart not expand properly under ${tabName} tab`);
              errors.push(`chart not expand properly under ${tabName} tab`);
            });
          await page.waitForTimeout(2000);
          const collapseBtn = await page.waitForXPath(ps.collapseBtn, {
            visible: true,
            timeout: 4000,
          });
          if (collapseBtn != null) {
            logger.info(
              `collapse button display properly under ${tabName} tab`
            );
            await page.waitForTimeout(4000);
            const collapse = await page.$x(ps.collapseBtn);
            await collapse[0].click();
            await navigationPromise;
            await page.waitForTimeout(8000);
            await page
              .waitForSelector(ps.popUp, {
                visible: true,
                timeout: 4000,
              })
              .then(() => {
                logger.error(
                  `chart not collapse properly under ${tabName} tab`
                );
                errors.push(`chart not collapse properly under ${tabName} tab`);
              })
              .catch(() => {
                logger.info(`chart collapse properly under ${tabName} tab`);
              });
          } else {
            logger.error(
              `collapse button not display properly under ${tabName} tab`
            );
            errors.push(
              `collapse button not display properly under ${tabName} tab`
            );
          }
        } else {
          logger.error(
            `expand button not display properly under ${tabName} tab`
          );
          errors.push(
            `expand button not display properly under ${tabName} tab`
          );
        }
      }
    } else {
      logger.error("Title verified failed");
      errors.push("Title verified failed");
    }
    ts.assert(
      errors.length == 0,
      `Error in Parts Scatter Plot Page: ${errors.join("\n")}`
    );
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsPartsScatterPlotTest();
