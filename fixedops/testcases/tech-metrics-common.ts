import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { fixedopsCommonLogin } from "./common/fixedops-common-login.ts";
import { AdvisorTechMetricsSelector as as } from "../selectors/advisor-tech-metrics.ts";
import { startLogger } from "../utilities/utils.ts";

const logger = startLogger();

const errors: string[] = [];

function fixedOpsTechMetricsPageTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[AEC-FOCP-UI-FN-LD-0236] ${site.name} FixedOps Tech Metrics Common Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "[AEC-FOCP-UI-FN-LD-0236]",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await techMetricsPageCommonTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Tech Metrics Common Test";
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

async function techMetricsPageCommonTest(baseURL: string) {
  let browser = null;

  try {
    const oBrowser = await fixedopsCommonLogin(baseURL);
    const page = oBrowser.page;
    browser = oBrowser.browser;
    const navigationPromise = oBrowser.navigationPromise;

    await navigationPromise;
    await page.waitForTimeout(15000);

    await page.waitForTimeout(2000);
    await page.waitForSelector(as.techMetricsLink);
    await page.click(as.techMetricsLink);
    await navigationPromise;
    await page.waitForTimeout(15000);
    logger.info("tech metrics link clicked");

    const title = await page.title();

    if (title == "Technician Performance") {
      logger.info("Technician Performance title verify success");

      const mainTabs = [
        as.technicianProductivityTab,
        as.technicianSummeryTab,
        as.technicianDetailedViewTab,
      ];

      const monthlyTabs = [as.techSolidHoursAll, as.techSolidHoursGp];

      const ids = [as.dIcon, as.resetBtn, as.rankingPerRowCls];
      const elementName = ["download icon", "reset button", "ranking per row"];

      for (let i = 0; i <= mainTabs.length - 1; i++) {
        await page.waitForSelector(mainTabs[i]);
        await page.click(mainTabs[i]);
        await navigationPromise;
        await page.waitForTimeout(10000);

        const element = await page.$(mainTabs[i]);
        const mainTabName = await page.evaluate(
          (el) => el.textContent,
          element
        );

        await page
          .waitForXPath(as.techMetricsDataAsOf, {
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
            const element = await page.$eval(await ids[j], (elem) => {
              return elem.style.display !== "none";
            });

            if (element) {
              logger.info(
                `${elementName[j]} display properly under ${mainTabName}`
              );
            } else {
              logger.error(
                `${elementName[j]} not display properly under ${mainTabName}`
              );
              errors.push(
                `${elementName[j]} not display properly under ${mainTabName}`
              );
            }
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

        await page
          .waitForXPath(as.techMetricsDataAsOf, {
            visible: true,
            timeout: 2000,
          })
          .then(() => {
            logger.info(`data as of present under ${tabName} tab`);
          })
          .catch(() => {
            logger.error(`data as of not present under ${tabName} tab`);
            errors.push(`data as of not present under ${tabName} tab`);
          });

        for (let j = 0; j <= ids.length - 1; j++) {
          try {
            const element = await page.$eval(await ids[j], (elem) => {
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
      logger.error("Technician Performance title verify failed");
      errors.push("Technician Performance title verify failed");
    }
    ts.assert(
      errors.length == 0,
      `Error in Tech Metrics Page: ${errors.join("\n")}`
    );
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsTechMetricsPageTest();
