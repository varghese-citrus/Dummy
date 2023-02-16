import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { TechniciansSelectors as tes } from "../selectors/technicians.ts";
import { fixedopsCommonLogin } from "./common/fixedops-common-login.ts";
import { startLogger } from "../utilities/utils.ts";

const errors: string[] = [];
const logger = startLogger();
function fixedOpsTechniciansTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[AEC-FOCP-UI-FN-LD-0255] ${site.name} Technicians Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-UI-FN-LD-0255",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await TechniciansTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in Technicians Page Test";
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

async function TechniciansTest(baseURL: string) {
  let browser = null;

  try {
    const oBrowser = await fixedopsCommonLogin(baseURL);
    const page = oBrowser.page;
    browser = oBrowser.browser;
    const navigationPromise = oBrowser.navigationPromise;
    await navigationPromise;
    await page.waitForTimeout(4000);

    await page.waitForSelector(tes.Reference_setups);
    await page.click(tes.Reference_setups);
    logger.info("Reference/setup Menu clicked");
    await page.waitForTimeout(5000);
    await page.waitForSelector(tes.Technicians);
    await page.click(tes.Technicians);
    logger.info("Technicians Menu clicked");
    await navigationPromise;
    await page.waitForTimeout(15000);
    const actualTitle = await page.title();
    logger.info(actualTitle);

    if (actualTitle == "Technician Setup") {
      logger.info("Technicians page is visible!!!");

      const hText = await page.$x(tes.heading_text);
      const headingTextDisplayed: string = await (
        await hText[0].getProperty("textContent")
      ).jsonValue();
      logger.info("Heading text: " + headingTextDisplayed);

      headingTextDisplayed == "Technician Details"
        ? logger.info("Technician Details-heading text  is visible!!!")
        : [
            logger.error("Technician Details-heading text  is  not visible!!!"),
            errors.push("Technician Details-heading text  is  not visible!!!"),
          ];

      await page.waitForSelector(tes.Technician_table);

      await page
        .waitForSelector(tes.Technician_table, {
          visible: true,
          timeout: 4000,
        })
        .then(() => {
          logger.info("technicianDataTable present");
        })
        .catch(() => {
          logger.error("technicianDataTable is not available");
          errors.push("technicianDataTable is not available");
        });

      await page.waitForSelector(tes.None_sorted);
      await page.click(tes.None_sorted);
      logger.info("None_sorted!!!");
      await page.$$eval(tes.None_sorted, (icons) =>
        icons
          .map((icon) => icon.getAttribute("class"))
          .includes("ag-header-icon ag-header-label-icon ag-sort-none-icon")
      );
      await page.waitForSelector(tes.ascending_icon);
      await page.click(tes.ascending_icon);
      await page
        .$$eval(tes.ascending_icon, (icons) =>
          icons
            .map((icon) => icon.getAttribute("class"))
            .includes(
              "ag-header-icon ag-header-label-icon ag-sort-ascending-icon"
            )
        )
        .then(() => {
          logger.info("Sorting in ascending verified success");
        })
        .catch(() => {
          logger.error("Sorting in ascending verified failed");
          errors.push("Sorting in ascending verified failed");
        });
      await page.waitForSelector(tes.descending_icon);
      await page.click(tes.descending_icon);
      await page
        .$$eval(tes.descending_icon, (icons) =>
          icons
            .map((icon) => icon.getAttribute("class"))
            .includes(
              "ag-header-icon ag-header-label-icon ag-sort-descending-icon"
            )
        )
        .then(() => {
          logger.info("Sorting in descending verified success");
        })
        .catch(() => {
          logger.error("Sorting in descending verified failed");
          errors.push("Sorting in descending verified failed");
        });

      await page.waitForSelector(tes.Reset_Layout);
      await page.click(tes.Reset_Layout);
      logger.info("Reset Layout clicked");

      const role = Deno.env.get("ROLE");

      if (role?.includes("admin") || role?.includes("user")) {
        const editButtonEnabled =
          (await page.$("edit_button[disabled]")) == null;
        if (editButtonEnabled) {
          logger.info("edit button is  enabled");
          const editbtn = await page.$x(tes.edit_button);
          await editbtn[0].click();

          logger.info("edit button clicked");
          await page.waitForTimeout(5000);
          await page.screenshot({ path: "./example.png" });
          await page.waitForTimeout(5000);
          await page.waitForSelector(tes.UpdateButton);
          await page.waitForSelector(tes.CancelButton);
          const elementsArr = [tes.UpdateButton, tes.CancelButton];
          const elNames = ["Save button", "Cancel button"];
          for (let i = 0; i < elementsArr.length; i++) {
            await page
              .$eval(elementsArr[i], (elem) => {
                return elem.style.display !== "none";
              })
              .then(() => {
                logger.info(`${elNames} visible propelry`);
              })
              .catch(() => {
                logger.error(`${elNames} not visible propelry`);
                errors.push(`${elNames} not visible propelry`);
              });
          }
        } else {
          logger.error("edit button is not enabled");
          errors.push("edit button is not enabled");
        }
      } else {
        logger.warn("User role is not admin");
      }
    } else {
      logger.error("Technicians page is not available!!!");
      errors.push("Technicians page is not available!!!");
    }
    ts.assert(
      errors.length == 0,
      `Error in Technicians Page:${errors.join("\n")}`
    );
  } catch (error) {
    logger.error(error);
    errors.push(error);
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsTechniciansTest();
