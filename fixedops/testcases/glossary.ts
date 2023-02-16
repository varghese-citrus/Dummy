import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { GlossarySelectors as gs } from "../selectors/glossary.ts";
import { fixedopsCommonLogin } from "./common/fixedops-common-login.ts";
import { startLogger } from "../utilities/utils.ts";

const errors: string[] = [];
const logger = startLogger();

function fixedOpsglossaryTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[AEC-FOCP-UI-FN-LD-0066] ${site.name} FixedOps Glossary Page Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-UI-FN-LD-0066",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await glossaryTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in  FixedOps Glossary Page Test";
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

async function glossaryTest(baseURL: string) {
  let browser = null;

  try {
    const oBrowser = await fixedopsCommonLogin(baseURL);
    const page = oBrowser.page;
    browser = oBrowser.browser;
    const navigationPromise = oBrowser.navigationPromise;
    await navigationPromise;
    await page.waitForTimeout(12000);
    await page.waitForSelector(gs.Reference_setups);
    await page.click(gs.Reference_setups);
    logger.info("Reference/setup Menu clicked");
    await page.waitForTimeout(5000);

    await page.waitForSelector(gs.Glossary);
    await page.click(gs.Glossary);
    logger.info("Glossary Menu clicked");
    await navigationPromise;
    await page.waitForTimeout(12000);
    const actual_title = await page.title();

    if (actual_title == "Glossary") {
      logger.info("Glossary page is visible!!!");

      await page
        .waitForXPath(gs.heading_text, {
          visible: true,
          timeout: 4000,
        })
        .then(async () => {
          logger.info("heading visible properly");
          const headingTxtXpath = await page.$x(gs.heading_text);
          const headingTextDisplayed: string = await (
            await headingTxtXpath[0].getProperty("textContent")
          ).jsonValue();

          headingTextDisplayed == "Glossary"
            ? logger.info("glossary heading text  is visible")
            : [
                logger.error("glossary heading text  is visible"),
                errors.push("glossary heading text  is  not visible"),
              ];
        })
        .catch(() => {
          logger.error("heading not visible properly");
          errors.push("heading not visible properly");
        });
      await page.waitForTimeout(5000);

      await page
        .$eval(gs.Glossary_table, (elem) => {
          return elem.style.display !== "none";
        })
        .then(() => {
          logger.info("glossary data table present");
        })
        .catch(() => {
          logger.error("glossary data table is not available");
          errors.push("glossary data table is not available");
        });

      await page
        .waitForSelector(gs.None_sorted, {
          visible: true,
          timeout: 4000,
        })
        .then(async () => {
          logger.info("none sorted element available");
          await page.click(gs.None_sorted);
          await page.waitForTimeout(4000);

          await page
            .$$eval(gs.None_sorted, (icons) =>
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
        .waitForSelector(gs.ascending_icon, {
          visible: true,
          timeout: 4000,
        })
        .then(async () => {
          logger.info("ascending icon available");
          await page.click(gs.ascending_icon);
          await page.waitForTimeout(4000);

          await page
            .$$eval(gs.ascending_icon, (icons) =>
              icons
                .map((icon) => icon.getAttribute("class"))
                .includes(
                  "ag-header-icon ag-header-label-icon ag-sort-ascending-icon"
                )
            )
            .then(() => {
              logger.info("sorted in ascending order verify success");
            })
            .catch(() => {
              logger.error("sorted in ascending order verify failed");
              errors.push("sorted in ascending order verify failed");
            });
        })
        .catch(() => {
          logger.error("ascending icon not available");
        });

      await page
        .waitForSelector(gs.descending_icon, {
          visible: true,
          timeout: 4000,
        })
        .then(async () => {
          logger.info("descending icon available");
          await page.click(gs.descending_icon);
          await page.waitForTimeout(4000);

          await page
            .$$eval(gs.descending_icon, (icons) =>
              icons
                .map((icon) => icon.getAttribute("class"))
                .includes(
                  "ag-header-icon ag-header-label-icon ag-sort-descending-icon"
                )
            )
            .then(() => {
              logger.info("sorted in descending order verify success");
            })
            .catch(() => {
              logger.error("sorted in descending order verify failed");
              errors.push("sorted in descending order verify failed");
            });
        })
        .catch(() => {
          logger.error("descending icon not available");
        });
    } else {
      logger.error("Glossary page is not available!!!");
      errors.push("Glossary page is not available");
    }
    ts.assert(
      errors.length == 0,
      `Error in Glossary Page:${errors.join("\n")}`
    );
  } catch (error) {
    logger.error(error);
    errors.push(error);
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsglossaryTest();
