import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { ServiceAdvisorSelectors as sas } from "../selectors/service_advsr.ts";
import { fixedopsCommonLogin } from "./common/fixedops-common-login.ts";
import { startLogger } from "../utilities/utils.ts";

const errors: string[] = [];
const logger = startLogger();
function fixedOpsserviceadvisorTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[AEC-FOCP-UI-FN-LD-0215] ${site.name} FixedOps Service Advisor Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-UI-FN-LD-0215",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await service_advisorTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Service Advisor Test";
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

async function service_advisorTest(baseURL: string) {
  let browser = null;

  try {
    const oBrowser = await fixedopsCommonLogin(baseURL);
    const page = oBrowser.page;
    browser = oBrowser.browser;
    const navigationPromise = oBrowser.navigationPromise;
    await page.waitForSelector(sas.Reference_setups);
    await page.click(sas.Reference_setups);
    logger.info("Reference/setup Menu clicked");
    await page.waitForTimeout(5000);
    await page.waitForSelector(sas.Service_Advisor);
    await page.click(sas.Service_Advisor);
    logger.info("Service Advisor Menu clicked");
    await navigationPromise;
    await page.waitForTimeout(15000);
    const actual_title = await page.title();
    if (actual_title == "Service Advisor Setup") {
      logger.info("Service_Advisor page is visible!!!");
      const H_text = await page.$x(sas.heading_text);
      const Heading_text_displayed: string = await (
        await H_text[0].getProperty("textContent")
      ).jsonValue();
      logger.info("Heading text: " + Heading_text_displayed);
      Heading_text_displayed == "Service Advisor Details"
        ? logger.info("Service Advisor Details-heading text  is visible!!!")
        : [
            logger.error("Service Advisor Details-heading text  is visible!!!"),
            errors.push(
              "Service Advisor Details-heading text  is  not visible!!!"
            ),
          ];
      await page.waitForSelector(sas.Service_Advisor_table);
      await page
        .$eval(sas.Service_Advisor_table, (elem) => {
          return elem.style.display !== "none";
        })
        .then(() => {
          logger.info("Service_Asvisor_data_table present!!!");
        })
        .catch(() => {
          logger.error("Service_Asvisor_data_table is not available!!!");
          errors.push("Service_Asvisor_data_table is not available!!!");
        });
      await page.waitForSelector(sas.None_sorted);
      await page.click(sas.None_sorted);
      logger.info("None_sorted!!!");
      await page.$$eval(sas.None_sorted, (icons) =>
        icons
          .map((icon) => icon.getAttribute("class"))
          .includes("ag-header-icon ag-header-label-icon ag-sort-none-icon")
      );
      await page.waitForSelector(sas.ascending_icon);
      await page.click(sas.ascending_icon);
      logger.info("sorted in ascending_order!!!");
      await page.$$eval(sas.ascending_icon, (icons) =>
        icons
          .map((icon) => icon.getAttribute("class"))
          .includes(
            "ag-header-icon ag-header-label-icon ag-sort-ascending-icon"
          )
      );
      await page.waitForSelector(sas.descending_icon);
      await page.click(sas.descending_icon);
      logger.info("sorted in descending_order!!!");
      await page.$$eval(sas.descending_icon, (icons) =>
        icons
          .map((icon) => icon.getAttribute("class"))
          .includes(
            "ag-header-icon ag-header-label-icon ag-sort-descending-icon"
          )
      );
      await page.waitForSelector(sas.Reset_Layout);
      await page.click(sas.Reset_Layout);
      logger.info("Reset_Layout clicked !!!");
      await page.setViewport({ width: 1850, height: 397 });
      await page.waitForSelector(
        ".MuiGrid-root > .MuiButtonBase-root > .MuiButton-label > .MuiGrid-root > span"
      );
      await page.click(
        ".MuiGrid-root > .MuiButtonBase-root > .MuiButton-label > .MuiGrid-root > span"
      );
      logger.info("user_Icon clicked !!!");
      await page.waitForTimeout(3000);
      const user_role = await page.$x(sas.role);
      const User_role_displayed: string = await (
        await user_role[0].getProperty("textContent")
      ).jsonValue();
      const trim = User_role_displayed.replace("Role : ", "").trim();
      if (trim == "Armatus Admin" || trim == "Store Admin") {
        await page.waitForSelector(sas.edit_button);
        const edit_button_enabled =
          (await page.$("edit_button[disabled]")) == null;
        if (edit_button_enabled) {
          logger.info("edit button is  enabled");
          await page.click(sas.edit_button);
          logger.info("edit_button clicked");
          await page.waitForTimeout(4000);
          await page.waitForSelector(sas.UpdateButton);
          await page.waitForSelector(sas.CancelButton);
          await page
            .$eval(sas.UpdateButton, (elem) => {
              return elem.style.display !== "none";
            })
            .then(() => {
              logger.info("save button is visible");
            })
            .catch(() => {
              logger.error("save button is not visible");
              errors.push("save button is not visible");
            });
          await page
            .$eval(sas.CancelButton, (elem) => {
              return elem.style.display !== "none";
            })
            .then(() => {
              logger.info("cancel button is visible");
            })
            .catch(() => {
              logger.error("cancel button is not visible");
              errors.push("cancel button is not visible");
            });
        } else {
          logger.error("edit button is not enabled");
          errors.push("edit button is not enabled");
        }
      } else {
        logger.warn("User role is not admin");
      }
    } else {
      logger.error("Service_Advisor page is not available!!!");
      errors.push("Service_Advisor page is not available!!!");
    }
    ts.assert(
      errors.length == 0,
      `Error in Glossary Page:${errors.join("\n")}`
    );
  } catch (error) {
    console.log(error);
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsserviceadvisorTest();
