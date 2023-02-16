import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { AdvisorTechMetricsSelector as as } from "../selectors/advisor-tech-metrics.ts";
import { fixedopsCommonLogin } from "../testcases/common/fixedops-common-login.ts";
import { startLogger, getData } from "../utilities/utils.ts";
import { getStore } from "./stores/first-team-stores.ts";

const logger = startLogger();
const errors: string[] = [];

const valData = await getData("TechMetrics").then((e) => {
  return e;
});
const technician = valData[0].technicianid;
function fixedOpsTechMetricsTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[AEC-FOCP-UI-FN-LD-0001] ${site.name} FixedOps Tech Metrics Page Data Validation Test`,
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
          await techMetricsPageMonthCmpGraphsTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Tech Metrics Page Data Validation Test";
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
    await page.waitForSelector(as.techMetricsLink);
    await page.click(as.techMetricsLink);
    await navigationPromise;
    await page.waitForTimeout(15000);
    logger.info("tech metrics link clicked");
    const title = await page.title();
    const storeId = valData[0].storeid;
    const store = Deno.env.get("STORE");
    const storeDetail = getStore(Number(storeId));
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
      valData[0].soldhours,
      valData[0].laborsale,
      valData[0].partssale,
      valData[0].laborcost,
      valData[0].partscost,
      valData[0].laborgp,
      valData[0].partsgp,
    ];

    if (
      storeDetail[0].name.toString() == store?.toString() &&
      title == "Technician Performance"
    ) {
      logger.info("home page title and store verify success");

      if (
        valData[0].technicianid == "(All)" ||
        valData[0].technicianid == "All"
      ) {
        logger.info("Technician Performance title verify success");
        await page.waitForSelector(as.technicianDetailedViewTab);
        await page.click(as.technicianDetailedViewTab);
        logger.info("technician detailed view tab clicked");
        await page.waitForTimeout(10000);
        await page.waitForSelector(as.detailedViewMonthSel);
        await page.click(as.detailedViewMonthSel);
        await page.waitForTimeout(4000);
        const month1 = await page.$x(as.detailedViewMonthSelectLi(12));
        await month1[0].click();
        await page.waitForTimeout(4000);
        logger.info("month selected");
        await navigationPromise;
        await page.waitForTimeout(20000);

        for (let j = 0; j < ids.length; j++) {
          const element = await page.$x(ids[j]);
          const elementTxt: string = await (
            await element[0].getProperty("textContent")
          ).jsonValue();
          await page.waitForTimeout(4000);
          const elName = elementTxt.split(":")[0];
          const elValue = elementTxt.split(":")[1].replace(/[^0-9\.]+/g, "");
          const dbData = data[j];
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
        logger.info("Technician Performance title verify success");
        await page.waitForSelector(as.technicianDetailedViewTab);
        await page.click(as.technicianDetailedViewTab);
        logger.info("technician detailed view tab clicked");
        await page.waitForTimeout(10000);
        await page.waitForSelector(as.detailedViewMonthSel);
        await page.click(as.detailedViewMonthSel);
        await page.waitForTimeout(4000);
        const month1 = await page.$x(as.detailedViewMonthSelectLi(12));
        await month1[0].click();
        await page.waitForTimeout(4000);
        logger.info("month selected");
        await navigationPromise;
        await page.waitForTimeout(20000);
        const technicianFilterBtn = await page.$x(as.technicianFilterButton);
        await technicianFilterBtn[0].click();
        await page.waitForTimeout(5000);
        const selectAllCheckbox = await page.$x(as.technicianCheckBox(1));
        await selectAllCheckbox[0].click();
        await page.waitForTimeout(5000);
        const searchInput = await page.$x(as.technicianSearch);
        await searchInput[0].click({ clickCount: 3 });
        await searchInput[0].type(technician.toString());
        await page.waitForTimeout(4000);
        await page.keyboard.press("Tab");
        await page.waitForTimeout(10000);

        for (let j = 0; j < ids.length; j++) {
          const element = await page.$x(ids[j]);
          const elementTxt: string = await (
            await element[0].getProperty("textContent")
          ).jsonValue();
          await page.waitForTimeout(4000);
          const elName = elementTxt.split(":")[0];
          const elValue = elementTxt.split(":")[1].replace(/[^0-9\.]+/g, "");
          const dbData = data[j];
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
      `Error in Tech Metrics Page: ${errors.join("\n")}`
    );
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsTechMetricsTest();
