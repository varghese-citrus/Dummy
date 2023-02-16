import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { AdvisorTechMetricsSelector as as } from "../selectors/advisor-tech-metrics.ts";
import { fixedopsCommonLogin } from "../testcases/common/fixedops-common-login.ts";
import { startLogger, getData } from "../utilities/utils.ts";
import { getStore } from "./stores/first-team-stores.ts";
import { DiscountMetricsSelector as ds } from "../selectors/discount-metrics.ts";

const logger = startLogger();
const errors: string[] = [];

const valData = await getData("discountsummary").then((e) => {
  return e;
});
function fixedOpsDiscountSummaryDataValidationTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[DEMO-TEST] ${site.name} FixedOps Discount Summary Data Validation Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "DEMO-TEST",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await DiscountSummaryDataValidationTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Discount Summary Data Validation Test";
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

async function DiscountSummaryDataValidationTest(baseURL: string) {
  let browser = null;
  try {
    const oBrowser = await fixedopsCommonLogin(baseURL);
    const page = oBrowser.page;
    browser = oBrowser.browser;
    const navigationPromise = oBrowser.navigationPromise;
    await page.waitForSelector(ds.disMetricsLink);
    await page.click(ds.disMetricsLink);
    await navigationPromise;
    await page.waitForTimeout(15000);
    logger.info("Discount link clicked");
    const storeId = valData[0].storeid;
    const store = Deno.env.get("STORE");
    const storeDetail = getStore(storeId);
    const title = await page.title();
    const ids = [
      ds.overallLaborSale,
      ds.overallLaborCost,
      ds.overalldiscount,
      ds.overallRoCount,
      ds.discRoCount,
      ds.discountedLaborSale,
      ds.dsicountedJobCount,
      ds.gpBefordisc,
      ds.gpAfterdisc,
    ];
    const data = [
      valData[0].overallLaborSale,
      valData[0].overallLaborCost,
      valData[0].overalldiscount,
      valData[0].overallRoCount,
      valData[0].discRoCount,
      valData[0].discountedLaborSale,
      valData[0].dsicountedJobCount,
      valData[0].gpBefordisc,
      valData[0].gpAfterdisc,
    ];
    if (
      storeDetail[0].name.toString() == store?.toString() &&
      title == "Discount"
    ) {
      logger.info("discount title and store verify success");

      if (valData[0].advisor == "(All)" || valData[0].advisor == "All") {
        const monthSelect = await page.$x(ds.monthSelect);
        await monthSelect[0].click();
        await page.waitForTimeout(4000);
        const prevMonth = await page.$x(ds.prevMonth);
        await prevMonth[0].click();
        logger.info("month selected");
        await navigationPromise;
        await page.waitForTimeout(15000);

        for (let i = 0; i < ids.length; i++) {
          const element = await page.$x(ids[i]);
          const elementTxt: string = await (
            await element[0].getProperty("textContent")
          ).jsonValue();
          await page.waitForTimeout(4000);
          const elValue = elementTxt.replace(/[^0-9\.]+/g, "");
          const dbData = data[i];
          Number(elValue) == dbData
            ? logger.info(
                `data base value ${dbData} is matching with ui displayed value ${elValue}`
              )
            : [
                logger.error(
                  `data base value ${dbData} is not matching with ui displayed value ${elValue}`
                ),
                errors.push(
                  `data base value ${dbData} is not matching with ui displayed value ${elValue}`
                ),
              ];
        }
      } else {
        const advisor = await page.$x(ds.serviceadvisor);
        await advisor[0].click();
        await page.waitForTimeout(5000);
        const linkTexts = await page.$$eval(ds.advisorSpan, (elements) =>
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
        await page.waitForSelector(ds.monthSelect);
        await page.click(ds.monthSelect);
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
          const elValue = elementTxt.replace(/[^0-9\.]+/g, "");
          const dbData = data[i];
          Number(elValue) == dbData
            ? logger.info(
                `data base value ${dbData} is matching with ui displayed value ${elValue}`
              )
            : [
                logger.error(
                  `data base value ${dbData} is not matching with ui displayed value ${elValue}`
                ),
                errors.push(
                  `data base value ${dbData} is not matching with ui displayed value ${elValue}`
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
      `Error in Discount Metrics Page: ${errors.join("\n")}`
    );
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsDiscountSummaryDataValidationTest();
