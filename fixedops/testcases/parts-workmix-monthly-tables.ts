import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { fixedopsCommonLogin } from "./common/fixedops-common-login.ts";
import { PartsWorkmixSelectors as pw } from "../selectors/parts-work-mix.ts";
import { startLogger } from "../utilities/utils.ts";

const logger = startLogger();
const errors: string[] = [];

function fixedOpsPartsWorkmixTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[AEC-FOCP-UI-FN-LD-0197] ${site.name} FixedOps Parts Workmix Monthly Table Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "[AEC-FOCP-UI-FN-LD-0197]",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await partsWorkmixMonthlyTableCheck(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Parts Workmix Monthly Table Test";
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

async function partsWorkmixMonthlyTableCheck(baseURL: string) {
  let browser = null;
  try {
    const oBrowser = await fixedopsCommonLogin(baseURL);
    const page = oBrowser.page;
    browser = oBrowser.browser;
    const navigationPromise = oBrowser.navigationPromise;
    await page.waitForSelector(pw.partsMenu);
    await page.click(pw.partsMenu);
    logger.info("Parts menu clicked");
    await page.waitForTimeout(5000);
    const partsWrkMixMenu = await page.$x(pw.partsWorkmixMenu);
    await partsWrkMixMenu[0].click();
    logger.info("Parts workmix menu clicked");
    await navigationPromise;
    await page.waitForTimeout(15000);
    const title = await page.title();
    if (title == "Parts Work Mix") {
      logger.info("Page title verified success");
      const monthlyTables = [
        pw.sales,
        pw.cost,
        pw.grossProfit,
        pw.markUp,
        pw.jobCount,
        pw.workMix,
      ];
      const tables = [pw.monthlyTable_1, pw.monthlyTable_2];
      for (let i = 0; i <= monthlyTables.length - 1; i++) {
        await page.waitForSelector(monthlyTables[i]);
        await page.click(monthlyTables[i]);
        await navigationPromise;
        await page.waitForTimeout(20000);
        let element = await page.$(monthlyTables[i]);
        let tabName = await page.evaluate((el) => el.textContent, element);
        await page.waitForTimeout(4000);
        logger.info(`Clicked on monthly table ${tabName}`);
        for (let j = 0; j <= tables.length - 1; j++) {
          await page.waitForTimeout(5000);
          await page
            .$eval(tables[j], (elem) => {
              return elem.style.display !== "none";
            })
            .then(() => {
              logger.info(
                `Monthly table ${j + 1} displayed properly under ${tabName}`
              );
            })
            .catch(() => {
              logger.error(
                `Monthly table ${j + 1} not displayed properly under ${tabName}`
              );
              errors.push(
                `Monthly table ${j + 1} not displayed properly under ${tabName}`
              );
            });
          element = await page.$(monthlyTables[i]);
          tabName = await page.evaluate((el) => el.textContent, element);
          await page.waitForTimeout(5000);
        }
        await page.waitForTimeout(5000);
        for (let i = 1; i <= 3; i++) {
          const elements = ["competitive", "maintenance", "repair"];
          try {
            let elem_1 = await page.$x(pw.contractedCls(i));
            await elem_1[0].click();
            await page.waitForTimeout(5000);
            const elem_2 = await page.$x(pw.expandedCls);
            const cName_1: string = await page.evaluate(
              (el) => el.className,
              elem_2[0]
            );
            cName_1.includes("ag-group-expanded")
              ? logger.info(`${elements[i - 1]} expanded properly`)
              : [
                  logger.error(`${elements[i - 1]} expanded properly`),
                  errors.push(`${elements[i - 1]} not expanded properly`),
                ];
            await elem_2[0].click();
            await page.waitForTimeout(5000);
            elem_1 = await page.$x(pw.contractedCls(i));
            const cName_2 = await page.evaluate(
              (el) => el.className,
              elem_1[0]
            );
            cName_2.includes("ag-group-contracted")
              ? logger.info(`${elements[i - 1]} collapse properly`)
              : [
                  logger.error(`${elements[i - 1]} not collapse properly`),
                  errors.push(`${elements[i - 1]} not collapse properly`),
                ];
          } catch {
            logger.warn(
              "competitive | maintenance | repair element not available"
            );
          }
        }
      }
      await page.waitForTimeout(5000);
      await page
        .waitForXPath(pw.rankingPerRO && pw.downloadIcon, {
          visible: true,
          timeout: 4000,
        })
        .then(() => {
          logger.info("Ranking per RO || Download icon display properly");
        })
        .catch(() => {
          logger.error("Ranking per RO || Download Icon not display properly");
          errors.push("Ranking per RO || Download Icon not display properly");
        });
    } else {
      logger.info("labor work miss title verify failed");
      errors.push("labor work miss title verify failed");
    }
    ts.assert(
      errors.length == 0,
      `Error in  Parts Workmix: ${errors.join("\n")}`
    );
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsPartsWorkmixTest();
