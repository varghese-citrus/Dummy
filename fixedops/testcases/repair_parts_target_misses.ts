import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { RepairpartstargetmissesSelectors as rpts } from "../selectors/repair_parts_target_misses.ts";
import { fixedopsCommonLogin } from "./common/fixedops-common-login.ts";
import { startLogger } from "../utilities/utils.ts";

const errors: string[] = [];
const logger = startLogger();
function fixedOpsrepairpartstargetmissesTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[AEC-FOCP-UI-FN-LD-0208] ${site.name} FixedOps Repair Parts Target Misses Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-UI-FN-LD-0208",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await repairpartstargetmissesTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Repair Parts Target Misses Test";
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

async function repairpartstargetmissesTest(baseURL: string) {
  let browser = null;

  try {
    const oBrowser = await fixedopsCommonLogin(baseURL);
    const page = oBrowser.page;
    browser = oBrowser.browser;
    const navigationPromise = oBrowser.navigationPromise;
    await navigationPromise;
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
    logger.info(actual_title);
    if (actual_title == "Customer Pay Repair - Parts Target Misses") {
      logger.info("Repair parts target misses page is visible!!!");
      const H_text = await page.$x(rpts.heading_text);
      const Heading_text_displayed: string = await (
        await H_text[0].getProperty("textContent")
      ).jsonValue();
      logger.info("Heading text: " + Heading_text_displayed);
      Heading_text_displayed == "Customer Pay Repair - Parts Target Misses"
        ? logger.info(
            "Customer Pay Repair - Parts Target Misses-heading text  is visible!!!"
          )
        : [
            logger.error(
              "Customer Pay Repair - Parts Target Misses-heading text  is visible!!!"
            ),
            errors.push(
              "Customer Pay Repair - Parts Target Misses-heading text  is  not visible!!!"
            ),
          ];
      await page.waitForSelector(rpts.Reset_Layout);
      await page.click(rpts.Reset_Layout);
      logger.info("Reset_Layout clicked !!!");
      await page.waitForTimeout(4000);

      await page
        .waitForSelector(rpts.as_of_data_display, {
          visible: true,
          timeout: 4000,
        })
        .then(() => {
          logger.info("data as of display properly");
        })
        .catch(() => {
          logger.error("data as of not display properly");
          errors.push("data as of not display properly");
        });
      await page.waitForTimeout(4000);
      for (let i = 1; i <= 7; i++) {
        const buttons = rpts.getButton(i);
        const data_buttons = await page.$x(buttons);
        const as_of_button_displayed: string = await (
          await data_buttons[0].getProperty("textContent")
        ).jsonValue();
        logger.info("" + as_of_button_displayed);
        await page.waitForTimeout(3000);
      }
      (await page.$$eval(rpts.defaultToggle, (txts) =>
        txts.map((txt) => txt.getAttribute("value")).includes("MTD")
      ))
        ? logger.info("default drop down value MTD  is visible")
        : [
            logger.error("default drop down value  MTD  is unavailable"),
            errors.push("default drop down value MTD  is unavailable"),
          ];
      await page.waitForSelector(rpts.toggleBtn);
      await page.click(rpts.toggleBtn);
      await page.waitForTimeout(5000);
      const tgli = await page.$x(rpts.toggleLi);
      for (let i = 1; i <= tgli.length; i++) {
        const id = rpts.getId(i);
        const el = await page.$x(id);
        await el[0].click();
        await navigationPromise;
        await page.waitForTimeout(8000);
        await page.waitForSelector(rpts.toggleBtn);
        await page.click(rpts.toggleBtn);
        await page.waitForTimeout(5000);
      }
      await page
        .waitForXPath(rpts.defaultCPmisses)
        .then(async () => {
          const misses = await page.$x(rpts.defaultCPmisses);
          const detaultMisses = await (
            await misses[0].getProperty("textContent")
          ).jsonValue();
          await page.waitForTimeout(2000);
          detaultMisses == "Customer"
            ? logger.info("default drop down value CP misses  is visible")
            : [
                logger.error(
                  "default drop down value  CP misses  is unavailable"
                ),
                errors.push(
                  "default drop down value CP misses  is unavailable"
                ),
              ];
        })
        .catch(() => {
          logger.warn("misses selection is not available");
        });
      await page
        .waitForSelector(rpts.select_Int)
        .then(async () => {
          await page.click(rpts.select_Int);
          await page.waitForTimeout(3000);
          await page.click(rpts.IntMisses);
        })
        .catch(() => {
          logger.warn("misses selection is not available");
        });
      await page.waitForTimeout(5000);
      await page
        .$eval(rpts.int_table, (elem) => {
          return elem.style.display !== "none";
        })
        .then(() => {
          logger.info("Int misses table  loaded properly");
        })
        .catch(() => {
          logger.error("Int misses table  is  not loaded properly");
          errors.push("Int misses table  is  not loaded properly");
        });
    } else {
      logger.error("Repair parts target misses page is not available!!!");
      errors.push("Repair parts target misses page is not available");
    }
    ts.assert(
      errors.length == 0,
      `Error in Repair parts target misses Page:${errors.join("\n")}`
    );
  } catch (error) {
    logger.error(error);
    errors.push(error);
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsrepairpartstargetmissesTest();
