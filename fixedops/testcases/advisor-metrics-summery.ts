import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { fixedopsCommonLogin } from "./common/fixedops-common-login.ts";
import { AdvisorTechMetricsSelector as as } from "../selectors/advisor-tech-metrics.ts";
import { startLogger } from "../utilities/utils.ts";

const logger = startLogger();
const errors: string[] = [];

function fixedOpsAdvisorMetricsPageTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[AEC-FOCP-UI-FN-LD-0025] ${site.name} FixedOps Advisor Metrics Page Summary Tab Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "[AEC-FOCP-UI-FN-LD-0025]",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await advisorMetricsPageSummaryTabTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Advisor Metrics Page Summary Tab Test";
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

async function advisorMetricsPageSummaryTabTest(baseURL: string) {
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

      const summeryTab = await page.waitForXPath(as.serviceAdvisorSummaryTab, {
        visible: true,
        timeout: 2000,
      });

      if (summeryTab != null) {
        logger.info("service advisor summery tab display properly");

        const summary = await page.$x(as.serviceAdvisorSummaryTab);

        await summary[0].click();
        await page.waitForTimeout(20000);
        logger.info("service advisor summery tab clicked");

        await page
          .$eval(as.dataTab, (elem) => {
            return elem.style.display !== "none";
          })
          .then(() => {
            logger.info("service advisor summery table display properly");
          })
          .catch(() => {
            logger.error("service advisor summery table not display properly");
            errors.push("service advisor summery table not display properly");
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

        await page
          .waitForSelector(as.dIcon, {
            visible: true,
            timeout: 4000,
          })
          .then(() => {
            logger.info(
              "download icon present under service advisor summery tab"
            );
          })
          .catch(() => {
            logger.error(
              "download icon not present under service advisor summery tab"
            );
            errors.push(
              "download icon not present under service advisor summery tab"
            );
          });
        await page.waitForTimeout(4000);
      } else {
        logger.error("service advisor summery tab not display properly");
        errors.push("service advisor summery tab not display properly");
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
