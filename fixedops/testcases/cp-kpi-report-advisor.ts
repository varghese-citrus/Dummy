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
      name: `[AEC-FOCP-UI-FN-LD-0026] ${site.name} FixedOps CP KPI Report Page Advisor Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-UI-FN-LD-0026",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await cpOverviewPageCommonTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps CP KPI Report Advisor Test";
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

      await page.waitForXPath(cps.servceAdvisor);
      const serviceAdvisorSel = await page.$x(cps.servceAdvisor);
      await serviceAdvisorSel[0].click();
      await page.waitForTimeout(4000);

      const serviceLi = await page.$x(cps.serviceAdvLi);
      const servAdvName = await (
        await serviceLi[0].getProperty("textContent")
      ).jsonValue();
      if (servAdvName == "All") {
        logger.info("All Advisor is selected");
        const [servAllMsgAlert] = await page.$x(cps.servAllMsg);
        const headingAdv: string = await (
          await servAllMsgAlert.getProperty("textContent")
        ).jsonValue();
        headingAdv ==
        "Please select an advisor to see the individual advisor report."
          ? logger.info("Select an advisor heading verify success")
          : [
              logger.info("Select an advisor  heading verify failed"),
              errors.push("Select an advisor  heading verify failed"),
            ];

        //Advisor Selected for All
        await page.waitForXPath(cps.kpiReportSelectedAdv);
        const zy = await page.$x(cps.kpiReportSelectedAdv);
        let seladv2: string = await (
          await zy[0].getProperty("textContent")
        ).jsonValue();
        seladv2 = seladv2.split(":")[1].replace("/", "").trim();
        seladv2 == "All Advisors"
          ? logger.info("selected advisor field properly displayed")
          : [
              logger.error("selected advisor field not properly displayed"),
              errors.push("selected advisor field not properly displayed"),
            ];
      }
      //select another advisor
      const serviceLi2 = await page.$x(cps.serviceAdvLi2);
      let servAdvName2: string = await (
        await serviceLi2[0].getProperty("textContent")
      ).jsonValue();
      await serviceLi2[0].click();
      await page.waitForSelector(cps.serviceAdvApplyFilter);
      await page.click(cps.serviceAdvApplyFilter);
      await page.waitForTimeout(8000);

      logger.info("Individual Advisor is selected");
      //Advisor Selected for Individual
      await page.waitForXPath(cps.kpiReportSelectedAdv);
      const zy = await page.$x(cps.kpiReportSelectedAdv);
      let seladv2: string = await (
        await zy[0].getProperty("textContent")
      ).jsonValue();
      seladv2 = seladv2.split(":")[1].replace("/", "").trim();
      servAdvName2 = servAdvName2.trim();

      seladv2 == servAdvName2
        ? logger.info("selected individual advisor field properly displayed")
        : [
            logger.error(
              "selected individual advisor field not properly displayed"
            ),
            errors.push(
              "selected individual advisor field not properly displayed"
            ),
          ];
      //over heading title for individual
      const [ovrHeading] = await page.$x(cps.cpOvrHeading);

      const heading: string = await (
        await ovrHeading.getProperty("textContent")
      ).jsonValue();

      heading == "KPI Report 1 - Individual Advisor"
        ? logger.info(
            "CP KPI Report Individual Advisor page heading verify success"
          )
        : [
            logger.info(
              "CP KPI Report Individual Advisor page heading verify failed"
            ),
            errors.push(
              "CP KPI Report Individual Advisor page heading verify failed"
            ),
          ];
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
