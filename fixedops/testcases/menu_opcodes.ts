import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { MenuopcodesSelectors as mes } from "../selectors/menu_opcodes.ts";
import { fixedopsCommonLogin } from "./common/fixedops-common-login.ts";
import { startLogger } from "../utilities/utils.ts";

const errors: string[] = [];
const logger = startLogger();

function fixedOpsmenuopcodesTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[AEC-FOCP-UI-FN-LD-0141] ${site.name} Menu Op Codes Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-UI-FN-LD-0141",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await menu_op_codes_Test(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in Menu Op Codes Test";
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

async function menu_op_codes_Test(baseURL: string) {
  let browser = null;

  try {
    const oBrowser = await fixedopsCommonLogin(baseURL);
    const page = oBrowser.page;
    browser = oBrowser.browser;
    const navigationPromise = oBrowser.navigationPromise;
    await navigationPromise;
    await page.waitForTimeout(8000);
    await page.waitForSelector(mes.Reference_setups);
    await page.click(mes.Reference_setups);
    logger.info("Reference/setup Menu clicked");
    await page.waitForTimeout(5000);
    await page.waitForSelector(mes.menu_op_codes);
    await page.click(mes.menu_op_codes);
    logger.info("Menu Op codes Menu clicked");
    await navigationPromise;
    await page.waitForTimeout(12000);
    const actual_title = await page.title();
    logger.info(actual_title);

    if (actual_title == "MenuOpcodes") {
      logger.info("Menu Op codes page is visible!!!");
      const H_text = await page.$x(mes.heading_text);
      const Heading_text_displayed: string = await (
        await H_text[0].getProperty("textContent")
      ).jsonValue();
      logger.info("Heading text: " + Heading_text_displayed);
      Heading_text_displayed == "Opcodes - Menu"
        ? logger.info("Menu Op Codes-heading text  is visible!!!")
        : [
            logger.error("Menu Op Codes-heading text  is  not visible!!!"),
            errors.push("Menu Op Codes-heading text  is  not visible!!!"),
          ];
      await page
        .$eval(mes.Menu_Op_codes_table, (elem) => {
          return elem.style.display !== "none";
        })
        .then(() => {
          logger.info("Menu_Op_codes_table present");
        })
        .catch(() => {
          logger.error("Menu_Op_codes_table is not available");
          errors.push("Menu_Op_codes_table is not available");
        });

      await page
        .waitForSelector(mes.None_sorted, {
          visible: true,
          timeout: 4000,
        })
        .then(async () => {
          await page.click(mes.None_sorted);
          await page.waitForTimeout(4000);
          await page
            .$$eval(mes.None_sorted, (icons) =>
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
        .waitForSelector(mes.ascending_icon, {
          visible: true,
          timeout: 4000,
        })
        .then(async () => {
          await page.click(mes.ascending_icon);
          await page.waitForTimeout(4000);
          await page
            .$$eval(mes.ascending_icon, (icons) =>
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
        .waitForSelector(mes.descending_icon, {
          visible: true,
          timeout: 4000,
        })
        .then(async () => {
          await page.click(mes.descending_icon);
          await page.waitForTimeout(4000);
          await page
            .$$eval(mes.descending_icon, (icons) =>
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
    } else {
      logger.error("Menu Op codes page is not available!!!");
      errors.push("Menu Op codes page is not available!!!");
    }
    ts.assert(
      errors.length == 0,
      `Errors in Menu op codes Page:${errors.join("\n")}`
    );
  } catch (error) {
    logger.error(error);
    errors.push(error);
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsmenuopcodesTest();
