import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { ROcounttotalSelectors as rts } from "../selectors/ro_count_by_make_total.ts";
import { fixedopsCommonLogin } from "./common/fixedops-common-login.ts";
import { startLogger } from "../utilities/utils.ts";

const errors: string[] = [];
const logger = startLogger();

function fixedOpsROcounttotalTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[AEC-FOCP-UI-FN-LD-0213] ${site.name} FixedOps RO Count By Make Total Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-UI-FN-LD-0213",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await ROcounttotalTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps RO Count By Make Total Test";
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

async function ROcounttotalTest(baseURL: string) {
  let browser = null;

  try {
    const oBrowser = await fixedopsCommonLogin(baseURL);
    const page = oBrowser.page;
    browser = oBrowser.browser;
    const navigationPromise = oBrowser.navigationPromise;
    await page.waitForSelector(rts.Reference_setups);
    await page.click(rts.Reference_setups);
    logger.info("Reference/setup Menu clicked");
    await page.waitForTimeout(5000);
    await page.waitForSelector(rts.ro_total);
    await page.click(rts.ro_total);
    logger.info("RO Count by make total Menu clicked");
    await navigationPromise;
    await page.waitForTimeout(15000);
    const actual_title = await page.title();
    logger.info(actual_title);
    if (actual_title == "Shared Sequences By Make") {
      logger.info("Shared Sequences ByMake page is visible!!!");
      const H_text = await page.$x(rts.heading_text);
      const Heading_text_displayed: string = await (
        await H_text[0].getProperty("textContent")
      ).jsonValue();
      logger.info("Heading text: " + Heading_text_displayed);
      Heading_text_displayed == "Shared Sequences By Make Monthly"
        ? logger.info("Shared Sequences By Make-heading text  is visible!!!")
        : [
            logger.error(
              "Shared Sequences By Make-heading text  is  not visible!!!"
            ),
            errors.push(
              "Shared Sequences By Make-heading text  is  not visible!!!"
            ),
          ];
      const tab1_text = await page.$x(rts.heading_tab1);
      const Heading_tab1_displayed: string = await (
        await tab1_text[0].getProperty("textContent")
      ).jsonValue();
      logger.info("Heading text: " + Heading_tab1_displayed);
      Heading_tab1_displayed == "Monthly"
        ? logger.info("Overall-heading text  is visible!!!")
        : [
            logger.error("Overall-heading text  is  not visible!!!"),
            errors.push("Overall-heading text  is  not visible!!!"),
          ];
      const tab2_text = await page.$x(rts.heading_tab2);
      const Heading_tab2_displayed: string = await (
        await tab2_text[0].getProperty("textContent")
      ).jsonValue();
      logger.info("Heading text: " + Heading_tab2_displayed);
      Heading_tab2_displayed == "Overall"
        ? logger.info("Monthly-heading text  is visible!!!")
        : [
            logger.error("Monthly-heading text  is  not visible!!!"),
            errors.push("Monthly-heading text  is  not visible!!!"),
          ];
      await page.waitForSelector(rts.Overall_table);
      await page
        .$eval(rts.Overall_table, (elem) => {
          return elem.style.display !== "none";
        })
        .then(() => {
          logger.info("Overall_data_table present!!!");
        })
        .catch(() => {
          logger.error("Overall_data_table is not available!!!");
          errors.push("Overall_data_table is not available!!!");
        });
      await page.waitForSelector(rts.monthly_Button);
      await page.click(rts.monthly_Button);
      logger.info("monthly_Button clicked");
      await page.waitForTimeout(5000);
      await page.waitForSelector(rts.monthly_table);
      await page
        .$eval(rts.monthly_table, (elem) => {
          return elem.style.display !== "none";
        })
        .then(() => {
          logger.info("monthly_data_table present!!!");
        })
        .catch(() => {
          logger.error("monthly_data_table is not available!!!");
          errors.push("monthly_data_table is not available!!!");
        });
      await page.waitForSelector(rts.None_sorted);
      await page.click(rts.None_sorted);
      logger.info("None_sorted!!!");
      await page.$$eval(rts.None_sorted, (icons) =>
        icons
          .map((icon) => icon.getAttribute("class"))
          .includes("ag-header-icon ag-header-label-icon ag-sort-none-icon")
      );
      await page.waitForSelector(rts.ascending_icon);
      await page.click(rts.ascending_icon);
      logger.info("sorted in ascending_order!!!");
      await page.$$eval(rts.ascending_icon, (icons) =>
        icons
          .map((icon) => icon.getAttribute("class"))
          .includes(
            "ag-header-icon ag-header-label-icon ag-sort-ascending-icon"
          )
      );
      await page.waitForSelector(rts.descending_icon);
      await page.click(rts.descending_icon);
      logger.info("sorted in descending_order!!!");
      await page.$$eval(rts.descending_icon, (icons) =>
        icons
          .map((icon) => icon.getAttribute("class"))
          .includes(
            "ag-header-icon ag-header-label-icon ag-sort-descending-icon"
          )
      );
    } else {
      logger.error("Shared Sequences ByMake page is not available!!!");
      errors.push("Shared Sequences ByMake page is not available!!!");
    }
    ts.assert(
      errors.length == 0,
      `Errors in RO Count by make Total Page:${errors.join("\n")}`
    );
  } catch (error) {
    console.log(error);
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsROcounttotalTest();
