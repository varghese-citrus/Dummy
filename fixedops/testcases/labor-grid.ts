import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { LaborGridSelectors as lg } from "../selectors/labor-grid.ts";
import { fixedopsCommonLogin } from "./common/fixedops-common-login.ts";
import { startLogger } from "../utilities/utils.ts";

const logger = startLogger();
const errors: string[] = [];

function fixedOpsLaborGridTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[AEC-FOCP-UI-FN-LD-0077] ${site.name} FixedOps Labor Grid Page Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-UI-FN-LD-0077",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await laborGridPageTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Labor Grid Page Test";
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

async function laborGridPageTest(baseURL: string) {
  let browser = null;

  try {
    const oBrowser = await fixedopsCommonLogin(baseURL);
    const page = oBrowser.page;
    browser = oBrowser.browser;
    const navigationPromise = oBrowser.navigationPromise;
    await navigationPromise;
    await page.waitForTimeout(10000);

    await page.waitForSelector(lg.referenceAndSetupLink);
    await page.click(lg.referenceAndSetupLink);
    logger.info("reference/setups expand collapse link clicked");
    await page.waitForTimeout(4000);

    await page.waitForSelector(lg.laborGridLink);
    await page.click(lg.laborGridLink);
    await navigationPromise;
    await page.waitForTimeout(10000);
    logger.info("labor grid link clicked");

    const title = await page.title();
    if (title == "Labor Grid(s)") {
      logger.info("labor grids title verify success");
      await page.waitForTimeout(2000);
      const heading = await page.$x(lg.laborGridHeading);
      const pageHeading = await (
        await heading[0].getProperty("textContent")
      ).jsonValue();
      await page.waitForTimeout(2000);
      if (pageHeading == "Labor Grid(s)") {
        logger.info("labor grids heading verify success");

        await page
          .waitForXPath(lg.gridInstallDate, {
            visible: true,
            timeout: 2000,
          })
          .then(() => {
            logger.info("grid install date field visible properly");
          })
          .catch(() => {
            logger.error("grid install date field not visible properly");
            errors.push("grid install date field not visible properly");
          });
        await page.waitForTimeout(2000);
        const fopcCalculatedDateFrom = await page.waitForXPath(
          lg.calculatedDateFrom,
          {
            visible: true,
            timeout: 2000,
          }
        );
        await page.waitForTimeout(2000);
        fopcCalculatedDateFrom != null
          ? logger.info("calculated date from field visible properly")
          : [
              logger.error("calculated date from field not visible properly"),
              errors.push("calculated date from field not visible properly"),
            ];

        const resetButton = await page.$eval(lg.resetBtn, (elem) => {
          return elem.style.display !== "none";
        });
        await page.waitForTimeout(2000);
        resetButton
          ? logger.info("reset button display properly")
          : [
              logger.error("reset button not display properly"),
              errors.push("reset button not display properly"),
            ];
        await page.waitForTimeout(2000);
        const gridSelect = await page.waitForXPath(lg.gridSelect, {
          visible: true,
          timeout: 2000,
        });
        await page.waitForTimeout(2000);
        if (gridSelect != null) {
          logger.info("grid select display properly");

          const gridSel = await page.$x(lg.gridSelect);
          await gridSel[0].click();
          await page.waitForTimeout(4000);

          const selectLi = await page.$x(lg.gridSelectLi);
          await selectLi[0].click();
          await page.waitForTimeout(4000);

          const gridTypeSelect = await page.waitForXPath(lg.gridTypeSelect, {
            visible: true,
            timeout: 2000,
          });

          if (gridTypeSelect != null) {
            logger.info("grid type select display properly");

            const gridTypeSel = await page.$x(lg.gridTypeSelect);
            await gridTypeSel[0].click();
            await page.waitForTimeout(4000);

            const selectLi = await page.$x(lg.gridTypeSelectLi);
            await selectLi[0].click();
            await page.waitForTimeout(8000);

            const dataTable = await page.$eval(lg.dataTable, (elem) => {
              return elem.style.display !== "none";
            });
            await page.waitForTimeout(2000);
            dataTable
              ? logger.info("data table display properly")
              : [
                  logger.error("data table not display properly"),
                  errors.push("data table not display properly"),
                ];
          } else {
            logger.error("grid type select not visible properly");
            errors.push("grid type select not visible properly");
          }
        } else {
          logger.error("grid select not display properly");
          errors.push("grid select not display properly");
        }
      } else {
        logger.error("labor grids heading verify failed");
        errors.push("labor grids heading verify failed");
      }
    } else {
      logger.error("labor grids title verify failed");
      errors.push("labor grids title verify failed");
    }

    ts.assert(
      errors.length == 0,
      `Error in Labor Grid Page: ${errors.join("\n")}`
    );
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsLaborGridTest();
