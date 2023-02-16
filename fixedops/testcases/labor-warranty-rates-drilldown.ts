import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { laborwtyratesSelectors as lwrs } from "../selectors/labor_wtyrates.ts";
import { fixedopsCommonLogin } from "./common/fixedops-common-login.ts";
import { LaborWorkMiss as lw } from "../selectors/labor-work-mix.ts";
import { getRandomNumberBetween, startLogger } from "../utilities/utils.ts";

const errors: string[] = [];
const logger = startLogger();

function fixedOpslaborWtyRatesTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[AEC-FOCP-UI-FN-LD-0111] ${site.name} Labor Warranty Rates Drill Down Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-UI-FN-LD-0111",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await laborWtyRatesDrillDownTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in Labor Warranty Rates Drill Down Test";
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

async function laborWtyRatesDrillDownTest(baseURL: string) {
  let browser = null;

  try {
    const oBrowser = await fixedopsCommonLogin(baseURL);
    const page = oBrowser.page;
    browser = oBrowser.browser;
    const navigationPromise = oBrowser.navigationPromise;
    await navigationPromise;
    await page.waitForTimeout(4000);
    const toggleBtn = [
      lw.tglBtn_1,
      lw.tglBtn_2,
      lw.tglBtn_3,
      lw.tglBtn_4,
      lw.tglBtn_5,
    ];
    const role = Deno.env.get("ROLE");
    if (role == "admin") {
      await page.waitForTimeout(3000);
      await page.waitForSelector(lwrs.Armatus_admin);
      await page.click(lwrs.Armatus_admin);
      logger.info("armatus admin clicked");
      await page.waitForTimeout(5000);
      await page.waitForSelector(lwrs.Labor_wtyrates);
      await page.click(lwrs.Labor_wtyrates);
      logger.info("labor wty rates menu clicked");
      await navigationPromise;
      await page.waitForTimeout(15000);
      const title = await page.title();

      if (title == "Warranty Rates Labor") {
        logger.info("Warranty Rates Labor title verify success");

        const applyBtn = await page.$x(lwrs.applyBtn);
        await applyBtn[0].click();
        await page.waitForTimeout(20000);
        logger.info("apply button clicked");

        const dataTable = await page.$eval(lwrs.dataTab, (elem) => {
          return elem.style.display !== "none";
        });
        await page.waitForTimeout(2000);
        if (dataTable) {
          logger.info("data table display properly");
          await page.waitForTimeout(2000);

          await page.mouse.click(286, 360, { button: "left" });
          await navigationPromise;
          await page.waitForTimeout(15000);

          let pageTitle = await page.title();
          await page.waitForTimeout(5000);
          if (pageTitle == "Search by Ro") {
            logger.info("Search by Ro title verify success");

            await page
              .$eval(lw.repairOrderTable, (elem) => {
                return elem.style.display !== "none";
              })
              .then(() => {
                logger.info("repair order table visible properly");
              })
              .catch(() => {
                logger.error("repair order table not visible properly");
                errors.push("repair order table not visible properly");
              });
            await page.waitForTimeout(5000);
            let i = 1;
            let tglNum!: number;
            do {
              try {
                tglNum = await getRandomNumberBetween(0, 4);
                await page.waitForTimeout(2000);
                const btn = await page.waitForXPath(toggleBtn[tglNum], {
                  visible: true,
                  timeout: 2000,
                });

                if (btn) {
                  break;
                }
              } catch (error) {
                const errors: string[] = [];
                errors.push(error);
                const e = errors.find((x) => x === error);
                if (e) {
                  i++;
                }
              }
            } while (i > 0);
            await page.waitForTimeout(2000);
            const tglBtn = await page.$x(toggleBtn[tglNum]);
            await tglBtn[0].click();
            await navigationPromise;
            await page.waitForTimeout(15000);
            pageTitle = await page.title();
            if (pageTitle == "Labor Work Mix") {
              logger.info("toggle button navigation success");
              await page.waitForTimeout(2000);
              logger.info("enters into opcode summery");
              await page.waitForTimeout(5000);
              await page
                .$eval(lw.dataTable, (elem) => {
                  return elem.style.display !== "none";
                })
                .then(() => {
                  logger.info(
                    "data table display properly under opcode summery tab"
                  );
                })
                .catch(() => {
                  logger.error(
                    "data table not display properly under opcode summery tab"
                  );
                  errors.push(
                    "data table not display properly under opcode summery tab"
                  );
                });
              await page.waitForTimeout(5000);
              await page.mouse.click(348, 365, { button: "left" });
              await navigationPromise;
              logger.info("row data clicked");
              await page.waitForTimeout(15000);
              const attr = await page.$eval(
                lw.opcodeDetailedViewTab,
                (element) => element.getAttribute("aria-selected")
              );
              if (attr.toString() == "true") {
                logger.info("enters into opcode detail view");
                await page.waitForTimeout(2000);

                await page
                  .$eval(lw.dataTable, (elem) => {
                    return elem.style.display !== "none";
                  })
                  .then(() => {
                    logger.info(
                      "data table display properly under opcode detail view tab"
                    );
                  })
                  .catch(() => {
                    logger.info(
                      "data table not display properly under opcode detail view tab"
                    );
                    errors.push(
                      "data table not display properly under opcode detail view tab"
                    );
                  });
                await page.waitForTimeout(4000);
                await page.mouse
                  .click(896, 360, { button: "left" })
                  .catch(() => {
                    logger.warn("there is no row data for drill down");
                  });
                await navigationPromise;
                logger.info("row data clicked");
                await page.waitForTimeout(15000);
                pageTitle = await page.title();
                await page.waitForTimeout(5000);
                pageTitle == "Search by Ro"
                  ? logger.info("labor warranty rates page drill down success")
                  : [
                      logger.error(
                        "labor warranty rates page drill down failed"
                      ),
                      errors.push(
                        "labor warranty rates page drill down failed"
                      ),
                    ];
              } else {
                logger.warn("there is no row data for drill down!");
              }
            } else {
              logger.error("toggle button navigation failed");
              errors.push("toggle button navigation failed");
            }
          } else {
            logger.warn("there is no row data for drill down!");
          }
        } else {
          logger.error("data table not display properly");
          errors.push("data table not display properly");
        }
      } else {
        logger.error("Warranty Rates Labor title verify failed");
        errors.push("Warranty Rates Labor title verify failed");
      }
    } else {
      logger.warn(
        "role is not admin,please provide admin as role for further testing"
      );
    }
    ts.assert(
      errors.length == 0,
      `Errors in labor Warranty Rates Page:${errors.join("\n")}`
    );
  } catch (error) {
    logger.error(error);
    errors.push(error);
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpslaborWtyRatesTest();
