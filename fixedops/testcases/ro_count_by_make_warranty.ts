import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { ROcountwarrantySelectors as rws } from "../selectors/ro_count_by_make_warranty.ts";
import { fixedopsCommonLogin } from "./common/fixedops-common-login.ts";
import { startLogger } from "../utilities/utils.ts";

const errors: string[] = [];
const logger = startLogger();

function fixedOpsROcountwarrantyTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[AEC-FOCP-UI-FN-LD-0214] ${site.name} FixedOps RO Count By Make Warranty Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-UI-FN-LD-0214",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await ROcountwarrantyTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps RO Count By Make Warranty Test";
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

async function ROcountwarrantyTest(baseURL: string) {
  let browser = null;

  try {
    const oBrowser = await fixedopsCommonLogin(baseURL);
    const page = oBrowser.page;
    browser = oBrowser.browser;
    const navigationPromise = oBrowser.navigationPromise;
    await page.waitForSelector(rws.Reference_setups);
    await page.click(rws.Reference_setups);
    logger.info("Reference/setup Menu clicked");
    await page.waitForTimeout(5000);
    await page.waitForSelector(rws.ro_warranty);
    await page.click(rws.ro_warranty);
    logger.info("RO Count by make warranty Menu clicked");
    await navigationPromise;
    await page.waitForTimeout(15000);
    const actual_title = await page.title();
    logger.info(actual_title);
    if (actual_title == "New Car Warranty") {
      logger.info("New Car Warranty page is visible!!!");
      const H_text = await page.$x(rws.heading_text);
      const Heading_text_displayed: string = await (
        await H_text[0].getProperty("textContent")
      ).jsonValue();
      logger.info("Heading text: " + Heading_text_displayed);
      Heading_text_displayed == "New Car Warranty - Monthly"
        ? logger.info("New Car Warranty-heading text  is visible!!!")
        : [
            logger.error("New Car Warranty-heading text  is  not visible!!!"),
            errors.push("New Car Warranty-heading text  is  not visible!!!"),
          ];
      const tab1_text = await page.$x(rws.heading_tab1);
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
      const tab2_text = await page.$x(rws.heading_tab2);
      const Heading_tab2_displayed: string = await (
        await tab2_text[0].getProperty("textContent")
      ).jsonValue();
      logger.info("Heading text: " + Heading_tab2_displayed);
      Heading_tab2_displayed == "Over Six Months"
        ? logger.info("Monthly-heading text  is visible!!!")
        : [
            logger.error("Monthly-heading text  is  not visible!!!"),
            errors.push("Monthly-heading text  is  not visible!!!"),
          ];

      const tab3_text = await page.$x(rws.heading_tab3);
      const Heading_tab3_displayed: string = await (
        await tab3_text[0].getProperty("textContent")
      ).jsonValue();
      logger.info("Heading text: " + Heading_tab3_displayed);
      Heading_tab3_displayed == "Overall"
        ? logger.info("Over Six Months-heading text  is visible!!!")
        : [
            logger.error("Over Six Months-heading text  is  not visible!!!"),
            errors.push("Over Six Months-heading text  is  not visible!!!"),
          ];
      await page.waitForSelector(rws.Overall_table);
      await page
        .$eval(rws.Overall_table, (elem) => {
          return elem.style.display !== "none";
        })
        .then(() => {
          logger.info("Overall_data_table present!!!");
        })
        .catch(() => {
          logger.error("Overall_data_table is not available!!!");
          errors.push("Overall_data_table is not available!!!");
        });
      await page.waitForSelector(rws.monthly_Button);
      await page.click(rws.monthly_Button);
      logger.info("monthly_Button clicked");
      await page.waitForTimeout(5000);
      await page.waitForSelector(rws.monthly_table);
      await page
        .$eval(rws.monthly_table, (elem) => {
          return elem.style.display !== "none";
        })
        .then(() => {
          logger.info("monthly_data_table present!!!");
        })
        .catch(() => {
          logger.error("monthly_data_table is not available!!!");
          errors.push("monthly_data_table is not available!!!");
        });
      await page.waitForSelector(rws.Over_sixmonths_Button);
      await page.click(rws.Over_sixmonths_Button);
      logger.info("Over_sixmonths_Button clicked");
      await page.waitForTimeout(5000);
      await page.waitForSelector(rws.Over_sixmonths_table);
      await page
        .$eval(rws.Over_sixmonths_table, (elem) => {
          return elem.style.display !== "none";
        })
        .then(() => {
          logger.info("Over_sixmonths_data_table present!!!");
        })
        .catch(() => {
          logger.error("Over_sixmonths_data_table is not available!!!");
          errors.push("Over_sixmonths_data_table is not available!!!");
        });
      await page.waitForSelector(rws.None_sorted);
      await page.click(rws.None_sorted);
      logger.info("None_sorted!!!");
      await page.$$eval(rws.None_sorted, (icons) =>
        icons
          .map((icon) => icon.getAttribute("class"))
          .includes("ag-header-icon ag-header-label-icon ag-sort-none-icon")
      );
      await page.waitForSelector(rws.ascending_icon);
      await page.click(rws.ascending_icon);
      logger.info("sorted in ascending_order!!!");
      await page.$$eval(rws.ascending_icon, (icons) =>
        icons
          .map((icon) => icon.getAttribute("class"))
          .includes(
            "ag-header-icon ag-header-label-icon ag-sort-ascending-icon"
          )
      );
      await page.waitForSelector(rws.descending_icon);
      await page.click(rws.descending_icon);
      logger.info("sorted in descending_order!!!");
      await page.$$eval(rws.descending_icon, (icons) =>
        icons
          .map((icon) => icon.getAttribute("class"))
          .includes(
            "ag-header-icon ag-header-label-icon ag-sort-descending-icon"
          )
      );
    } else {
      logger.error("New Car Warranty page is not available!!!");
      errors.push("New Car Warranty page is not available!!!");
    }
    ts.assert(
      errors.length == 0,
      `Errors in RO Count by make Warranty Page:${errors.join("\n")}`
    );
  } catch (error) {
    console.log(error);
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsROcountwarrantyTest();
