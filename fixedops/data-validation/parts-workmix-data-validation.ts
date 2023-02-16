import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { PartsWorkmixSelectors as pw } from "../selectors/parts-work-mix.ts";
import { fixedopsCommonLogin } from "../testcases/common/fixedops-common-login.ts";
import { startLogger, getData } from "../utilities/utils.ts";
import { getStore } from "./stores/first-team-stores.ts";

const logger = startLogger();
const errors: string[] = [];

const valData = await getData("WorkmixAdvisorCategory").then((e) => {
  return e;
});

function fixedOpsPartsWorkmixDataValidationTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[AEC-FOCP-UI-FN-LD-0188] ${site.name} FixedOps Parts Workmix Data Validation Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-UI-FN-LD-0188",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await partsWorkmixDataValidationTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Parts Workmix Data Validation Test";
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

async function partsWorkmixDataValidationTest(baseURL: string) {
  let browser = null;

  try {
    const oBrowser = await fixedopsCommonLogin(baseURL);
    const page = oBrowser.page;
    browser = oBrowser.browser;
    const navigationPromise = oBrowser.navigationPromise;
    await page.waitForSelector(pw.partsMenu);
    await page.click(pw.partsMenu);
    logger.info("Parts Menu clicked");
    await page.waitForTimeout(5000);
    const partsWorkmixdashboard = await page.$x(pw.partsWorkmixMenu);
    await partsWorkmixdashboard[0].click();
    logger.info("Parts Workmix dashboard clicked");
    await navigationPromise;
    await page.waitForTimeout(15000);
    const storeId = valData[0].storeid;
    const store = Deno.env.get("STORE");
    const storeDetail = getStore(storeId);

    const monthlyTables = [
      pw.sales,
      pw.cost,
      pw.grossProfit,
      pw.markUp,
      pw.jobCount,
      pw.workMix,
    ];
    const monthlyTableSpan = [
      pw.salesSpan,
      pw.costSpan,
      pw.grossProfitSpan,
      pw.markupSpan,
      pw.jobCountSpan,
      pw.workMixSpan,
    ];

    const title = await page.title();
    if (
      storeDetail[0].name.toString() == store?.toString() &&
      title == "Parts Work Mix"
    ) {
      logger.info("Parts Work Mix title and store verify success");
      await page.waitForTimeout(4000);
      if (valData[0].advisor == "(All)" || valData[0].advisor == "All") {
        for (let j = 0; j < 6; j++) {
          await page.click(monthlyTables[j]);
          await navigationPromise;
          await page.waitForTimeout(15000);
          const monthlyGrid = await page.$x(monthlyTableSpan[j]);
          const monthlyGridName: string = await (
            await monthlyGrid[0].getProperty("textContent")
          ).jsonValue();
          const monthlyTable = await page.$eval(pw.monthlyTable, (elem) => {
            return elem.style.display !== "none";
          });

          if (monthlyTable) {
            logger.info("enters into monthly table in labor workmix");
            await page.waitForTimeout(2000);
            const competetiveXpath = await page.$x(pw.competitivePreMonthData);
            const maintenanceXpath = await page.$x(pw.maintenancePreMonthData);
            const repairXpath = await page.$x(pw.repairPreMonthData);
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
                opData = valData[k].partssale;
                Number(uiValues[k].replace(/[^0-9\.]+/g, "")) == opData
                  ? logger.info(
                      `${monthlyGridName} ${
                        elName[k]
                      } data validation success by database value ${opData} is matching with ui displayed value ${Number(
                        uiValues[k].replace(/[^0-9\.]+/g, "")
                      )}`
                    )
                  : [
                      logger.error(
                        `${monthlyGridName} ${
                          elName[k]
                        } data validation failed by database value ${opData} is not matching with ui displayed value ${Number(
                          uiValues[k].replace(/[^0-9\.]+/g, "")
                        )}`
                      ),
                      errors.push(
                        `${monthlyGridName} ${
                          elName[k]
                        } data validation failed by database value ${opData} is not matching with ui displayed value ${Number(
                          uiValues[k].replace(/[^0-9\.]+/g, "")
                        )}`
                      ),
                    ];
              } else if (monthlyGridName == "Cost") {
                opData = valData[k].partscost;
                Number(uiValues[k].replace(/[^0-9\.]+/g, "")) == opData
                  ? logger.info(
                      `${monthlyGridName} ${
                        elName[k]
                      } data validation success by database value ${opData} is matching with ui displayed value ${Number(
                        uiValues[k].replace(/[^0-9\.]+/g, "")
                      )}`
                    )
                  : [
                      logger.error(
                        `${monthlyGridName} ${
                          elName[k]
                        } data validation failed by database value ${opData} is not matching with ui displayed value ${Number(
                          uiValues[k].replace(/[^0-9\.]+/g, "")
                        )}`
                      ),
                      errors.push(
                        `${monthlyGridName} ${
                          elName[k]
                        } data validation failed by database value ${opData} is not matching with ui displayed value ${Number(
                          uiValues[k].replace(/[^0-9\.]+/g, "")
                        )}`
                      ),
                    ];
              } else if (monthlyGridName == "Gross Profit %") {
                opData = valData[k].partsgppercent;
                Number(uiValues[k].replace(/[^0-9\.]+/g, "")) == opData
                  ? logger.info(
                      `${monthlyGridName} ${
                        elName[k]
                      } data validation success by database value ${opData} is matching with ui displayed value ${Number(
                        uiValues[k].replace(/[^0-9\.]+/g, "")
                      )}`
                    )
                  : [
                      logger.error(
                        `${monthlyGridName} ${
                          elName[k]
                        } data validation failed by database value ${opData} is not matching with ui displayed value ${Number(
                          uiValues[k].replace(/[^0-9\.]+/g, "")
                        )}`
                      ),
                      errors.push(
                        `${monthlyGridName} ${
                          elName[k]
                        } data validation failed by database value ${opData} is not matching with ui displayed value ${Number(
                          uiValues[k].replace(/[^0-9\.]+/g, "")
                        )}`
                      ),
                    ];
              } else if (monthlyGridName == "Markup") {
                opData = valData[k].partsmarkup;
                Number(uiValues[k].replace(/[^0-9\.]+/g, "")) == opData
                  ? logger.info(
                      `${monthlyGridName} ${
                        elName[k]
                      } data validation success by database value ${opData} is matching with ui displayed value ${Number(
                        uiValues[k].replace(/[^0-9\.]+/g, "")
                      )}`
                    )
                  : [
                      logger.error(
                        `${monthlyGridName} ${
                          elName[k]
                        } data validation failed by database value ${opData} is not matching with ui displayed value ${Number(
                          uiValues[k].replace(/[^0-9\.]+/g, "")
                        )}`
                      ),
                      errors.push(
                        `${monthlyGridName} ${
                          elName[k]
                        } data validation failed by database value ${opData} is not matching with ui displayed value ${Number(
                          uiValues[k].replace(/[^0-9\.]+/g, "")
                        )}`
                      ),
                    ];
              } else if (monthlyGridName == "Job Count ") {
                opData = valData[k].partsjobcount;
                Number(uiValues[k].replace(/[^0-9\.]+/g, "")) == opData
                  ? logger.info(
                      `${monthlyGridName} ${
                        elName[k]
                      } data validation success by database value ${opData} is matching with ui displayed value ${Number(
                        uiValues[k].replace(/[^0-9\.]+/g, "")
                      )}`
                    )
                  : [
                      logger.error(
                        `${monthlyGridName} ${
                          elName[k]
                        } data validation failed by database value ${opData} is not matching with ui displayed value ${Number(
                          uiValues[k].replace(/[^0-9\.]+/g, "")
                        )}`
                      ),
                      errors.push(
                        `${monthlyGridName} ${
                          elName[k]
                        } data validation failed by database value ${opData} is not matching with ui displayed value ${Number(
                          uiValues[k].replace(/[^0-9\.]+/g, "")
                        )}`
                      ),
                    ];
              } else if (monthlyGridName == "Work Mix % ") {
                opData = valData[k].partsworkmixpercent;
                Number(uiValues[k].replace(/[^0-9\.]+/g, "")) == opData
                  ? logger.info(
                      `${monthlyGridName} ${
                        elName[k]
                      } data validation success by database value ${opData} is matching with ui displayed value ${Number(
                        uiValues[k].replace(/[^0-9\.]+/g, "")
                      )}`
                    )
                  : [
                      logger.error(
                        `${monthlyGridName} ${
                          elName[k]
                        } data validation failed by database value ${opData} is not matching with ui displayed value ${Number(
                          uiValues[k].replace(/[^0-9\.]+/g, "")
                        )}`
                      ),
                      errors.push(
                        `${monthlyGridName} ${
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
            logger.error("monthly table not visible properly");
            errors.push("monthly table not visible properly");
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
      `Error in Parts Workmix Page: ${errors.join("\n")}`
    );
  } catch (error) {
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsPartsWorkmixDataValidationTest();
