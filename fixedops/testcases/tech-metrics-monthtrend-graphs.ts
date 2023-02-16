import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { AdvisorTechMetricsSelector as as } from "../selectors/advisor-tech-metrics.ts";
import { fixedopsCommonLogin } from "./common/fixedops-common-login.ts";
import { getRandomNumberBetween, startLogger } from "../utilities/utils.ts";

const logger = startLogger();

const errors: string[] = [];

function fixedOpsTechMetricsTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[AEC-FOCP-UI-FN-LD-0248] ${site.name} FixedOps Tech Metrics Page Month Trend Graphs Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-UI-FN-LD-0248",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await techMetricsPageMonthTrendGraphsTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Tech Metrics Page Month Trend Graphs Test";
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

async function techMetricsPageMonthTrendGraphsTest(baseURL: string) {
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

      await page.click(as.technicianProductivityTab);
      await page.waitForTimeout(5000);

      const monthTrendTab = await page.waitForXPath(as.monthTrendTab, {
        visible: true,
        timeout: 2000,
      });
      if (monthTrendTab) {
        logger.info("13 month trend by technician tab display properly");

        const monthTrend = await page.$x(as.monthTrendTab);
        await monthTrend[0].click();
        await navigationPromise;
        await page.waitForTimeout(10000);

        const t = await page.$x(as.technicianSelect);
        await t[0].click();
        await page.waitForTimeout(4000);

        let num;
        let technician;
        let technicianSelectLiStatus;
        let flag = 0;

        let i = 1;
        do {
          num = await getRandomNumberBetween(1, 20);
          technician = await page.$x(as.technicianSelectLi(num));
          await page.waitForTimeout(2000);
          technicianSelectLiStatus = await page.evaluate(
            (el) => el.getAttribute("data-active"),
            technician[0]
          );
          await page.waitForTimeout(2000);

          if (technicianSelectLiStatus == "true") {
            flag = 1;
          } else {
            i++;
          }
          if (flag == 1) {
            break;
          }
        } while (i > 0);

        await technician[0].click();
        await page.waitForTimeout(8000);

        await page
          .waitForSelector(as.alertMessage, {
            visible: true,
            timeout: 4000,
          })
          .then(() => {
            logger.warn(
              "there is no data present in the graph,skipping visibility of graph check"
            );
          })
          .catch(async () => {
            logger.info("data is present in the graphs");
            const canvasDiv = await page.$x(as.monthTrendCanvasDiv);
            for (let i = 0; i <= canvasDiv.length - 1; i++) {
              await page
                .waitForXPath(as.getMonthTrendCavas(i + 2), {
                  visible: true,
                  timeout: 2000,
                })
                .then(() => {
                  logger.info(
                    `graph ${
                      i + 1
                    } properly visible under 13 month trend by technician tab`
                  );
                })
                .catch(() => {
                  logger.error(
                    `graph ${
                      i + 1
                    } not properly visible under 13 month trend by technician tab`
                  );
                  errors.push(
                    `graph ${
                      i + 1
                    } not properly visible under 13 month trend by technician tab`
                  );
                });
            }
          });
      } else {
        logger.error("13 month trend by technician tab not display properly");
        errors.push("13 month trend by technician tab not display properly");
      }
    } else {
      logger.info("tech metrics title verify failed");
      errors.push("tech metrics title verify failed");
    }

    ts.assert(
      errors.length == 0,
      `Error in  Tech Metrics Page: ${errors.join("\n")}`
    );
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsTechMetricsTest();
