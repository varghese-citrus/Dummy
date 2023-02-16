import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { PartsMatrixSelectors as ps } from "../selectors/parts-matrix.ts";
import { getRandomNumberBetween, startLogger } from "../utilities/utils.ts";
import { fixedopsCommonLogin } from "./common/fixedops-common-login.ts";

const logger = startLogger();
const errors: string[] = [];

function fixedOpsPartsMatrixTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[AEC-FOCP-UI-FN-LD-0151] ${site.name} FixedOps Parts Matrix Page Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-UI-FN-LD-0151",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await partsMatrixTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Parts Matrix Page Test";
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

async function partsMatrixTest(baseURL: string) {
  let browser = null;

  try {
    const oBrowser = await fixedopsCommonLogin(baseURL);
    const page = oBrowser.page;
    browser = oBrowser.browser;
    const navigationPromise = oBrowser.navigationPromise;
    await navigationPromise;
    await page.waitForTimeout(12000);
    await page.waitForSelector(ps.referenceAndSetupLink);
    await page.click(ps.referenceAndSetupLink);
    logger.info("reference/setups expand collapse link clicked");
    await page.waitForTimeout(4000);
    await page.waitForSelector(ps.partsMatrixLink);
    await page.click(ps.partsMatrixLink);
    await navigationPromise;
    await page.waitForTimeout(12000);
    logger.info("parts matrix link clicked");
    const title = await page.title();
    if (title == "Parts Matrix(s)") {
      logger.info("parts matrix title verify success");
      await page.waitForTimeout(2000);
      const heading = await page.$x(ps.partsMatrixHeading);
      const pageHeading = await (
        await heading[0].getProperty("textContent")
      ).jsonValue();
      await page.waitForTimeout(2000);
      if (pageHeading == "Parts Matrix(s)") {
        logger.info("parts matrix heading verify success");
        await page
          .waitForXPath(ps.matrixInstallDate, { visible: true, timeout: 2000 })
          .then(() => {
            logger.info("matrix install date field visible properly");
          })
          .catch(() => {
            logger.warn(
              "matrix install date field not visible as there is no data in the table"
            );
          });
        await page.waitForTimeout(2000);
        await page
          .waitForSelector(ps.resetBtn, {
            visible: true,
            timeout: 4000,
          })
          .then(() => {
            logger.info("reset button display properly");
          })
          .catch(() => {
            logger.error("reset button not display properly");
            errors.push("reset button not display properly");
          });
        await page.waitForTimeout(2000);
        const matrixPeriodSelect = await page.waitForXPath(
          ps.matrixPeriodSelect,
          {
            visible: true,
            timeout: 2000,
          }
        );
        await page.waitForTimeout(2000);
        if (matrixPeriodSelect != null) {
          logger.info("matrix period select display properly");
          const matrixPeriodSel = await page.$x(ps.matrixPeriodSelect);
          await matrixPeriodSel[0].click();
          await page.waitForTimeout(4000);
          const matrixPeriodSelectLi = await page.$x(ps.matrixPeriodSelectLi);
          await matrixPeriodSelectLi[0].click();
          await page.waitForTimeout(4000);
          const alertMsg =
            "No data found for the selected Matrix Period , Matrix Type and Parts Source combination";
          await page
            .waitForXPath(ps.noData)
            .then(async () => {
              const xpath = await page.$x(ps.noData);
              const noData: string = await (
                await xpath[0].getProperty("textContent")
              ).jsonValue();

              if (noData.includes(alertMsg) == true) {
                logger.warn("data not present in the table");
              }
            })
            .catch(async () => {
              logger.info("data is already present in the table");
              const matrixSelect = await page.waitForXPath(ps.matrixSelect, {
                visible: true,
                timeout: 2000,
              });
              await page.waitForTimeout(2000);
              if (matrixSelect != null) {
                logger.info("matrix select display properly");
                const matrixSelect = await page.$x(ps.matrixSelect);
                await matrixSelect[0].click();
                await page.waitForTimeout(4000);
                const matrixSelectLi = await page.$x(ps.matrixSelectLi);
                await matrixSelectLi[0].click();
                await page.waitForTimeout(4000);
                const sourceSelect = await page.waitForXPath(ps.sourceSelect, {
                  visible: true,
                  timeout: 2000,
                });
                await page.waitForTimeout(2000);
                if (sourceSelect != null) {
                  logger.info("source select display properly");
                  const sourceSel = await page.$x(ps.sourceSelect);
                  await sourceSel[0].click();
                  await page.waitForTimeout(4000);
                  const li = await page.$x(ps.sourceSelectLiCount);
                  const num = await getRandomNumberBetween(1, li.length);
                  const selectLi = await page.$x(ps.sourceSelectLi(num));
                  await selectLi[0].click();
                  await page.waitForTimeout(8000);
                  await page
                    .waitForSelector(ps.dataTable, {
                      visible: true,
                      timeout: 4000,
                    })
                    .then(() => {
                      logger.info("data table display properly");
                    })
                    .catch(() => {
                      logger.error("data table not display properly");
                      errors.push("data table not display properly");
                    });
                  await page.waitForTimeout(2000);
                } else {
                  logger.error("source select not display properly");
                  errors.push("source select not display properly");
                }
              } else {
                logger.error("matrix select not display properly");
                errors.push("matrix select not display properly");
              }
            });
        } else {
          logger.error("matrix period select not visible");
          errors.push("matrix period select not visible");
        }
      } else {
        logger.error("parts matrix heading verify failed");
        errors.push("parts matrix heading verify failed");
      }
    } else {
      logger.error("parts matrix title verify failed");
      errors.push("parts matrix title verify failed");
    }

    ts.assert(
      errors.length == 0,
      `Error in Parts Matrix Page: ${errors.join("\n")}`
    );
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsPartsMatrixTest();
