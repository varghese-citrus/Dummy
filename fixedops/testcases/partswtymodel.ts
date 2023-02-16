import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { fixedopsCommonLogin } from "./common/fixedops-common-login.ts";
import { partswtymodelselectors as pwm } from "../selectors/partswtymodel.ts";
import { startLogger } from "../utilities/utils.ts";

const errors: string[] = [];
const logger = startLogger();

function fixedOpsPartswtymodelTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[AEC-FOCP-UI-FN-LD-0205] ${site.name} FixedOps Parts Warranty Model Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-UI-FN-LD-0205",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await PartswtymodelTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Parts Warranty Model Test";
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

async function PartswtymodelTest(baseURL: string) {
  let browser = null;

  try {
    const oBrowser = await fixedopsCommonLogin(baseURL);
    const page = oBrowser.page;
    browser = oBrowser.browser;
    const navigationPromise = oBrowser.navigationPromise;
    await navigationPromise;
    await page.waitForTimeout(4000);
    const role = Deno.env.get("ROLE");
    if (role == "admin") {
      await page.waitForTimeout(3000);
      const armatusadmin = await page.waitForSelector(pwm.aadropdown, {
        visible: true,
        timeout: 4000,
      });
      if (armatusadmin != null) {
        logger.info("Armatus Admin menu is visible");
        await page.waitForSelector(pwm.aadropdown);
        await page.click(pwm.aadropdown);
        logger.info("Expanded Armatus Menu");
        await page.waitForTimeout(3000);
        const labwm = await page.waitForSelector(pwm.partsmodel, {
          visible: true,
          timeout: 4000,
        });
        if (labwm != null) {
          logger.info("Labor wty model Menu is visible");
          await page.waitForSelector(pwm.partsmodel);
          await page.click(pwm.partsmodel);
          logger.info("Clicked Parts wty model Menu");
          await navigationPromise;
          await page.waitForTimeout(5000);
          const labwmtitle = await page.title();
          labwmtitle == "Warranty Reference Parts"
            ? logger.info(`${labwmtitle} page title verify success!!!`)
            : [
                logger.error("Labor wty model page title verify failed"),
                errors.push("Labor wty model page title verify failed"),
              ];

          const ptswmhead = await page.$x(pwm.partshead);
          const ptswmheading: string = await (
            await ptswmhead[0].getProperty("textContent")
          ).jsonValue();
          ptswmheading == "Warranty Reference Parts"
            ? logger.info("Heading text is " + ptswmheading)
            : [
                logger.error("Parts wty model Page Heading verify failed"),
                errors.push("Parts wty model Page Heading verify failed"),
              ];
          await page
            .waitForXPath(pwm.presetlayout, {
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
          const reset_layout = await page.$x(pwm.presetlayout);
          const resetlay = reset_layout[0];
          resetlay != null
            ? logger.info("Reset Layout Button is visible")
            : [
                logger.error("Reset Layout Button is not visible"),
                errors.push("Reset Layout Button is not visible"),
              ];
          await page
            .waitForXPath(pwm.ptable, { visible: true, timeout: 4000 })
            .then(() => {
              logger.info("Table is visible");
            })
            .catch(() => {
              logger.error("Table is not visible");
              errors.push("Table is not visible");
            });

          const eb = await page.waitForSelector(pwm.peditbutton, {
            visible: true,
            timeout: 4000,
          });
          if (eb != null) {
            logger.info("Edit button is visible");
            await page.click(pwm.peditbutton);
            await page.waitForTimeout(3000);
            await page.waitForSelector(pwm.pcancelbutton);
            await page
              .waitForSelector(pwm.pcancelbutton, {
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
              .waitForSelector(pwm.psavebutton, {
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
          logger.error("Parts wty Model menu is not visible");
          errors.push("Parts wty Model menu is not visible");
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
      `Error in Parts wty Model Page:${errors.join("\n")}`
    );
  } catch (error) {
    logger.error(error);
    errors.push(error);
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsPartswtymodelTest();
