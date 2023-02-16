import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { HomeSelectors as hs } from "../selectors/home.ts";
import { fixedopsCommonLogin } from "../testcases/common/fixedops-common-login.ts";
import { startLogger, getData } from "../utilities/utils.ts";
import { getStore } from "./stores/first-team-stores.ts";

const logger = startLogger();
const errors: string[] = [];
const valData = await getData("kpi").then((e) => {
  return e;
});
function fixedOpsHomeKpiReportDataValidationTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[AEC-FOCP-UI-FN-LD-0001] ${site.name} FixedOps Home Kpi Report Data Validation Test`,
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
          await homeKpiReportDataValidationTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Home Kpi Report Data Validation Test";
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

async function homeKpiReportDataValidationTest(baseURL: string) {
  let browser = null;
  try {
    const oBrowser = await fixedopsCommonLogin(baseURL);
    const page = oBrowser.page;
    browser = oBrowser.browser;
    const navigationPromise = oBrowser.navigationPromise;
    await page.reload();
    await navigationPromise;
    await page.waitForTimeout(15000);
    const storeId = valData[0].storeid;
    const store = Deno.env.get("STORE");
    const storeDetail = getStore(Number(storeId));
    const title = await page.title();

    const ids = [
      hs.laborsalesperop,
      hs.laborgpeprro,
      hs.laborgppercentage,
      hs.laborsales,
      hs.laborgp,
      hs.partssalesperop,
      hs.partsgpeprro,
      hs.partsgppercentage,
      hs.partssales,
      hs.partsgp,
      hs.combsalesperro,
      hs.combgpperro,
      hs.combsales,
      hs.combgp,
      hs.allsoldhours,
    ];
    const data = [
      valData[0].laborsalesperop,
      valData[0].laborgpeprro,
      valData[0].laborgppercentage,
      valData[0].laborsales,
      valData[0].laborgp,
      valData[0].partssalesperop,
      valData[0].partsgpeprro,
      valData[0].partsgppercentage,
      valData[0].partssales,
      valData[0].partsgp,
      valData[0].combsalesperro,
      valData[0].combgpperro,
      valData[0].combsales,
      valData[0].combgp,
      valData[0].allsoldhours,
    ];

    const elementName = [
      "labor sales per ro",
      "labor gp per ro",
      "labor gp percentage",
      "labor sales",
      "labor gp",
      "parts sales per ro",
      "parts gp per ro",
      "parts gp percentage",
      "parts sales",
      "parts gp",
      "comb sales per ro",
      "comb gp per ro",
      "comb sales",
      "comb gp",
      "all sold hours",
    ];

    if (
      storeDetail[0].name.toString() == store?.toString() &&
      title == "Home"
    ) {
      logger.info("home page title and store verify success");

      if (valData[0].advisor == "(All)" || valData[0].advisor == "All") {
        await page
          .waitForSelector(hs.kpiSummaryBlock, { visible: true, timeout: 4000 })
          .then(async () => {
            logger.info("kpi report summary block visible properly");

            await page.click(hs.toggleSelect);
            logger.info("toggle select clicked");
            await page.waitForTimeout(5000);

            const lastMonthSelect = await page.$x(hs.lastMonthToggle);
            await lastMonthSelect[0].click();
            logger.info("last month toggle selected");
            await page.waitForTimeout(5000);

            for (let i = 0; i < ids.length; i++) {
              const element = await page.$x(ids[i]);
              const elementData: string = await (
                await element[0].getProperty("textContent")
              ).jsonValue();
              const value = Number(elementData.replace(/[^0-9\.]+/g, ""));
              value == data[i]
                ? logger.info(
                    `ui value ${value} is matching with database value ${data[i]} in ${elementName[i]}`
                  )
                : [
                    logger.error(
                      `ui value ${value} is not matching with database value ${data[i]} in ${elementName[i]}`
                    ),
                    errors.push(
                      `ui value ${value} is not matching with database value ${data[i]} in ${elementName[i]}`
                    ),
                  ];
            }
          })
          .catch(() => {
            logger.error("kpi report summary block not visible properly");
            errors.push("kpi report summary block not visible properly");
          });
      } else {
        const advisor = await page.$x(hs.advisor);
        await advisor[0].click();
        await page.waitForTimeout(5000);
        const linkTexts = await page.$$eval(hs.advisorSpan, (elements) =>
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
        const checkBox = await page.$x(hs.checkBox(Number(adv) + 1));
        await checkBox[0].click();
        await page.waitForTimeout(4000);
        const filterBtn = await page.$x(hs.filterBtn);
        await filterBtn[0].click();
        await page.waitForTimeout(10000);

        await page
          .waitForSelector(hs.kpiSummaryBlock, { visible: true, timeout: 4000 })
          .then(async () => {
            logger.info("kpi report summary block visible properly");

            await page.click(hs.toggleSelect);
            logger.info("toggle select clicked");
            await page.waitForTimeout(5000);

            const lastMonthSelect = await page.$x(hs.lastMonthToggle);
            await lastMonthSelect[0].click();
            logger.info("last month toggle selected");
            await page.waitForTimeout(5000);

            for (let i = 0; i < ids.length; i++) {
              const element = await page.$x(ids[i]);
              const elementData: string = await (
                await element[0].getProperty("textContent")
              ).jsonValue();
              const value = Number(elementData.replace(/[^0-9\.]+/g, ""));
              value == data[i]
                ? logger.info(
                    `ui value ${value} is matching with database value ${data[i]} in ${elementName[i]}`
                  )
                : [
                    logger.error(
                      `ui value ${value} is not matching with database value ${data[i]} in ${elementName[i]}`
                    ),
                    errors.push(
                      `ui value ${value} is not matching with database value ${data[i]} in ${elementName[i]}`
                    ),
                  ];
            }
          })
          .catch(() => {
            logger.error("kpi report summary block not visible properly");
            errors.push("kpi report summary block not visible properly");
          });
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
fixedOpsHomeKpiReportDataValidationTest();
