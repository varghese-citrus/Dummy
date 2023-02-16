import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { CpKpiSelectors as cps } from "../selectors/cp-kpi-report.ts";
import { fixedopsCommonLogin } from "./common/fixedops-common-login.ts";
import { startLogger } from "../utilities/utils.ts";

const logger = startLogger();
const errors: string[] = [];

function fixedOpsCpKpiReportTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[AEC-FOCP-UI-FN-LD-0027] ${site.name} FixedOps CP KPI Report Page Common Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-UI-FN-LD-0027",
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
    await page.waitForTimeout(5000);
    await page.waitForSelector(cps.cpKpiReport);
    await page.click(cps.cpKpiReport);
    await navigationPromise;
    await page.waitForTimeout(12000);

    const title = await page.title();

    if (title == "KPI Report 1 - Individual Advisor") {
      logger.info("CP KPI Report title verify success");

      await page.waitForXPath(cps.kpiReportStore);
      const st = await page.$x(cps.kpiReportStore);
      let storestr: string = await (
        await st[0].getProperty("textContent")
      ).jsonValue();

      storestr = storestr.replace(/\s/g, "");
      await page.waitForXPath(cps.kpiReportSelectedStore);
      const y = await page.$x(cps.kpiReportSelectedStore);
      let selstorestr: string = await (
        await y[0].getProperty("textContent")
      ).jsonValue();
      selstorestr = selstorestr.split(":")[1].replace("/", "");
      selstorestr = selstorestr.replace(/\s/g, "");
      selstorestr == storestr
        ? logger.info("Selected store field properly displayed")
        : [
            logger.info("Selected store field not properly displayed"),
            errors.push("Selected store field not properly displayed"),
          ];

      const [ovrHeading] = await page.$x(cps.cpOvrHeading);

      const heading: string = await (
        await ovrHeading.getProperty("textContent")
      ).jsonValue();

      heading == "KPI Report 1 - All Advisors"
        ? logger.info("CP KPI Report page heading verify success")
        : [
            logger.info("CP KPI Report page heading verify failed"),
            errors.push("CP KPI Report page heading verify failed"),
          ];

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

      await page
        .waitForXPath(cps.kpiFixedOpsHeading, {
          visible: true,
          timeout: 2000,
        })
        .then(() => {
          logger.info("Fixed Ops heading properly displayed");
        })
        .catch(() => {
          logger.error("Fixed Ops heading not properly displayed");
          errors.push("Fixed Ops heading not properly displayed");
        });
      await page
        .waitForXPath(cps.kpiexportPdf, {
          visible: true,
          timeout: 2000,
        })
        .then(() => {
          logger.info("Export Button properly displayed");
        })
        .catch(() => {
          logger.error("Export Button not properly displayed");
          errors.push("Export Button not properly displayed");
        });
    } else {
      logger.error("CP KPI Report page title verify failed");
      errors.push("CP KPI Report  page title verify failed");
    }
    ts.assert(
      errors.length == 0,
      `Error in  CP KPI Report Page: ${errors.join("\n")}`
    );
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsCpKpiReportTest();
