import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { CpSelectors as cps } from "../selectors/cp-overview.ts";
import { fixedopsCommonLogin } from "./common/fixedops-common-login.ts";
import { startLogger } from "../utilities/utils.ts";

const logger = startLogger();
const errors: string[] = [];

function fixedOpsCpOverviewTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[AEC-FOCP-UI-FN-LD-0033] ${site.name} FixedOps CP Summary Overview Page Common Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-UI-FN-LD-0033",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await cpOverviewPageCommonTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps CP Summary Overview Page Common Test";
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

async function cpOverviewPageCommonTest(baseURL: string) {
  let browser = null;

  try {
    const oBrowser = await fixedopsCommonLogin(baseURL);
    const page = oBrowser.page;
    browser = oBrowser.browser;
    const navigationPromise = oBrowser.navigationPromise;

    await page.waitForSelector(cps.cpsummary);
    await page.click(cps.cpsummary);
    logger.info("CP expand collapse link clicked!!!");
    await page.waitForTimeout(4000);
    await page.waitForSelector(cps.cpOverview);
    await page.click(cps.cpOverview);
    await navigationPromise;
    await page.waitForTimeout(12000);

    const title = await page.title();

    if (title == "CP Summary Overview") {
      logger.info("CP Summary Overview title verify success");

      const [ovrHeading] = await page.$x(cps.cpOvrHeading);

      const heading: string = await (
        await ovrHeading.getProperty("textContent")
      ).jsonValue();

      heading == "CP Summary Overview"
        ? logger.info("CP Summary Overview page heading verify success")
        : [
            logger.info("CP Summary Overview page heading verify failed"),
            errors.push("CP Summary Overview page heading verify failed"),
          ];

      await page
        .waitForSelector(cps.resetBtn, {
          visible: true,
          timeout: 4000,
        })
        .then(() => {
          logger.info("reset layout button display properly");
        })
        .catch(() => {
          logger.info("reset layout button not properly displayed");
          errors.push("reset layout button not properly displayed");
        });

      for (let i = 1; i <= 6; i++) {
        await page
          .waitForXPath(cps.infoIcon(i), {
            visible: true,
          })
          .then(() => {
            logger.info(`info icon ${i} visible properly`);
          })
          .catch(() => {
            logger.info(`info icon ${i} not visible properly`);
            errors.push(`info icon ${i} not visible properly`);
          });
      }
      await page.waitForXPath(cps.cpDataAsOf);
      const x = await page.$x(cps.cpDataAsOf);
      const str: string = await (
        await x[0].getProperty("textContent")
      ).jsonValue();

      str.split(":")[0].includes("Data as of")
        ? logger.info("data as of field properly displayed")
        : [
            logger.info("data as of field not properly displayed"),
            errors.push("data as of field not properly displayed"),
          ];
    } else {
      logger.error("CP Summary overview page title verify failed");
      errors.push("CP Summary overview page title verify failed");
    }
    ts.assert(
      errors.length == 0,
      `Error in CP Summary Overview Page: ${errors.join("\n")}`
    );
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsCpOverviewTest();
