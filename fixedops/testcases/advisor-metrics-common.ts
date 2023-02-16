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
      name: `[AEC-FOCP-UI-FN-LD-0001] ${site.name} FixedOps Advisor Metrics Common Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-UI-FN-LD-0001",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await advisorMetricsPageCommonTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Advisor Metrics Common Test";
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

async function advisorMetricsPageCommonTest(baseURL: string) {
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

      const mainTabs = [
        as.serviceAdvisorPerformanceTab,
        as.serviceAdvisorSummaryTab,
        as.serviceAdvisorDetailedViewTab,
      ];

      const monthlyTabs = [
        as.laborSale,
        as.soldHours,
        as.jobCount,
        as.profit,
        as.elr,
        as.roCount,
        as.partsSale,
        as.partsCost,
        as.partsProfit,
        as.markup,
      ];

      const ids = [as.dIcon, as.resetBtn, as.rankingPerRowCls];
      const elementName = ["download icon", "reset button", "ranking per row"];

      for (let i = 0; i <= mainTabs.length - 1; i++) {
        const mainTab = await page.$x(mainTabs[i]);
        await mainTab[0].click();
        await navigationPromise;
        await page.waitForTimeout(10000);

        const mainTabName = await (
          await mainTab[0].getProperty("textContent")
        ).jsonValue();

        await page
          .waitForXPath(as.advisorMetricsDataAsOf, {
            visible: true,
            timeout: 2000,
          })
          .then(() => {
            logger.info(`data as of present under ${mainTabName} tab`);
          })
          .catch(() => {
            logger.error(`data as of not present under ${mainTabName} tab`);
            errors.push(`data as of not present under ${mainTabName} tab`);
          });

        for (let j = 0; j <= ids.length - 1; j++) {
          try {
            const element = await page.waitForSelector(ids[j], {
              visible: true,
              timeout: 4000,
            });

            element != null
              ? logger.info(
                  `${elementName[j]} display properly under ${mainTabName}`
                )
              : [
                  logger.error(
                    `${elementName[j]} not display properly under ${mainTabName}`
                  ),
                  errors.push(
                    `${elementName[j]} not display properly under ${mainTabName}`
                  ),
                ];
          } catch (error) {
            const errors: string[] = [];
            errors.push(error);
            const e = errors.find((x) => x === error);
            e
              ? logger.info(
                  `${elementName[j]} not present under ${mainTabName},condition success`
                )
              : [
                  logger.error(
                    `${elementName[j]} present under ${mainTabName},condition fail`
                  ),
                  errors.push(
                    `${elementName[j]} present under ${mainTabName},condition fail`
                  ),
                ];
          }
        }
      }

      for (let i = 0; i <= monthlyTabs.length - 1; i++) {
        await page.waitForSelector(monthlyTabs[i]);
        await page.click(monthlyTabs[i]);
        await navigationPromise;
        await page.waitForTimeout(10000);

        const tabName = await page.$eval(
          monthlyTabs[i],
          (element) => element.textContent
        );

        const dataAsOf = await page.waitForXPath(as.advisorMetricsDataAsOf, {
          visible: true,
          timeout: 2000,
        });

        dataAsOf != null
          ? logger.info(`data as of present under ${tabName} tab`)
          : [
              logger.error(`data as of not present under ${tabName} tab`),
              errors.push(`data as of not present under ${tabName} tab`),
            ];
        for (let j = 0; j <= ids.length - 1; j++) {
          try {
            const element = await page.$eval(ids[j], (elem) => {
              return elem.style.display !== "none";
            });

            if (element) {
              logger.info(
                `${elementName[j]} display properly under ${tabName}`
              );
            } else {
              logger.error(
                `${elementName[j]} not display properly under ${tabName}`
              );
              errors.push(
                `${elementName[j]} not display properly under ${tabName}`
              );
            }
          } catch (error) {
            const errors: string[] = [];
            errors.push(error);
            const e = errors.find((x) => x === error);
            e
              ? logger.info(
                  `${elementName[j]} not present under ${tabName},condition success`
                )
              : [
                  logger.error(
                    `${elementName[j]} present under ${tabName},condition fail`
                  ),
                  errors.push(
                    `${elementName[j]} present under ${tabName},condition fail`
                  ),
                ];
          }
        }
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
