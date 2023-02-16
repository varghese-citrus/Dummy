import { testingAsserts as ts } from "../deps-test.ts";
import { getSitesToInspect } from "../sites.ts";
import { LaborWorkMiss as lw } from "../selectors/labor-work-mix.ts";
import { fixedopsCommonLogin } from "./common/fixedops-common-login.ts";
import { startLogger } from "../utilities/utils.ts";

const logger = startLogger();
const errors: string[] = [];

function fixedOpsLaborWorkMixTest() {
  getSitesToInspect().forEach((site) => {
    const metrics = site.metrics;
    Deno.test({
      name: `[AEC-FOCP-UI-FN-LD-0127] ${site.name} FixedOps Labor Work Mix Page Monthly Table Test`,
      fn: async () => {
        const execMetrics = metrics.assuranceCaseExec.instance({
          initOn: new Date(),
          txId: metrics.metricsTransactionId,
          caseID: "AEC-FOCP-UI-FN-LD-0127",
          host: Deno.hostname(),
          status: "pass",
          pageURL: site.baseURL,
        });
        try {
          await laborWorkMixPageMonthlyTableTest(site.baseURL);
        } catch (error) {
          execMetrics.labels.object.status = "fail";
          execMetrics.labels.object.statusMessage =
            "Error in FixedOps Labor Work Mix Page Monthly Table Test";
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

async function laborWorkMixPageMonthlyTableTest(baseURL: string) {
  let browser = null;

  try {
    const oBrowser = await fixedopsCommonLogin(baseURL);
    const page = oBrowser.page;
    browser = oBrowser.browser;
    const navigationPromise = oBrowser.navigationPromise;
    await page.reload();
    await navigationPromise;
    await page.waitForTimeout(10000);
    await page.waitForSelector(lw.labor);
    await page.click(lw.labor);
    await page.waitForTimeout(4000);
    logger.info("labor expand collapse link clicked!!!");
    const laborWrkMix = await page.$x(lw.laborWorkMixLink);
    await laborWrkMix[0].click();
    await navigationPromise;
    await page.waitForTimeout(15000);
    logger.info("labor work mix link clicked!!!");
    const title = await page.title();
    if (title == "Labor Work Mix") {
      logger.info("labor work miss title verify success");
      const monthlyTables = [
        lw.sales,
        lw.solidHours,
        lw.grossProfit,
        lw.elr,
        lw.jobCount,
        lw.workMix,
      ];
      const tables = [lw.workMixSalesTable_1, lw.workMixSalesTable_2];
      for (let i = 0; i <= monthlyTables.length - 1; i++) {
        await page.waitForSelector(monthlyTables[i]);
        await page.click(monthlyTables[i]);
        await navigationPromise;
        await page.waitForTimeout(15000);
        let element = await page.$(monthlyTables[i]);
        let tabName = await page.evaluate((el) => el.textContent, element);
        await page.waitForTimeout(4000);
        logger.info(`monthly table ${tabName} clicked`);
        for (let j = 0; j < tables.length; j++) {
          await page.waitForTimeout(4000);
          element = await page.$(monthlyTables[i]);
          tabName = await page.evaluate((el) => el.textContent, element);
          await page.waitForTimeout(4000);
          await page
            .waitForSelector(tables[j], {
              visible: true,
              timeout: 4000,
            })
            .then(() => {
              logger.info(
                `monthly table ${j + 1} display properly under ${tabName} tab`
              );
            })
            .catch(() => {
              logger.error(
                `monthly table ${
                  j + 1
                } display not properly under  ${tabName} tab`
              );
              errors.push(
                `monthly table ${
                  j + 1
                } display not properly under  ${tabName} tab`
              );
            });
        }
        await page.waitForTimeout(5000);
        for (let i = 1; i <= 3; i++) {
          const elements = ["competetive", "maintenance", "repair"];

          await page
            .waitForXPath(lw.contractedCls(i), {
              visible: true,
              timeout: 4000,
            })
            .then(async () => {
              let elm1 = await page.$x(lw.contractedCls(i));
              await elm1[0].click();
              await page.waitForTimeout(5000);

              const elm2 = await page.$x(lw.expandedCls);
              const cname1: string = await page.evaluate(
                (el) => el.className,
                elm2[0]
              );

              cname1.includes("ag-group-expanded")
                ? logger.info(`${elements[i - 1]} expanded properly`)
                : [
                    logger.error(`${elements[i - 1]} expanded properly`),
                    errors.push(`${elements[i - 1]} not expanded properly`),
                  ];

              await elm2[0].click();
              await page.waitForTimeout(5000);

              elm1 = await page.$x(lw.contractedCls(i));
              const cname2 = await page.evaluate((el) => el.className, elm1[0]);

              cname2.includes("ag-group-contracted")
                ? logger.info(`${elements[i - 1]} collapse properly`)
                : [
                    logger.error(`${elements[i - 1]} not collapse properly`),
                    errors.push(`${elements[i - 1]} not collapse properly`),
                  ];
            })
            .catch(() => {
              logger.warn(
                "competetive | maintenance | repair element not available"
              );
            });
          // try {
          //   let elm1 = await page.$x(lw.contractedCls(i));
          //   await elm1[0].click();
          //   await page.waitForTimeout(5000);

          //   const elm2 = await page.$x(lw.expandedCls);
          //   const cname1: string = await page.evaluate(
          //     (el) => el.className,
          //     elm2[0]
          //   );

          //   cname1.includes("ag-group-expanded")
          //     ? logger.info(`${elements[i - 1]} expanded properly`)
          //     : [
          //         logger.error(`${elements[i - 1]} expanded properly`),
          //         errors.push(`${elements[i - 1]} not expanded properly`),
          //       ];

          //   await elm2[0].click();
          //   await page.waitForTimeout(5000);

          //   elm1 = await page.$x(lw.contractedCls(i));
          //   const cname2 = await page.evaluate((el) => el.className, elm1[0]);

          //   cname2.includes("ag-group-contracted")
          //     ? logger.info(`${elements[i - 1]} collapse properly`)
          //     : [
          //         logger.error(`${elements[i - 1]} not collapse properly`),
          //         errors.push(`${elements[i - 1]} not collapse properly`),
          //       ];
          // } catch {
          //   logger.warn(
          //     "competetive | maintenance | repair element not available"
          //   );
          // }
        }
      }
      await page.waitForTimeout(4000);
      await page
        .waitForXPath(lw.rankingPerRow && lw.downloadIcon, {
          visible: true,
          timeout: 4000,
        })
        .then(() => {
          logger.info("ranking per row || download icon display properly");
        })
        .catch(() => {
          logger.error("ranking per row || download icon not display properly");
          errors.push("ranking per row || download icon not display properly");
        });
    } else {
      logger.info("labor work miss title verify failed");
      errors.push("labor work miss title verify failed");
    }
    ts.assert(
      errors.length == 0,
      `Error in Labor Workmix Page: ${errors.join("\n")}`
    );
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await browser?.close();
  }
}
fixedOpsLaborWorkMixTest();
