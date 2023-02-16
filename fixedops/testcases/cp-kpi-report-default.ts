import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { CpKpiSelectors as cps } from "../selectors/cp-kpi-report.ts";
import { fixedopsCommonLogin } from "./common/fixedops-common-login.ts";
import { getRandomNumberBetween } from "../utilities/utils.ts";
import { startLogger } from "../utilities/utils.ts";

const logger = startLogger();
const errors: string[] = [];

function fixedOpsCpKpiReportTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[AEC-FOCP-UI-FN-LD-0028] ${site.name} FixedOps CP KPI Report Page Default Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-UI-FN-LD-0028",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await cpOverviewPageCommonTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps CP KPI Report Page Default Test";
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
    await page.waitForTimeout(15000);

    const title = await page.title();

    if (title == "KPI Report 1 - Individual Advisor") {
      logger.info("CP KPI Report title verify success");
      await page.waitForTimeout(5000);
      await page
        .$eval(cps.kpiReportTable, (elem) => {
          return elem.style.display !== "none";
        })
        .then(() => {
          logger.info("KPI Report Data display properly");
        })
        .catch(() => {
          logger.info("KPI Report Data not properly displayed");
          errors.push("KPI Report Data not properly displayed");
        });

      await page.waitForXPath(cps.kpiReportDate);
      const x = await page.$x(cps.kpiReportDate);
      let datestr: string = await (
        await x[0].getProperty("textContent")
      ).jsonValue();
      datestr = datestr.replace(/\s/g, "");
      await page.waitForXPath(cps.kpiReportSelectedDate);
      const y = await page.$x(cps.kpiReportSelectedDate);
      let seldatestr: string = await (
        await y[0].getProperty("textContent")
      ).jsonValue();
      seldatestr = seldatestr.split(": ")[1].replace(/\s/g, "");
      seldatestr.includes(datestr)
        ? logger.info("date field properly displayed")
        : [
            logger.info("date field not properly displayed"),
            errors.push("date field not properly displayed"),
          ];

      const num1 = await getRandomNumberBetween(1, 10);
      await page.waitForSelector(cps.datetoggleBtn);
      await page.click(cps.datetoggleBtn);
      await page.waitForTimeout(5000);
      const [el] = await page.$x(cps.getRandDateSel(num1));
      const li: string = await (
        await el.getProperty("textContent")
      ).jsonValue();
      await el.click();
      await navigationPromise;
      await page.waitForTimeout(8000);
      logger.info(`${li} selected`);

      //to check if selected date shown is same as the value of "Selected:"
      const date_repl = li.replace(/\s/g, "");
      await page.waitForXPath(cps.kpiReportSelectedDate);
      const z = await page.$x(cps.kpiReportSelectedDate);
      let seldatestr2: string = await (
        await z[0].getProperty("textContent")
      ).jsonValue();
      seldatestr2 = seldatestr2.split(": ")[1].replace(/\s/g, "");
      seldatestr2.includes(date_repl)
        ? logger.info("selected date field properly displayed")
        : [
            logger.info("selected date field not properly displayed"),
            errors.push("selected date field not properly displayed"),
          ];
    } else {
      logger.error("CP KPI Report page title verify failed");
      errors.push("CP KPI Report  page title verify failed");
    }
    ts.assert(
      errors.length == 0,
      `Error in CP KPI Report Page: ${errors.join("\n")}`
    );
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsCpKpiReportTest();
