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
      name: `[AEC-FOCP-UI-FN-LD-0240] ${site.name} FixedOps Tech Metrics Page Month Comparison Graphs Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-UI-FN-LD-0240",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await techMetricsPageMonthCmpGraphsTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Tech Metrics Page Month Comparison Graphs Test";
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

async function techMetricsPageMonthCmpGraphsTest(baseURL: string) {
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

      await page.waitForSelector(as.technicianProductivityTab);
      await page.click(as.technicianProductivityTab);
      await page.waitForTimeout(5000);

      await page.waitForXPath(as.monthCmpTab);
      const cmpMonthTab = await page.$x(as.monthCmpTab);

      await cmpMonthTab[0].click();
      await navigationPromise;
      await page.waitForTimeout(10000);

      const monthSel1 = await page.$x(as.cmpMonthSelect_1);
      await monthSel1[0].click();
      await page.waitForTimeout(4000);

      const num1 = await getRandomNumberBetween(1, 12);

      const month1 = await page.$x(as.monthSelectLi(num1));
      await month1[0].click();
      await page.waitForTimeout(4000);
      logger.info("month 1 selected");

      const monthSel2 = await page.$x(as.cmpMonthSelect_2);
      await monthSel2[0].click();
      await page.waitForTimeout(4000);

      const num2 = await getRandomNumberBetween(1, 12);

      const month2 = await page.$x(as.monthSelectLi(num2));
      await month2[0].click();
      await page.waitForTimeout(4000);
      logger.info("month 2 selected");

      await page.waitForTimeout(50000);
      await navigationPromise;

      const canvasDiv = await page.$x(as.monthCmpCanvasDiv);

      for (let i = 0; i <= canvasDiv.length - 1; i++) {
        await page
          .waitForXPath(as.getMonthCmpCavas(i + 2), {
            visible: true,
            timeout: 2000,
          })
          .then(() => {
            logger.info(
              `graph ${i + 1} properly visible under comparison by month tab`
            );
          })
          .catch(() => {
            logger.error(
              `graph ${
                i + 1
              } not properly visible under comparison by month tab`
            );
            errors.push(
              `graph ${
                i + 1
              } not properly visible under comparison by month tab`
            );
          });
      }
    } else {
      logger.info("Technician Performance title verify failed");
      errors.push("Technician Performance title verify failed");
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
