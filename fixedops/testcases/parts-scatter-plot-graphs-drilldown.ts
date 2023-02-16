import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { PartsScatterPlotSelectors as sp } from "../selectors/parts-scatter-plot.ts";
import { partsoverviewSelectors as ps } from "../selectors/parts-overview.ts";
import { PartsWorkmixOtherSelectors as po } from "../selectors/parts-workmix-other.ts";
import { fixedopsCommonLogin } from "./common/fixedops-common-login.ts";
import { getRandomNumberBetween, startLogger } from "../utilities/utils.ts";

const logger = startLogger();
const errors: string[] = [];

function fixedOpsScatterPlotPartsTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[AEC-FOCP-UI-FN-LD-0176] ${site.name} FixedOps Parts Scatter Plot Page Graphs Drill Down Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-UI-FN-LD-0176",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await scatterPlotPartsGraphsDrillDownTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Parts Scatter Plot Page Graphs Drill Down Test";
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

async function scatterPlotPartsGraphsDrillDownTest(baseURL: string) {
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
    await page.waitForSelector(sp.scatterPlotMenu);
    await page.click(sp.scatterPlotMenu);
    await navigationPromise;
    await page.waitForTimeout(15000);
    logger.info("scatter plot parts link clicked!!!");
    const title = await page.title();
    if (title == "Scatter Plot - Parts Cost / Jobs / Markup") {
      logger.info(
        "Scatter Plot - Parts Cost / Jobs / Markup title verify success"
      );
      const num = await getRandomNumberBetween(1, 3);
      await page.waitForSelector(sp.getTab(num));
      await page.click(sp.getTab(num));
      await page.waitForTimeout(12000);
      const tabname = await page.$eval(
        sp.getTab(num),
        (element) => element.textContent
      );
      await page.waitForXPath(sp.scatterPlotCanvas);
      const graph = await page.waitForXPath(sp.scatterPlotCanvas, {
        visible: true,
        timeout: 2000,
      });
      await page.waitForTimeout(2000);
      if (graph != null) {
        logger.info(`canvas display properly under ${tabname} tab`);
        const num = await getRandomNumberBetween(1, 50);
        await page.waitForTimeout(2000);
        const highChartPointXpath = await page.$x(sp.highChartPoint(num));
        await page.waitForTimeout(2000);
        await highChartPointXpath[0].click();
        await navigationPromise;
        await page.waitForTimeout(20000);
        await page
          .waitForXPath(sp.itemRow, {
            visible: true,
            timeout: 3000,
          })
          .catch(() => {
            logger.error("chart points are not added to chart row");
            errors.push("chart points are not added to chart row");
          });
        await page.waitForTimeout(4000);
        const rowItemXpath = await page.$x(sp.rowItem);
        await rowItemXpath[0].click();
        await navigationPromise;
        logger.info("row item clicked");
        await page.waitForTimeout(15000);
        const popup = await page.waitForSelector(sp.popup, {
          visible: true,
          timeout: 4000,
        });
        await page.waitForTimeout(2000);
        if (popup != null) {
          logger.info("popup display properly");
          await page.waitForTimeout(8000);
          await page
            .waitForSelector(sp.repairOrderTable, {
              visible: true,
              timeout: 4000,
            })
            .then(() => {
              logger.info("repair order table visible properly");
            })
            .catch(() => {
              logger.error("repair order table not visible properly");
              errors.push("repair order table not visible properly");
            });
          await page.waitForTimeout(5000);
          let i = 1;
          let tglNum!: number;
          do {
            try {
              tglNum = await getRandomNumberBetween(1, 2);
              await page.waitForTimeout(2000);
              const btn = await page.waitForXPath(sp.toggleBtn(tglNum), {
                visible: true,
                timeout: 2000,
              });
              if (btn) {
                break;
              }
            } catch (error) {
              const errors: string[] = [];
              errors.push(error);
              const e = errors.find((x) => x === error);
              if (e) {
                i++;
              }
            }
          } while (i > 0);
          await page.waitForTimeout(2000);
          const tglBtn = await page.$x(sp.toggleBtn(tglNum));
          await tglBtn[0].click();
          await navigationPromise;
          await page.waitForTimeout(15000);
          const pageTitle = await page.title();
          if (pageTitle == "Labor Work Mix") {
            logger.info("enters into opcode summery");
            await page.waitForTimeout(2000);
            await page
              .$eval(po.dataTable, (elem) => {
                return elem.style.display !== "none";
              })
              .then(() => {
                logger.info(
                  "data table display properly under opcode summery tab"
                );
              })
              .catch(() => {
                logger.error(
                  "data table not display properly under opcode summery tab"
                );
                errors.push(
                  "data table not display properly under opcode summery tab"
                );
              });
            await page.mouse.click(348, 365, { button: "left" });
            await navigationPromise;
            logger.info("row data clicked");
            await page.waitForTimeout(15000);
            const attr = await page.$eval(po.opcodeDetailedViewTab, (element) =>
              element.getAttribute("aria-selected")
            );
            if (attr) {
              logger.info("enters into opcode detail view");
              await page.waitForTimeout(2000);

              await page
                .$eval(po.dataTable, (elem) => {
                  return elem.style.display !== "none";
                })
                .then(() => {
                  logger.info(
                    "data table display properly under opcode detail view tab"
                  );
                })
                .catch(() => {
                  logger.error(
                    "data table not display properly under opcode detail view tab"
                  );
                  errors.push(
                    "data table not display properly under opcode detail view tab"
                  );
                });
              await page.waitForTimeout(5000);
              await page.mouse.click(896, 360, { button: "left" });
              await navigationPromise;
              logger.info("row data clicked");
              await page.waitForTimeout(15000);
              const pageTitle = await page.title();
              await page.waitForTimeout(5000);
              if (pageTitle == "Search by Ro") {
                logger.info("Search by Ro title verify success");

                await page
                  .$eval(po.repairOrderTable, (elem) => {
                    return elem.style.display !== "none";
                  })
                  .then(() => {
                    logger.info(
                      "scatter plot overview page chart point drill down success"
                    );
                  })
                  .catch(() => {
                    logger.error(
                      "scatter plot overview page chart point drill down failed"
                    );
                    errors.push(
                      "scatter plot overview page chart point drill down failed"
                    );
                  });
                await page.waitForTimeout(5000);
              } else {
                logger.warn("there is no row data for drill down!");
              }
            } else {
              logger.warn("there is no row data for drill down!");
            }
          } else {
            logger.warn("there is no row data for drill down!");
          }
        } else {
          logger.error("popup not displayed properly");
          errors.push("popup not displayed properly");
        }
      } else {
        logger.info(`canvas not displayed properly`);
        errors.push(`canvas not displayed properly`);
      }
      await page.waitForTimeout(2000);
    } else {
      logger.error(
        "Scatter Plot - Parts Cost / Jobs / Markup title verify failed"
      );
      errors.push(
        "Scatter Plot - Parts Cost / Jobs / Markup title verify failed"
      );
    }
    ts.assert(
      errors.length == 0,
      `Error in Scatter Plot Parts Page: ${errors.join("\n")}`
    );
  } catch (error) {
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsScatterPlotPartsTest();
