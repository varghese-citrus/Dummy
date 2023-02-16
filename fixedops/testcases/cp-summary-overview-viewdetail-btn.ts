import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { CpSelectors as cps } from "../selectors/cp-overview.ts";
import { fixedopsCommonLogin } from "./common/fixedops-common-login.ts";
import { startLogger } from "../utilities/utils.ts";

const logger = startLogger();
const errors: string[] = [];

function fixedOpsCPOverviewTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[AEC-FOCP-UI-FN-LD-0038] ${site.name} FixedOps Cp Summary Overview Page View Detail Button Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-UI-FN-LD-0038",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await cpOverviewPageViewDetailBtnTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Cp Summary Overview Page View Detail Button Test";
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

async function cpOverviewPageViewDetailBtnTest(baseURL: string) {
  let browser = null;

  try {
    const oBrowser = await fixedopsCommonLogin(baseURL);
    const page = oBrowser.page;
    browser = oBrowser.browser;
    const navigationPromise = oBrowser.navigationPromise;

    await page.waitForSelector(cps.cpsummary);
    await page.click(cps.cpsummary);
    logger.info("cp expand collapse link clicked!!!");
    await page.waitForTimeout(4000);

    await page.waitForSelector(cps.cpOverview);
    await page.click(cps.cpOverview);
    await navigationPromise;
    await page.waitForTimeout(12000);

    const title = await page.title();

    if (title == "CP Summary Overview") {
      logger.info("CP Summary Overview title verify success");

      const ids = [
        cps.viewDetailBtn1,
        cps.viewDetailBtn2,
        cps.viewDetailBtn3,
        cps.viewDetailBtn4,
        cps.viewDetailBtn5,
        cps.viewDetailBtn6,
      ];

      for (let i = 0; i <= ids.length - 1; i++) {
        await page.waitForSelector(ids[i]);
        await page.click(ids[i]);
        await navigationPromise;
        await page.waitForTimeout(5000);

        const title = await page.title();

        await page.goBack();
        await navigationPromise;
        await page.waitForTimeout(5000);

        title == "Overview"
          ? logger.info(`view detail button ${i + 1} working properly`)
          : [
              logger.info(`view detail button ${i + 1} working properly`),
              errors.push(`view detail button ${i + 1} working properly`),
            ];
      }
    } else {
      logger.error("cp overview page title verify failed");
      errors.push("cp overview page title verify failed");
    }
    ts.assert(
      errors.length == 0,
      `Error in CP Overview Page: ${errors.join("\n")}`
    );
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsCPOverviewTest();
