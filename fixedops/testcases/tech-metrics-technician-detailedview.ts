import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { fixedopsCommonLogin } from "./common/fixedops-common-login.ts";
import { AdvisorTechMetricsSelector as as } from "../selectors/advisor-tech-metrics.ts";
import { getRandomNumberBetween, startLogger } from "../utilities/utils.ts";

const logger = startLogger();

const errors: string[] = [];

function fixedOpsTechMetricsPageTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[AEC-FOCP-UI-FN-LD-0252] ${site.name} FixedOps Tech Metrics Page Technician Detailed View Tab Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-UI-FN-LD-0252",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await techMetricsPageTechnicianDetailedViewTabTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Tech Metrics Page Technician Detailed View Tab Test";
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

async function techMetricsPageTechnicianDetailedViewTabTest(baseURL: string) {
  let browser = null;

  try {
    const oBrowser = await fixedopsCommonLogin(baseURL);
    const page = oBrowser.page;
    browser = oBrowser.browser;
    const navigationPromise = oBrowser.navigationPromise;

    await navigationPromise;
    await page.waitForTimeout(15000);

    await page.waitForSelector(as.techMetricsLink);
    await page.click(as.techMetricsLink);
    await navigationPromise;
    await page.waitForTimeout(15000);
    logger.info("tech metrics link clicked");

    const title = await page.title();

    if (title == "Technician Performance") {
      logger.info("Technician Performance title verify success");

      const detailedViewTab = await page.$eval(
        as.technicianDetailedViewTab,
        (elem) => {
          return elem.style.display !== "none";
        }
      );

      if (detailedViewTab) {
        logger.info("technician detailed view tab display properly");

        await page.waitForSelector(as.technicianDetailedViewTab);
        await page.click(as.technicianDetailedViewTab);
        await page.waitForTimeout(10000);

        logger.info("technician detailed view tab clicked");

        await page.waitForSelector(as.detailedViewMonthSel);
        await page.click(as.detailedViewMonthSel);
        await page.waitForTimeout(4000);

        const num1 = await getRandomNumberBetween(1, 12);

        const month1 = await page.$x(as.detailedViewMonthSelectLi(num1));
        await month1[0].click();
        await page.waitForTimeout(4000);
        logger.info("month selected");
        await navigationPromise;
        await page.waitForTimeout(20000);

        await page
          .$eval(as.dataTab, (elem) => {
            return elem.style.display !== "none";
          })
          .then(() => {
            logger.info("technician detailed view table display properly");
          })
          .catch(() => {
            logger.error("technician detailed view table not display properly");
            errors.push("technician detailed view table not display properly");
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
          .waitForSelector(as.dIcon, {
            visible: true,
            timeout: 4000,
          })
          .then(() => {
            logger.info(
              "download icon present under technician detailed view tab"
            );
          })
          .catch(() => {
            logger.error(
              "download icon not present under technician detailed view tab"
            );
            errors.push(
              "download icon not present under service advisor detailed view tab"
            );
          });
      } else {
        logger.error("technician detailed view tab not display properly");
        errors.push("technician detailed view tab not display properly");
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
