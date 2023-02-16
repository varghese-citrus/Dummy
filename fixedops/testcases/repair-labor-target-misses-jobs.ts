import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { RepairlabortargetmissesSelectors as rlts } from "../selectors/repair_labor_target_misses.ts";
import { fixedopsCommonLogin } from "./common/fixedops-common-login.ts";
import { startLogger } from "../utilities/utils.ts";

const errors: string[] = [];
const logger = startLogger();

function fixedOpsRepairLaborTargetMisses() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[AEC-FOCP-UI-FN-LD-0210] ${site.name} Repair Labor Target Misses Toggle Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-UI-FN-LD-0210",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await repairLaborTargetMissesToggleTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in Repair Labor Target Misses Toggle Test";
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

async function repairLaborTargetMissesToggleTest(baseURL: string) {
  let browser = null;
  try {
    const oBrowser = await fixedopsCommonLogin(baseURL);
    const page = oBrowser.page;
    browser = oBrowser.browser;
    const navigationPromise = oBrowser.navigationPromise;
    await page.waitForSelector(rlts.Labor);
    await page.click(rlts.Labor);
    logger.info("Labour Menu clicked");
    await page.waitForTimeout(5000);
    await page.waitForXPath(rlts.repair_labor_target_misses);
    const xpath = await page.$x(rlts.repair_labor_target_misses);
    await xpath[0].click();
    logger.info("Repair labor target misses Menu clicked");
    await navigationPromise;
    await page.waitForTimeout(15000);
    const titleArr = [
      "Customer Pay Repair - Labor Target Misses",
      "Customer Pay Repair - Labor Target Misses - Light Duty",
      "Customer Pay Repair - Labor Target Misses - Standard",
    ];
    const actual_title = await page.title();
    const res = titleArr.filter((t) => {
      return t.includes(actual_title);
    });
    if (actual_title.includes(res[0])) {
      logger.info("Repair labor target misses page is visible");
      await page.waitForTimeout(5000);
      const dataTable = await page.$eval(rlts.dataTable, (elem) => {
        return elem.style.display !== "none";
      });
      await page.waitForTimeout(5000);
      if (dataTable) {
        logger.info("data table visible properly");
        await page
          .waitForXPath(rlts.noDataMsg, {
            visible: true,
            timeout: 4000,
          })
          .then(() => {
            logger.warn("there is no data in the table for testing");
          })
          .catch(async () => {
            await page.waitForSelector(rlts.nonCompliantButton);
            await page.click(rlts.nonCompliantButton);
            await page.setViewport({ width: 1920, height: 1080 });
            await page.waitForXPath(rlts.complainces);
            let compliances = await page.$x(rlts.complainces);
            let res = [];
            for (const i of compliances) {
              const status = await (
                await i.getProperty("textContent")
              ).jsonValue();
              res.push(status);
            }
            let st = res.includes("TRUE");
            st == false
              ? logger.info("default compliances status verification success")
              : [
                  logger.error(
                    "default compliances status verification failed"
                  ),
                  errors.push("default compliances status verification failed"),
                ];
            await page.waitForTimeout(5000);
            await page
              .waitForSelector(rlts.allJobsButton, {
                visible: true,
                timeout: 4000,
              })
              .then(async () => {
                await page.click(rlts.allJobsButton);
                logger.info("all jobs button clicked");
                await page.waitForTimeout(10000);
                compliances = await page.$x(rlts.complainces);
                res = [];
                for (const i of compliances) {
                  const status = await (
                    await i.getProperty("textContent")
                  ).jsonValue();
                  res.push(status);
                }
                st = res.includes("TRUE");
                const rt = res.includes("FALSE");
                st == true || rt == true
                  ? logger.info(
                      "compliances status verification success after clicking all jobs  button"
                    )
                  : [
                      logger.error(
                        "compliances status verification failed after clicking all jobs  button"
                      ),
                      errors.push(
                        "compliances status verification failed after clicking all jobs  button"
                      ),
                    ];
              })
              .catch((error) => {
                console.error(error);
                logger.warn("all jobs button not present");
              });
          });
      } else {
        logger.error("data table not visible properly");
        errors.push("data table not visible properly");
      }
    } else {
      logger.error("Repair labor target misses page is not visible");
      errors.push("Repair labor target misses page is not visible");
    }
    ts.assert(
      errors.length == 0,
      `Error in Repair labor target misses Page:${errors.join("\n")}`
    );
  } catch (error) {
    console.log(error);
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsRepairLaborTargetMisses();
