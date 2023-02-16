import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { MakesSelectors as ms } from "../selectors/makes.ts";
import { fixedopsCommonLogin } from "./common/fixedops-common-login.ts";
import { startLogger } from "../utilities/utils.ts";

const errors: string[] = [];
const logger = startLogger();

function fixedOpsmakesTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[AEC-FOCP-UI-FN-LD-0140] ${site.name} FixedOps Makes Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-UI-FN-LD-0140",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await MakesTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Makes Test";
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

async function MakesTest(baseURL: string) {
  let browser = null;

  try {
    const oBrowser = await fixedopsCommonLogin(baseURL);
    const page = oBrowser.page;
    browser = oBrowser.browser;
    const navigationPromise = oBrowser.navigationPromise;
    await navigationPromise;
    await page.waitForTimeout(8000);
    await page.waitForSelector(ms.Reference_setups);
    await page.click(ms.Reference_setups);
    logger.info("Reference/setup Menu clicked");
    await page.waitForTimeout(5000);
    await page.waitForSelector(ms.Makes);
    await page.click(ms.Makes);
    logger.info("Makes Menu clicked");
    await navigationPromise;
    await page.waitForTimeout(12000);
    const actual_title = await page.title();
    logger.info(actual_title);
    if (actual_title == "Makes") {
      logger.info("Makes page is visible!!!");
      const tab1_text = await page.$x(ms.heading_tab1);
      const Heading_tab1_displayed: string = await (
        await tab1_text[0].getProperty("textContent")
      ).jsonValue();
      logger.info("Heading text: " + Heading_tab1_displayed);
      Heading_tab1_displayed == "Included Makes"
        ? logger.info("Included Makes-heading text  is visible!!!")
        : [
            logger.error("Included Makes-heading text  is  not visible!!!"),
            errors.push("Included Makes-heading text  is  not visible!!!"),
          ];
      const tab2_text = await page.$x(ms.heading_tab2);
      const Heading_tab2_displayed: string = await (
        await tab2_text[0].getProperty("textContent")
      ).jsonValue();
      logger.info("Heading text: " + Heading_tab2_displayed);
      Heading_tab2_displayed == "Excluded Makes"
        ? logger.info("Excluded Makes-heading text  is visible!!!")
        : [
            logger.error("Excluded Makes-heading text  is  not visible!!!"),
            errors.push("Excluded Makes-heading text  is  not visible!!!"),
          ];
      await page
        .$eval(ms.Included_Makes_table, (elem) => {
          return elem.style.display !== "none";
        })
        .then(() => {
          logger.info("Included_Makes_data_table present");
        })
        .catch(() => {
          logger.error("Included_Makes_data_table is not available!!!");
          errors.push("Included_Makes_data_table is not available!!!");
        });
      await page.click(ms.Excluded_Makes_Button);
      logger.info("Excluded_Makes_Button clicked");
      await page.waitForTimeout(5000);
      await page
        .waitForSelector(ms.Excluded_Makes_table, {
          visible: true,
          timeout: 4000,
        })
        .then(() => {
          logger.info("Excluded_Makes_data_table present");
        })
        .catch(() => {
          logger.error("Excluded_Makes_data_table is not available!!!");
          errors.push("Excluded_Makes_data_table is not available!!!");
        });
      await page
        .waitForSelector(ms.None_sorted, {
          visible: true,
          timeout: 4000,
        })
        .then(async () => {
          await page.click(ms.None_sorted);
          await page.waitForTimeout(4000);
          await page
            .$$eval(ms.None_sorted, (icons) =>
              icons
                .map((icon) => icon.getAttribute("class"))
                .includes(
                  "ag-header-icon ag-header-label-icon ag-sort-none-icon"
                )
            )
            .then(() => {
              logger.info("none sorted order verify success");
            })
            .catch(() => {
              logger.error("none sorted order verify failed");
              errors.push("none sorted order verify failed");
            });
        })
        .catch(() => {
          logger.error("none sorted element not available");
          errors.push("none sorted element not available");
        });

      await page
        .waitForSelector(ms.ascending_icon, {
          visible: true,
          timeout: 4000,
        })
        .then(async () => {
          await page.click(ms.ascending_icon);
          await page.waitForTimeout(4000);
          await page
            .$$eval(ms.ascending_icon, (icons) =>
              icons
                .map((icon) => icon.getAttribute("class"))
                .includes(
                  "ag-header-icon ag-header-label-icon ag-sort-ascending-icon"
                )
            )
            .then(() => {
              logger.info("ascending  order verify success");
            })
            .catch(() => {
              logger.error("ascending  order verify failed");
              errors.push("ascending  order verify failed");
            });
        })
        .catch(() => {
          logger.error("ascending icon not available");
          errors.push("ascending icon not available");
        });
      await page
        .waitForSelector(ms.descending_icon, {
          visible: true,
          timeout: 4000,
        })
        .then(async () => {
          await page.click(ms.descending_icon);
          await page.waitForTimeout(4000);
          await page
            .$$eval(ms.descending_icon, (icons) =>
              icons
                .map((icon) => icon.getAttribute("class"))
                .includes(
                  "ag-header-icon ag-header-label-icon ag-sort-descending-icon"
                )
            )
            .then(() => {
              logger.info("descending order verify success");
            })
            .catch(() => {
              logger.error("descending order verify failed");
              errors.push("descending order verify failed");
            });
        })
        .catch(() => {
          logger.error("descending icon not available");
          errors.push("descending icon not available");
        });
      await page.waitForSelector(ms.Reset_Layout);
      await page.click(ms.Reset_Layout);
      logger.info("Reset_Layout clicked !!!");
      await page.waitForTimeout(4000);
      await page.waitForSelector(ms.Export_To_Excel);
      await page.click(ms.Export_To_Excel);
      logger.info("Export_To_Excel clicked !!!");

      await page.setViewport({ width: 1850, height: 397 });
      await page.waitForSelector(
        ".MuiGrid-root > .MuiButtonBase-root > .MuiButton-label > .MuiGrid-root > span"
      );
      await page.click(
        ".MuiGrid-root > .MuiButtonBase-root > .MuiButton-label > .MuiGrid-root > span"
      );
      logger.info("user_Icon clicked !!!");
      await page.waitForTimeout(3000);
      const user_role = await page.$x(ms.role);
      const User_role_displayed: string = await (
        await user_role[0].getProperty("textContent")
      ).jsonValue();
      logger.info(" " + User_role_displayed);
    } else {
      logger.error("Makes page is not available!!!");
      errors.push("Makes page is not available!!!");
    }
    ts.assert(errors.length == 0, `Error in Makes Page:${errors.join("\n")}`);
  } catch (error) {
    logger.error(error);
    errors.push(error);
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsmakesTest();
