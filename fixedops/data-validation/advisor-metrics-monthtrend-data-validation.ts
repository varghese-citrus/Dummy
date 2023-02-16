import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { AdvisorTechMetricsSelector as as } from "../selectors/advisor-tech-metrics.ts";
import { fixedopsCommonLogin } from "../testcases/common/fixedops-common-login.ts";
import { startLogger, getData } from "../utilities/utils.ts";
import { getStore } from "./stores/first-team-stores.ts";

const logger = startLogger();
const errors: string[] = [];

const valData = await getData("advisorMetricsMonthTrend").then((e) => {
  return e;
});
function fixedOpsAdvisorMetricsMonthTrendDataValidationTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[AEC-FOCP-UI-FN-LD-0001] ${site.name} FixedOps Advisor Metrics Page Month Trend Data Validation Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-UI-FN-LD-0001",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await advisorMetricsMonthTrendDataValidationTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Advisor Metrics Page Month Trend Data Validation Test";
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

async function advisorMetricsMonthTrendDataValidationTest(baseURL: string) {
  let browser = null;
  try {
    const oBrowser = await fixedopsCommonLogin(baseURL);
    const page = oBrowser.page;
    browser = oBrowser.browser;
    const navigationPromise = oBrowser.navigationPromise;
    await page.waitForSelector(as.advisorMetricsLink);
    await page.click(as.advisorMetricsLink);
    await navigationPromise;
    await page.waitForTimeout(15000);
    logger.info("advisor link clicked");
    const storeId = valData[0].storeid;
    const store = Deno.env.get("STORE");
    const storeDetail = getStore(storeId);
    const title = await page.title();
    const ids = [
      as.roCountValue,
      as.jobCountValue,
      as.hoursSoldValue,
      as.laborSaleValue,
      as.partsSaleValue,
      as.laborCostValue,
      as.partsCostValue,
      as.laborGpValue,
      as.partsGpValue,
    ];
    const data = [
      valData[0].rocount,
      valData[0].jobcount,
      valData[0].laborsoldhours,
      valData[0].laborsale,
      valData[0].partssale,
      valData[0].laborcost,
      valData[0].partscost,
      valData[0].laborgp,
      valData[0].partsgp,
    ];
    if (
      storeDetail[0].name.toString() == store?.toString() &&
      title == "Service Advisor Performance"
    ) {
      logger.info("Service Advisor Performance title and store verify success");

      if (valData[0].advisor == "(All)" || valData[0].advisor == "All") {
        const serviceAdvisorDetailedViewTab = await page.$x(
          as.serviceAdvisorDetailedViewTab
        );
        await serviceAdvisorDetailedViewTab[0].click();
        logger.info("service advisor detailed view tab clicked");
        await page.waitForTimeout(15000);

        await page.waitForSelector(as.detailedViewMonthSel);
        await page.click(as.detailedViewMonthSel);
        await page.waitForTimeout(4000);
        const month1 = await page.$x(as.detailedViewMonthSelectLi(12));
        await month1[0].click();
        await page.waitForTimeout(4000);
        logger.info("month selected");
        await navigationPromise;
        await page.waitForTimeout(15000);

        for (let i = 0; i < ids.length; i++) {
          const element = await page.$x(ids[i]);
          const elementTxt: string = await (
            await element[0].getProperty("textContent")
          ).jsonValue();
          await page.waitForTimeout(4000);
          const elName = elementTxt.split(":")[0];
          const elValue = elementTxt.split(":")[1].replace(/[^0-9\.]+/g, "");
          const dbData = data[i];
          Number(elValue) == dbData
            ? logger.info(
                `${elName} value ${dbData} is matching with ui displayed value ${elValue}`
              )
            : [
                logger.error(
                  `${elName} value ${dbData} is not matching with ui displayed value ${elValue}`
                ),
                errors.push(
                  `${elName} value ${dbData} is not matching with ui displayed value ${elValue}`
                ),
              ];
        }
      } else {
        const advisor = await page.$x(as.advisor);
        await advisor[0].click();
        await page.waitForTimeout(5000);
        const linkTexts = await page.$$eval(as.advisorSpan, (elements) =>
          elements.map((item) => item.textContent)
        );
        const arr = Array(linkTexts);
        const arr1 = arr.toString().split(",");
        const arr2 = arr1.map((el) => {
          return Number(el.replace(/^\D+/g, "").replace("]", ""));
        });
        const adv = arr2.findIndex((el) => {
          return el === valData[0].advisor;
        });
        const checkBox = await page.$x(as.checkBox(Number(adv) + 1));
        await checkBox[0].click();
        await page.waitForTimeout(4000);
        const filterBtn = await page.$x(as.filterBtn);
        await filterBtn[0].click();
        await page.waitForTimeout(10000);

        const serviceAdvisorDetailedViewTab = await page.$x(
          as.serviceAdvisorDetailedViewTab
        );
        await serviceAdvisorDetailedViewTab[0].click();
        await page.waitForTimeout(12000);
        logger.info("service advisor detailed view tab clicked");

        await page.waitForSelector(as.detailedViewMonthSel);
        await page.click(as.detailedViewMonthSel);
        await page.waitForTimeout(4000);
        const month1 = await page.$x(as.detailedViewMonthSelectLi(12));
        await month1[0].click();
        await page.waitForTimeout(4000);
        logger.info("month selected");
        await navigationPromise;
        await page.waitForTimeout(15000);
        for (let i = 0; i < ids.length; i++) {
          const element = await page.$x(ids[i]);
          const elementTxt: string = await (
            await element[0].getProperty("textContent")
          ).jsonValue();
          await page.waitForTimeout(4000);
          const elName = elementTxt.split(":")[0];
          const elValue = elementTxt.split(":")[1].replace(/[^0-9\.]+/g, "");
          const dbData = data[i];
          Number(elValue) == dbData
            ? logger.info(
                `${elName} value ${dbData} is matching with ui displayed value ${elValue}`
              )
            : [
                logger.error(
                  `${elName} value ${dbData} is not matching with ui displayed value ${elValue}`
                ),
                errors.push(
                  `${elName} value ${dbData} is not matching with ui displayed value ${elValue}`
                ),
              ];
        }
      }
    } else {
      logger.error("store and title of the page verification failed");
      errors.push("store and title of the page verification failed");
    }
    ts.assert(
      errors.length == 0,
      `Error in Advisor Metrics Page: ${errors.join("\n")}`
    );
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsAdvisorMetricsMonthTrendDataValidationTest();
