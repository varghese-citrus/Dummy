import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { LaborSelectors as ls } from "../selectors/labor-overview.ts";
import { fixedopsCommonLogin } from "./common/fixedops-common-login.ts";
import { startLogger } from "../utilities/utils.ts";

const logger = startLogger();
const errors: string[] = [];

function fixedOpsLaborOverviewTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[AEC-FOCP-UI-FN-LD-0092] ${site.name} FixedOps Labor Overview Page Charts Names Numbers Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-UI-FN-LD-0092",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await laborOverviewPageChartsNamesNumbersTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Labor Overview Page Charts Names Numbers Test";
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

async function laborOverviewPageChartsNamesNumbersTest(baseURL: string) {
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
    await page.waitForSelector(ls.laborOverview);
    await page.click(ls.laborOverview);
    await navigationPromise;
    await page.waitForTimeout(12000);

    const title = await page.title();

    if (title == "CP Labor Overview") {
      logger.info("CP Labor Overview title verify success");

      const chartDetails = [
        {
          id: 960,
          name: "CP Labor Revenue",
        },
        {
          id: 944,
          name: "CP Labor Gross Profit",
        },
        {
          id: 1073,
          name: "CP Labor GP %",
        },
        {
          id: 1133,
          name: "CP Labor Sold Hours",
        },
        {
          id: 1127,
          name: "CP Effective Labor Rate",
        },
        {
          id: 1044,
          name: "CP Labor Hours Per RO",
        },
        {
          id: 1098,
          name: "CP Effective Labor Rate - Repair And Competitive",
        },
        {
          id: 1138,
          name: "CP RO Count",
        },
        {
          id: 918,
          name: "CP Job Count ",
        },
        {
          id: 955,
          name: "CP Average Labor Sale Per RO",
        },
      ];

      for (let i = 0; i <= chartDetails.length - 1; i++) {
        const chartNameXpath = await page.$x(ls.chartNames(i + 1));
        const chartNumXpath = await page.$x(ls.chartNumbers(i + 1));
        await page.waitForTimeout(5000);

        const chartName: string = await (
          await chartNameXpath[0].getProperty("textContent")
        ).jsonValue();
        await page.waitForTimeout(5000);

        const chartNum = await (
          await chartNumXpath[0].getProperty("textContent")
        ).jsonValue();
        await page.waitForTimeout(5000);
        const data = chartDetails[i];
        chartName == data.name && chartNum == data.id
          ? logger.info(
              `chart name ${chartName} and number ${chartNum} verify success`
            )
          : [
              logger.info(
                `chart name ${chartName} and number ${chartNum} verify failed`
              ),
              errors.push(
                `chart name ${chartName} and number ${chartNum} verify failed`
              ),
            ];
      }
    } else {
      logger.error("labor overview page title verify failed");
      errors.push("labor overview page title verify failed");
    }
    ts.assert(
      errors.length == 0,
      `Error in Labor Overview Page: ${errors.join("\n")}`
    );
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsLaborOverviewTest();
