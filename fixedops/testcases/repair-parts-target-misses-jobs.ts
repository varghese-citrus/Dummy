import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { RepairpartstargetmissesSelectors as rpts } from "../selectors/repair_parts_target_misses.ts";
import { fixedopsCommonLogin } from "./common/fixedops-common-login.ts";
import { startLogger } from "../utilities/utils.ts";

const errors: string[] = [];
const logger = startLogger();
function fixedOpsRepairPartsTargetMissesTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[AEC-FOCP-UI-FN-LD-0212] ${site.name} Repair Parts Target Misses Toggle Button Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-UI-FN-LD-0212",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await repairPartsTargetMissesToggleBtnTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in Repair Parts Target Misses Toggle Button Test";
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

async function repairPartsTargetMissesToggleBtnTest(baseURL: string) {
  let browser = null;

  try {
    const oBrowser = await fixedopsCommonLogin(baseURL);
    const page = oBrowser.page;
    browser = oBrowser.browser;
    const navigationPromise = oBrowser.navigationPromise;
    await page.waitForSelector(rpts.Parts);
    await page.click(rpts.Parts);
    logger.info("Parts Menu clicked");
    await page.waitForTimeout(5000);
    await page.waitForXPath(rpts.repair_parts_target_misses);
    const xpath = await page.$x(rpts.repair_parts_target_misses);
    await xpath[0].click();
    logger.info("Repair parts target misses Menu clicked");
    await navigationPromise;
    await page.waitForTimeout(15000);
    const actual_title = await page.title();
    if (actual_title == "Customer Pay Repair - Parts Target Misses") {
      logger.info("Repair parts target misses title verify success");
      await page.waitForTimeout(4000);
      const dataTable = await page.$eval(rpts.dataTable, (elem) => {
        return elem.style.display !== "none";
      });
      await page.waitForTimeout(2000);
      if (dataTable) {
        logger.info("data table displayed properly in parts target misses");
        await page.waitForTimeout(4000);
        await page
          .waitForXPath(rpts.noDataMsg, {
            visible: true,
            timeout: 4000,
          })
          .then(() => {
            logger.warn("there is no data in the table for testing");
          })
          .catch(async () => {
            await page.waitForSelector(rpts.nonCompliantButton);
            await page.click(rpts.nonCompliantButton);
            await page.setViewport({ width: 1920, height: 1080 });
            await page.waitForXPath(rpts.complainces);
            let compliances = await page.$x(rpts.complainces);
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

            await page
              .waitForSelector(rpts.allJobsButton, {
                visible: true,
                timeout: 4000,
              })
              .then(async () => {
                await page.click(rpts.allJobsButton);
                logger.info("all jobs button clicked");
                await page.waitForTimeout(10000);
                compliances = await page.$x(rpts.complainces);
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
                      "compliances status verification success after clicking toggle button"
                    )
                  : [
                      logger.error(
                        "compliances status verification failed after clicking toggle button"
                      ),
                      errors.push(
                        "compliances status verification failed after clicking toggle button"
                      ),
                    ];
              })
              .catch(() => {
                logger.warn("toggle button not present");
              });
          });
      } else {
        logger.error("data table not displayed properly");
        errors.push("data table not displayed properly");
      }
    } else {
      logger.error("Repair parts target misses title verify failed");
      errors.push("Repair parts target misses title verify failed");
    }
    ts.assert(
      errors.length == 0,
      `Error in Repair parts target misses Page:${errors.join("\n")}`
    );
  } catch (error) {
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsRepairPartsTargetMissesTest();
