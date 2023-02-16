import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { LaborWorkMiss as lw } from "../selectors/labor-work-mix.ts";
import { fixedopsCommonLogin } from "../testcases/common/fixedops-common-login.ts";
import { getStore } from "./stores/first-team-stores.ts";
import { startLogger, getData } from "../utilities/utils.ts";

const logger = startLogger();
const errors: string[] = [];

const valData = await getData("WorkmixAdvisorCategory").then((e) => {
  return e;
});
function fixedOpsLaborWorkmixDataValidationTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[AEC-FOCP-UI-FN-LD-0001] ${site.name} FixedOps Labor Workmix Data Validation Test`,
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
          await laborWorkmixDataValidationTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Labor Workmix Data Validation Test";
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

async function laborWorkmixDataValidationTest(baseURL: string) {
  let browser = null;
  try {
    const oBrowser = await fixedopsCommonLogin(baseURL);
    const page = oBrowser.page;
    browser = oBrowser.browser;
    const navigationPromise = oBrowser.navigationPromise;
    await page.waitForSelector(lw.labor);
    await page.click(lw.labor);
    logger.info("labor expand collapse link clicked");
    await page.waitForTimeout(4000);
    const laborWrkMix = await page.$x(lw.laborWorkMixLink);
    await laborWrkMix[0].click();
    await navigationPromise;
    await page.waitForTimeout(15000);
    const storeId = valData[0].storeid;
    const store = Deno.env.get("STORE");
    const storeDetail = getStore(storeId);
    logger.info("labor work mix link clicked");
    const title = await page.title();

    const monthlyTables = [
      lw.sales,
      lw.solidHours,
      lw.grossProfit,
      lw.elr,
      lw.jobCount,
      lw.workMix,
    ];
    const monthlyTableSpan = [
      lw.salesSpan,
      lw.solidHoursSpan,
      lw.grossProfitSpan,
      lw.elrSpan,
      lw.jobCountSpan,
      lw.workMixSpan,
    ];
    if (
      storeDetail[0].name.toString() == store?.toString() &&
      title == "Labor Work Mix"
    ) {
      logger.info("Labor Work Mix title verify success");
      if (valData[0].advisor == "(All)" || valData[0].advisor == "All") {
        for (let j = 0; j < 6; j++) {
          await page.click(monthlyTables[j]);
          await navigationPromise;
          await page.waitForTimeout(15000);
          const monthlyGrid = await page.$x(monthlyTableSpan[j]);
          const monthlyGridName: string = await (
            await monthlyGrid[0].getProperty("textContent")
          ).jsonValue();
          const monthlyTable = await page.$eval(lw.monthlyTable, (elem) => {
            return elem.style.display !== "none";
          });
          if (monthlyTable) {
            logger.info("enters into monthly table in labor workmix");
            await page.waitForTimeout(2000);
            const competetiveXpath = await page.$x(lw.competitivePreMonthData);
            const maintenanceXpath = await page.$x(lw.maintenancePreMonthData);
            const repairXpath = await page.$x(lw.repairPreMonthData);
            const competetive: string = await (
              await competetiveXpath[0].getProperty("textContent")
            ).jsonValue();
            const maintenance: string = await (
              await maintenanceXpath[0].getProperty("textContent")
            ).jsonValue();
            const repair: string = await (
              await repairXpath[0].getProperty("textContent")
            ).jsonValue();
            const uiValues = [
              competetive.replace(/[^0-9\.]+/g, ""),
              maintenance.replace(/[^0-9\.]+/g, ""),
              repair.replace(/[^0-9\.]+/g, ""),
            ];
            let opData;
            const elName = ["competetive", "maintenance", "repair"];
            for (let k = 0; k < uiValues.length; k++) {
              if (monthlyGridName == "Sales") {
                opData = valData[k].laborsale;
                Number(uiValues[k].replace(/[^0-9\.]+/g, "")) == opData
                  ? logger.info(
                      `sales ${
                        elName[k]
                      } data validation success by database value ${opData} is matching with ui displayed value ${Number(
                        uiValues[k].replace(/[^0-9\.]+/g, "")
                      )}`
                    )
                  : [
                      logger.error(
                        `sales ${
                          elName[k]
                        } data validation failed by database value ${opData} is not matching with ui displayed value ${Number(
                          uiValues[k].replace(/[^0-9\.]+/g, "")
                        )}`
                      ),
                      errors.push(
                        `sales ${
                          elName[k]
                        } data validation failed by database value ${opData} is not matching with ui displayed value ${Number(
                          uiValues[k].replace(/[^0-9\.]+/g, "")
                        )}`
                      ),
                    ];
              } else if (monthlyGridName == "Sold Hours") {
                opData = valData[k].laborsoldhours;
                Number(uiValues[k].replace(/[^0-9\.]+/g, "")) == opData
                  ? logger.info(
                      `sold hours ${
                        elName[k]
                      } data validation success by database value ${opData} is matching with ui displayed value ${Number(
                        uiValues[k].replace(/[^0-9\.]+/g, "")
                      )}`
                    )
                  : [
                      logger.error(
                        `sold hours ${
                          elName[k]
                        } data validation failed by database value ${opData} is not matching with ui displayed value ${Number(
                          uiValues[k].replace(/[^0-9\.]+/g, "")
                        )}`
                      ),
                      errors.push(
                        `sold hours ${
                          elName[k]
                        } data validation failed by database value ${opData} is not matching with ui displayed value ${Number(
                          uiValues[k].replace(/[^0-9\.]+/g, "")
                        )}`
                      ),
                    ];
              } else if (monthlyGridName == "Gross Profit %") {
                opData = valData[k].laborgppercentage;
                Number(uiValues[k].replace(/[^0-9\.]+/g, "")) == opData
                  ? logger.info(
                      `gross profit % ${
                        elName[k]
                      } data validation success by database value ${opData} is matching with ui displayed value ${Number(
                        uiValues[k].replace(/[^0-9\.]+/g, "")
                      )}`
                    )
                  : [
                      logger.error(
                        `gross profit %} ${
                          elName[k]
                        } data validation failed by database value ${opData} is not matching with ui displayed value ${Number(
                          uiValues[k].replace(/[^0-9\.]+/g, "")
                        )}`
                      ),
                      errors.push(
                        `gross profit % ${
                          elName[k]
                        } data validation failed by database value ${opData} is not matching with ui displayed value ${Number(
                          uiValues[k].replace(/[^0-9\.]+/g, "")
                        )}`
                      ),
                    ];
              } else if (monthlyGridName == "ELR") {
                opData = valData[k].elr;
                Number(uiValues[k].replace(/[^0-9\.]+/g, "")) == opData
                  ? logger.info(
                      `elr ${
                        elName[k]
                      } data validation success by database value ${opData} is matching with ui displayed value ${Number(
                        uiValues[k].replace(/[^0-9\.]+/g, "")
                      )}`
                    )
                  : [
                      logger.error(
                        `elr ${
                          elName[k]
                        } data validation failed by database value ${opData} is not matching with ui displayed value ${Number(
                          uiValues[k].replace(/[^0-9\.]+/g, "")
                        )}`
                      ),
                      errors.push(
                        `elr ${
                          elName[k]
                        } data validation failed by database value ${opData} is not matching with ui displayed value ${Number(
                          uiValues[k].replace(/[^0-9\.]+/g, "")
                        )}`
                      ),
                    ];
              } else if (monthlyGridName == "Job Count") {
                opData = valData[k].laborjobcount;
                Number(uiValues[k].replace(/[^0-9\.]+/g, "")) == opData
                  ? logger.info(
                      `job count ${
                        elName[k]
                      } data validation success by database value ${opData} is matching with ui displayed value ${Number(
                        uiValues[k].replace(/[^0-9\.]+/g, "")
                      )}`
                    )
                  : [
                      logger.error(
                        `job count ${
                          elName[k]
                        } data validation failed by database value ${opData} is not matching with ui displayed value ${Number(
                          uiValues[k].replace(/[^0-9\.]+/g, "")
                        )}`
                      ),
                      errors.push(
                        `job count ${
                          elName[k]
                        } data validation failed by database value ${opData} is not matching with ui displayed value ${Number(
                          uiValues[k].replace(/[^0-9\.]+/g, "")
                        )}`
                      ),
                    ];
              } else if (monthlyGridName == "Work Mix %") {
                opData = valData[k].laborworkmixpercentage;
                Number(uiValues[k].replace(/[^0-9\.]+/g, "")) == opData
                  ? logger.info(
                      `work mix % ${
                        elName[k]
                      } data validation success by database value ${opData} is matching with ui displayed value ${Number(
                        uiValues[k].replace(/[^0-9\.]+/g, "")
                      )}`
                    )
                  : [
                      logger.error(
                        `work mix % ${
                          elName[k]
                        } data validation failed by database value ${opData} is not matching with ui displayed value ${Number(
                          uiValues[k].replace(/[^0-9\.]+/g, "")
                        )}`
                      ),
                      errors.push(
                        `work mix % ${
                          elName[k]
                        } data validation failed by database value ${opData} is not matching with ui displayed value ${Number(
                          uiValues[k].replace(/[^0-9\.]+/g, "")
                        )}`
                      ),
                    ];
              } else {
                logger.error("monthly table verification failed");
                errors.push("monthly table verification failed");
              }
            }
          } else {
            logger.error("Monthly table is not visible properly");
            errors.push("Monthly table is not visible properly");
          }
        }
      } else {
        logger.warn("please select All Advisor for further validation");
      }
    } else {
      logger.error("store and title of the page verification failed");
      errors.push("store and title of the page verification failed");
    }
    ts.assert(
      errors.length == 0,
      `Error in  Labor Workmix Page: ${errors.join("\n")}`
    );
  } catch (error) {
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsLaborWorkmixDataValidationTest();
