import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { fixedopsCommonLogin } from "./common/fixedops-common-login.ts";
import { laborwtymodelselector as lwm } from "../selectors/laborwtymodel.ts";
import { startLogger } from "../utilities/utils.ts";

const errors: string[] = [];
const logger = startLogger();

function fixedOpsLaborwtymodelTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[AEC-FOCP-UI-FN-LD-0137] ${site.name} Labor wty Model Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-UI-FN-LD-0137",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await LaborwtymodelTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Labor wty Model Test";
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

async function LaborwtymodelTest(baseURL: string) {
  let browser = null;

  try {
    const oBrowser = await fixedopsCommonLogin(baseURL);
    const page = oBrowser.page;
    browser = oBrowser.browser;
    const navigationPromise = oBrowser.navigationPromise;
    await navigationPromise;
    await page.waitForTimeout(10000);
    const role = Deno.env.get("ROLE");
    if (role == "admin") {
      await page.waitForTimeout(4000);
      const armatusadmin = await page.waitForSelector(lwm.aadropdown, {
        visible: true,
        timeout: 4000,
      });
      if (armatusadmin != null) {
        logger.info("Armatus Admin menu is visible");
        await page.waitForSelector(lwm.aadropdown);
        await page.click(lwm.aadropdown);
        logger.info("Expanded Armatus Menu");
        await page.waitForTimeout(4000);
        const labwm = await page.waitForSelector(lwm.labourmodel, {
          visible: true,
          timeout: 4000,
        });
        if (labwm != null) {
          logger.info("Labor wty model Menu is visible");
          await page.waitForSelector(lwm.labourmodel);
          await page.click(lwm.labourmodel);
          logger.info("Clicked Labor wty model Menu");
          await navigationPromise;
          await page.waitForTimeout(12000);
          const labwmtitle = await page.title();
          if (labwmtitle == "Warranty Reference Labor") {
            logger.info(`${labwmtitle} page title verify success!!!`);
            const labwmhead = await page.$x(lwm.laborhead);
            const labwmheading: string = await (
              await labwmhead[0].getProperty("textContent")
            ).jsonValue();
            labwmheading == "Warranty Reference Labor"
              ? logger.info("Heading text is visible")
              : [
                  logger.error("Labor wty model Page Heading verify failed"),
                  errors.push("Labor wty model Page Heading verify failed"),
                ];
            await page
              .waitForXPath(lwm.lresetlayout, {
                visible: true,
                timeout: 4000,
              })
              .then(() => {
                logger.info("Reset Layout Button is visible");
              })
              .catch(() => {
                logger.error("Reset Layout Button is not visible");
                errors.push("Reset Layout Button is not visible");
              });

            await page
              .waitForXPath(lwm.ltable, {
                visible: true,
                timeout: 4000,
              })
              .then(() => {
                logger.info("Table is visible");
              })
              .catch(() => {
                logger.error("Table is not visible");
                errors.push("Table is not visible");
              });

            const eb = await page.waitForSelector(lwm.leditbutton, {
              visible: true,
              timeout: 4000,
            });
            if (eb != null) {
              logger.info("Edit button is visible");
              await page.click(lwm.leditbutton);
              await page.waitForTimeout(3000);
              await page.waitForSelector(lwm.lcancelbutton);
              await page
                .waitForSelector(lwm.lcancelbutton, {
                  visible: true,
                  timeout: 4000,
                })
                .then(() => {
                  logger.info("Cancel button is visible");
                })
                .catch(() => {
                  logger.error("Cancel button is not visible");
                  errors.push("Cancel button is not visible");
                });
              await page
                .waitForSelector(lwm.lsavebutton, {
                  visible: true,
                  timeout: 4000,
                })
                .then(() => {
                  logger.info("Save button is visible");
                })
                .catch(() => {
                  logger.error("Save button is not visible");
                  errors.push("Save button is not visible");
                });
            } else {
              logger.error("Table is not visible");
              errors.push("Table is not visible");
            }
          } else {
            logger.error("Labor wty model page title verify failed");
            errors.push("Labor wty model page title verify failed");
          }
        } else {
          logger.error("Labor wty Model menu is not visible");
          errors.push("Labor wty Model menu is not visible");
        }
      } else {
        logger.error("Armatus Admin menu is not visible");
        errors.push("Armatus Admin menu is not visible");
      }
    } else {
      logger.warn("Role is not administrator!!!");
    }
    ts.assert(
      errors.length == 0,
      `Error in Labor wty Model Page:${errors.join("\n")}`
    );
  } catch (error) {
    logger.error(error);
    errors.push(error);
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsLaborwtymodelTest();
