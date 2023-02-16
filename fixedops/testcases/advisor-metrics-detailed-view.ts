import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { fixedopsCommonLogin } from "./common/fixedops-common-login.ts";
import { AdvisorTechMetricsSelector as as } from "../selectors/advisor-tech-metrics.ts";
import { getRandomNumberBetween } from "../utilities/utils.ts";
import { startLogger } from "../utilities/utils.ts";

const logger = startLogger();

const errors: string[] = [];

function fixedOpsAdvisorMetricsPageTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[AEC-FOCP-UI-FN-LD-0003] ${site.name} FixedOps Advisor Metrics Page Detailed View Tab Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-UI-FN-LD-0003",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await advisorMetricsPageDetailedViewTabTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Advisor Metrics Page Detailed View Tab Test";
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

async function advisorMetricsPageDetailedViewTabTest(baseURL: string) {
  let browser = null;

  try {
    const oBrowser = await fixedopsCommonLogin(baseURL);
    const page = oBrowser.page;
    browser = oBrowser.browser;
    const navigationPromise = oBrowser.navigationPromise;
    await navigationPromise;
    await page.waitForTimeout(15000);

    await page.waitForSelector(as.advisorMetricsLink);
    await page.click(as.advisorMetricsLink);
    await navigationPromise;
    await page.waitForTimeout(15000);
    logger.info("advisor link clicked!!!");

    const title = await page.title();

    if (title == "Service Advisor Performance") {
      logger.info("Service Advisor Performance title verify success");

      const detailedViewTab = await page.waitForXPath(
        as.serviceAdvisorDetailedViewTab,
        {
          visible: true,
          timeout: 2000,
        }
      );
      if (detailedViewTab != null) {
        logger.info("service advisor detailed view tab display properly");

        const detailedView = await page.$x(as.serviceAdvisorDetailedViewTab);
        await detailedView[0].click();
        await page.waitForTimeout(10000);
        logger.info("service advisor detailed view tab clicked");

        await page.waitForSelector(as.detailedViewMonthSel);
        await page.click(as.detailedViewMonthSel);
        await page.waitForTimeout(4000);

        const num1 = await getRandomNumberBetween(1, 12);

        const month1 = await page.$x(as.detailedViewMonthSelectLi(num1));
        await month1[0].click();
        await page.waitForTimeout(4000);
        logger.info("month selected");
        await navigationPromise;
        await page.waitForTimeout(15000);

        await page
          .$eval(as.dataTab, (elem) => {
            return elem.style.display !== "none";
          })
          .then(() => {
            logger.info("service advisor detailed view table display properly");
          })
          .catch(() => {
            logger.error(
              "service advisor detailed view table not display properly"
            );
            errors.push(
              "service advisor detailed view table not display properly"
            );
          });
        await page.waitForTimeout(5000);

        const columnToggleBtn = await page.$x(as.columnToggleBtn);
        await columnToggleBtn[0].click();
        await page.waitForTimeout(4000);

        await page
          .waitForXPath(as.columnDataPanel, {
            visible: true,
            timeout: 2000,
          })
          .then(() => {
            logger.info("column data panel display properly");
          })
          .catch(() => {
            logger.error("column data panel not display properly");
            errors.push("column data panel not display properly");
          });
        await page.waitForTimeout(4000);
        const filterToggleBtn = await page.$x(as.filterToggleBtn);
        await filterToggleBtn[0].click();
        await page.waitForTimeout(4000);

        await page
          .waitForXPath(as.filterDataPanel, {
            visible: true,
            timeout: 2000,
          })
          .then(() => {
            logger.info("filter data panel display properly");
          })
          .catch(() => {
            logger.error("filter data panel not display properly");
            errors.push("filter data panel not display properly");
          });
        await page.waitForTimeout(4000);
        for (let i = 1; i <= 6; i++) {
          const el = await page.$x(as.monthlyTableDataEl(i));
          const dataElement: string = await (
            await el[0].getProperty("textContent")
          ).jsonValue();
          const tabname = dataElement.split(":")[0];
          const value = dataElement.split(":")[1];
          await page
            .waitForXPath(as.monthlyTableDataEl(1), {
              visible: true,
            })
            .then(() => {
              logger.info(
                `monthly table ${tabname} with ${value} display properly`
              );
            })
            .catch(() => {
              logger.error(
                `monthly table ${tabname} with ${value} not display properly`
              );
              errors.push(
                `monthly table ${tabname} with ${value} not display properly`
              );
            });
          await page.waitForTimeout(4000);
        }

        await page
          .waitForSelector(as.dIcon, { visible: true, timeout: 4000 })
          .then(() => {
            logger.info(
              "download icon present under service advisor detailed view tab"
            );
          })
          .catch(() => {
            logger.error(
              "download icon not present under service advisor detailed view tab"
            );
            errors.push(
              "download icon not present under service advisor detailed view tab"
            );
          });
      } else {
        logger.error("service advisor detailed view tab not display properly");
        errors.push("service advisor detailed view tab not display properly");
      }
    } else {
      logger.error("Service Advisor Performance title verify failed");
      errors.push("Service Advisor Performance title verify failed");
    }
    ts.assert(
      errors.length == 0,
      `Error in Advisor Metrics Page: ${errors.join("\n")}`
    );
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsAdvisorMetricsPageTest();
